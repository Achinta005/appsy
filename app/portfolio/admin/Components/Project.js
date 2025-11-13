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
      reset();
      setButtonText("Submitted Successfully");
      setTimeout(() => {
        setButtonText("SUBMIT");
      }, 3000);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  // {isSubmitting && <div>Loading...</div>}
  return (
    <section className="py-20 rounded-lg bg-[url(https://res.cloudinary.com/dc1fkirb4/image/upload/v1755754879/proj_hilka1.jpg)] bg-cover h-[140vh]">
      <div className="max-w-5xl mx-auto  px-4 sm:px-6 lg:px-8 border border-gray-200 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-110 bg-white/10 backdrop-blur-lg relative top-10">
        <form
          id="contact-form"
          className="space-y-6 mt-24"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="heading"
              className="block text-sm font-medium text-gray-700 mb-2 "
            ></label>
            <h1 className=" text-green-500 font-bold text-3xl relative top-[-60px] left-[350px]">
              Enter Project Details
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium  mb-2 text-purple-600"
              >
                Project Title
              </label>

              <input
                placeholder="Project Title"
                {...register("title", {
                  required: { value: true, message: "This field is required" },
                })}
                type="text"
                className="w-full text-pink-600 px-4 py-3 border  border-blue-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold border-b"
              />
              {errors.title && (
                <p className="text-red-700">{errors.title.message}</p>
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
                className="w-full  px-4 py-3 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold border-b text-pink-600 border-blue-800"
              />
              {errors.technologies && (
                <p className="text-red-700">{errors.technologies.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-purple-600 mb-2 "
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
                className="w-full  px-4 py-3 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold border-b text-pink-600 border-blue-800"
              />
              {errors.image && (
                <p className="text-red-700">{errors.image.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-purple-600 mb-2 "
              >
                Catagory
              </label>
              <select
                id="color"
                {...register("category", { required: true })}
                className="w-full  px-4 py-3 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold border-b text-pink-600 border-blue-800"
              >
                <option value="">-- Select Catagory --</option>
                <option value="Web Development">Web Development</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Data Science">Data Science</option>
              </select>
              {errors.liveUrl && (
                <p className="text-red-700">{errors.liveUrl.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-purple-600 mb-2 "
              >
                LiveURL
              </label>
              <input
                placeholder="liveUrl"
                {...register("liveUrl")}
                type="text"
                className="w-full  px-4 py-3 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold border-b text-pink-600 border-blue-800"
              />
              {errors.liveUrl && (
                <p className="text-red-700">{errors.liveUrl.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-purple-600 mb-2 "
              >
                GitHubURL
              </label>
              <input
                placeholder="githubUrl"
                {...register("githubUrl")}
                type="text"
                className="w-full  px-4 py-3 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold border-b text-pink-600 border-blue-800"
              />
              {errors.githubUrl && (
                <p className="text-red-700">{errors.githubUrl.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <div className="w-[20%]">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-purple-600 mb-2 "
              >
                ORDER
              </label>
              <input
                placeholder="ORDER"
                {...register("order")}
                type="number"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold border-b text-pink-600 border-blue-800"
              />
              {errors.order && (
                <p className="text-red-700">{errors.order.message}</p>
              )}
            </div>
            <div className="w-[80%]">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-purple-600 mb-2 "
              >
                Description
              </label>
              <textarea
                rows={6}
                placeholder="Tell me about your project..."
                {...register("description")}
                type="text"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-bold border-b text-pink-600 border-blue-800"
              />
              <p className="text-xs text-gray-500 mt-1"></p>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            value="submit"
            className="w-full h-10 bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 disabled:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap mb-5"
          >
            {ButtonText}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Project;
