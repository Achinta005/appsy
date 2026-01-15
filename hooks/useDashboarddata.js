import { useState, useEffect, useRef, useCallback } from 'react';

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
    name: "ML Backend",
    healthUrl: process.env.NEXT_PUBLIC_SERVICE3_HEALTH,
    type: "FastAPI",
  },
];

// Configuration for each data source
const DATA_SOURCES = {
  users: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/users/count`,
    method: 'fetch',
    pollInterval: 30000,
    transform: (data) => data,
  },
  projects: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/projects/count`,
    method: 'fetch',
    pollInterval: 30000,
    transform: (data) => data,
  },
  blogPosts: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/admin/blogs/count`,
    method: 'fetch',
    pollInterval: 30000,
    transform: (data) => data,
  },
  messages: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/contact/contacts/count`,
    method: 'fetch',
    pollInterval: 30000,
    transform: (data) => data,
  },
  weeklyVisits: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/track/visits/count/stream`,
    method: 'sse',
    transform: (data) => data.count,
  },
  allVisits: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/track/visits/stream`,
    method: 'sse',
    transform: (data) => data.visits,
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

  // Check health of a single service
  const checkServiceHealth = useCallback(async (service) => {
    setCheckingServices((prev) => ({ ...prev, [service.id]: true }));
    try {
      const res = await fetch(service.healthUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) throw new Error("Health check failed");
      
      setServiceHealth((prev) => ({
        ...prev,
        [service.id]: {
          status: 'operational',
          name: service.name,
          type: service.type,
          lastCheck: new Date().toISOString(),
        },
      }));
      
      return true;
    } catch (err) {
      setServiceHealth((prev) => ({
        ...prev,
        [service.id]: {
          status: 'down',
          name: service.name,
          type: service.type,
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
      HEALTH_SERVICES.map((service) => checkServiceHealth(service))
    );
    return results;
  }, [checkServiceHealth]);

  // Get overall service health status
  const getOverallHealth = useCallback(() => {
    const statuses = Object.values(serviceHealth).map(s => s.status);
    
    if (statuses.length === 0) return 'unknown';
    if (statuses.every(s => s === 'operational')) return 'operational';
    if (statuses.some(s => s === 'down')) return 'degraded';
    
    return 'operational';
  }, [serviceHealth]);

  // Fetch data from a single endpoint
  const fetchData = useCallback(async (key, config) => {
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      setErrors(prev => ({ ...prev, [key]: null }));

      const response = await fetch(config.endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${key}`);
      }

      const result = await response.json();
      const transformedData = config.transform ? config.transform(result) : result;

      setData(prev => ({ ...prev, [key]: transformedData }));
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      setErrors(prev => ({ ...prev, [key]: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  // Setup SSE connection for real-time data
  const setupSSE = useCallback((key, config) => {
    if (eventSourcesRef.current[key]) {
      eventSourcesRef.current[key].close();
    }

    const eventSource = new EventSource(config.endpoint);

    eventSource.onmessage = (event) => {
      try {
        const result = JSON.parse(event.data);
        const transformedData = config.transform ? config.transform(result) : result;
        setData(prev => ({ ...prev, [key]: transformedData }));
        setErrors(prev => ({ ...prev, [key]: null }));
      } catch (error) {
        console.error(`Error parsing SSE data for ${key}:`, error);
        setErrors(prev => ({ ...prev, [key]: error.message }));
      }
    };

    eventSource.onerror = (error) => {
      console.error(`SSE error for ${key}:`, error);
      setErrors(prev => ({ ...prev, [key]: 'Connection error' }));
      eventSource.close();
      
      setTimeout(() => setupSSE(key, config), 5000);
    };

    eventSourcesRef.current[key] = eventSource;
  }, []);

  // Initialize all data sources and health checks
  useEffect(() => {
    // Initial health check
    checkAllServices();

    // Fetch all data sources in parallel
    const fetchPromises = Object.entries(DATA_SOURCES).map(([key, config]) => {
      if (config.method === 'fetch') {
        return fetchData(key, config);
      } else if (config.method === 'sse') {
        setupSSE(key, config);
        return Promise.resolve();
      }
    });

    Promise.all(fetchPromises).then(() => {
      console.log('Initial data fetch completed');
    });

    // Setup polling for fetch-based sources
    Object.entries(DATA_SOURCES).forEach(([key, config]) => {
      if (config.method === 'fetch' && config.pollInterval) {
        pollIntervalsRef.current[key] = setInterval(() => {
          fetchData(key, config);
        }, config.pollInterval);
      }
    });

    // Setup health check polling (every 2 minutes)
    const healthCheckInterval = setInterval(() => {
      checkAllServices();
    }, 120000);

    // Cleanup function
    return () => {
      clearInterval(healthCheckInterval);
      
      Object.values(pollIntervalsRef.current).forEach(interval => {
        clearInterval(interval);
      });

      Object.values(eventSourcesRef.current).forEach(eventSource => {
        eventSource.close();
      });
    };
  }, [fetchData, setupSSE, checkAllServices]);

  // Manual refresh function
  const refresh = useCallback((key) => {
    const config = DATA_SOURCES[key];
    if (config && config.method === 'fetch') {
      fetchData(key, config);
    }
  }, [fetchData]);

  // Refresh all fetch-based sources
  const refreshAll = useCallback(() => {
    Object.entries(DATA_SOURCES).forEach(([key, config]) => {
      if (config.method === 'fetch') {
        fetchData(key, config);
      }
    });
    checkAllServices();
  }, [fetchData, checkAllServices]);

  return {
    data: {
      ...data,
      serviceHealth: getOverallHealth(),
    },
    loading: {
      ...loading,
      serviceHealth: Object.values(checkingServices).some(Boolean),
    },
    errors,
    serviceHealth,
    checkingServices,
    refresh,
    refreshAll,
    checkServiceHealth,
    checkAllServices,
    isLoading: Object.values(loading).some(Boolean) || Object.values(checkingServices).some(Boolean),
    hasErrors: Object.values(errors).some(Boolean),
  };
}