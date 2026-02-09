"use client";
import { Lock } from "lucide-react";
import { useState, useEffect } from "react";
import {
  HexagonalLoader,
  OrbitalLoader,
  PulseWaveLoader,
  DNAHelixLoader,
  StarBurstLoader,
  loaderStyles,
} from "./Loadervarients";

export function VerifyingLoader({ theme = "light" }) {
  // Randomly select a loader variant on mount using lazy initialization
  const loaderVariant = 3;

  // Always use dark theme for best visual effect with the loaders
  const bgGradient = "from-slate-950 via-purple-950 to-slate-950";
  const orb1 = "bg-purple-500/20";
  const orb2 = "bg-pink-500/20";
  const orb3 = "bg-blue-500/20";

  // Render the selected loader variant
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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${orb1} rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${orb2} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 w-96 h-96 ${orb3} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="relative z-10 text-center">{renderLoaderVariant()}</div>

      <style jsx>{loaderStyles}</style>
    </div>
  );
}

export function UnauthorizedLoader({
  theme = "light",
  countdown = 3,
  onLoginClick,
}) {
  // Randomly select a loader variant on mount using lazy initialization
  const [loaderVariant] = useState(() => Math.floor(Math.random() * 5));

  // Always use dark theme for best visual effect with the loaders
  const bgGradient = "from-slate-950 via-purple-950 to-slate-950";
  const textPrimary = "text-white";
  const buttonGradient =
    "from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700";
  const orb1 = "bg-purple-500/20";
  const orb2 = "bg-pink-500/20";
  const orb3 = "bg-blue-500/20";

  // Calculate stroke offset for countdown animation
  const totalDash = 282.7;
  const strokeOffset = totalDash - (totalDash / 3) * (3 - countdown);

  // Render the selected loader variant
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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${orb1} rounded-full blur-3xl animate-pulse`}
        ></div>
        <div
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${orb2} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 w-96 h-96 ${orb3} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Lock Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 mb-8 animate-pulse shadow-2xl">
          <Lock className="w-10 h-10 text-white" />
        </div>

        {renderLoaderVariant()}

        {/* Countdown Loading */}
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
                  strokeDasharray={totalDash}
                  strokeDashoffset={strokeOffset}
                  style={{
                    transition: "stroke-dashoffset 1s linear",
                  }}
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

        {/* Action Button */}
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
