import {
  Shield,
  Zap,
  Lock,
  Database,
  Activity,
  Sparkles,
  Loader2,
  CircleDot,
  Rocket,
  Star,
} from "lucide-react";

// Variant 1: Hexagonal Spinner (from CustomLoader)
export function HexagonalLoader({ header, subheader }) {
  return (
    <>
      {/* Hexagonal loader container */}
      <div className="relative inline-block mb-8">
        {/* Outer hexagonal glow */}
        <div className="absolute inset-0 blur-xl">
          <div className="w-40 h-40 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-full opacity-40 animate-pulse-glow"></div>
        </div>

        {/* Multiple rotating rings */}
        <div className="relative w-40 h-40">
          {/* Outer ring 1 */}
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 opacity-30 animate-spin-slow bg-clip-border"></div>
          <div
            className="absolute inset-0 rounded-full border-[3px] border-transparent bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 animate-spin-slow"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
          ></div>

          {/* Middle ring */}
          <div
            className="absolute inset-4 rounded-full border-[3px] border-transparent bg-gradient-to-l from-cyan-400 via-blue-500 to-indigo-500 animate-spin-reverse"
            style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
          ></div>

          {/* Inner ring */}
          <div className="absolute inset-8 rounded-full border-[2px] border-cyan-400/50 animate-spin-fast"></div>

          {/* Center icon container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Pulsing background circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/30 to-cyan-500/30 rounded-full animate-pulse-scale"></div>
              </div>

              {/* Main icon */}
              <div className="relative">
                <Shield className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-icon-float" />
                <Zap className="w-6 h-6 text-indigo-400 absolute -bottom-1 -right-1 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] animate-icon-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="space-y-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-indigo-200 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
          {header}
        </h2>
        <p className="text-indigo-300/90 text-base md:text-lg font-medium tracking-wide">
          {subheader}
        </p>

        {/* Animated dots */}
        <div className="flex items-center justify-center gap-2 pt-3">
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-bounce-slow"></div>
          <div
            className="w-2.5 h-2.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-bounce-slow"
            style={{ animationDelay: "0.15s" }}
          ></div>
          <div
            className="w-2.5 h-2.5 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)] animate-bounce-slow"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>
      </div>
    </>
  );
}

// Variant 2: Orbital Rings
export function OrbitalLoader({ header, subheader }) {
  return (
    <>
      <div className="relative inline-block mb-8">
        {/* Center glow */}
        <div className="absolute inset-0 blur-2xl">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-50 animate-pulse"></div>
        </div>

        <div className="relative w-48 h-48">
          {/* Outer orbit */}
          <div className="absolute inset-0 border-[2px] border-purple-500/30 rounded-full">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.8)] animate-orbital-1"></div>
            </div>
          </div>

          {/* Middle orbit */}
          <div className="absolute inset-6 border-[2px] border-pink-500/30 rounded-full animate-spin-slow">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <div className="w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.8)]"></div>
            </div>
          </div>

          {/* Inner orbit */}
          <div className="absolute inset-12 border-[2px] border-cyan-500/30 rounded-full animate-spin-reverse">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
            </div>
          </div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full animate-pulse-scale"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Rocket className="w-10 h-10 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)] animate-icon-float" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 bg-clip-text text-transparent">
          {header}
        </h2>
        <p className="text-purple-300/90 text-base md:text-lg font-medium">
          {subheader}
        </p>
      </div>
    </>
  );
}

// Variant 3: Pulse Wave
export function PulseWaveLoader({ header, subheader }) {
  return (
    <>
      <div className="relative inline-block mb-8">
        {/* Pulsing waves */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full animate-ping-slow"></div>
          <div
            className="absolute inset-4 border-4 border-teal-500/40 rounded-full animate-ping-slow"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute inset-8 border-4 border-cyan-500/50 rounded-full animate-ping-slow"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Center pulse */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full animate-pulse-strong shadow-[0_0_30px_rgba(16,185,129,0.6)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-icon-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
          {header}
        </h2>
        <p className="text-emerald-300/90 text-base md:text-lg font-medium">
          {subheader}
        </p>

        <div className="flex items-center justify-center gap-1.5 pt-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-8 bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-full animate-wave"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </>
  );
}

// Variant 4: DNA Helix
export function DNAHelixLoader({ header, subheader }) {
  return (
    <>
      <div className="relative inline-block mb-8">
        <div className="relative w-32 h-48">
          {/* Left strand */}
          <div className="absolute left-0 top-0 bottom-0 w-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={`left-${i}`}
                className="absolute w-3 h-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-dna-left"
                style={{
                  top: `${i * 16}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Right strand */}
          <div className="absolute right-0 top-0 bottom-0 w-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={`right-${i}`}
                className="absolute w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-dna-right"
                style={{
                  top: `${i * 16}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Connecting lines */}
          <div className="absolute inset-0 flex flex-col justify-around py-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={`line-${i}`}
                className="w-full h-0.5 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              ></div>
            ))}
          </div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)] animate-icon-float" />
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 bg-clip-text text-transparent">
          {header}
        </h2>
        <p className="text-indigo-300/90 text-base md:text-lg font-medium">
          {subheader}
        </p>
      </div>
    </>
  );
}

// Variant 5: Star Burst
export function StarBurstLoader({ header, subheader }) {
  return (
    <>
      <div className="relative inline-block mb-8">
        <div className="relative w-48 h-48">
          {/* Rotating stars */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <div
                key={i}
                className="absolute inset-0 animate-spin-slow"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `rotate(${angle}deg) translateY(-70px)` }}
                >
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-twinkle" />
                </div>
              </div>
            );
          })}

          {/* Center burst */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute inset-0 blur-xl">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 animate-pulse"></div>
              </div>

              {/* Main star */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-pulse-scale shadow-[0_0_40px_rgba(251,191,36,0.8)]"></div>
                <Sparkles className="relative w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-icon-float" />
              </div>
            </div>
          </div>

          {/* Orbiting particles */}
          <div className="absolute inset-0 animate-spin-reverse">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 bg-clip-text text-transparent">
          {header}
        </h2>
        <p className="text-yellow-300/90 text-base md:text-lg font-medium">
          {subheader}
        </p>

        <div className="flex items-center justify-center gap-2 pt-3">
          {[...Array(3)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-twinkle"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// Additional animations (add to your global CSS or component styles)
export const loaderStyles = `
  @keyframes ping-slow {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.3);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  @keyframes pulse-strong {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.8;
    }
  }

  @keyframes wave {
    0%, 100% {
      transform: scaleY(0.5);
    }
    50% {
      transform: scaleY(1);
    }
  }

  @keyframes dna-left {
    0%, 100% {
      transform: translateX(0) translateY(0);
    }
    25% {
      transform: translateX(60px) translateY(10px);
    }
    75% {
      transform: translateX(60px) translateY(-10px);
    }
  }

  @keyframes dna-right {
    0%, 100% {
      transform: translateX(0) translateY(0);
    }
    25% {
      transform: translateX(-60px) translateY(-10px);
    }
    75% {
      transform: translateX(-60px) translateY(10px);
    }
  }

  @keyframes twinkle {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(0.8);
    }
  }

  @keyframes orbital-1 {
    0% {
      transform: rotate(0deg) translateX(90px) rotate(0deg);
    }
    100% {
      transform: rotate(360deg) translateX(90px) rotate(-360deg);
    }
  }

  .animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .animate-pulse-strong {
    animation: pulse-strong 2s ease-in-out infinite;
  }

  .animate-wave {
    animation: wave 1.2s ease-in-out infinite;
  }

  .animate-dna-left {
    animation: dna-left 4s ease-in-out infinite;
  }

  .animate-dna-right {
    animation: dna-right 4s ease-in-out infinite;
  }

  .animate-twinkle {
    animation: twinkle 1.5s ease-in-out infinite;
  }

  .animate-orbital-1 {
    animation: orbital-1 3s linear infinite;
  }
`;
