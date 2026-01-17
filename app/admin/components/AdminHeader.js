"use client";
import { useState, useEffect, useRef } from "react";
import {
  User,
  LogOut,
  Wifi,
  Bell,
  Mail,
  Eye,
  UserCog,
  Clock,
  Activity,
  Moon,
  Sun,
  Settings
} from "lucide-react";
import { useRouter } from "next/navigation";
import useUserProfile from "@/hooks/useUserdata";

export default function AdminHeader({
  user,
  ipAddress,
  onLogout,
  onFeatureSelect,
  activities,
  isConnected,
  userProfile,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [lastViewedActivityId, setLastViewedActivityId] = useState(null);
  const [theme, setTheme] = useState("light");
  const [isSyncing, setIsSyncing] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const router = useRouter();
  const { updateUserProfile } = useUserProfile();

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const localTheme = localStorage.getItem("theme") || "light";
    setTheme(localTheme);
  }, []);

  // Sync theme between localStorage and userProfile (only when not actively toggling)
  useEffect(() => {
    if (userProfile && !isSyncing) {
      const localTheme = localStorage.getItem("theme") || "light";

      // Only update if there's a mismatch and we're not in the middle of syncing
      if (localTheme !== userProfile.theme) {
        setIsSyncing(true);
        updateUserProfile({ NewTheme: localTheme }).finally(() => {
          setIsSyncing(false);
        });
      }
    }
  }, [userProfile?.theme]);

  // Mark notifications as viewed when opened
  useEffect(() => {
    if (showNotifications && activities.length > 0 && !lastViewedActivityId) {
      const latestActivityId = activities[0]._id || activities[0].id;
      setLastViewedActivityId(latestActivityId);
    }
  }, [showNotifications, activities, lastViewedActivityId]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate unread notifications
  const unreadCount = lastViewedActivityId
    ? activities.filter((activity) => {
        const lastViewedIndex = activities.findIndex(
          (a) => (a._id || a.id) === lastViewedActivityId
        );
        const activityIndex = activities.findIndex(
          (a) => (a._id || a.id) === (activity._id || activity.id)
        );
        return lastViewedIndex !== -1 && activityIndex < lastViewedIndex;
      }).length
    : 0;

  const recentActivities = activities.slice(0, 5);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && activities.length > 0) {
      const latestActivityId = activities[0]._id || activities[0].id;
      setLastViewedActivityId(latestActivityId);
    }
  };

  const toggleTheme = async () => {
    const currentTheme = localStorage.getItem("theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Set syncing flag to prevent useEffect from interfering
    setIsSyncing(true);

    // Update localStorage
    localStorage.setItem("theme", newTheme);

    // Update local state for immediate UI feedback
    setTheme(newTheme);

    // Dispatch storage event for other components
    window.dispatchEvent(new StorageEvent("storage", {
      key: "theme",
      newValue: newTheme,
    }));

    // Update user profile in database
    try {
      await updateUserProfile({ NewTheme: newTheme });
    } finally {
      setIsSyncing(false);
    }
  };

  const getActivityColor = (type) => {
    const colors = {
      create: "bg-green-400",
      update: "bg-blue-400",
      delete: "bg-red-400",
      login: "bg-purple-400",
      warning: "bg-yellow-400",
    };
    return colors[type] || "bg-gray-400";
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const headerStyles = isDark
    ? "bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 border-white/10"
    : "bg-gradient-to-r from-white/95 via-purple-100/95 to-white/95 border-purple-200/50 shadow-lg";
  
  const textColor = isDark ? "text-white" : "text-gray-900";
  const textMuted = isDark ? "text-gray-300" : "text-gray-600";
  const iconColor = isDark ? "text-gray-300" : "text-gray-700";
  const bgHover = isDark ? "hover:bg-white/10" : "hover:bg-purple-100/50";
  const inputBg = isDark ? "bg-white/10 border-white/20" : "bg-white border-purple-200";
  const dropdownBg = isDark ? "bg-slate-900/98 border-white/20" : "bg-white border-purple-200";

  return (
    <header className={`sticky top-0 z-30 ${headerStyles} backdrop-blur-xl border-b transition-all duration-300`}>
      <div className="px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* IP Address */}
            <div className={`hidden sm:flex items-center gap-2 ${inputBg} rounded-lg px-3 py-1.5 border transition-colors`}>
              <Wifi className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className={`text-xs ${textMuted}`}>IP:</span>
              <span className="text-xs text-green-500 font-mono">
                {ipAddress}
              </span>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleNotificationClick}
                className={`relative p-2 ${bgHover} rounded-lg transition-colors`}
              >
                <Bell className={`w-5 h-5 ${iconColor}`} />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow-lg px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  </>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 ${dropdownBg} rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-slideDown`}>
                  <div className={`p-4 border-b ${isDark ? 'border-white/10 bg-purple-900/20' : 'border-purple-200 bg-purple-50'} flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-500" />
                      <h3 className={`${textColor} font-semibold`}>
                        Recent Activity
                      </h3>
                    </div>
                    {isConnected && (
                      <span className="flex items-center gap-1.5 text-xs text-green-500">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        Live
                      </span>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {recentActivities.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {recentActivities.map((activity, index) => (
                          <div
                            key={`${activity.id || activity._id}-${index}`}
                            className={`flex items-center gap-3 p-2.5 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-purple-50 hover:bg-purple-100'} rounded-lg transition-all cursor-pointer`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${getActivityColor(
                                activity.type
                              )} flex-shrink-0`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`${textColor} text-sm truncate`}>
                                {activity.action}
                              </p>
                              <p className={`${textMuted} text-xs`}>
                                {formatTimestamp(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`p-3 border-t ${isDark ? 'border-white/10 bg-white/5' : 'border-purple-200 bg-purple-50'}`}>
                    <button
                      className="w-full text-center text-sm text-purple-500 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => {
                        onFeatureSelect("activity");
                        setShowNotifications(false);
                      }}
                    >
                      View all activity
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`hidden sm:block p-2 ${bgHover} rounded-lg transition-colors`}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-purple-600" />
              )}
            </button>

            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`flex items-center gap-2 sm:gap-3 ${inputBg} rounded-lg pl-2 sm:pl-3 pr-1 py-1 border ${bgHover} transition-colors`}
              >
                <div className="hidden sm:block text-right">
                  <p className={`text-xs sm:text-sm font-medium ${textColor}`}>
                    {user.username}
                  </p>
                  <p className="text-xs text-purple-500">{user.role}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  {!userProfile?.avatar ? (
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  ) : (
                    <img
                      src={userProfile.avatar}
                      alt="User avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
              </button>

              {showProfile && userProfile && (
                <div className={`absolute right-0 mt-2 w-80 ${dropdownBg} rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-slideDown`}>
                  <div className={`p-4 ${isDark ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-b border-white/10' : 'bg-gradient-to-br from-purple-100 to-pink-100 border-b border-purple-200'}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        {!userProfile.avatar ? (
                          <User className="w-8 h-8 text-white" />
                        ) : (
                          <img
                            src={userProfile.avatar}
                            alt="User avatar"
                            className="w-full h-full object-cover rounded-full"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`${textColor} font-semibold text-lg`}>
                          {userProfile.fullName || user.username}
                        </h3>
                        <p className="text-purple-500 text-sm">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {userProfile.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className={textMuted}>
                          {userProfile.email}
                        </span>
                      </div>
                    )}
                    {userProfile.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Wifi className="w-4 h-4 text-gray-400" />
                        <span className={textMuted}>
                          {userProfile.phone}
                        </span>
                      </div>
                    )}
                    {userProfile.joinedDate && (
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className={textMuted}>
                          Joined {userProfile.joinedDate}
                        </span>
                      </div>
                    )}
                    {userProfile.lastLogin && (
                      <div className="flex items-center gap-3 text-sm">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className={textMuted}>
                          Last login {userProfile.lastLogin}
                        </span>
                      </div>
                    )}

                    {userProfile.bio && (
                      <div className={`pt-3 border-t ${isDark ? 'border-white/10' : 'border-purple-200'}`}>
                        <p className="text-sm text-gray-400 italic">
                          &quot;{userProfile.bio}&quot;
                        </p>
                      </div>
                    )}

                    <div className={`pt-3 border-t ${isDark ? 'border-white/10' : 'border-purple-200'} grid grid-cols-2 gap-2`}>
                      <button
                        onClick={() => router.push("/admin/user/profile")}
                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <UserCog className="w-4 h-4" />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => router.push("/admin/user/settings")}
                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Edit Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all active:scale-95"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            </button>
          </div>
        </div>

        {/* Mobile IP Address */}
        <div className={`sm:hidden mt-3 flex items-center gap-2 ${inputBg} rounded-lg px-3 py-2 border transition-colors`}>
          <Wifi className="w-3 h-3 text-green-500 flex-shrink-0" />
          <span className={`text-xs ${textMuted}`}>IP:</span>
          <span className="text-xs text-green-500 font-mono">{ipAddress}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}