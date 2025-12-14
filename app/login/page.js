"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { setAuthToken, getAuthToken } from "../lib/auth";
import React, { Suspense } from "react";
import * as THREE from "three";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "../lib/util";
import { PortfolioApiService } from "@/services/PortfolioApiService";
import {
  IconBrandGoogle,
  IconBrandGithub,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

const LoginContent = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Already logged in → go to admin
  useEffect(() => {
    const token = getAuthToken();
    if (token && token.split(".").length === 3) {
      router.replace("/admin");
    }
  }, [router]);

  const handleChange = (e) => {
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
      const data = await PortfolioApiService.Login(formData);

      if (!data?.success || !data?.token) {
        setError(data?.error || "Invalid username or password");
        return;
      }

      // ✅ Store JWT
      setAuthToken(data.token);

      // ✅ Redirect
      router.replace("/admin");
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to login. Please try again.");
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
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-neutral-400 text-sm">
              Sign in to access your admin panel
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6"
          >
            <LabelInputContainer>
              <Label className="text-sm text-neutral-300">Username</Label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-white/5 border border-white/10 text-white"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label className="text-sm text-neutral-300">Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border border-white/10 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                >
                  {showPassword ? (
                    <IconEyeOff className="h-6 w-6" />
                  ) : (
                    <IconEye className="h-6 w-6" />
                  )}
                </button>
              </div>
            </LabelInputContainer>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg font-semibold text-white bg-gradient-to-br from-black to-neutral-700 hover:from-neutral-900 hover:to-neutral-600 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="text-xs text-neutral-500 uppercase tracking-widest">
                Or
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/register")}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors duration-200 cursor-pointer"
              >
                Don&apos;t have an account? Register now
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-500">
            Secure sign-in to your admin panel
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
          .animation-delay-2000 {
            animation-delay: 2000ms;
          }
          .animation-delay-4000 {
            animation-delay: 4000ms;
          }
        `}</style>
      </div>
    </>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

export default LoginPageWrapper;
