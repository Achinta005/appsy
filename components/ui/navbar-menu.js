"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({ item, children, isOpen, onToggle }) => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left text-black dark:text-white font-medium"
      >
        <span>{item}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 bg-neutral-50 dark:bg-neutral-900/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Menu = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-black shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-black dark:text-white">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <X className="w-6 h-6 text-black dark:text-white" />
              </button>
            </div>
            <div className="py-2">{children}</div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export const ProductItem = ({ title, description, href, src }) => {
  return (
    <a href={href} className="flex gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
      <img
        src={src}
        width={80}
        height={80}
        alt={title}
        className="shrink-0 rounded-md shadow-lg object-cover w-20 h-20"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-600 text-xs dark:text-neutral-400 line-clamp-2">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({ children, href, ...rest }) => {
  return (
    <a
      href={href}
      {...rest}
      className="block py-3 px-4 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
    >
      {children}
    </a>
  );
};