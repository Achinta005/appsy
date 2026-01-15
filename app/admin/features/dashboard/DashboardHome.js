"use client";

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
  Activity as ActivityIcon,
  Wifi,
  WifiOff,
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

const StatCard = ({ icon: Icon, title, value, gradient, isLoading, error }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20 hover:border-white/40 transition-all">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-serif text-white truncate">{title}</p>
          {isLoading ? (
            <div className="flex items-center gap-1 mt-0.5">
              <Loader2 className="w-3 h-3 text-white animate-spin" />
              <span className="text-xs text-gray-400">...</span>
            </div>
          ) : error ? (
            <span className="text-xs text-red-400">Error</span>
          ) : (
            <h3 className="text-sm font-bold text-green-500 font-mono">
              {value || 0}
            </h3>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ServiceStatusCard = ({ service, checking }) => {
  const getStatusColor = () => {
    if (checking) return "bg-yellow-500";
    if (!service) return "bg-gray-500";
    return service.status === "operational" ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20 hover:border-white/40 transition-all">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-serif text-white truncate">
              {service?.name || "Service"}
            </p>
            {checking ? (
              <div className="flex items-center gap-1 mt-0.5">
                <Loader2 className="w-3 h-3 text-white animate-spin" />
                <span className="text-xs text-gray-400">Checking...</span>
              </div>
            ) : (
              <h3 className="text-xs text-gray-400 font-mono capitalize">
                {service?.type || "Unknown"}
              </h3>
            )}
          </div>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${getStatusColor()} ${
            checking ? "animate-pulse" : ""
          } flex-shrink-0`}
        />
      </div>
    </div>
  );
};

const VisitsGraph = ({ visits, loading }) => {
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
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 h-2/3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Visits Overview
        </h2>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Updating...
          </div>
        )}
        {chartData.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-6 text-sm mr-10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-300">Total Visits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-300">Unique IPs</span>
            </div>
          </div>
        )}
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="week"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={formatWeekLabel}
            />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
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
        <div className="h-[240px] flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No visit data available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function DashboardHome({ onFeatureSelect }) {
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

  // Format timestamp
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
      PROJECT_CREATED: "bg-blue-400",
      PROJECT_UPDATED: "bg-purple-400",
      MESSAGE_RECEIVED: "bg-green-400",
      BLOG_PUBLISHED: "bg-pink-400",
      USER_REGISTERED: "bg-yellow-400",
    };
    return colors[type] || "bg-gray-400";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 space-y-4 p-6 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        {/* <div className="flex justify-end">
          <button
            onClick={refreshAll}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 absolute top-3"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Stats Grid - Left Column */}
          <div className="lg:col-span-1 space-y-2">
            <StatCard
              icon={Users}
              title="Total Users"
              value={data.users}
              gradient="from-blue-500 to-purple-500"
              isLoading={loading.users}
              error={errors.users}
            />
            <StatCard
              icon={FolderOpen}
              title="Projects"
              value={data.projects}
              gradient="from-green-500 to-teal-500"
              isLoading={loading.projects}
              error={errors.projects}
            />
            <StatCard
              icon={FileText}
              title="Blog Posts"
              value={data.blogPosts}
              gradient="from-purple-500 to-pink-500"
              isLoading={loading.blogPosts}
              error={errors.blogPosts}
            />
            <StatCard
              icon={MessageSquare}
              title="Messages"
              value={data.messages}
              gradient="from-orange-500 to-red-500"
              isLoading={loading.messages}
              error={errors.messages}
            />
            <StatCard
              icon={Eye}
              title="This Week"
              value={data.weeklyVisits}
              gradient="from-pink-500 to-rose-500"
              isLoading={loading.weeklyVisits}
              error={errors.weeklyVisits}
            />

            {/* Service Status Cards */}
            {Object.entries(serviceHealth).map(([id, service]) => (
              <ServiceStatusCard
                key={id}
                service={service}
                checking={checkingServices[id]}
              />
            ))}
          </div>

          {/* Visits Graph - Right Column */}
          <div className="lg:col-span-3">
            <VisitsGraph visits={data.allVisits} loading={loading.allVisits} />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1"
              onClick={() => onFeatureSelect && onFeatureSelect("projects")}
            >
              Upload Project
            </button>
            <button
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1"
              onClick={() => onFeatureSelect && onFeatureSelect("messages")}
            >
              View Messages
            </button>
            <button
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1"
              onClick={() => onFeatureSelect && onFeatureSelect("visitTracker")}
            >
              Check Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ActivityIcon className="w-5 h-5" />
              Recent Activity
            </h2>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="flex items-center gap-1.5 text-xs text-green-400">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-red-400">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Disconnected</span>
                </div>
              )}
              <button
                onClick={refresh}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ActivityIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer animate-slideIn"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${getActivityColor(
                      activity.type
                    )} flex-shrink-0`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">
                      {activity.action}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                  {isConnected && activity.id === activities[0]?.id && (
                    <div className="flex-shrink-0">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
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
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
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
