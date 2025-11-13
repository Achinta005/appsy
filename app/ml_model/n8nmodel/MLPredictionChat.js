'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

// Sample data for auto-fill
const SAMPLE_DATA = {
  'customer churn prediction': {
    "SeniorCitizen": 0,
    "tenure": 12,
    "MonthlyCharges": 65.5,
    "TotalCharges": 786.0,
    "gender": "Male",
    "Partner": "Yes",
    "Dependents": "No",
    "PhoneService": "Yes",
    "MultipleLines": "No",
    "InternetService": "Fiber optic",
    "OnlineSecurity": "No",
    "OnlineBackup": "Yes",
    "DeviceProtection": "No",
    "TechSupport": "No",
    "StreamingTV": "Yes",
    "StreamingMovies": "No",
    "Contract": "Month-to-month",
    "PaperlessBilling": "Yes",
    "PaymentMethod": "Electronic check"
  },
  'heart disease prediction': {
    "Gender": "Male",
    "Blood Pressure": 140,
    "Cholesterol Level": 220,
    "Exercise Habits": "Moderate",
    "Smoking": true,
    "Family Heart Disease": true,
    "Diabetes": false,
    "BMI": 28.5,
    "High Blood Pressure": true,
    "Low HDL Cholesterol": false,
    "High LDL Cholesterol": true,
    "Alcohol Consumption": "Occasional",
    "Stress Level": 7,
    "Sleep Hours": 6,
    "Sugar Consumption": "High",
    "Triglyceride Level": 180,
    "Fasting Blood Sugar": 110,
    "CRP Level": 3.5,
    "Homocysteine Level": 12
  },
  'medical charge predictor': {
    "age": 45,
    "bmi": 28.5,
    "children": 2,
    "smoker": true,
    "sex": "male",
    "region": "southeast"
  }
};

const MLPredictionChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hello! I'm your ML Prediction Assistant.\n\nSelect a model below to get started:"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const messagesEndRef = useRef(null);

  const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/ml-agent';

  const MODELS = [
    { id: 'customer churn prediction', name: '📊 Customer Churn', icon: '📊' },
    { id: 'heart disease prediction', name: '❤️ Heart Disease', icon: '❤️' },
    { id: 'medical charge predictor', name: '💰 Medical Charges', icon: '💰' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleModelSelect = async (modelId, modelName) => {
    setSelectedModel(modelId);
    setMessages(prev => [...prev, { role: 'user', content: `I want to use ${modelName}` }]);
    setIsLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_name: modelId })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data.type === 'form_required') {
        setFormSchema(data.form_schema);
        
        // Auto-fill with sample data
        const sampleData = SAMPLE_DATA[modelId] || {};
        setFormData(sampleData);
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Great! I've pre-filled the form with sample data for **${data.model_name}**. You can modify any values or submit as is.`,
          showForm: true
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Connection error. Make sure n8n workflow is active at ' + N8N_WEBHOOK_URL,
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFill = () => {
    if (selectedModel && SAMPLE_DATA[selectedModel]) {
      setFormData(SAMPLE_DATA[selectedModel]);
    }
  };

  const handleClearForm = () => {
    setFormData({});
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_name: selectedModel,
          form_data: formData
        })
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || '✅ Prediction completed!',
        prediction: data.prediction,
        modelUsed: data.model_used
      }]);

      setFormSchema(null);
      setFormData({});
      setSelectedModel(null);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Error processing prediction.',
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data.type === 'ai_chat') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response || JSON.stringify(data)
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Connection error.',
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (fieldName, fieldType) => {
    const value = formData[fieldName] ?? '';

    const handleChange = (e) => {
      const val = fieldType === 'number' 
        ? parseFloat(e.target.value) || 0
        : fieldType === 'boolean'
        ? e.target.checked
        : e.target.value;
      setFormData(prev => ({ ...prev, [fieldName]: val }));
    };

    if (fieldType === 'boolean') {
      return (
        <div key={fieldName} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            id={fieldName}
            checked={!!value}
            onChange={handleChange}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
          />
          <label htmlFor={fieldName} className="text-sm text-gray-700 cursor-pointer flex-1">
            {fieldName}
          </label>
        </div>
      );
    }

    return (
      <div key={fieldName} className="flex flex-col gap-1">
        <label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
          {fieldName}
        </label>
        <input
          type={fieldType === 'number' ? 'number' : 'text'}
          id={fieldName}
          value={value}
          onChange={handleChange}
          step={fieldType === 'number' ? 'any' : undefined}
          placeholder={`Enter ${fieldName.toLowerCase()}`}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-lg px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">ML Prediction Assistant</h1>
            <p className="text-sm text-gray-500">Powered by AI & Machine Learning</p>
          </div>
        </div>
      </div>

      {!selectedModel && !formSchema && messages.length <= 1 && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-600 mb-3 font-medium">Choose a prediction model:</p>
          <div className="flex flex-wrap gap-3">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id, model.name)}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
                disabled={isLoading}
              >
                <span className="text-xl">{model.icon}</span>
                {model.name}
                <ArrowRight className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
            )}

            <div className={`max-w-2xl ${msg.role === 'user' ? 'order-1' : ''}`}>
              <div
                className={`rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : msg.error
                    ? 'bg-red-50 text-red-900 border-2 border-red-200'
                    : 'bg-white text-gray-800 shadow-md border border-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                {msg.prediction && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="font-semibold text-sm mb-3">📊 Prediction Result</p>
                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                      <pre className="whitespace-pre-wrap font-mono text-xs text-gray-700 max-h-64 overflow-y-auto">
                        {JSON.stringify(msg.prediction, null, 2)}
                      </pre>
                    </div>
                    {msg.modelUsed && (
                      <p className="text-xs mt-3 text-gray-600">
                        🤖 Model: <span className="font-semibold">{msg.modelUsed}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {msg.showForm && formSchema && (
                <div className="mt-4 bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">📝 Input Form</h3>
                      <p className="text-sm text-gray-500 mt-1">Pre-filled with sample data</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAutoFill}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Reset Sample
                      </button>
                      <button
                        onClick={handleClearForm}
                        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-96 overflow-y-auto pr-2">
                    {formSchema.inputs.map((field) =>
                      renderFormField(field, formSchema.input_types[field])
                    )}
                  </div>
                  
                  <button
                    onClick={handleFormSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Prediction
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-6 h-6 text-gray-700" />
              </div>
            )}
          </div>
        ))}

        {isLoading && !formSchema && (
          <div className="flex gap-3 justify-start">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white rounded-2xl px-5 py-3 shadow-md">
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Or type a message for AI assistance..."
              className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPredictionChat;