"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken, removeAuthToken } from "../lib/auth";
import Project from "./Components/Project";
import ContactResponse from "./Components/ContactResponse";
import Notepad from "./Components/Notepad";
import RenderServiceDashboard from "./Components/backendHealthCheck";
import Blog from "./Components/Blog";
import Ipaddress from "./Components/Ipaddress";
import { PortfolioApiService } from "@/services/PortfolioApiService";
import {
  Folder,
  MessageSquare,
  FileText,
  Code,
  BookOpen,
  Globe,
  LogOut,
  ChevronRight,
  User,
  Wifi,
  Server,
} from "lucide-react";

const AdminPage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [ipAddress, setipAddress] = useState("117.233.158.244");
  const [documents, setDocuments] = useState([]);
  const router = useRouter();

  const handleClick = () => {
    router.push("/anime-list");
  };

  useEffect(() => {
    const initAdmin = async () => {
      const userData = getUserFromToken();

      // 1️⃣ Auth guard
      if (!userData || !userData.userId) {
        setipAddress("User Not Logged In");
        router.replace("/login");
        setLoading(false);
        return;
      }

      // 2️⃣ Set user state
      setUser(userData);

      // 3️⃣ Fetch IP
      try {
        const result = await PortfolioApiService.Fetch_IP(userData.userId);

        if (result && !result.error) {
          setipAddress(result.ip || "Not Available");
        } else {
          setipAddress("Not Available");
        }
      } catch (error) {
        console.error("Error fetching IP:", error);
        setipAddress("Currently Not Available !");
      } finally {
        // 4️⃣ Stop loading AFTER everything
        setLoading(false);
      }
    };

    initAdmin();
  }, [router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  const handleNewDocument = (newDoc) => {
    setDocuments((prevDocs) => [newDoc, ...prevDocs]);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      id: "projects",
      title: "Manage Projects",
      icon: Folder,
      gradient: "from-blue-500 to-purple-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a1_cqsx8x.jpg",
    },
    {
      id: "render",
      title: "Render Health Check",
      icon: Server,
      gradient: "from-blue-500 to-purple-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1763994657/render-dashboard_qyvptu.png",
    },
    {
      id: "anime",
      title: "AnimeList",
      icon: BookOpen,
      gradient: "from-pink-500 to-red-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1760892290/background-desktop_r4pccr.jpg",
      action: handleClick, // This will now work properly
      isExternal: true, // Flag to indicate this is a navigation action
    },
    {
      id: "IP",
      title: "IP Addresses",
      icon: Globe,
      gradient: "from-green-500 to-teal-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1761317160/ip-address-lookup_czcb34.jpg",
    },
    {
      id: "messages",
      title: "View Messages",
      icon: MessageSquare,
      gradient: "from-indigo-500 to-blue-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a2_jjgzr3.png",
    },
    {
      id: "Notepad",
      title: "Go To Notepad",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a3_uutdd3.avif",
    },
    {
      id: "Blog",
      title: "Blog Upload",
      icon: BookOpen,
      gradient: "from-cyan-500 to-blue-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1756037563/write-a-great-blog-post_ivsbz9.jpg",
    },
  ];

  if (user.role === "admin" && activeView === "projects") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-tr from-blue-700 via-pink-600 to-yellow-300">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 cursor-pointer bg-white/40 backdrop-blur-3xl text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <Project />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "render") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-tr from-blue-700 via-pink-600 to-yellow-300">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 cursor-pointer bg-white/40 backdrop-blur-3xl text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <RenderServiceDashboard />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "messages") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-[url(https://res.cloudinary.com/dc1fkirb4/image/upload/v1755757547/response_arjl1x.webp)] bg-cover bg-center">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/20 backdrop-blur-3xl text-black cursor-pointer rounded-lg hover:bg-white/30 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <ContactResponse />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "Notepad") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-[url(https://res.cloudinary.com/dc1fkirb4/image/upload/v1755758676/notepad_e5ey08.jpg)] bg-cover bg-center">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/10 backdrop-blur-3xl text-white cursor-pointer rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <Notepad onDocumentSaved={handleNewDocument} />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "Blog") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-bl from-pink-600 via-yellow-400 to-purple-700">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/30 backdrop-blur-3xl text-white cursor-pointer rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <Blog />
      </div>
    );
  }
  if (user.role === "admin" && activeView === "IP") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-bl from-pink-600 via-yellow-400 to-purple-700">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-white/30 backdrop-blur-3xl text-white cursor-pointer rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <Ipaddress />
      </div>
    );
  }

  if (user.role === "editor" && activeView === "Notepad") {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 to-slate-800">
        <button
          onClick={() => setActiveView("dashboard")}
          className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Dashboard
        </button>
        <Notepad onDocumentSaved={handleNewDocument} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header - Responsive */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-800/95 to-purple-800/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm sm:text-base">
                  {user.username}
                </p>
                <p className="text-xs sm:text-sm text-gray-300 capitalize">
                  {user.role}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 sm:p-2.5 bg-red-500/20 rounded-lg hover:bg-red-500/30 active:scale-95 transition-all"
            >
              <LogOut className="w-5 h-5 sm:w-5 sm:h-5 text-red-400" />
            </button>
          </div>

          {/* IP Address - Responsive */}
          <div className="mt-3 flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 max-w-7xl mx-auto">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-xs sm:text-sm text-gray-300">IP:</span>
            <span className="text-xs sm:text-sm text-green-400 font-mono">
              {ipAddress}
            </span>
          </div>
        </div>
      </div>

      {/* Dashboard Title - Responsive */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-300 text-center">
          Manage your portfolio
        </p>
      </div>

      {/* Menu Grid - Fully Responsive */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {user.role === "admin" &&
            menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveView(item.id);
                  }
                }}
                className="w-full group"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all active:scale-98 h-full">
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="text-white font-semibold text-sm sm:text-base mb-0.5 truncate">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs">Tap to access</p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>

                  {/* Image Preview */}
                  <div className="h-32 sm:h-36 lg:h-40 overflow-hidden">
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
              className="w-full group md:col-span-2 lg:col-span-1"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all active:scale-98 h-full">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-white font-semibold text-sm sm:text-base mb-0.5 truncate">
                      Go To Notepad
                    </h3>
                    <p className="text-gray-400 text-xs">Tap to access</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                <div className="h-32 sm:h-36 lg:h-40 overflow-hidden">
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
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8 sm:h-12"></div>
    </div>
  );
};

export default AdminPage;
