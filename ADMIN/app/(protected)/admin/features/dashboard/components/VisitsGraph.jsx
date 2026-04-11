import { Loader2, Activity, TrendingUp } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function VisitsGraph({ visits, loading, theme }) {
  const isDark = theme === "dark";

  const cardBg   = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
  const textPrimary   = isDark ? "text-white"    : "text-gray-900";
  const textMuted     = isDark ? "text-gray-400" : "text-gray-600";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const gridColor     = isDark ? "#334155"        : "#e2e8f0";
  const tooltipBg     = isDark ? "#1e293b"        : "#ffffff";
  const tooltipBorder = isDark ? "#475569"        : "#cbd5e1";
  const tooltipText   = isDark ? "#f1f5f9"        : "#1e293b";
  const noDataText    = isDark ? "text-gray-400"  : "text-gray-500";

  const formatWeekLabel = (weekKey) => {
    if (!weekKey) return "";
    const [, week] = weekKey.split("-W");
    return `W${week}`;
  };

  const parseWeekKey = (weekKey) => {
    const [year, week] = weekKey.split("-W");
    return parseInt(year) * 100 + parseInt(week);
  };

  const chartData = Array.isArray(visits)
    ? visits
        .map((v) => ({
          week: v.week,
          visits: v.visits || 0,
          uniqueIPs: v.ipAddresses?.length || 0,
        }))
        .sort((a, b) => parseWeekKey(a.week) - parseWeekKey(b.week))
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
            <h2 className={`text-xl font-bold ${textPrimary}`}>Visits Overview</h2>
            <p className={`text-xs ${textMuted} mt-0.5`}>Weekly traffic analytics</p>
          </div>
        </div>
        {loading && (
          <div className={`flex items-center gap-2 text-sm ${textMuted} bg-blue-500/10 px-3 py-1.5 rounded-full`}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Updating...</span>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="flex items-center justify-center gap-8 mb-4">
          {[
            { color: "bg-blue-500",    label: "Total Visits" },
            { color: "bg-emerald-500", label: "Unique IPs" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color} shadow-lg`} />
              <span className={`text-sm font-medium ${textSecondary}`}>{label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
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
                type="monotone" dataKey="visits"
                stroke="#3b82f6" strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }} activeDot={{ r: 6 }}
              />
              <Line
                type="monotone" dataKey="uniqueIPs"
                stroke="#10b981" strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }} activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className={`h-full flex items-center justify-center ${noDataText}`}>
            <div className="text-center">
              <Activity className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No visit data available</p>
              <p className="text-xs mt-1 opacity-70">Data will appear here once tracked</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}