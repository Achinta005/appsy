import { Shield, Zap } from "lucide-react";

export default function CustomLoader({
  header = "Loading",
  subheader = "Please wait...",
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Loader Content */}
      <div className="relative z-10 text-center">
        {/* Spinning loader with icon */}
        <div className="relative inline-block mb-8">
          {/* Outer rotating ring */}
          <div className="w-24 h-24 border-4 border-indigo-500/30 border-t-cyan-400 rounded-full animate-spin"></div>

          {/* Inner rotating ring (opposite direction) */}
          <div className="absolute inset-2 border-4 border-cyan-500/30 border-b-indigo-400 rounded-full animate-spin-reverse"></div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Shield className="w-10 h-10 text-cyan-400 animate-pulse" />
              <Zap
                className="w-5 h-5 text-indigo-400 absolute -bottom-0.5 -right-0.5 animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
            {header}
          </h2>
          <p className="text-indigo-300 text-sm md:text-base">{subheader}</p>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>

        {/* Optional progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 animate-progress"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes progress {
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

        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
