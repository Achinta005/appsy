"use client";

import { App } from "@capacitor/app";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeepLinkHandler() {
  const router = useRouter();

  useEffect(() => {
    const listener = App.addListener("appUrlOpen", ({ url }) => {
      console.log("Deep link received:", url);

      if (!url) return;

      try {
        const parsedUrl = new URL(url);
        const token = parsedUrl.searchParams.get("token");

        if (token && token.split(".").length === 3) {
          localStorage.setItem("auth_token", token);
          router.replace("/admin");
        }
      } catch (err) {
        console.error("Invalid deep link URL", err);
      }
    });

    return () => {
      listener.remove();
    };
  }, [router]);

  return null;
}
