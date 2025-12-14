"use client";

import { useEffect } from "react";

export default function DeepLinkHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ Only exists on native (Android / iOS)
    const capacitor = window.Capacitor;
    if (!capacitor || !capacitor.isNativePlatform?.()) return;

    const AppPlugin = capacitor.Plugins?.App;
    if (!AppPlugin) return;

    const listener = AppPlugin.addListener("appUrlOpen", ({ url }) => {
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

    return () => {
      listener?.remove?.();
    };
  }, []);

  return null;
}
