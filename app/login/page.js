"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "../lib/util";
import {
  IconEye,
  IconEyeOff,
  IconShield,
  IconLock,
  IconUser,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useAuth } from "../context/authContext";
import React, { Suspense } from "react";

const LoginContent = () => {
  const { setAccessToken, setIsAuthenticated, isAuthenticated, isAuthLoading } =
    useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  // ✅ Already logged in → go to admin
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) router.replace("/admin");
  }, [isAuthenticated, isAuthLoading, router]);

  const handleChange = (e) => {
    setError(""); // Clear error on input change
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      // Successful login
      if (data.accessToken) {
        setAccessToken(data.accessToken);
        setIsAuthenticated(true);

        // Add a small delay for better UX
        setTimeout(() => {
          router.push("/admin");
        }, 300);
      } else {
        setError("Authentication failed. No access token received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const vantaRef = useRef(null);

  useEffect(() => {
    let effect;

    const loadVanta = async () => {
      if (!window.VANTA) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      if (window.VANTA?.NET && vantaRef.current) {
        effect = window.VANTA.NET({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x0,
          points: 20.0,
          maxDistance: 10.0,
          spacing: 20.0,
        });
      }
    };

    loadVanta();

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <>
      <div ref={vantaRef} className="fixed inset-0 -z-10 pointer-events-none" />

      <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
        {/* Floating elements for visual interest */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 mb-4 backdrop-blur-sm">
              <IconShield className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-neutral-400 text-sm">
              Secure access to your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden"
          >
            {/* Gradient overlay on focus */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-500 pointer-events-none group-focus-within:opacity-100"></div>

            {/* Username Field */}
            <LabelInputContainer>
              <Label className="text-sm text-neutral-300 font-medium flex items-center gap-2">
                <IconUser className="w-4 h-4 text-cyan-400" />
                Username
              </Label>
              <div className="relative group">
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField("")}
                  required
                  autoComplete="username"
                  className={cn(
                    "bg-white/5 border border-white/10 text-white h-12 rounded-lg transition-all duration-300",
                    "focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/20",
                    "placeholder:text-neutral-500",
                    focusedField === "username" &&
                      "shadow-lg shadow-cyan-500/10"
                  )}
                  placeholder="Enter your username"
                />
              </div>
            </LabelInputContainer>

            {/* Password Field */}
            <LabelInputContainer>
              <Label className="text-sm text-neutral-300 font-medium flex items-center gap-2">
                <IconLock className="w-4 h-4 text-cyan-400" />
                Password
              </Label>
              <div className="relative group">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  required
                  autoComplete="current-password"
                  className={cn(
                    "bg-white/5 border border-white/10 text-white h-12 rounded-lg pr-12 transition-all duration-300",
                    "focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/20",
                    "placeholder:text-neutral-500",
                    focusedField === "password" &&
                      "shadow-lg shadow-cyan-500/10"
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-cyan-400 transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <IconEyeOff className="h-5 w-5" />
                  ) : (
                    <IconEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </LabelInputContainer>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-4 rounded-lg animate-shake">
                <IconAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-12 rounded-lg font-semibold text-white relative overflow-hidden group transition-all duration-300",
                "bg-gradient-to-r from-cyan-600 to-indigo-600",
                "hover:from-cyan-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-cyan-500/25",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
                "transform hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <IconShield className="w-5 h-5" />
                    Sign in securely
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-medium">
                Or
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors duration-200 cursor-pointer relative group inline-block"
              >
                Don&apos;t have an account? Register now
                <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-xs text-neutral-500">
              🔒 Secured with enterprise-grade encryption
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-neutral-600">
              <span>© 2026 Admin Panel</span>
              <span>•</span>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Privacy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) translateX(0px);
            }
            25% {
              transform: translateY(-20px) translateX(10px);
            }
            50% {
              transform: translateY(-30px) translateX(-10px);
            }
            75% {
              transform: translateY(-15px) translateX(15px);
            }
          }
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            10%,
            30%,
            50%,
            70%,
            90% {
              transform: translateX(-4px);
            }
            20%,
            40%,
            60%,
            80% {
              transform: translateX(4px);
            }
          }
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2000ms;
          }
          .animation-delay-4000 {
            animation-delay: 4000ms;
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

function LoginPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400 font-medium">
              Loading secure portal...
            </p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

export default LoginPageWrapper;
