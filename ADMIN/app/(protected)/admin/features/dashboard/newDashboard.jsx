"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useBackgroundContext } from "@/app/(protected)/context/BackgroundContext";
import { useAuth } from "@/app/(protected)/context/authContext";
import {
    Users, MessageSquare, FolderOpen, Activity,
    Eye, FileText, RefreshCw, Shield, AlertTriangle,
    Lock, LogIn, UserCheck, ArrowUpRight,
} from "lucide-react";

// ── existing hooks ───────────────────────────────────────────────────────────
import { useDashboardData } from "@/hooks/useDashboarddata";
import { useActivityStream } from "@/hooks/useActivityStream";
import { useAnalytics } from "@/hooks/useAnalytics";

// ── component imports ────────────────────────────────────────────────────────
import StatCard from "./components/StatCard";
import TabBar from "./components/TabBar";
import OverviewTab from "./components/overview";
import ServiceHealthGrid from "./components/ServiceHealthGrid";
import ServerMonitoring from "./components/ServerMonitoring";
import ActivitiesLog from "./components/ActivitiesLog";
import {
    UserGrowthChart,
    LoginMethodsChart,
    LoginStatsOverview,
    ActivityEventsChart,
} from "./components/AnalyticsCharts";
import {
    SecurityEventsTable,
    SuspiciousIPsCard,
} from "./components/SecurityPanel";
import {
    UserStatisticsCard,
    TopActiveUsers,
} from "./components/UsersPanel";

// ── service config (used only for the Services tab summary) ──────────────────
const SERVICES_COUNT = 5;

// ── log parsers ──────────────────────────────────────────────────────────────
let _uid = 0;

function parseLog(raw) {
    try {
        const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
        const msg = obj.message || "";
        const methodMatch = msg.match(/^(GET|POST|PUT|DELETE|PATCH)\s/);
        return {
            _uid: ++_uid,
            level: (obj.level || "info").toLowerCase(),
            method: methodMatch?.[1] || null,
            path: obj.path || null,
            status: obj.statusCode || null,
            duration: obj.duration !== undefined ? obj.duration : null,
            ip: obj.ip || null,
            message: msg,
            ts: obj.ts ? new Date(obj.ts) : new Date(),
            raw: JSON.stringify(obj, null, 2),
        };
    } catch {
        return {
            _uid: ++_uid, level: "info",
            message: String(raw), ts: new Date(), raw: String(raw),
        };
    }
}

function parseInsight(raw, eventType) {
    try {
        const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
        return {
            _uid: ++_uid,
            type: obj.type || "insight",
            severity: obj.severity || "low",
            summary: obj.summary || "",
            context: obj.context || null,
            recommendation: obj.recommendation || null,
            occurrences: obj.occurrences || 1,
            affectedPaths: obj.affectedPaths || [],
            metrics: obj.metrics || null,
            analyzedAt: obj.analyzedAt ? new Date(obj.analyzedAt) : new Date(),
            isLive: eventType === "insight:live",
            raw: JSON.stringify(obj, null, 2),
        };
    } catch {
        return null;
    }
}

// ── main component ───────────────────────────────────────────────────────────
export default function MergedDashboard({ onFeatureSelect }) {
    const { theme } = useBackgroundContext();
    const { isAuthenticated } = useAuth();
    const isDark = theme === "dark";

    // ── UI-only state ──────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedDays, setSelectedDays] = useState(30);

    // ── SSE: logs + insights (no existing hook for these) ─────────────────────
    const [logs, setLogs] = useState([]);
    const [insights, setInsights] = useState([]);
    const [sseStatus, setSseStatus] = useState("disconnected");
    const logESRef = useRef(null);
    const insightESRef = useRef(null);
    const reconRef = useRef(null);
    const attempts = useRef(0);

    // ── theme helpers ──────────────────────────────────────────────────────────
    const cardBg = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
    const textPrimary = isDark ? "text-white" : "text-gray-900";
    const textMuted = isDark ? "text-gray-400" : "text-gray-600";

    // ══════════════════════════════════════════════════════════════════════════
    // EXISTING HOOKS — delegate all data fetching here
    // ══════════════════════════════════════════════════════════════════════════

    const {
        data: dashData,
        loading: dashLoading,
        errors: dashErrors,
        serviceHealth,
        checkingServices,
        checkServiceHealth,
        checkAllServices,
        refreshAll: refreshDashboard,
        isLoading: dashIsLoading,
    } = useDashboardData();

    const {
        activities,
        isConnected,
        error: activityError,
        refresh: refreshActivity,
        reconnect: reconnectActivity,
        isLoading: activityLoading,
    } = useActivityStream();

    const {
        data: analytics,
        loading: analyticsLoading,
        errors: analyticsErrors,
        refreshAll: refreshAnalytics,
        isLoading: analyticsIsLoading,
    } = useAnalytics(selectedDays);

    // ── derive values used across tabs ────────────────────────────────────────
    const totalEvents = analytics.dashboardMetrics?.activity?.totalEvents?.[0]?.count || 0;
    const totalLogins = analytics.dashboardMetrics?.logins?.total?.[0]?.count || 0;
    const unresolvedSec = analytics.dashboardMetrics?.security?.unresolved?.[0]?.count || 0;
    const uniqueUsers = analytics.dashboardMetrics?.activity?.uniqueUsers?.[0]?.count || 0;
    const secEventCount = analytics.securityEvents?.reduce((s, g) => s + Number(g.count), 0) || 0;
    const isRefreshing = dashIsLoading || analyticsIsLoading;

    // ── service health shim: useDashboardData exposes `serviceHealth` as the
    //    overall string; we need the per-service map for ServiceHealthGrid.
    //    The hook already returns the map as `serviceHealth` (object keyed by id).
    //    We just need checkingAll and actionLines which we build locally. ────────
    const [checkingAll, setCheckingAll] = useState(false);
    const [actionLines, setActionLines] = useState([]);

    const checkAll = useCallback(async () => {
        setCheckingAll(true);
        setActionLines([{ kind: "sys", text: "▶  Running health checks…", ts: new Date() }]);
        await checkAllServices();
        setActionLines((p) => [
            { kind: "ok", text: "✅  All checks complete", ts: new Date() },
            ...p,
        ]);
        setCheckingAll(false);
    }, [checkAllServices]);

    // wrap checkServiceHealth so ServiceHealthGrid gets the action-line side-effect
    const checkOne = useCallback(async (svc) => {
        const t0 = Date.now();
        const ok = await checkServiceHealth(svc);
        const dur = Date.now() - t0;
        setActionLines((p) => [
            {
                kind: ok ? "ok" : "err",
                text: ok
                    ? `✓ ${svc.name}: Healthy · ${dur}ms`
                    : `✗ ${svc.name}: unreachable`,
                ts: new Date(),
            },
            ...p,
        ].slice(0, 50));
    }, [checkServiceHealth]);

    // ══════════════════════════════════════════════════════════════════════════
    // LOG + INSIGHT SSE  (no existing hook — kept inline intentionally)
    // ══════════════════════════════════════════════════════════════════════════

    const connectLogStream = useCallback(() => {
        setSseStatus("connecting");
        const BASE = process.env.NEXT_PUBLIC_SERVER_API_URL;
        const es = new EventSource(`${BASE}/logs/stream`);
        logESRef.current = es;

        es.onopen = () => { setSseStatus("connected"); attempts.current = 0; };

        es.addEventListener("log:history", (e) => {
            const log = parseLog(e.data);
            setLogs((p) => [...p, log].slice(0, 1000));
        });
        es.addEventListener("log:live", (e) => {
            const log = parseLog(e.data);
            setLogs((p) => [log, ...p].slice(0, 1000));
        });
        es.onmessage = (e) => {
            if (!e.data || e.data === "ping") return;
            try {
                const parsed = JSON.parse(e.data);
                if (!parsed?.level && !parsed?.message) return;
                setLogs((p) => [...p, parseLog(e.data)].slice(0, 1000));
            } catch { }
        };
        es.onerror = () => {
            setSseStatus("disconnected");
            es.close();
            if (attempts.current < 5) {
                attempts.current++;
                reconRef.current = setTimeout(connectLogStream, 3000);
            }
        };
    }, []);

    const connectInsightStream = useCallback(() => {
        const BASE = process.env.NEXT_PUBLIC_SERVER_API_URL;
        const es = new EventSource(`${BASE}/logs/insights/stream?limit=80`);
        insightESRef.current = es;

        es.addEventListener("insight:history", (e) => {
            const ins = parseInsight(e.data, "insight:history");
            if (ins) setInsights((p) => [...p, ins].slice(0, 1000));
        });
        es.addEventListener("insight:live", (e) => {
            const ins = parseInsight(e.data, "insight:live");
            if (ins) setInsights((p) => [ins, ...p].slice(0, 1000));
        });
        es.onerror = () => { };
    }, []);

    // ── mount: start log/insight streams + initial health check ───────────────
    useEffect(() => {
        connectLogStream();
        connectInsightStream();
        checkAll();
        return () => {
            logESRef.current?.close();
            insightESRef.current?.close();
            clearTimeout(reconRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── refresh analytics when selectedDays changes ────────────────────────────
    // useAnalytics(selectedDays) already re-fetches when days prop changes,
    // so nothing extra needed here.

    // ── global refresh ─────────────────────────────────────────────────────────
    const handleRefreshAll = useCallback(() => {
        refreshDashboard();
        refreshAnalytics();
        refreshActivity();
        checkAll();
    }, [refreshDashboard, refreshAnalytics, refreshActivity, checkAll]);

    // ══════════════════════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* ── frosted glass overlay over parent's matrix bg ── */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.45)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                }}
            />
            {/* ── content ───────────────────────────────────────────────────────── */}
            <div className="relative z-10 p-6 max-w-[1800px] mx-auto">

                {/* ── page header ───────────────────────────────────────────────── */}
                <div className={`flex items-center justify-between mb-8 flex-wrap gap-4 
    px-6 py-4 rounded-2xl border backdrop-blur-md
    ${isDark
                        ? "bg-white/5 border-white/10 shadow-[0_0_40px_rgba(0,255,128,0.04)]"
                        : "bg-white/60 border-gray-200/60 shadow-sm"
                    }`}
                >
                    {/* Left: title + breadcrumb-style subtitle */}
                    <div className="flex items-center gap-4">
                        {/* Accent bar */}
                        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-500 shrink-0" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-2xl font-bold tracking-tight ${textPrimary}`}>
                                    Admin Dashboard
                                </h1>
                                {/* Live badge */}
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <p className={`text-xs ${textMuted} mt-0.5 flex items-center gap-1.5`}>
                                <span>Comprehensive system metrics and insights</span>
                                <span className={`${isDark ? "text-white/20" : "text-gray-300"}`}>·</span>
                                <span className={`${isDark ? "text-emerald-400/70" : "text-emerald-600"}`}>
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Right: controls */}
                    <div className="flex items-center gap-2">
                        {["analytics", "users", "security"].includes(activeTab) && (
                            <select
                                value={selectedDays}
                                onChange={(e) => setSelectedDays(Number(e.target.value))}
                                className={`px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer outline-none transition-all
                    ${isDark
                                        ? "bg-white/8 border-white/15 text-white hover:bg-white/12 hover:border-white/25"
                                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                {[7, 14, 30, 60, 90].map((d) => (
                                    <option key={d} value={d}>Last {d} days</option>
                                ))}
                            </select>
                        )}

                        <button
                            onClick={handleRefreshAll}
                            disabled={isRefreshing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all
                ${isDark
                                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]"
                                    : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                            {isRefreshing ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>
                </div>

                {/* ── tab bar ───────────────────────────────────────────────────── */}
                <TabBar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />


                {activeTab === "overview" && (
                    <OverviewTab
                        // dash data
                        dashData={dashData}
                        dashLoading={dashLoading}
                        dashErrors={dashErrors}
                        // analytics
                        analytics={analytics}
                        analyticsLoading={analyticsLoading}
                        analyticsErrors={analyticsErrors}
                        // activity stream
                        activities={activities}
                        isConnected={isConnected}
                        activityError={activityError}
                        refreshActivity={refreshActivity}
                        activityLoading={activityLoading}
                        // service health
                        serviceHealth={serviceHealth}
                        checkingServices={checkingServices}
                        checkAll={checkAll}
                        checkOne={checkOne}
                        checkingAll={checkingAll}
                        actionLines={actionLines}
                        // logs / monitoring
                        logs={logs}
                        insights={insights}
                        sseStatus={sseStatus}
                        // callbacks
                        onFeatureSelect={onFeatureSelect}
                        onTabSelect={setActiveTab}
                        // theme
                        theme={theme}
                    />
                )}

                {activeTab === "analytics" && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { icon: LogIn, title: "Total Logins", value: totalLogins },
                                { icon: Activity, title: "Total Events", value: totalEvents },
                                { icon: UserCheck, title: "Unique Users", value: uniqueUsers },
                                { icon: Shield, title: "Security Events", value: secEventCount },
                            ].map(({ icon, title, value }) => (
                                <StatCard
                                    key={title} icon={icon} title={title} value={value}
                                    gradient="from-blue-500 to-purple-500"
                                    isLoading={analyticsLoading.dashboardMetrics}
                                    error={analyticsErrors.dashboardMetrics}
                                    theme={theme}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="h-[380px]">
                                <UserGrowthChart
                                    data={analytics.userGrowth}
                                    loading={analyticsLoading.userGrowth}
                                    theme={theme}
                                />
                            </div>
                            <div className="h-[380px]">
                                <LoginMethodsChart
                                    data={analytics.loginAnalytics}
                                    loading={analyticsLoading.loginAnalytics}
                                    theme={theme}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <LoginStatsOverview
                                metrics={analytics.dashboardMetrics}
                                loading={analyticsLoading.dashboardMetrics}
                                theme={theme}
                            />
                            <div className="h-[380px]">
                                <ActivityEventsChart
                                    metrics={analytics.dashboardMetrics}
                                    loading={analyticsLoading.dashboardMetrics}
                                    theme={theme}
                                />
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "security" && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {[
                                { icon: Shield, title: "Security Events", value: secEventCount, key: "securityEvents" },
                                { icon: AlertTriangle, title: "Suspicious IPs", value: analytics.suspiciousIPs?.length || 0, key: "suspiciousIPs" },
                                { icon: Lock, title: "Unresolved", value: unresolvedSec, key: "dashboardMetrics" },
                            ].map(({ icon, title, value, key }) => (
                                <StatCard
                                    key={title} icon={icon} title={title} value={value}
                                    gradient="from-red-500 to-orange-500"
                                    isLoading={analyticsLoading[key]}
                                    error={analyticsErrors[key]}
                                    theme={theme}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SecurityEventsTable
                                events={analytics.securityEvents}
                                loading={analyticsLoading.securityEvents}
                                theme={theme}
                            />
                            <SuspiciousIPsCard
                                ips={analytics.suspiciousIPs}
                                loading={analyticsLoading.suspiciousIPs}
                                theme={theme}
                            />
                        </div>
                    </>
                )}

                {activeTab === "users" && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { icon: Users, title: "Total Users", value: analytics.userStatistics?.total || 0, key: "userStatistics" },
                                { icon: UserCheck, title: "Active Users", value: analytics.userStatistics?.active || 0, key: "userStatistics" },
                                { icon: Users, title: "Inactive", value: analytics.userStatistics?.inactive || 0, key: "userStatistics" },
                                { icon: Activity, title: "Unique Active", value: analytics.dashboardMetrics?.logins?.uniqueUsers?.[0]?.count || 0, key: "dashboardMetrics" },
                            ].map(({ icon, title, value, key }) => (
                                <StatCard
                                    key={title} icon={icon} title={title} value={value}
                                    gradient="from-blue-500 to-purple-500"
                                    isLoading={analyticsLoading[key]}
                                    error={analyticsErrors[key]}
                                    theme={theme}
                                />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <UserStatisticsCard
                                stats={analytics.userStatistics}
                                loading={analyticsLoading.userStatistics}
                                theme={theme}
                            />
                            <TopActiveUsers
                                users={analytics.dashboardMetrics?.topUsers || []}
                                loading={analyticsLoading.dashboardMetrics}
                                theme={theme}
                            />
                        </div>
                    </>
                )}

                {activeTab === "activities" && (
                    <ActivitiesLog theme={theme} />
                )}

                {activeTab === "services" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                {
                                    label: "Health Score",
                                    value: Object.keys(serviceHealth).length === 0
                                        ? "—"
                                        : `${Math.round(
                                            (Object.values(serviceHealth).filter((s) => s.status === "operational").length /
                                                Object.keys(serviceHealth).length) * 100
                                        )}%`,
                                    color: "text-emerald-400",
                                },
                                {
                                    label: "Online",
                                    value: `${Object.values(serviceHealth).filter((s) => s.status === "operational").length}/${Object.keys(serviceHealth).length || SERVICES_COUNT}`,
                                    color: "text-emerald-400",
                                },
                                {
                                    label: "Down",
                                    value: Object.values(serviceHealth).filter((s) => s.status !== "operational").length,
                                    color: "text-red-400",
                                },
                                {
                                    label: "Total Services",
                                    value: SERVICES_COUNT,
                                    color: textPrimary,
                                },
                            ].map(({ label, value, color }) => (
                                <div key={label} className={`${cardBg} backdrop-blur-lg rounded-xl p-4 border shadow-sm`}>
                                    <p className={`text-xs ${textMuted} uppercase tracking-wide mb-2`}>{label}</p>
                                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                                </div>
                            ))}
                        </div>

                        <ServiceHealthGrid
                            serviceHealth={serviceHealth}
                            checkingServices={checkingServices}
                            checkAll={checkAll}
                            checkOne={checkOne}
                            checkingAll={checkingAll}
                            actionLines={actionLines}
                            theme={theme}
                        />
                    </div>
                )}

                {activeTab === "monitoring" && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                            {[
                                { label: "Total Logs", value: logs.length, color: "#22d3ee" },
                                { label: "Errors", value: logs.filter((l) => l.level === "error").length, color: "#f87171" },
                                { label: "Warnings", value: logs.filter((l) => l.level === "warn").length, color: "#fbbf24" },
                                { label: "Debug", value: logs.filter((l) => l.level === "debug").length, color: "#818cf8" },
                                { label: "Info", value: logs.filter((l) => l.level === "info").length, color: "#22d3ee" },
                                { label: "Insights", value: insights.length, color: "#a78bfa" },
                            ].map(({ label, value, color }) => (
                                <div
                                    key={label}
                                    className={`${cardBg} backdrop-blur-lg rounded-xl p-4 border shadow-sm`}
                                    style={{ borderTop: `2px solid ${color}` }}
                                >
                                    <p className={`text-xs ${textMuted} uppercase tracking-wide mb-1`}>{label}</p>
                                    <p className="text-2xl font-bold tabular-nums" style={{ color }}>{value.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <ServerMonitoring
                            logs={logs}
                            insights={insights}
                            sseStatus={sseStatus}
                            theme={theme}
                        />
                    </>
                )}
            </div>

            {/* ── keyframe styles ───────────────────────────────────────────────── */}
            <style dangerouslySetInnerHTML={{
                __html: `
                  @keyframes float {
                    0%,100% { transform: translate(0px,0px) scale(1); }
                    33%      { transform: translate(30px,-50px) scale(1.1); }
                    66%      { transform: translate(-20px,20px) scale(0.9); }
                  }
                `,
            }} />
        </div>
    );
}