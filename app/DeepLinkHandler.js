"use client";

import { useEffect } from "react";

export default function DeepLinkHandler() {
  useEffect(() => {
    // 🚫 Do nothing on web
    if (typeof window === "undefined") return;

    // Capacitor injects this only on native platforms
    const isCapacitor =
      window.Capacitor &&
      window.Capacitor.isNativePlatform &&
      window.Capacitor.isNativePlatform();

    if (!isCapacitor) return;

    // ✅ Dynamically import ONLY on mobile
    import("@capacitor/app").then(({ App }) => {
      App.addListener("appUrlOpen", ({ url }) => {
        console.log("Deep link received:", url);

        if (!url) return;

        try {
          const parsedUrl = new URL(url);
          const token = parsedUrl.searchParams.get("token");

          if (token && token.split(".").length === 3) {
            localStorage.setItem("auth_token", token);
          }
        } catch (err) {
          console.error("Invalid deep link URL", err);
        }
      });
    });
  }, []);

  return null;
}
