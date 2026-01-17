"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "../lib/auth";
import { useAuth } from "../context/authContext";
import useApi from "../../services/authservices";
import useUserProfile from "@/hooks/useUserdata";
import { useActivityStream } from "@/hooks/useActivityStream";

// Components
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import AdminFeatureRenderer from "./components/AdminFeatureRenderer";
import { adminFeatures } from "./config/adminFeatures";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(null);
  const [ipAddress, setIpAddress] = useState("Loading...");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  
  const { userProfile } = useUserProfile();
  const { activities, isConnected } = useActivityStream();

  const router = useRouter();
  const {
    isAuthLoading,
    accessToken,
    isAuthenticated,
    setAccessToken,
    setIsAuthenticated,
  } = useAuth();

  const apiFetch = useApi();

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    
    // Listen for theme changes
    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Redirect if authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Initialize admin data
  useEffect(() => {
    const initAdmin = async () => {
      const userData = getUserFromToken(accessToken);
      setUser(userData);

      // Set default feature based on role
      const defaultFeature = getDefaultFeatureForRole(userData.role);
      setActiveFeature(defaultFeature);

      try {
        const data = await apiFetch(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/admin/get-ip`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userData.userId }),
          }
        );
        const result = await data.json();
        if (result && !result.error) {
          setIpAddress(result.ip || "Not Available");
        } else {
          setIpAddress("Not Available");
        }
      } catch (error) {
        console.error("Error fetching IP:", error);
        setIpAddress("Currently Not Available!");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      initAdmin();
    }
  }, [accessToken]);

  // Helper function to get default feature based on role
  const getDefaultFeatureForRole = (role) => {
    if (role === "admin") {
      return "dashboard";
    }

    // For non-admin roles, find the first available feature
    const availableFeature = Object.entries(adminFeatures).find(
      ([_, feature]) => feature.roles.includes(role)
    );

    return availableFeature ? availableFeature[0] : null;
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const res = await apiFetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      setAccessToken(null);
      setIsAuthenticated(false);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Theme-based styles
  const getThemeStyles = () => {
    if (theme === "dark") {
      return {
        container: "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950",
        loading: "bg-gradient-to-br from-slate-950 to-slate-900",
        spinner: "border-purple-400",
        text: "text-gray-100"
      };
    }
    return {
      container: "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50",
      loading: "bg-gradient-to-br from-blue-100 to-purple-100",
      spinner: "border-purple-600",
      text: "text-gray-900"
    };
  };

  const styles = getThemeStyles();

  // Loading state
  if (loading || !user || !activeFeature) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${styles.loading}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${styles.spinner} mx-auto mb-4`}></div>
          <p className={`${styles.text} text-lg font-medium`}>Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${styles.container} overflow-hidden transition-colors duration-300`}>
      {/* Sidebar */}
      <AdminSidebar
        activeFeature={activeFeature}
        onFeatureSelect={setActiveFeature}
        userRole={user.role}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        theme={theme}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          user={user}
          ipAddress={ipAddress}
          onLogout={handleLogout}
          onFeatureSelect={setActiveFeature}
          activities={activities}
          isConnected={isConnected}
          userProfile={userProfile}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <AdminFeatureRenderer
            featureKey={activeFeature}
            onBack={() => {
              // Go back to default feature for the user's role
              const defaultFeature = getDefaultFeatureForRole(user.role);
              setActiveFeature(defaultFeature);
            }}
            userRole={user.role}
            onFeatureSelect={setActiveFeature}
            theme={theme}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;