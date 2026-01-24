"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Star,
  Tv,
  ArrowLeft,
  List,
  ArrowBigLeft,
} from "lucide-react";
import { useAuth } from "@/app/context/authContext";
import useApi from "@/services/authservices";

export default function AniListViewer() {
  const [username, setUsername] = useState("achinta");
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [exporting, setExporting] = useState(false);
  const [gridSize, setGridSize] = useState(2);
  const [response, setResponse] = useState("");
  const [theme, setTheme] = useState("light");
  const { accessToken } = useAuth();
  const apiFetch = useApi();

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
    { name: "Horizontal", cols: "flex flex-col gap-3" },
    {
      name: "Compact",
      cols: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3",
    },
    {
      name: "Normal",
      cols: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
    },
    {
      name: "Detailed",
      cols: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",
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
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/anime/fetch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
          body: JSON.stringify({ username: user }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch anime list");
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.animeList)) {
        setAnimeList(data.animeList);
        if (data.cached) {
          setResponse("Showing synced cached data");
        }
      } else {
        setAnimeList([]);
        setError("Unexpected response format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportList = async (format) => {
    if (!username) {
      setError("No username found");
      return;
    }

    setExporting(true);
    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/anime/fetch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            format,
            filter: activeFilter,
          }),
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

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-900"
    : "from-blue-50 via-purple-50 to-pink-50";
  const glowColor1 = isDark ? "bg-purple-500/10" : "bg-purple-300/20";
  const glowColor2 = isDark ? "bg-blue-500/10" : "bg-blue-300/20";
  const cardBg = isDark
    ? "from-white/10 to-white/5 border-white/20 hover:border-white/40"
    : "from-white/90 to-white/80 border-purple-200 hover:border-purple-300";
  const inputBg = isDark ? "bg-black/30 border-white/20" : "bg-white/80 border-purple-300";
  const inputText = isDark ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500";
  const inputFocus = isDark ? "focus:ring-purple-500" : "focus:ring-purple-400";
  const buttonPrimary = isDark
    ? "from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
    : "from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600";
  const buttonSecondary = isDark
    ? "bg-white/10 text-gray-300 hover:bg-white/20"
    : "bg-purple-100 text-purple-700 hover:bg-purple-200";
  const buttonActive = isDark
    ? "from-purple-600 to-blue-600"
    : "from-purple-500 to-blue-500";
  const errorBg = isDark
    ? "bg-red-500/20 border-red-500/50 text-red-300"
    : "bg-red-100 border-red-400 text-red-700";
  const successBg = isDark
    ? "bg-green-500/20 border-green-500/50 text-white"
    : "bg-green-100 border-green-400 text-green-800";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const spinnerBorder = isDark ? "border-purple-500/30 border-t-purple-500" : "border-purple-300 border-t-purple-600";
  const loadingText = isDark ? "text-white" : "text-gray-800";
  const cardImageOverlay = "from-black via-black/50 to-transparent";
  const cardTextPrimary = isDark ? "text-white" : "text-gray-900";
  const cardTextSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const scoreHighlight = isDark ? "text-purple-400" : "text-purple-600";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} relative transition-colors duration-300`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute w-96 h-96 ${glowColor1} rounded-full blur-3xl -top-20 -left-20 animate-pulse`}></div>
        <div
          className={`absolute w-96 h-96 ${glowColor2} rounded-full blur-3xl top-1/2 -right-20 animate-pulse`}
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto mb-8">
            <div className={`bg-gradient-to-br ${cardBg} backdrop-blur-xl rounded-3xl p-6 border transition-colors`}>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && fetchAnimeList()}
                  placeholder="Enter AniList username..."
                  className={`w-full px-6 py-4 ${inputBg} border rounded-2xl ${inputText} focus:outline-none focus:ring-2 ${inputFocus} transition-colors`}
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => fetchAnimeList()}
                    disabled={loading}
                    className={`flex-1 px-6 py-3 bg-gradient-to-r ${buttonPrimary} text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <div className={`w-5 h-5 border-2 ${isDark ? 'border-white/30 border-t-white' : 'border-white/50 border-t-white'} rounded-full animate-spin`}></div>
                        Loading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <Search size={20} />
                        Fetch List
                      </span>
                    )}
                  </button>

                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((size) => (
                      <button
                        key={size}
                        onClick={() => setGridSize(size)}
                        className={`px-4 py-3 rounded-xl font-bold transition-all ${
                          gridSize === size
                            ? `bg-gradient-to-r ${buttonActive} text-white shadow-lg`
                            : buttonSecondary
                        }`}
                      >
                        {size === 0 ? (
                          <List size={20} />
                        ) : size === 1 ? (
                          "S"
                        ) : size === 2 ? (
                          "M"
                        ) : (
                          "L"
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className={`p-4 ${errorBg} border rounded-xl transition-colors`}>
                    {error}
                  </div>
                )}
                {response && (
                  <div className={`p-4 ${successBg} border rounded-xl transition-colors`}>
                    {response}
                  </div>
                )}
              </div>
            </div>
          </div>

          {animeList.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                      key={status}
                      onClick={() => setActiveFilter(status)}
                      className={`px-4 py-2.5 rounded-xl font-bold transition-all ${
                        activeFilter === status
                          ? `text-white bg-gradient-to-r ${statusColors[status]}`
                          : buttonSecondary
                      }`}
                    >
                      {statusLabels[status]} ({count})
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  {[{ format: "json", label: "JSON" }].map(
                    ({ format, label }) => (
                      <button
                        key={format}
                        onClick={() => exportList(format)}
                        disabled={exporting}
                        className={`flex items-center gap-2 px-4 py-2.5
                 bg-gradient-to-r from-green-600 to-emerald-600
                 hover:from-green-700 hover:to-emerald-700
                 text-white font-semibold rounded-xl
                 transition-all shadow-lg disabled:opacity-50`}
                      >
                        <Download size={18} />
                        <span>{label}</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className={`w-16 h-16 border-4 ${spinnerBorder} rounded-full animate-spin mb-4`}></div>
              <p className={`${loadingText} text-lg`}>Loading anime list...</p>
            </div>
          )}

          {filteredAnime.length > 0 && (
            <div
              className={
                gridSize === 0
                  ? gridConfigs[0].cols
                  : `grid ${gridConfigs[gridSize].cols}`
              }
            >
              {filteredAnime.map((anime) => (
                <div
                  key={anime.id}
                  className={`group bg-gradient-to-br ${cardBg} backdrop-blur-xl rounded-2xl overflow-hidden border transition-all`}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={anime.cover_image_large || anime.cover_image_medium}
                      alt={anime.title_english || anime.title_romaji}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${cardImageOverlay}`}></div>

                    <div
                      className={`absolute top-3 left-3 px-3 py-1.5 rounded-full font-bold text-xs bg-gradient-to-r ${
                        statusColors[anime.status]
                      }`}
                    >
                      {statusLabels[anime.status]}
                    </div>

                    {anime.average_score && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1.5 rounded-full flex items-center gap-1">
                        <Star size={14} className="text-white fill-white" />
                        <span className="text-white font-bold text-sm">
                          {anime.average_score}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className={`${cardTextPrimary} font-bold text-base line-clamp-2 mb-2 transition-colors`}>
                      {anime.title_english || anime.title_romaji}
                    </h3>
                    <div className={`flex items-center justify-between text-sm ${cardTextSecondary} transition-colors`}>
                      <span className="flex items-center gap-1">
                        <Tv size={14} />
                        {anime.progress}/{anime.episodes || "?"}
                      </span>
                      {anime.score > 0 && (
                        <span className={`${scoreHighlight} font-bold transition-colors`}>
                          ★ {anime.score}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}