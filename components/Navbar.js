"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FloatingDock } from "./ui/floatingdock";
import { isAuthenticated, removeAuthToken } from "@/app/lib/auth";
import {
  IconLogin,
  IconAddressBook,
  IconArticle,
  IconHome,
  IconCertificate,
  IconUser,
  IconDashboard,
  IconLogin2,
} from "@tabler/icons-react";
import { CircleUser,MapPinHouse } from "lucide-react";

const getToken = () => localStorage.getItem("admin_token");
const setToken = (token) => localStorage.setItem("admin_token", token);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleStorageChange = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      const newLoginState = isAuthenticated();
      if (newLoginState !== isLoggedIn) {
        setIsLoggedIn(newLoginState);
      }
    }, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [isLoggedIn, mounted]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setHasAccess(!!getToken());
  }, [mounted]);

  const handleLogout = () => {
    try {
      removeAuthToken();
      setIsLoggedIn(false);
      setHasAccess(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = () => {
    router.push("/portfolio/login");
  };

  const handleAdminClick = () => router.push("/portfolio/admin");

  const baseLinks = [
    { title: "HOME", icon: <IconHome className="h-full w-full text-gray-300" />, href: "/" },
    { title: "Intro", icon: <CircleUser className="h-full w-full text-gray-300" />, href: "/portfolio" },
    { title: "ABOUT", icon: <IconUser className="h-full w-full text-gray-300" />, href: "/portfolio/about" },
    { title: "PROJECTS", icon: <IconCertificate className="h-full w-full text-gray-300" />, href: "/portfolio/projects" },
    { title: "BLOGS", icon: <IconArticle className="h-full w-full text-gray-300" />, href: "/portfolio/blog" },
    { title: "CONTACTS", icon: <IconAddressBook className="h-full w-full text-gray-300" />, href: "/portfolio/contact" },
    { title: "IP", icon: <MapPinHouse className="h-full w-full text-gray-300" />, href: "/portfolio/ip" },
    
  ];

  const authLinks = isLoggedIn
    ? [
        { title: "ADMIN PANEL", icon: <IconDashboard className="h-full w-full text-gray-300" />, href:"/portfolio/admin", onClick: handleAdminClick },
        { title: "LOGOUT", icon: <IconLogin2 className="h-full w-full text-gray-300" />, onClick: handleLogout },
      ]
    : hasAccess
    ? [
        { title: "LOGIN", icon: <IconLogin className="h-full w-full text-gray-300" />, href:"/portfolio/login", onClick: handleLogin },
      ]
    : [];

  const links = [...baseLinks, ...authLinks];

  if (!mounted) return null;

  return (
    <header className="bg-transparent">
      <div className="lg:hidden">
        <FloatingDock mobileClassName="fixed bottom-6 right-6 z-50" items={links} />
      </div>
      <div className="hidden lg:block">
        <FloatingDock desktopClassName="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50" items={links} />
      </div>
    </header>
  );
}