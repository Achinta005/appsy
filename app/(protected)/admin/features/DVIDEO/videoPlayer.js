"use client";
import React, { useState, useEffect } from "react";
import {
  Play,
  X,
  Loader2,
  Grid3x3,
  List,
  Search,
  Star,
  Clock,
  Film,
  ArrowBigLeft,
} from "lucide-react";

export default function DriveVideoPlayer() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [gridLayout, setGridLayout] = useState("5x4");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");

  // Initialize and listen for theme changes
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/videos.json");

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      setVideos(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to load videos. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter((video) =>
    video.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGridCols = () => {
    switch (gridLayout) {
      case "4x5":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      case "5x4":
        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-gray-950 via-purple-950 to-black"
    : "from-blue-50 via-purple-50 to-pink-50";
  const glowColor1 = isDark ? "bg-red-500/30" : "bg-purple-300/40";
  const glowColor2 = isDark ? "bg-purple-500/30" : "bg-blue-300/40";
  const loaderColor = isDark ? "text-red-500" : "text-purple-600";
  const loaderGlow = isDark ? "bg-red-500/20" : "bg-purple-500/30";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const headerBg = isDark ? "bg-black/40 border-gray-800/50" : "bg-white/80 border-purple-200/50";
  const logoGradient = isDark
    ? "from-red-500 to-purple-600"
    : "from-purple-500 to-blue-500";
  const titleGradient = isDark
    ? "from-white via-red-200 to-purple-300"
    : "from-gray-900 via-purple-700 to-blue-700";
  const inputBg = isDark
    ? "bg-gray-900/50 border-gray-700/50 text-white placeholder-gray-500 focus:ring-red-500"
    : "bg-white/80 border-purple-300/50 text-gray-900 placeholder-gray-500 focus:ring-purple-500";
  const toggleBg = isDark ? "bg-gray-900/50 border-gray-700/50" : "bg-white/80 border-purple-200/50";
  const toggleActive = isDark
    ? "bg-gradient-to-r from-red-600 to-red-700 shadow-red-500/50"
    : "bg-gradient-to-r from-purple-600 to-blue-600 shadow-purple-500/50";
  const toggleInactive = isDark
    ? "text-gray-400 hover:text-white hover:bg-gray-800"
    : "text-gray-600 hover:text-gray-900 hover:bg-purple-100";
  const errorBg = isDark
    ? "from-red-900/30 to-red-800/30 border-red-600/50 text-red-200"
    : "from-red-100 to-red-50 border-red-400/50 text-red-800";
  const errorIcon = isDark ? "bg-red-600/20 text-red-400" : "bg-red-200 text-red-600";
  const emptyBg = isDark ? "bg-gray-900/50 border-gray-800/50" : "bg-white/80 border-purple-200/50";
  const emptyIcon = isDark ? "text-gray-600" : "text-gray-400";
  const emptyText = isDark ? "text-gray-400" : "text-gray-600";
  const listBg = isDark ? "bg-gray-900/50 border-gray-800/50" : "bg-white/90 border-purple-200/50";
  const listHeader = isDark ? "bg-gray-800/50 border-gray-700/50 text-gray-400" : "bg-purple-50/50 border-purple-200/50 text-gray-600";
  const listRow = isDark ? "hover:bg-gray-800/50" : "hover:bg-purple-50/50";
  const listText = isDark ? "text-white" : "text-gray-900";
  const listHover = isDark ? "group-hover:text-red-400" : "group-hover:text-purple-600";
  const cardBg = isDark
    ? "from-gray-900/80 to-gray-950/80 border-gray-800/50 hover:border-red-600/50 hover:shadow-red-600/30"
    : "from-white/90 to-purple-50/50 border-purple-200/50 hover:border-purple-400/50 hover:shadow-purple-400/30";
  const cardOverlay = isDark ? "from-black via-black/60 to-transparent" : "from-black/80 via-black/40 to-transparent";
  const durationBg = isDark ? "bg-black/90 border-gray-700/50" : "bg-white/90 border-gray-300/50";
  const durationText = isDark ? "text-white" : "text-gray-900";
  const playButtonGlow = isDark ? "bg-red-500/50" : "bg-purple-500/50";
  const playButton = isDark ? "from-red-600 to-red-700" : "from-purple-600 to-blue-600";
  const cardTitle = isDark
    ? "text-white group-hover:from-red-400 group-hover:to-purple-400"
    : "text-gray-900 group-hover:from-purple-600 group-hover:to-blue-600";
  const modalBg = isDark ? "bg-black/95" : "bg-white/95";
  const modalGlow1 = isDark ? "bg-red-500" : "bg-purple-500";
  const modalGlow2 = isDark ? "bg-purple-500" : "bg-blue-500";
  const closeButtonGlow = isDark ? "bg-red-500/50" : "bg-purple-500/50";
  const closeButton = isDark
    ? "from-red-600 to-red-700 hover:from-red-500 hover:to-red-600"
    : "from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500";
  const modalTitleBg = isDark
    ? "from-gray-900/90 to-gray-800/90 border-gray-700/50"
    : "from-white/90 to-purple-50/90 border-purple-200/50";
  const modalTitle = isDark ? "text-white" : "text-gray-900";
  const videoBorder = isDark ? "border-gray-800/50" : "border-purple-300/50";

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center relative overflow-hidden transition-colors duration-300`}>
        <div className="absolute inset-0">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${glowColor1} rounded-full filter blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${glowColor2} rounded-full filter blur-3xl animate-pulse`}></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative">
            <Loader2 className={`w-20 h-20 ${loaderColor} animate-spin mx-auto mb-6`} />
            <div className={`absolute inset-0 w-20 h-20 mx-auto ${loaderGlow} rounded-full filter blur-xl animate-pulse`}></div>
          </div>
          <p className={`${textPrimary} text-2xl font-bold mb-2 transition-colors`}>Loading VideoHub</p>
          <p className={`${textSecondary} text-sm transition-colors`}>Preparing your content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} relative overflow-hidden transition-colors duration-300`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 ${isDark ? 'bg-red-500/10' : 'bg-purple-300/20'} rounded-full filter blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${isDark ? 'bg-purple-500/10' : 'bg-blue-300/20'} rounded-full filter blur-3xl animate-pulse delay-1000`}></div>
      </div>
      {/* Header */}
      <div className={`relative ${headerBg} backdrop-blur-2xl border-b sticky top-0 z-40 shadow-2xl transition-colors`}>
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Logo and Title */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${logoGradient} rounded-2xl filter blur-xl opacity-50 animate-pulse`}></div>
                <div className={`relative bg-gradient-to-br ${logoGradient} p-2 rounded-2xl shadow-2xl`}>
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl font-black bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}>
                  Video Player
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`${textSecondary} text-sm font-medium transition-colors`}>
                    {filteredVideos.length}{" "}
                    {filteredVideos.length === 1 ? "video" : "videos"}
                  </span>
                </div>
              </div>
            </div>

            {/* Search and View Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search your collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 ${inputBg} border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all backdrop-blur-xl shadow-lg`}
                />
              </div>

              {/* View Mode Toggle */}
              <div className={`flex items-center gap-2 ${toggleBg} backdrop-blur-xl rounded-xl p-1.5 border shadow-lg transition-colors`}>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? `${toggleActive} text-white shadow-lg`
                      : toggleInactive
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? `${toggleActive} text-white shadow-lg`
                      : toggleInactive
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
              </div>

              {/* Grid Layout Selector (only show in grid mode) */}
              {viewMode === "grid" && (
                <div className={`flex items-center gap-2 ${toggleBg} backdrop-blur-xl rounded-xl p-1.5 border shadow-lg transition-colors`}>
                  <button
                    onClick={() => setGridLayout("4x5")}
                    className={`px-3.5 py-2.5 rounded-lg transition-all font-bold text-sm ${
                      gridLayout === "4x5"
                        ? `${toggleActive} text-white shadow-lg`
                        : toggleInactive
                    }`}
                  >
                    4
                  </button>
                  <button
                    onClick={() => setGridLayout("5x4")}
                    className={`px-3.5 py-2.5 rounded-lg transition-all font-bold text-sm ${
                      gridLayout === "5x4"
                        ? `${toggleActive} text-white shadow-lg`
                        : toggleInactive
                    }`}
                  >
                    5
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="relative max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className={`bg-gradient-to-r ${errorBg} backdrop-blur-xl border rounded-2xl p-5 shadow-2xl transition-colors`}>
            <div className="flex items-center gap-3">
              <div className={`${errorIcon} p-2 rounded-lg transition-colors`}>
                <X className="w-5 h-5" />
              </div>
              <p className="font-semibold text-base">⚠️ {error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Content */}
      <div className="relative max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-32">
            <div className={`inline-block p-6 ${emptyBg} backdrop-blur-xl rounded-2xl border shadow-2xl transition-colors`}>
              <Search className={`w-16 h-16 ${emptyIcon} mx-auto mb-4 transition-colors`} />
              <p className={`${emptyText} text-xl font-semibold mb-2 transition-colors`}>
                No videos found
              </p>
              <p className={`${textSecondary} text-sm transition-colors`}>
                Try adjusting your search query
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* List View (Windows Explorer Style) */}
            {viewMode === "list" && (
              <div className={`${listBg} backdrop-blur-xl rounded-2xl border overflow-hidden shadow-2xl transition-colors`}>
                {/* Header Row */}
                <div className={`${listHeader} border-b px-4 py-3 grid grid-cols-[48px_1fr_120px_100px] gap-4 items-center text-xs font-semibold uppercase transition-colors`}>
                  <div></div>
                  <div>Name</div>
                  <div className="text-center">Year</div>
                  <div className="text-right">Duration</div>
                </div>
                {/* Video Rows */}
                <div className={`divide-y ${isDark ? 'divide-gray-800/50' : 'divide-purple-200/50'}`}>
                  {filteredVideos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`px-4 py-3 grid grid-cols-[48px_1fr_120px_100px] gap-4 items-center ${listRow} cursor-pointer transition-all group`}
                    >
                      {/* Icon */}
                      <div className={`w-8 h-8 bg-gradient-to-br ${logoGradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <img
                          src={video.thumbnail}
                          alt={video.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      {/* Video Name */}
                      <div className="min-w-0">
                        <p className={`${listText} text-sm font-medium truncate ${listHover} transition-colors`}>
                          {video.name}
                        </p>
                      </div>
                      {/* Year */}
                      <div className="text-center">
                        <span className={`${textSecondary} text-xs font-medium transition-colors`}>
                          {video.year}
                        </span>
                      </div>
                      {/* Duration */}
                      <div className="text-right">
                        <span className={`${textSecondary} text-xs font-medium transition-colors`}>
                          {video.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className={`grid ${getGridCols()} gap-5 sm:gap-6 lg:gap-7`}>
                {filteredVideos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`group relative bg-gradient-to-br ${cardBg} backdrop-blur-xl rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className={`absolute inset-0 bg-gradient-to-t ${cardOverlay} opacity-80 group-hover:opacity-90 transition-opacity`} />

                      <div className={`absolute bottom-3 right-3 flex items-center gap-1.5 ${durationBg} backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold ${durationText} shadow-xl border transition-colors`}>
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="relative">
                          <div className={`absolute inset-0 ${playButtonGlow} rounded-full filter blur-2xl animate-pulse`}></div>
                          <div className={`relative bg-gradient-to-br ${playButton} rounded-full p-6 transform group-hover:scale-110 transition-transform shadow-2xl`}>
                            <Play className="w-12 h-12 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className={`${cardTitle} font-bold text-base sm:text-lg line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all leading-tight`}>
                        {video.name}
                      </h3>
                      <h2 className={`${textSecondary} transition-colors`}>{video.year}</h2>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Video Player Modal - FIXED SIZE */}
      {selectedVideo && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${modalBg} backdrop-blur-2xl transition-colors`}>
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <div className={`absolute top-0 left-1/4 w-96 h-96 ${modalGlow1} rounded-full filter blur-3xl animate-pulse`}></div>
            <div className={`absolute bottom-0 right-1/4 w-96 h-96 ${modalGlow2} rounded-full filter blur-3xl animate-pulse`}></div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 sm:top-20 sm:right-40 z-50 group"
          >
            <div className={`absolute inset-0 ${closeButtonGlow} rounded-full filter blur-xl group-hover:blur-2xl transition-all`}></div>
            <div className={`relative bg-gradient-to-r ${closeButton} text-white rounded-xl p-1 sm:p-3 transition-all hover:scale-110 hover:rotate-90 shadow-2xl`}>
              <X className="w-3 h-3 sm:w-5 sm:h-5" />
            </div>
          </button>

          {/* Video Player Container - CENTERED AND RESPONSIVE */}
          <div className="relative w-full max-w-3xl lg:max-w-4xl">
            {/* Video Title */}
            <div className="mb-3 sm:mb-4">
              <div className={`bg-gradient-to-r ${modalTitleBg} backdrop-blur-2xl rounded-xl sm:rounded-2xl p-1 sm:p-2 border shadow-2xl transition-colors`}>
                <h2 className={`${modalTitle} text-lg sm:text-xl lg:text-2xl font-black line-clamp-2 text-center transition-colors`}>
                  {selectedVideo.name}
                </h2>
              </div>
            </div>

            {/* Video Player - 16:9 ASPECT RATIO */}
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <div className={`absolute inset-0 bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 ${videoBorder} transition-colors`}>
                <iframe
                  src={selectedVideo.driveLink}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}