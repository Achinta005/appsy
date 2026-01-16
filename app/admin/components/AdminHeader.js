"use client";
import { useState, useEffect, useRef } from "react";
import {
  User,
  LogOut,
  Wifi,
  Bell,
  Settings,
  Search,
  Moon,
  Sun,
  Shield,
  Lock,
  Mail,
  Volume2,
  Eye,
  Database,
  Download,
  Trash2,
  UserCog,
  Clock,
  Activity,
  X,
} from "lucide-react";

export default function AdminHeader({
  user ,
  ipAddress ,
  onLogout,
  onFeatureSelect,
  activities,
  isConnected,
  userProfile ,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [lastViewedActivityId, setLastViewedActivityId] = useState(null);
  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: true,
    emailAlerts: true,
    soundEffects: false,
    twoFactorAuth: false,
    sessionTimeout: 30,
    dataRetention: 90,
    autoBackup: true,
  });

  const notifRef = useRef(null);
  const settingsRef = useRef(null);
  const profileRef = useRef(null);

  // Auto-update lastViewedActivityId when bell is clicked and new activities arrive
  useEffect(() => {
    if (activities.length > 0 && !lastViewedActivityId) {
      return;
    }

    if (showNotifications && activities.length > 0) {
      const latestActivityId = activities[0]._id || activities[0].id;
      if (latestActivityId !== lastViewedActivityId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLastViewedActivityId(latestActivityId);
      }
    }
  }, [activities, showNotifications, lastViewedActivityId]);

  // Calculate unread count
  const unreadCount = activities.filter((activity) => {
    if (!lastViewedActivityId) return false;

    const lastViewedIndex = activities.findIndex(
      (a) => (a._id || a.id) === lastViewedActivityId
    );

    const activityIndex = activities.findIndex(
      (a) => (a._id || a.id) === (activity._id || activity.id)
    );

    if (lastViewedIndex === -1) {
      return true;
    }

    return activityIndex < lastViewedIndex;
  }).length;

  const hasNewActivities = unreadCount > 0;
  const recentActivities = activities.slice(0, 5);

  const handleNotificationClick = () => {
    const wasOpen = showNotifications;
    setShowNotifications(!showNotifications);

    if (!wasOpen && activities.length > 0) {
      const latestActivityId = activities[0]._id || activities[0].id;
      setLastViewedActivityId(latestActivityId);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-slate-800/95 via-purple-800/95 to-slate-800/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search features..."
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* IP Address */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 border border-white/20">
              <Wifi className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-300">IP:</span>
              <span className="text-xs text-green-400 font-mono">
                {ipAddress}
              </span>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleNotificationClick}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-300" />
                {hasNewActivities && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow-lg px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900/98 border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-slideDown">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white font-semibold">
                        Recent Activity
                      </h3>
                    </div>
                    {isConnected && (
                      <span className="flex items-center gap-1.5 text-xs text-green-400">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
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
                            className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${getActivityColor(
                                activity.type
                              )} flex-shrink-0`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">
                                {activity.action}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {formatTimestamp(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-white/10 bg-white/5">
                    <button
                      className="w-full text-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
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

            {/* Settings */}
            <div className="relative hidden sm:block" ref={settingsRef}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-300" />
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-2 w-96 bg-slate-900/98 border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-slideDown">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Settings className="w-5 h-5 text-purple-400" />
                      Settings
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <div className="max-h-[500px] overflow-y-auto p-4 space-y-4">
                    {/* Theme */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300 flex items-center gap-2">
                        {settings.theme === "dark" ? (
                          <Moon className="w-4 h-4" />
                        ) : (
                          <Sun className="w-4 h-4" />
                        )}
                        Theme
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) =>
                          handleSettingChange("theme", e.target.value)
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Push Notifications
                      </label>
                      <button
                        onClick={() =>
                          handleSettingChange(
                            "notifications",
                            !settings.notifications
                          )
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          settings.notifications
                            ? "bg-purple-500"
                            : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.notifications ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Email Alerts */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Alerts
                      </label>
                      <button
                        onClick={() =>
                          handleSettingChange(
                            "emailAlerts",
                            !settings.emailAlerts
                          )
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          settings.emailAlerts ? "bg-purple-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.emailAlerts ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Sound Effects */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300 flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Sound Effects
                      </label>
                      <button
                        onClick={() =>
                          handleSettingChange(
                            "soundEffects",
                            !settings.soundEffects
                          )
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          settings.soundEffects
                            ? "bg-purple-500"
                            : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.soundEffects ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Two-Factor Auth */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Two-Factor Auth
                      </label>
                      <button
                        onClick={() =>
                          handleSettingChange(
                            "twoFactorAuth",
                            !settings.twoFactorAuth
                          )
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          settings.twoFactorAuth
                            ? "bg-purple-500"
                            : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.twoFactorAuth ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Session Timeout */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) =>
                          handleSettingChange(
                            "sessionTimeout",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                        min="5"
                        max="120"
                      />
                    </div>

                    {/* Data Retention */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Data Retention (days)
                      </label>
                      <select
                        value={settings.dataRetention}
                        onChange={(e) =>
                          handleSettingChange(
                            "dataRetention",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                        <option value="180">180 days</option>
                        <option value="365">1 year</option>
                      </select>
                    </div>

                    {/* Auto Backup */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Auto Backup
                      </label>
                      <button
                        onClick={() =>
                          handleSettingChange(
                            "autoBackup",
                            !settings.autoBackup
                          )
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          settings.autoBackup ? "bg-purple-500" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.autoBackup ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        Change Password
                      </button>
                      <button className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-red-400 text-sm transition-colors flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Clear All Data
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 sm:gap-3 bg-white/10 rounded-lg pl-2 sm:pl-3 pr-1 py-1 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-xs sm:text-sm font-medium text-white">
                    {user.username}
                  </p>
                  <p className="text-xs text-purple-300">{user.role}</p>
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
                <div className="absolute right-0 mt-2 w-80 bg-slate-900/98 border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-slideDown">
                  <div className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-b border-white/10">
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
                        <h3 className="text-white font-semibold text-lg">
                          {userProfile.fullName || user.username}
                        </h3>
                        <p className="text-purple-300 text-sm">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {userProfile.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {userProfile.email}
                        </span>
                      </div>
                    )}
                    {userProfile.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Wifi className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {userProfile.phone}
                        </span>
                      </div>
                    )}
                    {userProfile.joinedDate && (
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          Joined {userProfile.joinedDate}
                        </span>
                      </div>
                    )}
                    {userProfile.lastLogin && (
                      <div className="flex items-center gap-3 text-sm">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          Last login {userProfile.lastLogin}
                        </span>
                      </div>
                    )}

                    {userProfile.bio && (
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-sm text-gray-400 italic">
                          &quot;{userProfile.bio}&quot;
                        </p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <button
                        onClick={() => console.log("Edit profile")}
                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <UserCog className="w-4 h-4" />
                        Edit Profile
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
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Mobile IP Address */}
        <div className="sm:hidden mt-3 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border border-white/20">
          <Wifi className="w-3 h-3 text-green-400 flex-shrink-0" />
          <span className="text-xs text-gray-300">IP:</span>
          <span className="text-xs text-green-400 font-mono">{ipAddress}</span>
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