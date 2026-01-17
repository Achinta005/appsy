import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Users,
  RefreshCw,
  TrendingDown,
  Award,
  Activity,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/app/context/authContext";
import useApi from "@/services/authservices";

export default function WeeklyVisitsDashboard() {
  const [visits, setVisits] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("bar");
  const [weeksToShow, setWeeksToShow] = useState("all");
  const [expandedWeeks, setExpandedWeeks] = useState(new Set());
  const [theme, setTheme] = useState("light");
  const {accessToken} = useAuth();
  const apiFetch = useApi();

  const API_BASE = process.env.NEXT_PUBLIC_SERVER_API_URL;

  // Initialize and listen for theme changes
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

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (weeksToShow !== "all") {
      fetchRecentWeeks(parseInt(weeksToShow));
    } else {
      fetchVisits();
    }
  }, [weeksToShow]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [visitsRes, statsRes, currentWeekRes] = await Promise.all([
        apiFetch(`${API_BASE}/track/visits`),
        apiFetch(`${API_BASE}/track/visits/stats/summary`),
        apiFetch(`${API_BASE}/track/visits/current/week`),
      ]);

      if (!visitsRes.ok || !statsRes.ok || !currentWeekRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const visitsData = await visitsRes.json();
      const statsData = await statsRes.json();
      const currentWeekData = await currentWeekRes.json();

      setVisits(visitsData);
      setStats(statsData);
      setCurrentWeek(currentWeekData);
    } catch (err) {
      setError(err.message);
      setVisits([
        {
          week: "2025-W48",
          visits: 145,
          ipAddresses: ["192.168.1.1", "192.168.1.2", "10.0.0.1"],
          lastUpdated: "2025-12-01T10:00:00Z",
        },
        {
          week: "2025-W49",
          visits: 203,
          ipAddresses: ["192.168.1.1", "192.168.1.3", "10.0.0.2", "172.16.0.1"],
          lastUpdated: "2025-12-08T10:00:00Z",
        },
        {
          week: "2025-W50",
          visits: 178,
          ipAddresses: ["192.168.1.1", "10.0.0.1", "172.16.0.2"],
          lastUpdated: "2025-12-14T10:00:00Z",
        },
        {
          week: "2025-W51",
          visits: 89,
          ipAddresses: ["192.168.1.4", "10.0.0.3"],
          lastUpdated: "2025-12-15T14:22:01Z",
        },
      ]);
      setStats({
        totalVisits: 615,
        totalWeeks: 4,
        totalUniqueIPs: 8,
        averagePerWeek: 154,
        averageUniqueIPsPerWeek: 3,
        highestWeek: { week: "2025-W49", visits: 203, uniqueIPs: 4 },
        lowestWeek: { week: "2025-W51", visits: 89, uniqueIPs: 2 },
        trend: -50.0,
      });
      setCurrentWeek({ week: "2025-W51", visits: 89, uniqueIPs: 2 });
    } finally {
      setLoading(false);
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await apiFetch(`${API_BASE}/track/visits`);
      if (!response.ok) throw new Error("Failed to fetch visits");
      const data = await response.json();
      setVisits(data);
    } catch (err) {
      console.error("Error fetching visits:", err);
    }
  };

  const fetchRecentWeeks = async (weeks) => {
    try {
      const response = await apiFetch(`${API_BASE}/track/visits/recent/${weeks}`);
      if (!response.ok) throw new Error("Failed to fetch recent weeks");
      const data = await response.json();
      setVisits(data);
    } catch (err) {
      console.error("Error fetching recent weeks:", err);
    }
  };

  const toggleWeekExpansion = (week) => {
    setExpandedWeeks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(week)) {
        newSet.delete(week);
      } else {
        newSet.add(week);
      }
      return newSet;
    });
  };

  const formatWeekLabel = (weekKey) => {
    const [year, week] = weekKey.split("-W");
    return `Week ${week}, ${year}`;
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-blue-50 via-purple-50 to-pink-50";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-600";
  const textMuted = isDark ? "text-slate-300" : "text-gray-700";
  const cardBg = isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-purple-200";
  const buttonBg = isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-purple-100 hover:bg-purple-200";
  const buttonText = isDark ? "text-white" : "text-purple-900";
  const selectBg = isDark ? "bg-slate-700 text-slate-300 border-slate-600 focus:border-purple-500" : "bg-white text-gray-900 border-purple-300 focus:border-purple-400";
  const viewButtonActive = isDark ? "bg-purple-600 text-white" : "bg-purple-500 text-white";
  const viewButtonInactive = isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-purple-100 text-purple-900 hover:bg-purple-200";
  const tableBorder = isDark ? "border-slate-700" : "border-purple-200";
  const tableHover = isDark ? "hover:bg-slate-700/30" : "hover:bg-purple-50";
  const expandedRowBg = isDark ? "bg-slate-900/50" : "bg-purple-50/50";
  const ipBadgeBg = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-purple-200";
  const errorBg = isDark ? "bg-yellow-900/30 border-yellow-500/50 text-yellow-200" : "bg-yellow-50 border-yellow-300 text-yellow-800";
  const errorTextSub = isDark ? "text-yellow-300/70" : "text-yellow-700";
  const loadingSpinner = isDark ? "border-purple-500" : "border-purple-600";
  const chartGrid = isDark ? "#334155" : "#e2e8f0";
  const chartTick = isDark ? "#94a3b8" : "#64748b";
  const chartTooltipBg = isDark ? "#1e293b" : "#ffffff";
  const chartTooltipBorder = isDark ? "#475569" : "#cbd5e1";
  const chartTooltipText = isDark ? "#f1f5f9" : "#1e293b";
  const chartBar = isDark ? "#8b5cf6" : "#a855f7";
  const chartLine = isDark ? "#8b5cf6" : "#a855f7";
  const emptyText = isDark ? "text-slate-400" : "text-gray-500";

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br ${bgGradient} transition-colors duration-300`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${loadingSpinner} mx-auto mb-4`}></div>
          <p className={`${textMuted} text-lg`}>Loading visits data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen bg-gradient-to-br ${bgGradient} p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className={`text-3xl sm:text-4xl font-bold ${textPrimary} flex items-center gap-3`}>
              <Calendar className={`w-8 h-8 sm:w-10 sm:h-10 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
              Weekly Visits Analytics
            </h1>
            <button
              onClick={fetchAllData}
              className={`flex items-center gap-2 px-4 py-2 ${buttonBg} ${buttonText} rounded-lg transition-colors shadow-md`}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <p className={`${textSecondary} text-base sm:text-lg`}>
            Track your website traffic and unique visitors over time
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 ${errorBg} border rounded-lg transition-colors`}>
            <p className="font-medium">
              Using demo data (API endpoint not configured)
            </p>
            <p className={`text-sm ${errorTextSub} mt-1`}>
              Configure your API endpoint to see live data
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 shadow-xl transition-colors`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondary} text-sm font-medium`}>Total Visits</p>
              <Users className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
            </div>
            <p className={`text-3xl font-bold ${textPrimary}`}>
              {stats?.totalVisits?.toLocaleString() || 0}
            </p>
            <p className={`${textSecondary} text-xs mt-1`}>
              Across {stats?.totalWeeks || 0} weeks
            </p>
          </div>

          <div className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 shadow-xl transition-colors`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondary} text-sm font-medium`}>Unique IPs</p>
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <p className={`text-3xl font-bold ${textPrimary}`}>
              {stats?.totalUniqueIPs?.toLocaleString() || 0}
            </p>
            <p className={`${textSecondary} text-xs mt-1`}>
              All-time unique visitors
            </p>
          </div>

          <div className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 shadow-xl transition-colors`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondary} text-sm font-medium`}>Avg per Week</p>
              <Activity className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
            </div>
            <p className={`text-3xl font-bold ${textPrimary}`}>
              {stats?.averagePerWeek?.toLocaleString() || 0}
            </p>
            <p className={`${textSecondary} text-xs mt-1`}>
              {stats?.averageUniqueIPsPerWeek || 0} unique IPs/week
            </p>
          </div>

          <div className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 shadow-xl transition-colors`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondary} text-sm font-medium`}>Trend</p>
              {stats?.trend >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <p
              className={`text-3xl font-bold ${
                stats?.trend >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {stats?.trend > 0 ? "+" : ""}
              {stats?.trend?.toFixed(1) || 0}%
            </p>
            <p className={`${textSecondary} text-xs mt-1`}>Week-over-week</p>
          </div>

          <div className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 shadow-xl transition-colors`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondary} text-sm font-medium`}>This Week</p>
              <Calendar className="w-5 h-5 text-cyan-400" />
            </div>
            <p className={`text-3xl font-bold ${textPrimary}`}>
              {currentWeek?.visits?.toLocaleString() || 0}
            </p>
            <p className={`${textSecondary} text-xs mt-1`}>
              {currentWeek?.uniqueIPs || 0} unique IPs
            </p>
          </div>
        </div>

        {stats?.highestWeek && stats?.lowestWeek && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className={`${isDark ? 'bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/50' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'} backdrop-blur-sm border rounded-xl p-6 shadow-xl transition-colors`}>
              <div className="flex items-center gap-3 mb-3">
                <Award className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <h3 className={`text-lg font-semibold ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                  Best Week
                </h3>
              </div>
              <div className="flex items-baseline gap-2">
                <p className={`text-4xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {stats.highestWeek.visits.toLocaleString()}
                </p>
                <p className={textSecondary}>visits</p>
              </div>
              <p className={`${textSecondary} text-sm mt-2`}>
                {formatWeekLabel(stats.highestWeek.week)} •{" "}
                {stats.highestWeek.uniqueIPs} unique IPs
              </p>
            </div>

            <div className={`${isDark ? 'bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-700/50' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300'} backdrop-blur-sm border rounded-xl p-6 shadow-xl transition-colors`}>
              <div className="flex items-center gap-3 mb-3">
                <TrendingDown className={`w-6 h-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                <h3 className={`text-lg font-semibold ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
                  Lowest Week
                </h3>
              </div>
              <div className="flex items-baseline gap-2">
                <p className={`text-4xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                  {stats.lowestWeek.visits.toLocaleString()}
                </p>
                <p className={textSecondary}>visits</p>
              </div>
              <p className={`${textSecondary} text-sm mt-2`}>
                {formatWeekLabel(stats.lowestWeek.week)} •{" "}
                {stats.lowestWeek.uniqueIPs} unique IPs
              </p>
            </div>
          </div>
        )}

        <div className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 shadow-xl mb-6 transition-colors`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h2 className={`text-xl font-semibold ${textPrimary}`}>
              Visits Timeline
            </h2>
            <div className="flex flex-wrap gap-3">
              <select
                value={weeksToShow}
                onChange={(e) => setWeeksToShow(e.target.value)}
                className={`px-4 py-2 ${selectBg} rounded-lg border focus:outline-none transition-colors cursor-pointer`}
              >
                <option value="all">All Weeks</option>
                <option value="4">Last 4 Weeks</option>
                <option value="8">Last 8 Weeks</option>
                <option value="12">Last 12 Weeks</option>
                <option value="26">Last 6 Months</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewType("bar")}
                  className={`px-4 py-2 rounded-lg transition-colors shadow-md ${
                    viewType === "bar" ? viewButtonActive : viewButtonInactive
                  }`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setViewType("line")}
                  className={`px-4 py-2 rounded-lg transition-colors shadow-md ${
                    viewType === "line" ? viewButtonActive : viewButtonInactive
                  }`}
                >
                  Line
                </button>
              </div>
            </div>
          </div>

          {visits.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              {viewType === "bar" ? (
                <BarChart
                  data={visits}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                  <XAxis
                    dataKey="week"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fill: chartTick, fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: chartTick, fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTooltipBg,
                      border: `1px solid ${chartTooltipBorder}`,
                      borderRadius: "8px",
                      color: chartTooltipText,
                    }}
                    formatter={(value) => [value, "Visits"]}
                    labelFormatter={formatWeekLabel}
                    cursor={false}
                  />
                  <Bar dataKey="visits" fill={chartBar} radius={[8, 8, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart
                  data={visits}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                  <XAxis
                    dataKey="week"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fill: chartTick, fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: chartTick, fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTooltipBg,
                      border: `1px solid ${chartTooltipBorder}`,
                      borderRadius: "8px",
                      color: chartTooltipText,
                    }}
                    formatter={(value) => [value, "Visits"]}
                    labelFormatter={formatWeekLabel}
                  />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke={chartLine}
                    strokeWidth={3}
                    dot={{ fill: chartLine, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className={`h-96 flex items-center justify-center ${emptyText}`}>
              No data available
            </div>
          )}
        </div>

        <div className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 shadow-xl transition-colors`}>
          <h2 className={`text-xl font-semibold ${textPrimary} mb-4`}>
            Detailed Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${tableBorder}`}>
                  <th className={`text-left py-3 px-4 ${textMuted} font-medium`}>
                    Week
                  </th>
                  <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>
                    Visits
                  </th>
                  <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>
                    Unique IPs
                  </th>
                  <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>
                    Change
                  </th>
                  <th className={`text-right py-3 px-4 ${textMuted} font-medium`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visits.map((item, index) => {
                  const prevVisits =
                    index > 0 ? visits[index - 1].visits : null;
                  const change = prevVisits
                    ? ((item.visits - prevVisits) / prevVisits) * 100
                    : null;
                  const isExpanded = expandedWeeks.has(item.week);
                  const ipAddresses = item.ipAddresses || [];

                  return (
                    <React.Fragment key={item.week}>
                      <tr className={`border-b ${tableBorder} ${tableHover} transition-colors`}>
                        <td className={`py-3 px-4 ${textPrimary} font-medium`}>
                          {formatWeekLabel(item.week)}
                        </td>
                        <td className={`py-3 px-4 text-right ${isDark ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>
                          {item.visits.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-400 font-semibold">
                          {ipAddresses.length}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {change !== null ? (
                            <span
                              className={`font-medium ${
                                change >= 0 ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {change > 0 ? "+" : ""}
                              {change.toFixed(1)}%
                            </span>
                          ) : (
                            <span className={textSecondary}>-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {ipAddresses.length > 0 && (
                            <button
                              onClick={() => toggleWeekExpansion(item.week)}
                              className={`inline-flex items-center gap-1 px-3 py-1 ${buttonBg} ${buttonText} rounded-lg transition-colors text-sm shadow-md`}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Hide IPs
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  View IPs
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                      {isExpanded && ipAddresses.length > 0 && (
                        <tr className={expandedRowBg}>
                          <td colSpan={5} className="py-4 px-4">
                            <div className="pl-4">
                              <p className={`${textSecondary} text-sm font-medium mb-2 flex items-center gap-2`}>
                                <Globe className="w-4 h-4" />
                                IP Addresses ({ipAddresses.length})
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {ipAddresses.map((ip, idx) => (
                                  <div
                                    key={idx}
                                    className={`${ipBadgeBg} border rounded-lg px-3 py-2 text-sm font-mono ${textMuted} transition-colors`}
                                  >
                                    {ip}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}