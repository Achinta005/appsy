import { useState, useEffect, useRef, useCallback } from 'react';

// Configuration for each data source
const DATA_SOURCES = {
  users: {
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/users/count`,
    method: 'fetch', // 'fetch' or 'sse'
    pollInterval: 30000, // milliseconds (null = no polling)
    transform: (data) => data, // Transform response
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
    endpoint: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/track/visits/count`,
    method: 'fetch',
    pollInterval: 60000,
    transform: (data) => data,
  },
  serviceHealth: {
    endpoint: '/api/health/status',
    method: 'sse', // Real-time SSE
    transform: (data) => data.status,
  },
  // Add new data sources here easily:
  // newMetric: {
  //   endpoint: '/api/new-metric',
  //   method: 'fetch',
  //   pollInterval: 30000,
  //   transform: (data) => data.value,
  // },
};

export function useDashboardData() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const eventSourcesRef = useRef({});
  const pollIntervalsRef = useRef({});

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
    //   console.log(result)
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
    // Close existing connection if any
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
      
      // Retry connection after 5 seconds
      setTimeout(() => setupSSE(key, config), 5000);
    };

    eventSourcesRef.current[key] = eventSource;
  }, []);

  // Initialize all data sources
  useEffect(() => {
    // Fetch all data sources in parallel
    const fetchPromises = Object.entries(DATA_SOURCES).map(([key, config]) => {
      if (config.method === 'fetch') {
        return fetchData(key, config);
      } else if (config.method === 'sse') {
        setupSSE(key, config);
        return Promise.resolve();
      }
    });

    // Wait for initial fetch to complete
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

    // Cleanup function
    return () => {
      // Clear all polling intervals
      Object.values(pollIntervalsRef.current).forEach(interval => {
        clearInterval(interval);
      });

      // Close all SSE connections
      Object.values(eventSourcesRef.current).forEach(eventSource => {
        eventSource.close();
      });
    };
  }, [fetchData, setupSSE]);

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
  }, [fetchData]);

  return {
    data,
    loading,
    errors,
    refresh,
    refreshAll,
    isLoading: Object.values(loading).some(Boolean),
    hasErrors: Object.values(errors).some(Boolean),
  };
}