"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, FileText, Upload, Sparkles } from "lucide-react";
import mammoth from "mammoth";
import { PortfolioApiService } from "@/services/PortfolioApiService";

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

const createStyledHTML = (content) => {
  const baseStyles = `
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.8;
    color: #e5e7eb;
  `;

  const elementStyles = {
    h1: 'font-size: 2.5em; font-weight: 700; color: #ffffff; margin: 1.5em 0 0.75em 0; line-height: 1.2;',
    h2: 'font-size: 2em; font-weight: 600; color: #60a5fa; margin: 1.5em 0 0.75em 0; line-height: 1.3; border-bottom: 2px solid rgba(96, 165, 250, 0.3); padding-bottom: 0.5em;',
    h3: 'font-size: 1.5em; font-weight: 600; color: #7dd3fc; margin: 1.25em 0 0.5em 0; line-height: 1.4;',
    h4: 'font-size: 1.25em; font-weight: 600; color: #93c5fd; margin: 1em 0 0.5em 0;',
    p: 'margin: 1em 0; color: #d1d5db; font-size: 1.05em;',
    ul: 'margin: 1em 0; padding-left: 2em; color: #d1d5db;',
    ol: 'margin: 1em 0; padding-left: 2em; color: #d1d5db;',
    li: 'margin: 0.5em 0; line-height: 1.7;',
    a: 'color: #60a5fa; text-decoration: underline;',
    strong: 'font-weight: 700; color: #ffffff;',
    em: 'font-style: italic; color: #a5b4fc;',
    code: 'background-color: rgba(0, 0, 0, 0.3); color: #4ade80; padding: 0.2em 0.4em; border-radius: 0.25em; font-family: monospace; font-size: 0.9em;',
    pre: 'background-color: rgba(0, 0, 0, 0.4); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 0.5em; padding: 1em; overflow-x: auto; margin: 1.5em 0;',
    blockquote: 'border-left: 4px solid #8b5cf6; padding-left: 1em; margin: 1.5em 0; color: #c4b5fd; font-style: italic; background-color: rgba(139, 92, 246, 0.05); padding: 1em;'
  };

  let styledContent = content;
  
  Object.entries(elementStyles).forEach(([tag, style]) => {
    const regex = new RegExp(`<${tag}([^>]*)>`, 'g');
    styledContent = styledContent.replace(regex, `<${tag} style="${style}"$1>`);
  });

  return `<div style="${baseStyles}">${styledContent}</div>`;
};

const enhanceContentWithAI = async (plainText) => {
try {
    const response = await PortfolioApiService.Ai_enhance(plainText)

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "AI API failed");
    }
    
    const result = await response.json();
    return result.summary || plainText;
  } catch (error) {
    console.error("AI enhancement failed:", error);
    return plainText;
  }
};

const enhanceContentLocally = (html) => {
  let enhanced = html;
  
  enhanced = enhanced.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  enhanced = enhanced.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  enhanced = enhanced.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
  
  enhanced = enhanced.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  enhanced = enhanced.replace(/\n\n/g, '</p><p>');
  enhanced = `<p>${enhanced}</p>`;
  
  return enhanced;
};

function WordDocProcessor({ onSubmit }) {
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
        const plainText = htmlContent.replace(/<[^>]*>/g, ' ').trim();
        const enhancedText = await enhanceContentWithAI(plainText);
        htmlContent = `<p>${enhancedText}</p>`;
      }

      htmlContent = enhanceContentLocally(htmlContent);
      
      const styledHTML = createStyledHTML(htmlContent);
      
      onSubmit(styledHTML);
      
    } catch (error) {
      console.error("Error processing Word document:", error);
      alert("Failed to process Word document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="flex-1">
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/5 transition-all">
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                <span className="text-sm text-gray-300">Processing...</span>
              </div>
            ) : (
              <>
                <FileText className="w-10 h-10 text-blue-400 mb-2" />
                <span className="text-sm text-gray-300 font-medium">Upload Word Document</span>
                <span className="text-xs text-gray-400 mt-1">(.docx or .doc)</span>
                {fileName && <span className="text-xs text-green-400 mt-2">{fileName}</span>}
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
          className="w-4 h-4 text-blue-600 rounded"
        />
        <label htmlFor="useAI" className="text-gray-300 flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          Enhance with AI (requires API key)
        </label>
      </div>

      <div className="text-xs text-gray-400 bg-black/20 p-3 rounded border border-gray-600">
        <strong className="text-gray-300">Note:</strong> Your Word document will be automatically converted to beautiful HTML with inline CSS styling. 
        {useAI && " AI enhancement requires a free Hugging Face API token."}
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

  useEffect(() => {
    setLineStyles(generateLineStyles());
    setParticleStyles(generateParticleStyles());
  }, []);

  const handleWordDocSubmit = (styledHTML) => {
    try {
      setFormData((prev) => ({ ...prev, content: styledHTML }));
      setMessage("✓ Word document converted and styled successfully!");
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
      tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean),
    }));
  };

const handleSubmit = async () => {
  if (!formData.content) {
    setMessage("✗ Please upload a Word document first");
    return;
  }

  setLoading(true);
  try {
    const response = await PortfolioApiService.Upload_blog(formData)

    if (!response.ok) {
      const errorData = await response;
      throw new Error(errorData.message || "Failed to upload blog post");
    }

    const result = await response;
    console.log("Blog created:", result);

    setMessage(`✓ Blog post "${result.title}" created successfully!`);
  } catch (err) {
    console.error("Error submitting blog:", err);
    setMessage(`✗ ${err.message}`);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-400 rounded-lg space-y-6">
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Upload & Auto-Style Your Content
        </h3>
        <WordDocProcessor onSubmit={handleWordDocSubmit} />
        {message && (
          <p className={`mt-3 text-sm font-medium ${message.includes("✗") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-100 via-gray-400 to-gray-700 p-4 rounded-2xl space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Enter Blog Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full text-purple-700 px-4 py-3 border border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1em] font-semibold"
          />
          <input
            type="text"
            name="slug"
            placeholder='Enter a Url Friendly Slug (e.g., my-blog-post)'
            value={formData.slug}
            onChange={handleChange}
            className="w-full text-purple-700 px-4 py-3 border border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1em] font-semibold"
          />
          <input
            type="text"
            name="excerpt"
            placeholder="Give a 5-10 words short Brief"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full text-purple-700 px-4 py-3 border border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1em] font-semibold"
          />
          <input
            type="text"
            placeholder="Tags/Tech Described (comma-separated)"
            onChange={handleTagsChange}
            className="w-full text-purple-700 px-4 py-3 border border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[1em] font-semibold"
          />
          <div className="justify-center items-center flex">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-white/20 backdrop-blur-2xl p-2 rounded-lg text-green-700 font-bold px-4 py-2 hover:bg-white/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Post"}
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="min-h-[500px] bg-gradient-to-br from-gray-900 via-black to-purple-900 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {lineStyles.map((item, i) => (
                <motion.div
                  key={`line-${i}`}
                  className="absolute bg-gradient-to-r from-transparent via-purple-400/20 to-transparent h-px"
                  style={item.style}
                  animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 0] }}
                  transition={item.transition}
                />
              ))}
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {particleStyles.map((item, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                  style={item.style}
                  animate={{ y: [-20, -100], opacity: [0, 1, 0] }}
                  transition={item.transition}
                />
              ))}
            </div>

            <div className="relative z-10 p-4 max-h-[700px] overflow-y-auto">
              <div className="bg-white/5 rounded-lg backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden">
                <div className="p-3 sm:p-4">
                  {formData.title || formData.content ? (
                    <article style={{ zoom: "0.8" }}>
                      {formData.title && (
                        <header className="mb-4">
                          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white leading-tight">
                            {formData.title}
                          </h1>

                          <div className="flex flex-wrap items-center text-green-400 mb-3 gap-3 text-sm">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                {new Date(formData.date).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{formData.readTime}</span>
                            </div>
                          </div>

                          {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {formData.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 sm:px-3 py-1 bg-white/5 text-amber-400 text-xs sm:text-sm rounded-full border border-amber-400/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </header>
                      )}

                      {formData.content ? (
                        <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                      ) : (
                        <p className="text-gray-400 text-sm">Preview will appear here...</p>
                      )}
                    </article>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <FileText className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-sm">Upload a Word document to see preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}