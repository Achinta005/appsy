"use client";
import { Lock, Minus, Maximize2, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  HexagonalLoader,
  OrbitalLoader,
  PulseWaveLoader,
  DNAHelixLoader,
  StarBurstLoader,
  loaderStyles,
} from "./Loadervarients";

// ── Shared window controls ────────────────────────────────────────────────────
function WindowControls() {
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    setIsCapacitor(
      typeof window !== "undefined" &&
        !!window.Capacitor &&
        window.Capacitor.isNativePlatform(),
    );
  }, []);

  if (!isCapacitor) return null;

  return (
    <>
      {/* Draggable strip */}
      <div
        className="fixed top-0 left-0 right-32 h-10 z-40"
        style={{ WebkitAppRegion: "drag" }}
      />

      {/* Minimize / Maximize / Close */}
      <div
        className="fixed top-0 right-0 z-50 flex items-center gap-0.5 p-1"
        style={{ WebkitAppRegion: "no-drag" }}
      >
        <button
          onClick={() => window.electron?.minimizeWindow()}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 group hover:bg-white/10"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
        </button>

        <button
          onClick={() => window.electron?.maximizeWindow()}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 group hover:bg-white/10"
          title="Maximize"
        >
          <Maximize2 className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
        </button>

        <button
          onClick={() => window.electron?.closeWindow()}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 group hover:bg-red-500/20"
          title="Close"
        >
          <X className="w-3.5 h-3.5 text-white/50 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
    </>
  );
}

// ── VerifyingLoader ───────────────────────────────────────────────────────────
export function VerifyingLoader({ theme = "light" }) {
  const loaderVariant = 3;

  const bgGradient = "from-slate-950 via-purple-950 to-slate-950";
  const orb1 = "bg-purple-500/20";
  const orb2 = "bg-pink-500/20";
  const orb3 = "bg-blue-500/20";

  const renderLoaderVariant = () => {
    const variants = [
      <HexagonalLoader
        key="hexagonal"
        header="Verifying Your Session"
        subheader="Please wait while we authenticate your session..."
      />,
      <OrbitalLoader
        key="orbital"
        header="Verifying Your Session"
        subheader="Please wait while we authenticate your session..."
      />,
      <PulseWaveLoader
        key="pulse"
        header="Verifying Your Session"
        subheader="Please wait while we authenticate your session..."
      />,
      <DNAHelixLoader
        key="dna"
        header="Verifying Your Session"
        subheader="Please wait while we authenticate your session..."
      />,
      <StarBurstLoader
        key="star"
        header="Verifying Your Session"
        subheader="Please wait while we authenticate your session..."
      />,
    ];
    return variants[loaderVariant];
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} relative overflow-hidden flex items-center justify-center transition-colors duration-300`}
    >
      <WindowControls />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${orb1} rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${orb2} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        />
        <div
          className={`absolute top-1/2 left-1/2 w-96 h-96 ${orb3} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative z-10 text-center">{renderLoaderVariant()}</div>

      <style jsx>{loaderStyles}</style>
    </div>
  );
}

// ── UnauthorizedLoader ────────────────────────────────────────────────────────
export function UnauthorizedLoader({
  theme = "light",
  countdown = 3,
  onLoginClick,
}) {
  const [loaderVariant] = useState(() => Math.floor(Math.random() * 5));

  const bgGradient = "from-slate-950 via-purple-950 to-slate-950";
  const textPrimary = "text-white";
  const buttonGradient =
    "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700";
  const orb1 = "bg-purple-500/20";
  const orb2 = "bg-pink-500/20";
  const orb3 = "bg-blue-500/20";

  const totalDash = 282.7;
  const strokeOffset = totalDash - (totalDash / 3) * (3 - countdown);

  const renderLoaderVariant = () => {
    const variants = [
      <HexagonalLoader
        key="hexagonal"
        header="Authentication Required"
        subheader="Your session has expired"
      />,
      <OrbitalLoader
        key="orbital"
        header="Authentication Required"
        subheader="Your session has expired"
      />,
      <PulseWaveLoader
        key="pulse"
        header="Authentication Required"
        subheader="Your session has expired"
      />,
      <DNAHelixLoader
        key="dna"
        header="Authentication Required"
        subheader="Your session has expired"
      />,
      <StarBurstLoader
        key="star"
        header="Authentication Required"
        subheader="Your session has expired"
      />,
    ];
    return variants[loaderVariant];
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} relative overflow-hidden flex items-center justify-center transition-colors duration-300`}
    >
      <WindowControls />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${orb1} rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${orb2} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        />
        <div
          className={`absolute top-1/2 left-1/2 w-96 h-96 ${orb3} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Lock icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 mb-8 animate-pulse shadow-2xl">
          <Lock className="w-10 h-10 text-white" />
        </div>

        {renderLoaderVariant()}

        {/* Countdown ring */}
        <div className="mb-8 mt-6">
          <div className="inline-flex flex-col items-center gap-3">
            <div className="relative w-16 h-16">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
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
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`${textPrimary} font-bold text-lg`}>
                  {countdown}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onLoginClick}
          className={`px-8 py-3 bg-gradient-to-r ${buttonGradient} text-white font-semibold rounded-xl transition-all hover:shadow-2xl hover:scale-105 inline-block`}
        >
          Go to Login Now
        </button>
      </div>

      <style jsx>{loaderStyles}</style>
    </div>
  );
}
