"use client";
import { motion, easeOut } from "framer-motion";

export default function ProjectsHero() {
  return (
    <section className="relative -top-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <h1 className="text-3xl font-bold text-yellow-100 mb-2">
            My Projects
          </h1>
          <span></span>
        </motion.div>

        <motion.div
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -150 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <p className="text-md text-gray-200 max-w-3xl mx-auto dark:text-gray-300">
            A showcase of my recent work spanning web applications.Each project
            represents a unique challenge and solution.
          </p>
          <span></span>
        </motion.div>
      </div>
    </section>
  );
}
