'use client'
import React, { useState } from "react";
import {
  Home,
  Users,
  ShoppingBag,
  Settings,
  FileText,
  MessageCircle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileHomepage() {
  const [activeCard, setActiveCard] = useState(null);
  const router = useRouter();

  const navigationCards = [
    {
      id: 1,
      title: "Portfolio",
      description: "My Portfolio",
      icon: Users,
      link: "/portfolio",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      id: 2,
      title: "Machine Learning",
      description: "Multple machine learning models",
      icon: Users,
      link: "/ml_model",
      gradient: "from-purple-600 to-purple-700",
    },
  ];

  const handleCardClick = (card) => {
    setActiveCard(card.id);
    router.push(card.link)
    console.log(`Navigating to: ${card.link}`);
    setTimeout(() => setActiveCard(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome</h1>
            <p className="text-purple-200 text-sm mt-1">
              Choose your destination
            </p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            A
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search pages..."
            className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-purple-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="px-6 pb-6 mb-5">
        <div className="grid grid-cols-2 gap-4 mb-24">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 ${
                  activeCard === card.id
                    ? "scale-95"
                    : "scale-100 active:scale-95"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`}
                />
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    {card.title}
                  </h3>
                  <p className="text-purple-100 text-xs">{card.description}</p>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
