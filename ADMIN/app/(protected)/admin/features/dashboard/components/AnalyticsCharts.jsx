import {
    AreaChart, Area, BarChart, Bar, PieChart as RePieChart,
    Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Users, LogIn, UserCheck, BarChart3 } from "lucide-react";

const COLORS = {
    blue: "#3b82f6", purple: "#8b5cf6", emerald: "#10b981",
    pink: "#ec4899", orange: "#f97316", red: "#ef4444",
    yellow: "#eab308", cyan: "#06b6d4", teal: "#14b8a6", amber: "#f59e0b",
};
const COLOR_VALUES = Object.values(COLORS);

// ── User Growth Area Chart ───────────────────────────────────────────────────
export function UserGrowthChart({ data, loading, theme }) {
    const isDark = theme === "dark";
    const cardBg = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
    const textPrimary = isDark ? "text-white" : "text-gray-900";
    const textMuted = isDark ? "text-gray-400" : "text-gray-600";
    const gridColor = isDark ? "#334155" : "#e2e8f0";
    const tooltipBg = isDark ? "#1e293b" : "#ffffff";
    const tooltipBdr = isDark ? "#475569" : "#cbd5e1";

    return (
        <div className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border shadow-sm h-full flex flex-col`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 bg-opacity-10">
                    <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>User Growth</h2>
                    <p className={`text-xs ${textMuted} mt-0.5`}>New user registrations over time</p>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                            <XAxis dataKey="date" tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }} stroke={gridColor} />
                            <YAxis tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }} stroke={gridColor} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: `1px solid ${tooltipBdr}`,
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                            />
                            <Area type="monotone" dataKey="newUsers" stroke="#10b981" fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <Users className="w-16 h-16 mx-auto mb-3 opacity-30 text-gray-400" />
                            <p className="text-sm font-medium text-gray-400">No growth data available</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Login Methods Dual Donut ─────────────────────────────────────────────────
export function LoginMethodsChart({ data, loading, theme }) {
    const isDark = theme === "dark";

    const card = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
    const text1 = isDark ? "text-white" : "text-gray-900";
    const text2 = isDark ? "text-gray-400" : "text-gray-500";
    const item = isDark ? "bg-white/5" : "bg-gray-50";
    const tip = isDark ? "#0f172a" : "#ffffff";
    const tipBdr = isDark ? "#1e293b" : "#e2e8f0";

    const methodData = data
        ?.map((d, i) => ({
            name: d.method,
            value: Number(d.total) || 0,
            color: COLOR_VALUES[i % COLOR_VALUES.length],
        }))
        .filter((d) => d.value > 0) || [];

    const outcomeData = data
        ? [
            { name: "Successful", value: data.reduce((s, i) => s + (i.successful || 0), 0), color: COLORS.emerald },
            { name: "Failed", value: data.reduce((s, i) => s + (i.failed || 0), 0), color: COLORS.red },
        ].filter((d) => d.value > 0)
        : [];

    const totalMethods = methodData.reduce((s, d) => s + d.value, 0);
    const totalOutcomes = outcomeData.reduce((s, d) => s + d.value, 0);
    const successPct = totalOutcomes > 0
        ? (((outcomeData.find((d) => d.name === "Successful")?.value || 0) / totalOutcomes) * 100).toFixed(0)
        : null;

    const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.08) return null;
        const r = innerRadius + (outerRadius - innerRadius) * 0.55;
        const x = cx + r * Math.cos((-midAngle * Math.PI) / 180);
        const y = cy + r * Math.sin((-midAngle * Math.PI) / 180);
        return (
            <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
                style={{ fontSize: 11, fontWeight: 700 }}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const DonutPanel = ({ title, badge, data: chartData, total, noDataMsg }) => (
        <div className={`${item} rounded-xl p-4 flex flex-col gap-3`}>
            <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${text1}`}>{title}</span>
                {badge && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                        {badge}
                    </span>
                )}
            </div>

            {chartData.length > 0 ? (
                <>
                    <div style={{ position: "relative", height: 160 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={chartData} cx="50%" cy="50%"
                                    innerRadius={50} outerRadius={75}
                                    paddingAngle={3} dataKey="value"
                                    labelLine={false} label={renderLabel} strokeWidth={0}
                                >
                                    {chartData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: tip, border: `1px solid ${tipBdr}`, borderRadius: 10, fontSize: 12 }}
                                    formatter={(val, name) => [val.toLocaleString(), name]}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                        {/* Center label */}
                        <div style={{
                            position: "absolute", inset: 0, display: "flex",
                            flexDirection: "column", alignItems: "center", justifyContent: "center",
                            pointerEvents: "none",
                        }}>
                            <span style={{ fontSize: 18, fontWeight: 800, color: isDark ? "#f0f4ff" : "#0f172a", lineHeight: 1 }}>
                                {total.toLocaleString()}
                            </span>
                            <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: isDark ? "#64748b" : "#94a3b8", marginTop: 3 }}>
                                total
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {chartData.map((entry) => (
                            <div key={entry.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span style={{ width: 8, height: 8, borderRadius: 2, display: "inline-block", background: entry.color }} />
                                    <span className={`text-xs ${text2}`}>{entry.name}</span>
                                </div>
                                <span className={`text-xs font-bold tabular-nums ${text1}`}>
                                    {entry.value.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className={`h-40 flex items-center justify-center ${text2}`}>
                    <p className="text-xs">{noDataMsg}</p>
                </div>
            )}
        </div>
    );

    return (
        <div className={`${card} backdrop-blur-lg rounded-xl p-5 border shadow-sm h-full flex flex-col gap-4`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ background: "rgba(99,102,241,0.15)" }}>
                        <LogIn className="w-4 h-4" style={{ color: "#6366f1" }} />
                    </div>
                    <div>
                        <h2 className={`text-base font-bold ${text1}`}>Authentication</h2>
                        <p className={`text-xs mt-0.5 ${text2}`}>Methods &amp; outcomes</p>
                    </div>
                </div>
                {successPct && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                        <span className="text-xs font-semibold" style={{ color: "#10b981" }}>{successPct}% success</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                <DonutPanel title="Login Methods" data={methodData} total={totalMethods} noDataMsg="No method data" />
                <DonutPanel title="Login Outcomes" badge={successPct ? `${successPct}%` : null}
                    data={outcomeData} total={totalOutcomes} noDataMsg="No outcome data" />
            </div>
        </div>
    );
}

// ── Login Stats Overview ─────────────────────────────────────────────────────
export function LoginStatsOverview({ metrics, loading, theme }) {
    const isDark = theme === "dark";
    const cardBg = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
    const text1 = isDark ? "text-white" : "text-gray-900";
    const text2 = isDark ? "text-gray-400" : "text-gray-600";
    const itemBg = isDark ? "bg-white/5" : "bg-gray-50";

    const logins = metrics?.logins;
    const totalLogins = logins?.total?.[0]?.count || 0;
    const successLogins = logins?.successful?.[0]?.count || 0;
    const failedLogins = logins?.failed?.[0]?.count || 0;
    const uniqueUsers = logins?.uniqueUsers?.[0]?.count || 0;
    const successRate = totalLogins > 0
        ? ((successLogins / totalLogins) * 100).toFixed(1) : 0;

    const CELLS = [
        { icon: "✓", label: "Successful", value: successLogins, sub: `${successRate}% success rate`, iconColor: "text-emerald-500", subColor: "text-emerald-500" },
        { icon: "✕", label: "Failed", value: failedLogins, sub: null, iconColor: "text-red-500", subColor: null },
        { icon: "👥", label: "Unique Users", value: uniqueUsers, sub: null, iconColor: "text-purple-500", subColor: null },
        { icon: "⚡", label: "Total Logins", value: totalLogins, sub: null, iconColor: "text-blue-500", subColor: null },
    ];

    return (
        <div className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border shadow-sm`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 bg-opacity-10">
                    <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className={`text-xl font-bold ${text1}`}>Login Statistics</h2>
                    <p className={`text-xs ${text2} mt-0.5`}>Authentication metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {CELLS.map(({ label, value, sub, iconColor, subColor }) => (
                    <div key={label} className={`${itemBg} rounded-lg p-4`}>
                        <p className={`text-xs ${text2} uppercase mb-2`}>{label}</p>
                        <p className={`text-2xl font-bold ${text1}`}>{value.toLocaleString()}</p>
                        {sub && <p className={`text-xs ${subColor} mt-1`}>{sub}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Activity Events Bar Chart ────────────────────────────────────────────────
export function ActivityEventsChart({ metrics, loading, theme }) {
    const isDark = theme === "dark";
    const cardBg = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
    const textPrimary = isDark ? "text-white" : "text-gray-900";
    const textMuted = isDark ? "text-gray-400" : "text-gray-600";
    const gridColor = isDark ? "#334155" : "#e2e8f0";
    const tooltipBg = isDark ? "#1e293b" : "#ffffff";
    const tooltipBdr = isDark ? "#475569" : "#cbd5e1";

    const topEvents = metrics?.activity?.topEvents || [];
    const chartData = topEvents.map((event, i) => ({
        name: event._id,
        count: event.count,
        color: COLOR_VALUES[i % COLOR_VALUES.length],
    }));

    return (
        <div className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border shadow-sm h-full flex flex-col`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 bg-opacity-10">
                    <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>Top Events</h2>
                    <p className={`text-xs ${textMuted} mt-0.5`}>Most frequent activity types</p>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                                stroke={gridColor} angle={-45} textAnchor="end" height={80}
                            />
                            <YAxis tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }} stroke={gridColor} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: `1px solid ${tooltipBdr}`,
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                            />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                {chartData.map((entry, i) => (
                                    <Cell key={`cell-${i}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <BarChart3 className="w-16 h-16 mx-auto mb-3 opacity-30 text-gray-400" />
                            <p className="text-sm font-medium text-gray-400">No event data available</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}