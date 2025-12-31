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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative">
            <Loader2 className="w-20 h-20 text-red-500 animate-spin mx-auto mb-6" />
            <div className="absolute inset-0 w-20 h-20 mx-auto bg-red-500/20 rounded-full filter blur-xl animate-pulse"></div>
          </div>
          <p className="text-white text-2xl font-bold mb-2">Loading VideoHub</p>
          <p className="text-gray-400 text-sm">Preparing your content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      {/* Header */}
      <div className="relative bg-black/40 backdrop-blur-2xl border-b border-gray-800/50 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-1">
              <button
                onClick={() => window.location.reload()}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer relative"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110"></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>

                {/* Button Content */}
                <ArrowBigLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="relative z-10">Back</span>
              </button>
            </div>
            {/* Logo and Title */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-600 rounded-2xl filter blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-purple-600 p-2 rounded-2xl shadow-2xl">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-white via-red-200 to-purple-300 bg-clip-text text-transparent">
                  Video Player
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-gray-400 text-sm font-medium">
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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search your collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all backdrop-blur-xl shadow-lg"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-xl rounded-xl p-1.5 border border-gray-700/50 shadow-lg">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
              </div>

              {/* Grid Layout Selector (only show in grid mode) */}
              {viewMode === "grid" && (
                <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-xl rounded-xl p-1.5 border border-gray-700/50 shadow-lg">
                  <button
                    onClick={() => setGridLayout("4x5")}
                    className={`px-3.5 py-2.5 rounded-lg transition-all font-bold text-sm ${
                      gridLayout === "4x5"
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    4
                  </button>
                  <button
                    onClick={() => setGridLayout("5x4")}
                    className={`px-3.5 py-2.5 rounded-lg transition-all font-bold text-sm ${
                      gridLayout === "5x4"
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
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
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-xl border border-red-600/50 rounded-2xl p-5 text-red-200 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="bg-red-600/20 p-2 rounded-lg">
                <X className="w-5 h-5 text-red-400" />
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
            <div className="inline-block p-6 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-xl font-semibold mb-2">
                No videos found
              </p>
              <p className="text-gray-500 text-sm">
                Try adjusting your search query
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* List View (Windows Explorer Style) */}
            {viewMode === "list" && (
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 overflow-hidden shadow-2xl">
                {/* Header Row */}
                <div className="bg-gray-800/50 border-b border-gray-700/50 px-4 py-3 grid grid-cols-[48px_1fr_120px_100px] gap-4 items-center text-gray-400 text-xs font-semibold uppercase">
                  <div></div>
                  <div>Name</div>
                  <div className="text-center">Year</div>
                  <div className="text-right">Duration</div>
                </div>
                {/* Video Rows */}
                <div className="divide-y divide-gray-800/50">
                  {filteredVideos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className="px-4 py-3 grid grid-cols-[48px_1fr_120px_100px] gap-4 items-center hover:bg-gray-800/50 cursor-pointer transition-all group"
                    >
                      {/* Icon */}
                      <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      {/* Video Name */}
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate group-hover:text-red-400 transition-colors">
                          {video.name}
                        </p>
                      </div>
                      {/* Year */}
                      <div className="text-center">
                        <span className="text-gray-400 text-xs font-medium">
                          {video.year}
                        </span>
                      </div>
                      {/* Duration */}
                      <div className="text-right">
                        <span className="text-gray-400 text-xs font-medium">
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
                    className="group relative bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/30 border border-gray-800/50 hover:border-red-600/50"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xl border border-gray-700/50">
                        <Clock className="w-3 h-3" />
                        {video.duration}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="relative">
                          <div className="absolute inset-0 bg-red-500/50 rounded-full filter blur-2xl animate-pulse"></div>
                          <div className="relative bg-gradient-to-br from-red-600 to-red-700 rounded-full p-6 transform group-hover:scale-110 transition-transform shadow-2xl">
                            <Play className="w-12 h-12 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-white font-bold text-base sm:text-lg line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all leading-tight">
                        {video.name}
                      </h3>
                      <h2 className="text-gray-400">{video.year}</h2>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 sm:top-20 sm:right-40 z-50 group"
          >
            <div className="absolute inset-0 bg-red-500/50 rounded-full filter blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl p-1 sm:p-3 transition-all hover:scale-110 hover:rotate-90 shadow-2xl">
              <X className="w-3 h-3 sm:w-5 sm:h-5" />
            </div>
          </button>

          {/* Video Player Container - CENTERED AND RESPONSIVE */}
          <div className="relative w-full max-w-3xl lg:max-w-4xl">
            {/* Video Title */}
            <div className="mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-gray-700/50 shadow-2xl">
                <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-black line-clamp-2 text-center">
                  {selectedVideo.name}
                </h2>
              </div>
            </div>

            {/* Video Player - 16:9 ASPECT RATIO */}
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <div className="absolute inset-0 bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-800/50">
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
