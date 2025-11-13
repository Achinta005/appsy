"use client";

import ContactHero from "./ContactHero";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import { useEffect, useRef } from "react";
import Header from "@/components/Navbar";

export default function Contact() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null); // ✅ changed from useState to useRef

  useEffect(() => {
    async function loadVanta() {
      // Load THREE.js
      if (!window.THREE) {
        await new Promise((resolve) => {
          const threeScript = document.createElement("script");
          threeScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
          threeScript.onload = resolve;
          document.body.appendChild(threeScript);
        });
      }

      // Load VANTA
      if (!window.VANTA) {
        await new Promise((resolve) => {
          const vantaScript = document.createElement("script");
          vantaScript.src =
            "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
          vantaScript.onload = resolve;
          document.body.appendChild(vantaScript);
        });
      }

      // Initialize effect once
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
          backgroundColor: 0x000000,
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

  return (
    <>
      <div
        ref={vantaRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          overflow: "hidden",
        }}
      />
      <div
        style={{ position: "relative", zIndex: 1 }}
        className="relative -top-8"
      >
        <div className="min-h-screen rounded-lg">
          <ContactHero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/5 rounded-lg lg:rounded-2xl backdrop-blur-xl h-full lg:h-full min-h-0 relative border border-purple-500/20 lg:border-purple-500/20 shadow-2xl shadow-purple-500/10 -top-10">
            {/* Decorative corner borders */}
            <div className="hidden lg:block absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-purple-400/50 rounded-tl-lg"></div>
            <div className="hidden lg:block absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-purple-400/50 rounded-tr-lg"></div>
            <div className="hidden lg:block absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/50 rounded-bl-lg"></div>
            <div className="hidden lg:block absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-purple-400/50 rounded-br-lg"></div>

            {/* Traffic light indicators */}
            <div className="flex items-center space-x-2 relative top-7">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
          <Header />
        </div>
      </div>
    </>
  );
}