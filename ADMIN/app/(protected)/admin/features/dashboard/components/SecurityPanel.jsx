import { Shield, AlertTriangle, Lock } from "lucide-react";

export function SecurityEventsTable({ events, loading, theme }) {
  const isDark = theme === "dark";
  const cardBg  = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
  const text1   = isDark ? "text-white"    : "text-gray-900";
  const text2   = isDark ? "text-gray-400" : "text-gray-600";
  const rowBg   = isDark
    ? "hover:bg-white/5 border-white/10"
    : "hover:bg-gray-50 border-gray-200";

  const SEV_COLORS = {
    critical: "bg-red-500",
    high:     "bg-orange-500",
    medium:   "bg-yellow-500",
    low:      "bg-blue-500",
  };

  const unresolvedEvents = events
    ?.flatMap((group) =>
      group.events.map((event) => ({ ...event, severity: group._id }))
    )
    .filter((event) => event.resolved === false) || [];

  return (
    <div className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border shadow-sm`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 bg-opacity-10">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${text1}`}>Security Events</h2>
          <p className={`text-xs ${text2} mt-0.5`}>Unresolved security incidents</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
              {["Type", "Severity", "IP Address", "Time"].map((h) => (
                <th key={h} className={`text-left py-3 px-4 text-sm font-semibold ${text1}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {unresolvedEvents.length > 0 ? (
              unresolvedEvents.slice(0, 10).map((event, i) => (
                <tr
                  key={`${event.eventType}-${event.timestamp}-${i}`}
                  className={`border-b ${rowBg} transition-colors`}
                >
                  <td className={`py-3 px-4 text-sm ${text1}`}>{event.eventType}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${SEV_COLORS[event.severity?.toLowerCase()] || "bg-gray-500"}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-sm ${text2} font-mono`}>{event.ipAddress ?? "—"}</td>
                  <td className={`py-3 px-4 text-sm ${text2}`}>
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center">
                  <p className={`text-sm ${text2}`}>No unresolved security events</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SuspiciousIPsCard({ ips, loading, theme }) {
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
  const text1  = isDark ? "text-white"    : "text-gray-900";
  const text2  = isDark ? "text-gray-400" : "text-gray-600";
  const itemBg = isDark ? "bg-white/5"    : "bg-gray-50";

  return (
    <div className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border shadow-sm`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 bg-opacity-10">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${text1}`}>Suspicious IPs</h2>
          <p className={`text-xs ${text2} mt-0.5`}>IPs with multiple failed attempts</p>
        </div>
      </div>

      <div className="space-y-2">
        {ips && ips.length > 0 ? (
          ips.slice(0, 5).map((ip, i) => (
            <div key={i} className={`${itemBg} rounded-lg p-4 flex items-center justify-between`}>
              <div>
                <p className={`text-sm font-mono font-medium ${text1}`}>{ip.ipAddress}</p>
                <p className={`text-xs ${text2} mt-1`}>
                  Last attempt: {new Date(ip.lastAttempt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-500">{ip.attemptCount}</p>
                <p className={`text-xs ${text2}`}>attempts</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 mx-auto mb-2 opacity-30 text-gray-400" />
            <p className={`text-sm ${text2}`}>No suspicious activity</p>
          </div>
        )}
      </div>
    </div>
  );
}