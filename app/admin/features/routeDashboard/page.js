'use client'
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Code,
  Server,
  ChevronDown,
  ChevronRight,
  Route,
} from "lucide-react";

const RoutesDashboard = () => {
  const [routes, setRoutes] = useState([]);
  const [groupedRoutes, setGroupedRoutes] = useState({});
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [expandedCategories, setExpandedCategories] = useState({
    Admin: false,
    DevCollab: false,
    Portfolio: false,
    AIEvent: false,
    Public: false,
  });
  const [theme, setTheme] = useState("light");

  // Initialize and listen for theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

      const [allRoutesRes, groupedRes, summaryRes] = await Promise.all([
        fetch(`${baseUrl}/api/routes`),
        fetch(`${baseUrl}/api/routes/grouped`),
        fetch(`${baseUrl}/api/routes/summary`),
      ]);

      const allRoutesData = await allRoutesRes.json();
      const groupedData = await groupedRes.json();
      const summaryData = await summaryRes.json();

      setRoutes(allRoutesData.data);
      setGroupedRoutes(groupedData.data);
      setSummary(summaryData.data.summary);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const expandAll = () => {
    setExpandedCategories({
      Admin: true,
      DevCollab: true,
      Portfolio: true,
      AIEvent: true,
      Public: true,
    });
  };

  const collapseAll = () => {
    setExpandedCategories({
      Admin: false,
      DevCollab: false,
      Portfolio: false,
      AIEvent: false,
      Public: false,
    });
  };

  const getMethodColor = (method) => {
    const colors = {
      GET:
        theme === "dark"
          ? "bg-green-900/50 text-green-300 border-green-600"
          : "bg-green-100 text-green-800 border-green-300",
      POST:
        theme === "dark"
          ? "bg-blue-900/50 text-blue-300 border-blue-600"
          : "bg-blue-100 text-blue-800 border-blue-300",
      PUT:
        theme === "dark"
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-600"
          : "bg-yellow-100 text-yellow-800 border-yellow-300",
      DELETE:
        theme === "dark"
          ? "bg-red-900/50 text-red-300 border-red-600"
          : "bg-red-100 text-red-800 border-red-300",
      PATCH:
        theme === "dark"
          ? "bg-purple-900/50 text-purple-300 border-purple-600"
          : "bg-purple-100 text-purple-800 border-purple-300",
    };
    return (
      colors[method] ||
      (theme === "dark"
        ? "bg-gray-800 text-gray-300 border-gray-600"
        : "bg-gray-100 text-gray-800 border-gray-300")
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Admin: "👑",
      DevCollab: "👥",
      Portfolio: "💼",
      AIEvent: "🤖",
      Public: "🌐",
    };
    return icons[category] || "📁";
  };

  const getCategoryColor = (category) => {
    if (theme === "dark") {
      const colors = {
        Admin: "bg-purple-900/30 border-purple-700",
        DevCollab: "bg-blue-900/30 border-blue-700",
        Portfolio: "bg-green-900/30 border-green-700",
        AIEvent: "bg-orange-900/30 border-orange-700",
        Public: "bg-gray-800/30 border-gray-700",
      };
      return colors[category] || "bg-gray-800/30 border-gray-700";
    } else {
      const colors = {
        Admin: "bg-purple-50 border-purple-200",
        DevCollab: "bg-blue-50 border-blue-200",
        Portfolio: "bg-green-50 border-green-200",
        AIEvent: "bg-orange-50 border-orange-200",
        Public: "bg-gray-50 border-gray-200",
      };
      return colors[category] || "bg-gray-50 border-gray-200";
    }
  };

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.controller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.handler.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod =
      selectedMethod === "ALL" || route.method === selectedMethod;

    let matchesCategory = selectedCategory === "ALL";
    if (!matchesCategory) {
      if (selectedCategory === "Admin" && route.path.startsWith("/admin"))
        matchesCategory = true;
      if (selectedCategory === "DevCollab" && route.path.startsWith("/DVCL"))
        matchesCategory = true;
      if (selectedCategory === "AIEvent" && route.path.startsWith("/ai_event"))
        matchesCategory = true;
      if (
        selectedCategory === "Portfolio" &&
        ["/contact", "/project", "/blog", "/about"].some((p) =>
          route.path.startsWith(p),
        )
      )
        matchesCategory = true;
      if (
        selectedCategory === "Public" &&
        !route.path.startsWith("/admin") &&
        !route.path.startsWith("/DVCL") &&
        !route.path.startsWith("/ai_event") &&
        !["/contact", "/project", "/blog", "/about"].some((p) =>
          route.path.startsWith(p),
        )
      )
        matchesCategory = true;
    }

    return matchesSearch && matchesMethod && matchesCategory;
  });

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-slate-50 to-slate-100";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-300" : "text-gray-700";
  const textMuted = isDark ? "text-slate-400" : "text-gray-600";
  const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";
  const inputBg = isDark
    ? "bg-slate-700/50 border-slate-600"
    : "bg-white border-gray-300";
  const inputText = isDark
    ? "text-white placeholder-slate-400"
    : "text-gray-900 placeholder-gray-400";
  const hoverBg = isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50";
  const badgeBg = isDark
    ? "bg-slate-700 border-slate-600"
    : "bg-white border-gray-300";

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center transition-colors duration-300`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className={`${textMuted} text-lg`}>Loading routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-colors duration-300`}
    >
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div
          className={`${cardBg} shadow-lg border-b ${borderColor} transition-colors duration-300`}
        >
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Route
                  className={isDark ? "text-purple-400" : "text-blue-600"}
                  size={24}
                />
                <div>
                  <h1
                    className={`text-xl font-bold ${textPrimary} transition-colors`}
                  >
                    API Routes Discovery
                  </h1>
                  <p className={`text-xs ${textMuted} transition-colors`}>
                    Comprehensive endpoint documentation
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid - Compact */}
            <div className="grid grid-cols-6 gap-2 mb-2">
              {Object.entries(summary).map(([category, count]) => (
                <div
                  key={category}
                  className={`${getCategoryColor(category)} rounded-lg p-2 border-2 transition-all duration-300 hover:scale-105 cursor-pointer`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-lg">{getCategoryIcon(category)}</div>
                    <div className="flex-1">
                      <div className={`text-xs ${textMuted} transition-colors`}>
                        {category}
                      </div>
                      <div
                        className={`text-lg font-bold ${textPrimary} transition-colors`}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div
                className={`${isDark ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-blue-600 to-purple-600"} text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-300`}
              >
                <div className="text-xs opacity-90">Total Routes</div>
                <div className="text-lg font-bold">{routes.length}</div>
              </div>
            </div>

            {/* Filters - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textMuted}`}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search routes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 text-sm border-2 ${inputBg} ${inputText} rounded-lg focus:outline-none focus:ring-2 ${isDark ? "focus:ring-purple-500" : "focus:ring-blue-500"} transition-colors duration-300`}
                />
              </div>

              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className={`px-3 py-2 text-sm border-2 ${inputBg} ${inputText} rounded-lg focus:outline-none focus:ring-2 ${isDark ? "focus:ring-purple-500" : "focus:ring-blue-500"} transition-colors duration-300 cursor-pointer`}
              >
                <option value="ALL">All Methods</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className={`flex-1 px-3 py-2 text-sm ${isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"} text-white rounded-lg transition-colors duration-300`}
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className={`flex-1 px-3 py-2 text-sm ${isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-600 hover:bg-gray-700"} text-white rounded-lg transition-colors duration-300`}
                >
                  Collapse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Routes by Category - Compact */}
        {Object.entries(groupedRoutes).map(([category, categoryRoutes]) => {
          if (categoryRoutes.length === 0) return null;

          const filteredCategoryRoutes = categoryRoutes.filter((route) => {
            const matchesSearch =
              route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
              route.controller
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              route.handler.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesMethod =
              selectedMethod === "ALL" || route.method === selectedMethod;
            return matchesSearch && matchesMethod;
          });

          if (
            filteredCategoryRoutes.length === 0 &&
            (searchTerm || selectedMethod !== "ALL")
          )
            return null;

          return (
            <div
              key={category}
              className={`${cardBg} rounded-xl shadow-lg mb-4 border ${borderColor} overflow-hidden transition-colors duration-300`}
            >
              <div
                className={`${getCategoryColor(category)} p-3 border-b-2 cursor-pointer ${hoverBg} transition-all duration-300`}
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {expandedCategories[category] ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                    <span className="text-xl">{getCategoryIcon(category)}</span>
                    <h2
                      className={`text-lg font-bold ${textPrimary} transition-colors`}
                    >
                      {category}
                    </h2>
                    <span
                      className={`${badgeBg} px-2 py-0.5 rounded-full text-xs font-semibold ${textPrimary} border transition-colors`}
                    >
                      {filteredCategoryRoutes.length}
                    </span>
                  </div>
                </div>
              </div>

              {expandedCategories[category] && (
                <div className="max-h-96 overflow-y-auto">
                  <div
                    className="divide-y divide-opacity-50"
                    style={{ borderColor: isDark ? "#475569" : "#e2e8f0" }}
                  >
                    {filteredCategoryRoutes.map((route, index) => (
                      <div
                        key={index}
                        className={`p-3 ${hoverBg} transition-colors duration-200`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold border ${getMethodColor(route.method)}`}
                          >
                            {route.method}
                          </span>
                          <code
                            className={`text-sm font-mono font-semibold ${textPrimary} ${isDark ? "bg-slate-900/50" : "bg-gray-100"} px-2 py-1 rounded flex-1 transition-colors`}
                          >
                            {route.path}
                          </code>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div
                              className={`${textMuted} mb-0.5 transition-colors`}
                            >
                              Controller
                            </div>
                            <div
                              className={`font-semibold ${textPrimary} ${isDark ? "bg-blue-900/30" : "bg-blue-50"} px-2 py-0.5 rounded inline-block transition-colors`}
                            >
                              {route.controller}
                            </div>
                          </div>
                          <div>
                            <div
                              className={`${textMuted} mb-0.5 transition-colors`}
                            >
                              Handler
                            </div>
                            <div
                              className={`font-semibold ${textPrimary} ${isDark ? "bg-green-900/30" : "bg-green-50"} px-2 py-0.5 rounded inline-block transition-colors`}
                            >
                              {route.handler}
                            </div>
                          </div>
                          <div>
                            <div
                              className={`${textMuted} mb-0.5 transition-colors`}
                            >
                              Module
                            </div>
                            <div
                              className={`font-semibold ${textPrimary} ${isDark ? "bg-purple-900/30" : "bg-purple-50"} px-2 py-0.5 rounded inline-block transition-colors`}
                            >
                              {route.module}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredRoutes.length === 0 && (
          <div
            className={`${cardBg} rounded-xl shadow-lg p-8 text-center border ${borderColor} transition-colors duration-300`}
          >
            <div className="text-5xl mb-3">🔍</div>
            <h3
              className={`text-xl font-bold ${textPrimary} mb-2 transition-colors`}
            >
              No routes found
            </h3>
            <p className={`${textMuted} transition-colors`}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Footer */}
        <div
          className={`text-center ${textMuted} text-xs mt-6 transition-colors`}
        >
          <p>
            Auto-generated API documentation • Last updated:{" "}
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoutesDashboard;
