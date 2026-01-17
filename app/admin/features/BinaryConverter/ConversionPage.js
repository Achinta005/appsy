"use client";

import { useState, useEffect } from "react";
import useApi from "@/services/authservices";

export default function ConversionPage() {
  const [numberInput, setNumberInput] = useState("");
  const [numberBase, setNumberBase] = useState("decimal");
  const [numberResult, setNumberResult] = useState(null);

  const [ipInput, setIpInput] = useState("");
  const [ipResult, setIpResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleNumberConversion = async () => {
    setLoading(true);
    setError("");
    setNumberResult(null);

    try {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/convert/number`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: numberInput,
            base: numberBase,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Conversion failed");
      }

      const data = await response.json();
      setNumberResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIpConversion = async () => {
    setLoading(true);
    setError("");
    setIpResult(null);

    try {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/convert/ip`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ip: ipInput }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Conversion failed");
      }

      const data = await response.json();
      setIpResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-blue-50 to-indigo-100";
  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-700";
  const textLabel = isDark ? "text-slate-300" : "text-gray-700";
  const cardBg = isDark ? "bg-slate-800/50" : "bg-white";
  const inputBg = isDark ? "bg-slate-700/50 border-slate-600" : "bg-white border-gray-300";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const inputFocus = isDark ? "focus:ring-purple-500 focus:border-purple-500" : "focus:ring-blue-500 focus:border-blue-500";
  const buttonPrimary = isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700";
  const buttonSecondary = isDark ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700";
  const resultBg = isDark ? "bg-slate-700/50" : "bg-gray-50";
  const errorBg = isDark ? "bg-red-900/30 border-red-500/50 text-red-200" : "bg-red-100 border-red-400 text-red-700";
  const errorButton = isDark ? "text-red-300 hover:text-red-100" : "text-red-700 hover:text-red-900";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-8 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold ${textPrimary} mb-8 text-center transition-colors`}>
          Number & IP Converter
        </h1>

        {/* Error Display */}
        {error && (
          <div className={`${errorBg} border px-4 py-3 rounded-lg mb-6 relative transition-colors`}>
            <button
              onClick={() => setError("")}
              className={`absolute top-2 right-2 ${errorButton}`}
            >
              ✕
            </button>
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Number Conversion Section */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 mb-6 transition-colors`}>
          <h2 className={`text-2xl font-semibold ${textSecondary} mb-4 transition-colors`}>
            Number Conversion
          </h2>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${textLabel} mb-2 transition-colors`}>
                Input Value
              </label>
              <input
                type="text"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="Enter number..."
                className={`w-full px-4 py-2 border ${inputBg} ${inputText} rounded-md focus:ring-2 ${inputFocus} focus:outline-none transition-colors`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${textLabel} mb-2 transition-colors`}>
                Input Base
              </label>
              <select
                value={numberBase}
                onChange={(e) => setNumberBase(e.target.value)}
                className={`w-full px-4 py-2 border ${inputBg} ${inputText} rounded-md focus:ring-2 ${inputFocus} focus:outline-none transition-colors`}
              >
                <option value="decimal">Decimal (Base 10)</option>
                <option value="binary">Binary (Base 2)</option>
                <option value="octal">Octal (Base 8)</option>
                <option value="hex">Hexadecimal (Base 16)</option>
              </select>
            </div>

            <button
              onClick={handleNumberConversion}
              disabled={loading || !numberInput}
              className={`w-full ${buttonPrimary} text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors`}
            >
              {loading ? "Converting..." : "Convert"}
            </button>
          </div>

          {numberResult && (
            <div className={`mt-6 p-4 ${resultBg} rounded-md transition-colors`}>
              <h3 className={`font-semibold ${textSecondary} mb-2 transition-colors`}>Results:</h3>
              <div className="space-y-2">
                <p className={textLabel}>
                  <span className="font-medium">Decimal:</span>{" "}
                  {numberResult.decimal}
                </p>
                <p className={textLabel}>
                  <span className="font-medium">Binary:</span>{" "}
                  {numberResult.binary}
                </p>
                <p className={textLabel}>
                  <span className="font-medium">Octal:</span>{" "}
                  {numberResult.octal}
                </p>
                <p className={textLabel}>
                  <span className="font-medium">Hexadecimal:</span>{" "}
                  {numberResult.hex}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* IP Conversion Section */}
        <div className={`${cardBg} rounded-lg shadow-lg p-6 mb-6 transition-colors`}>
          <h2 className={`text-2xl font-semibold ${textSecondary} mb-4 transition-colors`}>
            IP Address to Binary
          </h2>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${textLabel} mb-2 transition-colors`}>
                IP Address
              </label>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="e.g., 192.168.1.1"
                className={`w-full px-4 py-2 border ${inputBg} ${inputText} rounded-md focus:ring-2 ${inputFocus} focus:outline-none transition-colors`}
              />
            </div>

            <button
              onClick={handleIpConversion}
              disabled={loading || !ipInput}
              className={`w-full ${buttonSecondary} text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors`}
            >
              {loading ? "Converting..." : "Convert IP"}
            </button>
          </div>

          {ipResult && (
            <div className={`mt-6 p-4 ${resultBg} rounded-md transition-colors`}>
              <h3 className={`font-semibold ${textSecondary} mb-2 transition-colors`}>Results:</h3>
              <div className="space-y-2">
                <p className={textLabel}>
                  <span className="font-medium">IP Address:</span> {ipResult.ip}
                </p>
                <p className={textLabel}>
                  <span className="font-medium">Binary (Full):</span>{" "}
                  {ipResult.binaryFull}
                </p>
                <p className={`mt-2 ${textLabel}`}>
                  <span className="font-medium">Octets:</span>
                </p>
                {ipResult.octets?.map((octet, idx) => (
                  <p key={idx} className={`ml-4 ${textLabel}`}>
                    Octet {idx + 1}: {octet.decimal} = {octet.binary}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}