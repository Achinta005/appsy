"use client";
import { useState, useEffect } from "react";
import {
  Activity,
  Clock,
  User,
  FileText,
  Filter,
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  X,
  Calendar,
  Hash,
  Tag,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [theme, setTheme] = useState("light");

  const itemsPerPage = 20;

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

  const fetchActivities = async (page = 1) => {
    setLoading(true);
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/all`
      );
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", itemsPerPage.toString());
      if (typeFilter !== "all") {
        url.searchParams.append("type", typeFilter);
      }

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Failed to fetch activities");

      const data = await response.json();
      setActivities(data.activities);
      setFilteredActivities(data.activities);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/stats?days=7`
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchActivities(1);
    fetchStats();
  }, [typeFilter]);

  useEffect(() => {
    const filtered = activities.filter(
      (activity) =>
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredActivities(filtered);
  }, [searchTerm, activities]);

  const activityTypes = ["all", ...new Set(activities.map((a) => a.type))];

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      relative: getRelativeTime(date),
    };
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getTypeColor = (type) => {
    const colors = {
      PROJECT_CREATED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      PROJECT_UPDATED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      MESSAGE_RECEIVED: "bg-green-500/20 text-green-400 border-green-500/30",
      BLOG_PUBLISHED: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      USER_REGISTERED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      LOGIN: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      LOGOUT: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      IP_DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
      NEW_IP_ADDED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      ANIME_UPDATED: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
      CONTACT_POST: "bg-teal-500/20 text-teal-400 border-teal-500/30",
      NEW_VISITOR: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
    return colors[type] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Type", "Action", "User ID", "Timestamp", "Status"];
    const rows = filteredActivities.map((a) => [
      a.id,
      a.type,
      a.action,
      a.userId || "N/A",
      new Date(a.timestamp).toISOString(),
      a.status || "N/A",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activities_${new Date().toISOString()}.csv`;
    a.click();
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-blue-50 via-purple-50 to-pink-50";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const textMuted = isDark ? "text-gray-300" : "text-gray-700";
  const cardBg = isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-purple-200";
  const inputBg = isDark ? "bg-slate-900/50 border-slate-700" : "bg-white border-purple-200";
  const inputFocus = isDark ? "focus:border-purple-500" : "focus:border-purple-400";
  const buttonPrimary = isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600";
  const buttonSecondary = isDark ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600";
  const tableBorder = isDark ? "border-slate-700" : "border-purple-100";
  const tableHover = isDark ? "hover:bg-slate-700/30" : "hover:bg-purple-50";
  const modalBg = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-purple-200";
  const modalOverlay = isDark ? "bg-black/50" : "bg-black/30";
  const statCardBg = isDark ? "bg-slate-800/30" : "bg-white/80";
  const statCardBorder = isDark ? "border-slate-700/50" : "border-purple-200";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className={`${cardBg} backdrop-blur-xl rounded-xl p-6 border transition-colors shadow-lg`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${textPrimary} flex items-center gap-3`}>
                <Activity className="w-8 h-8 text-purple-400" />
                Activity Logs
              </h1>
              <p className={`${textSecondary} mt-1`}>
                Track and monitor all system activities
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchActivities(currentPage)}
                className={`px-4 py-2 ${buttonPrimary} rounded-lg text-white flex items-center gap-2 transition-colors shadow-lg`}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className={`px-4 py-2 ${buttonSecondary} rounded-lg text-white flex items-center gap-2 transition-colors shadow-lg`}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className={`${statCardBg} rounded-lg p-4 border ${statCardBorder} transition-colors`}>
                <p className={`${textSecondary} text-sm`}>Total (7 days)</p>
                <p className={`text-2xl font-bold ${textPrimary} mt-1`}>
                  {stats.total}
                </p>
              </div>
              {stats.byType?.slice(0, 3).map((stat) => (
                <div
                  key={stat._id}
                  className={`${statCardBg} rounded-lg p-4 border ${statCardBorder} transition-colors`}
                >
                  <p className={`${textSecondary} text-sm`}>{stat._id}</p>
                  <p className={`text-2xl font-bold ${textPrimary} mt-1`}>
                    {stat.count}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`${cardBg} backdrop-blur-xl rounded-xl p-4 border transition-colors shadow-lg`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${inputBg} border rounded-lg pl-10 pr-4 py-2.5 ${textPrimary} placeholder-gray-400 focus:outline-none ${inputFocus} transition-colors`}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`${inputBg} border rounded-lg px-4 py-2.5 ${textPrimary} focus:outline-none ${inputFocus} min-w-[200px] transition-colors cursor-pointer`}
              >
                {activityTypes.map((type) => (
                  <option key={type} value={type} className={isDark ? "bg-slate-800" : "bg-white"}>
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={`${cardBg} backdrop-blur-xl rounded-xl border overflow-hidden transition-colors shadow-lg`}>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-20 ${textSecondary}`}>
              <Activity className="w-16 h-16 mb-4 opacity-50" />
              <p>No activities found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-[20%]" />
                    <col className="w-[30%]" />
                    <col className="w-[20%]" />
                    <col className="w-[15%]" />
                    <col className="w-[15%]" />
                  </colgroup>
                  <thead className={`${isDark ? 'bg-slate-800/50' : 'bg-purple-50'} border-b ${tableBorder}`}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary}`}>
                        Type
                      </th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary}`}>
                        Action
                      </th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary}`}>
                        Timestamp
                      </th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary}`}>
                        Status
                      </th>
                      <th className={`px-4 py-3 text-left text-sm font-semibold ${textSecondary}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${tableBorder}`}>
                    {filteredActivities.map((activity) => {
                      const timeData = formatTimestamp(activity.timestamp);
                      return (
                        <tr
                          key={activity.id}
                          className={`${tableHover} transition-colors`}
                        >
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                                activity.type
                              )}`}
                            >
                              <Tag className="w-3 h-3 flex-shrink-0 text-blue-400" />
                              <span className="truncate">{activity.type}</span>
                            </span>
                          </td>
                          <td className={`px-4 py-3 ${textPrimary} text-sm truncate`}>
                            {activity.action}
                          </td>
                          <td className={`px-4 py-3 ${textMuted} text-sm`}>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="truncate">{timeData.time}</div>
                                <div className={`text-xs ${textSecondary} truncate`}>
                                  {timeData.relative}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(activity.status)}
                              <span className={`text-sm ${textMuted} capitalize truncate`}>
                                {activity.status || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedActivity(activity)}
                              className="px-3 py-1.5 bg-purple-500/30 hover:bg-purple-600/50 rounded-lg text-amber-600 text-sm flex items-center gap-2 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">Details</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className={`flex items-center justify-between px-4 py-3 ${isDark ? 'bg-slate-800/30' : 'bg-purple-50'} border-t ${tableBorder} transition-colors`}>
                <p className={`text-sm ${textSecondary}`}>
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchActivities(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-50'} rounded-lg ${textPrimary} disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm shadow-md border ${isDark ? 'border-slate-600' : 'border-purple-200'}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <button
                    onClick={() => fetchActivities(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-50'} rounded-lg ${textPrimary} disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm shadow-md border ${isDark ? 'border-slate-600' : 'border-purple-200'}`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedActivity && (
        <div className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-colors`}>
          <div className={`${modalBg} rounded-xl border max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-colors`}>
            <div className={`sticky top-0 ${modalBg} border-b ${tableBorder} p-6 flex items-center justify-between transition-colors`}>
              <h2 className={`text-2xl font-bold ${textPrimary} flex items-center gap-3`}>
                <FileText className="w-6 h-6 text-purple-400" />
                Activity Details
              </h2>
              <button
                onClick={() => setSelectedActivity(null)}
                className={`p-2 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
              >
                <X className={`w-5 h-5 ${textSecondary}`} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedActivity.id && (
                <div className={`${isDark ? 'bg-slate-900/50' : 'bg-purple-50'} rounded-lg p-4 border ${statCardBorder} transition-colors`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className={`w-4 h-4 ${textSecondary}`} />
                    <p className={`text-sm ${textSecondary}`}>Activity ID</p>
                  </div>
                  <p className={`${textPrimary} font-mono text-sm`}>
                    {selectedActivity.id}
                  </p>
                </div>
              )}

              <div className={`${isDark ? 'bg-slate-900/50' : 'bg-purple-50'} rounded-lg p-4 border ${statCardBorder} transition-colors`}>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className={`w-4 h-4 ${textSecondary}`} />
                  <p className={`text-sm ${textSecondary}`}>Type</p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getTypeColor(
                    selectedActivity.type
                  )}`}
                >
                  {selectedActivity.type}
                </span>
              </div>

              <div className={`${isDark ? 'bg-slate-900/50' : 'bg-purple-50'} rounded-lg p-4 border ${statCardBorder} transition-colors`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className={`w-4 h-4 ${textSecondary}`} />
                  <p className={`text-sm ${textSecondary}`}>Action</p>
                </div>
                <p className={textPrimary}>{selectedActivity.action}</p>
              </div>

              <div className={`${isDark ? 'bg-slate-900/50' : 'bg-purple-50'} rounded-lg p-4 border ${statCardBorder} transition-colors`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className={`w-4 h-4 ${textSecondary}`} />
                  <p className={`text-sm ${textSecondary}`}>Timestamp</p>
                </div>
                <p className={textPrimary}>
                  {formatTimestamp(selectedActivity.timestamp).date} at{" "}
                  {formatTimestamp(selectedActivity.timestamp).time}
                </p>
                <p className={`${textSecondary} text-sm mt-1`}>
                  {formatTimestamp(selectedActivity.timestamp).relative}
                </p>
              </div>

              {selectedActivity.userId && (
                <div className={`${isDark ? 'bg-slate-900/50' : 'bg-purple-50'} rounded-lg p-4 border ${statCardBorder} transition-colors`}>
                  <div className="flex items-center gap-2 mb-2">
                    <User className={`w-4 h-4 ${textSecondary}`} />
                    <p className={`text-sm ${textSecondary}`}>User ID</p>
                  </div>
                  <p className={`${textPrimary} font-mono`}>
                    {selectedActivity.userId}
                  </p>
                </div>
              )}

              {selectedActivity.entityId && (
                <div className={`${isDark ? 'bg-slate-900/50' : 'bg-purple-50'} rounded-lg p-4 border ${statCardBorder} transition-colors`}>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className={`w-4 h-4 ${textSecondary}`} />
                    <p className={`text-sm ${textSecondary}`}>Entity ID</p>
                  </div>
                  <p className={`${textPrimary} font-mono`}>
                    {selectedActivity.entityId}
                  </p>
                </div>
              )}

              <div className={`${isDark ? 'bg-slate-900/50' : 'bg-purple-50'} rounded-lg p-4 border ${statCardBorder} transition-colors`}>
                <div className="flex items-center gap-2 mb-2">
                  <Info className={`w-4 h-4 ${textSecondary}`} />
                  <p className={`text-sm ${textSecondary}`}>Status</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedActivity.status)}
                  <span className={`${textPrimary} capitalize`}>
                    {selectedActivity.status || "N/A"}
                  </span>
                </div>
              </div>

              {selectedActivity.metadata &&
                Object.keys(selectedActivity.metadata).length > 0 && (
                  <div className={`${isDark ? 'bg-slate-900/50' : 'bg-purple-50'} rounded-lg p-4 border ${statCardBorder} transition-colors`}>
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className={`w-4 h-4 ${textSecondary}`} />
                      <p className={`text-sm ${textSecondary}`}>Metadata</p>
                    </div>
                    <pre className={`${isDark ? 'bg-black/30' : 'bg-white'} rounded-lg p-4 text-sm ${textMuted} overflow-x-auto border ${isDark ? 'border-slate-700' : 'border-purple-200'}`}>
                      {JSON.stringify(selectedActivity.metadata, null, 2)}
                    </pre>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}