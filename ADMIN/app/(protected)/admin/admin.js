"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import useApi from "@/services/authservices";
import useUserProfile from "@/hooks/useUserdata";
import { useActivityStream } from "@/hooks/useActivityStream";
import { useBackgroundContext } from "../context/BackgroundContext";

import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import AdminFeatureRenderer from "./components/AdminFeatureRenderer";
import { adminFeatures } from "./config/adminFeatures";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lastActiveFeature") || null;
    }
    return null;
  });
  const [ipAddress, setIpAddress] = useState("Loading...");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const isResizing = useRef(false);

  // ✅ Single source of truth for theme AND background image
  const { theme, bgImage } = useBackgroundContext();
  const isDark = theme === "dark";

  const { userProfile } = useUserProfile();
  const { activities, isConnected } = useActivityStream();

  const router = useRouter();
  const { isLoading, isAuthenticated, logout } = useAuth();

  const apiFetch = useApi();

  const handleFeatureSelect = useCallback((key) => {
    localStorage.setItem("lastActiveFeature", key);
    setActiveFeature(key);
  }, []);

  // ── Resize handlers ──────────────────────────────────────────────────────────
  const handleResizeStart = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleResizeMove = (e) => {
      if (!isResizing.current) return;
      setSidebarWidth(Math.min(Math.max(e.clientX, 180), 480));
    };
    const handleResizeEnd = () => {
      if (!isResizing.current) return;
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleResizeEnd);
    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, []);

  // ── Auth redirect ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // ── Init admin data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const initAdmin = async () => {
      setUser(userProfile);
      const saved = localStorage.getItem("lastActiveFeature");
      const isValid =
        saved && adminFeatures[saved]?.roles.includes(userProfile.roleSlug);
      const defaultFeature = isValid
        ? saved
        : getDefaultFeatureForRole(userProfile.roleSlug);
      handleFeatureSelect(defaultFeature);

      try {
        const data = await apiFetch(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/get-ip`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userProfile.userId }),
          },
        );
        const result = await data.json();
        setIpAddress(
          result && !result.error
            ? result.ip || "Not Available"
            : "Not Available",
        );
      } catch {
        setIpAddress("Currently Not Available!");
      } finally {
        setLoading(false);
      }
    };

    if (userProfile) initAdmin();
  }, [userProfile]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const getDefaultFeatureForRole = (role) => {
    if (role === "admin") return "dashboard";
    const found = Object.entries(adminFeatures).find(([_, f]) =>
      f.roles.includes(role),
    );
    return found ? found[0] : null;
  };

  const handleLogout = async () => {
    window.electron?.clearCredentials();
    await logout();
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading || !user || !activeFeature) {
    return (
      <div className="min-h-screen flex items-center justify-center relative transition-all duration-300">
        {/* Loading background */}
        <div
          className="absolute inset-0 -z-10"
          style={
            bgImage
              ? {
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : undefined
          }
        >
          <div
            className={`absolute inset-0 ${
              isDark
                ? "bg-gradient-to-br from-slate-950/80 to-slate-900/80"
                : "bg-gradient-to-br from-blue-100/80 to-purple-100/80"
            }`}
          />
        </div>

        <div className="text-center">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4 ${
              isDark ? "border-purple-400" : "border-purple-600"
            }`}
          />
          <p
            className={`text-lg font-medium ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Loading Admin Panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div
        className="fixed inset-0 -z-10 transition-all duration-500"
        style={
          bgImage
            ? {
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        {/* Overlay — tint over image OR fallback gradient when no image */}
        <div
          className={`absolute inset-0 transition-colors duration-300 ${
            bgImage
              ? isDark
                ? "bg-black/40"
                : "bg-white/20"
              : isDark
                ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
                : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
          }`}
        />
      </div>

      {/* Sidebar — transparent, blurs against fixed bg */}
      <AdminSidebar
        activeFeature={activeFeature}
        onFeatureSelect={handleFeatureSelect}
        userRole={user.roleSlug}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        theme={theme}
        width={sidebarWidth}
        onResizeStart={handleResizeStart}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header — transparent, blurs against fixed bg */}
        <AdminHeader
          user={user}
          ipAddress={ipAddress}
          onLogout={handleLogout}
          onFeatureSelect={handleFeatureSelect}
          activities={activities}
          isConnected={isConnected}
          userProfile={userProfile}
          theme={theme}
        />

        {/* Feature content */}
        <main className="flex-1 overflow-auto">
          <AdminFeatureRenderer
            featureKey={activeFeature}
            onBack={() =>
              handleFeatureSelect(getDefaultFeatureForRole(user.roleSlug))
            }
            userRole={user.roleSlug}
            onFeatureSelect={setActiveFeature}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
