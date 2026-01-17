"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, Lock } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [countdown, setCountdown] = useState(3);

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

  const isDark = theme === "dark";
  
  // Theme-based styles
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-blue-50 via-purple-50 to-pink-50";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-purple-200" : "text-purple-700";
  const textGradient = isDark
    ? "from-white via-purple-200 to-pink-200"
    : "from-purple-800 via-purple-600 to-pink-600";
  const loadingBarBg = isDark ? "bg-white/10" : "bg-purple-200/50";
  const buttonGradient = isDark
    ? "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    : "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600";
  
  // Orb colors for background
  const orb1 = isDark ? "bg-purple-500/20" : "bg-purple-300/30";
  const orb2 = isDark ? "bg-pink-500/20" : "bg-pink-300/30";
  const orb3 = isDark ? "bg-blue-500/20" : "bg-blue-300/30";

  // Calculate stroke offset for countdown animation
  const totalDash = 282.7;
  const strokeOffset = totalDash - (totalDash / 3) * (3 - countdown);

  if (isAuthLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${bgGradient} relative overflow-hidden flex items-center justify-center transition-colors duration-300`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${orb1} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${orb2} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: "1s" }}></div>
          <div className={`absolute top-1/2 left-1/2 w-96 h-96 ${orb3} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: "0.5s" }}></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Animated Logo */}
          <div className="inline-flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-yellow-400 animate-bounce" style={{ animationDuration: "1s" }} />
              <Zap className="w-8 h-8 text-purple-500 absolute -bottom-1 -right-1 animate-pulse" />
            </div>
          </div>

          {/* Loading Text */}
          <h2 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-4`}>
            Verifying Your Session
          </h2>

          {/* Animated Loading Bar */}
          <div className={`w-64 h-1 ${loadingBarBg} rounded-full overflow-hidden mb-8`}>
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
              style={{
                animation: "shimmer 2s infinite",
              }}
            ></div>
          </div>

          {/* Loading Dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>

          {/* Loading Message */}
          <p className={textSecondary}>
            Please wait while we authenticate your session...
          </p>

          <style>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${bgGradient} relative overflow-hidden flex items-center justify-center transition-colors duration-300`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${orb1} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${orb2} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: "1s" }}></div>
          <div className={`absolute top-1/2 left-1/2 w-96 h-96 ${orb3} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: "0.5s" }}></div>
        </div>

        <div className="relative z-10 text-center px-4">
          {/* Lock Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 mb-8 animate-pulse shadow-2xl">
            <Lock className="w-10 h-10 text-white" />
          </div>

          {/* Heading */}
          <h2 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${textGradient} bg-clip-text text-transparent mb-3`}>
            Authentication Required
          </h2>

          {/* Description */}
          <p className={`${textSecondary} text-lg mb-8 max-w-md mx-auto leading-relaxed`}>
            Your session has expired or you&apos;re not authenticated. You&apos;ll be redirected to the login page shortly.
          </p>

          {/* Countdown Loading */}
          <div className="mb-8">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(139, 92, 246, 0.2)"}
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray={totalDash}
                    strokeDashoffset={strokeOffset}
                    style={{
                      transition: "stroke-dashoffset 1s linear",
                    }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`${textPrimary} font-bold text-lg`}>{countdown}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.push("/login")}
            className={`px-8 py-3 bg-gradient-to-r ${buttonGradient} text-white font-semibold rounded-xl transition-all hover:shadow-2xl hover:scale-105 inline-block`}
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  return children;
}