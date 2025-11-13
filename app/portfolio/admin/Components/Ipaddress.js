import React, { useEffect, useState } from "react";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const Ipaddress = () => {
  const [ipAddresses, setIpAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getIps = async () => {
      try {
        const response = await PortfolioApiService.ViewIp();
        const data = await response;
        setIpAddresses(data);
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
          IP Address Records
        </h1>
        <p className="text-gray-600 mt-2">Total Records: {ipAddresses.length}</p>
      </header>

      <section className="w-full overflow-x-auto shadow-2xl rounded-lg">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                Timestamp
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {ipAddresses.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No IP records found
                </td>
              </tr>
            ) : (
              ipAddresses.map((ip, index) => (
                <tr
                  key={index}
                  className="hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ip.id || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                    {ip.username || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-mono">
                    {ip.ipaddress || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatTimestamp(ip.timestamp)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Ipaddress;