"use client";
import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2, TrendingUp, TrendingDown, Minus, Target, UserCheck, UserX, Users,Home } from "lucide-react";

export default function CustomerDataForm() {
  const [formData, setFormData] = useState({
    age: 30,
    monthlyIncome: 5.0,
    tenure: 12,
    engagementScore: 0,
    sessionTime: 30.0,
    activityChange: 0.0,
    churnRisk: -15,
    appVisitsPerWeek: 7,
    regionCode: "3.6",
    totalClicks: 100,
    customerRating: 5,
    satisfactionTrend: -0.5,
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [upliftData, setupliftData] = useState(null);
  const [outputView, setoutputView] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" || type === "range" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });
    setoutputView(false);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_PYTHON_ML_SERVER}/predict_uplift/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      setupliftData(result);
      setoutputView(true);
      setStatus({
        type: "success",
        message: "Prediction completed successfully!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "An error occurred while submitting data",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCustomerSegment = (uplift, treatedProb, controlProb) => {
    const upliftVal = parseFloat(uplift || 0);
    const threshold = 0.01;
    
    if (upliftVal > threshold) {
      return {
        name: "Persuadable",
        icon: <Target className="w-6 h-6" />,
        color: "from-green-500 to-emerald-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-300",
        textColor: "text-green-700",
        description: "This customer will likely convert only with marketing treatment",
        action: "✓ Send marketing campaign",
        actionColor: "text-green-700 bg-green-100"
      };
    } else if (upliftVal < -threshold) {
      return {
        name: "Do Not Disturb",
        icon: <UserX className="w-6 h-6" />,
        color: "from-red-500 to-rose-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-300",
        textColor: "text-red-700",
        description: "Marketing treatment will reduce conversion probability",
        action: "✗ Do NOT send marketing",
        actionColor: "text-red-700 bg-red-100"
      };
    } else if (parseFloat(controlProb) > 0.5) {
      return {
        name: "Sure Thing",
        icon: <UserCheck className="w-6 h-6" />,
        color: "from-blue-500 to-cyan-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-300",
        textColor: "text-blue-700",
        description: "Customer will likely convert without marketing (save budget)",
        action: "⊘ Skip marketing (will convert anyway)",
        actionColor: "text-blue-700 bg-blue-100"
      };
    } else {
      return {
        name: "Lost Cause",
        icon: <Users className="w-6 h-6" />,
        color: "from-slate-500 to-gray-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-300",
        textColor: "text-slate-700",
        description: "Low conversion probability regardless of treatment",
        action: "⊘ Skip marketing (unlikely to convert)",
        actionColor: "text-slate-700 bg-slate-100"
      };
    }
  };

  const getUpliftInterpretation = (uplift) => {
    const val = parseFloat(uplift || 0) * 100;
    if (val > 10) return { text: "Strong Positive Impact", color: "text-green-600" };
    if (val > 1) return { text: "Moderate Positive Impact", color: "text-green-600" };
    if (val > 0.1) return { text: "Slight Positive Impact", color: "text-green-600" };
    if (val > -0.1) return { text: "Negligible Impact", color: "text-slate-600" };
    if (val > -1) return { text: "Slight Negative Impact", color: "text-amber-600" };
    if (val > -10) return { text: "Moderate Negative Impact", color: "text-red-600" };
    return { text: "Strong Negative Impact", color: "text-red-600" };
  };

  const calculateROI = (uplift, treatedProb, controlProb) => {
    const upliftVal = parseFloat(uplift || 0) * 100;
    const adCost = 50; // Assume ₹50 per ad
    const conversionValue = 500; // Assume ₹500 per conversion
    
    const expectedRevenue = upliftVal * conversionValue / 100;
    const roi = ((expectedRevenue - adCost) / adCost) * 100;
    
    return {
      expectedRevenue: expectedRevenue.toFixed(2),
      roi: roi.toFixed(1),
      profitable: roi > 0
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div>
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
        <div className="text-center mb-8 ">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Customer Uplift Prediction Model
          </h1>
          <p className="text-slate-600 text-lg">
            Predict customer conversion probability based on marketing treatment
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 flex-1">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Customer Information</h2>

            <div className="space-y-5">
              <div className="bg-slate-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Demographics</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Age: <span className="text-blue-600 font-semibold">{formData.age} years</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      step="1"
                      min="10"
                      max="70"
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Monthly Income: <span className="text-blue-600 font-semibold">₹{(formData.monthlyIncome * 10).toFixed(1)}k</span>
                    </label>
                    <input
                      type="number"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleChange}
                      step="0.1"
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Region
                    </label>
                    <select
                      name="regionCode"
                      value={formData.regionCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="3.6">Region A</option>
                      <option value="3.7">Region B</option>
                      <option value="3.8">Region C</option>
                      <option value="3.9">Region D</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Engagement Metrics</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tenure: <span className="text-indigo-600 font-semibold">{formData.tenure} months</span>
                    </label>
                    <input
                      type="number"
                      name="tenure"
                      value={formData.tenure}
                      onChange={handleChange}
                      step="1"
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Engagement Score: <span className="text-indigo-600 font-semibold">{formData.engagementScore}</span>
                    </label>
                    <input
                      type="range"
                      name="engagementScore"
                      value={formData.engagementScore}
                      onChange={handleChange}
                      min="-10"
                      max="10"
                      className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Low (-10)</span>
                      <span>Neutral (0)</span>
                      <span>High (+10)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Avg. Session Time: <span className="text-indigo-600 font-semibold">{formData.sessionTime} mins</span>
                    </label>
                    <input
                      type="number"
                      name="sessionTime"
                      value={formData.sessionTime}
                      onChange={handleChange}
                      step="0.1"
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      App Visits per Week: <span className="text-indigo-600 font-semibold">{formData.appVisitsPerWeek}</span>
                    </label>
                    <input
                      type="number"
                      name="appVisitsPerWeek"
                      value={formData.appVisitsPerWeek}
                      onChange={handleChange}
                      step="1"
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Total Clicks: <span className="text-indigo-600 font-semibold">{formData.totalClicks}</span>
                    </label>
                    <input
                      type="number"
                      name="totalClicks"
                      value={formData.totalClicks}
                      onChange={handleChange}
                      step="1"
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Behavior & Satisfaction</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Activity Change: <span className="text-amber-600 font-semibold">{formData.activityChange}%</span>
                    </label>
                    <input
                      type="number"
                      name="activityChange"
                      value={formData.activityChange}
                      onChange={handleChange}
                      step="0.1"
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Churn Risk Score: <span className="text-amber-600 font-semibold">{formData.churnRisk}</span>
                    </label>
                    <input
                      type="number"
                      name="churnRisk"
                      value={formData.churnRisk}
                      onChange={handleChange}
                      step="1"
                      min="-30"
                      max="0"
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Customer Rating: <span className="text-amber-600 font-semibold">{formData.customerRating}/10</span>
                    </label>
                    <input
                      type="range"
                      name="customerRating"
                      value={formData.customerRating}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Poor (1)</span>
                      <span>Average (5)</span>
                      <span>Excellent (10)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Satisfaction Trend: <span className="text-amber-600 font-semibold">{formData.satisfactionTrend}</span>
                    </label>
                    <input
                      type="number"
                      name="satisfactionTrend"
                      value={formData.satisfactionTrend}
                      onChange={handleChange}
                      step="0.1"
                      min="-1"
                      max="0"
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {status.message && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    status.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="font-medium">{status.message}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Predict Uplift"
                )}
              </button>
            </div>
          </div>

          {outputView && upliftData && (
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 lg:w-[420px] h-fit lg:sticky lg:top-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">Analysis Results</h2>
              
              {(() => {
                const segment = getCustomerSegment(
                  upliftData.predicted_uplift,
                  upliftData.treated_probability,
                  upliftData.control_probability
                );
                const interpretation = getUpliftInterpretation(upliftData.predicted_uplift);
                const roi = calculateROI(
                  upliftData.predicted_uplift,
                  upliftData.treated_probability,
                  upliftData.control_probability
                );

                return (
                  <div className="space-y-5">
                    {/* Customer Segment */}
                    <div className={`${segment.bgColor} rounded-xl p-5 border-2 ${segment.borderColor}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${segment.color} text-white`}>
                          {segment.icon}
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${segment.textColor}`}>
                            {segment.name}
                          </h3>
                          <p className="text-xs text-slate-600">Customer Segment</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 mb-3">{segment.description}</p>
                      <div className={`px-3 py-2 rounded-lg font-semibold text-sm text-center ${segment.actionColor}`}>
                        {segment.action}
                      </div>
                    </div>

                    {/* Probability Comparison */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Conversion Probability</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600">With Marketing</span>
                            <span className="font-bold text-green-700">
                              {(parseFloat(upliftData.treated_probability) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${parseFloat(upliftData.treated_probability) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600">Without Marketing</span>
                            <span className="font-bold text-blue-700">
                              {(parseFloat(upliftData.control_probability) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${parseFloat(upliftData.control_probability) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Uplift Score */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200">
                      <div className="text-sm font-medium text-slate-600 mb-2">Uplift Score</div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-4xl font-bold ${interpretation.color}`}>
                          {parseFloat(upliftData.predicted_uplift) > 0 ? '+' : ''}
                          {(parseFloat(upliftData.predicted_uplift) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <p className={`text-sm font-medium ${interpretation.color}`}>
                        {interpretation.text}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Marketing increases conversion probability by{' '}
                        {Math.abs(parseFloat(upliftData.predicted_uplift) * 100).toFixed(2)} percentage points
                      </p>
                    </div>

                    {/* ROI Estimate */}
                    <div className={`rounded-xl p-5 border-2 ${
                      roi.profitable 
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Expected ROI</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Marketing Cost:</span>
                          <span className="font-semibold">₹50</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Expected Revenue:</span>
                          <span className="font-semibold">₹{roi.expectedRevenue}</span>
                        </div>
                        <div className="border-t border-slate-300 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-700 font-medium">ROI:</span>
                            <span className={`text-xl font-bold ${
                              roi.profitable ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {roi.roi}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-3">
                        {roi.profitable 
                          ? '✓ Marketing campaign is profitable'
                          : '✗ Marketing campaign would lose money'}
                      </p>
                    </div>

                    {/* Model Decision */}
                    <div className="bg-slate-100 rounded-xl p-4 border border-slate-300">
                      <div className="text-xs font-medium text-slate-500 mb-1">Model Decision</div>
                      <div className="text-sm font-mono text-slate-700 break-words">
                        {upliftData.decision}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  Predictions based on two-model uplift architecture with {'>'}95% confidence
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}