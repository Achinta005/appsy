"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 🔄 Auto refresh on page load
  useEffect(() => {
    const restoreSession = async () => {
      try {
        console.log("🔄 Restoring session...");

        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        console.log("📥 Refresh response status:", res.status);

        if (!res.ok) {
          throw new Error("Refresh failed");
        }

        const data = await res.json();
        console.log("✅ Session restored");

        setAccessToken(data.accessToken);
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("❌ Session restore error:", err);
        setAccessToken(null);
        setUser(null);
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
        user,
        isAuthenticated,
        isAuthLoading,
        setAccessToken,
        setIsAuthenticated,
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
