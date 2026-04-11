import { Users, UserCheck, Activity } from "lucide-react";

export function UserStatisticsCard({ stats, loading, theme }) {
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
  const text1  = isDark ? "text-white"    : "text-gray-900";
  const text2  = isDark ? "text-gray-400" : "text-gray-600";
  const itemBg = isDark ? "bg-white/5"    : "bg-gray-50";

  const total      = stats?.total    || 0;
  const active     = stats?.active   || 0;
  const inactive   = stats?.inactive || 0;
  const activePct  = total > 0 ? ((active / total) * 100).toFixed(1) : 0;

  return (
    <div className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border shadow-sm`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 bg-opacity-10">
          <UserCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${text1}`}>User Statistics</h2>
          <p className={`text-xs ${text2} mt-0.5`}>User engagement metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: "Total",    value: total,    color: text1,              sub: null },
          { label: "Active",   value: active,   color: "text-emerald-500", sub: `${activePct}%` },
          { label: "Inactive", value: inactive, color: "text-orange-500",  sub: null },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className={`${itemBg} rounded-lg p-4 text-center`}>
            <p className={`text-xs ${text2} uppercase mb-2`}>{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
            {sub && <p className={`text-xs ${color} mt-1`}>{sub}</p>}
          </div>
        ))}
      </div>

      {stats?.usersByRole && stats.usersByRole.length > 0 && (
        <>
          <h3 className={`text-sm font-semibold ${text1} mb-3 mt-6`}>Users by Role</h3>
          <div className="space-y-2">
            {stats.usersByRole.map((role, i) => (
              <div
                key={i}
                className={`${itemBg} rounded-lg p-3 flex items-center justify-between border ${isDark ? "border-white/5" : "border-gray-100"}`}
              >
                <p className={`text-sm ${text1} capitalize`}>{role._id || "Unknown"}</p>
                <p className={`text-sm font-bold ${text1}`}>{role.count}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function TopActiveUsers({ users, loading, theme }) {
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";
  const text1  = isDark ? "text-white"    : "text-gray-900";
  const text2  = isDark ? "text-gray-400" : "text-gray-600";
  const itemBg = isDark ? "bg-white/5"    : "bg-gray-50";

  return (
    <div className={`${cardBg} backdrop-blur-lg rounded-xl p-6 border shadow-sm`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 bg-opacity-10">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${text1}`}>Top Active Users</h2>
          <p className={`text-xs ${text2} mt-0.5`}>Most engaged users by activity</p>
        </div>
      </div>

      <div className="space-y-2">
        {users && users.length > 0 ? (
          users.slice(0, 8).map((user, i) => (
            <div
              key={user._id}
              className={`${itemBg} rounded-lg p-3 flex items-center justify-between border ${isDark ? "border-white/5" : "border-gray-100"}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className={`text-sm font-medium ${text1}`}>
                    {user._id.substring(0, 8)}…
                  </p>
                  <p className={`text-xs ${text2}`}>
                    Last active: {new Date(user.lastActive).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${text1}`}>{user.activityCount}</p>
                <p className={`text-xs ${text2}`}>activities</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-30 text-gray-400" />
            <p className={`text-sm ${text2}`}>No user activity</p>
          </div>
        )}
      </div>
    </div>
  );
}