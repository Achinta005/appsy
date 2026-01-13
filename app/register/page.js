"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as THREE from "three";
import { cn } from "../lib/util";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortfolioApiService } from "@/services/PortfolioApiService";
import { 
  IconEye, 
  IconEyeOff,
  IconShield,
  IconUser,
  IconMail,
  IconLock,
  IconCheck,
  IconAlertCircle,
  IconArrowLeft,
  IconSparkles
} from "@tabler/icons-react";

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
  const [focusedField, setFocusedField] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setError("");
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

      setSuccess(data.message || "Account created successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
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
        className="fixed inset-0 -z-10 pointer-events-none"
      />

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 group"
          >
            <IconArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Home
          </Link>

          <div className="w-full max-w-2xl lg:max-w-3xl space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 mb-4 backdrop-blur-sm">
                <IconSparkles className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Join Admin Panel
              </h2>
              <p className="text-neutral-400 text-base md:text-lg">
                Create your account and get started in seconds
              </p>
            </div>

            {/* Registration Form */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
              <div className="space-y-6">
                {/* Username and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <LabelInputContainer>
                    <Label className="text-sm text-neutral-300 font-medium flex items-center gap-2">
                      <IconUser className="w-4 h-4 text-cyan-400" />
                      Username
                    </Label>
                    <div className="relative group">
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("username")}
                        onBlur={() => setFocusedField("")}
                        autoComplete="username"
                        className={cn(
                          "h-12 bg-white/5 border border-white/10 text-white placeholder:text-neutral-500",
                          "focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300",
                          focusedField === "username" && "shadow-lg shadow-cyan-500/10"
                        )}
                      />
                    </div>
                  </LabelInputContainer>

                  <LabelInputContainer>
                    <Label className="text-sm text-neutral-300 font-medium flex items-center gap-2">
                      <IconMail className="w-4 h-4 text-cyan-400" />
                      Email
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        autoComplete="email"
                        className={cn(
                          "h-12 bg-white/5 border border-white/10 text-white placeholder:text-neutral-500",
                          "focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300",
                          focusedField === "email" && "shadow-lg shadow-cyan-500/10"
                        )}
                      />
                    </div>
                  </LabelInputContainer>
                </div>

                {/* Password Field */}
                <LabelInputContainer>
                  <Label className="text-sm text-neutral-300 font-medium flex items-center gap-2">
                    <IconLock className="w-4 h-4 text-cyan-400" />
                    Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField("")}
                      autoComplete="new-password"
                      className={cn(
                        "h-12 bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 pr-12",
                        "focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300",
                        focusedField === "password" && "shadow-lg shadow-cyan-500/10"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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
                  <p className="text-xs text-neutral-500 mt-1">
                    Use at least 8 characters with a mix of letters and numbers
                  </p>
                </LabelInputContainer>

                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm animate-shake">
                    <IconAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm animate-slideIn">
                    <IconCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{success}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || success}
                  className={cn(
                    "w-full h-12 md:h-13 rounded-lg font-semibold text-white relative overflow-hidden group transition-all duration-300",
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
                        Creating Account...
                      </>
                    ) : success ? (
                      <>
                        <IconCheck className="w-5 h-5" />
                        Account Created!
                      </>
                    ) : (
                      <>
                        <IconShield className="w-5 h-5" />
                        Create Account
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <BottomGradient />
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <span className="text-xs text-neutral-500 uppercase tracking-widest font-medium">
                    Or
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors duration-200 cursor-pointer relative group inline-block"
                  >
                    Already have an account? Sign in
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <IconShield className="w-6 h-6 text-cyan-400" />
                <p className="text-xs text-neutral-400">Secure & Encrypted</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <IconSparkles className="w-6 h-6 text-indigo-400" />
                <p className="text-xs text-neutral-400">Instant Access</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <IconCheck className="w-6 h-6 text-purple-400" />
                <p className="text-xs text-neutral-400">No Credit Card</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-neutral-500 space-y-2">
              <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
              <div className="flex items-center justify-center gap-4">
                <span>© 2026 Admin Panel</span>
                <span>•</span>
                <a href="#" className="hover:text-cyan-400 transition-colors">Help</a>
                <span>•</span>
                <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
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
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />
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