"use client";

import { useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { adminFeatures } from "../config/adminFeatures";

export default function AdminSidebar({
  activeFeature,
  onFeatureSelect,
  userRole,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filteredFeatures = Object.entries(adminFeatures).filter(
    ([_, feature]) => feature.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-purple-600 text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-72
          bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 
          border-r border-white/10 flex flex-col transition-all duration-300 z-40
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo Section */}
        <div className="p-3">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-xs text-gray-400 mt-1">Management Dashboard</p>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-white/30 via-white/20 to-transparent"></div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(15, 23, 42, 0.3);
              border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, #a855f7 0%, #ec4899 100%);
              border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(180deg, #9333ea 0%, #db2777 100%);
            }

            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #a855f7 rgba(15, 23, 42, 0.3);
            }
          `}</style>

          {filteredFeatures.map(([key, feature]) => {
            const Icon = feature.icon;
            const isActive = activeFeature === key;

            return (
              <button
                key={key}
                onClick={() => {
                  onFeatureSelect(key);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r " +
                      feature.gradient +
                      " text-white shadow-lg"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  className={`flex-shrink-0 w-5 h-5 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                />

                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{feature.title}</p>
                  {feature.description && !isActive && (
                    <p className="text-xs text-gray-400 group-hover:text-gray-300">
                      {feature.description}
                    </p>
                  )}
                </div>

                {isActive && <ChevronRight className="w-4 h-4 text-white" />}

                {feature.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {feature.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-400">
              Role:{" "}
              <span className="text-purple-400 font-semibold">{userRole}</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
