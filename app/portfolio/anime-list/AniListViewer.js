"use client";

import { useState } from "react";
import { Search, Download, Star, Tv, ArrowLeft, List, Grid3x3, Grid2x2, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AniListViewer() {
  const [username, setUsername] = useState("achinta");
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [exporting, setExporting] = useState(false);
  const [gridSize, setGridSize] = useState(2);
  const router = useRouter();

  const statusLabels = {
    CURRENT: "Watching",
    COMPLETED: "Completed",
    PLANNING: "Plan to Watch",
    PAUSED: "On Hold",
    DROPPED: "Dropped",
    ALL: "All Anime",
  };

  const statusColors = {
    CURRENT: "from-blue-500 to-cyan-500",
    COMPLETED: "from-green-500 to-emerald-500",
    PLANNING: "from-purple-500 to-pink-500",
    PAUSED: "from-yellow-500 to-orange-500",
    DROPPED: "from-red-500 to-rose-500",
    ALL: "from-indigo-500 to-blue-500",
  };

  const gridConfigs = [
    { name: "Horizontal", cols: "flex flex-col gap-3", icon: List },
    {
      name: "Compact",
      cols: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3",
      icon: Grid3x3,
    },
    {
      name: "Normal",
      cols: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4",
      icon: Grid2x2,
    },
    {
      name: "Detailed",
      cols: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6",
      icon: LayoutGrid,
    },
  ];

  const fetchAnimeList = async (user = username) => {
    if (!user?.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/alist/anilist/BaseFunction/fetch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username: user }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch anime list");
      }
      const data = await res.json();
      setAnimeList(data.animeList || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fixed handleClick function
  const handleClick = () => {
    try {
      router.push('/portfolio/admin');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = '/portfolio/admin';
    }
  };

  const exportList = async (format) => {
    if (!username) {
      setError("No username found");
      return;
    }

    setExporting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/alist/anilist/BaseFunction/fetch`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, format, filter: activeFilter }),
        }
      );

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${username}_anime_list.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const filteredAnime =
    activeFilter === "ALL"
      ? animeList
      : animeList.filter((anime) => anime.status === activeFilter);

  const statusCounts = {
    ALL: animeList.length,
    CURRENT: animeList.filter((a) => a.status === "CURRENT").length,
    COMPLETED: animeList.filter((a) => a.status === "COMPLETED").length,
    PLANNING: animeList.filter((a) => a.status === "PLANNING").length,
    PAUSED: animeList.filter((a) => a.status === "PAUSED").length,
    DROPPED: animeList.filter((a) => a.status === "DROPPED").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div
          className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl top-1/2 -right-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Sticky Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleClick}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl text-white transition-all duration-300"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">Back</span>
              </button>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                Ani
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  List
                </span>
              </h1>
              
              <div className="w-16 sm:w-20"></div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Search Section */}
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20">
              <div className="flex flex-col gap-3 sm:gap-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && fetchAnimeList()}
                  placeholder="Enter AniList username..."
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/30 border border-white/20 rounded-xl sm:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => fetchAnimeList()}
                    disabled={loading}
                    className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 active:scale-95 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <Search size={18} className="sm:w-5 sm:h-5" />
                        Fetch List
                      </span>
                    )}
                  </button>

                  {/* Grid Size Controls */}
                  <div className="flex gap-2 justify-center sm:justify-start">
                    {gridConfigs.map((config, index) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => setGridSize(index)}
                          className={`px-3 sm:px-4 py-3 rounded-xl font-bold transition-all ${
                            gridSize === index
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                              : "bg-white/10 text-gray-300 hover:bg-white/20"
                          }`}
                          title={config.name}
                        >
                          <Icon size={18} className="sm:w-5 sm:h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filters and Export */}
          {animeList.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col gap-4">
                {/* Status Filters */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                      key={status}
                      onClick={() => setActiveFilter(status)}
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all text-xs sm:text-sm ${
                        activeFilter === status
                          ? `text-white bg-gradient-to-r ${statusColors[status]} shadow-lg`
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      <span className="hidden sm:inline">{statusLabels[status]}</span>
                      <span className="sm:hidden">{statusLabels[status].split(' ')[0]}</span>
                      <span className="ml-1">({count})</span>
                    </button>
                  ))}
                </div>

                {/* Export Button */}
                <div className="flex justify-center sm:justify-end">
                  <button
                    onClick={() => exportList('json')}
                    disabled={exporting}
                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-95 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 text-sm sm:text-base"
                  >
                    <Download size={16} className="sm:w-5 sm:h-5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
              <p className="text-white text-base sm:text-lg">Loading anime list...</p>
            </div>
          )}

          {/* Anime Grid */}
          {filteredAnime.length > 0 && (
            <div className={gridConfigs[gridSize].cols}>
              {filteredAnime.map((anime) => (
                <div
                  key={anime.id}
                  className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all hover:shadow-xl"
                >
                  <div className="relative h-48 sm:h-60 md:h-72 overflow-hidden">
                    <img
                      src={anime.cover_image_large || anime.cover_image_medium}
                      alt={anime.title_english || anime.title_romaji}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                    {/* Status Badge */}
                    <div
                      className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold text-xs bg-gradient-to-r ${
                        statusColors[anime.status]
                      } shadow-lg`}
                    >
                      {statusLabels[anime.status]}
                    </div>

                    {/* Score Badge */}
                    {anime.average_score && (
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gradient-to-r from-yellow-500 to-orange-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                        <Star size={12} className="sm:w-3.5 sm:h-3.5 text-white fill-white" />
                        <span className="text-white font-bold text-xs sm:text-sm">
                          {anime.average_score}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 mb-2">
                      {anime.title_english || anime.title_romaji}
                    </h3>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Tv size={12} className="sm:w-3.5 sm:h-3.5" />
                        {anime.progress}/{anime.episodes || "?"}
                      </span>
                      {anime.score > 0 && (
                        <span className="text-purple-400 font-bold">
                          ★ {anime.score}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && animeList.length === 0 && (
            <div className="text-center py-12 sm:py-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-gray-400 text-base sm:text-lg">Enter a username to fetch anime list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}