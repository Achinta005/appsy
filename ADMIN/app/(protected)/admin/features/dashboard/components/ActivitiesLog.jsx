import { useState, useEffect } from "react";
import {
    Activity, Clock, User, FileText, Search, Download,
    RefreshCw, ChevronLeft, ChevronRight, Loader2,
    Eye, X, Calendar, Hash, Tag, AlertCircle,
    CheckCircle, Info,
} from "lucide-react";

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    return {
        date: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        relative: mins < 1 ? "Just now" : mins < 60 ? `${mins}m ago` : hrs < 24 ? `${hrs}h ago` : `${days}d ago`,
    };
}

function getTypeColor(type) {
    const MAP = {
        PROJECT_CREATED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        PROJECT_UPDATED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        MESSAGE_RECEIVED: "bg-green-500/20 text-green-400 border-green-500/30",
        BLOG_PUBLISHED: "bg-pink-500/20 text-pink-400 border-pink-500/30",
        USER_REGISTERED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        LOGIN: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
        LOGOUT: "bg-orange-500/20 text-orange-400 border-orange-500/30",
        IP_DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
        NEW_IP_ADDED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        CONTACT_POST: "bg-teal-500/20 text-teal-400 border-teal-500/30",
        NEW_VISITOR: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
    return MAP[type] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
}

function StatusIcon({ status }) {
    switch (status) {
        case "success":
        case "completed":
        case "Completed": return <CheckCircle className="w-4 h-4 text-green-400" />;
        case "error": return <AlertCircle className="w-4 h-4 text-red-400" />;
        case "pending": return <Clock className="w-4 h-4 text-yellow-400" />;
        default: return <Info className="w-4 h-4 text-blue-400" />;
    }
}

export default function ActivitiesLog({ theme }) {
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [stats, setStats] = useState(null);

    const ITEMS_PER_PAGE = 20;
    const isDark = theme === "dark";

    const text1 = isDark ? "text-white" : "text-gray-900";
    const text2 = isDark ? "text-gray-400" : "text-gray-600";
    const text3 = isDark ? "text-gray-300" : "text-gray-700";
    const cardBg = isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-purple-200";
    const inputBg = isDark ? "bg-slate-900/50 border-slate-700" : "bg-white border-purple-200";
    const tblBorder = isDark ? "border-slate-700" : "border-purple-100";
    const tblHover = isDark ? "hover:bg-slate-700/30" : "hover:bg-purple-50";
    const tblHead = isDark ? "bg-slate-800/50" : "bg-purple-50";
    const modalBg = isDark ? "bg-slate-800 border-slate-700" : "bg-white border-purple-200";
    const statCard = isDark ? "bg-slate-800/30" : "bg-white/80";
    const statBorder = isDark ? "border-slate-700/50" : "border-purple-200";
    const detailBg = isDark ? "bg-slate-900/50" : "bg-purple-50";
    const pageBtnBg = isDark
        ? "bg-slate-700 hover:bg-slate-600 border-slate-600"
        : "bg-white hover:bg-gray-50 border-purple-200";

    const fetchActivities = async (page = 1) => {
        setLoading(true);
        try {
            const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/all`);
            url.searchParams.append("page", page.toString());
            url.searchParams.append("limit", ITEMS_PER_PAGE.toString());
            if (typeFilter !== "all") url.searchParams.append("type", typeFilter);

            const res = await fetch(url.toString());
            if (!res.ok) throw new Error("Failed to fetch activities");
            const data = await res.json();

            setActivities(data.activities);
            setFilteredActivities(data.activities);
            setTotalPages(data.pagination.totalPages);
            setCurrentPage(page);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/activity/stats?days=7`);
            if (res.ok) setStats(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchActivities(1); fetchStats(); }, [typeFilter]);

    useEffect(() => {
        setFilteredActivities(
            activities.filter(
                (a) =>
                    a.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    a.type.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, activities]);

    const activityTypes = ["all", ...new Set(activities.map((a) => a.type))];

    const exportToCSV = () => {
        const headers = ["ID", "Type", "Action", "User ID", "Timestamp", "Status"];
        const rows = filteredActivities.map((a) => [
            a.id, a.type, a.action, a.userId || "N/A",
            new Date(a.timestamp).toISOString(), a.status || "N/A",
        ]);
        const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const el = document.createElement("a");
        el.href = url;
        el.download = `activities_${new Date().toISOString()}.csv`;
        el.click();
    };

    return (
        <div className="space-y-4">
            {/* Header card */}
            <div className={`${cardBg} backdrop-blur-xl rounded-xl p-5 border shadow-lg`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className={`text-2xl font-bold ${text1} flex items-center gap-3`}>
                            <Activity className="w-6 h-6 text-purple-400" />
                            Activity Logs
                        </h2>
                        <p className={`${text2} mt-1 text-sm`}>Track and monitor all system activities</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => fetchActivities(currentPage)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center gap-2 text-sm transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" /> Refresh
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white flex items-center gap-2 text-sm transition-colors"
                        >
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats strip */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                        <div className={`${statCard} rounded-lg p-3 border ${statBorder}`}>
                            <p className={`${text2} text-xs`}>Total (7 days)</p>
                            <p className={`text-xl font-bold ${text1} mt-1`}>{stats.total}</p>
                        </div>
                        {stats.byType?.slice(0, 3).map((s) => (
                            <div key={s._id} className={`${statCard} rounded-lg p-3 border ${statBorder}`}>
                                <p className={`${text2} text-xs truncate`}>{s._id}</p>
                                <p className={`text-xl font-bold ${text1} mt-1`}>{s.count}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className={`${cardBg} backdrop-blur-xl rounded-xl p-4 border shadow-lg`}>
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${text2}`} />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full ${inputBg} border rounded-lg pl-10 pr-4 py-2 ${text1} placeholder-gray-400 focus:outline-none text-sm`}
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className={`${inputBg} border rounded-lg px-4 py-2 ${text1} focus:outline-none min-w-40 text-sm cursor-pointer`}
                    >
                        {activityTypes.map((type) => (
                            <option key={type} value={type} className={isDark ? "bg-slate-800" : "bg-white"}>
                                {type === "all" ? "All Types" : type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className={`${cardBg} backdrop-blur-xl rounded-xl border overflow-hidden shadow-lg`}>
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                ) : filteredActivities.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center py-16 ${text2}`}>
                        <Activity className="w-14 h-14 mb-4 opacity-30" />
                        <p>No activities found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed">
                                <colgroup>
                                    <col className="w-[22%]" />
                                    <col className="w-[32%]" />
                                    <col className="w-[20%]" />
                                    <col className="w-[14%]" />
                                    <col className="w-[12%]" />
                                </colgroup>
                                <thead className={`${tblHead} border-b ${tblBorder}`}>
                                    <tr>
                                        {["Type", "Action", "Timestamp", "Status", "Actions"].map((h) => (
                                            <th key={h} className={`px-4 py-3 text-left text-sm font-semibold ${text2}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${tblBorder}`}>
                                    {filteredActivities.map((activity) => {
                                        const t = formatTimestamp(activity.timestamp);
                                        return (
                                            <tr key={activity.id} className={`${tblHover} transition-colors`}>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(activity.type)}`}>
                                                        <Tag className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{activity.type}</span>
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-3 ${text1} text-sm truncate`}>{activity.action}</td>
                                                <td className={`px-4 py-3 text-sm`}>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                                                        <div className="min-w-0">
                                                            <div className={`${text3} truncate text-xs`}>{t.time}</div>
                                                            <div className={`${text2} text-xs`}>{t.relative}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <StatusIcon status={activity.status} />
                                                        <span className={`text-sm ${text3} capitalize truncate`}>
                                                            {activity.status || "N/A"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => setSelectedActivity(activity)}
                                                        className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/40 rounded-lg text-purple-400 text-xs flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className={`flex items-center justify-between px-4 py-3 ${isDark ? "bg-slate-800/30" : "bg-purple-50"} border-t ${tblBorder}`}>
                            <p className={`text-sm ${text2}`}>Page {currentPage} of {totalPages}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchActivities(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-2 ${pageBtnBg} rounded-lg ${text1} disabled:opacity-50 text-sm flex items-center gap-1.5 border transition-colors`}
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </button>
                                <button
                                    onClick={() => fetchActivities(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-2 ${pageBtnBg} rounded-lg ${text1} disabled:opacity-50 text-sm flex items-center gap-1.5 border transition-colors`}
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Detail modal */}
            {selectedActivity && (
                <div
                    className={`fixed inset-0 ${isDark ? "bg-black/50" : "bg-black/30"} backdrop-blur-sm z-50 flex items-center justify-center p-4`}
                    style={{ minHeight: 400 }}
                >
                    <div className={`${modalBg} rounded-xl border max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl`}>
                        {/* Modal header */}
                        <div className={`sticky top-0 ${modalBg} border-b ${tblBorder} p-5 flex items-center justify-between`}>
                            <h2 className={`text-xl font-bold ${text1} flex items-center gap-3`}>
                                <FileText className="w-5 h-5 text-purple-400" />
                                Activity Details
                            </h2>
                            <button
                                onClick={() => setSelectedActivity(null)}
                                className={`p-2 ${isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                            >
                                <X className={`w-5 h-5 ${text2}`} />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="p-5 space-y-4">
                            {[
                                { icon: Hash, label: "Activity ID", value: selectedActivity.id, mono: true },
                                { icon: Activity, label: "Action", value: selectedActivity.action, mono: false },
                                { icon: User, label: "User ID", value: selectedActivity.userId, mono: true, hide: !selectedActivity.userId },
                                { icon: FileText, label: "Entity ID", value: selectedActivity.entityId, mono: true, hide: !selectedActivity.entityId },
                            ].filter((r) => !r.hide).map(({ icon: Icon, label, value, mono }) => (
                                <div key={label} className={`${detailBg} rounded-lg p-4 border ${statBorder}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Icon className={`w-4 h-4 ${text2}`} />
                                        <p className={`text-xs ${text2}`}>{label}</p>
                                    </div>
                                    <p className={`${text1} ${mono ? "font-mono text-sm" : ""}`}>{value}</p>
                                </div>
                            ))}

                            {/* Type badge */}
                            <div className={`${detailBg} rounded-lg p-4 border ${statBorder}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className={`w-4 h-4 ${text2}`} />
                                    <p className={`text-xs ${text2}`}>Type</p>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(selectedActivity.type)}`}>
                                    {selectedActivity.type}
                                </span>
                            </div>

                            {/* Timestamp */}
                            <div className={`${detailBg} rounded-lg p-4 border ${statBorder}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className={`w-4 h-4 ${text2}`} />
                                    <p className={`text-xs ${text2}`}>Timestamp</p>
                                </div>
                                <p className={text1}>
                                    {formatTimestamp(selectedActivity.timestamp).date} at {formatTimestamp(selectedActivity.timestamp).time}
                                </p>
                                <p className={`${text2} text-xs mt-1`}>{formatTimestamp(selectedActivity.timestamp).relative}</p>
                            </div>

                            {/* Status */}
                            <div className={`${detailBg} rounded-lg p-4 border ${statBorder}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className={`w-4 h-4 ${text2}`} />
                                    <p className={`text-xs ${text2}`}>Status</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StatusIcon status={selectedActivity.status} />
                                    <span className={`${text1} capitalize`}>{selectedActivity.status || "N/A"}</span>
                                </div>
                            </div>

                            {/* Metadata */}
                            {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                                <div className={`${detailBg} rounded-lg p-4 border ${statBorder}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText className={`w-4 h-4 ${text2}`} />
                                        <p className={`text-xs ${text2}`}>Metadata</p>
                                    </div>
                                    <pre className={`${isDark ? "bg-black/30" : "bg-white"} rounded-lg p-3 text-xs ${text3} overflow-x-auto border ${isDark ? "border-slate-700" : "border-purple-200"}`}>
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