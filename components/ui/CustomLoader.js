"use client";
import { Shield, Zap, Lock, Database, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import {
  HexagonalLoader,
  OrbitalLoader,
  PulseWaveLoader,
  DNAHelixLoader,
  StarBurstLoader,
  loaderStyles,
} from "./Loadervarients";

export default function CustomLoader({
  header = "Loading",
  subheader = "Please wait...",
}) {
  const [loaderVariant, setLoaderVariant] = useState(0);

  // Randomly select a loader variant on mount
  useEffect(() => {
    const randomVariant = Math.floor(Math.random() * 5);
    setLoaderVariant(randomVariant);
  }, []);

  // Render the selected loader variant
  const renderLoaderVariant = () => {
    const variants = [
      <HexagonalLoader key="hexagonal" header={header} subheader={subheader} />,
      <OrbitalLoader key="orbital" header={header} subheader={subheader} />,
      <PulseWaveLoader key="pulse" header={header} subheader={subheader} />,
      <DNAHelixLoader key="dna" header={header} subheader={subheader} />,
      <StarBurstLoader key="star" header={header} subheader={subheader} />,
    ];
    return variants[loaderVariant];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-[550px] h-[550px] bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-float-slow"></div>

        {/* Additional accent orbs */}
        <div className="absolute top-10 right-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="absolute inset-0 bg-grid-pattern animate-grid-flow"></div>
        </div>

        {/* Scanning line effect */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-scan"></div>
        </div>
      </div>

      {/* Loader Content */}
      <div className="relative z-10 text-center px-4">
        {renderLoaderVariant()}

        {/* Enhanced progress bar */}
        <div className="w-80 max-w-full mx-auto space-y-5">
          {/* Main progress bar */}
          <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-blue-500 animate-progress-wave shadow-[0_0_20px_rgba(34,211,238,0.6)]"></div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center justify-between text-xs text-indigo-400/70 px-1 pt-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]"></div>
              <span>System Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>Connecting...</span>
            </div>
          </div>
        </div>

        {/* Floating mini icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Lock className="absolute top-1/4 left-1/4 w-4 h-4 text-cyan-400/30 animate-float-icon" />
          <Database className="absolute top-1/3 right-1/4 w-4 h-4 text-indigo-400/30 animate-float-icon-delayed" />
          <Shield
            className="absolute bottom-1/4 left-1/3 w-4 h-4 text-blue-400/30 animate-float-icon"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      <style jsx>{`
        ${loaderStyles}

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes spin-fast {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(720deg);
          }
        }

        @keyframes progress-wave {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-scale {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes icon-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes icon-pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes text-shimmer {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.4;
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.35;
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          33% {
            transform: translate(-30px, 30px) scale(1.1);
            opacity: 0.4;
          }
          66% {
            transform: translate(20px, -20px) scale(0.9);
            opacity: 0.35;
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(40px, 40px) rotate(180deg) scale(1.15);
            opacity: 0.3;
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-12px);
            opacity: 0.7;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        @keyframes grid-flow {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(20px);
          }
        }

        @keyframes float-icon {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
            opacity: 0.4;
          }
        }

        @keyframes float-icon-delayed {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-15px) rotate(-10deg);
            opacity: 0.5;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 2.5s linear infinite;
        }

        .animate-spin-fast {
          animation: spin-fast 2s linear infinite;
        }

        .animate-progress-wave {
          animation: progress-wave 2.5s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        .animate-icon-float {
          animation: icon-float 3s ease-in-out infinite;
        }

        .animate-icon-pulse {
          animation: icon-pulse 2s ease-in-out infinite;
        }

        .animate-text-shimmer {
          animation: text-shimmer 3s linear infinite;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 1.5s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 4s linear infinite;
        }

        .animate-grid-flow {
          animation: grid-flow 2s linear infinite;
        }

        .animate-float-icon {
          animation: float-icon 4s ease-in-out infinite;
        }

        .animate-float-icon-delayed {
          animation: float-icon-delayed 5s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image:
            linear-gradient(
              to right,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
