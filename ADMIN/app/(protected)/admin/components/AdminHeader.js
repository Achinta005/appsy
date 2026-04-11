"use client";
import { useState, useEffect, useRef } from "react";
import {
  User,
  LogOut,
  Wifi,
  Bell,
  BellOff,
  Mail,
  Eye,
  UserCog,
  Clock,
  Activity,
  Moon,
  Sun,
  Settings,
  Minus,
  Maximize2,
  Minimize2,
  X,
  ChevronRight,
  Monitor,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useUserProfile from "@/hooks/useUserdata";
import { useBackgroundContext } from "../../context/BackgroundContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function AdminHeader({
  user,
  ipAddress,
  onLogout,
  onFeatureSelect,
  activities,
  isConnected,
  userProfile,
  theme,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [lastViewedActivityId, setLastViewedActivityId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isCapacitor, setIsCapacitor] = useState(false);
  const [themeMode, setThemeMode] = useState("system");
  const [systemIsDark, setSystemIsDark] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const themeRef = useRef(null);
  const router = useRouter();
  const { updateUserProfile } = useUserProfile();
  const { setTheme } = useBackgroundContext();
  const { isSupported, isSubscribed, permission, subscribe, unsubscribe } =
    usePushNotifications();

  // ── Capacitor detection ──────────────────────────────────────────────────
  useEffect(() => {
    setIsCapacitor(
      typeof window !== "undefined" &&
        !!window.Capacitor &&
        window.Capacitor.isNativePlatform(),
    );
  }, []);

  // ── System theme detection ───────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemIsDark(mq.matches);
    const handler = (e) => {
      setSystemIsDark(e.matches);
      if (themeMode === "system") {
        const resolved = e.matches ? "dark" : "light";
        setTheme(resolved);
        updateUserProfile({ NewTheme: resolved });
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [themeMode]);

  // ── Apply theme when themeMode changes ──────────────────────────────────
  useEffect(() => {
    const resolved =
      themeMode === "system" ? (systemIsDark ? "dark" : "light") : themeMode;
    setTheme(resolved);
  }, [themeMode, systemIsDark]);

  // ── Electron window state ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && window.electron?.onWindowState) {
      window.electron.onWindowState((state) =>
        setIsMaximized(state.isMaximized),
      );
    }
  }, []);

  // ── Notification auto-mark ───────────────────────────────────────────────
  useEffect(() => {
    if (showNotifications && activities.length > 0 && !lastViewedActivityId) {
      setLastViewedActivityId(activities[0]._id || activities[0].id);
    }
  }, [showNotifications, activities, lastViewedActivityId]);

  // ── Click outside ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target))
        setShowProfile(false);
      if (themeRef.current && !themeRef.current.contains(event.target))
        setShowThemePicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = lastViewedActivityId
    ? activities.filter((activity) => {
        const lastViewedIndex = activities.findIndex(
          (a) => (a._id || a.id) === lastViewedActivityId,
        );
        const activityIndex = activities.findIndex(
          (a) => (a._id || a.id) === (activity._id || activity.id),
        );
        return lastViewedIndex !== -1 && activityIndex < lastViewedIndex;
      }).length
    : 0;

  const excludedTypes = ["ANIME_ADDED", "ANIME_UPDATED", "ANIME_REMOVED"];
  const filteredActivities = activities.filter(
    (a) => !excludedTypes.includes(a.type),
  );
  const recentActivities = filteredActivities.slice(0, 5);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && activities.length > 0) {
      setLastViewedActivityId(activities[0]._id || activities[0].id);
    }
  };

  const handleThemeSelect = async (mode) => {
    setThemeMode(mode);
    setShowThemePicker(false);
    setIsSyncing(true);
    try {
      const resolved =
        mode === "system" ? (systemIsDark ? "dark" : "light") : mode;
      await updateUserProfile({ NewTheme: resolved, ThemeMode: mode });
    } finally {
      setIsSyncing(false);
    }
  };

  const getActivityMeta = (type) => {
    const map = {
      create: { color: "bg-emerald-400", label: "Created" },
      update: { color: "bg-blue-400", label: "Updated" },
      delete: { color: "bg-red-400", label: "Deleted" },
      login: { color: "bg-violet-400", label: "Login" },
      warning: { color: "bg-amber-400", label: "Warning" },
    };
    return map[type] || { color: "bg-slate-400", label: "Event" };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const diff = Date.now() - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const isDark = theme === "dark";

  // ── Theme toggle icon ────────────────────────────────────────────────────
  const ThemeIcon = () => {
    if (isSyncing)
      return (
        <span className="w-[18px] h-[18px] border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
      );
    if (themeMode === "system")
      return <Monitor className="w-[18px] h-[18px]" />;
    if (themeMode === "dark")
      return <Moon className="w-[18px] h-[18px] text-amber-400" />;
    return <Sun className="w-[18px] h-[18px] text-amber-400" />;
  };

  // ── Token maps ───────────────────────────────────────────────────────────
  const tk = {
    header: isDark
      ? "bg-[#0d0d18]/80 border-white/[0.06]"
      : "bg-white/80 border-black/[0.07]",
    chip: isDark
      ? "bg-white/[0.04] border-white/[0.08] text-slate-400"
      : "bg-slate-50 border-slate-200 text-slate-500",
    chipIp: isDark ? "text-emerald-400" : "text-emerald-600",
    iconBtn: isDark
      ? "text-slate-400 hover:text-slate-100 hover:bg-white/[0.07]"
      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
    text: isDark ? "text-slate-100" : "text-slate-800",
    muted: isDark ? "text-slate-400" : "text-slate-500",
    accent: isDark ? "text-violet-400" : "text-violet-600",
    dropdown: isDark
      ? "bg-[#13131f] border-white/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
      : "bg-white border-black/[0.07] shadow-[0_16px_48px_rgba(0,0,0,0.12)]",
    dropdownHead: isDark
      ? "bg-white/[0.03] border-white/[0.06]"
      : "bg-slate-50 border-slate-100",
    dropdownFoot: isDark
      ? "bg-white/[0.02] border-white/[0.06]"
      : "bg-slate-50/80 border-slate-100",
    row: isDark
      ? "hover:bg-white/[0.04] border-white/[0.04]"
      : "hover:bg-slate-50 border-slate-100",
    divider: isDark ? "bg-white/[0.06]" : "bg-slate-100",
    logoutBtn: isDark
      ? "bg-red-500/[0.08] hover:bg-red-500/[0.15] border-red-500/20 text-red-400"
      : "bg-red-50 hover:bg-red-100 border-red-100 text-red-500",
    winBtn: isDark
      ? "text-slate-500 hover:text-slate-200 hover:bg-white/[0.07]"
      : "text-slate-400 hover:text-slate-700 hover:bg-slate-100",
    userBtn: isDark
      ? "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07]"
      : "bg-slate-50 border-slate-200 hover:bg-slate-100",
  };

  const themeOptions = [
    {
      mode: "system",
      icon: Monitor,
      label: "System",
      desc: systemIsDark ? "Currently dark" : "Currently light",
    },
    {
      mode: "light",
      icon: Sun,
      label: "Light",
      desc: "Always light",
      iconClass: "text-amber-400",
    },
    {
      mode: "dark",
      icon: Moon,
      label: "Dark",
      desc: "Always dark",
      iconClass: "text-slate-300",
    },
  ];

  return (
    <header
      className={`sticky top-0 z-30 ${tk.header} backdrop-blur-2xl border-b transition-all duration-300`}
      style={{ WebkitAppRegion: "drag" }}
    >
      {/* Mobile drag-exclusion zone for sidebar toggle */}
      <div
        className="absolute top-0 left-0 w-16 h-full lg:hidden"
        style={{ WebkitAppRegion: "no-drag" }}
      />

      <div className="px-3 sm:px-5 py-2">
        <div
          className="flex items-center justify-between"
          style={{ WebkitAppRegion: "no-drag" }}
        >
          {/* ── LEFT: IP Badge ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <div
              className={`hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${tk.chip}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isConnected
                    ? isDark
                      ? "bg-emerald-400"
                      : "bg-emerald-500"
                    : isDark
                      ? "bg-slate-500"
                      : "bg-slate-400"
                }`}
              />
              <span className={tk.muted}>IP</span>
              <span className={`font-semibold ${tk.chipIp}`}>{ipAddress}</span>
            </div>

            {/* Mobile IP */}
            <div
              className={`sm:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${tk.chip}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDark ? "bg-emerald-400" : "bg-emerald-500"
                }`}
              />
              <span className={tk.muted}>IP</span>
              <span className={`font-semibold ${tk.chipIp}`}>{ipAddress}</span>
            </div>
          </div>

          {/* ── RIGHT: Action buttons ─────────────────────────────────────── */}
          <div className="flex items-center gap-1">
            {/* 1. Push notification toggle (desktop only) */}
            {isSupported && (
              <button
                onClick={isSubscribed ? unsubscribe : subscribe}
                title={
                  permission === "denied"
                    ? "Notifications blocked by browser"
                    : isSubscribed
                      ? "Disable push notifications"
                      : "Enable push notifications"
                }
                disabled={permission === "denied"}
                className={`hidden sm:flex w-9 h-9 items-center justify-center rounded-xl transition-all duration-150 ${tk.iconBtn} ${
                  isSubscribed
                    ? isDark
                      ? "text-emerald-400"
                      : "text-emerald-600"
                    : ""
                } ${permission === "denied" ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {isSubscribed ? (
                  <Bell className="w-[18px] h-[18px]" />
                ) : (
                  <BellOff className="w-[18px] h-[18px]" />
                )}
              </button>
            )}

            {/* 2. Activity / notifications bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleNotificationClick}
                title="Activity"
                className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 ${tk.iconBtn} ${
                  showNotifications
                    ? isDark
                      ? "bg-white/[0.07] text-slate-100"
                      : "bg-slate-100 text-slate-800"
                    : ""
                }`}
              >
                <Activity className="w-[18px] h-[18px]" />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping opacity-75 pointer-events-none" />
                    <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-md pointer-events-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  </>
                )}
              </button>

              {showNotifications && (
                <div
                  className={`absolute right-0 mt-2.5 w-[340px] rounded-2xl overflow-hidden border animate-slideDown ${tk.dropdown}`}
                >
                  <div
                    className={`flex items-center justify-between px-4 py-3 border-b ${tk.dropdownHead}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Activity className={`w-4 h-4 ${tk.accent}`} />
                      <span className={`text-sm font-semibold ${tk.text}`}>
                        Activity
                      </span>
                    </div>
                    {isConnected && (
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-500">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                        Live
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    {recentActivities.length === 0 ? (
                      <div className="py-10 text-center">
                        <Activity
                          className={`w-8 h-8 mx-auto mb-2 opacity-20 ${tk.muted}`}
                        />
                        <p className={`text-xs ${tk.muted}`}>
                          No recent activity
                        </p>
                      </div>
                    ) : (
                      recentActivities.map((activity, index) => {
                        const meta = getActivityMeta(activity.type);
                        return (
                          <div
                            key={`${activity.id || activity._id}-${index}`}
                            className={`flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 cursor-pointer transition-colors ${tk.row}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${meta.color} flex-shrink-0 mt-0.5`}
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs font-medium truncate ${tk.text}`}
                              >
                                {activity.action}
                              </p>
                              <p className={`text-[11px] mt-0.5 ${tk.muted}`}>
                                {formatTimestamp(activity.timestamp)}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                                isDark
                                  ? "bg-white/[0.05] text-slate-500"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {meta.label}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className={`border-t ${tk.dropdownFoot}`}>
                    <button
                      className={`w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${tk.accent} hover:opacity-80`}
                      onClick={() => {
                        onFeatureSelect("activity");
                        setShowNotifications(false);
                      }}
                    >
                      View all activity
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Theme picker (desktop only) */}
            <div className="relative hidden sm:block" ref={themeRef}>
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                title="Appearance"
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-150 ${tk.iconBtn} ${
                  isSyncing ? "opacity-50 pointer-events-none" : ""
                } ${
                  showThemePicker
                    ? isDark
                      ? "bg-white/[0.07] text-slate-100"
                      : "bg-slate-100 text-slate-800"
                    : ""
                }`}
              >
                <ThemeIcon />
              </button>

              {showThemePicker && (
                <div
                  className={`absolute right-0 mt-2.5 w-[200px] rounded-2xl overflow-hidden border animate-slideDown ${tk.dropdown}`}
                >
                  <div className={`px-3 py-2.5 border-b ${tk.dropdownHead}`}>
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-widest ${tk.muted}`}
                    >
                      Appearance
                    </p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    {themeOptions.map(
                      ({ mode, icon: Icon, label, desc, iconClass }) => {
                        const isActive = themeMode === mode;
                        return (
                          <button
                            key={mode}
                            onClick={() => handleThemeSelect(mode)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                              isActive
                                ? isDark
                                  ? "bg-violet-500/15 border border-violet-500/25"
                                  : "bg-violet-50 border border-violet-100"
                                : `border border-transparent ${
                                    isDark
                                      ? "hover:bg-white/[0.05]"
                                      : "hover:bg-slate-50"
                                  }`
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 flex-shrink-0 ${
                                isActive
                                  ? isDark
                                    ? "text-violet-400"
                                    : "text-violet-600"
                                  : iconClass || tk.muted
                              }`}
                            />
                            <div className="min-w-0">
                              <p
                                className={`text-xs font-semibold ${
                                  isActive
                                    ? isDark
                                      ? "text-violet-300"
                                      : "text-violet-700"
                                    : tk.text
                                }`}
                              >
                                {label}
                              </p>
                              <p className={`text-[10px] ${tk.muted}`}>
                                {desc}
                              </p>
                            </div>
                            {isActive && (
                              <span
                                className={`ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  isDark ? "bg-violet-400" : "bg-violet-500"
                                }`}
                              />
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <div className={`px-3 py-2 border-t ${tk.dropdownFoot}`}>
                    <p
                      className={`text-[10px] ${tk.muted} flex items-center gap-1.5`}
                    >
                      <Monitor className="w-3 h-3" />
                      System is {systemIsDark ? "dark" : "light"} right now
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className={`hidden sm:block w-px h-5 mx-0.5 ${tk.divider}`} />

            {/* 4. User profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-xl border transition-all duration-150 ${tk.userBtn}`}
              >
                <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                  {userProfile?.avatar ? (
                    <img
                      src={userProfile.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-white" />
                  )}
                  {/* Online indicator */}
                  {isConnected && (
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border border-white rounded-full" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p
                    className={`text-[13px] font-semibold leading-tight ${tk.text}`}
                  >
                    {user.username}
                  </p>
                  <p className={`text-[11px] leading-tight ${tk.accent}`}>
                    {user.role}
                  </p>
                </div>
              </button>

              {showProfile && userProfile && (
                <div
                  className={`absolute right-0 mt-2.5 w-[300px] rounded-2xl overflow-hidden border animate-slideDown ${tk.dropdown}`}
                >
                  <div className={`px-4 py-4 border-b ${tk.dropdownHead}`}>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
                        {userProfile.avatar ? (
                          <img
                            src={userProfile.avatar}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-[15px] font-semibold truncate ${tk.text}`}
                        >
                          {userProfile.fullName || user.username}
                        </p>
                        <p className={`text-xs mt-0.5 ${tk.accent}`}>
                          {user.role}
                        </p>
                        {isConnected && (
                          <p className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-500 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                            Online
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 space-y-2">
                    {[
                      { icon: Mail, value: userProfile.email },
                      { icon: Wifi, value: userProfile.phone },
                      {
                        icon: Clock,
                        value: userProfile.joinedDate
                          ? `Joined ${userProfile.joinedDate}`
                          : null,
                      },
                      {
                        icon: Eye,
                        value: userProfile.lastLogin
                          ? `Last login ${userProfile.lastLogin}`
                          : null,
                      },
                    ]
                      .filter((row) => row.value)
                      .map(({ icon: Icon, value }, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <Icon
                            className={`w-3.5 h-3.5 flex-shrink-0 ${tk.muted}`}
                          />
                          <span className={`text-xs truncate ${tk.muted}`}>
                            {value}
                          </span>
                        </div>
                      ))}
                    {userProfile.bio && (
                      <p
                        className={`text-xs italic pt-1 border-t ${
                          isDark ? "border-white/[0.06]" : "border-slate-100"
                        } ${tk.muted}`}
                      >
                        &ldquo;{userProfile.bio}&rdquo;
                      </p>
                    )}
                  </div>

                  <div
                    className={`px-4 pb-4 pt-2 border-t space-y-2 ${
                      isDark ? "border-white/[0.06]" : "border-slate-100"
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => router.push("/admin/user/profile")}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isDark
                            ? "bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20"
                            : "bg-violet-50 hover:bg-violet-100 text-violet-600 border border-violet-100"
                        }`}
                      >
                        <UserCog className="w-3.5 h-3.5" />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => router.push("/admin/user/settings")}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isDark
                            ? "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08]"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Settings
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        onLogout();
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${tk.logoutBtn}`}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Window controls — Capacitor native only */}
            {isCapacitor && (
              <div
                className={`hidden sm:flex items-center gap-0.5 ml-1 pl-2 border-l ${
                  isDark ? "border-white/[0.06]" : "border-slate-200"
                }`}
              >
                <button
                  onClick={() => window.electron?.minimizeWindow()}
                  title="Minimize"
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 ${tk.winBtn}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => window.electron?.maximizeWindow()}
                  title={isMaximized ? "Restore" : "Maximize"}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 ${tk.winBtn}`}
                >
                  {isMaximized ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => window.electron?.closeWindow()}
                  title="Close"
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all active:scale-90 text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </header>
  );
}
