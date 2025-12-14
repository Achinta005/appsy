"use client";

import { useEffect } from "react";

export default function DeepLinkHandler() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cap = window.Capacitor;
    if (!cap || !cap.isNativePlatform?.()) return;

    const AppPlugin = cap.Plugins?.App;
    if (!AppPlugin) return;

    const listener = AppPlugin.addListener("appUrlOpen", ({ url }) => {
      try {
        const parsedUrl = new URL(url);
        const token = parsedUrl.searchParams.get("token");

        if (token && token.split(".").length === 3) {
          localStorage.setItem("auth_token", token);

          // ✅ Notify the app that token is ready
          window.dispatchEvent(new Event("auth-token-ready"));
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
