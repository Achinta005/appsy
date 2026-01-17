import { useState, useEffect } from "react";
import { Activity, RefreshCw, Server, CheckCircle, XCircle, Clock } from "lucide-react";

const SERVICES = [
  {
    id: "service1",
    name: "Main Server",
    healthUrl: process.env.NEXT_PUBLIC_SERVICE1_HEALTH,
    type: "NestJS",
  },
  {
    id: "service2",
    name: "ML Backend",
    healthUrl: process.env.NEXT_PUBLIC_SERVICE3_HEALTH,
    type: "FastAPI",
  },
];

export default function RenderServiceDashboard() {
  const [statuses, setStatuses] = useState({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState({});
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

  async function checkStatus(service) {
    setChecking((prev) => ({ ...prev, [service.id]: true }));
    try {
      const res = await fetch(service.healthUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Health check failed");
      updateStatus(service.id, true);
      setOutput((prev) => prev + `\n✓ ${service.name}: Healthy`);
      return true;
    } catch (err) {
      updateStatus(service.id, false);
      setOutput((prev) => prev + `\n✗ ${service.name}: ${err.message}`);
      return false;
    } finally {
      setChecking((prev) => ({ ...prev, [service.id]: false }));
    }
  }

  async function checkAllServices() {
    setLoading(true);
    setOutput("Checking all services...\n");
    
    for (const service of SERVICES) {
      await checkStatus(service);
    }
    
    setOutput((prev) => prev + "\n\nHealth check completed for all services.");
    setLoading(false);
  }

  function updateStatus(id, alive) {
    setStatuses((prev) => ({ ...prev, [id]: alive }));
  }

  // Theme-based styles
  const isDark = theme === "dark";
  const cardBg = isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-purple-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-purple-300" : "text-purple-700";
  const tableBg = isDark ? "bg-slate-900/50" : "bg-purple-50/50";
  const tableHeaderBg = isDark ? "bg-slate-700/50" : "bg-purple-100";
  const tableBorder = isDark ? "border-slate-700/50" : "border-purple-200";
  const tableHover = isDark ? "hover:bg-slate-700/30" : "hover:bg-purple-50";
  const buttonPrimary = isDark ? "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800" : "bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300";
  const buttonSecondary = isDark ? "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800" : "bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300";
  const badgeBg = isDark ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : "bg-purple-100 text-purple-700 border-purple-300";
  const outputBg = isDark ? "bg-black/30 border-slate-700" : "bg-gray-50 border-purple-200";
  const outputText = isDark ? "text-white" : "text-gray-900";
  const placeholderText = isDark ? "text-slate-400" : "text-gray-500";
  const dividerBg = isDark ? "bg-purple-500" : "bg-purple-600";
  const iconColor = isDark ? "text-purple-400" : "text-purple-500";

  const getStatusDisplay = (serviceId) => {
    if (checking[serviceId]) {
      return (
        <span className="inline-flex items-center gap-2 text-yellow-400 font-semibold">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
          Checking...
        </span>
      );
    }
    
    if (statuses[serviceId] === undefined) {
      return (
        <span className={`inline-flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Clock className="w-4 h-4" />
          Not checked
        </span>
      );
    }
    
    if (statuses[serviceId]) {
      return (
        <span className="inline-flex items-center gap-2 text-green-400 font-semibold">
          <CheckCircle className="w-4 h-4" />
          Alive
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-2 text-red-400 font-semibold">
        <XCircle className="w-4 h-4" />
        Down
      </span>
    );
  };

  return (
    <div className="w-full">
      <div className={`${cardBg} backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border p-4 sm:p-6 lg:p-8 transition-colors duration-300`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <Server className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor} flex-shrink-0`} />
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${textPrimary}`}>
              Render Backend Monitor
            </h1>
          </div>

          {/* Check All Button */}
          <button
            onClick={checkAllServices}
            disabled={loading}
            className={`flex items-center justify-center gap-2 ${buttonPrimary} disabled:cursor-not-allowed text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-lg ${isDark ? 'hover:shadow-purple-500/50' : 'hover:shadow-purple-400/50'}`}
          >
            <Activity className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-pulse' : ''}`} />
            <span className="text-sm sm:text-base">
              {loading ? "Checking..." : "Check All Services"}
            </span>
          </button>
        </div>

        {/* Services - Desktop Table / Mobile Cards */}
        <div className="mb-6 sm:mb-8">
          {/* Desktop Table View */}
          <div className={`hidden md:block ${tableBg} rounded-xl overflow-hidden border ${tableBorder} transition-colors`}>
            <table className="w-full">
              <thead>
                <tr className={`${tableHeaderBg} border-b ${tableBorder} transition-colors`}>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold`}>
                    Service Name
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold`}>
                    Type
                  </th>
                  <th className={`text-left py-4 px-6 ${textSecondary} font-semibold`}>
                    Status
                  </th>
                  <th className={`text-center py-4 px-6 ${textSecondary} font-semibold`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((service) => (
                  <tr
                    key={service.id}
                    className={`border-b ${tableBorder} ${tableHover} transition-colors`}
                  >
                    <td className={`py-4 px-6 ${textPrimary} font-medium`}>
                      {service.name}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeBg} border transition-colors`}>
                        {service.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusDisplay(service.id)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => checkStatus(service)}
                          disabled={checking[service.id]}
                          className={`flex items-center gap-2 ${buttonSecondary} disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md ${isDark ? 'hover:shadow-blue-500/50' : 'hover:shadow-blue-400/50'} text-sm font-medium`}
                        >
                          <RefreshCw className={`w-4 h-4 ${checking[service.id] ? 'animate-spin' : ''}`} />
                          Check
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className={`${tableBg} rounded-lg border ${tableBorder} p-4 transition-colors`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`${textPrimary} font-semibold text-base mb-1`}>
                      {service.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${badgeBg} border transition-colors`}>
                      {service.type}
                    </span>
                  </div>
                  <div className="text-sm">
                    {getStatusDisplay(service.id)}
                  </div>
                </div>
                
                <button
                  onClick={() => checkStatus(service)}
                  disabled={checking[service.id]}
                  className={`w-full flex items-center justify-center gap-2 ${buttonSecondary} disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md text-sm font-medium`}
                >
                  <RefreshCw className={`w-4 h-4 ${checking[service.id] ? 'animate-spin' : ''}`} />
                  Check Status
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Output Section */}
        <div>
          <h3 className={`text-lg sm:text-xl font-semibold ${textPrimary} mb-3 sm:mb-4 flex items-center gap-2`}>
            <div className={`w-1 h-5 sm:h-6 ${dividerBg} rounded`}></div>
            Output Log
          </h3>
          <div className={`${outputBg} border rounded-lg p-3 sm:p-4 transition-colors`}>
            <pre className={`${outputText} font-mono text-xs sm:text-sm whitespace-pre-wrap break-words min-h-[80px] max-h-[200px] overflow-y-auto`}>
              {output || <span className={placeholderText}>Action output will appear here...</span>}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}