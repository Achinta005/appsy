"use client";
import React, { useState, useEffect } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

// LinkPreview component
const LinkPreview = ({ url, className, children }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
};

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [breakpoint]);

  return isMobile;
};

export const AnimatedTestimonials = ({ testimonials, autoplay = false }) => {
  const [active, setActive] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
    setShowFullDescription(false);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setShowFullDescription(false);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  useEffect(() => {
    setShowFullDescription(false);
  }, [active]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  const currentTestimonial = testimonials[active];

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center w-full max-w-6xl">
        {/* Image Container */}
        <div className="flex items-center justify-center order-1 lg:order-1">
          <div className="relative h-48 w-full max-w-sm sm:h-56 sm:max-w-md lg:h-64 lg:max-w-lg">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -40, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    draggable={false}
                    className="h-full w-full rounded-xl object-cover object-center shadow-xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex flex-col justify-center order-2 lg:order-2 space-y-4 lg:space-y-5">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="space-y-3 lg:space-y-4"
          >
            {/* Project Title */}
            <div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                {currentTestimonial.name}
              </h3>
              <p className="text-xs sm:text-sm text-green-400 mt-1 font-medium">
                {currentTestimonial.designation}
              </p>
            </div>

            {/* Project Description */}
            <motion.div className="text-sm sm:text-base text-gray-300 leading-relaxed">
              <div
                className={`transition-all duration-300 ${
                  showFullDescription
                    ? "max-h-none"
                    : "max-h-24 overflow-hidden"
                }`}
              >
                {currentTestimonial.quote.split(" ").map((word, index) => {
                  const shouldShow = showFullDescription || index < 30;
                  return shouldShow ? (
                    <motion.span
                      key={index}
                      initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        delay: showFullDescription ? 0 : 0.01 * index,
                      }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ) : null;
                })}
              </div>

              {/* ML Buttons - Only show when description is expanded */}
              {showFullDescription && currentTestimonial.showAllButtons && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-purple-400/30"
                >
                  {currentTestimonial.accuracy && (
                    <a
                      className="flex items-center text-amber-400 transition-colors group"
                    >
                      <div className="w-4 h-4 flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                        <span className="text-sm">📊</span>
                      </div>
                      <span className="text-sm font-medium">Accuracy :&nbsp;</span>
                      <span> {currentTestimonial.accuracy} %</span>
                    </a>
                  )}

                  {currentTestimonial.features && (
                    <a
                      className="flex items-center text-amber-400 transition-colors group"
                    >
                      <div className="w-4 h-4 flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                        <span className="text-sm">⚡</span>
                      </div>
                      <span className="text-sm font-medium">No of Features :&nbsp;</span>
                      <span> {currentTestimonial.features}</span>
                    </a>
                  )}
                </motion.div>
              )}

              {currentTestimonial.quote.split(" ").length > 30 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 underline decoration-dotted underline-offset-2 cursor-pointer"
                >
                  {showFullDescription ? "See less" : "See more"}
                </button>
              )}
            </motion.div>

            {/* Project Links - Live Demo and View Code */}
            <div className="flex flex-row flex-wrap gap-4 pt-2">
              {currentTestimonial.liveUrl && (
                <LinkPreview
                  url={currentTestimonial.liveUrl}
                  className="font-bold"
                >
                  <div className="flex items-center font-semibold text-green-500 hover:text-blue-400 transition-colors cursor-pointer group">
                    <div className="w-4 h-4 flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                      <span className="text-sm">🔗</span>
                    </div>
                    <span className="text-sm">Live Demo</span>
                  </div>
                </LinkPreview>
              )}

              {currentTestimonial.githubUrl && (
                <a
                  href={currentTestimonial.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-green-500 hover:text-blue-400 transition-colors cursor-pointer group"
                >
                  <div className="w-4 h-4 flex items-center justify-center mr-2 group-hover:scale-110 transition-transform">
                    <span className="text-sm">📁</span>
                  </div>
                  <span className="text-sm font-medium">View Code</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 pt-2 justify-between">
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="group/button flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <IconArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform duration-300 group-hover/button:-translate-x-0.5" />
              </button>

              <button
                onClick={handleNext}
                className="group/button flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <IconArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform duration-300 group-hover/button:translate-x-0.5" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive(index)
                      ? "bg-green-400 scale-125"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};