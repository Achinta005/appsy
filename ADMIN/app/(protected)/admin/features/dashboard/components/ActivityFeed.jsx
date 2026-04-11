'use client'
import { useEffect } from "react";
import { Activity, Wifi, WifiOff, RefreshCw, Loader2 } from "lucide-react";


const ACTIVITY_COLORS = {
  PROJECT_CREATED: "bg-blue-500",
  PROJECT_UPDATED: "bg-purple-500",
  MESSAGE_RECEIVED: "bg-emerald-500",
  BLOG_PUBLISHED: "bg-pink-500",
  USER_REGISTERED: "bg-amber-500",
  NEW_IP_ADDED: "bg-cyan-500",
  ROLE_UPDATE: "bg-orange-500",
  CONTACT_POST: "bg-teal-500",
  IP_DELETE: "bg-red-500",
  NEW_VISITOR: "bg-green-500",
};

const EXCLUDED_TYPES = [
  "token_refreshed",
];

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export default function ActivityFeed({
  activities,
  isConnected,
  error,
  refresh,
  isLoading,
  theme,
}) {
  const isDark = theme === "dark";

  const cardBg = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const activityBg = isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-50 hover:bg-gray-100";
  const errorBg = isDark
    ? "bg-red-500/20 border-red-500/50 text-red-300"
    : "bg-red-50 border-red-300 text-red-700";
  const noActivityText = isDark ? "text-gray-400" : "text-gray-500";

  const scrollbarStyle = {
    "--scrollbar-track": isDark ? "rgba(255,255,255,0.05)" : "rgba(139,92,246,0.1)",
    "--scrollbar-thumb": isDark ? "rgba(255,255,255,0.2)" : "rgba(139,92,246,0.3)",
  };

  // useEffect(() => {
  //   console.log("Activities updated:", activities);
  // }, [activities])
  

  const filtered = activities.filter(
    (a) => !EXCLUDED_TYPES.includes(a.type)
  );

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>Recent Activity</h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>Real-time activity feed</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <Wifi className="w-3.5 h-3.5" />
              <span>Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Disconnected</span>
            </div>
          )}
          <button
            onClick={refresh}
            className={`flex items-center gap-1.5 text-xs ${textMuted} hover:${textPrimary} transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className={`mb-4 p-3 ${errorBg} border rounded-lg text-sm`}>
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        </div>
      )}

      {/* Feed */}
      {!isLoading && (
        <div
          className="space-y-2 max-h-80 overflow-y-auto"
          style={scrollbarStyle}
        >
          {filtered.length === 0 ? (
            <div className={`text-center py-12 ${noActivityText}`}>
              <Activity className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No recent activity</p>
              <p className="text-xs mt-1 opacity-70">
                Activity will appear here in real-time
              </p>
            </div>
          ) : (
            filtered.map((activity, index) => (
              <div
                key={`${activity.id}-${index}`}
                className={`flex items-center gap-4 p-3.5 ${activityBg} rounded-xl transition-all border ${isDark ? "border-white/5" : "border-gray-200"
                  }`}
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 shadow-lg ${ACTIVITY_COLORS[activity.type] || "bg-gray-500"
                    }`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`${textPrimary} text-sm font-medium truncate`}>
                    {activity.action}
                  </p>
                  <p className={`${textMuted} text-xs mt-0.5`}>
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
                {isConnected && index === 0 && (
                  <div className="flex-shrink-0">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}