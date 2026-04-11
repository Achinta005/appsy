import { useState, useEffect } from "react";
import useApi from "@/services/authservices";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState("default");
  const api = useApi();

  useEffect(() => {
    setIsSupported("serviceWorker" in navigator && "PushManager" in window);
    setPermission(Notification.permission);
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (!isSupported) return;

        // 1. Check browser subscription
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();

        if (sub) {
          setIsSubscribed(true);
        }

        // 2. Check backend
        const res = await api(
          `${process.env.NEXT_PUBLIC_SERVER_API_URL}/push/subscribed`,
          {
            method: "GET",
          },
        );

        const data = await res.json();

        if (data?.subscribed) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (err) {
        console.error("Failed to check subscription:", err);
      }
    };

    checkSubscription();
  }, [isSupported]);

  const subscribe = async () => {
    if (!isSupported) return;

    try {
      const swReg = await navigator.serviceWorker.register("/sw.js");

      const reg = await navigator.serviceWorker.ready;

      const perm = await Notification.requestPermission();

      setPermission(perm);
      if (perm !== "granted") {
        console.warn("Permission not granted ❌");
        return;
      }

      let sub = await reg.pushManager.getSubscription();

      const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey,
        });
      } else {
      }

      const res = await api(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/push/subscribe/web`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subscription: sub }),
        },
      );

      setIsSubscribed(true);
    } catch (err) {
      console.error("❌ ERROR OCCURRED:", err);
    }
  };

  const unsubscribe = async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    await sub?.unsubscribe();
    await fetch("/api/push/unsubscribe", {
      method: "DELETE",
      credentials: "include",
    });
    setIsSubscribed(false);
  };

  return { isSupported, isSubscribed, permission, subscribe, unsubscribe };
}
