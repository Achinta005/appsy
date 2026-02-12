"use client";

import { useState, useEffect } from "react";
import {
  Route,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
} from "lucide-react";
import useApi from "@/services/authservices";

export default function CombinedDashboard() {
  // Prompt states
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptError, setPromptError] = useState("");
  const [queryType, setQueryType] = useState("basic");
  const [filterValue, setFilterValue] = useState("");

  // Routes states
  const [routes, setRoutes] = useState([]);
  const [groupedRoutes, setGroupedRoutes] = useState({});
  const [summary, setSummary] = useState({});
  const [routesLoading, setRoutesLoading] = useState(true);
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

  // Common states
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("prompt");
  const apiFetch = useApi();

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

  // Fetch routes on mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL;

      const [allRoutesRes, groupedRes, summaryRes] = await Promise.all([
        fetch(`${baseUrl}/routes`),
        fetch(`${baseUrl}/routes/grouped`),
        fetch(`${baseUrl}/routes/summary`),
      ]);

      const allRoutesData = await allRoutesRes.json();
      const groupedData = await groupedRes.json();
      const summaryData = await summaryRes.json();

      setRoutes(allRoutesData.data);
      setGroupedRoutes(groupedData.data);
      setSummary(summaryData.data.summary);
      setRoutesLoading(false);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setRoutesLoading(false);
    }
  };

  // Prompt functions
  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setPromptLoading(true);
    setPromptError("");
    setResponse(null);

    try {
      let endpoint = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/prompt`;
      let body = { prompt: prompt.trim() };

      // Use different endpoints based on query type
      if (queryType === "category" && filterValue) {
        endpoint = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/prompt/category`;
        body.category = filterValue;
      } else if (queryType === "method" && filterValue) {
        endpoint = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/prompt/method`;
        body.method = filterValue;
      }

      const res = await apiFetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to get response from Groq");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setPromptError(err.message);
    } finally {
      setPromptLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setPrompt("");
    setResponse(null);
    setPromptError("");
    setFilterValue("");
  };

  // Quick query templates
  const quickQueries = [
    {
      label: "Auth Routes",
      prompt: "Which routes handle user authentication in admin server?",
      type: "basic",
    },
    {
      label: "File Operations",
      prompt: "What file management operations are available?",
      type: "category",
      filter: "DevCollab",
    },
    {
      label: "All DELETE",
      prompt: "Show me all delete operations",
      type: "method",
      filter: "DELETE",
    },
    {
      label: "Blog Routes",
      prompt: "What routes handle blog posts?",
      type: "basic",
    },
  ];

  const applyQuickQuery = (query) => {
    setPrompt(query.prompt);
    setQueryType(query.type);
    if (query.filter) {
      setFilterValue(query.filter);
    }
  };

  // Routes functions
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
    : "from-blue-50 to-indigo-100";
  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-700";
  const textLabel = isDark ? "text-slate-300" : "text-gray-700";
  const textMuted = isDark ? "text-slate-400" : "text-gray-600";
  const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
  const borderColor = isDark ? "border-slate-700" : "border-slate-200";
  const inputBg = isDark
    ? "bg-slate-700/50 border-slate-600"
    : "bg-white border-gray-300";
  const inputText = isDark
    ? "text-white placeholder-slate-400"
    : "text-gray-900 placeholder-gray-400";
  const inputFocus = isDark
    ? "focus:ring-purple-500 focus:border-purple-500"
    : "focus:ring-blue-500 focus:border-blue-500";
  const buttonPrimary = isDark
    ? "bg-purple-600 hover:bg-purple-700"
    : "bg-blue-600 hover:bg-blue-700";
  const buttonSecondary = isDark
    ? "bg-slate-700 hover:bg-slate-600"
    : "bg-gray-600 hover:bg-gray-700";
  const resultBg = isDark ? "bg-slate-700/50" : "bg-gray-50";
  const errorBg = isDark
    ? "bg-red-900/30 border-red-500/50 text-red-200"
    : "bg-red-100 border-red-400 text-red-700";
  const errorButton = isDark
    ? "text-red-300 hover:text-red-100"
    : "text-red-700 hover:text-red-900";
  const hoverBg = isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-50";
  const badgeBg = isDark
    ? "bg-slate-700 border-slate-600"
    : "bg-white border-gray-300";
  const tabActive = isDark
    ? "bg-purple-600 text-white"
    : "bg-blue-600 text-white";
  const tabInactive = isDark
    ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1
            className={`text-3xl md:text-4xl font-bold ${textPrimary} text-center transition-colors mb-4`}
          >
            API Routes Discovery
          </h1>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setActiveTab("prompt")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === "prompt" ? tabActive : tabInactive}`}
            >
              <Sparkles size={20} />
              AI Route Assistant
            </button>
            <button
              onClick={() => setActiveTab("routes")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === "routes" ? tabActive : tabInactive}`}
            >
              <Route size={20} />
              Browse Routes
            </button>
          </div>
        </div>

        {/* Prompt Tab Content */}
        {activeTab === "prompt" && (
          <div>
            <p
              className={`text-center ${textSecondary} mb-8 transition-colors`}
            >
              Ask natural language questions about your API routes - powered by
              Groq AI
            </p>

            {/* Quick Query Templates */}
            <div
              className={`${cardBg} rounded-lg shadow-lg p-4 mb-6 transition-colors`}
            >
              <h3
                className={`text-sm font-semibold ${textLabel} mb-3 transition-colors flex items-center gap-2`}
              >
                <Filter size={16} />
                Quick Queries
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {quickQueries.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyQuickQuery(query)}
                    className={`px-3 py-2 text-xs ${isDark ? "bg-slate-700/50 hover:bg-slate-700" : "bg-gray-100 hover:bg-gray-200"} ${textLabel} rounded-md transition-colors`}
                  >
                    {query.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {promptError && (
              <div
                className={`${errorBg} border px-4 py-3 rounded-lg mb-6 relative transition-colors`}
              >
                <button
                  onClick={() => setPromptError("")}
                  className={`absolute top-2 right-2 ${errorButton}`}
                >
                  ✕
                </button>
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{promptError}</span>
              </div>
            )}

            {/* Prompt Input Section */}
            <div
              className={`${cardBg} rounded-lg shadow-lg p-6 mb-6 transition-colors`}
            >
              <h2
                className={`text-2xl font-semibold ${textSecondary} mb-4 transition-colors`}
              >
                Ask About Your Routes
              </h2>

              <div className="space-y-4">
                {/* Query Type Selector */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <button
                    onClick={() => setQueryType("basic")}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${queryType === "basic" ? buttonPrimary + " text-white" : inputBg + " " + textLabel}`}
                  >
                    General Query
                  </button>
                  <button
                    onClick={() => setQueryType("category")}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${queryType === "category" ? buttonPrimary + " text-white" : inputBg + " " + textLabel}`}
                  >
                    By Category
                  </button>
                  <button
                    onClick={() => setQueryType("method")}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${queryType === "method" ? buttonPrimary + " text-white" : inputBg + " " + textLabel}`}
                  >
                    By Method
                  </button>
                </div>

                {/* Filter Input for specific query types */}
                {queryType !== "basic" && (
                  <div>
                    <label
                      className={`block text-sm font-medium ${textLabel} mb-2 transition-colors`}
                    >
                      {queryType === "category" && "Select Category"}
                      {queryType === "method" && "Select HTTP Method"}
                    </label>
                    {queryType === "category" ? (
                      <select
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className={`w-full px-4 py-2 border ${inputBg} ${inputText} rounded-md focus:ring-2 ${inputFocus} focus:outline-none transition-colors`}
                      >
                        <option value="">Select category...</option>
                        <option value="admin">Admin</option>
                        <option value="DevCollab">DevCollab</option>
                        <option value="portfolio">Portfolio</option>
                      </select>
                    ) : queryType === "method" ? (
                      <select
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        className={`w-full px-4 py-2 border ${inputBg} ${inputText} rounded-md focus:ring-2 ${inputFocus} focus:outline-none transition-colors`}
                      >
                        <option value="">Select method...</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        placeholder="e.g., AuthController, BlogController..."
                        className={`w-full px-4 py-2 border ${inputBg} ${inputText} rounded-md focus:ring-2 ${inputFocus} focus:outline-none transition-colors`}
                      />
                    )}
                  </div>
                )}

                {/* Prompt Textarea */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textLabel} mb-2 transition-colors`}
                  >
                    Your Question
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Which routes handle user authentication? What are all the file operations?"
                    rows="4"
                    className={`w-full px-4 py-3 border ${inputBg} ${inputText} rounded-md focus:ring-2 ${inputFocus} focus:outline-none resize-none transition-colors`}
                  />
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={promptLoading || !prompt.trim()}
                    className={`flex-1 ${buttonPrimary} text-white py-3 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium`}
                  >
                    {promptLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles size={18} />
                        Ask AI
                      </span>
                    )}
                  </button>

                  {(response || prompt) && (
                    <button
                      onClick={handleClear}
                      disabled={promptLoading}
                      className={`${buttonSecondary} text-white py-3 px-6 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium`}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Response Display Section */}
            {response && (
              <div
                className={`${cardBg} rounded-xl shadow-2xl p-6 transition-all duration-300 border-2 ${isDark ? "border-purple-500/30" : "border-blue-200"}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={`text-2xl font-bold ${textPrimary} transition-colors flex items-center gap-3`}
                  >
                    <div
                      className={`p-2 rounded-lg ${isDark ? "bg-purple-600/20" : "bg-blue-100"}`}
                    >
                      <MessageSquare
                        size={24}
                        className={isDark ? "text-purple-400" : "text-blue-600"}
                      />
                    </div>
                    AI Response
                  </h2>
                  {response.timestamp && (
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${isDark ? "bg-slate-700/50 text-slate-300" : "bg-gray-100 text-gray-600"} transition-colors`}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {new Date(response.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>

                <div
                  className={`p-6 rounded-xl ${isDark ? "bg-slate-900/50 border border-slate-700" : "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"} transition-colors`}
                >
                  <div className={`${textLabel} leading-relaxed space-y-4`}>
                    {(() => {
                      const content =
                        response.response ||
                        response.message ||
                        response.text ||
                        JSON.stringify(response, null, 2);
                      const lines = content.split("\n");

                      return lines.map((line, idx) => {
                        // Handle bullet points
                        if (line.trim().startsWith("-")) {
                          const bulletContent = line
                            .replace(/^-\s*/, "")
                            .trim();
                          const isBold = bulletContent.includes("**");

                          return (
                            <div key={idx} className="flex gap-3 items-start">
                              <span
                                className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? "bg-purple-400" : "bg-blue-500"}`}
                              ></span>
                              <span
                                className="flex-1"
                                dangerouslySetInnerHTML={{
                                  __html: bulletContent
                                    .replace(
                                      /\*\*POST\s+([^*]+)\*\*/g,
                                      `<span class="font-bold ${isDark ? "text-purple-300" : "text-blue-700"}">POST</span> <code class="px-2 py-0.5 rounded ${isDark ? "bg-slate-800 text-green-300" : "bg-white text-green-700"} font-mono text-sm">$1</code>`,
                                    )
                                    .replace(
                                      /\*\*GET\s+([^*]+)\*\*/g,
                                      `<span class="font-bold ${isDark ? "text-green-300" : "text-green-700"}">GET</span> <code class="px-2 py-0.5 rounded ${isDark ? "bg-slate-800 text-green-300" : "bg-white text-green-700"} font-mono text-sm">$1</code>`,
                                    )
                                    .replace(
                                      /\*\*PUT\s+([^*]+)\*\*/g,
                                      `<span class="font-bold ${isDark ? "text-yellow-300" : "text-yellow-700"}">PUT</span> <code class="px-2 py-0.5 rounded ${isDark ? "bg-slate-800 text-green-300" : "bg-white text-green-700"} font-mono text-sm">$1</code>`,
                                    )
                                    .replace(
                                      /\*\*DELETE\s+([^*]+)\*\*/g,
                                      `<span class="font-bold ${isDark ? "text-red-300" : "text-red-700"}">DELETE</span> <code class="px-2 py-0.5 rounded ${isDark ? "bg-slate-800 text-green-300" : "bg-white text-green-700"} font-mono text-sm">$1</code>`,
                                    )
                                    .replace(
                                      /\*\*([^*]+)\*\*/g,
                                      `<span class="font-bold ${isDark ? "text-purple-300" : "text-blue-700"}">$1</span>`,
                                    ),
                                }}
                              />
                            </div>
                          );
                        }

                        // Handle regular lines
                        if (line.trim()) {
                          return (
                            <p
                              key={idx}
                              className="leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: line
                                  .replace(
                                    /\*\*([^*]+)\*\*/g,
                                    `<span class="font-bold ${isDark ? "text-purple-300" : "text-blue-700"}">$1</span>`,
                                  )
                                  .replace(
                                    /`([^`]+)`/g,
                                    `<code class="px-2 py-0.5 rounded ${isDark ? "bg-slate-800 text-green-300" : "bg-white text-green-700"} font-mono text-sm">$1</code>`,
                                  ),
                              }}
                            />
                          );
                        }

                        return <div key={idx} className="h-2"></div>;
                      });
                    })()}
                  </div>
                </div>

                {/* Additional metadata if available */}
                {(response.category ||
                  response.method ||
                  response.controller) && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {response.category && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-purple-900/30 text-purple-300 border border-purple-600" : "bg-purple-100 text-purple-700 border border-purple-200"}`}
                      >
                        Category: {response.category}
                      </span>
                    )}
                    {response.method && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-blue-900/30 text-blue-300 border border-blue-600" : "bg-blue-100 text-blue-700 border border-blue-200"}`}
                      >
                        Method: {response.method}
                      </span>
                    )}
                    {response.controller && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? "bg-green-900/30 text-green-300 border border-green-600" : "bg-green-100 text-green-700 border border-green-200"}`}
                      >
                        Controller: {response.controller}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {promptLoading && !response && (
              <div
                className={`${cardBg} rounded-lg shadow-lg p-8 transition-colors`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className={`w-3 h-3 ${isDark ? "bg-purple-500" : "bg-blue-500"} rounded-full animate-bounce`}
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className={`w-3 h-3 ${isDark ? "bg-purple-500" : "bg-blue-500"} rounded-full animate-bounce`}
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className={`w-3 h-3 ${isDark ? "bg-purple-500" : "bg-blue-500"} rounded-full animate-bounce`}
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <p
                  className={`text-center ${textSecondary} mt-4 transition-colors`}
                >
                  Analyzing routes with Groq AI...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Routes Tab Content */}
        {activeTab === "routes" && (
          <div>
            {routesLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className={`${textMuted} text-lg`}>Loading routes...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
                  {Object.entries(summary).map(([category, count]) => (
                    <div
                      key={category}
                      className={`${getCategoryColor(category)} rounded-lg p-3 border-2 transition-all duration-300 hover:scale-105 cursor-pointer`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">
                          {getCategoryIcon(category)}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`text-xs ${textMuted} transition-colors`}
                          >
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
                    className={`${isDark ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-blue-600 to-purple-600"} text-white px-4 py-3 rounded-lg shadow-lg transition-colors duration-300`}
                  >
                    <div className="text-xs opacity-90">Total Routes</div>
                    <div className="text-xl font-bold">{routes.length}</div>
                  </div>
                </div>

                {/* Filters */}
                <div
                  className={`${cardBg} rounded-lg shadow-lg p-4 mb-4 transition-colors`}
                >
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
                        className={`flex-1 px-3 py-2 text-sm ${buttonPrimary} text-white rounded-lg transition-colors duration-300`}
                      >
                        Expand All
                      </button>
                      <button
                        onClick={collapseAll}
                        className={`flex-1 px-3 py-2 text-sm ${buttonSecondary} text-white rounded-lg transition-colors duration-300`}
                      >
                        Collapse
                      </button>
                    </div>
                  </div>
                </div>

                {/* Routes by Category */}
                {Object.entries(groupedRoutes).map(
                  ([category, categoryRoutes]) => {
                    if (categoryRoutes.length === 0) return null;

                    const filteredCategoryRoutes = categoryRoutes.filter(
                      (route) => {
                        const matchesSearch =
                          route.path
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          route.controller
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          route.handler
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase());
                        const matchesMethod =
                          selectedMethod === "ALL" ||
                          route.method === selectedMethod;
                        return matchesSearch && matchesMethod;
                      },
                    );

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
                              <span className="text-xl">
                                {getCategoryIcon(category)}
                              </span>
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
                              style={{
                                borderColor: isDark ? "#475569" : "#e2e8f0",
                              }}
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
                  },
                )}

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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
