'use client'
import React from "react";
import MLModelsHomepage from "./Homepage";
import Model_Header from "@/components/ml_model_navabar";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
          height: 100%;
        }

        #__next {
          overflow-x: hidden;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "calc(var(--vh, 1vh) * 100)",
          overflow: "hidden",
          backgroundColor: "black",
        }}
      >
        <Model_Header />
        <MLModelsHomepage />
      </div>
    </>
  );
}
