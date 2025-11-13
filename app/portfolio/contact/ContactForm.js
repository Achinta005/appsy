"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { PortfolioApiService } from "@/services/PortfolioApiService";
import socialLinks from "./socialLink.json";

const ContactForm2 = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await PortfolioApiService.PostContactResponse(data);
      console.log(result.message);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          id="contact-form"
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">
                Full Name
              </label>
              <input
                placeholder="Your name"
                {...register("name", {
                  required: { value: true, message: "This field is required" },
                })}
                type="text"
                className="w-full text-gray-100 px-4 py-3 border border-purple-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
              />
              {errors.name && (
                <p className="text-red-700">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">
                Email Address
              </label>
              <input
                placeholder="your.email@example.com"
                {...register("email", {
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                type="text"
                className="w-full text-gray-100 px-4 py-3 border border-purple-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
              />
              {errors.email && (
                <p className="text-red-700">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800 mb-2">
              Subject
            </label>
            <input
              placeholder="What's this about?"
              {...register("subject")}
              type="text"
              className="w-full text-gray-100 px-4 py-3 border border-purple-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800 mb-2">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="What Do You Want To Tell Me..."
              {...register("message")}
              className="w-full text-gray-100 px-4 py-3 border border-purple-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-fit h-10 bg-white/10 text-green-700 px-6 py-2 rounded-lg hover:bg-white/20 disabled:bg-gray-400 transition-colors cursor-pointer font-bold"
            >
              {isSubmitting ? "Submitting..." : "SUBMIT"}
            </button>
          </div>
        </form>

        <div className="relative -top-10 mt-10">
          <h3 className="text-xl font-semibold text-yellow-100 mb-5">
            Follow Me
          </h3>
          <div className="flex space-x-4 mb-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                title={social.name}
              >
                <i
                  className={`${social.icon} text-xl text-green-600 hover:text-blue-600`}
                ></i>
              </a>
            ))}
          </div>

          <div className="p-6 bg-white/10 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Response Time
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              I typically respond to messages within 24 hours. For urgent
              matters, feel free to call me directly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm2;
