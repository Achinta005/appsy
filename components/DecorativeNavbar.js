"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DecorativeNavbar = ({ onSectionChange, activeSection = "about" }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { id: "about", label: "About", shortLabel: "About" },
    { id: "skills", label: "Skills", shortLabel: "Skills" },
    { id: "education", label: "Education", shortLabel: "Edu" },
    { id: "certifications", label: "Certifications", shortLabel: "Cert" },
  ];

  const handleNavClick = (sectionId) => {
    
    if (onSectionChange) {
      onSectionChange(sectionId);
    } else {
      console.warn('onSectionChange prop is missing');
    }
  };

  return (
    <nav className={`fixed top-2 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xs sm:max-w-md md:max-w-lg px-2 sm:px-0`}>
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl px-3 sm:px-6 md:px-8 py-2 sm:py-3 shadow-2xl">
        <div className="flex items-center justify-between sm:justify-center sm:space-x-4 md:space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="relative group px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-white/80 hover:text-white transition-colors duration-300 font-medium text-xs sm:text-sm flex-1 sm:flex-none text-center"
            >
              <span className="relative z-10">
                {isMobile ? item.shortLabel : item.label}
              </span>
              
              <div className="absolute inset-0 bg-white/5 rounded-md sm:rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: activeSection === item.id ? 1 : 0,
                  opacity: activeSection === item.id ? 1 : 0
                }}
                whileHover={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute -bottom-0.5 sm:-bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full origin-left"
              />
              
              {activeSection === item.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-0.5 sm:-bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-sm"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DecorativeNavbar;