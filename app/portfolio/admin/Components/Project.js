"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const Project = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [ButtonText, setButtonText] = useState("SUBMIT");

  const onSubmit = async (data) => {
    setButtonText("Submitting...");
    console.log(data);
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("title", data.title);
    formData.append("technologies", data.technologies);
    formData.append("image", data.image[0]);
    formData.append("liveUrl", data.liveUrl);
    formData.append("githubUrl", data.githubUrl);
    formData.append("order", data.order);
    formData.append("description", data.description);

    try {
      const result = await PortfolioApiService.UplaodProject(formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      reset();
      setButtonText("Submitted Successfully");
      setTimeout(() => {
        setButtonText("SUBMIT");
      }, 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setButtonText("SUBMIT");
    }
  };

  return (
    <section className="min-h-screen py-8 px-4 sm:py-12 md:py-20 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-200">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-500 text-center">
              Enter Project Details
            </h1>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Project Title, Technologies, Image - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-2 text-purple-600"
                >
                  Project Title
                </label>
                <input
                  placeholder="Project Title"
                  {...register("title", {
                    required: { value: true, message: "This field is required" },
                  })}
                  type="text"
                  className="w-full text-pink-600 px-3 sm:px-4 py-2 sm:py-3 border border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold"
                />
                {errors.title && (
                  <p className="text-red-700 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="technologies"
                  className="block text-sm font-medium text-purple-600 mb-2"
                >
                  Technologies
                </label>
                <input
                  placeholder="Enter Technology Used"
                  {...register("technologies", {})}
                  type="text"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-pink-600 border-blue-800"
                />
                {errors.technologies && (
                  <p className="text-red-700 text-xs mt-1">{errors.technologies.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-purple-600 mb-2"
                >
                  Image
                </label>
                <input
                  placeholder="Give Website Image"
                  {...register("image", {
                    required: { value: true, message: "This field is required" },
                  })}
                  type="file"
                  accept="image/*"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-pink-600 border-blue-800"
                />
                {errors.image && (
                  <p className="text-red-700 text-xs mt-1">{errors.image.message}</p>
                )}
              </div>
            </div>

            {/* Category, LiveURL, GitHubURL - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-purple-600 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  {...register("category", { required: true })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-pink-600 border-blue-800"
                >
                  <option value="">-- Select Category --</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                </select>
                {errors.category && (
                  <p className="text-red-700 text-xs mt-1">This field is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="liveUrl"
                  className="block text-sm font-medium text-purple-600 mb-2"
                >
                  Live URL
                </label>
                <input
                  placeholder="Live URL"
                  {...register("liveUrl")}
                  type="text"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-pink-600 border-blue-800"
                />
                {errors.liveUrl && (
                  <p className="text-red-700 text-xs mt-1">{errors.liveUrl.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="githubUrl"
                  className="block text-sm font-medium text-purple-600 mb-2"
                >
                  GitHub URL
                </label>
                <input
                  placeholder="GitHub URL"
                  {...register("githubUrl")}
                  type="text"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-pink-600 border-blue-800"
                />
                {errors.githubUrl && (
                  <p className="text-red-700 text-xs mt-1">{errors.githubUrl.message}</p>
                )}
              </div>
            </div>

            {/* Order and Description - Responsive Layout */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="w-full sm:w-1/4">
                <label
                  htmlFor="order"
                  className="block text-sm font-medium text-purple-600 mb-2"
                >
                  Order
                </label>
                <input
                  placeholder="Order"
                  {...register("order")}
                  type="number"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-pink-600 border-blue-800"
                />
                {errors.order && (
                  <p className="text-red-700 text-xs mt-1">{errors.order.message}</p>
                )}
              </div>

              <div className="w-full sm:w-3/4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-purple-600 mb-2"
                >
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your project..."
                  {...register("description")}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold text-pink-600 border-blue-800 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 sm:py-4 rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg"
            >
              {ButtonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Project;