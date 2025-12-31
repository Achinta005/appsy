"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken, removeAuthToken } from "../lib/auth";
import Project from "../ProjectUpload/Project";
import ContactResponse from "../PortfolioResponses/ContactResponse";
import Notepad from "../Notepad/Notepad";
import RenderServiceDashboard from "../Server/backendHealthCheck";
import Blog from "../BlogUpload/Blog";
import Ipaddress from "../IpDatabase/Ipaddress";
import WeeklyVisitsDashboard from "../VisitTracker/WeeklyVisitsDashboard";
import ConversionPage from "../BinaryConverter/ConversionPage";
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
  Grid3x3,
  LayoutGrid,
  ChartColumn,
  Binary,
  ArrowBigLeft,
} from "lucide-react";
import gradient from "@material-tailwind/react/theme/components/timeline/timelineIconColors/gradient";

const AdminPage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [ipAddress, setipAddress] = useState("117.233.158.244");
  const [documents, setDocuments] = useState([]);
  const [gridLayout, setGridLayout] = useState("5");
  const router = useRouter();

  const handleClick = () => {
    router.push("/anime-list");
  };

  useEffect(() => {
    const initAdmin = async () => {
      const userData = getUserFromToken();

      if (!userData || !userData.userId) {
        setipAddress("User Not Logged In");
        router.replace("/login");
        setLoading(false);
        return;
      }

      setUser(userData);

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
      id: "Blog",
      title: "Blog Upload",
      icon: BookOpen,
      gradient: "from-cyan-500 to-blue-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1756037563/write-a-great-blog-post_ivsbz9.jpg",
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
      id: "Visit-Tracker",
      title: "Track Portfolio Visits",
      icon: ChartColumn,
      gradient: "from-pink-500 to-teal-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1765812000/17-what_cc424d55614b9ae928b5_vzjkj1.png",
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
      id: "IP",
      title: "IP Addresses",
      icon: Globe,
      gradient: "from-green-500 to-teal-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1761317160/ip-address-lookup_czcb34.jpg",
    },
    {
      id: "number-conversion",
      title: "Binary Converter",
      icon: Binary,
      gradient: "from-pink-500 to-teal-500",
      image:
        "https://www.wikihow.com/images/thumb/9/96/Convert-from-Binary-to-Decimal-Step-4-Version-6.jpg/v4-460px-Convert-from-Binary-to-Decimal-Step-4-Version-6.jpg",
    },
    {
      id: "anime",
      title: "AnimeList",
      icon: BookOpen,
      gradient: "from-pink-500 to-red-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1760892290/background-desktop_r4pccr.jpg",
      action: handleClick,
      isExternal: true,
    },
    {
      id: "Notepad",
      title: "Go To Notepad",
      icon: FileText,
      gradient: "from-purple-500 to-pink-500",
      image:
        "https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/a3_uutdd3.avif",
    },
  ];

  // Grid layout configurations
  const gridLayouts = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  if (user.role === "admin" && activeView === "projects") {
    return (
      <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gradient-to-tr from-blue-700 via-pink-600 to-yellow-300">
        <button
          onClick={() => setActiveView("dashboard")}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer mb-6 relative"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

          {/* Button Content */}
          <ArrowBigLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="relative z-10">Back</span>
        </button>
        <Project />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "render") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button - Properly positioned */}
          <button
            onClick={() => setActiveView("dashboard")}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer mb-6 relative"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

            {/* Button Content */}
            <ArrowBigLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative z-10">Back</span>
          </button>

          {/* Render Service Dashboard Component */}
          <RenderServiceDashboard />
        </div>
      </div>
    );
  }
  if (user.role === "admin" && activeView === "Visit-Tracker") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button - Properly positioned */}
          <button
            onClick={() => setActiveView("dashboard")}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer mb-6 relative"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

            {/* Button Content */}
            <ArrowBigLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative z-10">Back</span>
          </button>

          {/* Weekly Visits Dashboard Component */}
          <WeeklyVisitsDashboard />
        </div>
      </div>
    );
  }

  if (user.role === "admin" && activeView === "messages") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button - Properly positioned */}
          <button
            onClick={() => setActiveView("dashboard")}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer mb-6 relative"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

            {/* Button Content */}
            <ArrowBigLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative z-10">Back</span>
          </button>
          <ContactResponse />
        </div>
      </div>
    );
  }
  if (user.role === "admin" && activeView === "IP") {
    return (
      <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <button
          onClick={() => setActiveView("dashboard")}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer mb-6 relative"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

          {/* Button Content */}
          <ArrowBigLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="relative z-10">Back</span>
        </button>
        <Ipaddress />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "Notepad") {
    return (
      <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-[url(https://res.cloudinary.com/dc1fkirb4/image/upload/v1755758676/notepad_e5ey08.jpg)] bg-cover bg-center">
        <button
          onClick={() => setActiveView("dashboard")}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer mb-6 relative"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

          {/* Button Content */}
          <ArrowBigLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="relative z-10">Back</span>
        </button>
        <Notepad onDocumentSaved={handleNewDocument} />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "Blog") {
    return (
      <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gradient-to-bl from-pink-600 via-yellow-400 to-purple-700">
        <button
          onClick={() => setActiveView("dashboard")}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer mb-6 relative"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

          {/* Button Content */}
          <ArrowBigLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="relative z-10">Back</span>
        </button>
        <Blog />
      </div>
    );
  }

  if (user.role === "admin" && activeView === "number-conversion") {
    return (
      <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gradient-to-bl from-pink-600 via-yellow-400 to-purple-700">
        <button
          onClick={() => setActiveView("dashboard")}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer mb-6 relative"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

          {/* Button Content */}
          <ArrowBigLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="relative z-10">Back</span>
        </button>
        <ConversionPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header - Sticky & Responsive */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-800/95 to-purple-800/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto">
            {/* MOBILE LAYOUT */}
            <div className="lg:hidden">
              {/* Top Row: User Info + Logout */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="text-xs">
                    <p className="text-white font-medium">
                      <span className="text-lime-400">User:</span>{" "}
                      {user.username}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-lime-400">Role:</span> {user.role}
                    </p>
                    {user.email && (
                      <p className="text-yellow-400 text-xs truncate max-w-[150px]">
                        <span className="text-lime-400">Email:</span>{" "}
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 sm:p-2.5 bg-pink-500/20 rounded-xl hover:bg-pink-500/30 active:scale-95 transition-all flex-shrink-0"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                </button>
              </div>

              {/* Title Section */}
              <div className="mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Admin Panel
                </h1>
                <p className="text-xs sm:text-sm text-gray-300">
                  Manage Core Funtionalities
                </p>
              </div>

              {/* IP Bar */}
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                <span className="text-xs text-gray-300">IP:</span>
                <span className="text-xs text-green-400 font-mono truncate">
                  {ipAddress}
                </span>
              </div>
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden lg:block">
              <div className="relative flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-medium">
                      <span className="text-lime-400">User:</span>{" "}
                      {user.username}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-lime-400">Role:</span> {user.role}
                    </p>
                    {user.email && (
                      <p className="text-yellow-400 text-xs">
                        <span className="text-lime-400">Email:</span>{" "}
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                  <h1 className="text-4xl font-bold text-white whitespace-nowrap">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-gray-300">
                    Manage Core Funtionalities
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-3 bg-pink-500/20 rounded-xl hover:bg-pink-500/30 active:scale-95 transition-all"
                >
                  <LogOut className="w-5 h-5 text-pink-400" />
                </button>
              </div>

              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2">
                <Wifi className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">IP:</span>
                <span className="text-sm text-green-400 font-mono">
                  {ipAddress}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout Selector */}
      <div className="px-3 sm:px-4 lg:px-6 pt-4 pb-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
            Grid:
          </span>
          {["2", "3", "4", "5"].map((layout) => (
            <button
              key={layout}
              onClick={() => setGridLayout(layout)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                gridLayout === layout
                  ? "bg-purple-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {layout}x{layout}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid - Fully Responsive & Compact */}
      <div className="px-3 sm:px-4 lg:px-6 pb-4 sm:pb-6 max-w-7xl mx-auto">
        <div
          className={`grid ${gridLayouts[gridLayout]} gap-2 sm:gap-3 lg:gap-4`}
        >
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
                <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all active:scale-95 h-full">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <h3 className="text-white font-semibold text-xs sm:text-sm mb-0.5 truncate">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-[10px] sm:text-xs hidden sm:block">
                        Tap to access
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>

                  <div
                    className={`${
                      gridLayout === "5"
                        ? "h-20 sm:h-24"
                        : "h-24 sm:h-32 lg:h-36"
                    } overflow-hidden`}
                  >
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
              <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all active:scale-95 h-full">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-white font-semibold text-xs sm:text-sm mb-0.5 truncate">
                      Go To Notepad
                    </h3>
                    <p className="text-gray-400 text-[10px] sm:text-xs hidden sm:block">
                      Tap to access
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                <div
                  className={`${
                    gridLayout === "5" ? "h-20 sm:h-24" : "h-24 sm:h-32 lg:h-36"
                  } overflow-hidden`}
                >
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
      <div className="h-4 sm:h-6"></div>
    </div>
  );
};

export default AdminPage;
