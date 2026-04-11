import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
    icon: Icon,
    title,
    value,
    gradient,
    isLoading,
    error,
    theme,
    trend,
    trendValue,
}) {
    const isDark = theme === "dark";

    const cardBg = isDark
        ? "bg-white/10 border-white/20 hover:border-white/30"
        : "bg-white/60 backdrop-blur-md border-white/80 hover:border-emerald-200 shadow-sm shadow-black/5";

    const textPrimary = isDark ? "text-white" : "text-gray-900";
    const textMuted = isDark ? "text-gray-400" : "text-gray-600";
    const valueColor = isDark ? "text-emerald-400" : "text-emerald-700";
    const errorColor = isDark ? "text-red-400" : "text-red-500";

    return (
        <div
            className={`${cardBg} backdrop-blur-lg rounded-xl p-4 border transition-all duration-300 shadow-sm hover:shadow-md group`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-lg ${gradient} bg-opacity-10`}>
                            <Icon className={`w-4 h-4 ${isDark ? "text-white" : "text-gray-700"}`} />
                        </div>
                        <p className={`text-xs font-medium ${textMuted} uppercase tracking-wide`}>
                            {title}
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center gap-2 mt-1">
                            <Loader2 className={`w-4 h-4 ${textPrimary} animate-spin`} />
                            <span className={`text-sm ${textMuted}`}>Loading...</span>
                        </div>
                    ) : error ? (
                        <span className={`text-sm ${errorColor} font-medium`}>Failed to load</span>
                    ) : (
                        <>
                            <h3 className={`text-2xl font-bold ${valueColor} tabular-nums`}>
                                {value?.toLocaleString() || 0}
                            </h3>
                            {trend && (
                                <div
                                    className={`flex items-center gap-1 mt-2 text-xs ${trend === "up" ? "text-emerald-500" : "text-red-500"
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
}