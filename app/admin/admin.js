"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "../lib/auth";
import { PortfolioApiService } from "../../services/PortfolioApiService";
import { useAuth } from "../context/authContext";
import useApi from "../../services/authservices";

// Components
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import AdminFeatureRenderer from "./components/AdminFeatureRenderer";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState("dashboard");
  const [ipAddress, setIpAddress] = useState("Loading...");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const router = useRouter();
  const {
    isAuthLoading,
    accessToken,
    isAuthenticated,
    setAccessToken,
    setIsAuthenticated,
  } = useAuth();

  const apiFetch = useApi();

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

      try {
        const result = await PortfolioApiService.Fetch_IP(userData.userId);
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

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setAccessToken(null);
      setIsAuthenticated(false);
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        activeFeature={activeFeature}
        onFeatureSelect={setActiveFeature}
        userRole={user.role}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() =>
          setSidebarCollapsed((prev) => !prev)
        }
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          user={user}
          ipAddress={ipAddress}
          onLogout={handleLogout}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <AdminFeatureRenderer
            featureKey={activeFeature}
            onBack={() => setActiveFeature("dashboard")}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
