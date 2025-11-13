"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Navbar";
import AboutHero from "./AboutHero";
import EducationSection from "./EducationSection";
import CertificationSection from "./CertificationSection";
import InteractiveSkillsDisplay from "./InteractiveSkillsDisplay";
import DecorativeNavbar from "@/components/DecorativeNavbar";
import SectionIndicators from "../../../components/SectionIndicator";

export default function About({ skillsData, educationData, certificateData }) {
  const [activeSection, setActiveSection] = useState("about");

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      const sections = ["about", "skills", "education", "certifications"];
      const currentIndex = sections.indexOf(activeSection);

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          setActiveSection(sections[(currentIndex + 1) % sections.length]);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          setActiveSection(
            sections[(currentIndex - 1 + sections.length) % sections.length]
          );
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeSection]);

  return (
    <>
      <Header />
      <DecorativeNavbar
        onSectionChange={handleSectionChange}
        activeSection={activeSection}
      />
      <SectionIndicators
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <AnimatePresence mode="wait">
          {activeSection === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="min-h-screen"
            >
              <AboutHero />
            </motion.div>
          )}

          {activeSection === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="min-h-screen"
            >
              <InteractiveSkillsDisplay skillsData={skillsData} />
            </motion.div>
          )}

          {activeSection === "education" && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="min-h-screen"
            >
              <EducationSection educationData={educationData} />
            </motion.div>
          )}

          {activeSection === "certifications" && (
            <motion.div
              key="certifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="min-h-screen"
            >
              <CertificationSection certificateData={certificateData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}