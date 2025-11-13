"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Contact, View } from "lucide-react";
import PdfModal from "./PdfModal";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const requestAccessToken = async (user_id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/auth/check-access`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("admin_token", data.token);
        console.log("Access granted and token stored!");
      } else {
        console.log("Access denied");
        localStorage.removeItem("admin_token");
      }
    } catch (err) {
      console.error("Access request failed:", err);
    }
  };

  useEffect(() => {
    setIsLoaded(true);
    requestAccessToken();
  }, []);

  useEffect(() => {
    const loadVanta = async () => {
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
          scaleMobile: 0.8,
          backgroundColor: 0x000000,
          color: 0x0077ff,
          points: 15.0,
          maxDistance: 8.0,
          spacing: 18.0,
        });
      }
    };

    loadVanta();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  const handleView = async () => {
    setPdfUrl(
      "https://drive.google.com/file/d/1p7NKQpOci-ZVZAb6lwZF93nc5KmkRAw4/view?usp=sharing"
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfUrl(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={vantaRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:-top-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          <motion.div
            className="lg:col-span-7 space-y-6 lg:space-y-8 order-2 lg:order-1"
            variants={itemVariants}
          >
            <div className="relative p-4 sm:p-6 lg:p-8 rounded-lg lg:rounded-3xl border border-white/10 lg:border-none shadow-lg backdrop-blur-md lg:backdrop-blur-none lg:bg-transparent">
              <motion.div
                className="hidden lg:block text-emerald-400 mb-4 font-medium tracking-wide text-sm uppercase"
                variants={itemVariants}
              >
                👋 Welcome to my Page
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl lg:text-6xl font-bold lg:font-black mb-4 lg:mb-6 leading-tight text-white"
                variants={mobileItemVariants}
                initial="hidden"
                animate="visible"
              >
                <span className="block text-base sm:text-lg lg:text-3xl lg:mb-2">
                  Hi, I&apos;m
                </span>
                <span className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Achinta Hazra
                </span>
              </motion.h1>

              <motion.h2
                className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 lg:mb-8 font-semibold"
                variants={mobileItemVariants}
              >
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Developer & Learner
                </span>
              </motion.h2>

              <motion.div
                className="hidden lg:flex flex-col xl:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.button
                  onClick={handleView}
                  className="px-6 xl:px-8 py-3 xl:py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 text-sm xl:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <View />
                    View My Resume
                  </span>
                </motion.button>

                <Link
                  href="/contact"
                  className="px-6 xl:px-8 py-3 xl:py-4 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-200 text-center text-sm xl:text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Contact />
                    Get In Touch
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2"
            variants={itemVariants}
          >
            <div className="hidden lg:block w-80 h-80 relative bg-gradient-to-br from-slate-800/30 to-slate-900/20 backdrop-blur-md rounded-full border border-slate-700/50 shadow-2xl profile-glow-container p-1">
              <motion.div
                className="w-full h-full rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 p-1"
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  className="w-full h-full rounded-full overflow-hidden bg-black"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755695343/profile_kxt3ue.png"
                    alt="Achinta Hazra"
                    className="w-full h-full object-cover"
                    width={320}
                    height={320}
                    priority
                    sizes="320px"
                  />
                </motion.div>
              </motion.div>
            </div>

            <div className="lg:hidden w-48 sm:w-52 h-48 sm:h-52 relative">
              <Image
                src="https://res.cloudinary.com/dc1fkirb4/image/upload/v1755695343/profile_kxt3ue.png"
                alt="Achinta Hazra"
                className="w-full h-full rounded-full object-cover shadow-2xl"
                width={320}
                height={320}
                priority
              />
              <div className="absolute -bottom-0 -right-0 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg flex items-center justify-center text-xl sm:text-2xl">
                <i className="ri-code-s-slash-line" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:hidden flex flex-col sm:flex-row gap-3 w-full order-3 px-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.button
              onClick={handleView}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <View className="w-4 h-4" />
                View Resume
              </span>
            </motion.button>

            <Link
              href="/contact"
              className="flex-1 px-4 py-3 border-2 border-emerald-500/50 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500/10 hover:border-emerald-400 transition-all duration-200 text-center text-sm flex items-center justify-center"
            >
              <span className="flex items-center justify-center gap-2">
                <Contact className="w-4 h-4" />
                Get In Touch
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
      {isModalOpen && <PdfModal pdfUrl={pdfUrl} onClose={closeModal} />}
    </section>
  );
}
