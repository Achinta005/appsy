"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useBackgroundContext } from "@/app/(protected)/context/BackgroundContext";
import { useForm } from "react-hook-form";
import {
  FolderKanban,
  Upload,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  X,
  Save,
  Plus,
  Film,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
} from "lucide-react";
import useApi from "@/services/authservices";

/* ─────────────────────────────────────────────────────────────────
   MEDIA FILE ITEM — shown in the upload queue
───────────────────────────────────────────────────────────────── */
function MediaFileItem({ file, index, meta, onMetaChange, onRemove }) {
  const preview = URL.createObjectURL(file);
  const isVideo = file.type.startsWith("video/");

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 group">
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-slate-800 relative">
        {isVideo ? (
          <video src={preview} className="w-full h-full object-cover" muted />
        ) : (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        )}
        <span
          className={`absolute top-1 left-1 text-[9px] font-mono px-1.5 py-0.5 rounded-full ${isVideo ? "bg-red-500/80 text-white" : "bg-blue-500/80 text-white"}`}
        >
          {isVideo ? "VID" : "IMG"}
        </span>
      </div>

      {/* Label + type */}
      <div className="flex-1 grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-400 mb-1 block font-mono uppercase tracking-wider">
            Label
          </label>
          <input
            value={meta.label}
            onChange={(e) => onMetaChange(index, "label", e.target.value)}
            placeholder={`Media ${index + 1}`}
            className="w-full text-xs bg-slate-800 border border-slate-600/50 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 mb-1 block font-mono uppercase tracking-wider">
            Type
          </label>
          <select
            value={meta.type}
            onChange={(e) => onMetaChange(index, "type", e.target.value)}
            className="w-full text-xs bg-slate-800 border border-slate-600/50 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
        {meta.type === "video" && (
          <div className="col-span-2">
            <label className="text-[10px] text-slate-400 mb-1 block font-mono uppercase tracking-wider">
              Poster URL (optional)
            </label>
            <input
              value={meta.poster}
              onChange={(e) => onMetaChange(index, "poster", e.target.value)}
              placeholder="https://... thumbnail for video"
              className="w-full text-xs bg-slate-800 border border-slate-600/50 text-white px-2 py-1.5 rounded-lg focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(index)}
        className="flex-shrink-0 mt-1 p-1 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MEDIA GALLERY — shown in project view/edit
───────────────────────────────────────────────────────────────── */
function MediaGallery({ media, projectId, onDeleteMedia, compact = false }) {
  const [idx, setIdx] = useState(0);
  if (!media || media.length === 0)
    return (
      <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center">
        <ImageIcon size={24} className="text-slate-600" />
      </div>
    );

  const cur = media[idx];
  return (
    <div className="relative group">
      <div
        className={`relative ${compact ? "h-28" : "h-44"} rounded-xl overflow-hidden bg-slate-900`}
      >
        {cur.type === "video" ? (
          <video
            src={cur.src}
            poster={cur.poster}
            controls={!compact}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={cur.src}
            alt={cur.label}
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay label */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4">
          <span className="text-white text-[10px] font-mono">{cur.label}</span>
        </div>

        {/* Type badge */}
        <span
          className={`absolute top-1.5 left-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded-full ${cur.type === "video" ? "bg-red-500/80 text-white" : "bg-blue-500/70 text-white"}`}
        >
          {cur.type === "video" ? "VIDEO" : "IMG"}
        </span>

        {/* Delete button */}
        {onDeleteMedia && (
          <button
            onClick={() => onDeleteMedia(projectId, idx)}
            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={10} className="text-white" />
          </button>
        )}

        {/* Nav */}
        {media.length > 1 && (
          <>
            <button
              onClick={() =>
                setIdx((p) => (p - 1 + media.length) % media.length)
              }
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={() => setIdx((p) => (p + 1) % media.length)}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
            >
              <ChevronRight size={12} />
            </button>
          </>
        )}
      </div>

      {/* Dot strip */}
      {media.length > 1 && (
        <div className="flex gap-1 justify-center mt-1.5">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`rounded-full transition-all ${i === idx ? "w-4 h-1.5 bg-violet-400" : "w-1.5 h-1.5 bg-slate-600 hover:bg-slate-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────────── */
function Toast({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium backdrop-blur-xl border pointer-events-auto
            ${
              t.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                : t.type === "error"
                  ? "bg-red-500/20 border-red-500/30 text-red-300"
                  : "bg-violet-500/20 border-violet-500/30 text-violet-300"
            }`}
        >
          {t.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────────────── */
export default function ProjectManagerDashboard() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const { theme } = useBackgroundContext();
  const isDark = theme !== "light";
  const apiFetch = useApi();
  const fileInputRef = useRef();

  // ── State ──
  const [activeTab, setActiveTab] = useState("manager");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("ALL");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Upload media queue
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaMeta, setMediaMeta] = useState([]);

  // Edit: append media
  const [editMediaFiles, setEditMediaFiles] = useState([]);
  const [editMediaMeta, setEditMediaMeta] = useState([]);
  const [replaceMedia, setReplaceMedia] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const descVal = watch("description", "");
  const descWords = descVal?.trim().split(/\s+/).filter(Boolean).length || 0;

  // ── Toast helper ──
  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  // ── Fetch ──
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/portfolio/projects`,
      );
      const data = await res.json();
      setProjects(data.data || data || []);
    } catch {
      toast("Failed to fetch projects", "error");
    } finally {
      setLoading(false);
    }
  }, [apiFetch, toast]);

  useEffect(() => {
    if (activeTab === "manager") fetchProjects();
  }, [activeTab]);

  // ── Upload form submit ──
  const onSubmit = async (data) => {
    if (mediaFiles.length === 0) {
      toast("Add at least one media file", "error");
      return;
    }

    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("description", data.description || "");
    fd.append("category", data.category);
    fd.append("technologies", data.technologies || "");
    fd.append("liveUrl", data.liveUrl || "");
    fd.append("githubUrl", data.githubUrl || "");
    fd.append("order", data.order || "");
    fd.append("isLocal", data.isLocal ? "true" : "false");

    if (data.category === "Machine Learning") {
      fd.append("modelAccuracy", data.modelAccuracy || "");
      fd.append("modelFeatures", data.modelFeatures || "");
    }

    // Append files + metadata
    mediaFiles.forEach((f) => fd.append("media", f));
    fd.append(
      "mediaLabels",
      JSON.stringify(mediaMeta.map((m) => m.label || "")),
    );
    fd.append(
      "mediaTypes",
      JSON.stringify(mediaMeta.map((m) => m.type || "image")),
    );
    fd.append(
      "mediaPosters",
      JSON.stringify(mediaMeta.map((m) => m.poster || "")),
    );

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/project_upload`,
        { method: "POST", body: fd },
      );
      if (!res.ok) throw new Error(await res.text());
      toast(`Project uploaded with ${mediaFiles.length} media file(s)!`);
      reset();
      setMediaFiles([]);
      setMediaMeta([]);
    } catch (err) {
      toast(err.message || "Upload failed", "error");
    }
  };

  // ── Media file picker ──
  const handleFilePick = (e, forEdit = false) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    const newMeta = picked.map((f) => ({
      label: f.name.replace(/\.[^.]+$/, ""),
      type: f.type.startsWith("video/") ? "video" : "image",
      poster: "",
    }));
    if (forEdit) {
      setEditMediaFiles((p) => [...p, ...picked]);
      setEditMediaMeta((p) => [...p, ...newMeta]);
    } else {
      setMediaFiles((p) => [...p, ...picked]);
      setMediaMeta((p) => [...p, ...newMeta]);
    }
    e.target.value = "";
  };

  const handleMetaChange = (i, key, val, forEdit = false) => {
    if (forEdit) {
      setEditMediaMeta((p) =>
        p.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)),
      );
    } else {
      setMediaMeta((p) =>
        p.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)),
      );
    }
  };

  const removeMediaFile = (i, forEdit = false) => {
    if (forEdit) {
      setEditMediaFiles((p) => p.filter((_, idx) => idx !== i));
      setEditMediaMeta((p) => p.filter((_, idx) => idx !== i));
    } else {
      setMediaFiles((p) => p.filter((_, idx) => idx !== i));
      setMediaMeta((p) => p.filter((_, idx) => idx !== i));
    }
  };

  // ── Edit ──
  const startEdit = (project) => {
    setEditingId(project._id);
    setEditData({
      title: project.title,
      description: project.description || "",
      category: project.category,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      order: project.order || "",
      isLocal: project.isLocal || false,
      modelAccuracy: project.modelAccuracy || "",
      modelFeatures: project.modelFeatures || "",
    });
    setEditMediaFiles([]);
    setEditMediaMeta([]);
    setReplaceMedia(false);
  };

  const saveEdit = async (projectId) => {
    const fd = new FormData();
    Object.entries(editData).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    });
    fd.append("replaceMedia", replaceMedia ? "true" : "false");

    if (editMediaFiles.length > 0) {
      editMediaFiles.forEach((f) => fd.append("media", f));
      fd.append(
        "mediaLabels",
        JSON.stringify(editMediaMeta.map((m) => m.label || "")),
      );
      fd.append(
        "mediaTypes",
        JSON.stringify(editMediaMeta.map((m) => m.type || "image")),
      );
      fd.append(
        "mediaPosters",
        JSON.stringify(editMediaMeta.map((m) => m.poster || "")),
      );
    }
    setIsSaving(true);
    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/${projectId}`,
        { method: "PUT", body: fd },
      );
      if (!res.ok) throw new Error(await res.text());
      toast("Project updated successfully!");
      setEditingId(null);
      setEditData(null);
      await fetchProjects();
    } catch (err) {
      toast(err.message || "Update failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete project ──
  const deleteProject = async (id) => {
    if (!confirm("Delete this project and all its media?")) return;
    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/${id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error();
      toast("Project deleted");
      await fetchProjects();
    } catch {
      toast("Delete failed", "error");
    }
  };

  // ── Delete single media item ──
  const deleteMedia = async (projectId, mediaIndex) => {
    if (!confirm("Remove this media item?")) return;
    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/${projectId}/media/${mediaIndex}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error();
      toast("Media removed");
      await fetchProjects();
    } catch {
      toast("Failed to remove media", "error");
    }
  };

  const filtered = projects.filter((p) => {
    const s = searchTerm.toLowerCase();
    const matchSearch =
      p.title?.toLowerCase().includes(s) ||
      p.description?.toLowerCase().includes(s);
    const matchCat = filterCat === "ALL" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const selectedCategory = watch("category");

  // ── Shared input classes ──
  const inp =
    "w-full bg-slate-900/60 border border-slate-700/50 text-white placeholder-slate-500 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all";
  const lbl =
    "block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div
      className="min-h-screen text-white"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <Toast toasts={toasts} />

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-4">
            <Layers size={13} className="text-violet-400" />
            <span className="text-xs font-mono text-violet-300 tracking-widest uppercase">
              Admin Panel
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight text-white mb-1"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Project Manager
          </h1>
          <p className="text-slate-400 text-sm">
            Manage your portfolio projects and media
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: "manager", icon: FolderKanban, label: "Manager" },
            { id: "upload", icon: Upload, label: "Upload" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                activeTab === tab.id
                  ? "bg-violet-600/30 border-violet-500/40 text-violet-200 shadow-lg shadow-violet-500/10"
                  : "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════
            MANAGER TAB
        ════════════════════════════════════════════ */}
        {activeTab === "manager" && (
          <div>
            {/* Search + filter toolbar */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search projects…"
                  className={`${inp} pl-9`}
                />
              </div>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="bg-slate-900/60 border border-slate-700/50 text-slate-300 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Other">Other</option>
              </select>
              <button
                onClick={fetchProjects}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 text-slate-300 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
                {loading ? "Loading…" : "Refresh"}
              </button>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Total", val: projects.length, color: "violet" },
                {
                  label: "Web",
                  val: projects.filter((p) => p.category === "Web Development")
                    .length,
                  color: "cyan",
                },
                {
                  label: "ML / AI",
                  val: projects.filter((p) => p.category === "Machine Learning")
                    .length,
                  color: "amber",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-slate-900/40 border border-slate-800/60 rounded-xl px-4 py-3 text-center"
                >
                  <div className={`text-2xl font-black text-${s.color}-400`}>
                    {s.val}
                  </div>
                  <div className="text-xs text-slate-500 font-mono uppercase tracking-wider mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Projects list */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-2 border-transparent border-t-violet-500 border-r-cyan-400 rounded-full animate-spin" />
                  <div
                    className="absolute inset-2.5 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin"
                    style={{ animationDirection: "reverse" }}
                  />
                </div>
                <p className="text-slate-500 text-sm font-mono">
                  Fetching projects…
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-16 text-center">
                <div className="text-4xl mb-3">📁</div>
                <p className="text-slate-300 font-semibold mb-1">
                  No projects found
                </p>
                <p className="text-slate-500 text-sm">
                  {searchTerm || filterCat !== "ALL"
                    ? "Try adjusting filters"
                    : "Upload your first project"}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((project) => (
                  <div
                    key={project._id}
                    className={`bg-slate-900/40 border rounded-2xl overflow-hidden transition-all duration-300 ${editingId === project._id ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : "border-slate-800/50 hover:border-slate-700/50"}`}
                  >
                    {editingId === project._id ? (
                      /* ── EDIT MODE ── */
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-violet-400 rounded-full" />
                            <h3 className="text-base font-bold text-white">
                              Editing Project
                            </h3>
                          </div>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditData(null);
                            }}
                            className="p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Title */}
                          <div>
                            <label className={lbl}>Title *</label>
                            <input
                              value={editData.title}
                              onChange={(e) =>
                                setEditData((p) => ({
                                  ...p,
                                  title: e.target.value,
                                }))
                              }
                              className={inp}
                            />
                          </div>

                          {/* Category */}
                          <div>
                            <label className={lbl}>Category *</label>
                            <select
                              value={editData.category}
                              onChange={(e) =>
                                setEditData((p) => ({
                                  ...p,
                                  category: e.target.value,
                                }))
                              }
                              className={inp + " cursor-pointer"}
                            >
                              <option value="Web Development">
                                Web Development
                              </option>
                              <option value="Machine Learning">
                                Machine Learning
                              </option>
                              <option value="Data Science">Data Science</option>
                              <option value="Mobile App">Mobile App</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          {/* Technologies */}
                          <div>
                            <label className={lbl}>Technologies</label>
                            <input
                              value={editData.technologies}
                              onChange={(e) =>
                                setEditData((p) => ({
                                  ...p,
                                  technologies: e.target.value,
                                }))
                              }
                              placeholder="React, Node.js, …"
                              className={inp}
                            />
                          </div>

                          {/* Order */}
                          <div>
                            <label className={lbl}>Display Order</label>
                            <input
                              type="number"
                              value={editData.order}
                              onChange={(e) =>
                                setEditData((p) => ({
                                  ...p,
                                  order: e.target.value,
                                }))
                              }
                              className={inp}
                            />
                          </div>

                          {/* Live URL */}
                          <div>
                            <label className={lbl}>Live URL</label>
                            <input
                              type="url"
                              value={editData.liveUrl}
                              onChange={(e) =>
                                setEditData((p) => ({
                                  ...p,
                                  liveUrl: e.target.value,
                                }))
                              }
                              placeholder="https://…"
                              className={inp}
                            />
                          </div>

                          {/* GitHub URL */}
                          <div>
                            <label className={lbl}>GitHub URL</label>
                            <input
                              type="url"
                              value={editData.githubUrl}
                              onChange={(e) =>
                                setEditData((p) => ({
                                  ...p,
                                  githubUrl: e.target.value,
                                }))
                              }
                              placeholder="https://github.com/…"
                              className={inp}
                            />
                          </div>

                          {/* ML-only fields */}
                          {editData.category === "Machine Learning" && (
                            <>
                              <div>
                                <label className={lbl}>
                                  Model Accuracy (%)
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={editData.modelAccuracy}
                                  onChange={(e) =>
                                    setEditData((p) => ({
                                      ...p,
                                      modelAccuracy: e.target.value,
                                    }))
                                  }
                                  placeholder="94.3"
                                  className={inp}
                                />
                              </div>
                              <div>
                                <label className={lbl}>No. of Features</label>
                                <input
                                  type="number"
                                  value={editData.modelFeatures}
                                  onChange={(e) =>
                                    setEditData((p) => ({
                                      ...p,
                                      modelFeatures: e.target.value,
                                    }))
                                  }
                                  placeholder="12"
                                  className={inp}
                                />
                              </div>
                            </>
                          )}

                          {/* isLocal toggle */}
                          <div className="flex items-center gap-3 col-span-2">
                            <input
                              type="checkbox"
                              id="editIsLocal"
                              checked={editData.isLocal}
                              onChange={(e) =>
                                setEditData((p) => ({
                                  ...p,
                                  isLocal: e.target.checked,
                                }))
                              }
                              className="w-4 h-4 accent-violet-500 cursor-pointer"
                            />
                            <label
                              htmlFor="editIsLocal"
                              className="text-sm text-slate-300 cursor-pointer"
                            >
                              This is a{" "}
                              <span className="text-amber-300">
                                locally-run model
                              </span>{" "}
                              (no live demo)
                            </label>
                          </div>

                          {/* Description */}
                          <div className="col-span-2">
                            <div className="flex items-center justify-between mb-1.5">
                              <label className={lbl.replace("mb-1.5", "")}>
                                Description
                              </label>
                              <span
                                className={`text-[10px] font-mono ${editData.description?.trim().split(/\s+/).filter(Boolean).length > 65 ? "text-red-400" : "text-slate-500"}`}
                              >
                                {editData.description
                                  ?.trim()
                                  .split(/\s+/)
                                  .filter(Boolean).length || 0}{" "}
                                / 65 words
                              </span>
                            </div>
                            <textarea
                              value={editData.description}
                              rows={3}
                              onChange={(e) =>
                                setEditData((p) => ({
                                  ...p,
                                  description: e.target.value,
                                }))
                              }
                              className={inp + " resize-none"}
                            />
                          </div>
                        </div>

                        {/* ── Media section ── */}
                        <div className="mt-5 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Film size={14} className="text-violet-400" />
                              <span className="text-sm font-semibold text-slate-200">
                                Media
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                                {project.media?.length || 0} current
                              </span>
                            </div>
                            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                              <Plus size={12} /> Add Files
                              <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFilePick(e, true)}
                              />
                            </label>
                          </div>

                          {/* Current media preview */}
                          {project.media?.length > 0 && (
                            <div className="mb-3">
                              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2">
                                Current media
                              </p>
                              <MediaGallery
                                media={project.media}
                                projectId={project._id}
                                onDeleteMedia={deleteMedia}
                              />
                            </div>
                          )}

                          {/* New files queue */}
                          {editMediaFiles.length > 0 && (
                            <div className="space-y-2 mt-3">
                              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-2">
                                New files to add
                              </p>
                              {editMediaFiles.map((f, i) => (
                                <MediaFileItem
                                  key={i}
                                  file={f}
                                  index={i}
                                  meta={editMediaMeta[i] || {}}
                                  onMetaChange={(idx, k, v) =>
                                    handleMetaChange(idx, k, v, true)
                                  }
                                  onRemove={(i) => removeMediaFile(i, true)}
                                />
                              ))}
                            </div>
                          )}

                          {/* Replace toggle */}
                          {editMediaFiles.length > 0 && (
                            <label className="flex items-center gap-2 mt-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={replaceMedia}
                                onChange={(e) =>
                                  setReplaceMedia(e.target.checked)
                                }
                                className="w-3.5 h-3.5 accent-red-500"
                              />
                              <span className="text-xs text-slate-400">
                                <span className="text-red-400 font-medium">
                                  Replace
                                </span>{" "}
                                existing media (deletes current files from
                                Cloudinary)
                              </span>
                            </label>
                          )}
                        </div>

                        {/* Action buttons */}
                        <button
                          onClick={() => saveEdit(project._id)}
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-500/20"
                        >
                          {isSaving ? (
                            <>
                              <svg
                                className="w-3.5 h-3.5 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8z"
                                />
                              </svg>
                              Saving…
                            </>
                          ) : (
                            <>
                              <Save size={15} /> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      /* ── VIEW MODE ── */
                      <div className="flex gap-4 p-4">
                        {/* Media gallery */}
                        <div className="flex-shrink-0 w-48">
                          <MediaGallery media={project.media} compact />
                          {project.media?.length > 0 && (
                            <div className="mt-1 text-center">
                              <span className="text-[9px] font-mono text-slate-600">
                                {project.media.length} file
                                {project.media.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-base font-bold text-white leading-tight line-clamp-2">
                              {project.title}
                            </h3>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => startEdit(project)}
                                className="p-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded-lg transition-all border border-violet-500/20"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => deleteProject(project._id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${project.category === "Machine Learning" ? "bg-violet-500/10 border-violet-500/20 text-violet-300" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"}`}
                            >
                              {project.category}
                            </span>
                            {project.isLocal && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-amber-500/10 border-amber-500/20 text-amber-300">
                                Local Model
                              </span>
                            )}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-slate-800 border-slate-700 text-slate-400">
                              Order: {project.order ?? "—"}
                            </span>
                          </div>

                          {/* Tech chips */}
                          {project.technologies?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {(Array.isArray(project.technologies)
                                ? project.technologies
                                : project.technologies.split(",")
                              )
                                .slice(0, 5)
                                .map((t, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-md font-mono"
                                  >
                                    {t.trim()}
                                  </span>
                                ))}
                            </div>
                          )}

                          {/* ML stats */}
                          {project.category === "Machine Learning" && (
                            <div className="flex gap-3 mb-3">
                              {project.modelAccuracy && (
                                <span className="text-[10px] text-amber-400 font-mono">
                                  📊 {project.modelAccuracy}%
                                </span>
                              )}
                              {project.modelFeatures && (
                                <span className="text-[10px] text-amber-400 font-mono">
                                  ⚡ {project.modelFeatures} feat.
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex gap-3">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs transition-colors"
                              >
                                <ExternalLink size={11} /> Live Demo
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-slate-400 hover:text-white text-xs transition-colors"
                              >
                                <Github size={11} /> GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════
            UPLOAD TAB
        ════════════════════════════════════════════ */}
        {activeTab === "upload" && (
          <div className="max-w-3xl mx-auto">
            <div
              className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 md:p-8"
              style={{
                boxShadow:
                  "0 24px 48px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Upload size={18} className="text-violet-400" />
                New Project
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label className={lbl}>Project Title *</label>
                    <input
                      className={inp}
                      placeholder="My Awesome Project"
                      {...register("title", { required: "Required" })}
                    />
                    {errors.title && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Technologies */}
                  <div>
                    <label className={lbl}>Technologies</label>
                    <input
                      className={inp}
                      placeholder="React, Node.js, Python…"
                      {...register("technologies")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Category */}
                  <div>
                    <label className={lbl}>Category *</label>
                    <select
                      className={inp + " cursor-pointer"}
                      {...register("category", { required: "Required" })}
                    >
                      <option value="">Select…</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Live URL */}
                  <div>
                    <label className={lbl}>Live URL</label>
                    <input
                      type="url"
                      className={inp}
                      placeholder="https://…"
                      {...register("liveUrl")}
                    />
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className={lbl}>GitHub URL</label>
                    <input
                      type="url"
                      className={inp}
                      placeholder="https://github.com/…"
                      {...register("githubUrl")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Display Order</label>
                    <input
                      type="number"
                      min="1"
                      className={inp}
                      placeholder="1"
                      {...register("order")}
                    />
                  </div>

                  {/* isLocal */}
                  <div className="flex items-center gap-3 pt-5">
                    <input
                      type="checkbox"
                      id="isLocal"
                      className="w-4 h-4 accent-violet-500 cursor-pointer"
                      {...register("isLocal")}
                    />
                    <label
                      htmlFor="isLocal"
                      className="text-sm text-slate-300 cursor-pointer"
                    >
                      Local-only model{" "}
                      <span className="text-amber-400">(no live URL)</span>
                    </label>
                  </div>
                </div>

                {/* ML-only fields */}
                {selectedCategory === "Machine Learning" && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-violet-500/5 border border-violet-500/15 rounded-xl">
                    <div>
                      <label className={lbl}>Model Accuracy (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        className={inp}
                        placeholder="94.3"
                        {...register("modelAccuracy")}
                      />
                    </div>
                    <div>
                      <label className={lbl}>No. of Features</label>
                      <input
                        type="number"
                        className={inp}
                        placeholder="12"
                        {...register("modelFeatures")}
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={lbl.replace("mb-1.5", "")}>
                      Description
                    </label>
                    <span
                      className={`text-[10px] font-mono ${descWords > 65 ? "text-red-400" : "text-slate-500"}`}
                    >
                      {descWords} / 65 words
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    className={inp + " resize-none"}
                    placeholder="Describe your project in up to 65 words…"
                    {...register("description", {
                      validate: (v) => {
                        const w =
                          v?.trim().split(/\s+/).filter(Boolean).length || 0;
                        return w <= 65 || "Max 65 words";
                      },
                    })}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* ── Media uploader ── */}
                <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Film size={14} className="text-violet-400" />
                      <span className="text-sm font-semibold text-slate-200">
                        Project Media
                      </span>
                      {mediaFiles.length > 0 && (
                        <span className="text-[10px] font-mono text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                          {mediaFiles.length} file
                          {mediaFiles.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                      <Plus size={12} /> Add Images / Videos
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFilePick(e, false)}
                      />
                    </label>
                  </div>

                  {mediaFiles.length === 0 ? (
                    <label className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-700 hover:border-violet-500/50 rounded-xl cursor-pointer transition-colors group">
                      <ImageIcon
                        size={20}
                        className="text-slate-600 group-hover:text-violet-400 transition-colors"
                      />
                      <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                        Drop images & videos here, or click to browse
                      </span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFilePick(e, false)}
                      />
                    </label>
                  ) : (
                    <div className="space-y-2">
                      {mediaFiles.map((f, i) => (
                        <MediaFileItem
                          key={i}
                          file={f}
                          index={i}
                          meta={mediaMeta[i] || {}}
                          onMetaChange={(idx, k, v) =>
                            handleMetaChange(idx, k, v, false)
                          }
                          onRemove={(i) => removeMediaFile(i, false)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || mediaFiles.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-violet-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />{" "}
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload size={15} /> Upload Project
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
