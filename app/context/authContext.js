"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 🔄 Auto refresh on page load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch(
          `/api/auth/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
          setIsAuthenticated(true);
        } else {
          setAccessToken(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setAccessToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        isAuthenticated,
        setIsAuthenticated,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
