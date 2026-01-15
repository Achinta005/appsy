import { useState, useEffect, useRef, useCallback } from "react";

export function useActivityStream() {
  const [activities, setActivities] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const eventSourceRef = useRef(null);
  const lastEventIdRef = useRef(null);

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
          // Keep only last 50 activities
          return [activity, ...prev].slice(0, 50);
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

  // Initial connection
  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connect]);

  // Manual refresh via REST
  const refresh = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/recent?limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();
      setActivities(data.activities);
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
  };
}
