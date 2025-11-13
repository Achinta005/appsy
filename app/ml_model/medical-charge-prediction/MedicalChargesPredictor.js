"use client";

import { useState, useEffect } from "react";
import { Home } from "lucide-react";

export default function MedicalChargesPredictor() {
  const [formData, setFormData] = useState({
    age: "35",
    bmi: "25",
    children: "2",
    smoker: "no",
    sex: "male",
    region: "northeast",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [statusColor, setStatusColor] = useState("text-yellow-600");

  const API_URL = process.env.NEXT_PUBLIC_API_URL_MODEL;

  // Check API status on page load
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PYTHON_ML_SERVER}/health`);
        if (response.ok) {
          setApiStatus("✅ Connected (Medical Charges Api)");
          setStatusColor("text-green-600");
        } else {
          throw new Error("API not responding");
        }
      } catch (err) {
        setApiStatus("❌ Disconnected - Start Flask server");
        setStatusColor("text-red-600");
      }
    };

    checkApiStatus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
console.log(formData)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_PYTHON_ML_SERVER}/medical-charge/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      if (data.success) {
        setResult({
          charge: data.predicted_charge.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          inputData: data.input_data,
        });
      } else {
        throw new Error(data.error || "Prediction failed");
      }
    } catch (err) {
      setError("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      age: "35",
      bmi: "25",
      children: "2",
      smoker: "no",
      sex: "male",
      region: "northeast",
    });
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex justify-center items-center p-5">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 md:p-12">
        <div className="mb-6">
          <button
            onClick={() => (window.location.href = "/ml_model")}
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

            {/* Button Content */}
            <Home className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10">Home</span>
          </button>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            💊 Medical Charges
          </h1>
          <p className="text-gray-600 text-lg">
            Predict your annual medical charges in seconds
          </p>
        </div>

        {/* API Status Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded text-sm">
          <span className="text-blue-900">ℹ️ API running on: </span>
          <span className={`font-semibold ${statusColor}`}>{apiStatus}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Age */}
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700"
                required
              />
            </div>

            {/* BMI */}
            <div>
              <label
                htmlFor="bmi"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                BMI
              </label>
              <input
                type="number"
                id="bmi"
                name="bmi"
                step="0.1"
                min="10"
                max="50"
                value={formData.bmi}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700"
                required
              />
            </div>

            {/* Children */}
            <div className="md:col-span-2">
              <label
                htmlFor="children"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Number of Children
              </label>
              <input
                type="number"
                id="children"
                name="children"
                min="0"
                max="10"
                value={formData.children}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700"
                required
              />
            </div>

            {/* Smoking Status */}
            <div>
              <label
                htmlFor="smoker"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Smoking Status
              </label>
              <select
                id="smoker"
                name="smoker"
                value={formData.smoker}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700"
                required
              >
                <option value="no">Non-Smoker</option>
                <option value="yes">Smoker</option>
              </select>
            </div>

            {/* Sex */}
            <div>
              <label
                htmlFor="sex"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Sex
              </label>
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Region */}
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Region
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700"
                required
              >
                <option value="northeast">Northeast</option>
                <option value="northwest">Northwest</option>
                <option value="southeast">Southeast</option>
                <option value="southwest">Southwest</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Predicting...
                </span>
              ) : (
                "Predict Charges"
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all duration-300 uppercase tracking-wide"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded animate-slide-in">
            {error}
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl animate-slide-in">
            {/* Result Label */}
            <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-widest">
              Estimated Annual Charges
            </p>

            {/* Result Value */}
            <div className="text-5xl md:text-6xl font-bold text-purple-600 mb-6">
              ${result.charge}
            </div>

            {/* Result Details */}
            <div className="bg-white p-5 rounded-lg space-y-3">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Age</span>
                <span className="font-semibold text-gray-900">
                  {result.inputData.age}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">BMI</span>
                <span className="font-semibold text-gray-900">
                  {result.inputData.bmi}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Children</span>
                <span className="font-semibold text-gray-900">
                  {result.inputData.children}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {result.inputData.smoker === "yes" ? "Smoker" : "Non-Smoker"}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Sex</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {result.inputData.sex}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600 font-medium">Region</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {result.inputData.region}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
