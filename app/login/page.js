"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { setAuthToken, getAuthToken } from "../lib/auth";
import React, { Suspense } from "react";
import Link from "next/link";
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
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl && tokenFromUrl.split(".").length === 3) {
      setAuthToken(tokenFromUrl);
      router.push("/admin");
      return;
    }

    const token = getAuthToken();
    if (token && token.split(".").length === 3) {
      router.push("/admin");
    }
  }, [searchParams, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await PortfolioApiService.Login(formData);
      const data = await response;

      if (!data.success || !data.token) {
        setError(data.error || "Invalid username or password");
        return;
      }

      setAuthToken(data.token);

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to login. Check network or credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/auth/google-oAuth`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/auth/github-oAuth`;
  };

  return (
    <div className="min-h-screen w-full bg-black overflow-hidden flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-neutral-400 text-sm md:text-base">
            Sign in to access your admin panel
          </p>
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="space-y-6">
            <LabelInputContainer>
              <Label
                htmlFor="username"
                className="text-sm font-medium text-neutral-300"
              >
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                className="h-10 md:h-11 bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-500 focus:bg-white/10 transition-all duration-300"
              />
            </LabelInputContainer>

            <LabelInputContainer>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-neutral-300"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-10 md:h-11 bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-500 focus:bg-white/10 transition-all duration-300 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-cyan-400 transition-colors duration-200"
                >
                  {showPassword ? (
                    <IconEyeOff className="h-5 w-5 cursor-pointer" />
                  ) : (
                    <IconEye className="h-5 w-5 cursor-pointer" />
                  )}
                </button>
              </div>
            </LabelInputContainer>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm animate-pulse">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              type="submit"
              disabled={loading}
              className="group/btn relative w-full h-12 md:h-13 rounded-lg font-semibold text-white bg-gradient-to-br from-black to-neutral-600 hover:from-neutral-900 hover:to-neutral-700 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-neutral-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-10 translate-x-full group-hover/btn:translate-x-0 transition-all duration-500"></div>
              <div className="relative">
                {loading ? "Signing in..." : "Sign in"}
              </div>
              <BottomGradient />
            </button>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="text-xs text-neutral-500 uppercase tracking-widest">
              Or
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="group/btn relative w-full h-12 md:h-13 rounded-lg font-semibold text-white bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-blue-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 translate-x-full group-hover/btn:translate-x-0 transition-all duration-500"></div>
              <div className="relative flex items-center justify-center gap-3 h-full">
                <IconBrandGoogle className="h-5 w-5" />
                <span className="text-base">Continue with Google</span>
              </div>
              <BottomGradient />
            </button>

            <button
              onClick={handleGithubLogin}
              className="group/btn relative w-full h-12 md:h-13 rounded-lg font-semibold text-white bg-gradient-to-br from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all duration-300 overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-10 translate-x-full group-hover/btn:translate-x-0 transition-all duration-500"></div>
              <div className="relative flex items-center justify-center gap-3 h-full">
                <IconBrandGithub className="h-5 w-5" />
                <span className="text-base">Continue with GitHub</span>
              </div>
              <BottomGradient />
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/register")}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors duration-200 cursor-pointer"
            >
              Don&apos;t have an account? Register now
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-500">
          <p>Secure sign-in to your admin panel</p>
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
