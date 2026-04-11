import { Loader2, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

export default function ServiceHealthGrid({
  serviceHealth,
  checkingServices,
  checkAll,
  checkOne,
  checkingAll,
  actionLines,
  theme,
}) {
  const isDark = theme === "dark";

  const cardBg   = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
  const itemBg   = isDark ? "bg-white/5"  : "bg-gray-50";
  const textPrimary = isDark ? "text-white"    : "text-gray-900";
  const textMuted   = isDark ? "text-gray-400" : "text-gray-600";
  const termBg      = isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.03)";

  const getStatusColor = (service, checking) => {
    if (checking) return "bg-yellow-500 animate-pulse";
    if (!service)  return "bg-gray-500";
    return service.status === "operational" ? "bg-emerald-500" : "bg-red-500";
  };

  const getStatusText = (service, checking) => {
    if (checking) return { text: "Checking...", color: "text-yellow-400" };
    if (!service)  return { text: "Not checked", color: isDark ? "text-gray-400" : "text-gray-500" };
    return service.status === "operational"
      ? { text: `Online · ${service.duration || "—"}ms`, color: "text-emerald-400" }
      : { text: service.error || "Unreachable",           color: "text-red-400" };
  };

  const entries = Object.entries(serviceHealth);

  return (
    <div className={`${cardBg} backdrop-blur-lg rounded-xl p-5 border transition-all shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-base font-bold ${textPrimary} flex items-center gap-2`}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Service Status
        </h3>
        <button
          onClick={checkAll}
          disabled={checkingAll}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checkingAll ? "animate-spin" : ""}`} />
          {checkingAll ? "Checking…" : "Check All"}
        </button>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {entries.length === 0 ? (
          <p className={`col-span-2 text-sm ${textMuted} text-center py-4`}>
            Run &quot;Check All&quot; to see service status
          </p>
        ) : (
          entries.map(([id, service]) => {
            const checking = checkingServices[id];
            const { text, color } = getStatusText(service, checking);
            return (
              <div
                key={id}
                className={`${itemBg} rounded-lg p-3 border ${
                  isDark ? "border-white/10" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className={`text-sm font-medium ${textPrimary} truncate`}>
                    {service?.name || id}
                  </p>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(service, checking)}`} />
                </div>
                <p className={`text-xs ${textMuted}`}>{service?.type || "—"}</p>
                <p className={`text-xs font-medium mt-1 ${color}`}>{text}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Action log terminal */}
      <div
        className="rounded-xl overflow-hidden border"
        style={{
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          background: termBg,
        }}
      >
        {/* Terminal titlebar */}
        <div
          className="flex items-center gap-2 px-4 py-2 border-b"
          style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex gap-1.5">
            {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
              <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className={`text-xs font-mono ${textMuted}`}>output.log</span>
        </div>

        {/* Log lines */}
        <div className="p-3 max-h-36 overflow-y-auto font-mono">
          {actionLines.length === 0 ? (
            <span className={`text-xs italic ${textMuted}`}>
              Run &quot;Check All&quot; to see results here…
            </span>
          ) : (
            actionLines.map((line, i) => (
              <div key={i} className="flex gap-3 py-0.5 items-baseline">
                <span className={`text-xs flex-shrink-0 ${textMuted}`}>
                  {line.ts.toLocaleTimeString()}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color:
                      line.kind === "ok"  ? "#22c55e" :
                      line.kind === "err" ? "#f87171" : "#a78bfa",
                  }}
                >
                  {line.text}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}