"use client";

import { useAuth } from "@/app/context/authContext";

export default function useApi() {
  const {
    accessToken,
    setAccessToken,
    setIsAuthenticated,
  } = useAuth();

  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
      credentials: "include",
    });

    // 🔐 Access token expired
    if (res.status === 401) {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        setAccessToken(null);
        setIsAuthenticated(false);
        throw new Error("Session expired");
      }

      const refreshData = await refreshRes.json();

      setAccessToken(refreshData.accessToken);
      setIsAuthenticated(true);

      // 🔁 Retry original request
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
        credentials: "include",
      });
    }

    return res;
  };

  return apiFetch;
}
