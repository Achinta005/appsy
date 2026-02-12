"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/app/(protected)/lib/util";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import {
  IconEye,
  IconEyeOff,
  IconShield,
  IconLock,
  IconUser,
  IconAlertCircle,
} from "@tabler/icons-react";

const ResetPassword = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setuserId] = useState();
  const [otpSent, setOtpSent] = useState(false);
  const [step, setStep] = useState("email");
  const router = useRouter();
  const [focusedField, setFocusedField] = useState("");

  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle username submission and email lookup
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to find user");
      }
      router.push("/login");
    } catch (err) {
      setError(err.message || "Failed to process request");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
        </div>
        <div className="max-w-md w-full space-y-8 p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 mb-4 backdrop-blur-sm">
              <IconShield className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Reset Your Password
            </h1>
            <p className="text-neutral-400 text-sm">
              Secure access to your dashboard
            </p>
          </div>

          {/* Username Step */}
          {step === "email" && (
            <form
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden"
              onSubmit={handleEmailSubmit}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-500 pointer-events-none group-focus-within:opacity-100"></div>

              <div className="space-y-4">
                <LabelInputContainer>
                  <Label
                    htmlFor="username"
                    className="text-sm text-neutral-300 font-medium flex items-center gap-2"
                  >
                    <IconUser className="w-4 h-4 text-cyan-400" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    className={cn(
                      "bg-white/5 border border-white/10 text-white h-12 rounded-lg transition-all duration-300",
                      "focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/20",
                      "placeholder:text-neutral-500",
                      focusedField === "username" &&
                        "shadow-lg shadow-cyan-500/10",
                    )}
                  />
                </LabelInputContainer>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send password Reset Link"}
                <BottomGradient />
              </button>
            </form>
          )}
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

export default ResetPassword;
