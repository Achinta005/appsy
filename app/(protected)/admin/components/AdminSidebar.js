"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { adminFeatures } from "../config/adminFeatures";

export default function AdminSidebar({
  activeFeature,
  onFeatureSelect,
  userRole,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  // Initialize and listen for theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const filteredFeatures = Object.entries(adminFeatures).filter(
    ([_, feature]) => feature.roles.includes(userRole)
  );

  // Theme-based styles
  const isDark = theme === "dark";
  const sidebarBg = isDark
    ? "bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950"
    : "bg-gradient-to-b from-white via-purple-50 to-white";

  const borderColor = isDark ? "border-white/10" : "border-purple-200/50";
  const titleGradient = isDark
    ? "from-purple-400 to-pink-400"
    : "from-purple-600 to-pink-600";

  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const textDefault = isDark ? "text-gray-300" : "text-gray-700";
  const textHover = isDark ? "hover:text-white" : "hover:text-gray-900";

  const hoverBg = isDark ? "hover:bg-white/10" : "hover:bg-purple-100";
  const footerBg = isDark ? "bg-white/5" : "bg-purple-50";
  const mobileBtnBg = isDark ? "bg-purple-600" : "bg-purple-500";

  const scrollbarTrack = isDark
    ? "rgba(15, 23, 42, 0.3)"
    : "rgba(243, 232, 255, 0.5)";
  const scrollbarThumb = isDark
    ? "linear-gradient(180deg, #a855f7 0%, #ec4899 100%)"
    : "linear-gradient(180deg, #9333ea 0%, #db2777 100%)";
  const scrollbarThumbHover = isDark
    ? "linear-gradient(180deg, #9333ea 0%, #db2777 100%)"
    : "linear-gradient(180deg, #7c3aed 0%, #be185d 100%)";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 ${mobileBtnBg} text-white rounded-lg shadow-lg transition-colors`}
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
          fixed lg:sticky top-0 left-0 h-screen w-64
          ${sidebarBg} 
          border-r ${borderColor} flex flex-col transition-all duration-300 z-40
          ${
            isDark
              ? "shadow-2xl shadow-purple-900/20"
              : "shadow-xl shadow-purple-200/30"
          }
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
            <h2
              className={`text-2xl font-bold bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}
            >
              Admin Panel
            </h2>
            <p className={`text-xs ${textMuted} mt-1`}>Management Dashboard</p>
          </div>
          <div
            className={`flex-1 h-px mt-3 ${
              isDark
                ? "bg-gradient-to-r from-white/30 via-white/20 to-transparent"
                : "bg-gradient-to-r from-purple-300 via-purple-200 to-transparent"
            }`}
          ></div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: ${scrollbarTrack};
              border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: ${scrollbarThumb};
              border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: ${scrollbarThumbHover};
            }

            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #a855f7 ${scrollbarTrack};
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
                    : `${textDefault} ${hoverBg} ${textHover}`
                }`}
              >
                <Icon
                  className={`flex-shrink-0 w-5 h-5 transition-colors ${
                    isActive
                      ? "text-white"
                      : isDark
                      ? "text-gray-400 group-hover:text-white"
                      : "text-gray-500 group-hover:text-gray-900"
                  }`}
                />

                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{feature.title}</p>
                  {feature.description && !isActive && (
                    <p
                      className={`text-xs ${
                        isDark
                          ? "text-gray-400 group-hover:text-gray-300"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
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
        <div className={`p-4 border-t ${borderColor}`}>
          <div className={`${footerBg} rounded-lg p-3 transition-colors`}>
            <p className={`text-xs ${textMuted}`}>
              Role:{" "}
              <span
                className={`${
                  isDark ? "text-purple-400" : "text-purple-600"
                } font-semibold`}
              >
                {userRole}
              </span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
