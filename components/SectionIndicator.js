"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SectionIndicators = ({ activeSection, onSectionChange }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sections = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
    { id: "certifications", label: "Certifications" },
  ];

  if (isMobile) {
    return null;
  }

  return (
    <div className="fixed right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-3 sm:space-y-4">
      {sections.map((section, index) => (
        <div key={section.id} className="relative group">
          <div className="absolute right-6 sm:right-8 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none backdrop-blur-sm border border-white/10">
            {section.label}
            <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/80 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
          </div>
          
          <button
            onClick={() => onSectionChange(section.id)}
            className="relative w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white/40 hover:border-white/80 transition-all duration-300 hover:scale-110"
          >
            <motion.div
              initial={false}
              animate={{
                scale: activeSection === section.id ? 1 : 0,
                opacity: activeSection === section.id ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"
            />
            
            {activeSection === section.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-sm scale-150"
              />
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SectionIndicators;