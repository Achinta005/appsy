"use client";

import { useDashboardData } from "@/hooks/useDashboarddata";
import {
  Users,
  MessageSquare,
  FolderOpen,
  Activity,
  Eye,
  FileText,
  Server,
  Loader2,
  RefreshCw,
} from "lucide-react";

const StatCard = ({ icon: Icon, title, value, gradient, isLoading, error }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20 hover:border-white/40 transition-all">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1">
        <div
          className={`w-7 h-7 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 truncate">{title}</p>
          {isLoading ? (
            <div className="flex items-center gap-1 mt-0.5">
              <Loader2 className="w-3 h-3 text-white animate-spin" />
              <span className="text-xs text-gray-400">...</span>
            </div>
          ) : error ? (
            <span className="text-xs text-red-400">Error</span>
          ) : (
            <h3 className="text-lg font-bold text-white">{value || 0}</h3>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ServiceHealthBadge = ({ status, isLoading, error }) => {
  const statusColors = {
    operational: "bg-green-500",
    degraded: "bg-yellow-500",
    down: "bg-red-500",
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Server className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">Service Health</p>
            {isLoading ? (
              <div className="flex items-center gap-1 mt-0.5">
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              </div>
            ) : error ? (
              <span className="text-xs text-red-400">Error</span>
            ) : (
              <h3 className="text-lg font-bold text-white capitalize">
                {status || "Unknown"}
              </h3>
            )}
          </div>
        </div>
        {!isLoading && !error && status && (
          <div
            className={`w-2 h-2 rounded-full ${statusColors[status]} animate-pulse flex-shrink-0`}
          />
        )}
      </div>
    </div>
  );
};

export default function DashboardHome({ onFeatureSelect }) {
  const { data, loading, errors, refreshAll, isLoading } = useDashboardData();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div
          className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ animation: "float 7s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ animation: "float 7s ease-in-out infinite 2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ animation: "float 7s ease-in-out infinite 4s" }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 space-y-4 p-6 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="pt-4 pb-2 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-300">
              Welcome back! Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <button
            onClick={refreshAll}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          <StatCard
            icon={Users}
            title="Total Users"
            value={data.users}
            gradient="from-blue-500 to-purple-500"
            isLoading={loading.users}
            error={errors.users}
          />
          <StatCard
            icon={FolderOpen}
            title="Projects"
            value={data.projects}
            gradient="from-green-500 to-teal-500"
            isLoading={loading.projects}
            error={errors.projects}
          />
          <StatCard
            icon={FileText}
            title="Blog Posts"
            value={data.blogPosts}
            gradient="from-purple-500 to-pink-500"
            isLoading={loading.blogPosts}
            error={errors.blogPosts}
          />
          <StatCard
            icon={MessageSquare}
            title="Messages"
            value={data.messages}
            gradient="from-orange-500 to-red-500"
            isLoading={loading.messages}
            error={errors.messages}
          />
          <StatCard
            icon={Eye}
            title="Visits"
            value={data.weeklyVisits}
            gradient="from-pink-500 to-rose-500"
            isLoading={loading.weeklyVisits}
            error={errors.weeklyVisits}
          />
          <ServiceHealthBadge
            status={data.serviceHealth}
            isLoading={loading.serviceHealth}
            error={errors.serviceHealth}
          />
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1"
              onClick={()=>onFeatureSelect(projects)}
            >
              Upload Project
            </button>
            <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1">
              View Messages
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1">
              Check Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 mb-8">
          <h2 className="text-lg font-bold text-white mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {[
              {
                action: "New project uploaded",
                time: "2 hours ago",
                type: "success",
              },
              {
                action: "Message received from visitor",
                time: "5 hours ago",
                type: "info",
              },
              {
                action: "Blog post published",
                time: "1 day ago",
                type: "success",
              },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    activity.type === "success" ? "bg-green-400" : "bg-blue-400"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `,
        }}
      />
    </div>
  );
}
