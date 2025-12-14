"use client";

import { App } from "@capacitor/app";
import { useEffect } from "react";

export default function DeepLinkHandler() {
  useEffect(() => {
    const listener = App.addListener("appUrlOpen", ({ url }) => {
      console.log("Deep link received:", url);

      if (!url) return;

      try {
        const parsedUrl = new URL(url);
        const token = parsedUrl.searchParams.get("token");

        if (token && token.split(".").length === 3) {
          // ✅ ONLY STORE TOKEN
          localStorage.setItem("auth_token", token);
        }
      } catch (err) {
        console.error("Invalid deep link URL", err);
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  return null;
}
