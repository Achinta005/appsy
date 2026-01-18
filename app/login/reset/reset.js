"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/app/lib/util";
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
  const [step, setStep] = useState("username");
  const router = useRouter();
  const [focusedField, setFocusedField] = useState("");

  const [formData, setFormData] = useState({
    username: "",
  });

  const [otpData, setOtpData] = useState({
    otp: "",
  });

  const [newPasswordData, setNewPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "otp") {
      setOtpData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "password" || name === "confirmPassword") {
      setNewPasswordData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle username submission and email lookup
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/reset/Email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: formData.username }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to find user");
      }
      setUserEmail(data.email);
      setStep("otp");
    } catch (err) {
      setError(err.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP sending
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/reset/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            username: formData.username,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpSent(true);
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/reset/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            username: formData.username,
            otp: otpData.otp,
          }),
        },
      );

      const data = await response.json();
      setuserId(data.userId);

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      setStep("newPassword");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle new password submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPasswordData.password !== newPasswordData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPasswordData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/reset/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            newPassword: newPasswordData.password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      router.push("/login");
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    const [username, domain] = email.split("@");
    const visiblePart = username.slice(0, 4);
    const maskedPart = "*".repeat(Math.max(0, username.length - 4));
    return `${visiblePart}${maskedPart}@${domain}`;
  };

  const handleBackToUsername = () => {
    setStep("username");
    setOtpSent(false);
    setUserEmail("");
    setError("");
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
          {step === "username" && (
            <form
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden"
              onSubmit={handleUsernameSubmit}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 opacity-0 transition-opacity duration-500 pointer-events-none group-focus-within:opacity-100"></div>

              <div className="space-y-4">
                <LabelInputContainer>
                  <Label
                    htmlFor="username"
                    className="text-sm text-neutral-300 font-medium flex items-center gap-2"
                  >
                    <IconUser className="w-4 h-4 text-cyan-400" />
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
                    autoComplete="username"
                    onFocus={() => setFocusedField("username")}
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
                {loading ? "Looking up user..." : "Continue"}
                <BottomGradient />
              </button>
            </form>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <div className="mt-8 space-y-6 bg-white/10 backdrop-blur-3xl p-6 px-5 rounded-lg">
              {!otpSent ? (
                <div>
                  <div className="flex justify-center items-center flex-col gap-3 mb-6">
                    <span className="block text-amber-50 text-center">
                      We found your account! Send OTP to {maskEmail(userEmail)}?
                    </span>
                    <div className="flex gap-3">
                      <button
                        className="p-2 bg-white/10 backdrop-blur-2xl rounded-lg text-white hover:bg-white/20 transition-colors"
                        onClick={handleSendOTP}
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send OTP"}
                      </button>
                      <button
                        className="p-2 bg-gray-600/50 backdrop-blur-2xl rounded-lg text-white hover:bg-gray-600/70 transition-colors"
                        onClick={handleBackToUsername}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleOTPSubmit}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <LabelInputContainer>
                      <Label
                        htmlFor="otp"
                        className="text-sm text-neutral-300 font-medium flex items-center gap-2"
                      >
                        Enter OTP sent to {maskEmail(userEmail)}
                      </Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        placeholder="Enter 6-digit OTP"
                        value={otpData.otp}
                        onChange={handleChange}
                        maxLength={6}
                        className={cn(
                          "bg-white/5 border border-white/10 text-white h-12 rounded-lg transition-all duration-300",
                          "focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/20",
                          "placeholder:text-neutral-200",
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
                    {loading ? "Verifying..." : "Verify OTP"}
                    <BottomGradient />
                  </button>

                  <div className="flex justify-center mt-4">
                    <button
                      type="button"
                      className="text-sm text-amber-50 hover:text-white underline"
                      onClick={handleBackToUsername}
                    >
                      Change username
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* New Password Step */}
          {step === "newPassword" && (
            <form
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden"
              onSubmit={handlePasswordSubmit}
            >
              <div className="space-y-4">
                <LabelInputContainer>
                  <Label
                    htmlFor="password"
                    className="text-sm text-neutral-300 font-medium flex items-center gap-2"
                  >
                    New Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPasswordData.password}
                    onChange={handleChange}
                    className={cn(
                      "bg-white/5 border border-white/10 text-white h-12 rounded-lg transition-all duration-300",
                      "focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/20",
                      "placeholder:text-neutral-500",
                      focusedField === "username" &&
                        "shadow-lg shadow-cyan-500/10",
                    )}
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm text-neutral-300 font-medium flex items-center gap-2"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={newPasswordData.confirmPassword}
                    onChange={handleChange}
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
                {loading ? "Resetting Password..." : "Reset Password"}
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
