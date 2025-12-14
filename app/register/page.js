"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "../lib/util";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfolioApiService } from "@/services/PortfolioApiService";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "editor",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
    setSuccess("");

    try {
      const response = await PortfolioApiService.Register(formData);
      const data = await response;

      if (!data.success) {
        setError(data.error || "Registration failed");
        return;
      }

      setSuccess(data.message || "User registered successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    async function loadVanta() {
      if (!window.VANTA) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      if (!vantaEffect && window.VANTA && vantaRef.current) {
        setVantaEffect(
          window.VANTA.NET({
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
          })
        );
      }
    }

    loadVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <>
      <div
        ref={vantaRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="min-h-screen flex items-center justify-center ">
          <Link
            href="/"
            className="mb-4 px-4 py-2 bg-white/20 text-white rounded hover:bg-white/60 absolute top-2 left-2"
          >
            HOME
          </Link>
          <div className="w-full max-w-2xl lg:max-w-3xl space-y-8 p-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Create an Account
              </h2>
              <p className="text-neutral-400 text-sm md:text-base">
                Get started by creating your admin account
              </p>
            </div>

            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl w-full mx-auto">
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        className="h-10 md:h-11 bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-500 focus:bg-white/10 transition-all duration-300"
                      />
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-neutral-300"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="text"
                        required
                        placeholder="Enter your Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-10 md:h-11 bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-500 focus:bg-white/10 transition-all duration-300"
                      />
                    </LabelInputContainer>
                  </div>
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
                        placeholder="Choose a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-10 md:h-11 bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-500 focus:bg-white/10 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <IconEyeOff className="h-6 w-6 cursor-pointer" />
                        ) : (
                          <IconEye className="h-6 w-6 cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </LabelInputContainer>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || success}
                  className="group/btn relative w-full h-12 md:h-13 rounded-lg font-semibold text-white bg-gradient-to-br from-black to-neutral-600 hover:from-neutral-900 hover:to-neutral-700 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-neutral-500/50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin ml-32 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                  <BottomGradient />
                </button>
                <div className="flex items-center gap-4 my-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest">
                    Or
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => router.push("/login")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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

export default RegisterPage;
