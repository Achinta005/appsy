"use client";
import { useState, useEffect, useRef } from "react";
import { FloatingDock } from "./ui/floatingdock";
import { IconHome, IconUser } from "@tabler/icons-react";

export default function Model_Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseLinks = [
    { title: "HOME", icon: <IconHome className="h-full w-full text-gray-300" />, href: "/" },
    { title: "Portfolio", icon: <IconUser className="h-full w-full text-gray-300" />, href: "/portfolio" },
  ];

  if (!mounted) return null;

  return (
    <header className="bg-transparent">
      <div className="lg:hidden">
        <FloatingDock mobileClassName="fixed bottom-6 right-6 z-50" items={baseLinks} />
      </div>
      <div className="hidden lg:block">
        <FloatingDock desktopClassName="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50" items={baseLinks} />
      </div>
    </header>
  );
}
