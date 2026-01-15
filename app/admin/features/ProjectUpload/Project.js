"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useApi from "@/services/authservices";

const Project = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [buttonText, setButtonText] = useState("UPLOAD");
  const apiFetch = useApi();

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
      await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/project_upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      reset();
      setButtonText("Uploaded Successfully");
      setTimeout(() => setButtonText("UPLOAD"), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setButtonText("UPLOAD");
    }
  };

  return (
    <section className="min-h-screen py-4 px-4 sm:py-6 md:py-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-slate-700/50">
          <h1 className="text-3xl font-bold text-white text-center mb-8 tracking-tight">
            Enter Project Details
          </h1>

          <div>
            {/* Title */}
            <div className="mb-5">
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Project Title *
              </label>
              <input
                type="text"
                className="w-full bg-slate-900/50 border border-slate-600/50 px-4 py-2.5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Technologies */}
            <div className="mb-5">
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Technologies
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js"
                className="w-full bg-slate-900/50 border border-slate-600/50 px-4 py-2.5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                {...register("technologies")}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-5">
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Project Image *
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full bg-slate-900/50 border border-slate-600/50 px-4 py-2.5 rounded-lg text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:text-sm file:font-medium file:cursor-pointer hover:file:bg-blue-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                {...register("image", { required: "Image is required" })}
              />
              {errors.image && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Category *
              </label>
              <select
                className="w-full bg-slate-900/50 border border-slate-600/50 px-4 py-2.5 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                {...register("category", { required: "Category is required" })}
              >
                <option value="" className="bg-slate-800">
                  Select Category
                </option>
                <option value="Web Development" className="bg-slate-800">
                  Web Development
                </option>
                <option value="Machine Learning" className="bg-slate-800">
                  Machine Learning
                </option>
                <option value="Data Science" className="bg-slate-800">
                  Data Science
                </option>
                <option value="Mobile App" className="bg-slate-800">
                  Mobile App
                </option>
                <option value="Other" className="bg-slate-800">
                  Other
                </option>
              </select>
              {errors.category && (
                <p className="text-red-400 text-xs mt-1.5">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Live URL */}
            <div className="mb-5">
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Live URL
              </label>
              <input
                type="url"
                className="w-full bg-slate-900/50 border border-slate-600/50 px-4 py-2.5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                {...register("liveUrl")}
              />
            </div>

            {/* GitHub URL */}
            <div className="mb-5">
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                GitHub URL
              </label>
              <input
                type="url"
                className="w-full bg-slate-900/50 border border-slate-600/50 px-4 py-2.5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                {...register("githubUrl")}
              />
            </div>

            {/* Order */}
            <div className="mb-5">
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                className="w-full bg-slate-900/50 border border-slate-600/50 px-4 py-2.5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                {...register("order")}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-slate-300 font-medium mb-2 text-sm">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full bg-slate-900/50 border border-slate-600/50 px-4 py-2.5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                {...register("description")}
              />
            </div>

            {/* Submit */}
            <button
              disabled={isSubmitting}
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
