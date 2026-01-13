"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  MessageSquare,
  FolderOpen,
  Activity,
  Eye,
} from "lucide-react";

const StatCard = ({ icon: Icon, title, value, change, gradient }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {change && (
        <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-sm text-gray-400">{title}</p>
  </div>
);

export default function DashboardHome() {
  const [stats] = useState({
    totalProjects: 12,
    totalMessages: 45,
    weeklyVisits: 1234,
    activeUsers: 8,
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Floating Gradient Orbs with CSS Animation */}
        <div 
          className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            animation: 'float 7s ease-in-out infinite',
          }}
        ></div>
        <div 
          className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            animation: 'float 7s ease-in-out infinite 2s',
          }}
        ></div>
        <div 
          className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{
            animation: 'float 7s ease-in-out infinite 4s',
          }}
        ></div>
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
        
        {/* Bottom Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 space-y-6 p-6 max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="pt-4 pb-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-300">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={FolderOpen}
            title="Total Projects"
            value={stats.totalProjects}
            change="+2 this week"
            gradient="from-blue-500 to-purple-500"
          />
          <StatCard
            icon={MessageSquare}
            title="Messages"
            value={stats.totalMessages}
            change="+12%"
            gradient="from-green-500 to-teal-500"
          />
          <StatCard
            icon={Eye}
            title="Weekly Visits"
            value={stats.weeklyVisits}
            change="+23%"
            gradient="from-pink-500 to-rose-500"
          />
          <StatCard
            icon={Users}
            title="Active Users"
            value={stats.activeUsers}
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1">
              Upload Project
            </button>
            <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1">
              View Messages
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-1">
              Check Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { action: "New project uploaded", time: "2 hours ago", type: "success" },
              { action: "Message received from visitor", time: "5 hours ago", type: "info" },
              { action: "Blog post published", time: "1 day ago", type: "success" },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === "success" ? "bg-green-400" : "bg-blue-400"
                }`} />
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
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
      `}} />
    </div>
  );
}