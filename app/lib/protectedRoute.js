"use client";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, Zap, Lock } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Animated Logo */}
          <div className="inline-flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-yellow-400 animate-bounce" style={{ animationDuration: "1s" }} />
              <Zap className="w-8 h-8 text-purple-400 absolute -bottom-1 -right-1 animate-pulse" />
            </div>
          </div>

          {/* Loading Text */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Verifying Your Session
          </h2>

          {/* Animated Loading Bar */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
              style={{
                animation: "shimmer 2s infinite",
              }}
            ></div>
          </div>

          {/* Loading Dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>

          {/* Loading Message */}
          <p className="text-purple-200 text-sm">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        </div>

        <div className="relative z-10 text-center px-4">
          {/* Lock Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 mb-8 animate-pulse">
            <Lock className="w-10 h-10 text-white" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-3">
            Authentication Required
          </h2>

          {/* Description */}
          <p className="text-purple-200 text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Your session has expired or you're not authenticated. You'll be redirected to the login page shortly.
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
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="282.7"
                    strokeDashoffset="70"
                    style={{
                      animation: "countdown 2s linear forwards",
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
                  <span className="text-white font-bold text-lg">2s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all hover:shadow-2xl hover:scale-105 inline-block"
          >
            Go to Login Now
          </button>

          <style>{`
            @keyframes countdown {
              from {
                stroke-dashoffset: 70;
              }
              to {
                stroke-dashoffset: 282.7;
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return children;
}