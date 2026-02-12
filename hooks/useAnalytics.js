import { useState, useEffect, useCallback } from "react";
import useApi from "@/services/authservices";

export const useAnalytics = (days = 30) => {
  const [data, setData] = useState({
    dashboardMetrics: null,
    userStatistics: null,
    userGrowth: [],
    loginAnalytics: [],
    securityEvents: [],
    suspiciousIPs: [],
  });

  const [loading, setLoading] = useState({
    dashboardMetrics: true,
    userStatistics: true,
    userGrowth: true,
    loginAnalytics: true,
    securityEvents: true,
    suspiciousIPs: true,
  });

  const [errors, setErrors] = useState({
    dashboardMetrics: null,
    userStatistics: null,
    userGrowth: null,
    loginAnalytics: null,
    securityEvents: null,
    suspiciousIPs: null,
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const apiFetch = useApi();

  const fetchWithAuth = async (endpoint) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  };

  const fetchDashboardMetrics = useCallback(async () => {
    setLoading((prev) => ({ ...prev, dashboardMetrics: true }));
    setErrors((prev) => ({ ...prev, dashboardMetrics: null }));

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/analytics/dashboard?days=${days}`,
      );
      const metrics = await res.json();
      setData((prev) => ({ ...prev, dashboardMetrics: metrics.data }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, dashboardMetrics: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, dashboardMetrics: false }));
    }
  }, [days]);

  const fetchUserStatistics = useCallback(async () => {
    setLoading((prev) => ({ ...prev, userStatistics: true }));
    setErrors((prev) => ({ ...prev, userStatistics: null }));

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/analytics/user-statistics`,
      );
      const stats = await res.json();
      setData((prev) => ({ ...prev, userStatistics: stats.data }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, userStatistics: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, userStatistics: false }));
    }
  }, []);

  const fetchUserGrowth = useCallback(async () => {
    setLoading((prev) => ({ ...prev, userGrowth: true }));
    setErrors((prev) => ({ ...prev, userGrowth: null }));

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/analytics/user-growth?days=${days}`,
      );
      const growth = await res.json();
      setData((prev) => ({ ...prev, userGrowth: growth.data }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, userGrowth: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, userGrowth: false }));
    }
  }, [days]);

  const fetchLoginAnalytics = useCallback(async () => {
    setLoading((prev) => ({ ...prev, loginAnalytics: true }));
    setErrors((prev) => ({ ...prev, loginAnalytics: null }));

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/analytics/login-analytics?days=${days}`,
      );
      const analytics = await res.json();
      setData((prev) => ({ ...prev, loginAnalytics: analytics.data }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, loginAnalytics: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, loginAnalytics: false }));
    }
  }, [days]);

  const fetchSecurityEvents = useCallback(async () => {
    setLoading((prev) => ({ ...prev, securityEvents: true }));
    setErrors((prev) => ({ ...prev, securityEvents: null }));

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/analytics/security-events`,
      );
      const events = await res.json();
      setData((prev) => ({ ...prev, securityEvents: events.data }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, securityEvents: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, securityEvents: false }));
    }
  }, []);

  const fetchSuspiciousIPs = useCallback(async () => {
    setLoading((prev) => ({ ...prev, suspiciousIPs: true }));
    setErrors((prev) => ({ ...prev, suspiciousIPs: null }));

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/analytics/suspicious-ips?threshold=5&timeWindow=3600000`,
      );
      const ips = await res.json();
      setData((prev) => ({ ...prev, suspiciousIPs: ips.data }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, suspiciousIPs: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, suspiciousIPs: false }));
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      fetchDashboardMetrics(),
      fetchUserStatistics(),
      fetchUserGrowth(),
      fetchLoginAnalytics(),
      fetchSecurityEvents(),
      fetchSuspiciousIPs(),
    ]);
  }, [
    fetchDashboardMetrics,
    fetchUserStatistics,
    fetchUserGrowth,
    fetchLoginAnalytics,
    fetchSecurityEvents,
    fetchSuspiciousIPs,
  ]);

  useEffect(() => {
    refreshAll();
  }, [days]);

  return {
    data,
    loading,
    errors,
    refreshAll,
    isLoading: Object.values(loading).some(Boolean),
  };
};
