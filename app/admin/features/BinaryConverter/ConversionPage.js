"use client";

import { useState } from "react";
import useApi from "@/services/authservices";

export default function ConversionPage() {
  const [numberInput, setNumberInput] = useState("");
  const [numberBase, setNumberBase] = useState("decimal");
  const [numberResult, setNumberResult] = useState(null);

  const [ipInput, setIpInput] = useState("");
  const [ipResult, setIpResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiFetch = useApi();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Number & IP Converter
        </h1>

        {/* Error Display - Moved to top */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 relative">
            <button
              onClick={() => setError("")}
              className="absolute top-2 right-2 text-red-700 hover:text-red-900"
            >
              ✕
            </button>
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Number Conversion Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Number Conversion
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Value
              </label>
              <input
                type="text"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="Enter number..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Base
              </label>
              <select
                value={numberBase}
                onChange={(e) => setNumberBase(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Converting..." : "Convert"}
            </button>
          </div>

          {numberResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">Results:</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Decimal:</span>{" "}
                  {numberResult.decimal}
                </p>
                <p>
                  <span className="font-medium">Binary:</span>{" "}
                  {numberResult.binary}
                </p>
                <p>
                  <span className="font-medium">Octal:</span>{" "}
                  {numberResult.octal}
                </p>
                <p>
                  <span className="font-medium">Hexadecimal:</span>{" "}
                  {numberResult.hex}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* IP Conversion Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            IP Address to Binary
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Address
              </label>
              <input
                type="text"
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="e.g., 192.168.1.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleIpConversion}
              disabled={loading || !ipInput}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Converting..." : "Convert IP"}
            </button>
          </div>

          {ipResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">Results:</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">IP Address:</span> {ipResult.ip}
                </p>
                <p>
                  <span className="font-medium">Binary (Full):</span>{" "}
                  {ipResult.binaryFull}
                </p>
                <p className="mt-2">
                  <span className="font-medium">Octets:</span>
                </p>
                {ipResult.octets?.map((octet, idx) => (
                  <p key={idx} className="ml-4">
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