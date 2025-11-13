"use client";

import { useState, useEffect } from "react";
import { getAuthToken } from "../../../lib/auth";
import { getUserFromToken } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const Notepad = ({ onDocumentSaved }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      const data = await PortfolioApiService.Notepad(title, content);

      if (!data) {
        throw new Error("Failed to save document. Please try again.");
      }

      setSuccess("Document saved successfully!");
      setTitle("");
      setContent("");
      
      fetchUserDocuments();
      
      if (onDocumentSaved) {
        onDocumentSaved(data);
      }
    } catch (err) {
      console.error("Save document error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDocuments = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }
      const documents = await PortfolioApiService.FetchNotepadDocs();
      setDocuments(documents || []);
    } catch (err) {
      console.error("Fetch documents error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const userData = getUserFromToken();
    if (userData) {
      setUser(userData);
    } else {
      setError("User authentication failed. Please login again.");
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserDocuments();
    }
  }, [user]);

  return (
    <div className="min-h-screen pb-8 sm:pb-12">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black dark:text-gray-100 text-center">
          Your Personal NotePad
        </h3>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          
          <div className="order-1 xl:order-1">
            <div className="bg-white/10 backdrop-blur-3xl rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
              <h4 className="text-lg sm:text-xl font-semibold text-black dark:text-gray-100 mb-4 sm:mb-6">
                Create New Document
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {error && (
                  <div className="text-red-500 text-sm p-3 bg-red-100/80 dark:bg-red-900/20 rounded-lg border border-red-300 dark:border-red-700">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="text-green-500 text-sm p-3 bg-green-100/80 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-700">
                    {success}
                  </div>
                )}

                <div>
                  <label className="block text-black dark:text-gray-100 text-sm sm:text-base font-semibold mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-purple-600 dark:text-purple-400 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Enter document title..."
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-black dark:text-gray-100 text-sm sm:text-base font-semibold mb-2">
                    Content *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full text-green-600 dark:text-green-400 bg-white/80 dark:bg-gray-800/80 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                    rows="8"
                    placeholder="Start writing your content here..."
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !user}
                  className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 hover:from-purple-700 hover:via-blue-600 hover:to-pink-600 text-white font-semibold py-3 sm:py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save Document"
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="order-2 xl:order-2">
            <div className="bg-white/10 backdrop-blur-3xl rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
              <h4 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400 mb-4 sm:mb-6 text-center">
                Your Saved Documents
              </h4>
              
              {documents.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 max-h-96 sm:max-h-[500px] overflow-y-auto pr-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 sm:p-4 bg-white/20 dark:bg-gray-800/40 rounded-lg border border-gray-200/20 dark:border-gray-600/20 hover:bg-white/30 dark:hover:bg-gray-800/60 transition-all duration-200 hover:shadow-md"
                    >
                      <h5 className="font-semibold text-purple-700 dark:text-purple-400 text-sm sm:text-base mb-1 sm:mb-2">
                        {doc.title}
                      </h5>
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 line-clamp-2 mb-2">
                        {doc.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(doc.createdAt || doc.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-6xl mb-4 opacity-50">📝</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
                    {error ? "Unable to load documents" : "No documents saved yet"}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Create your first document using the form on the left
                  </p>
                  <button 
                    onClick={fetchUserDocuments}
                    className="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300 text-sm underline transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Refresh"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Notepad;