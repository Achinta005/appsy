import React, { useEffect, useState } from "react";
import { Search, Trash2, Globe, Calendar, X } from "lucide-react";
import useApi from "@/services/authservices";

const Ipaddress = () => {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [theme, setTheme] = useState("light");
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

  useEffect(() => {
    const getIps = async () => {
      try {
        const response = await apiFetch(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/view-ip`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch IP addresses");
        }
        
        const data = await response.json();
        setIpAddresses(data.data || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching IP addresses:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getIps();
  }, [apiFetch]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const filteredIPs = ipAddresses.filter((ip) =>
    ip.ipaddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (ipId) => {
    try {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/delete-ip/${ipId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete IP address");
      }

      // Remove from local state
      setIpAddresses(ipAddresses.filter((ip) => ip._id !== ipId));
      setDeleteConfirm(null);

      console.log("Deleted IP:", ipId);
    } catch (error) {
      console.error("Error deleting IP:", error);
      setError(error.message);
    }
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-blue-50 via-purple-50 to-pink-50";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-600";
  const textMuted = isDark ? "text-slate-300" : "text-gray-700";
  const textLabel = isDark ? "text-white" : "text-purple-700";
  const cardBg = isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-purple-200";
  const inputBg = isDark ? "bg-slate-800/50 border-slate-600/50" : "bg-white border-purple-300";
  const inputFocus = isDark ? "focus:border-purple-500 focus:ring-purple-500/50" : "focus:border-purple-400 focus:ring-purple-400/50";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark ? "placeholder-slate-500" : "placeholder-gray-400";
  const loadingBg = isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-purple-200";
  const loadingSpinner = isDark ? "border-purple-500" : "border-purple-600";
  const errorBg = isDark ? "bg-red-900/30 border-red-500/50 text-red-200" : "bg-red-50 border-red-300 text-red-700";
  const emptyIcon = isDark ? "text-slate-600" : "text-gray-400";
  const emptyText = isDark ? "text-slate-400" : "text-gray-500";
  const avatarGradient = isDark ? "from-purple-500 to-purple-600" : "from-purple-400 to-purple-500";
  const buttonDelete = isDark ? "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800" : "from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700";
  const cardHover = isDark ? "hover:border-slate-600" : "hover:border-purple-300";
  const timestampText = isDark ? "text-slate-500" : "text-gray-500";
  
  // Modal styles
  const modalOverlay = isDark ? "bg-black/70" : "bg-black/50";
  const modalBg = isDark ? "bg-slate-900" : "bg-white";
  const modalHeaderGradient = isDark ? "from-red-600 to-red-700" : "from-red-500 to-rose-600";
  const modalText = isDark ? "text-slate-300" : "text-gray-700";
  const cancelButton = isDark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800";

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center h-64 ${loadingBg} rounded-2xl shadow-lg border transition-colors`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${loadingSpinner} mb-4`}></div>
        <p className={textSecondary}>Loading IP addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className={`${errorBg} border px-4 py-3 rounded-lg transition-colors`}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-4 sm:p-6 lg:p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold ${textPrimary} mb-2`}>
                IP Address Records
              </h1>
              <p className={`${textSecondary} text-base sm:text-lg`}>
                {filteredIPs.length}{" "}
                {filteredIPs.length === 1 ? "record" : "records"} available
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textSecondary} w-5 h-5`} />
              <input
                type="text"
                placeholder="Search IP addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 ${inputBg} border rounded-xl ${inputFocus} focus:ring-1 focus:outline-none w-full ${inputText} ${placeholderColor} sm:w-64 shadow-sm transition-colors`}
              />
            </div>
          </div>
        </div>

        {/* Desktop Grid View */}
        <section className="hidden md:grid gap-4">
          {filteredIPs.length === 0 ? (
            <div className={`${cardBg} border rounded-2xl shadow-lg p-12 text-center transition-colors`}>
              <Globe className={`w-16 h-16 ${emptyIcon} mx-auto mb-4`} />
              <p className={`${emptyText} text-lg`}>No IP records found</p>
            </div>
          ) : (
            filteredIPs.map((ip, index) => (
              <div
                key={ip._id || index}
                className={`${cardBg} backdrop-blur-sm rounded-xl border shadow-md hover:shadow-xl ${cardHover} transition-all duration-300 overflow-hidden group`}
              >
                <div className="flex items-center p-5">
                  {/* Icon */}
                  <div className="flex-shrink-0 mr-5">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white shadow-lg`}>
                      <Globe className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-6 items-center">
                    {/* IP Address */}
                    <div>
                      <p className={`text-xs ${textLabel} uppercase font-semibold mb-1`}>
                        IP Address
                      </p>
                      <p className={`text-base font-mono font-semibold ${textMuted}`}>
                        {ip.ipaddress || "N/A"}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div>
                      <p className={`text-xs ${textLabel} uppercase font-semibold mb-1`}>
                        Timestamp
                      </p>
                      <p className={`text-sm ${timestampText}`}>
                        {formatTimestamp(ip.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex-shrink-0 ml-5">
                    <button
                      onClick={() => setDeleteConfirm(ip._id || index)}
                      className={`bg-gradient-to-r ${buttonDelete} text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md group-hover:shadow-lg font-semibold`}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Mobile Card View */}
        <section className="md:hidden space-y-4">
          {filteredIPs.length === 0 ? (
            <div className={`${cardBg} border rounded-2xl shadow-lg p-12 text-center transition-colors`}>
              <Globe className={`w-16 h-16 ${emptyIcon} mx-auto mb-4`} />
              <p className={`${emptyText} text-lg`}>No IP records found</p>
            </div>
          ) : (
            filteredIPs.map((ip, index) => (
              <div
                key={ip._id || index}
                className={`${cardBg} border rounded-2xl shadow-md overflow-hidden transition-colors`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white shadow-lg`}>
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-mono font-semibold ${textPrimary}`}>
                          {ip.ipaddress || "N/A"}
                        </h3>
                        <p className={`text-xs ${timestampText}`}>
                          {formatTimestamp(ip.timestamp)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(ip._id || index)}
                      className={`bg-gradient-to-r ${buttonDelete} text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-md`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div
            className={`fixed inset-0 ${modalOverlay} backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fadeIn transition-colors`}
            onClick={() => setDeleteConfirm(null)}
          >
            <div
              className={`${modalBg} rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp transition-colors`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`bg-gradient-to-r ${modalHeaderGradient} p-6`}>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Confirm Delete</h2>
                </div>
              </div>

              <div className="p-6">
                <p className={`${modalText} mb-6`}>
                  Are you sure you want to delete this IP address record? This
                  action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className={`flex-1 ${cancelButton} px-6 py-3 rounded-xl transition-all duration-300 font-semibold`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className={`flex-1 bg-gradient-to-r ${modalHeaderGradient} text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-md`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Ipaddress;