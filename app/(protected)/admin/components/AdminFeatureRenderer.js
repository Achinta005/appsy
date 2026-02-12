"use client";

import { useEffect, useState } from "react";
import { adminFeatures } from "../config/adminFeatures";

export default function AdminFeatureRenderer({
  featureKey,
  onBack,
  onFeatureSelect,
  userRole
}) {
  const [theme, setTheme] = useState("light");

  // Initialize and listen for theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);

    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!featureKey) return null;

  const feature = adminFeatures[featureKey];

  // Theme-based styles
  const isDark = theme === "dark";
  const textError = isDark ? "text-red-400" : "text-red-600";
  const textLink = isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700";
  
  const scrollbarTrack = isDark
    ? "rgba(15, 23, 42, 0.5)"
    : "rgba(243, 232, 255, 0.5)";
  const scrollbarBorder = isDark
    ? "rgba(15, 23, 42, 0.5)"
    : "rgba(216, 180, 254, 0.3)";
  const scrollbarThumb = isDark
    ? "linear-gradient(180deg, #a855f7 0%, #ec4899 100%)"
    : "linear-gradient(180deg, #9333ea 0%, #db2777 100%)";
  const scrollbarThumbHover = isDark
    ? "linear-gradient(180deg, #9333ea 0%, #db2777 100%)"
    : "linear-gradient(180deg, #7c3aed 0%, #be185d 100%)";
  const scrollbarCorner = isDark
    ? "rgba(15, 23, 42, 0.5)"
    : "rgba(243, 232, 255, 0.5)";

  if (!feature) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className={`${textError} text-lg mb-4 font-semibold`}>Feature not found</p>
          {onBack && (
            <button
              onClick={onBack}
              className={`${textLink} underline transition-colors font-medium`}
            >
              Go back
            </button>
          )}
        </div>
      </div>
    );
  }

  const FeatureComponent = feature.component;

  return (
    <div className="h-full w-full overflow-auto custom-scrollbar">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${scrollbarTrack};
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${scrollbarThumb};
          border-radius: 10px;
          border: 2px solid ${scrollbarBorder};
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${scrollbarThumbHover};
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: ${scrollbarCorner};
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #a855f7 ${scrollbarTrack};
        }
      `}</style>

      <FeatureComponent onFeatureSelect={onFeatureSelect} theme={theme} />
    </div>
  );
}