"use client";

import {
    Users, MessageSquare, FolderOpen, Activity,
    Eye, FileText, Shield, AlertTriangle, Lock,
    LogIn, UserCheck, Zap, Server,
    CheckCircle, RefreshCw, ArrowUpRight,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import StatCard from "./StatCard";
import ActivityFeed from "./ActivityFeed";

// ── Mini sparkline ────────────────────────────────────────────────────────────
function MiniSparkline({ data, color = "#10b981" }) {
    if (!data || data.length === 0) return (
        <div className="h-8 flex items-center">
            <div className="w-full h-px opacity-20" style={{ background: color }} />
        </div>
    );
    const chartData = data.slice(-14).map((v, i) => ({ i, v: v?.count ?? v ?? 0 }));
    return (
        <ResponsiveContainer width="100%" height={32}>
            <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`sg${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone" dataKey="v"
                    stroke={color} strokeWidth={1.5}
                    fill={`url(#sg${color.replace("#", "")})`}
                    dot={false} activeDot={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// ── Reusable panel wrapper ────────────────────────────────────────────────────
function Panel({ children, className = "", isDark }) {
    const bg = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
    return (
        <div className={`${bg} backdrop-blur-lg rounded-xl border shadow-sm ${className}`}>
            {children}
        </div>
    );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, action, onAction, isDark }) {
    const text1 = isDark ? "text-white" : "text-gray-900";
    const text2 = isDark ? "text-gray-400" : "text-gray-500";
    return (
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
                    <Icon className={`w-3.5 h-3.5 ${isDark ? "text-gray-300" : "text-gray-600"}`} />
                </div>
                <div>
                    <h3 className={`text-sm font-bold ${text1} leading-none`}>{title}</h3>
                    {subtitle && (
                        typeof subtitle === "string"
                            ? <p className={`text-xs ${text2} mt-0.5`}>{subtitle}</p>
                            : <div className={`text-xs ${text2} mt-0.5`}>{subtitle}</div>
                    )}
                </div>
            </div>
            {action && (
                <button
                    onClick={onAction}
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-all flex-shrink-0 ml-2
                        ${isDark
                            ? "text-gray-400 hover:text-white hover:bg-white/10"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                >
                    {action} <ArrowUpRight className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}

// ── Analytics Snapshot ────────────────────────────────────────────────────────
function AnalyticsSnapshot({ totalLogins, totalEvents, uniqueUsers, secEventCount, loading, isDark }) {
    const bg = isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200";
    const text1 = isDark ? "text-white" : "text-gray-900";
    const text2 = isDark ? "text-gray-400" : "text-gray-500";
    const items = [
        { icon: LogIn, label: "Total Logins", value: totalLogins, color: "#6366f1" },
        { icon: Zap, label: "Total Events", value: totalEvents, color: "#f59e0b" },
        { icon: UserCheck, label: "Unique Users", value: uniqueUsers, color: "#10b981" },
        { icon: Shield, label: "Sec. Events", value: secEventCount, color: "#f87171" },
    ];
    return (
        <div className="grid grid-cols-2 gap-2">
            {items.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className={`${bg} border rounded-xl p-3 flex items-center gap-2.5`}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}20` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <div className="min-w-0">
                        <p className={`text-xs ${text2} truncate leading-none mb-1`}>{label}</p>
                        <p className={`text-sm font-bold ${text1} tabular-nums leading-none`}>
                            {loading ? <span className="opacity-30">—</span> : (value || 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Security card ─────────────────────────────────────────────────────────────
function SecurityCard({ secEventCount, suspiciousIPsCount, unresolvedSec, loading, isDark, onTabSelect }) {
    const text2 = isDark ? "text-gray-400" : "text-gray-500";
    const allClear = !loading && secEventCount === 0 && suspiciousIPsCount === 0 && unresolvedSec === 0;
    return (
        <Panel isDark={isDark} className="p-4">
            <SectionHeader
                icon={Shield} title="Security"
                subtitle={loading ? "Loading…" : allClear ? "All clear" : "Needs attention"}
                action="View" onAction={() => onTabSelect?.("security")}
                isDark={isDark}
            />
            <div className="space-y-2">
                {[
                    { icon: Shield, label: "Events", value: secEventCount, alert: secEventCount > 0 },
                    { icon: AlertTriangle, label: "Susp. IPs", value: suspiciousIPsCount, alert: suspiciousIPsCount > 0 },
                    { icon: Lock, label: "Unresolved", value: unresolvedSec, alert: unresolvedSec > 0 },
                ].map(({ icon: Icon, label, value, alert }) => (
                    <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Icon className={`w-3 h-3 flex-shrink-0 ${alert ? "text-red-400" : (isDark ? "text-gray-600" : "text-gray-400")}`} />
                            <span className={`text-xs ${text2}`}>{label}</span>
                        </div>
                        <span className={`text-xs font-bold tabular-nums ${alert ? "text-red-400" : "text-emerald-400"}`}>
                            {loading ? "—" : value}
                        </span>
                    </div>
                ))}
            </div>
            {!loading && allClear && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle className="w-3 h-3" /> No threats detected
                </div>
            )}
        </Panel>
    );
}

// ── Users card ────────────────────────────────────────────────────────────────
function UsersCard({ userStatistics, loading, isDark, onTabSelect }) {
    const text1 = isDark ? "text-white" : "text-gray-900";
    const text2 = isDark ? "text-gray-400" : "text-gray-500";
    const total = userStatistics?.total || 0;
    const active = userStatistics?.active || 0;
    const inactive = userStatistics?.inactive || 0;
    const pct = total > 0 ? Math.round((active / total) * 100) : 0;
    return (
        <Panel isDark={isDark} className="p-4">
            <SectionHeader
                icon={Users} title="Users"
                subtitle={loading ? "Loading…" : `${total.toLocaleString()} total`}
                action="View" onAction={() => onTabSelect?.("users")}
                isDark={isDark}
            />
            <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                    <span className={text2}>Active rate</span>
                    <span className="font-bold text-emerald-400">{loading ? "—" : `${pct}%`}</span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                        style={{ width: loading ? "0%" : `${pct}%` }}
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
                {[
                    { label: "Total", value: total, color: text1 },
                    { label: "Active", value: active, color: "text-emerald-400" },
                    { label: "Inactive", value: inactive, color: "text-orange-400" },
                ].map(({ label, value, color }) => (
                    <div key={label}>
                        <p className={`text-sm font-bold ${color} tabular-nums`}>
                            {loading ? "—" : value.toLocaleString()}
                        </p>
                        <p className={`text-xs ${text2}`}>{label}</p>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

// ── Monitoring card ───────────────────────────────────────────────────────────
function MonitoringCard({ logs, insights, sseStatus, isDark, onTabSelect }) {
    const text2 = isDark ? "text-gray-400" : "text-gray-500";
    const errors = logs.filter((l) => l.level === "error").length;
    const warns = logs.filter((l) => l.level === "warn").length;
    const sseDot = sseStatus === "connected" ? "#22c55e"
        : sseStatus === "connecting" ? "#fbbf24"
            : "#ef4444";
    return (
        <Panel isDark={isDark} className="p-4">
            <SectionHeader
                icon={Activity}
                title="Monitoring"
                subtitle={
                    <span className="flex items-center gap-1.5">
                        <span
                            className={sseStatus === "connected" ? "animate-pulse" : ""}
                            style={{ width: 6, height: 6, borderRadius: "50%", background: sseDot, display: "inline-block", flexShrink: 0 }}
                        />
                        <span>{sseStatus === "connected" ? "Live" : sseStatus === "connecting" ? "Connecting…" : "Offline"}</span>
                    </span>
                }
                action="View" onAction={() => onTabSelect?.("monitoring")}
                isDark={isDark}
            />
            <div className="grid grid-cols-3 gap-1 text-center mb-3">
                {[
                    { label: "Logs", value: logs.length, color: "#22d3ee" },
                    { label: "Errors", value: errors, color: "#f87171" },
                    { label: "Warns", value: warns, color: "#fbbf24" },
                ].map(({ label, value, color }) => (
                    <div key={label}>
                        <p className="text-sm font-bold tabular-nums" style={{ color }}>
                            {value.toLocaleString()}
                        </p>
                        <p className={`text-xs ${text2}`}>{label}</p>
                    </div>
                ))}
            </div>
            {insights.length > 0 ? (
                <div
                    className="rounded-lg px-2.5 py-1.5 text-xs leading-snug overflow-hidden"
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        background: "rgba(167,139,250,0.1)",
                        color: "#a78bfa",
                        border: "1px solid rgba(167,139,250,0.2)",
                    }}
                >
                    ⚡ {insights[0].summary}
                </div>
            ) : (
                <p className={`text-xs ${text2} text-center`}>No insights yet</p>
            )}
        </Panel>
    );
}

// ── Services sidebar card ─────────────────────────────────────────────────────
function ServicesCard({ serviceHealth, checkAll, checkingAll, isDark, onTabSelect }) {
    const text2 = isDark ? "text-gray-400" : "text-gray-500";
    const total = Object.keys(serviceHealth).length;
    const up = Object.values(serviceHealth).filter((s) => s.status === "operational").length;
    const healthPct = total > 0 ? Math.round((up / total) * 100) : 0;
    const allGood = total > 0 && up === total;

    return (
        <Panel isDark={isDark} className="p-5">
            <SectionHeader
                icon={Server} title="Services"
                subtitle={total > 0 ? `${up}/${total} operational` : "Not checked yet"}
                action="Details" onAction={() => onTabSelect?.("services")}
                isDark={isDark}
            />

            {total === 0 ? (
                <button
                    onClick={checkAll} disabled={checkingAll}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${checkingAll ? "animate-spin" : ""}`} />
                    {checkingAll ? "Checking…" : "Check All Services"}
                </button>
            ) : (
                <>
                    <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1.5">
                            <span className={text2}>Health score</span>
                            <span className={`font-bold ${allGood ? "text-emerald-400" : "text-amber-400"}`}>
                                {healthPct}%
                            </span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${allGood ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-amber-500 to-orange-400"}`}
                                style={{ width: `${healthPct}%` }}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                        {Object.entries(serviceHealth).map(([id, svc]) => (
                            <div key={id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${svc.status === "operational" ? "bg-emerald-400" : "bg-red-400"}`} />
                                    <span className={`text-xs ${text2} truncate`}>{svc.name}</span>
                                </div>
                                <span className={`text-xs font-mono tabular-nums flex-shrink-0 ml-2 ${svc.status === "operational" ? "text-emerald-400" : "text-red-400"}`}>
                                    {svc.duration != null ? `${svc.duration}ms` : "—"}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={checkAll} disabled={checkingAll}
                        className="w-full py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${checkingAll ? "animate-spin" : ""}`} />
                        {checkingAll ? "Checking…" : "Re-check All"}
                    </button>
                </>
            )}
        </Panel>
    );
}

// ── Quick Actions sidebar card ────────────────────────────────────────────────
function QuickActionsCard({ onFeatureSelect, onTabSelect, isDark }) {
    const actions = [
        { label: "Upload Project", from: "from-blue-500", to: "to-purple-500", cb: () => onFeatureSelect?.("projects") },
        { label: "View Messages", from: "from-emerald-500", to: "to-teal-500", cb: () => onFeatureSelect?.("messages") },
        { label: "Analytics", from: "from-violet-500", to: "to-indigo-500", cb: () => onTabSelect?.("analytics") },
        { label: "Security", from: "from-orange-500", to: "to-red-500", cb: () => onTabSelect?.("security") },
        { label: "Services", from: "from-cyan-500", to: "to-blue-500", cb: () => onTabSelect?.("services") },
        { label: "Monitoring", from: "from-pink-500", to: "to-rose-500", cb: () => onTabSelect?.("monitoring") },
    ];
    return (
        <Panel isDark={isDark} className="p-5">
            <SectionHeader icon={Zap} title="Quick Actions" isDark={isDark} />
            <div className="grid grid-cols-2 gap-2">
                {actions.map(({ label, from, to, cb }) => (
                    <button
                        key={label} onClick={cb}
                        className={`bg-gradient-to-r ${from} ${to} text-white px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between group`}
                    >
                        <span className="truncate">{label}</span>
                        <ArrowUpRight className="w-3 h-3 flex-shrink-0 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                ))}
            </div>
        </Panel>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════════════════════
export default function OverviewTab({
    dashData, dashLoading, dashErrors,
    analytics, analyticsLoading, analyticsErrors,
    activities, isConnected, activityError, refreshActivity, activityLoading,
    serviceHealth, checkingServices, checkAll, checkOne, checkingAll, actionLines,
    logs, insights, sseStatus,
    onFeatureSelect, onTabSelect,
    theme,
}) {
    const isDark = theme === "dark";
    const text2 = isDark ? "text-gray-400" : "text-gray-500";

    const totalEvents = analytics.dashboardMetrics?.activity?.totalEvents?.[0]?.count || 0;
    const totalLogins = analytics.dashboardMetrics?.logins?.total?.[0]?.count || 0;
    const unresolvedSec = analytics.dashboardMetrics?.security?.unresolved?.[0]?.count || 0;
    const uniqueUsers = analytics.dashboardMetrics?.activity?.uniqueUsers?.[0]?.count || 0;
    const secEventCount = analytics.securityEvents?.reduce((s, g) => s + Number(g.count), 0) || 0;
    const suspIPsCount = analytics.suspiciousIPs?.length || 0;

    return (
        <div className="space-y-5">

            {/* ROW 1 — stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { icon: Users, title: "Total Users", value: dashData.users, key: "users", gradient: "from-blue-500 to-purple-500" },
                    { icon: FolderOpen, title: "Projects", value: dashData.projects, key: "projects", gradient: "from-emerald-500 to-teal-500" },
                    { icon: FileText, title: "Blog Posts", value: dashData.blogPosts, key: "blogPosts", gradient: "from-purple-500 to-pink-500" },
                    { icon: MessageSquare, title: "Messages", value: dashData.messages, key: "messages", gradient: "from-orange-500 to-red-500" },
                    { icon: Eye, title: "This Week", value: dashData.weeklyVisits, key: "weeklyVisits", gradient: "from-pink-500 to-rose-500" },
                    { icon: Activity, title: "Total Events", value: totalEvents, key: "events", gradient: "from-cyan-500 to-blue-500" },
                ].map(({ icon, title, value, key, gradient }) => (
                    <StatCard
                        key={key} icon={icon} title={title} value={value} gradient={gradient}
                        isLoading={dashLoading[key] || analyticsLoading.dashboardMetrics}
                        error={dashErrors[key]} theme={theme}
                    />
                ))}
            </div>

            {/* ROW 2 — two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* LEFT — 2/3 */}
                <div className="lg:col-span-2 flex flex-col gap-5">

                    {/* Site Traffic */}
                    <Panel isDark={isDark} className="p-5">
                        <SectionHeader
                            icon={Eye} title="Site Traffic" subtitle="Live visitor stream"
                            action="Analytics" onAction={() => onTabSelect?.("analytics")}
                            isDark={isDark}
                        />
                        <div className="grid grid-cols-2 gap-5">
                            {[
                                { label: "Weekly Visits", value: dashData.weeklyVisits, color: "#6366f1" },
                                {
                                    label: "All-time Visits",
                                    value: Array.isArray(dashData.allVisits)
                                        ? dashData.allVisits.length
                                        : (dashData.allVisits ?? 0),
                                    color: "#10b981",
                                },
                            ].map(({ label, value, color }) => (
                                <div key={label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-xs ${text2}`}>{label}</span>
                                        <span className="text-sm font-bold tabular-nums" style={{ color }}>
                                            {(value ?? 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <MiniSparkline
                                        data={Array.isArray(dashData.allVisits) ? dashData.allVisits : []}
                                        color={color}
                                    />
                                </div>
                            ))}
                        </div>
                    </Panel>

                    {/* Analytics Snapshot */}
                    <Panel isDark={isDark} className="p-5">
                        <SectionHeader
                            icon={Activity} title="Analytics Snapshot" subtitle="Key metrics at a glance"
                            action="Full Analytics" onAction={() => onTabSelect?.("analytics")}
                            isDark={isDark}
                        />
                        <AnalyticsSnapshot
                            totalLogins={totalLogins} totalEvents={totalEvents}
                            uniqueUsers={uniqueUsers} secEventCount={secEventCount}
                            loading={analyticsLoading.dashboardMetrics}
                            isDark={isDark}
                        />
                    </Panel>

                    {/* Triptych — contained grid, no overflow */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <SecurityCard
                            secEventCount={secEventCount}
                            suspiciousIPsCount={suspIPsCount}
                            unresolvedSec={unresolvedSec}
                            loading={analyticsLoading.dashboardMetrics || analyticsLoading.securityEvents}
                            isDark={isDark} onTabSelect={onTabSelect}
                        />
                        <UsersCard
                            userStatistics={analytics.userStatistics}
                            loading={analyticsLoading.userStatistics}
                            isDark={isDark} onTabSelect={onTabSelect}
                        />
                        <MonitoringCard
                            logs={logs} insights={insights} sseStatus={sseStatus}
                            isDark={isDark} onTabSelect={onTabSelect}
                        />
                    </div>
                </div>

                {/* RIGHT SIDEBAR — 1/3 */}
                <div className="flex flex-col gap-5">
                    <ServicesCard
                        serviceHealth={serviceHealth}
                        checkAll={checkAll} checkingAll={checkingAll}
                        isDark={isDark} onTabSelect={onTabSelect}
                    />
                    <QuickActionsCard
                        onFeatureSelect={onFeatureSelect}
                        onTabSelect={onTabSelect}
                        isDark={isDark}
                    />
                </div>
            </div>

            {/* ROW 3 — Activity Feed */}
            <ActivityFeed
                activities={activities}
                isConnected={isConnected}
                error={activityError}
                refresh={refreshActivity}
                isLoading={activityLoading}
                theme={theme}
            />
        </div>
    );
}