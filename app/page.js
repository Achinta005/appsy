"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/authContext";
import { 
  Shield, 
  BarChart3, 
  Users, 
  Settings, 
  Zap,
  ArrowRight,
  Lock,
  Database,
  Activity,
  CheckCircle,
  Layers,
  Terminal
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isAuthLoading]);

  if (isAuthLoading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center mb-16">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Shield className="w-16 h-16 text-cyan-400 animate-pulse" />
                <Zap className="w-8 h-8 text-indigo-400 absolute -bottom-1 -right-1" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
              Admin Dashboard
              <br />
              <span className="text-4xl md:text-6xl">Centralized Control</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-indigo-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Manage your entire system from one powerful interface. 
              Monitor, analyze, and control with real-time insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/register"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-cyan-700 transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-xl hover:bg-white/20 transition-all border-2 border-white/20 hover:border-white/40 flex items-center gap-2 text-lg"
              >
                Admin Login
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all hover:scale-105">
              <div className="bg-indigo-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Advanced Analytics
              </h3>
              <p className="text-indigo-200 leading-relaxed">
                Real-time dashboards with comprehensive metrics and insights for data-driven decisions.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all hover:scale-105">
              <div className="bg-cyan-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-cyan-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                User Management
              </h3>
              <p className="text-indigo-200 leading-relaxed">
                Complete control over user accounts, permissions, and access levels from one place.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all hover:scale-105">
              <div className="bg-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Enterprise Security
              </h3>
              <p className="text-indigo-200 leading-relaxed">
                Bank-level encryption and security protocols to keep your data safe and compliant.
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Secure Login
                </h3>
                <p className="text-indigo-200">
                  Access your admin panel with secure authentication
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Monitor Systems
                </h3>
                <p className="text-indigo-200">
                  View real-time metrics and system health dashboards
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Manage & Control
                </h3>
                <p className="text-indigo-200">
                  Execute actions and manage resources efficiently
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Activity className="w-6 h-6 text-indigo-300" />
                  <div className="text-4xl font-bold text-white">99.9%</div>
                </div>
                <p className="text-indigo-200">System Uptime</p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Database className="w-6 h-6 text-cyan-300" />
                  <div className="text-4xl font-bold text-white">50M+</div>
                </div>
                <p className="text-indigo-200">Records Processed</p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-blue-300" />
                  <div className="text-4xl font-bold text-white">24/7</div>
                </div>
                <p className="text-indigo-200">Monitoring & Support</p>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">System Configuration</h3>
                    <p className="text-indigo-200 text-sm">Configure system settings, API endpoints, and integration parameters with ease.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Multi-Layer Access</h3>
                    <p className="text-indigo-200 text-sm">Granular permission controls with role-based access management.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Terminal className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">API Management</h3>
                    <p className="text-indigo-200 text-sm">Full API control with rate limiting, monitoring, and documentation.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Real-Time Monitoring</h3>
                    <p className="text-indigo-200 text-sm">Live system health metrics, alerts, and performance tracking.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
              Join administrators managing their systems with confidence
            </p>
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-cyan-700 transition-all hover:shadow-2xl hover:scale-105 text-lg"
              >
              Get Admin Access
              <Shield className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-indigo-200 text-sm">
              © 2026 Admin Panel. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}