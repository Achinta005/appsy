"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Settings,
  Bell,
} from "lucide-react";

export default function UserPageLayout({ children, username }) {
  const pathname = usePathname();
  const router = useRouter();
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

  const tabs = [
    {
      name: "Profile",
      path: "/admin/user/profile",
      icon: User,
    },
    {
      name: "Notifications",
      path: "/admin/user/notifications",
      icon: Bell,
    },
    {
      name: "Settings",
      path: "/admin/user/settings",
      icon: Settings,
    },
  ];

  const isActiveTab = (path) => pathname === path;

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
    : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50";
  
  const backBtnBg = isDark ? "bg-white/10" : "bg-white/80";
  const backBtnHover = isDark 
    ? "hover:bg-purple-600 hover:text-white" 
    : "hover:bg-purple-500 hover:text-white";
  const backBtnText = isDark ? "text-gray-300" : "text-gray-700";
  
  const activeTabBg = isDark ? "bg-purple-600" : "bg-purple-500";
  const inactiveTabText = isDark ? "text-gray-400" : "text-gray-600";
  const inactiveTabHover = isDark 
    ? "hover:text-white hover:bg-white/10" 
    : "hover:text-gray-900 hover:bg-purple-100";

  return (
    <div className={`min-h-screen ${bgGradient} transition-colors duration-300`}>
      {/* Tab Navigation - Sticky */}
      <div className="top-0 z-10 pt-5">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide justify-center">
            <div className="absolute left-5">
              <button 
                className={`flex items-center gap-2 px-6 py-2.5 whitespace-nowrap transition-all duration-200 rounded-lg border-transparent ${backBtnBg} ${backBtnText} ${backBtnHover} cursor-pointer font-medium`} 
                onClick={() => router.push('/admin')}
              >
                Back
              </button>
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = isActiveTab(tab.path);

              return (
                <button
                  key={tab.path}
                  onClick={() => router.push(tab.path)}
                  className={`
                    flex items-center gap-2 px-4 py-3 whitespace-nowrap
                    transition-all duration-200 rounded-lg font-medium
                    ${
                      isActive
                        ? `text-white ${activeTabBg} shadow-lg`
                        : `${inactiveTabText} border-transparent ${inactiveTabHover}`
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page Content - Fixed Position Container */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}