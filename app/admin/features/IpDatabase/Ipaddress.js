import React, { useEffect, useState } from "react";
import { Search, Trash2, Globe, Calendar, X } from "lucide-react";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const Ipaddress = () => {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const getIps = async () => {
      try {
        const response = await PortfolioApiService.ViewIp();
        const data = await response;
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
  }, []);

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
      await PortfolioApiService.deleteIpAddress(ipId);

      // Remove from local state
      setIpAddresses(ipAddresses.filter((ip) => ip._id !== ipId));
      setDeleteConfirm(null);

      console.log("Deleted IP:", ipId);
    } catch (error) {
      console.error("Error deleting IP:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white rounded-2xl shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-500">Loading IP addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white bg-clip-text mb-2">
                IP Address Records
              </h1>
              <p className="text-slate-400 text-base sm:text-lg">
                {filteredIPs.length}{" "}
                {filteredIPs.length === 1 ? "record" : "records"} available
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search IP addresses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:outline-none w-full text-white placeholder-slate-500 sm:w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Desktop Grid View */}
        <section className="hidden md:grid gap-4">
          {filteredIPs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No IP records found</p>
            </div>
          ) : (
            filteredIPs.map((ip, index) => (
              <div
                key={ip._id || index}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="flex items-center p-5">
                  {/* Icon */}
                  <div className="flex-shrink-0 mr-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                      <Globe className="w-7 h-7" />
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-6 items-center">
                    {/* IP Address */}
                    <div>
                      <p className="text-xs text-white uppercase font-semibold mb-1">
                        IP Address
                      </p>
                      <p className="text-base font-mono font-semibold text-slate-200">
                        {ip.ipaddress || "N/A"}
                      </p>
                    </div>

                    {/* Timestamp */}
                    <div>
                      <p className="text-xs text-white uppercase font-semibold mb-1">
                        Timestamp
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatTimestamp(ip.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="flex-shrink-0 ml-5">
                    <button
                      onClick={() => setDeleteConfirm(ip.ipaddress || index)}
                      className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md group-hover:shadow-lg font-semibold"
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
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No IP records found</p>
            </div>
          ) : (
            filteredIPs.map((ip, index) => (
              <div
                key={ip._id || index}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-mono font-semibold text-gray-800">
                          {ip.ipaddress || "N/A"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(ip.timestamp)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(ip._id || index)}
                      className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-md"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fadeIn"
            onClick={() => setDeleteConfirm(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Confirm Delete</h2>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this IP address record? This
                  action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-md"
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