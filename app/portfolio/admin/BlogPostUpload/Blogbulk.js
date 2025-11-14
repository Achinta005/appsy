"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Tag, FileText, Upload, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

const generateLineStyles = () =>
  Array.from({ length: 10 }, () => ({
    style: {
      width: `${Math.random() * 150 + 50}px`,
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
  Array.from({ length: 8 }, () => ({
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: #e5e7eb;
    font-size: 14px;
  `;

  const elementStyles = {
    h1: 'font-size: 1.75em; font-weight: 700; color: #ffffff; margin: 1em 0 0.5em 0; line-height: 1.2;',
    h2: 'font-size: 1.5em; font-weight: 600; color: #60a5fa; margin: 1em 0 0.5em 0; line-height: 1.3; border-bottom: 2px solid rgba(96, 165, 250, 0.3); padding-bottom: 0.3em;',
    h3: 'font-size: 1.25em; font-weight: 600; color: #7dd3fc; margin: 0.75em 0 0.4em 0; line-height: 1.4;',
    h4: 'font-size: 1.1em; font-weight: 600; color: #93c5fd; margin: 0.75em 0 0.4em 0;',
    p: 'margin: 0.75em 0; color: #d1d5db; font-size: 1em;',
    ul: 'margin: 0.75em 0; padding-left: 1.5em; color: #d1d5db;',
    ol: 'margin: 0.75em 0; padding-left: 1.5em; color: #d1d5db;',
    li: 'margin: 0.4em 0; line-height: 1.5;',
    a: 'color: #60a5fa; text-decoration: underline; word-break: break-word;',
    strong: 'font-weight: 700; color: #ffffff;',
    em: 'font-style: italic; color: #a5b4fc;',
    code: 'background-color: rgba(0, 0, 0, 0.3); color: #4ade80; padding: 0.15em 0.3em; border-radius: 0.2em; font-family: monospace; font-size: 0.85em;',
    pre: 'background-color: rgba(0, 0, 0, 0.4); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 0.4em; padding: 0.75em; overflow-x: auto; margin: 1em 0; font-size: 0.85em;',
    blockquote: 'border-left: 3px solid #8b5cf6; padding-left: 0.75em; margin: 1em 0; color: #c4b5fd; font-style: italic; background-color: rgba(139, 92, 246, 0.05); padding: 0.75em;'
  };

  let styledContent = content;
  
  Object.entries(elementStyles).forEach(([tag, style]) => {
    const regex = new RegExp(`<${tag}([^>]*)>`, 'g');
    styledContent = styledContent.replace(regex, `<${tag} style="${style}"$1>`);
  });

  return `<div style="${baseStyles}">${styledContent}</div>`;
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
      // Simulate document processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockContent = `
        <h2>Sample Document Content</h2>
        <p>This is a demonstration of how your Word document would be processed and styled.</p>
        <h3>Key Features</h3>
        <ul>
          <li>Automatic HTML conversion</li>
          <li>Beautiful inline styling</li>
          <li>Mobile-optimized display</li>
        </ul>
        <p>Your actual document content will appear here with proper formatting preserved.</p>
      `;
      
      const htmlContent = enhanceContentLocally(mockContent);
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
    <div className="space-y-3">
      <label className="block">
        <div className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/5 transition-all active:scale-98">
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <span className="text-xs text-gray-300">Processing...</span>
            </div>
          ) : (
            <>
              <FileText className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-xs text-gray-300 font-medium text-center px-4">Upload Word Document</span>
              <span className="text-xs text-gray-400 mt-1">(.docx or .doc)</span>
              {fileName && <span className="text-xs text-green-400 mt-2 px-2 text-center break-all">{fileName}</span>}
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

      <div className="text-xs text-gray-400 bg-black/20 p-3 rounded border border-gray-600">
        <strong className="text-gray-300">Note:</strong> Your Word document will be automatically converted to beautiful HTML with inline CSS styling.
      </div>
    </div>
  );
}

export default function BlogUpload() {
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
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setLineStyles(generateLineStyles());
    setParticleStyles(generateParticleStyles());
  }, []);

  const handleWordDocSubmit = (styledHTML) => {
    try {
      setFormData((prev) => ({ ...prev, content: styledHTML }));
      setMessage("✓ Word document converted successfully!");
      setShowPreview(true);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage(`✓ Blog post "${formData.title || 'Untitled'}" created successfully!`);
      
      // Reset form after 3 seconds
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
        setShowPreview(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting blog:", err);
      setMessage(`✗ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-white mb-2">Blog Upload</h1>
          <p className="text-sm text-gray-300">Create and publish your content</p>
        </div>

        {/* Upload Section */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-700">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Upload Document
          </h3>
          <WordDocProcessor onSubmit={handleWordDocSubmit} />
          {message && (
            <p className={`mt-3 text-xs font-medium ${message.includes("✗") ? "text-red-400" : "text-green-400"}`}>
              {message}
            </p>
          )}
        </div>

        {/* Form Section */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-700 space-y-3">
          <h3 className="text-base font-bold text-white mb-3">Post Details</h3>
          
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm placeholder-gray-400"
          />
          
          <input
            type="text"
            name="slug"
            placeholder="URL Slug (e.g., my-blog-post)"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm placeholder-gray-400"
          />
          
          <textarea
            name="excerpt"
            placeholder="Brief excerpt (5-10 words)"
            value={formData.excerpt}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm placeholder-gray-400 resize-none"
          />
          
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            onChange={handleTagsChange}
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white text-sm placeholder-gray-400"
          />
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {loading ? "Submitting..." : "Submit Post"}
          </button>
        </div>

        {/* Preview Section */}
        {formData.content && (
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full px-4 py-3 flex items-center justify-between text-white font-semibold hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Preview
              </span>
              {showPreview ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {showPreview && (
              <div className="relative min-h-[300px] bg-gradient-to-br from-gray-900 via-black to-purple-900">
                {/* Animated Background */}
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

                {/* Content */}
                <div className="relative z-10 p-4 max-h-[500px] overflow-y-auto">
                  <div className="bg-white/5 rounded-lg backdrop-blur-xl border border-purple-500/20 shadow-2xl overflow-hidden">
                    <div className="p-3">
                      <article>
                        {formData.title && (
                          <header className="mb-3">
                            <h1 className="text-xl font-bold mb-2 text-white leading-tight break-words">
                              {formData.title}
                            </h1>

                            <div className="flex flex-wrap items-center text-green-400 mb-2 gap-2 text-xs">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>
                                  {new Date(formData.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{formData.readTime}</span>
                              </div>
                            </div>

                            {formData.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {formData.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-0.5 bg-white/5 text-amber-400 text-xs rounded-full border border-amber-400/20"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </header>
                        )}

                        <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}