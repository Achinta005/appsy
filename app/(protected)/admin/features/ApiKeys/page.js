"use client";
import React, { useState, useEffect } from "react";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  Server,
  Database,
  Cloud,
  Lock,
  CheckCircle,
  XCircle,
  ChartBar
} from "lucide-react";
import useApi from "@/services/authservices";

// Service configurations - easily scalable
const SERVICES = [
  {
    id: "auth-service",
    name: "Auth Service",
    icon: Lock,
    description: "User authentication and management",
    color: "purple",
    endpoint: "/api/keys/auth-service",
  },
  {
    id: "payment-service",
    name: "Payment Service",
    icon: Database,
    description: "Payment processing and transactions",
    color: "green",
    endpoint: "/api/keys/payment-service",
  },
  {
    id: "notification-service",
    name: "Notification Service",
    icon: Cloud,
    description: "Email and push notifications",
    color: "blue",
    endpoint: "/api/keys/notification-service",
  },
  {
    id: "analytics-service",
    name: "Analytics Service",
    icon: ChartBar,
    description: "Data analytics and reporting",
    color: "orange",
    endpoint: "/api/keys/analytics-service",
  },
];

// Scopes/permissions for API keys
const SCOPES = [
  { id: "admin", label: "Admin", description: "Full administrative access" },
];

export default function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [theme, setTheme] = useState("light");
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [copiedKey, setCopiedKey] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const apiFetch = useApi();

  // New API Key form state
  const [newKey, setNewKey] = useState({
    name: "",
    serviceId: "",
    scopes: [],
    expiresInDays: 90,
    description: "",
  });

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

  // Fetch all API keys
  useEffect(() => {
    fetchApiKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/keys`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch API keys");

      const result = await response.json();
      setApiKeys(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching API keys:", err);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKey.name || !newKey.serviceId || newKey.scopes.length === 0) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsCreating(true);
      const service = SERVICES.find((s) => s.id === newKey.serviceId);

      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}${service.endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newKey.name,
            scopes: newKey.scopes,
            expiresInDays: newKey.expiresInDays,
            description: newKey.description,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to create API key");

      const result = await response.json();

      setApiKeys([result.data, ...apiKeys]);
      setShowCreateModal(false);
      setNewKey({
        name: "",
        serviceId: "",
        scopes: [],
        expiresInDays: 90,
        description: "",
      });
      setSuccessMessage("API key created successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error creating API key:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteApiKey = async (keyId) => {
    try {
      setIsDeleting(true);
      const key = apiKeys.find((k) => k.id === keyId);
      const service = SERVICES.find((s) => s.id === key.serviceId);

      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}${service.endpoint}/${keyId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete API key");

      setApiKeys(apiKeys.filter((k) => k._id !== keyId));
      setShowDeleteConfirm(null);
      setSuccessMessage("API key deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting API key:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text, keyId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const toggleScope = (scopeId) => {
    setNewKey((prev) => ({
      ...prev,
      scopes: prev.scopes.includes(scopeId)
        ? prev.scopes.filter((s) => s !== scopeId)
        : [...prev.scopes, scopeId],
    }));
  };

  const filteredKeys = apiKeys.filter((key) => {
    const matchesSearch =
      key.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService =
      filterService === "all" || key.serviceId === filterService;
    return matchesSearch && matchesService;
  });

  const getServiceColor = (serviceId) => {
    const service = SERVICES.find((s) => s.id === serviceId);
    return service?.color || "gray";
  };

  const getServiceIcon = (serviceId) => {
    const service = SERVICES.find((s) => s.id === serviceId);
    const IconComponent = service?.icon || Server;
    return <IconComponent className="w-4 h-4" />;
  };

  const getServiceBadgeColor = (serviceId) => {
    const color = getServiceColor(serviceId);
    switch (color) {
      case "purple":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "green":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "blue":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "orange":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const keyStats = {
    total: apiKeys.length,
    active: apiKeys.filter(
      (k) => k.isActive && new Date(k.expiresAt) > new Date(),
    ).length,
    expired: apiKeys.filter((k) => new Date(k.expiresAt) <= new Date()).length,
    byService: SERVICES.reduce((acc, service) => {
      acc[service.id] = apiKeys.filter(
        (k) => k.serviceId === service.id,
      ).length;
      return acc;
    }, {}),
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-blue-50 via-purple-50 to-pink-50";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const textMuted = isDark ? "text-gray-300" : "text-gray-700";
  const cardBg = isDark
    ? "bg-slate-800/50 border-slate-700/50"
    : "bg-white border-purple-200";
  const inputBg = isDark
    ? "bg-slate-900/50 border-slate-700"
    : "bg-white border-purple-200";
  const inputFocus = isDark
    ? "focus:border-purple-500"
    : "focus:border-purple-400";
  const buttonPrimary = isDark
    ? "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800"
    : "bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300";
  const tableBorder = isDark ? "border-slate-700" : "border-purple-100";
  const tableHover = isDark ? "hover:bg-slate-700/30" : "hover:bg-purple-50";
  const modalBg = isDark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-purple-200";
  const modalOverlay = isDark ? "bg-black/50" : "bg-black/30";
  const errorBg = isDark
    ? "bg-red-500/10 border-red-500/30 text-red-400"
    : "bg-red-50 border-red-300 text-red-700";
  const successBg = isDark
    ? "bg-green-500/10 border-green-500/30 text-green-400"
    : "bg-green-50 border-green-300 text-green-700";
  const cancelButton = isDark
    ? "bg-slate-700 hover:bg-slate-600"
    : "bg-gray-200 hover:bg-gray-300";
  const deleteButton = isDark
    ? "bg-red-600 hover:bg-red-700"
    : "bg-red-500 hover:bg-red-600";

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${bgGradient} p-8 transition-colors duration-300`}
      >
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} p-8 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className={`text-3xl font-bold ${textPrimary} flex items-center gap-3`}
            >
              <Key className="w-8 h-8 text-purple-500" />
              API Key Management
            </h1>
            <p className={`${textSecondary} mt-2`}>
              Manage API keys across multiple microservices
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchApiKeys}
              disabled={loading}
              className={`px-4 py-2 ${buttonPrimary} disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg`}
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className={`px-4 py-2 ${buttonPrimary} text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg`}
            >
              <Plus className="w-5 h-5" />
              Create API Key
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className={`mb-6 p-4 ${errorBg} border rounded-lg flex items-center gap-3`}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className={`ml-auto ${
                isDark
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-700 hover:text-red-600"
              }`}
            >
              ×
            </button>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div
            className={`mb-6 p-4 ${successBg} border rounded-lg flex items-center gap-3`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div
            className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 transition-colors shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm`}>Total Keys</p>
                <p className={`text-3xl font-bold ${textPrimary} mt-1`}>
                  {keyStats.total}
                </p>
              </div>
              <Key className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div
            className={`${cardBg} backdrop-blur-sm border ${
              isDark ? "border-green-500/30" : "border-green-300"
            } rounded-xl p-6 transition-colors shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm`}>Active Keys</p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {keyStats.active}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div
            className={`${cardBg} backdrop-blur-sm border ${
              isDark ? "border-red-500/30" : "border-red-300"
            } rounded-xl p-6 transition-colors shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm`}>Expired Keys</p>
                <p className="text-3xl font-bold text-red-500 mt-1">
                  {keyStats.expired}
                </p>
              </div>
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div
            className={`${cardBg} backdrop-blur-sm border ${
              isDark ? "border-purple-500/30" : "border-purple-300"
            } rounded-xl p-6 transition-colors shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondary} text-sm`}>Services</p>
                <p className="text-3xl font-bold text-purple-500 mt-1">
                  {SERVICES.length}
                </p>
              </div>
              <Server className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Service Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SERVICES.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`${cardBg} backdrop-blur-sm border rounded-xl p-4 transition-colors shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 bg-${service.color}-500/20 rounded-lg`}>
                    <IconComponent
                      className={`w-5 h-5 text-${service.color}-500`}
                    />
                  </div>
                  <div>
                    <p className={`${textPrimary} font-semibold text-sm`}>
                      {service.name}
                    </p>
                    <p className={`${textSecondary} text-xs`}>
                      {keyStats.byService[service.id] || 0} keys
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div
          className={`${cardBg} backdrop-blur-sm border rounded-xl p-6 mb-6 transition-colors shadow-lg`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`}
              />
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${inputBg} border rounded-lg ${textPrimary} placeholder-gray-400 focus:outline-none ${inputFocus} transition-colors`}
              />
            </div>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className={`px-4 py-3 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus} transition-colors cursor-pointer`}
            >
              <option value="all">All Services</option>
              {SERVICES.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* API Keys Table */}
        <div
          className={`${cardBg} backdrop-blur-sm border rounded-xl overflow-hidden transition-colors shadow-lg`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${tableBorder}`}>
                  <th
                    className={`text-left p-4 ${textSecondary} font-semibold`}
                  >
                    Name
                  </th>
                  <th
                    className={`text-left p-4 ${textSecondary} font-semibold`}
                  >
                    Service
                  </th>
                  <th
                    className={`text-left p-4 ${textSecondary} font-semibold`}
                  >
                    API Key
                  </th>
                  <th
                    className={`text-left p-4 ${textSecondary} font-semibold`}
                  >
                    Scopes
                  </th>
                  <th
                    className={`text-left p-4 ${textSecondary} font-semibold`}
                  >
                    Status
                  </th>
                  <th
                    className={`text-left p-4 ${textSecondary} font-semibold`}
                  >
                    Expires
                  </th>
                  <th
                    className={`text-center p-4 ${textSecondary} font-semibold`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredKeys.map((key) => {
                  const isExpired = new Date(key.expiresAt) <= new Date();
                  const isVisible = visibleKeys.has(key._id);
                  const isCopied = copiedKey === key._id;

                  return (
                    <tr
                      key={key._id}
                      className={`border-b ${tableBorder} ${tableHover} transition-colors`}
                    >
                      <td className="p-4">
                        <div>
                          <p className={`${textPrimary} font-medium`}>
                            {key.name}
                          </p>
                          {key.description && (
                            <p className={`${textSecondary} text-xs mt-1`}>
                              {key.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getServiceBadgeColor(
                            key.serviceId,
                          )}`}
                        >
                          {getServiceIcon(key.serviceId)}
                          {SERVICES.find((s) => s.id === key.serviceId)?.name ||
                            key.serviceId}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code
                            className={`px-2 py-1 ${inputBg} rounded text-sm ${textMuted} font-mono`}
                          >
                            {isVisible
                              ? key.key
                              : `${key.key.substring(0, 8)}...${key.key.substring(
                                  key.key.length - 4,
                                )}`}
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(key._id)}
                            className={`p-1 hover:bg-slate-700/30 rounded transition-colors ${textSecondary}`}
                            title={isVisible ? "Hide" : "Show"}
                          >
                            {isVisible ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(key.key, key._id)}
                            className={`p-1 hover:bg-slate-700/30 rounded transition-colors ${
                              isCopied ? "text-green-500" : textSecondary
                            }`}
                            title="Copy"
                          >
                            {isCopied ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {key.scopes?.map((scope) => (
                            <span
                              key={scope}
                              className={`px-2 py-1 text-xs rounded ${
                                isDark
                                  ? "bg-slate-700/50 text-gray-300"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                            >
                              {scope}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                            <XCircle className="w-3 h-3" />
                            Expired
                          </span>
                        ) : key.isActive ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className={`p-4 ${textSecondary} text-sm`}>
                        {new Date(key.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setShowDeleteConfirm(key.id)}
                            disabled={isDeleting}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-500 rounded-lg transition-colors"
                            title="Delete Key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredKeys.length === 0 && (
            <div className={`text-center py-12 ${textSecondary}`}>
              <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No API keys found</p>
            </div>
          )}
        </div>

        {/* Create API Key Modal */}
        {showCreateModal && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}
          >
            <div
              className={`${modalBg} border rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto`}
            >
              <h3 className={`text-2xl font-bold ${textPrimary} mb-6`}>
                Create New API Key
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className={`block ${textMuted} font-medium mb-2`}>
                    Key Name *
                  </label>
                  <input
                    type="text"
                    value={newKey.name}
                    onChange={(e) =>
                      setNewKey({ ...newKey, name: e.target.value })
                    }
                    placeholder="e.g., Production API Key"
                    className={`w-full px-4 py-3 ${inputBg} border rounded-lg ${textPrimary} placeholder-gray-400 focus:outline-none ${inputFocus} transition-colors`}
                  />
                </div>

                {/* Service Selection */}
                <div>
                  <label className={`block ${textMuted} font-medium mb-2`}>
                    Select Service *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SERVICES.map((service) => {
                      const IconComponent = service.icon;
                      const isSelected = newKey.serviceId === service.id;
                      return (
                        <button
                          key={service.id}
                          onClick={() =>
                            setNewKey({ ...newKey, serviceId: service.id })
                          }
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            isSelected
                              ? `border-${service.color}-500 bg-${service.color}-500/10`
                              : `${
                                  isDark
                                    ? "border-slate-700 hover:border-slate-600"
                                    : "border-purple-200 hover:border-purple-300"
                                }`
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                isSelected
                                  ? `bg-${service.color}-500/20`
                                  : isDark
                                    ? "bg-slate-700"
                                    : "bg-gray-100"
                              }`}
                            >
                              <IconComponent
                                className={`w-5 h-5 ${
                                  isSelected
                                    ? `text-${service.color}-500`
                                    : textSecondary
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <p
                                className={`font-semibold ${
                                  isSelected
                                    ? `text-${service.color}-500`
                                    : textPrimary
                                }`}
                              >
                                {service.name}
                              </p>
                              <p className={`${textSecondary} text-sm mt-1`}>
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scopes */}
                <div>
                  <label className={`block ${textMuted} font-medium mb-2`}>
                    Permissions (Scopes) *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {SCOPES.map((scope) => {
                      const isSelected = newKey.scopes.includes(scope.id);
                      return (
                        <button
                          key={scope.id}
                          onClick={() => toggleScope(scope.id)}
                          className={`p-3 border-2 rounded-lg text-left transition-all ${
                            isSelected
                              ? "border-purple-500 bg-purple-500/10"
                              : `${
                                  isDark
                                    ? "border-slate-700 hover:border-slate-600"
                                    : "border-purple-200 hover:border-purple-300"
                                }`
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                isSelected
                                  ? "bg-purple-500 border-purple-500"
                                  : isDark
                                    ? "border-slate-600"
                                    : "border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <p
                              className={`font-semibold ${
                                isSelected ? "text-purple-500" : textPrimary
                              }`}
                            >
                              {scope.label}
                            </p>
                          </div>
                          <p className={`${textSecondary} text-xs`}>
                            {scope.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Expiration */}
                <div>
                  <label className={`block ${textMuted} font-medium mb-2`}>
                    Expires In (Days)
                  </label>
                  <select
                    value={newKey.expiresInDays}
                    onChange={(e) =>
                      setNewKey({
                        ...newKey,
                        expiresInDays: parseInt(e.target.value),
                      })
                    }
                    className={`w-full px-4 py-3 ${inputBg} border rounded-lg ${textPrimary} focus:outline-none ${inputFocus} transition-colors cursor-pointer`}
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>1 year</option>
                    <option value={730}>2 years</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className={`block ${textMuted} font-medium mb-2`}>
                    Description (Optional)
                  </label>
                  <textarea
                    value={newKey.description}
                    onChange={(e) =>
                      setNewKey({ ...newKey, description: e.target.value })
                    }
                    placeholder="Brief description of what this key is used for..."
                    rows={3}
                    className={`w-full px-4 py-3 ${inputBg} border rounded-lg ${textPrimary} placeholder-gray-400 focus:outline-none ${inputFocus} transition-colors resize-none`}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewKey({
                      name: "",
                      serviceId: "",
                      scopes: [],
                      expiresInDays: 90,
                      description: "",
                    });
                  }}
                  disabled={isCreating}
                  className={`flex-1 px-4 py-3 ${cancelButton} disabled:opacity-50 disabled:cursor-not-allowed ${textPrimary} rounded-lg transition-colors font-medium`}
                >
                  Cancel
                </button>
                <button
                  onClick={createApiKey}
                  disabled={isCreating}
                  className={`flex-1 px-4 py-3 ${buttonPrimary} disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium`}
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create API Key
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center z-50`}
          >
            <div
              className={`${modalBg} border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl`}
            >
              <h3 className={`text-xl font-bold ${textPrimary} mb-3`}>
                Confirm Deletion
              </h3>
              <p className={`${textSecondary} mb-6`}>
                Are you sure you want to delete this API key? Applications using
                this key will immediately lose access. This action cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={isDeleting}
                  className={`flex-1 px-4 py-2 ${cancelButton} disabled:opacity-50 disabled:cursor-not-allowed ${textPrimary} rounded-lg transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteApiKey(showDeleteConfirm)}
                  disabled={isDeleting}
                  className={`flex-1 px-4 py-2 ${deleteButton} disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors`}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
