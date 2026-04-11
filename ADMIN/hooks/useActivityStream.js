import { useState, useEffect, useRef, useCallback } from "react";

export function useActivityStream() {
  const [activities, setActivities] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const eventSourceRef = useRef(null);
  const lastEventIdRef = useRef(null);
  const retryTimerRef = useRef(null); // ← track retry timer for cleanup
  const isMountedRef = useRef(true); // ← guard state updates after unmount

  // ── helpers ──────────────────────────────────────────────────────────────
  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const closeEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  // ── SSE connect ───────────────────────────────────────────────────────────
  // Not wrapped in useCallback — defined fresh each render so the onerror
  // closure always captures the latest connect reference.
  const connect = useCallback(() => {
    clearRetryTimer();
    closeEventSource();

    const url = new URL(
      `${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/stream`,
    );

    if (lastEventIdRef.current) {
      url.searchParams.append("lastEventId", lastEventIdRef.current);
    }

    const es = new EventSource(url.toString());
    eventSourceRef.current = es;

    es.onopen = () => {
      if (!isMountedRef.current) return;
      setIsConnected(true);
      setError(null);
    };

    es.addEventListener("activity", (event) => {
      if (!isMountedRef.current) return;
      try {
        const activity = JSON.parse(event.data);
        lastEventIdRef.current = activity.id;

        setActivities((prev) => {
          const isDuplicate = prev.some(
            (a) =>
              a.id === activity.id ||
              (a.timestamp === activity.timestamp &&
                a.action === activity.action),
          );
          if (isDuplicate) return prev;

          const updated = [activity, ...prev];
          return updated
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 50);
        });
      } catch (err) {
        console.error("Error parsing activity:", err);
      }
    });

    es.addEventListener("heartbeat", () => {
      // keep-alive — no-op
    });

    es.onerror = () => {
      if (!isMountedRef.current) return;
      setIsConnected(false);
      setError("Connection lost. Reconnecting...");
      closeEventSource();

      // ← schedule retry; cleared on unmount
      retryTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) connect();
      }, 5000);
    };
  }, []); // safe — no captured state, only refs and stable setters

  // ── initial fetch ─────────────────────────────────────────────────────────
  const fetchInitialActivities = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/recent?limit=50`,
      );
      if (!response.ok) throw new Error("Failed to fetch initial activities");

      const data = await response.json();
      const sorted = [...data.activities].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );

      if (!isMountedRef.current) return;
      setActivities(sorted);
      if (sorted.length > 0) lastEventIdRef.current = sorted[0].id;
    } catch (err) {
      console.error("Error fetching initial activities:", err);
      if (!isMountedRef.current) return;
      setError("Failed to load activities");
    } finally {
      if (isMountedRef.current) setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // ← Run both in parallel. Don't wait for fetch before connecting.
    fetchInitialActivities();
    connect();

    return () => {
      isMountedRef.current = false;
      clearRetryTimer();
      closeEventSource();
    };
  }, []);

  // ── manual refresh ────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/recent?limit=50`,
      );
      if (!response.ok) throw new Error("Failed to fetch activities");

      const data = await response.json();
      const sorted = [...data.activities].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );

      if (!isMountedRef.current) return;
      setActivities(sorted);
      if (sorted.length > 0) lastEventIdRef.current = sorted[0].id;
    } catch (err) {
      console.error("Error refreshing activities:", err);
      if (!isMountedRef.current) return;
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
