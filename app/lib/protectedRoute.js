"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import {
  VerifyingLoader,
  UnauthorizedLoader,
} from "@/components/ui/authLoader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [countdown, setCountdown] = useState(3);

  // Generate unique key on mount and when transitioning between loader states
  const [verifyingKey, setVerifyingKey] = useState(() => Date.now());
  const [unauthorizedKey, setUnauthorizedKey] = useState(() => Date.now() + 1);

  // Update keys when transitioning between auth states
  useEffect(() => {
    if (isAuthLoading) {
      setVerifyingKey(Date.now());
    } else if (!isAuthenticated) {
      setUnauthorizedKey(Date.now());
    }
  }, [isAuthLoading, isAuthenticated]);

  // Initialize and listen for theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      // Start countdown from 3
      setCountdown(3);

      // Update countdown every second
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Redirect after 3 seconds
      const redirectTimer = setTimeout(() => {
        router.push("/login");
      }, 3000);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(redirectTimer);
      };
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading) {
    return <VerifyingLoader key={verifyingKey} theme={theme} />;
  }

  if (!isAuthenticated) {
    return (
      <UnauthorizedLoader
        key={unauthorizedKey}
        theme={theme}
        countdown={countdown}
        onLoginClick={() => router.push("/login")}
      />
    );
  }

  return children;
}
