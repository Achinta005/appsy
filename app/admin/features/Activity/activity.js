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

  const itemsPerPage = 20;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Activity className="w-8 h-8 text-purple-400" />
                Activity Logs
              </h1>
              <p className="text-gray-400 mt-1">
                Track and monitor all system activities
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchActivities(currentPage)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-400 text-sm">Total (7 days)</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.total}
                </p>
              </div>
              {stats.byType?.slice(0, 3).map((stat) => (
                <div
                  key={stat._id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <p className="text-gray-400 text-sm">{stat._id}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.count}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-400 min-w-[200px]"
              >
                {activityTypes.map((type) => (
                  <option key={type} value={type} className="bg-slate-800">
                    {type === "all" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
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
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Timestamp
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredActivities.map((activity) => {
                      const timeData = formatTimestamp(activity.timestamp);
                      return (
                        <tr
                          key={activity.id}
                          className="hover:bg-white/5 transition-colors"
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
                          <td className="px-4 py-3 text-white text-sm truncate">
                            {activity.action}
                          </td>
                          <td className="px-4 py-3 text-gray-300 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-400 flex-shrink-0" />
                              <div className="min-w-0">
                                <div className="truncate">{timeData.time}</div>
                                <div className="text-xs text-gray-200 truncate">
                                  {timeData.relative}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(activity.status)}
                              <span className="text-sm text-gray-300 capitalize truncate">
                                {activity.status || "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedActivity(activity)}
                              className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg text-purple-300 text-sm flex items-center gap-2 transition-colors"
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

              <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchActivities(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>
                  <button
                    onClick={() => fetchActivities(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                Activity Details
              </h2>
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {selectedActivity.id && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-400">Activity ID</p>
                  </div>
                  <p className="text-white font-mono text-sm">
                    {selectedActivity.id}
                  </p>
                </div>
              )}

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-400">Type</p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getTypeColor(
                    selectedActivity.type
                  )}`}
                >
                  {selectedActivity.type}
                </span>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-400">Action</p>
                </div>
                <p className="text-white">{selectedActivity.action}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-400">Timestamp</p>
                </div>
                <p className="text-white">
                  {formatTimestamp(selectedActivity.timestamp).date} at{" "}
                  {formatTimestamp(selectedActivity.timestamp).time}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {formatTimestamp(selectedActivity.timestamp).relative}
                </p>
              </div>

              {selectedActivity.userId && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-400">User ID</p>
                  </div>
                  <p className="text-white font-mono">
                    {selectedActivity.userId}
                  </p>
                </div>
              )}

              {selectedActivity.entityId && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-400">Entity ID</p>
                  </div>
                  <p className="text-white font-mono">
                    {selectedActivity.entityId}
                  </p>
                </div>
              )}

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-400">Status</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedActivity.status)}
                  <span className="text-white capitalize">
                    {selectedActivity.status || "N/A"}
                  </span>
                </div>
              </div>

              {selectedActivity.metadata &&
                Object.keys(selectedActivity.metadata).length > 0 && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-400">Metadata</p>
                    </div>
                    <pre className="bg-black/30 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
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
