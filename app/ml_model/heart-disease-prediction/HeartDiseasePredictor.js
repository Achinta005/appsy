'use client';

import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';

export default function HeartDiseasePredictor() {
  const [formData, setFormData] = useState({
    Gender: 'Male',
    'Blood Pressure': 0.46,
    'Cholesterol Level': 0.93,
    'Exercise Habits': 'High',
    Smoking: 'Yes',
    'Family Heart Disease': 'No',
    Diabetes: 'Yes',
    BMI: 0.87,
    'High Blood Pressure': 'Yes',
    'Low HDL Cholesterol': 'No',
    'High LDL Cholesterol': 'No',
    'Alcohol Consumption': 'Low',
    'Stress Level': 'Medium',
    'Sleep Hours': 0.15,
    'Sugar Consumption': 'Low',
    'Triglyceride Level': 0.22,
    'Fasting Blood Sugar': 0.5,
    'CRP Level': 0.85,
    'Homocysteine Level': 0.83
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [statusColor, setStatusColor] = useState('text-yellow-600');

  const API_URL = process.env.NEXT_PUBLIC_API_URL_MODEL;

  // Check API status on page load
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PYTHON_ML_SERVER}/health`);
        if (response.ok) {
          setApiStatus('✅ Connected (Heart Disease API)');
          setStatusColor('text-green-600');
        } else {
          throw new Error('API not responding');
        }
      } catch (err) {
        setApiStatus('❌ Disconnected - Start Flask server');
        setStatusColor('text-red-600');
      }
    };

    checkApiStatus();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['Blood Pressure', 'Cholesterol Level', 'BMI', 'Sleep Hours', 'Triglyceride Level', 'Fasting Blood Sugar', 'CRP Level', 'Homocysteine Level'];
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    console.log(formData)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_PYTHON_ML_SERVER}/heart-disease/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (data.success) {
        setResult({
          prediction: data.prediction_label,
          confidence: data.confidence,
          riskLevel: data.risk_level,
          inputData: formData
        });
      } else {
        throw new Error(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      Gender: 'Male',
      'Blood Pressure': 0.466667,
      'Cholesterol Level': 0.933333,
      'Exercise Habits': 'High',
      Smoking: 'Yes',
      'Family Heart Disease': 'No',
      Diabetes: 'Yes',
      BMI: 0.877067,
      'High Blood Pressure': 'Yes',
      'Low HDL Cholesterol': 'No',
      'High LDL Cholesterol': 'No',
      'Alcohol Consumption': 'Low',
      'Stress Level': 'Medium',
      'Sleep Hours': 0.153273,
      'Sugar Consumption': 'Low',
      'Triglyceride Level': 0.22,
      'Fasting Blood Sugar': 0.575,
      'CRP Level': 0.85884,
      'Homocysteine Level': 0.835992
    });
    setResult(null);
    setError('');
  };

  const categoryFields = {
    'Patient Demographics': ['Gender'],
    'Vital Signs': ['Blood Pressure', 'BMI'],
    'Blood Work': ['Cholesterol Level', 'Triglyceride Level', 'Fasting Blood Sugar', 'CRP Level', 'Homocysteine Level'],
    'Lifestyle': ['Exercise Habits', 'Smoking', 'Alcohol Consumption', 'Sleep Hours', 'Sugar Consumption'],
    'Medical History': ['Family Heart Disease', 'Diabetes', 'High Blood Pressure', 'Low HDL Cholesterol', 'High LDL Cholesterol'],
    'Mental Health': ['Stress Level']
  };

  const selectOptions = {
    Gender: ['Male', 'Female'],
    'Exercise Habits': ['Low', 'Medium', 'High'],
    Smoking: ['Yes', 'No'],
    'Family Heart Disease': ['Yes', 'No'],
    Diabetes: ['Yes', 'No'],
    'High Blood Pressure': ['Yes', 'No'],
    'Low HDL Cholesterol': ['Yes', 'No'],
    'High LDL Cholesterol': ['Yes', 'No'],
    'Alcohol Consumption': ['Low', 'Medium', 'High'],
    'Stress Level': ['Low', 'Medium', 'High'],
    'Sugar Consumption': ['Low', 'Medium', 'High']
  };

  const getRiskBadgeColor = () => {
    switch(result?.riskLevel.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 flex justify-center items-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 md:p-10">
        <div className="mb-6">
          <button
            onClick={() => window.location.href = '/ml_model'}
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">❤️ Heart Disease Predictor</h1>
          <p className="text-gray-600 text-lg">Predict your heart disease risk in seconds</p>
        </div>

        {/* API Status Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-6 rounded text-sm">
          <span className="text-blue-900">ℹ️ API Status: </span>
          <span className={`font-semibold ${statusColor}`}>{apiStatus}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {Object.entries(categoryFields).map(([category, fields]) => (
            <div key={category} className="mb-8">
              {/* Section Title */}
              <h3 className="text-lg font-bold text-purple-600 mb-4 pb-2 border-b-2 border-purple-600 uppercase tracking-wide">
                {category}
              </h3>
              
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                {fields.map(fieldName => (
                  <div key={fieldName}>
                    <label htmlFor={fieldName} className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      {fieldName}
                    </label>
                    
                    {selectOptions[fieldName] ? (
                      <select
                        id={fieldName}
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700"
                        required
                      >
                        {selectOptions[fieldName].map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        id={fieldName}
                        name={fieldName}
                        value={formData[fieldName]}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        max="1"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700"
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Button Group */}
          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Predicting...
                </span>
              ) : (
                'Predict Heart Disease'
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
            
            {/* Prediction Label */}
            <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-widest">Prediction Result</p>

            {/* Prediction Value */}
            <div className={`text-3xl md:text-4xl font-bold text-center p-6 rounded-lg mb-4 ${result.prediction.includes('Detected') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {result.prediction}
            </div>

            {/* Risk Badge */}
            <div className={`inline-block w-full text-center py-2 px-4 rounded-full font-bold mb-6 ${getRiskBadgeColor()}`}>
              Risk Level: <strong>{result.riskLevel}</strong>
            </div>

            {/* Confidence Bars */}
            <div className="bg-white p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-widest">Confidence Scores</p>
              
              {/* No Disease */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 font-medium">No Disease</span>
                  <span className="text-sm font-bold text-gray-900">{(result.confidence.no_disease * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-500"
                    style={{width: `${result.confidence.no_disease * 100}%`}}
                  ></div>
                </div>
              </div>

              {/* Has Disease */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 font-medium">Has Disease</span>
                  <span className="text-sm font-bold text-gray-900">{(result.confidence.disease * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-700 h-full rounded-full transition-all duration-500"
                    style={{width: `${result.confidence.disease * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>

            {/* Result Details */}
            <div className="bg-white p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Gender</span>
                  <span className="font-semibold text-gray-900">{result.inputData.Gender}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Blood Pressure</span>
                  <span className="font-semibold text-gray-900">{result.inputData['Blood Pressure'].toFixed(3)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Cholesterol Level</span>
                  <span className="font-semibold text-gray-900">{result.inputData['Cholesterol Level'].toFixed(3)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">BMI</span>
                  <span className="font-semibold text-gray-900">{result.inputData.BMI.toFixed(3)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Smoking Status</span>
                  <span className="font-semibold text-gray-900">{result.inputData.Smoking}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 font-medium">Diabetes</span>
                  <span className="font-semibold text-gray-900">{result.inputData.Diabetes}</span>
                </div>
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