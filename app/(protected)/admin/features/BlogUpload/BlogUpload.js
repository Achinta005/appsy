"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Sparkles } from "lucide-react";
import mammoth from "mammoth";

const generateLineStyles = () =>
  Array.from({ length: 20 }, () => ({
    style: {
      width: `${Math.random() * 200 + 100}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotate: `${Math.random() * 180}deg`,
    },
    transition: {
      duration: 3 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 2,
    },
  }));

const generateParticleStyles = () =>
  Array.from({ length: 15 }, () => ({
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    },
    transition: {
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 3,
    },
  }));

const createStyledHTML = (content, isDark) => {
  const baseStyles = `
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.8;
    color: ${isDark ? '#e5e7eb' : '#374151'};
  `;

  const elementStyles = isDark ? {
    h1: "font-size: 2.5em; font-weight: 700; color: #ffffff; margin: 1.5em 0 0.75em 0; line-height: 1.2;",
    h2: "font-size: 2em; font-weight: 600; color: #60a5fa; margin: 1.5em 0 0.75em 0; line-height: 1.3; border-bottom: 2px solid rgba(96, 165, 250, 0.3); padding-bottom: 0.5em;",
    h3: "font-size: 1.5em; font-weight: 600; color: #7dd3fc; margin: 1.25em 0 0.5em 0; line-height: 1.4;",
    h4: "font-size: 1.25em; font-weight: 600; color: #93c5fd; margin: 1em 0 0.5em 0;",
    p: "margin: 1em 0; color: #d1d5db; font-size: 1.05em;",
    ul: "margin: 1em 0; padding-left: 2em; color: #d1d5db;",
    ol: "margin: 1em 0; padding-left: 2em; color: #d1d5db;",
    li: "margin: 0.5em 0; line-height: 1.7;",
    a: "color: #60a5fa; text-decoration: underline;",
    strong: "font-weight: 700; color: #ffffff;",
    em: "font-style: italic; color: #a5b4fc;",
    code: "background-color: rgba(0, 0, 0, 0.3); color: #4ade80; padding: 0.2em 0.4em; border-radius: 0.25em; font-family: monospace; font-size: 0.9em;",
    pre: "background-color: rgba(0, 0, 0, 0.4); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 0.5em; padding: 1em; overflow-x: auto; margin: 1.5em 0;",
    blockquote: "border-left: 4px solid #8b5cf6; padding-left: 1em; margin: 1.5em 0; color: #c4b5fd; font-style: italic; background-color: rgba(139, 92, 246, 0.05); padding: 1em;",
  } : {
    h1: "font-size: 2.5em; font-weight: 700; color: #1f2937; margin: 1.5em 0 0.75em 0; line-height: 1.2;",
    h2: "font-size: 2em; font-weight: 600; color: #2563eb; margin: 1.5em 0 0.75em 0; line-height: 1.3; border-bottom: 2px solid rgba(37, 99, 235, 0.2); padding-bottom: 0.5em;",
    h3: "font-size: 1.5em; font-weight: 600; color: #3b82f6; margin: 1.25em 0 0.5em 0; line-height: 1.4;",
    h4: "font-size: 1.25em; font-weight: 600; color: #60a5fa; margin: 1em 0 0.5em 0;",
    p: "margin: 1em 0; color: #4b5563; font-size: 1.05em;",
    ul: "margin: 1em 0; padding-left: 2em; color: #4b5563;",
    ol: "margin: 1em 0; padding-left: 2em; color: #4b5563;",
    li: "margin: 0.5em 0; line-height: 1.7;",
    a: "color: #2563eb; text-decoration: underline;",
    strong: "font-weight: 700; color: #1f2937;",
    em: "font-style: italic; color: #6366f1;",
    code: "background-color: rgba(139, 92, 246, 0.1); color: #059669; padding: 0.2em 0.4em; border-radius: 0.25em; font-family: monospace; font-size: 0.9em;",
    pre: "background-color: rgba(243, 244, 246, 0.8); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 0.5em; padding: 1em; overflow-x: auto; margin: 1.5em 0;",
    blockquote: "border-left: 4px solid #8b5cf6; padding-left: 1em; margin: 1.5em 0; color: #7c3aed; font-style: italic; background-color: rgba(139, 92, 246, 0.05); padding: 1em;",
  };

  let styledContent = content;

  Object.entries(elementStyles).forEach(([tag, style]) => {
    const regex = new RegExp(`<${tag}([^>]*)>`, "g");
    styledContent = styledContent.replace(regex, `<${tag} style="${style}"$1>`);
  });

  return `<div style="${baseStyles}">${styledContent}</div>`;
};

const enhanceContentWithAI = async (plainText) => {
  try {
    return plainText;
  } catch (error) {
    console.error("AI enhancement failed:", error);
    return plainText;
  }
};

const enhanceContentLocally = (html) => {
  let enhanced = html;
  enhanced = enhanced.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  enhanced = enhanced.replace(/`([^`]+)`/g, "<code>$1</code>");
  enhanced = enhanced.replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>");
  enhanced = enhanced.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");
  enhanced = enhanced.replace(/\n\n/g, "</p><p>");
  enhanced = `<p>${enhanced}</p>`;
  return enhanced;
};

function WordDocProcessor({ onSubmit, isDark }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [useAI, setUseAI] = useState(false);

  const handleWordUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(docx|doc)$/)) {
      alert("Please upload a Word document (.docx or .doc)");
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      let htmlContent = result.value;

      if (useAI) {
        const plainText = htmlContent.replace(/<[^>]*>/g, " ").trim();
        const enhancedText = await enhanceContentWithAI(plainText);
        htmlContent = `<p>${enhancedText}</p>`;
      }

      htmlContent = enhanceContentLocally(htmlContent);
      const styledHTML = createStyledHTML(htmlContent, isDark);
      onSubmit(styledHTML);
    } catch (error) {
      console.error("Error processing Word document:", error);
      alert("Failed to process Word document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const borderColor = isDark ? "border-slate-600" : "border-purple-300";
  const hoverBorder = isDark ? "hover:border-blue-500" : "hover:border-purple-400";
  const hoverBg = isDark ? "hover:bg-slate-800/30" : "hover:bg-purple-50";
  const textColor = isDark ? "text-slate-300" : "text-gray-700";
  const textMuted = isDark ? "text-slate-400" : "text-gray-500";
  const iconColor = isDark ? "text-slate-400" : "text-gray-400";
  const accentColor = isDark ? "text-blue-400" : "text-purple-500";
  const bgNote = isDark ? "bg-slate-900/50 border-slate-700" : "bg-purple-50 border-purple-200";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="flex-1">
          <div className={`flex flex-col items-center justify-center h-32 border-2 border-dashed ${borderColor} rounded-lg cursor-pointer ${hoverBorder} ${hoverBg} transition-all`}>
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-blue-500' : 'border-purple-500'} mb-2`}></div>
                <span className={`text-sm ${textColor}`}>Processing...</span>
              </div>
            ) : (
              <>
                <FileText className={`w-10 h-10 ${iconColor} mb-2`} />
                <span className={`text-sm ${textColor} font-medium`}>
                  Upload Word Document
                </span>
                <span className={`text-xs ${textMuted} mt-1`}>
                  (.docx or .doc)
                </span>
                {fileName && (
                  <span className={`text-xs ${accentColor} mt-2`}>
                    {fileName}
                  </span>
                )}
              </>
            )}
          </div>
          <input
            type="file"
            accept=".doc,.docx"
            onChange={handleWordUpload}
            disabled={isProcessing}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          id="useAI"
          checked={useAI}
          onChange={(e) => setUseAI(e.target.checked)}
          className={`w-4 h-4 ${isDark ? 'text-blue-600' : 'text-purple-600'} rounded`}
        />
        <label
          htmlFor="useAI"
          className={`${textColor} flex items-center gap-1 cursor-pointer`}
        >
          <Sparkles className={`w-4 h-4 ${accentColor}`} />
          Enhance with AI
        </label>
      </div>

      <div className={`text-xs ${textMuted} ${bgNote} p-3 rounded-lg border transition-colors`}>
        <strong className={textColor}>Note:</strong> Your Word document will
        be automatically converted to HTML with styling.
        {useAI && " AI enhancement requires API configuration."}
      </div>
    </div>
  );
}

export function BlogUpload() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    date: new Date().toISOString(),
    readTime: "3 min",
    tags: [],
    content: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lineStyles, setLineStyles] = useState([]);
  const [particleStyles, setParticleStyles] = useState([]);
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

  useEffect(() => {
    setLineStyles(generateLineStyles());
    setParticleStyles(generateParticleStyles());
  }, []);

  const handleWordDocSubmit = (styledHTML) => {
    try {
      setFormData((prev) => ({ ...prev, content: styledHTML }));
      setMessage("✓ Word document converted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("✗ Error processing Word document");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      tags: e.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.content) {
      setMessage("✗ Please upload a Word document first");
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting blog:", formData);
      setMessage(`✓ Blog post "${formData.title}" created successfully!`);
      
      setTimeout(() => {
        setFormData({
          title: "",
          slug: "",
          excerpt: "",
          date: new Date().toISOString(),
          readTime: "3 min",
          tags: [],
          content: "",
        });
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error submitting blog:", err);
      setMessage(`✗ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-blue-50 via-purple-50 to-pink-50";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-slate-400" : "text-gray-600";
  const textMuted = isDark ? "text-slate-300" : "text-gray-700";
  const cardBg = isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-purple-200";
  const inputBg = isDark ? "bg-slate-900/50 border-slate-600/50" : "bg-white border-purple-300";
  const inputFocus = isDark ? "focus:border-purple-500 focus:ring-purple-500/50" : "focus:border-purple-400 focus:ring-purple-400/50";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark ? "placeholder-slate-500" : "placeholder-gray-400";
  const buttonPrimary = isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600";
  const previewBg = isDark ? "from-slate-900 via-slate-800 to-slate-900" : "from-purple-50 via-blue-50 to-pink-50";
  const previewBorder = isDark ? "border-slate-700/50" : "border-purple-200";
  const previewCard = isDark ? "bg-slate-800/30 border-slate-700/50" : "bg-white/80 border-purple-200";
  const tagBg = isDark ? "bg-slate-700/50 border-blue-500/20 text-blue-400" : "bg-purple-100 border-purple-300 text-purple-700";
  const iconColor = isDark ? "text-blue-400" : "text-purple-500";
  const messageSuccess = isDark ? "text-blue-400" : "text-purple-600";
  const messageError = isDark ? "text-red-400" : "text-red-600";
  const emptyStateIcon = isDark ? "opacity-30" : "opacity-20";
  const emptyStateText = isDark ? "text-slate-400" : "text-gray-500";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} py-8 px-4 transition-colors duration-300`}>
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>Upload Blog Post</h1>
          <p className={`${textSecondary} text-sm`}>Create and preview your blog content</p>
        </div>

        <div className={`${cardBg} backdrop-blur-sm rounded-xl p-6 shadow-xl border transition-colors`}>
          <h3 className={`text-lg font-semibold ${textPrimary} mb-4 flex items-center gap-2`}>
            <FileText className={`w-5 h-5 ${iconColor}`} />
            Upload & Auto-Style Your Content
          </h3>
          <WordDocProcessor onSubmit={handleWordDocSubmit} isDark={isDark} />
          {message && (
            <p
              className={`mt-4 text-sm font-medium ${
                message.includes("✗") ? messageError : messageSuccess
              }`}
            >
              {message}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`${cardBg} backdrop-blur-sm rounded-xl p-6 shadow-xl border transition-colors space-y-4`}>
            <h3 className={`text-lg font-semibold ${textPrimary} mb-4`}>Blog Details</h3>
            
            <input
              type="text"
              name="title"
              placeholder="Enter Blog Title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
            />
            <input
              type="text"
              name="slug"
              placeholder="URL Slug (e.g., my-blog-post)"
              value={formData.slug}
              onChange={handleChange}
              className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
            />
            <input
              type="text"
              name="excerpt"
              placeholder="Brief excerpt (5-10 words)"
              value={formData.excerpt}
              onChange={handleChange}
              className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              onChange={handleTagsChange}
              className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
            />
            
            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`${buttonPrimary} text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
              >
                {loading ? "Submitting..." : "Submit Post"}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className={`min-h-[500px] bg-gradient-to-br ${previewBg} rounded-xl overflow-hidden border ${previewBorder} transition-colors`}>
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                {lineStyles.map((item, i) => (
                  <motion.div
                    key={`line-${i}`}
                    className={`absolute bg-gradient-to-r from-transparent ${isDark ? 'via-blue-400/20' : 'via-purple-400/20'} to-transparent h-px`}
                    style={item.style}
                    animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 0] }}
                    transition={item.transition}
                  />
                ))}
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-20">
                {particleStyles.map((item, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    className={`absolute w-1 h-1 ${isDark ? 'bg-blue-400/40' : 'bg-purple-400/40'} rounded-full`}
                    style={item.style}
                    animate={{ y: [-20, -100], opacity: [0, 1, 0] }}
                    transition={item.transition}
                  />
                ))}
              </div>

              <div className="relative z-10 p-6 max-h-[700px] overflow-y-auto">
                <div className={`${previewCard} rounded-lg backdrop-blur-sm border overflow-hidden transition-colors`}>
                  <div className="p-6">
                    {formData.title || formData.content ? (
                      <article style={{ zoom: "0.85" }}>
                        {formData.title && (
                          <header className="mb-6">
                            <h1 className={`text-3xl font-bold mb-4 ${textPrimary} leading-tight`}>
                              {formData.title}
                            </h1>

                            <div className={`flex flex-wrap items-center ${textSecondary} mb-4 gap-4 text-sm`}>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(formData.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{formData.readTime}</span>
                              </div>
                            </div>

                            {formData.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-6">
                                {formData.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className={`px-3 py-1 ${tagBg} text-sm rounded-full border transition-colors`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </header>
                        )}

                        {formData.content ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: formData.content }}
                          />
                        ) : (
                          <p className={`${emptyStateText} text-sm`}>
                            Preview will appear here...
                          </p>
                        )}
                      </article>
                    ) : (
                      <div className={`flex flex-col items-center justify-center py-16 ${emptyStateText}`}>
                        <FileText className={`w-16 h-16 mb-4 ${emptyStateIcon}`} />
                        <p className="text-sm">
                          Upload a Word document to see preview
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}