"use client";

import { useEffect, useState } from "react";
import { 
  Folder, 
  MessageSquare, 
  FileText, 
  Code, 
  BookOpen, 
  Globe,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Wifi
} from "lucide-react";
import Project from "../Components/Project";
import ContactResponse from "../Components/ContactResponse";
import Notepad from "../Components/Notepad";
import ConnectionCheck from "../Components/PythonFlask";
import Blog from "../Components/Blog";
import Ipaddress from "../Components/Ipaddress";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const [user, setUser] = useState({ username: "Achinta Hazra", role: "admin" });
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [ipAddress, setipAddress] = useState("117.233.158.244");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login'); // Add redirect after logout if needed
  };

  // Fixed handleClick function
  const handleClick = () => {
    try {
      router.push('/portfolio/anime-list');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = '/portfolio/anime-list';
    }
  };

  const menuItems = [
    {
      id: "projects",
      title: "Manage Projects",
      icon: Folder,
      gradient: "from-blue-500 to-purple-500",
      image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a1_cqsx8x.jpg"
    },
    {
      id: "anime",
      title: "AnimeList",
      icon: BookOpen,
      gradient: "from-pink-500 to-red-500",
      image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1760892290/background-desktop_r4pccr.jpg",
      action: handleClick, // This will now work properly
      isExternal: true // Flag to indicate this is a navigation action
    },
    {
      id: "IP",
      title: "IP Addresses",
      icon: Globe,
      gradient: "from-green-500 to-teal-500",
      image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1761317160/ip-address-lookup_czcb34.jpg"
    },
    {
      id: "messages",
      title: "View Messages",
      icon: MessageSquare,
      gradient: "from-indigo-500 to-blue-500",
      image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a2_jjgzr3.png"
    },
    {
      id: "Notepad",
      title: "Go To Notepad",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a3_uutdd3.avif"
    },
    {
      id: "Blog",
      title: "Blog Upload",
      icon: BookOpen,
      gradient: "from-cyan-500 to-blue-500",
      image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1756037563/write-a-great-blog-post_ivsbz9.jpg"
    },    {
      id: "Flask",
      title: "Python Flask",
      icon: Code,
      gradient: "from-yellow-500 to-orange-500",
      image: "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755834332/flask_o3qe55.jpg"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // View routing
  if (user.role === "admin" && activeView === "projects") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2.5 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 transition-all active:scale-95 font-medium flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <Project />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "messages") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 p-4">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2.5 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 transition-all active:scale-95 font-medium flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <ContactResponse />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "Notepad") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-4">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2.5 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 transition-all active:scale-95 font-medium flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <Notepad />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "Flask") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 p-4">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2.5 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 transition-all active:scale-95 font-medium flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <ConnectionCheck />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "Blog") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 p-4">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2.5 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 transition-all active:scale-95 font-medium flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <Blog />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "IP") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 p-4">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2.5 bg-white/20 backdrop-blur-xl text-white rounded-xl hover:bg-white/30 transition-all active:scale-95 font-medium flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <Ipaddress />
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-800/95 to-purple-800/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{user.username}</p>
                <p className="text-xs text-gray-300 capitalize">{user.role}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 active:scale-95 transition-all"
            >
              <LogOut className="w-5 h-5 text-red-400" />
            </button>
          </div>

          {/* IP Address */}
          <div className="mt-3 flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-300">IP:</span>
            <span className="text-xs text-green-400 font-mono">{ipAddress}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Title */}
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Dashboard</h1>
        <p className="text-sm text-gray-300 text-center">Manage your portfolio</p>
      </div>

      {/* Menu Grid */}
      <div className="px-4 pb-6 space-y-3">
        {user.role === "admin" && menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) {
                // For external navigation actions
                item.action();
              } else {
                // For internal view changes
                setActiveView(item.id);
              }
            }}
            className="w-full group"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all active:scale-98">
              <div className="flex items-center gap-4 p-4">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <h3 className="text-white font-semibold text-base mb-0.5">{item.title}</h3>
                  <p className="text-gray-400 text-xs">Tap to access</p>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>

              {/* Image Preview */}
              <div className="h-32 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </button>
        ))}

        {user.role === "editor" && (
          <button
            onClick={() => setActiveView("Notepad")}
            className="w-full group"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all active:scale-98">
              <div className="flex items-center gap-4 p-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-semibold text-base mb-0.5">Go To Notepad</h3>
                  <p className="text-gray-400 text-xs">Tap to access</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div className="h-32 overflow-hidden">
                <img 
                  src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a3_uutdd3.avif" 
                  alt="Notepad"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8"></div>
    </div>
  );
};

export default AdminPage;