"use client";

import { useState } from "react";
import { Search, Download, Star, Tv, ArrowLeft, List } from "lucide-react";

export default function AniListViewer() {
  const [username, setUsername] = useState("achinta");
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [exporting, setExporting] = useState(false);
  const [gridSize, setGridSize] = useState(2);

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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/2 -right-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all duration-300"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline">Back</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Ani
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  List
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && fetchAnimeList()}
                  placeholder="Enter AniList username..."
                  className="w-full px-6 py-4 bg-black/30 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => fetchAnimeList()}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
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
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
                    {error}
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
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {statusLabels[status]} ({count})
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  {[
                    { format: "json", label: "JSON" }
                  ].map(({ format, label }) => (
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
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg">Loading anime list...</p>
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
                  className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={anime.cover_image_large || anime.cover_image_medium}
                      alt={anime.title_english || anime.title_romaji}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

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
                    <h3 className="text-white font-bold text-base line-clamp-2 mb-2">
                      {anime.title_english || anime.title_romaji}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Tv size={14} />
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
        </div>
      </div>
    </div>
  );
}
