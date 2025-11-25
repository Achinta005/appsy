"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PortfolioApiService } from "@/services/PortfolioApiService";

const Project = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [buttonText, setButtonText] = useState("SUBMIT");

  const onSubmit = async (data) => {
    setButtonText("Submitting...");
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
      await PortfolioApiService.UplaodProject(formData);
      reset();
      setButtonText("Submitted Successfully");
      setTimeout(() => setButtonText("SUBMIT"), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setButtonText("SUBMIT");
    }
  };

  return (
    <section className="min-h-screen py-8 px-4 sm:py-12 md:py-20">
      <div className="max-w-5xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-200"
        >
          <h1 className="text-3xl font-bold text-green-500 text-center mb-6">
            Enter Project Details
          </h1>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-purple-600 font-medium mb-2">
              Project Title *
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded text-pink-600 border-blue-800"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-700 text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* Technologies */}
          <div className="mb-4">
            <label className="block text-purple-600 font-medium mb-2">
              Technologies
            </label>
            <input
              type="text"
              placeholder="e.g. React, Node.js"
              className="w-full border px-3 py-2 rounded text-pink-600 border-blue-800"
              {...register("technologies")}
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-purple-600 font-medium mb-2">
              Project Image *
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border px-3 py-2 rounded text-pink-600 border-blue-800"
              {...register("image", { required: "Image is required" })}
            />
            {errors.image && (
              <p className="text-red-700 text-xs">{errors.image.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-purple-600 font-medium mb-2">
              Category *
            </label>
            <select
              className="w-full border px-3 py-2 rounded text-pink-600 border-blue-800"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select Category</option>
              <option value="Web Development">Web Development</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="text-red-700 text-xs">{errors.category.message}</p>
            )}
          </div>

          {/* Live URL */}
          <div className="mb-4">
            <label className="block text-purple-600 font-medium mb-2">
              Live URL
            </label>
            <input
              type="url"
              className="w-full border px-3 py-2 rounded text-pink-600 border-blue-800"
              {...register("liveUrl")}
            />
          </div>

          {/* GitHub URL */}
          <div className="mb-4">
            <label className="block text-purple-600 font-medium mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              className="w-full border px-3 py-2 rounded text-pink-600 border-blue-800"
              {...register("githubUrl")}
            />
          </div>

          {/* Order */}
          <div className="mb-4">
            <label className="block text-purple-600 font-medium mb-2">
              Display Order
            </label>
            <input
              type="number"
              min="1"
              className="w-full border px-3 py-2 rounded text-pink-600 border-blue-800"
              {...register("order")}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-purple-600 font-medium mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full border px-3 py-2 rounded text-pink-600 border-blue-800"
              {...register("description")}
            />
          </div>

          {/* Submit */}
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded font-semibold shadow-md"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Project;
