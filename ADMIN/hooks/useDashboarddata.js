import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/app/(protected)/context/authContext";
import useApi from "@/services/authservices";

// Service configuration for health checks
const HEALTH_SERVICES = [
  {
    id: "service1",
    name: "Main Server",
    healthUrl: process.env.NEXT_PUBLIC_SERVICE1_HEALTH,
    type: "NestJS",
  },
  {
    id: "service2",
    name: "Auth Micro Service",
    healthUrl: process.env.NEXT_PUBLIC_SERVICE2_HEALTH,
    type: "MicroService",
  },
  {
    id: "service3",
    name: "Link Micro Service",
    healthUrl: process.env.NEXT_PUBLIC_SERVICE4_HEALTH,
    type: "MicroService",
  },
  {
    id: "service4",
    name: "ML Backend",
    healthUrl: process.env.NEXT_PUBLIC_SERVICE3_HEALTH,
    type: "FastAPI",
  },
  {
    id: "service5",
    name: "Log Service",
    healthUrl: process.env.NEXT_PUBLIC_SERVICE5_HEALTH,
    type: "MicroService",
  },
];

const FIVE_MINUTES = 5 * 60 * 1000;
const DATA_SOURCES = {
  users: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/users/count`,
    method: "fetch",
    pollInterval: FIVE_MINUTES,
    transform: (res) => res?.data?.pagination?.total ?? 0,
  },
  projects: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/count`,
    method: "fetch",
    pollInterval: FIVE_MINUTES,
    transform: (data) => data,
  },
  blogPosts: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/blogs/count`,
    method: "fetch",
    pollInterval: FIVE_MINUTES,
    transform: (data) => data,
  },
  messages: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/contact/count`,
    method: "fetch",
    pollInterval: FIVE_MINUTES,
    transform: (data) => data,
  },
  weeklyVisits: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/track/visits/count/stream`,
    method: "sse",
    transform: (data) => data.count,
  },
  allVisits: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/track/visits/stream`,
    method: "sse",
    transform: (data) => data.visits,
  },
  activities: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/stream`,
    method: "sse",
    transform: (data) => data,
  },
};

export function useDashboardData() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [serviceHealth, setServiceHealth] = useState({});
  const [checkingServices, setCheckingServices] = useState({});
  const eventSourcesRef = useRef({});
  const pollIntervalsRef = useRef({});
  const { isAuthenticated } = useAuth();
  const apiFetch = useApi();

  // Check health of a single service (NO AUTH HEADER)
  const checkServiceHealth = useCallback(async (service) => {
    setCheckingServices((prev) => ({ ...prev, [service.id]: true }));

    // ✅ start timer before fetch so duration is always accurate
    const t0 = Date.now();

    try {
      const res = await fetch(service.healthUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const duration = Date.now() - t0; // ✅ capture after fetch completes

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setServiceHealth((prev) => ({
        ...prev,
        [service.id]: {
          status: "operational",
          name: service.name,
          type: service.type,
          duration, // ✅ stored in state
          lastCheck: new Date().toISOString(),
        },
      }));

      return true;
    } catch (err) {
      const duration = Date.now() - t0; // ✅ capture even on failure

      setServiceHealth((prev) => ({
        ...prev,
        [service.id]: {
          status: "down",
          name: service.name,
          type: service.type,
          duration, // ✅ stored even on failure
          lastCheck: new Date().toISOString(),
          error: err.message,
        },
      }));
      return false;
    } finally {
      setCheckingServices((prev) => ({ ...prev, [service.id]: false }));
    }
  }, []);

  // Check all services
  const checkAllServices = useCallback(async () => {
    const results = await Promise.all(
      HEALTH_SERVICES.map((service) => checkServiceHealth(service)),
    );
    return results;
  }, [checkServiceHealth]);

  // Get overall service health status
  const getOverallHealth = useCallback(() => {
    const statuses = Object.values(serviceHealth).map((s) => s.status);
    if (statuses.length === 0) return "unknown";
    if (statuses.every((s) => s === "operational")) return "operational";
    if (statuses.some((s) => s === "down")) return "degraded";
    return "operational";
  }, [serviceHealth]);

  // Fetch data from a single endpoint (WITH apiFetch for auto token refresh)
  const fetchData = useCallback(
    async (key, config) => {
      try {
        setLoading((prev) => ({ ...prev, [key]: true }));
        setErrors((prev) => ({ ...prev, [key]: null }));

        const response = await apiFetch(config.endpoint, {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Failed to fetch ${key}`);

        const result = await response.json();
        const transformedData = config.transform
          ? config.transform(result)
          : result;

        setData((prev) => ({ ...prev, [key]: transformedData }));
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        setErrors((prev) => ({ ...prev, [key]: error.message }));
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [apiFetch],
  );

  // Setup SSE connection for real-time data
  const setupSSE = useCallback((key, config) => {
    if (eventSourcesRef.current[key]) {
      eventSourcesRef.current[key].close();
    }

    const eventSource = new EventSource(config.endpoint);

    eventSource.onmessage = (event) => {
      try {
        const result = JSON.parse(event.data);
        const transformedData = config.transform
          ? config.transform(result)
          : result;
        setData((prev) => ({ ...prev, [key]: transformedData }));
        setErrors((prev) => ({ ...prev, [key]: null }));
      } catch (error) {
        console.error(`Error parsing SSE data for ${key}:`, error);
        setErrors((prev) => ({ ...prev, [key]: error.message }));
      }
    };

    eventSource.onerror = (error) => {
      console.error(`SSE error for ${key}:`, error);
      setErrors((prev) => ({ ...prev, [key]: "Connection error" }));
      eventSource.close();
      setTimeout(() => setupSSE(key, config), 5000);
    };

    eventSourcesRef.current[key] = eventSource;
  }, []);

  // Initialize health checks + polling
  useEffect(() => {
    checkAllServices();
    const healthCheckInterval = setInterval(checkAllServices, 120000);
    return () => clearInterval(healthCheckInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Authenticated data fetching
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPromises = Object.entries(DATA_SOURCES).map(([key, config]) => {
      if (config.method === "fetch") return fetchData(key, config);
      if (config.method === "sse") {
        setupSSE(key, config);
        return Promise.resolve();
      }
    });

    Promise.all(fetchPromises).then(() => {
      console.log("Initial data fetch completed");
    });

    Object.entries(DATA_SOURCES).forEach(([key, config]) => {
      if (config.method === "fetch" && config.pollInterval) {
        pollIntervalsRef.current[key] = setInterval(
          () => fetchData(key, config),
          config.pollInterval,
        );
      }
    });

    return () => {
      Object.values(pollIntervalsRef.current).forEach(clearInterval);
      Object.values(eventSourcesRef.current).forEach((es) => es.close());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Manual refresh for a single key
  const refresh = useCallback(
    (key) => {
      const config = DATA_SOURCES[key];
      if (config?.method === "fetch") fetchData(key, config);
    },
    [fetchData],
  );

  // Refresh all fetch-based sources + health
  const refreshAll = useCallback(() => {
    Object.entries(DATA_SOURCES).forEach(([key, config]) => {
      if (config.method === "fetch") fetchData(key, config);
    });
    checkAllServices();
  }, [fetchData, checkAllServices]);

  return {
    data: {
      ...data,
      overallHealth: getOverallHealth(), // ✅ renamed from serviceHealth to avoid confusion
    },
    loading: {
      ...loading,
      serviceHealth: Object.values(checkingServices).some(Boolean),
    },
    errors,
    serviceHealth, // per-service map { id: { status, name, type, duration, lastCheck } }
    checkingServices,
    refresh,
    refreshAll,
    checkServiceHealth,
    checkAllServices,
    isLoading:
      Object.values(loading).some(Boolean) ||
      Object.values(checkingServices).some(Boolean),
    hasErrors: Object.values(errors).some(Boolean),
  };
}
