"use client";

import { useState, useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboarddata";
import { useActivityStream } from "@/hooks/useActivityStream";
import { useAnalytics } from "@/hooks/useAnalytics";
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
  TrendingDown,
  Wifi,
  WifiOff,
  ArrowUpRight,
  Shield,
  AlertTriangle,
  LogIn,
  UserCheck,
  BarChart3,
  Lock,
  XCircle,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const COLORS = {
  blue: "#3b82f6",
  purple: "#8b5cf6",
  emerald: "#10b981",
  pink: "#ec4899",
  orange: "#f97316",
  red: "#ef4444",
  yellow: "#eab308",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  amber: "#f59e0b",
};

// ==================== STAT CARD COMPONENT ====================
const StatCard = ({
  icon: Icon,
  title,
  value,
  gradient,
  isLoading,
  error,
  theme,
  trend,
  trendValue,
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
            <>
              <h3 className={`text-2xl font-bold ${valueColor} tabular-nums`}>
                {value?.toLocaleString() || 0}
              </h3>
              {trend && (
                <div
                  className={`flex items-center gap-1 mt-2 text-xs ${
                    trend === "up" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{trendValue}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== SERVICE STATUS CARD ====================
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

// ==================== VISITS GRAPH COMPONENT ====================
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

// ==================== USER GROWTH CHART ====================
const UserGrowthChart = ({ data, loading, theme }) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "#475569" : "#cbd5e1";

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm h-full flex flex-col`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 bg-opacity-10">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>User Growth</h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              New user registrations over time
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
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
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No growth data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== LOGIN METHODS CHART ====================
const LoginMethodsChart = ({ data, loading, theme }) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";

  const chartData =
    data?.map((item, index) => ({
      name: item.method,
      value: item.count,
      color: Object.values(COLORS)[index % Object.values(COLORS).length],
    })) || [];

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm h-full flex flex-col`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10">
            <LogIn className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>
              Login Methods
            </h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              Authentication method distribution
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <LogIn className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No login data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== LOGIN STATS OVERVIEW ====================
const LoginStatsOverview = ({ metrics, loading, theme }) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const itemBg = isDark ? "bg-white/5" : "bg-gray-50";

  const logins = metrics?.logins;
  const totalLogins = logins?.total?.[0]?.count || 0;
  const successfulLogins = logins?.successful?.[0]?.count || 0;
  const failedLogins = logins?.failed?.[0]?.count || 0;
  const uniqueUsers = logins?.uniqueUsers?.[0]?.count || 0;
  const successRate =
    totalLogins > 0 ? ((successfulLogins / totalLogins) * 100).toFixed(1) : 0;

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 bg-opacity-10">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>
              Login Statistics
            </h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              Authentication metrics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`${itemBg} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <p className={`text-xs ${textMuted} uppercase`}>Successful</p>
          </div>
          <p className={`text-2xl font-bold ${textPrimary}`}>
            {successfulLogins.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-500 mt-1">
            {successRate}% success rate
          </p>
        </div>

        <div className={`${itemBg} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <p className={`text-xs ${textMuted} uppercase`}>Failed</p>
          </div>
          <p className={`text-2xl font-bold ${textPrimary}`}>
            {failedLogins.toLocaleString()}
          </p>
        </div>

        <div className={`${itemBg} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-500" />
            <p className={`text-xs ${textMuted} uppercase`}>Unique Users</p>
          </div>
          <p className={`text-2xl font-bold ${textPrimary}`}>
            {uniqueUsers.toLocaleString()}
          </p>
        </div>

        <div className={`${itemBg} rounded-lg p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <p className={`text-xs ${textMuted} uppercase`}>Total Logins</p>
          </div>
          <p className={`text-2xl font-bold ${textPrimary}`}>
            {totalLogins.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== ACTIVITY EVENTS CHART ====================
const ActivityEventsChart = ({ metrics, loading, theme }) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const gridColor = isDark ? "#334155" : "#e2e8f0";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "#475569" : "#cbd5e1";

  const topEvents = metrics?.activity?.topEvents || [];
  const chartData = topEvents.map((event, index) => ({
    name: event._id,
    count: event.count,
    color: Object.values(COLORS)[index % Object.values(COLORS).length],
  }));

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm h-full flex flex-col`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 bg-opacity-10">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>Top Events</h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              Most frequent activity types
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                stroke={gridColor}
                angle={-45}
                textAnchor="end"
                height={80}
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
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No event data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== SECURITY EVENTS TABLE ====================
const SecurityEventsTable = ({ events, loading, theme }) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const rowBg = isDark
    ? "hover:bg-white/5 border-white/10"
    : "hover:bg-gray-50 border-gray-200";

  const getSeverityColor = (severity) => {
    const colors = {
      critical: "bg-red-500",
      high: "bg-orange-500",
      medium: "bg-yellow-500",
      low: "bg-blue-500",
    };
    return colors[severity?.toLowerCase()] || "bg-gray-500";
  };

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 bg-opacity-10">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>
              Security Events
            </h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              Unresolved security incidents
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${isDark ? "border-white/10" : "border-gray-200"}`}
            >
              <th
                className={`text-left py-3 px-4 text-sm font-semibold ${textPrimary}`}
              >
                Type
              </th>
              <th
                className={`text-left py-3 px-4 text-sm font-semibold ${textPrimary}`}
              >
                Severity
              </th>
              <th
                className={`text-left py-3 px-4 text-sm font-semibold ${textPrimary}`}
              >
                IP Address
              </th>
              <th
                className={`text-left py-3 px-4 text-sm font-semibold ${textPrimary}`}
              >
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {events && events.length > 0 ? (
              events.slice(0, 10).map((event) => (
                <tr
                  key={event._id}
                  className={`border-b ${rowBg} transition-colors`}
                >
                  <td className={`py-3 px-4 text-sm ${textPrimary}`}>
                    {event.eventType}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getSeverityColor(event.severity)}`}
                    >
                      {event.severity}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-sm ${textMuted} font-mono`}>
                    {event.ipAddress}
                  </td>
                  <td className={`py-3 px-4 text-sm ${textMuted}`}>
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className={`text-sm ${textMuted}`}>No security events</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==================== SUSPICIOUS IPS CARD ====================
const SuspiciousIPsCard = ({ ips, loading, theme }) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const itemBg = isDark ? "bg-white/5" : "bg-gray-50";

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 bg-opacity-10">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>
              Suspicious IPs
            </h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              IPs with multiple failed attempts
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {ips && ips.length > 0 ? (
          ips.slice(0, 5).map((ip, index) => (
            <div
              key={index}
              className={`${itemBg} rounded-lg p-4 flex items-center justify-between`}
            >
              <div>
                <p className={`text-sm font-mono font-medium ${textPrimary}`}>
                  {ip.ipAddress}
                </p>
                <p className={`text-xs ${textMuted} mt-1`}>
                  Last attempt: {new Date(ip.lastAttempt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-red-500">
                  {ip.attemptCount}
                </p>
                <p className={`text-xs ${textMuted}`}>attempts</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 mx-auto mb-2 opacity-30 text-gray-400" />
            <p className={`text-sm ${textMuted}`}>No suspicious activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== TOP ACTIVE USERS ====================
const TopActiveUsers = ({ users, loading, theme }) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const itemBg = isDark ? "bg-white/5" : "bg-gray-50";

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>
              Top Active Users
            </h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              Most engaged users by activity
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {users && users.length > 0 ? (
          users.slice(0, 8).map((user, index) => (
            <div
              key={user._id}
              className={`${itemBg} rounded-lg p-3 flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className={`text-sm font-medium ${textPrimary}`}>
                    User ID: {user._id.substring(0, 8)}...
                  </p>
                  <p className={`text-xs ${textMuted}`}>
                    Last active: {new Date(user.lastActive).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${textPrimary}`}>
                  {user.activityCount}
                </p>
                <p className={`text-xs ${textMuted}`}>activities</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-30 text-gray-400" />
            <p className={`text-sm ${textMuted}`}>No user activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== USER STATISTICS CARD ====================
const UserStatisticsCard = ({ stats, loading, theme }) => {
  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const itemBg = isDark ? "bg-white/5" : "bg-gray-50";

  const totalUsers = stats?.totalUsers || 0;
  const activeUsers = stats?.activeUsers || 0;
  const inactiveUsers = stats?.inactiveUsers || 0;
  const activePercentage =
    totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0;

  return (
    <div
      className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border transition-all shadow-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 bg-opacity-10">
            <UserCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>
              User Statistics
            </h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>
              User engagement metrics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className={`${itemBg} rounded-lg p-4 text-center`}>
          <p className={`text-xs ${textMuted} uppercase mb-2`}>Total</p>
          <p className={`text-2xl font-bold ${textPrimary}`}>
            {totalUsers.toLocaleString()}
          </p>
        </div>

        <div className={`${itemBg} rounded-lg p-4 text-center`}>
          <p className={`text-xs ${textMuted} uppercase mb-2`}>Active</p>
          <p className="text-2xl font-bold text-emerald-500">
            {activeUsers.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-500 mt-1">{activePercentage}%</p>
        </div>

        <div className={`${itemBg} rounded-lg p-4 text-center`}>
          <p className={`text-xs ${textMuted} uppercase mb-2`}>Inactive</p>
          <p className="text-2xl font-bold text-orange-500">
            {inactiveUsers.toLocaleString()}
          </p>
        </div>
      </div>

      {stats?.usersByRole && stats.usersByRole.length > 0 && (
        <>
          <h3 className={`text-sm font-semibold ${textPrimary} mb-3 mt-6`}>
            Users by Role
          </h3>
          <div className="space-y-2">
            {stats.usersByRole.map((role, index) => (
              <div
                key={index}
                className={`${itemBg} rounded-lg p-3 flex items-center justify-between`}
              >
                <p className={`text-sm ${textPrimary} capitalize`}>
                  {role._id || "Unknown"}
                </p>
                <p className={`text-sm font-bold ${textPrimary}`}>
                  {role.count}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function EnhancedDashboard({ onFeatureSelect }) {
  const [theme, setTheme] = useState("light");
  const [selectedDays, setSelectedDays] = useState(30);
  const [activeTab, setActiveTab] = useState("overview");

  // Original hooks
  const {
    data,
    loading,
    errors,
    serviceHealth,
    checkingServices,
    refreshAll: refreshDashboard,
    isLoading: isDashboardLoading,
  } = useDashboardData();

  const {
    activities,
    isConnected,
    error: activityError,
    refresh: refreshActivity,
  } = useActivityStream();

  // New analytics hook
  const {
    data: analyticsData,
    loading: analyticsLoading,
    errors: analyticsErrors,
    refreshAll: refreshAnalytics,
    isLoading: isAnalyticsLoading,
  } = useAnalytics(selectedDays);

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
  const tabActive = isDark
    ? "bg-white/20 text-white border-white/30"
    : "bg-purple-100 text-purple-700 border-purple-300";
  const tabInactive = isDark
    ? "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
    : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200";

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

  const handleRefreshAll = async () => {
    await Promise.all([
      refreshDashboard(),
      refreshAnalytics(),
      refreshActivity(),
    ]);
  };

  // Calculate metrics from analytics data
  const totalEvents =
    analyticsData.dashboardMetrics?.activity?.totalEvents?.[0]?.count || 0;
  const totalLogins =
    analyticsData.dashboardMetrics?.logins?.total?.[0]?.count || 0;
  const unresolvedSecurityEvents =
    analyticsData.dashboardMetrics?.security?.unresolved?.[0]?.count || 0;

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
      <div className="relative z-10 p-6 max-w-[1800px] mx-auto">
        {/* Header with Controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
              Analytics Dashboard
            </h1>
            <p className={`text-sm ${textMuted}`}>
              Comprehensive system metrics and insights
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Time Period Selector */}
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(Number(e.target.value))}
              className={`${cardBg} ${textPrimary} px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-all`}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={handleRefreshAll}
              disabled={isDashboardLoading || isAnalyticsLoading}
              className={`flex items-center gap-2 ${cardBg} ${textPrimary} px-4 py-2 rounded-lg border font-medium transition-all hover:shadow-lg disabled:opacity-50`}
            >
              <RefreshCw
                className={`w-4 h-4 ${isDashboardLoading || isAnalyticsLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "overview" ? tabActive : tabInactive
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "analytics" ? tabActive : tabInactive
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "security" ? tabActive : tabInactive
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "users" ? tabActive : tabInactive
            }`}
          >
            Users
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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
              <StatCard
                icon={Activity}
                title="Total Events"
                value={totalEvents}
                gradient="from-cyan-500 to-blue-500"
                isLoading={analyticsLoading.dashboardMetrics}
                error={analyticsErrors.dashboardMetrics}
                theme={theme}
              />
            </div>

            {/* Main Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Visits Graph - 2 columns */}
              <div className="lg:col-span-2 h-[450px]">
                <VisitsGraph
                  visits={data.allVisits}
                  loading={loading.allVisits}
                  theme={theme}
                />
              </div>

              {/* Right Sidebar */}
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
                      onClick={() =>
                        onFeatureSelect && onFeatureSelect("projects")
                      }
                    >
                      <span>Upload Project</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                    <button
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-between group"
                      onClick={() =>
                        onFeatureSelect && onFeatureSelect("messages")
                      }
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

            {/* Recent Activity Feed */}
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
                    onClick={refreshActivity}
                    className={`flex items-center gap-1.5 text-xs ${textMuted} hover:${textPrimary} transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                </div>
              </div>

              {activityError && (
                <div
                  className={`mb-4 p-3 ${errorBg} border rounded-lg text-sm`}
                >
                  {activityError}
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
          </>
        )}

        {/* Analytics Tab Content */}
        {activeTab === "analytics" && (
          <>
            {/* Analytics Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={LogIn}
                title="Total Logins"
                value={totalLogins}
                gradient="from-blue-500 to-cyan-500"
                isLoading={analyticsLoading.dashboardMetrics}
                error={analyticsErrors.dashboardMetrics}
                theme={theme}
              />
              <StatCard
                icon={Activity}
                title="Total Events"
                value={totalEvents}
                gradient="from-purple-500 to-pink-500"
                isLoading={analyticsLoading.dashboardMetrics}
                error={analyticsErrors.dashboardMetrics}
                theme={theme}
              />
              <StatCard
                icon={UserCheck}
                title="Unique Users"
                value={
                  analyticsData.dashboardMetrics?.activity?.uniqueUsers?.[0]
                    ?.count || 0
                }
                gradient="from-emerald-500 to-teal-500"
                isLoading={analyticsLoading.dashboardMetrics}
                error={analyticsErrors.dashboardMetrics}
                theme={theme}
              />
              <StatCard
                icon={Shield}
                title="Security Events"
                value={unresolvedSecurityEvents}
                gradient="from-orange-500 to-red-500"
                isLoading={analyticsLoading.dashboardMetrics}
                error={analyticsErrors.dashboardMetrics}
                theme={theme}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="h-[400px]">
                <UserGrowthChart
                  data={analyticsData.userGrowth}
                  loading={analyticsLoading.userGrowth}
                  theme={theme}
                />
              </div>
              <div className="h-[400px]">
                <LoginMethodsChart
                  data={analyticsData.loginAnalytics}
                  loading={analyticsLoading.loginAnalytics}
                  theme={theme}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <LoginStatsOverview
                metrics={analyticsData.dashboardMetrics}
                loading={analyticsLoading.dashboardMetrics}
                theme={theme}
              />
              <div className="h-[400px]">
                <ActivityEventsChart
                  metrics={analyticsData.dashboardMetrics}
                  loading={analyticsLoading.dashboardMetrics}
                  theme={theme}
                />
              </div>
            </div>
          </>
        )}

        {/* Security Tab Content */}
        {activeTab === "security" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard
                icon={Shield}
                title="Security Events"
                value={analyticsData.securityEvents?.length || 0}
                gradient="from-red-500 to-orange-500"
                isLoading={analyticsLoading.securityEvents}
                error={analyticsErrors.securityEvents}
                theme={theme}
              />
              <StatCard
                icon={AlertTriangle}
                title="Suspicious IPs"
                value={analyticsData.suspiciousIPs?.length || 0}
                gradient="from-orange-500 to-yellow-500"
                isLoading={analyticsLoading.suspiciousIPs}
                error={analyticsErrors.suspiciousIPs}
                theme={theme}
              />
              <StatCard
                icon={Lock}
                title="Unresolved"
                value={unresolvedSecurityEvents}
                gradient="from-yellow-500 to-amber-500"
                isLoading={analyticsLoading.dashboardMetrics}
                error={analyticsErrors.dashboardMetrics}
                theme={theme}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SecurityEventsTable
                events={analyticsData.securityEvents}
                loading={analyticsLoading.securityEvents}
                theme={theme}
              />
              <SuspiciousIPsCard
                ips={analyticsData.suspiciousIPs}
                loading={analyticsLoading.suspiciousIPs}
                theme={theme}
              />
            </div>
          </>
        )}

        {/* Users Tab Content */}
        {activeTab === "users" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={Users}
                title="Total Users"
                value={analyticsData.userStatistics?.totalUsers || 0}
                gradient="from-blue-500 to-purple-500"
                isLoading={analyticsLoading.userStatistics}
                error={analyticsErrors.userStatistics}
                theme={theme}
              />
              <StatCard
                icon={UserCheck}
                title="Active Users"
                value={analyticsData.userStatistics?.activeUsers || 0}
                gradient="from-emerald-500 to-teal-500"
                isLoading={analyticsLoading.userStatistics}
                error={analyticsErrors.userStatistics}
                theme={theme}
              />
              <StatCard
                icon={Users}
                title="Inactive Users"
                value={analyticsData.userStatistics?.inactiveUsers || 0}
                gradient="from-orange-500 to-red-500"
                isLoading={analyticsLoading.userStatistics}
                error={analyticsErrors.userStatistics}
                theme={theme}
              />
              <StatCard
                icon={Activity}
                title="Unique Active"
                value={
                  analyticsData.dashboardMetrics?.logins?.uniqueUsers?.[0]
                    ?.count || 0
                }
                gradient="from-purple-500 to-pink-500"
                isLoading={analyticsLoading.dashboardMetrics}
                error={analyticsErrors.dashboardMetrics}
                theme={theme}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserStatisticsCard
                stats={analyticsData.userStatistics}
                loading={analyticsLoading.userStatistics}
                theme={theme}
              />
              <TopActiveUsers
                users={analyticsData.dashboardMetrics?.topUsers || []}
                loading={analyticsLoading.dashboardMetrics}
                theme={theme}
              />
            </div>
          </>
        )}
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
