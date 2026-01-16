import { useState, useEffect, useRef, useCallback } from "react";

export function useActivityStream() {
  const [activities, setActivities] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const eventSourceRef = useRef(null);
  const lastEventIdRef = useRef(null);

  // Fetch initial activities on mount
  const fetchInitialActivities = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/recent?limit=50`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch initial activities");
      }

      const data = await response.json();
      
      // Ensure activities are sorted by timestamp (newest first)
      const sortedActivities = data.activities.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setActivities(sortedActivities);
      
      // Set last event ID from the most recent activity
      if (sortedActivities.length > 0) {
        lastEventIdRef.current = sortedActivities[0].id;
      }
      
      setIsInitialLoad(false);
    } catch (err) {
      console.error("Error fetching initial activities:", err);
      setError("Failed to load activities");
      setIsInitialLoad(false);
    }
  }, []);

  const connect = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = new URL(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/stream`
    );

    // Add last event ID for reconnection
    if (lastEventIdRef.current) {
      url.searchParams.append("lastEventId", lastEventIdRef.current);
    }

    const eventSource = new EventSource(url.toString());

    eventSource.onopen = () => {
      console.log("Activity stream connected");
      setIsConnected(true);
      setError(null);
    };

    eventSource.addEventListener("activity", (event) => {
      try {
        const activity = JSON.parse(event.data);
        lastEventIdRef.current = activity.id;

        setActivities((prev) => {
          // Prevent duplicates
          if (prev.some((a) => a.id === activity.id)) {
            return prev;
          }
          
          // Add new activity at the beginning (newest first)
          const updated = [activity, ...prev];
          
          // Sort by timestamp to ensure correct order (newest first)
          const sorted = updated.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
          );
          
          // Keep only last 50 activities
          return sorted.slice(0, 50);
        });
      } catch (err) {
        console.error("Error parsing activity:", err);
      }
    });

    eventSource.addEventListener("heartbeat", () => {
      // Keep connection alive
      console.log("Heartbeat received");
    });

    eventSource.onerror = (err) => {
      console.error("Activity stream error:", err);
      setIsConnected(false);
      setError("Connection lost. Reconnecting...");
      eventSource.close();

      // Retry after 5 seconds
      setTimeout(() => {
        connect();
      }, 5000);
    };

    eventSourceRef.current = eventSource;
  }, []);

  // Initial setup: fetch activities then connect to stream
  useEffect(() => {
    fetchInitialActivities().then(() => {
      connect();
    });

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connect, fetchInitialActivities]);

  // Manual refresh via REST
  const refresh = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/recent?limit=50`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();
      
      // Sort activities by timestamp (newest first)
      const sortedActivities = data.activities.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      setActivities(sortedActivities);
      
      // Update last event ID
      if (sortedActivities.length > 0) {
        lastEventIdRef.current = sortedActivities[0].id;
      }
    } catch (err) {
      console.error("Error refreshing activities:", err);
      setError("Failed to refresh activities");
    }
  }, []);

  return {
    activities,
    isConnected,
    error,
    refresh,
    reconnect: connect,
    isLoading: isInitialLoad,
  };
}