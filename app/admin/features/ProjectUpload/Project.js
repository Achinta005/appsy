"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const Project = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [buttonText, setButtonText] = useState("UPLOAD");
  const [theme, setTheme] = useState("light");

  // Initialize and listen for theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);

    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const onSubmit = async (data) => {
    setButtonText("Uploading...");
    const formData = new FormData();

    formData.append("category", data.category);
    formData.append("title", data.title);
    formData.append("technologies", data.technologies || "");
    formData.append("image", data.image[0]);
    formData.append("liveUrl", data.liveUrl || "");
    formData.append("githubUrl", data.githubUrl || "");
    formData.append("order", data.order || "");
    formData.append("description", data.description || "");

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      reset();
      setButtonText("Uploaded Successfully");
      setTimeout(() => setButtonText("UPLOAD"), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setButtonText("UPLOAD");
    }
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-blue-50 via-purple-50 to-pink-50";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const textLabel = isDark ? "text-slate-300" : "text-gray-700";
  const cardBg = isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-purple-200";
  const inputBg = isDark ? "bg-slate-900/50 border-slate-600/50" : "bg-white border-purple-300";
  const inputFocus = isDark ? "focus:border-purple-500 focus:ring-purple-500/50" : "focus:border-purple-400 focus:ring-purple-400/50";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark ? "placeholder-slate-500" : "placeholder-gray-400";
  const selectBg = isDark ? "bg-slate-800" : "bg-white";
  const buttonPrimary = isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600";
  const errorText = isDark ? "text-red-400" : "text-red-500";
  const fileButtonBg = isDark ? "file:bg-purple-600 hover:file:bg-purple-700" : "file:bg-purple-500 hover:file:bg-purple-600";

  return (
    <section className={`min-h-screen py-4 px-4 sm:py-6 md:py-8 bg-gradient-to-br ${bgGradient} transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto">
        <div className={`${cardBg} backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 border transition-colors`}>
          <h1 className={`text-3xl font-bold ${textPrimary} text-center mb-8 tracking-tight`}>
            Enter Project Details
          </h1>

          <div>
            {/* Title */}
            <div className="mb-5">
              <label className={`block ${textLabel} font-medium mb-2 text-sm`}>
                Project Title *
              </label>
              <input
                type="text"
                className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className={`${errorText} text-xs mt-1.5`}>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Technologies */}
            <div className="mb-5">
              <label className={`block ${textLabel} font-medium mb-2 text-sm`}>
                Technologies
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js"
                className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                {...register("technologies")}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-5">
              <label className={`block ${textLabel} font-medium mb-2 text-sm`}>
                Project Image *
              </label>
              <input
                type="file"
                accept="image/*"
                className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${textSecondary} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 ${fileButtonBg} file:text-white file:text-sm file:font-medium file:cursor-pointer focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                {...register("image", { required: "Image is required" })}
              />
              {errors.image && (
                <p className={`${errorText} text-xs mt-1.5`}>
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className={`block ${textLabel} font-medium mb-2 text-sm`}>
                Category *
              </label>
              <select
                className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} focus:outline-none ${inputFocus} focus:ring-1 transition-all cursor-pointer`}
                {...register("category", { required: "Category is required" })}
              >
                <option value="" className={selectBg}>
                  Select Category
                </option>
                <option value="Web Development" className={selectBg}>
                  Web Development
                </option>
                <option value="Machine Learning" className={selectBg}>
                  Machine Learning
                </option>
                <option value="Data Science" className={selectBg}>
                  Data Science
                </option>
                <option value="Mobile App" className={selectBg}>
                  Mobile App
                </option>
                <option value="Other" className={selectBg}>
                  Other
                </option>
              </select>
              {errors.category && (
                <p className={`${errorText} text-xs mt-1.5`}>
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Live URL */}
            <div className="mb-5">
              <label className={`block ${textLabel} font-medium mb-2 text-sm`}>
                Live URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                {...register("liveUrl")}
              />
            </div>

            {/* GitHub URL */}
            <div className="mb-5">
              <label className={`block ${textLabel} font-medium mb-2 text-sm`}>
                GitHub URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/repo"
                className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                {...register("githubUrl")}
              />
            </div>

            {/* Order */}
            <div className="mb-5">
              <label className={`block ${textLabel} font-medium mb-2 text-sm`}>
                Display Order
              </label>
              <input
                type="number"
                min="1"
                placeholder="1"
                className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                {...register("order")}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className={`block ${textLabel} font-medium mb-2 text-sm`}>
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe your project..."
                className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all resize-none`}
                {...register("description")}
              />
            </div>

            {/* Submit */}
            <button
              disabled={isSubmitting}
              type="button"
              onClick={handleSubmit(onSubmit)}
              className={`w-full ${buttonPrimary} text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Project;