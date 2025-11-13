"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

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

export default function BlogPost({ post }) {
  const [lineStyles, setLineStyles] = useState([]);
  const [particleStyles, setParticleStyles] = useState([]);

  useEffect(() => {
    setLineStyles(generateLineStyles());
    setParticleStyles(generateParticleStyles());
  }, []);

  if (!post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="hidden lg:block absolute inset-0 overflow-hidden">
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

      <div className="hidden lg:block absolute inset-0">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10">
        <Link
          href="/portfolio/blog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm sm:text-base">Back to Blog</span>
        </Link>

        <article className="bg-white/5 rounded-lg lg:rounded-2xl backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center text-green-400 mb-4 gap-2 sm:gap-0">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center sm:ml-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">{post.readTime}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 sm:px-3 py-1 bg-white/5 text-amber-400 text-xs sm:text-sm rounded-full border border-amber-400/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:text-white prose-p:text-gray-200 prose-a:text-blue-400 prose-strong:text-white prose-code:text-green-400 prose-pre:bg-black/30 prose-pre:border prose-pre:border-purple-500/20">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </article>

        <div className="mt-8 sm:mt-12 bg-white/5 rounded-lg lg:rounded-2xl backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-500/10">
          <div className="p-4 sm:p-6 flex justify-end">
            <Link
              href="/blog"
              className="bg-white/5 border border-purple-500/30 hover:border-purple-400 text-orange-400 hover:text-orange-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base font-medium"
            >
              View All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}