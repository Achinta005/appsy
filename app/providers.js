"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Providers({ children }) {
  const router = useRouter();

  useEffect(() => {
    let listener;

    async function loadCapacitor() {
      try {
        // Dynamically import ONLY on client
        const { App } = await import("@capacitor/app");

        listener = App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack) {
            router.back();
          } else {
            App.exitApp();
          }
        });
      } catch (err) {
        console.warn("Capacitor not available in web build:", err);
      }
    }

    loadCapacitor();

    return () => {
      if (listener) listener.remove();
    };
  }, []);

  return <>{children}</>;
}
