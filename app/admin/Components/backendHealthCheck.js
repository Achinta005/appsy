import { useState } from "react";
import { Activity, RefreshCw, Upload, Server } from "lucide-react";

const SERVICES = [
  {
    name: "Main Server",
    id: process.env.NEXT_PUBLIC_SERVICE1_ID,
    apiKey: process.env.NEXT_PUBLIC_SERVICE1_API_KEY,
    healthUrl: process.env.NEXT_PUBLIC_SERVICE1_HEALTH,
  },

  {
    name: "Portfolio Backend",
    id: process.env.NEXT_PUBLIC_SERVICE2_ID,
    apiKey: process.env.NEXT_PUBLIC_SERVICE2_API_KEY,
    healthUrl: process.env.NEXT_PUBLIC_SERVICE2_HEALTH,
  },

  {
    name: "ML Backend",
    id: process.env.NEXT_PUBLIC_SERVICE3_ID,
    apiKey: process.env.NEXT_PUBLIC_SERVICE3_API_KEY,
    healthUrl: process.env.NEXT_PUBLIC_SERVICE3_HEALTH,
  },
];

export default function RenderServiceDashboard() {
  const [statuses, setStatuses] = useState({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkStatus(service) {
    try {
      const res = await fetch(service.healthUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Health check failed");
      updateStatus(service.id, true);
      return true;
    } catch {
      updateStatus(service.id, false);
      return false;
    }
  }

  async function checkAllServices() {
    setLoading(true);
    setOutput("Checking all services...");
    for (const service of SERVICES) {
      await checkStatus(service);
    }
    setOutput("Health check completed for all services.");
    setLoading(false);
  }

  function updateStatus(id, alive) {
    setStatuses((prev) => ({ ...prev, [id]: alive }));
  }

  async function restartService(service) {
    try {
      setOutput(`Restarting ${service.name}...`);
      const res = await fetch("/api/restart", {
        method: "POST",
        body: JSON.stringify({
          serviceId: service.id,
          ApiKey: service.apiKey,
        }),
      });
      setOutput(await res.text());
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  }

  async function deployLatest(service) {
    try {
      setOutput(`Deploying latest for ${service.name}...`);
      const res = await fetch("/api/deploy", {
        method: "POST",
        body: JSON.stringify({
          serviceId: service.id,
          ApiKey: service.apiKey,
        }),
      });

      setOutput(await res.text());
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <Server className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Render Backend Monitor
            </h1>
          </div>

          {/* Check All Button */}
          <button
            onClick={checkAllServices}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50 mb-6 sm:mb-8"
          >
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">
              {loading ? "Checking..." : "Check All Services"}
            </span>
          </button>

          {/* Services - Desktop Table / Mobile Cards */}
          <div className="mb-6 sm:mb-8">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white/5 rounded-xl overflow-hidden border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10 border-b border-white/10">
                    <th className="text-left py-4 px-6 text-purple-300 font-semibold">
                      Service Name
                    </th>
                    <th className="text-left py-4 px-6 text-purple-300 font-semibold">
                      Status
                    </th>
                    <th className="text-center py-4 px-6 text-purple-300 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SERVICES.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6 text-white font-medium">
                        {s.name}
                      </td>
                      <td className="py-4 px-6">
                        {statuses[s.id] === undefined ? (
                          <span className="inline-flex items-center gap-2 text-gray-400">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                            Not checked
                          </span>
                        ) : statuses[s.id] ? (
                          <span className="inline-flex items-center gap-2 text-green-400 font-semibold">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            Alive
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-red-400 font-semibold">
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            Sleeping
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-3 justify-center">
                          {!statuses[s.id] && (
                            <button
                              onClick={() => restartService(s)}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-blue-500/50"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Restart
                            </button>
                          )}
                          <button
                            onClick={() => deployLatest(s)}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-emerald-500/50"
                          >
                            <Upload className="w-4 h-4" />
                            Deploy Latest
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
              {SERVICES.map((s) => (
                <div
                  key={s.id}
                  className="bg-white/5 rounded-lg border border-white/10 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-base">
                      {s.name}
                    </h3>
                    <div className="text-sm">
                      {statuses[s.id] === undefined ? (
                        <span className="inline-flex items-center gap-2 text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          Not checked
                        </span>
                      ) : statuses[s.id] ? (
                        <span className="inline-flex items-center gap-2 text-green-400 font-semibold">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                          Alive
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-red-400 font-semibold">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          Sleeping
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!statuses[s.id] && (
                      <button
                        onClick={() => restartService(s)}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md text-sm font-medium"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Restart
                      </button>
                    )}
                    <button
                      onClick={() => deployLatest(s)}
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-md text-sm font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      Deploy Latest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Output Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-1 h-5 sm:h-6 bg-purple-500 rounded"></div>
              Output
            </h3>
            <textarea
              value={output}
              readOnly
              placeholder="Action output will appear here..."
              className="w-full h-40 sm:h-48 bg-black/30 border border-white/10 rounded-lg p-3 sm:p-4 text-white font-mono text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
