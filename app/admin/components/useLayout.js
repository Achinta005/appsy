"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Settings,
  Bell,
  Bookmark,
  Download,
  PlayCircle,
} from "lucide-react";

export default function UserPageLayout({ children, username }) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Tab Navigation - Sticky */}
      <div className="top-0 z-10 pt-5">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide justify-center">
            <div className="absolute left-5">
              <button className="hover:text-white hover:bg-orange-600 flex items-center gap-2 px-6 py-2.5 whitespace-nowrap transition-all duration-200 rounded-lg text-gray-300 border-transparent bg-white/10 cursor-pointer" onClick={()=>router.push('/admin')}>
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
                    transition-all duration-200 rounded-lg
                    ${
                      isActive
                        ? "text-white bg-orange-600"
                        : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.name}</span>
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
