"use client";

import { useState } from "react";
import { BookOpen, Code, Play, Zap, ArrowLeft } from "lucide-react";
import AniListViewer from "./anime-list/AniListViewer";
import DriveVideoPlayer from "./DVIDEO/videoPlayer";

export default function HomePage() {
  const [activeComponent, setActiveComponent] = useState(null);

  const boxes = [
    {
      id: "anilist",
      title: "Anime List Viewer",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500",
      description: "View your anime collection",
    },
    {
      id: "dvideo",
      title: "Drive Video Player",
      icon: Play,
      gradient: "from-blue-500 to-cyan-500",
      description: "View Drive videos",
    },
  ];

  // Render active component
  if (activeComponent === "anilist") {
    return <AniListViewer />;
  }

  if (activeComponent === "dvideo") {
    return <DriveVideoPlayer />;
  }

  // Main landing page with boxes
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-1/2 -right-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl bottom-0 left-1/2 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
          {boxes.map((box) => {
            const Icon = box.icon;
            return (
              <div
                key={box.id}
                onClick={() => setActiveComponent(box.id)}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer hover:scale-105 hover:-translate-y-2 min-h-[300px] flex flex-col justify-between"
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${box.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}
                ></div>

                {/* Icon */}
                <div className="relative">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${box.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl`}
                  >
                    <Icon className="text-white" size={36} />
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {box.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors duration-300">
                    {box.description}
                  </p>
                </div>

                {/* Glow effect */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-br ${box.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
