import { useState, useMemo } from "react";
import { Search, Copy, Check, ChevronRight, ChevronDown } from "lucide-react";

const DARK_LEVEL_META = {
    error: { color: "#f87171", bg: "rgba(248,113,113,0.09)", label: "ERR" },
    warn: { color: "#fbbf24", bg: "rgba(251,191,36,0.09)", label: "WRN" },
    debug: { color: "#818cf8", bg: "rgba(129,140,248,0.09)", label: "DBG" },
    info: { color: "#22d3ee", bg: "rgba(34,211,238,0.07)", label: "INF" },
};
const LIGHT_LEVEL_META = {
    error: { color: "#dc2626", bg: "rgba(220,38,38,0.08)", label: "ERR" },
    warn: { color: "#d97706", bg: "rgba(217,119,6,0.08)", label: "WRN" },
    debug: { color: "#6366f1", bg: "rgba(99,102,241,0.08)", label: "DBG" },
    info: { color: "#0891b2", bg: "rgba(8,145,178,0.07)", label: "INF" },
};
const METHOD_COLOR = {
    GET: "#22d3ee", POST: "#a78bfa", PUT: "#fbbf24",
    DELETE: "#f87171", PATCH: "#34d399",
};
const METHOD_COLOR_LIGHT = {
    GET: "#0891b2", POST: "#7c3aed", PUT: "#d97706",
    DELETE: "#dc2626", PATCH: "#059669",
};
const SEV_META_DARK = {
    critical: { color: "#f87171", badge: "rgba(248,113,113,0.15)", label: "CRIT" },
    high: { color: "#fb923c", badge: "rgba(251,146,60,0.13)", label: "HIGH" },
    medium: { color: "#fbbf24", badge: "rgba(251,191,36,0.12)", label: "MED" },
    low: { color: "#34d399", badge: "rgba(52,211,153,0.11)", label: "LOW" },
    info: { color: "#60a5fa", badge: "rgba(96,165,250,0.11)", label: "INFO" },
};
const SEV_META_LIGHT = {
    critical: { color: "#dc2626", badge: "rgba(220,38,38,0.10)", label: "CRIT" },
    high: { color: "#ea580c", badge: "rgba(234,88,12,0.09)", label: "HIGH" },
    medium: { color: "#d97706", badge: "rgba(217,119,6,0.09)", label: "MED" },
    low: { color: "#059669", badge: "rgba(5,150,105,0.08)", label: "LOW" },
    info: { color: "#2563eb", badge: "rgba(37,99,235,0.08)", label: "INFO" },
};

function SevPill({ severity, isDark }) {
    const m = (isDark ? SEV_META_DARK : SEV_META_LIGHT)[severity]
        || (isDark ? SEV_META_DARK : SEV_META_LIGHT).info;
    return (
        <span
            style={{
                fontSize: 9, fontWeight: 700, padding: "2px 6px",
                borderRadius: 4, color: m.color, background: m.badge,
                border: `1px solid ${m.color}30`, letterSpacing: "0.08em",
                fontFamily: "monospace",
            }}
        >
            {m.label}
        </span>
    );
}

// ── Terminal subtab ──────────────────────────────────────────────────────────
function TerminalTab({ logs, isDark, sseStatus, theme }) {
    const [logFilter, setLogFilter] = useState("all");
    const [logSearch, setLogSearch] = useState("");
    const [copiedUid, setCopiedUid] = useState(null);

    const LEVEL_META = isDark ? DARK_LEVEL_META : LIGHT_LEVEL_META;
    const MC = isDark ? METHOD_COLOR : METHOD_COLOR_LIGHT;

    const textMuted = isDark ? "text-gray-400" : "text-gray-600";
    const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(147,51,234,0.06)";
    const termBg = isDark ? "#050509" : "#f8f5ff";

    const lc = useMemo(() =>
        logs.reduce((a, l) => { a[l.level] = (a[l.level] || 0) + 1; return a; }, {}),
        [logs]);

    const filtered = useMemo(() =>
        logs.filter((l) => {
            if (logFilter !== "all" && l.level !== logFilter) return false;
            if (logSearch && !l.message.toLowerCase().includes(logSearch.toLowerCase())) return false;
            return true;
        }),
        [logs, logFilter, logSearch]);

    const sseDot =
        sseStatus === "connected" ? "#22c55e" :
            sseStatus === "connecting" ? "#fbbf24" : "#ef4444";

    const copyLog = (log) =>
        navigator.clipboard.writeText(log.raw).then(() => {
            setCopiedUid(log._uid);
            setTimeout(() => setCopiedUid(null), 1400);
        });

    const statusColor = (s) =>
        s >= 500 ? "#f87171" : s >= 400 ? "#fb923c" : s >= 300 ? "#fbbf24" : "#34d399";

    return (
        <div className="flex flex-col" style={{ height: 520 }}>
            {/* Toolbar */}
            <div
                className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-t-xl border border-b-0"
                style={{
                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(147,51,234,0.15)",
                }}
            >
                {/* Level filters */}
                <div className="flex gap-1 flex-wrap">
                    {["all", "info", "warn", "error", "debug"].map((f) => {
                        const active = logFilter === f;
                        const meta = LEVEL_META[f];
                        return (
                            <button
                                key={f}
                                onClick={() => setLogFilter(f)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border transition-all"
                                style={{
                                    border: `1px solid ${active
                                        ? isDark ? "rgba(124,58,237,.55)" : "rgba(124,58,237,.4)"
                                        : isDark ? "rgba(255,255,255,0.1)" : "rgba(147,51,234,0.15)"}`,
                                    color: active
                                        ? isDark ? "#e2d9f3" : "#4c1d95"
                                        : isDark ? "#71717a" : "#6b7280",
                                    background: active
                                        ? isDark ? "rgba(124,58,237,.12)" : "rgba(124,58,237,.08)"
                                        : "transparent",
                                    fontFamily: "monospace",
                                }}
                            >
                                {f !== "all" && (
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta?.color }} />
                                )}
                                {f.toUpperCase()}
                                <span style={{ opacity: 0.5, fontSize: 9 }}>
                                    ({f === "all" ? logs.length : lc[f] || 0})
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search */}
                <div className="relative flex-1 min-w-32">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: isDark ? "#52525b" : "#9ca3af" }} />
                    <input
                        value={logSearch}
                        onChange={(e) => setLogSearch(e.target.value)}
                        placeholder="Filter messages…"
                        className="w-full pl-7 pr-2 py-1 rounded-lg text-xs outline-none border"
                        style={{
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(147,51,234,0.15)"}`,
                            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                            color: isDark ? "#dde0f0" : "#1e1b4b",
                            fontFamily: "monospace",
                        }}
                    />
                </div>

                {/* SSE status */}
                <div className="flex items-center gap-1.5 text-xs" style={{ fontFamily: "monospace" }}>
                    <span
                        className={sseStatus === "connected" ? "animate-pulse" : ""}
                        style={{ width: 7, height: 7, borderRadius: "50%", background: sseDot, display: "inline-block" }}
                    />
                    <span style={{ color: sseDot }}>
                        {sseStatus === "connected" ? "LIVE" : sseStatus === "connecting" ? "…" : "OFFLINE"}
                    </span>
                    <span className={textMuted}>{filtered.length}/{logs.length}</span>
                </div>
            </div>

            {/* Log rows */}
            <div
                className="flex-1 overflow-y-auto rounded-b-xl border"
                style={{
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(147,51,234,0.15)"}`,
                    background: termBg,
                    fontFamily: "monospace",
                }}
            >
                {filtered.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-xs" style={{ color: isDark ? "#52525b" : "#9ca3af" }}>
                            {sseStatus === "connected" ? "Awaiting log data…" : "Waiting for SSE connection…"}
                        </span>
                    </div>
                ) : (
                    filtered.map((log, i) => {
                        const meta = LEVEL_META[log.level] || LEVEL_META.info;
                        const copied = copiedUid === log._uid;
                        return (
                            <div
                                key={log._uid}
                                className="group flex items-stretch"
                                style={{ borderBottom: `1px solid ${borderColor}` }}
                            >
                                {/* Line number */}
                                <div
                                    className="w-9 py-1.5 pr-1.5 text-right text-xs flex-shrink-0 border-r select-none"
                                    style={{
                                        color: isDark ? "rgba(255,255,255,0.1)" : "rgba(30,27,75,0.15)",
                                        borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(147,51,234,0.08)",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {i + 1}
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex items-start gap-2 px-3 py-1 min-w-0">
                                    {/* Timestamp */}
                                    <span className="text-xs flex-shrink-0 pt-px" style={{ color: isDark ? "#22c55e" : "#16a34a", fontFamily: "monospace" }}>
                                        {log.ts.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
                                    </span>

                                    {/* Level badge */}
                                    <span
                                        className="text-xs font-bold flex-shrink-0 mt-px px-1 py-0.5 rounded min-w-8 text-center"
                                        style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.color}1f`, fontFamily: "monospace" }}
                                    >
                                        {meta.label}
                                    </span>

                                    {/* Message */}
                                    <div
                                        className="flex-1 min-w-0 text-xs leading-relaxed break-words"
                                        style={{ color: isDark ? "rgba(255,255,255,0.68)" : "rgba(30,27,75,0.78)" }}
                                    >
                                        {log.method ? (
                                            <>
                                                <span style={{ fontWeight: 700, marginRight: 6, color: MC[log.method] || "#dde0f0" }}>
                                                    {log.method}
                                                </span>
                                                <span style={{ marginRight: 4, opacity: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "inline-block", maxWidth: "28ch", verticalAlign: "bottom" }}>
                                                    {log.path}
                                                </span>
                                                {log.status && (
                                                    <span style={{ fontWeight: 700, marginRight: 4, color: statusColor(log.status) }}>
                                                        {log.status}
                                                    </span>
                                                )}
                                                {log.duration != null && (
                                                    <span style={{ marginRight: 4, opacity: 0.4 }}>[{log.duration}ms]</span>
                                                )}
                                                {log.ip && <span style={{ opacity: 0.3 }}>| {log.ip}</span>}
                                            </>
                                        ) : (
                                            <span>{log.message}</span>
                                        )}
                                    </div>

                                    {/* Copy button */}
                                    <button
                                        onClick={() => copyLog(log)}
                                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs px-2 py-0.5 rounded border flex-shrink-0 transition-opacity"
                                        style={{
                                            border: `1px solid ${copied ? "rgba(34,197,94,.4)" : isDark ? "rgba(255,255,255,0.1)" : "rgba(147,51,234,0.15)"}`,
                                            color: copied ? "#22c55e" : isDark ? "#52525b" : "#9ca3af",
                                            background: copied ? "rgba(34,197,94,.06)" : "transparent",
                                        }}
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? "✓" : "Copy"}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// ── Insights subtab ──────────────────────────────────────────────────────────
function InsightsTab({ insights, isDark, sseStatus }) {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [expandedUid, setExpandedUid] = useState(null);
    const [sortCol, setSortCol] = useState("analyzedAt");
    const [sortDir, setSortDir] = useState("desc");

    const textMuted = isDark ? "text-gray-400" : "text-gray-600";
    const termBg = isDark ? "#050509" : "#f8f5ff";
    const borderColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(147,51,234,0.06)";
    const sseDot =
        sseStatus === "connected" ? "#22c55e" :
            sseStatus === "connecting" ? "#fbbf24" : "#ef4444";

    const SEV_ORDER = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

    const ic = useMemo(() =>
        insights.reduce((a, i) => { a[i.type] = (a[i.type] || 0) + 1; return a; }, {}),
        [insights]);

    const filtered = useMemo(() =>
        insights
            .filter((i) => filter === "all" || i.type === filter)
            .filter((i) =>
                !search ||
                i.summary.toLowerCase().includes(search.toLowerCase()) ||
                (i.context || "").toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
                if (sortCol === "severity") {
                    const d = (SEV_ORDER[a.severity] ?? 9) - (SEV_ORDER[b.severity] ?? 9);
                    return sortDir === "asc" ? d : -d;
                }
                const av = a.analyzedAt?.getTime() ?? 0;
                const bv = b.analyzedAt?.getTime() ?? 0;
                return sortDir === "asc" ? av - bv : bv - av;
            }),
        [insights, filter, search, sortCol, sortDir]);

    const toggleSort = (col) => {
        if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortCol(col); setSortDir("desc"); }
    };

    return (
        <div className="flex flex-col" style={{ height: 520 }}>
            {/* Toolbar */}
            <div
                className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-t-xl border border-b-0"
                style={{
                    background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(147,51,234,0.15)",
                }}
            >
                {[
                    { id: "all", label: "All", count: insights.length },
                    { id: "error", label: "Errors", count: ic.error || 0 },
                    { id: "insight", label: "Insights", count: ic.insight || 0 },
                    { id: "summary", label: "Summary", count: ic.summary || 0 },
                ].map(({ id, label, count }) => (
                    <button
                        key={id}
                        onClick={() => setFilter(id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border transition-all"
                        style={{
                            border: `1px solid ${filter === id
                                ? isDark ? "rgba(167,139,250,.5)" : "rgba(124,58,237,.4)"
                                : isDark ? "rgba(255,255,255,0.1)" : "rgba(147,51,234,0.15)"}`,
                            color: filter === id
                                ? isDark ? "#e2d9f3" : "#4c1d95"
                                : isDark ? "#71717a" : "#6b7280",
                            background: filter === id
                                ? isDark ? "rgba(167,139,250,.1)" : "rgba(124,58,237,.07)"
                                : "transparent",
                            fontFamily: "monospace",
                        }}
                    >
                        {label}
                        <span style={{ opacity: 0.5, fontSize: 9 }}>({count})</span>
                    </button>
                ))}

                <div className="relative flex-1 min-w-32">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: isDark ? "#52525b" : "#9ca3af" }} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search summary…"
                        className="w-full pl-7 pr-2 py-1 rounded-lg text-xs outline-none border"
                        style={{
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(147,51,234,0.15)"}`,
                            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                            color: isDark ? "#dde0f0" : "#1e1b4b",
                            fontFamily: "monospace",
                        }}
                    />
                </div>

                <div className="flex items-center gap-1.5 text-xs ml-auto" style={{ fontFamily: "monospace" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: sseDot, display: "inline-block" }} />
                    <span style={{ color: sseDot }}>{sseStatus === "connected" ? "LIVE" : "OFFLINE"}</span>
                    <span className={textMuted}>{filtered.length}/{insights.length}</span>
                </div>
            </div>

            {/* Table */}
            <div
                className="flex-1 overflow-y-auto rounded-b-xl border"
                style={{
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(147,51,234,0.15)"}`,
                    background: termBg,
                }}
            >
                {filtered.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-xs" style={{ color: isDark ? "#52525b" : "#9ca3af", fontFamily: "monospace" }}>
                            {sseStatus === "connected" ? "Awaiting LLM insights…" : "Connecting…"}
                        </span>
                    </div>
                ) : (
                    <table className="w-full" style={{ borderCollapse: "collapse" }}>
                        <thead>
                            <tr
                                className="sticky top-0 z-10 border-b"
                                style={{ background: termBg, borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(147,51,234,0.12)" }}
                            >
                                {[
                                    { col: "severity", label: "Severity" },
                                    { col: "type", label: "Type" },
                                    { col: "summary", label: "Summary" },
                                    { col: "analyzedAt", label: "Time" },
                                    { col: null, label: "" },
                                ].map(({ col, label }) => (
                                    <th
                                        key={label}
                                        onClick={() => col && toggleSort(col)}
                                        className="text-left px-3 py-2"
                                        style={{
                                            fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em",
                                            color: isDark ? "#71717a" : "#6b7280",
                                            cursor: col ? "pointer" : "default",
                                            fontFamily: "monospace", userSelect: "none",
                                        }}
                                    >
                                        {label}
                                        {col && sortCol === col && (
                                            <span style={{ opacity: 0.7 }}>{sortDir === "asc" ? " ↑" : " ↓"}</span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((ins) => {
                                const isExp = expandedUid === ins._uid;
                                const sm = (isDark ? SEV_META_DARK : SEV_META_LIGHT)[ins.severity]
                                    || (isDark ? SEV_META_DARK : SEV_META_LIGHT).info;
                                return (
                                    <>
                                        <tr
                                            key={ins._uid}
                                            onClick={() => setExpandedUid(isExp ? null : ins._uid)}
                                            style={{
                                                borderBottom: `1px solid ${borderColor}`,
                                                borderLeft: `3px solid ${isExp ? sm.color : "transparent"}`,
                                                background: isExp
                                                    ? isDark ? `${sm.color}12` : `${sm.color}08`
                                                    : "transparent",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <td className="px-3 py-2">
                                                <SevPill severity={ins.severity} isDark={isDark} />
                                            </td>
                                            <td className="px-3 py-2">
                                                <span
                                                    className="text-xs px-1.5 py-0.5 rounded"
                                                    style={{
                                                        fontFamily: "monospace",
                                                        color: ins.type === "error" ? (isDark ? "#f87171" : "#dc2626") :
                                                            ins.type === "summary" ? (isDark ? "#60a5fa" : "#2563eb") :
                                                                (isDark ? "#a78bfa" : "#7c3aed"),
                                                        background: ins.type === "error" ? "rgba(248,113,113,.1)" :
                                                            ins.type === "summary" ? "rgba(96,165,250,.1)" : "rgba(167,139,250,.1)",
                                                    }}
                                                >
                                                    {ins.type}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 max-w-xs">
                                                <div className="flex items-center gap-1.5">
                                                    {ins.isLive && (
                                                        <span
                                                            className="text-xs px-1 py-px rounded"
                                                            style={{ background: "rgba(34,197,94,0.14)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", flexShrink: 0, fontFamily: "monospace" }}
                                                        >
                                                            NEW
                                                        </span>
                                                    )}
                                                    <span
                                                        className="text-xs overflow-hidden text-ellipsis whitespace-nowrap block"
                                                        style={{ color: isDark ? "rgba(255,255,255,0.72)" : "rgba(30,27,75,0.78)", fontFamily: "monospace" }}
                                                    >
                                                        {ins.summary}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                <span className="text-xs" style={{ color: isDark ? "#22c55e" : "#16a34a", fontFamily: "monospace" }}>
                                                    {ins.analyzedAt?.toLocaleTimeString("en-US", { hour12: false })}
                                                </span>
                                            </td>
                                            <td className="px-2 py-2 w-6">
                                                {isExp
                                                    ? <ChevronDown className="w-3 h-3" style={{ color: isDark ? "#71717a" : "#6b7280" }} />
                                                    : <ChevronRight className="w-3 h-3" style={{ color: isDark ? "#71717a" : "#6b7280" }} />
                                                }
                                            </td>
                                        </tr>

                                        {/* Expanded detail */}
                                        {isExp && (
                                            <tr key={`exp-${ins._uid}`}>
                                                <td colSpan={5}>
                                                    <div
                                                        className="px-4 py-3"
                                                        style={{
                                                            background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.018)",
                                                            borderLeft: `3px solid ${sm.color}`,
                                                        }}
                                                    >
                                                        {ins.metrics && (
                                                            <div className="grid grid-cols-4 gap-2 mb-3">
                                                                {[
                                                                    ["Total Logs", ins.metrics.totalLogs],
                                                                    ["Errors", ins.metrics.errorCount],
                                                                    ["Warnings", ins.metrics.warnCount],
                                                                    ["Avg ms", ins.metrics.avgResponseTimeMs != null ? `${ins.metrics.avgResponseTimeMs}ms` : "—"],
                                                                ].map(([k, v]) => (
                                                                    <div
                                                                        key={k}
                                                                        className="p-2 rounded-lg text-center"
                                                                        style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
                                                                    >
                                                                        <div className="text-base font-bold" style={{ color: sm.color }}>{v ?? "—"}</div>
                                                                        <div className="text-xs mt-1" style={{ color: isDark ? "#71717a" : "#6b7280", fontFamily: "monospace" }}>{k}</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <p className="text-xs mb-2" style={{ color: isDark ? "rgba(255,255,255,0.68)" : "rgba(30,27,75,0.78)", fontFamily: "monospace", lineHeight: 1.7 }}>
                                                            {ins.summary}
                                                        </p>
                                                        {ins.recommendation && (
                                                            <p className="text-xs" style={{ color: isDark ? "#a78bfa" : "#7c3aed", fontFamily: "monospace", lineHeight: 1.6 }}>
                                                                ⚡ {ins.recommendation}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function ServerMonitoring({ logs, insights, sseStatus, theme }) {
    const [subTab, setSubTab] = useState("terminal");
    const isDark = theme === "dark";

    const cardBg = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
    const textPrimary = isDark ? "text-white" : "text-gray-900";
    const textMuted = isDark ? "text-gray-400" : "text-gray-600";

    const lc = logs.reduce((a, l) => { a[l.level] = (a[l.level] || 0) + 1; return a; }, {});

    const SUB_TABS = [
        { id: "terminal", label: `Terminal (${logs.length})` },
        { id: "insights", label: `Insights (${insights.length})` },
    ];

    return (
        <div className={`${cardBg} backdrop-blur-lg rounded-xl p-5 border shadow-sm`}>
            {/* Error / warn badges */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                    {SUB_TABS.map((st) => (
                        <button
                            key={st.id}
                            onClick={() => setSubTab(st.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border-none transition-all"
                            style={{
                                background: subTab === st.id
                                    ? isDark ? "rgba(124,58,237,0.25)" : "rgba(109,40,217,0.15)"
                                    : "transparent",
                                color: subTab === st.id
                                    ? isDark ? "#c4b5fd" : "#6d28d9"
                                    : isDark ? "#71717a" : "#6b7280",
                                cursor: "pointer",
                            }}
                        >
                            {st.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    {[["ERR", lc.error || 0, "#f87171"], ["WRN", lc.warn || 0, "#fbbf24"]].map(
                        ([l, v, c]) => v > 0 && (
                            <div
                                key={l}
                                className="flex items-center gap-1 px-2 py-1 rounded-md"
                                style={{ background: `${c}14`, border: `1px solid ${c}30` }}
                            >
                                <span className="w-1 h-1 rounded-full" style={{ background: c }} />
                                <span className="text-xs font-mono font-semibold" style={{ color: c }}>{l} {v}</span>
                            </div>
                        )
                    )}
                </div>
            </div>

            {subTab === "terminal" ? (
                <TerminalTab logs={logs} isDark={isDark} sseStatus={sseStatus} theme={theme} />
            ) : (
                <InsightsTab insights={insights} isDark={isDark} sseStatus={sseStatus} />
            )}
        </div>
    );
}