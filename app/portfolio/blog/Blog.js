"use client";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { motion, easeOut } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Navbar";

export default function BlogPage({ blogPostData }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState(1);
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (blogPostData && blogPostData.length > 0) {
      setLoading(false);
    } else {
      setError("No blog posts found.");
    }
  }, [blogPostData]);

  useEffect(() => {
    async function loadVanta() {
      if (!window.THREE) {
        await new Promise((resolve) => {
          const threeScript = document.createElement("script");
          threeScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
          threeScript.onload = resolve;
          document.body.appendChild(threeScript);
        });
      }

      if (!window.VANTA) {
        await new Promise((resolve) => {
          const vantaScript = document.createElement("script");
          vantaScript.src =
            "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
          vantaScript.onload = resolve;
          document.body.appendChild(vantaScript);
        });
      }

      if (!vantaEffect.current && window.VANTA && vantaRef.current) {
        vantaEffect.current = window.VANTA.NET({
          el: vantaRef.current,
          THREE: window.THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          backgroundColor: 0x0,
          points: 20.0,
          maxDistance: 10.0,
          spacing: 20.0,
        });
      }
    }

    loadVanta();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div ref={vantaRef} className="fixed inset-0 w-screen h-screen -z-10">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-yellow-100">Blog</h1>
          <p className="text-gray-300">Loading blog posts...</p>
        </div>
        <Header />
      </div>
    );
  }

  if (error) {
    return (
      <div
        ref={vantaRef}
        className="fixed inset-0 w-screen h-screen -z-10 mt-2.5"
      >
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-yellow-100">Blog</h1>
          <p className="text-red-400">{error}</p>
        </div>
        <Header />
      </div>
    );
  }

  return (
    <>
      <div ref={vantaRef} className="fixed inset-0 w-screen h-screen -z-10" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="min-h-screen mb-16">
          <div className="max-w-6xl mx-auto px-6 mt-4">
            <div className="mb-12 text-center">
              <motion.h1
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: easeOut }}
                className="text-3xl font-bold text-yellow-100 mb-2"
              >
                Blog
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -200 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: easeOut }}
                className="text-md text-gray-300"
              >
                Thoughts on web development, technology, and great UX.
              </motion.p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPostData
                .slice((view - 1) * 3, view * 3)
                .map((post, index) => (
                  <motion.div
                    key={`${post.slug}-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: easeOut }}
                    className="bg-white/10 border border-green-400 rounded-lg p-6"
                  >
                    <div className="flex items-center text-sm text-green-500 mb-3">
                      <Calendar className="w-4 h-4 mr-0.5" />
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <Clock className="w-4 h-4 ml-4 mr-0.5" />
                      <span>
                        {new Date(post.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-amber-400 mb-3">
                      {post.title}
                    </h2>
                    <p className="text-teal-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* <div className="flex flex-wrap gap-2 mb-4">
                      {JSON.parse(post.tags)
                        ?.slice(0, 3)
                        .map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/5 text-lime-400 text-xs font-semibold rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                    </div> */}

                    <Link
                      href={`/portfolio/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-500 hover:text-blue-300"
                    >
                      Read more <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </motion.div>
                ))}
            </div>

            {blogPostData.length > 3 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({
                  length: Math.ceil(blogPostData.length / 3),
                }).map((_, i) => (
                  <button
                    key={i + 1}
                    className={`px-3 py-2 rounded-md border ${
                      view === i + 1
                        ? "bg-fuchsia-500 text-white"
                        : "bg-white/10 text-green-300 hover:bg-purple-500/70"
                    }`}
                    onClick={() => setView(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <Header />
      </div>
    </>
  );
}
