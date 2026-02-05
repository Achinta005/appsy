"use client";

import { useState, useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboarddata";
import { useActivityStream } from "@/hooks/useActivityStream";
import {
  Users,
  MessageSquare,
  FolderOpen,
  Activity,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  TrendingUp,
  Wifi,
  WifiOff,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({
  icon: Icon,
  title,
  value,
  gradient,
  isLoading,
  error,
  theme,
}) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20 hover:border-white/30"
    : "bg-white border-gray-200 hover:border-purple-300";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const valueColor = isDark ? "text-emerald-400" : "text-emerald-600";
  const errorColor = isDark ? "text-red-400" : "text-red-600";

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-4 border transition-all duration-300 shadow-sm hover:shadow-md group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 rounded-lg ${gradient} bg-opacity-10`}>
              <Icon
                className={`w-4 h-4 ${isDark ? "text-white" : "text-gray-700"}`}
              />
            </div>
            <p
              className={`text-xs font-medium ${textMuted} uppercase tracking-wide`}
            >
              {title}
            </p>
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2 mt-1">
              <Loader2 className={`w-4 h-4 ${textPrimary} animate-spin`} />
              <span className={`text-sm ${textMuted}`}>Loading...</span>
            </div>
          ) : error ? (
            <span className={`text-sm ${errorColor} font-medium`}>
              Failed to load
            </span>
          ) : (
            <h3 className={`text-2xl font-bold ${valueColor} tabular-nums`}>
              {value?.toLocaleString() || 0}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

const ServiceStatusCard = ({ service, checking, theme }) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";

  const getStatusColor = () => {
    if (checking) return "bg-yellow-500";
    if (!service) return "bg-gray-500";
    return service.status === "operational" ? "bg-emerald-500" : "bg-red-500";
  };

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-lg p-3 border transition-all shadow-sm`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${textPrimary} truncate`}>
            {service?.name || "Service"}
          </p>
          {checking ? (
            <div className="flex items-center gap-1.5 mt-1">
              <Loader2 className={`w-3 h-3 ${textMuted} animate-spin`} />
              <span className={`text-xs ${textMuted}`}>Checking...</span>
            </div>
          ) : (
            <p className={`text-xs ${textMuted} capitalize mt-1`}>
              {service?.type || "Unknown"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} ${
              checking ? "animate-pulse" : ""
            } shadow-lg`}
          />
        </div>
      </div>
    </div>
  );
};

const VisitsGraph = ({ visits, loading, theme }) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "#475569" : "#cbd5e1";
  const tooltipText = isDark ? "#f1f5f9" : "#1e293b";
  const noDataText = isDark ? "text-gray-400" : "text-gray-500";

  const formatWeekLabel = (weekKey) => {
    if (!weekKey) return "";
    const [year, week] = weekKey.split("-W");
    return `W${week}`;
  };

  const chartData = Array.isArray(visits)
    ? visits.map((v) => ({
        week: v.week,
        visits: v.visits || 0,
        uniqueIPs: v.ipAddresses?.length || 0,
      }))
    : [];

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm h-full flex flex-col`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-10">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>
              Visits Overview
            </h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              Weekly traffic analytics
            </p>
          </div>
        </div>
        {loading && (
          <div
            className={`flex items-center gap-2 text-sm ${textMuted} bg-blue-500/10 px-3 py-1.5 rounded-full`}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Updating...</span>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg"></div>
            <span className={`text-sm font-medium ${textSecondary}`}>
              Total Visits
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg"></div>
            <span className={`text-sm font-medium ${textSecondary}`}>
              Unique IPs
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                opacity={0.5}
              />
              <XAxis
                dataKey="week"
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                tickFormatter={formatWeekLabel}
                stroke={gridColor}
              />
              <YAxis
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                stroke={gridColor}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: "12px",
                  color: tooltipText,
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelFormatter={(label) => `Week ${label.split("-W")[1]}`}
                formatter={(value, name) => [
                  value,
                  name === "visits" ? "Visits" : "Unique IPs",
                ]}
              />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="uniqueIPs"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div
            className={`h-full flex items-center justify-center ${noDataText}`}
          >
            <div className="text-center">
              <Activity className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No visit data available</p>
              <p className="text-xs mt-1 opacity-70">
                Data will appear here once tracked
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function DashboardHome({ onFeatureSelect }) {
  const [theme, setTheme] = useState("light");
  const {
    data,
    loading,
    errors,
    serviceHealth,
    checkingServices,
    refreshAll,
    isLoading,
  } = useDashboardData();
  const { activities, isConnected, error, refresh } = useActivityStream();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isDark = theme === "dark";

  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-blue-50 via-purple-50 to-pink-50";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const activityBg = isDark
    ? "bg-white/5 hover:bg-white/10"
    : "bg-gray-50 hover:bg-gray-100";
  const errorBg = isDark
    ? "bg-red-500/20 border-red-500/50 text-red-300"
    : "bg-red-50 border-red-300 text-red-700";
  const noActivityText = isDark ? "text-gray-400" : "text-gray-500";

  const scrollbarTrack = isDark
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(139, 92, 246, 0.1)";
  const scrollbarThumb = isDark
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(139, 92, 246, 0.3)";
  const scrollbarThumbHover = isDark
    ? "rgba(255, 255, 255, 0.3)"
    : "rgba(139, 92, 246, 0.5)";

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const getActivityColor = (type) => {
    const colors = {
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
    return colors[type] || "bg-gray-500";
  };

  const excludedTypes = ["ANIME_ADDED", "ANIME_UPDATED", "ANIME_REMOVED"];

  const filteredActivities = activities.filter(
    (activity) => !excludedTypes.includes(activity.type),
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Layer */}
      <div
        className={`fixed inset-0 bg-gradient-to-br ${bgGradient} transition-all duration-300`}
      >
        {isDark && (
          <>
            <div
              className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              style={{ animation: "float 7s ease-in-out infinite" }}
            ></div>
            <div
              className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              style={{ animation: "float 7s ease-in-out infinite 2s" }}
            ></div>
            <div
              className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
              style={{ animation: "float 7s ease-in-out infinite 4s" }}
            ></div>
          </>
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`
              : `linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div
          className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-slate-900/50 to-transparent" : "bg-gradient-to-t from-white/30 to-transparent"}`}
        ></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 p-6 max-w-[1600px] mx-auto">
        {/* Stats Grid - Full Width */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={Users}
            title="Total Users"
            value={data.users}
            gradient="from-blue-500 to-purple-500"
            isLoading={loading.users}
            error={errors.users}
            theme={theme}
          />
          <StatCard
            icon={FolderOpen}
            title="Projects"
            value={data.projects}
            gradient="from-emerald-500 to-teal-500"
            isLoading={loading.projects}
            error={errors.projects}
            theme={theme}
          />
          <StatCard
            icon={FileText}
            title="Blog Posts"
            value={data.blogPosts}
            gradient="from-purple-500 to-pink-500"
            isLoading={loading.blogPosts}
            error={errors.blogPosts}
            theme={theme}
          />
          <StatCard
            icon={MessageSquare}
            title="Messages"
            value={data.messages}
            gradient="from-orange-500 to-red-500"
            isLoading={loading.messages}
            error={errors.messages}
            theme={theme}
          />
          <StatCard
            icon={Eye}
            title="This Week"
            value={data.weeklyVisits}
            gradient="from-pink-500 to-rose-500"
            isLoading={loading.weeklyVisits}
            error={errors.weeklyVisits}
            theme={theme}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Visits Graph - 2 columns */}
          <div className="lg:col-span-2 h-[450px]">
            <VisitsGraph
              visits={data.allVisits}
              loading={loading.allVisits}
              theme={theme}
            />
          </div>

          {/* Right Sidebar - 1 column */}
          <div className="space-y-4">
            {/* Service Status */}
            <div
              className={`${cardBg} backdrop-blur-lg rounded-xl p-5 border transition-all shadow-sm`}
            >
              <h3
                className={`text-base font-bold ${textPrimary} mb-4 flex items-center gap-2`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Service Status
              </h3>
              <div className="space-y-2">
                {Object.entries(serviceHealth).map(([id, service]) => (
                  <ServiceStatusCard
                    key={id}
                    service={service}
                    checking={checkingServices[id]}
                    theme={theme}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className={`${cardBg} backdrop-blur-lg rounded-xl p-5 border transition-all shadow-sm`}
            >
              <h3
                className={`text-base font-bold ${textPrimary} mb-4 flex items-center gap-2`}
              >
                <Activity className="w-4 h-4" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-between group"
                  onClick={() => onFeatureSelect && onFeatureSelect("projects")}
                >
                  <span>Upload Project</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-between group"
                  onClick={() => onFeatureSelect && onFeatureSelect("messages")}
                >
                  <span>View Messages</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <button
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-between group"
                  onClick={() =>
                    onFeatureSelect && onFeatureSelect("visitTracker")
                  }
                >
                  <span>Check Analytics</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed - Full Width */}
        <div
          className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm`}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${textPrimary}`}>
                  Recent Activity
                </h2>
                <p className={`text-xs ${textMuted} mt-0.5`}>
                  Real-time activity feed
                </p>
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

          {error && (
            <div className={`mb-4 p-3 ${errorBg} border rounded-lg text-sm`}>
              {error}
            </div>
          )}

          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {filteredActivities.length === 0 ? (
              <div className={`text-center py-12 ${noActivityText}`}>
                <Activity className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No recent activity</p>
                <p className="text-xs mt-1 opacity-70">
                  Activity will appear here in real-time
                </p>
              </div>
            ) : (
              filteredActivities.map((activity, index) => (
                <div
                  key={`${activity.id}-${index}`}
                  className={`flex items-center gap-4 p-3.5 ${activityBg} rounded-xl transition-all animate-slideIn border ${isDark ? "border-white/5" : "border-gray-200"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${getActivityColor(
                      activity.type,
                    )} flex-shrink-0 shadow-lg`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`${textPrimary} text-sm font-medium truncate`}
                    >
                      {activity.action}
                    </p>
                    <p className={`${textMuted} text-xs mt-0.5`}>
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                  {isConnected && index === 0 && (
                    <div className="flex-shrink-0">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `,
        }}
      />
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${scrollbarTrack};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${scrollbarThumb};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${scrollbarThumbHover};
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
