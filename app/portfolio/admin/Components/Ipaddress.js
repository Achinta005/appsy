import React, { useEffect, useState } from "react";
import { Wifi, User, Clock, Hash } from "lucide-react";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const Ipaddress = () => {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getIps = async () => {
      try {
        const response = await PortfolioApiService.ViewIp();
        setIpAddresses(response);
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
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading IP records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full border-2 border-red-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wifi className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-600 mb-2">Error Loading Data</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              IP Records
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs sm:text-sm font-semibold rounded-full">
              {ipAddresses.length} Total Records
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {ipAddresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wifi className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No IP records found</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {ipAddresses.map((ip, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Mobile Card Layout */}
                <div className="p-4 sm:p-5">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 font-medium mb-1">Username</p>
                        <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
                          {ip.username || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 px-2 py-1 bg-blue-100 rounded-lg flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-bold text-blue-600">
                          {ip.id || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* IP Address */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Wifi className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500 font-medium">IP Address</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg px-3 py-2">
                      <p className="text-sm sm:text-base font-mono font-bold text-blue-600 break-all">
                        {ip.ipaddress || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500 font-medium">Timestamp</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">
                      {formatTimestamp(ip.timestamp)}
                    </p>
                  </div>
                </div>

                {/* Gradient Bottom Border */}
                <div className="h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="h-6"></div>
    </div>
  );
};

export default Ipaddress;