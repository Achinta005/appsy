"use client";

import { User, LogOut, Wifi, Bell, Settings, Search } from "lucide-react";

export default function AdminHeader({ user, ipAddress, onLogout }) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-slate-800/95 via-purple-800/95 to-slate-800/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search features..."
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* IP Address */}
            <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 border border-white/20">
              <Wifi className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-300">IP:</span>
              <span className="text-xs text-green-400 font-mono">
                {ipAddress}
              </span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="hidden sm:block p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-300" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white/10 rounded-lg pl-2 sm:pl-3 pr-1 py-1 border border-white/20">
              <div className="hidden sm:block text-right">
                <p className="text-xs sm:text-sm font-medium text-white">
                  {user.username}
                </p>
                <p className="text-xs text-purple-300">{user.role}</p>
              </div>

              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all active:scale-95"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Mobile IP Address */}
        <div className="sm:hidden mt-3 flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 border border-white/20">
          <Wifi className="w-3 h-3 text-green-400 flex-shrink-0" />
          <span className="text-xs text-gray-300">IP:</span>
          <span className="text-xs text-green-400 font-mono">{ipAddress}</span>
        </div>
      </div>
    </header>
  );
}
