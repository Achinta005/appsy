"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, Loader2, MapPin, Home } from "lucide-react";

export default function IPManagement() {
  const [ips, setIps] = useState([]);
  const [newIp, setNewIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existIp, setexistIp] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL;

  useEffect(() => {
    fetchIPs();
    getIp();
  }, []);

  const fetchIPs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/adminIp/ips`);
      if (!response.ok) throw new Error("Failed to fetch IPs");
      const data = await response.json();
      setIps(data.ips || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addIP = async (e) => {
    if (e) e.preventDefault();
    if (!newIp.trim()) return;

    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_URL}/adminIp/ips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ipaddress: newIp.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add IP");
      }

      setSuccess("IP address added successfully!");
      setNewIp("");
      fetchIPs();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteIP = async (id) => {
    if (!confirm("Are you sure you want to delete this IP address?")) return;

    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${API_URL}/adminIp/ips/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete IP");
      }

      setSuccess("IP address deleted successfully!");
      fetchIPs();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const getIp = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/get-ip`);
      if (!response.ok) throw new Error("Failed to fetch Your ip");
      const data = await response.json();
      setNewIp(data.IP);
    } catch (error) {}
  };

  useEffect(() => {
    if (!newIp || ips.length === 0) {
      setexistIp(false);
      return;
    }
    const exists = ips.some((item) => item.ipaddress === newIp);
    setexistIp(exists);
  }, [newIp, ips]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-6">
      {/* Mobile Header with Home Button */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg rounded-b-3xl">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => window.location.href = '/portfolio'}
            className="flex items-center gap-2 text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-all active:scale-95"
          >
            <Home size={20} />
            <span className="text-sm font-medium">Home</span>
          </button>
          <h1 className="text-lg font-bold text-white">IP Management</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="p-4 space-y-4 mt-2">
        {/* Current IP Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-5">
          <p className="text-blue-100 text-xs mb-3 font-medium">Your Current IP</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30">
              <p className="text-lime-300 font-mono text-sm font-bold">
                {newIp || "Detecting..."}
              </p>
            </div>
            {!existIp ? (
              <button
                onClick={() => {
                  if (!newIp) return;
                  addIP();
                }}
                title="Add your current IP"
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-xl p-3 transition-all shadow-md active:scale-95"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            ) : (
              <div 
                title="IP already authorized"
                className="flex items-center justify-center bg-green-600/30 rounded-xl p-3"
              >
                <MapPin size={20} className="text-green-300" />
              </div>
            )}
          </div>
        </div>

        {/* Add IP Card */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Add New IP Address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="e.g., 192.168.1.1"
              onKeyPress={(e) => e.key === "Enter" && addIP(e)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={addIP}
              className="px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="text-sm">Add</span>
            </button>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-pulse">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-green-800 text-sm font-medium">{success}</p>
          </div>
        )}

        {/* IP List Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700">Authorized IP Addresses</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          ) : ips.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-slate-500 text-sm">No IP addresses found</p>
              <p className="text-slate-400 text-xs mt-1">
                Add your first IP address to get started
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {ips.map((ip, index) => (
                <div
                  key={ip.id}
                  className="p-4 hover:bg-slate-50 transition-colors active:bg-slate-100"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          ID: {ip.id}
                        </span>
                      </div>
                      <div className="font-mono text-blue-700 text-sm bg-blue-50 px-3 py-2 rounded-lg inline-block mb-2">
                        {ip.ipaddress}
                      </div>
                      <p className="text-xs text-slate-500">
                        Added: {new Date(ip.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteIP(ip.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium active:scale-95 shrink-0"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-slate-600 text-center">
              Total IP Addresses:{" "}
              <span className="font-semibold text-slate-800">{ips.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}