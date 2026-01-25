"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FolderKanban,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  X,
  Save,
} from "lucide-react";
import useApi from "@/services/authservices";

export default function ProjectManagerDashboard() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [buttonText, setButtonText] = useState("UPLOAD");
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("manager");
  const [descriptionWords, setDescriptionWords] = useState(0);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [editDescWords, setEditDescWords] = useState(0);
  const [editImageFile, setEditImageFile] = useState(null);
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

  const onSubmit = async (data) => {
    setButtonText("Uploading...");
    const formData = new FormData();

    formData.append("category", data.category);
    formData.append("title", data.title);
    formData.append("technologies", data.technologies || "");
    formData.append("image", data.image[0]);
    formData.append("liveUrl", data.liveUrl || "");
    formData.append("githubUrl", data.githubUrl || "");
    formData.append("order", data.order || "");
    formData.append("description", data.description || "");

    try {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/project_upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      reset();
      setButtonText("Uploaded Successfully");
      setTimeout(() => setButtonText("UPLOAD"), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setButtonText("Upload Failed");
      setTimeout(() => setButtonText("UPLOAD"), 3000);
    }
  };

  useEffect(() => {
    if (activeTab === "manager") {
      fetchProjects();
    }
  }, [activeTab]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/portfolio/projects`,
      );
      const data = await response.json();
      setProjects(data.data || data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project._id);
    setEditFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies,
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      order: project.order || "",
    });
    const words = project.description
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    setEditDescWords(words);
    setEditImageFile(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "description") {
      const words = value.trim().split(/\s+/).filter(Boolean).length;
      setEditDescWords(words);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
    }
  };

  const handleProjectChange = async (projectId, changes) => {
    try {
      let requestBody;
      let headers = {};

      if (editImageFile) {
        const formData = new FormData();

        Object.keys(changes).forEach((key) => {
          if (changes[key] !== undefined && changes[key] !== null) {
            formData.append(key, changes[key]);
          }
        });

        // Append the image file
        formData.append("image", editImageFile);

        requestBody = formData;
        // Don't set Content-Type header - browser will set it with boundary
      } else {
        requestBody = JSON.stringify(changes);
        headers["Content-Type"] = "application/json";
      }

      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/${projectId}`,
        {
          method: "PUT",
          headers: headers,
          body: requestBody,
        },
      );

      if (response.ok) {
        setEditingProject(null);
        setEditFormData(null);
        setEditImageFile(null);
        await fetchProjects();
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await apiFetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/project/${projectId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(project.technologies)
        ? project.technologies.join(" ")
        : project.technologies || ""
      )
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "ALL" || project.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Theme-based styles
  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "from-slate-950 via-purple-950 to-slate-950"
    : "from-blue-50 via-purple-50 to-pink-50";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-700";
  const textLabel = isDark ? "text-slate-300" : "text-gray-700";
  const textMuted = isDark ? "text-slate-400" : "text-gray-600";
  const cardBg = isDark
    ? "bg-slate-800/50 border-slate-700/50"
    : "bg-white border-purple-200";
  const inputBg = isDark
    ? "bg-slate-900/50 border-slate-600/50"
    : "bg-white border-purple-300";
  const inputFocus = isDark
    ? "focus:border-purple-500 focus:ring-purple-500/50"
    : "focus:border-purple-400 focus:ring-purple-400/50";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark
    ? "placeholder-slate-500"
    : "placeholder-gray-400";
  const selectBg = isDark ? "bg-slate-800" : "bg-white";
  const buttonPrimary = isDark
    ? "bg-purple-600 hover:bg-purple-700"
    : "bg-purple-500 hover:bg-purple-600";
  const errorText = isDark ? "text-red-400" : "text-red-500";
  const fileButtonBg = isDark
    ? "file:bg-purple-600 hover:file:bg-purple-700"
    : "file:bg-purple-500 hover:file:bg-purple-600";
  const tabActive = isDark
    ? "bg-purple-600 text-white"
    : "bg-purple-500 text-white";
  const tabInactive = isDark
    ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
    : "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1
            className={`text-3xl md:text-4xl font-bold ${textPrimary} text-center transition-colors mb-4`}
          >
            Project Management
          </h1>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-3 mb-3">
            <button
              onClick={() => setActiveTab("manager")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === "manager" ? tabActive : tabInactive}`}
            >
              <FolderKanban size={20} />
              Project Manager
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === "upload" ? tabActive : tabInactive}`}
            >
              <Upload size={20} />
              Upload Project
            </button>
          </div>
        </div>

        {/* Project Manager Tab */}
        {activeTab === "manager" && (
          <div>
            <p
              className={`text-center ${textSecondary} mb-6 transition-colors`}
            >
              Manage and organize your portfolio projects
            </p>

            {/* Search and Filter Bar */}
            <div
              className={`${cardBg} rounded-lg shadow-lg p-4 mb-6 transition-colors border`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textMuted}`}
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border ${inputBg} ${inputText} ${placeholderColor} rounded-lg focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`px-4 py-2.5 text-sm border ${inputBg} ${inputText} rounded-lg focus:outline-none ${inputFocus} focus:ring-1 transition-all cursor-pointer`}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Other">Other</option>
                </select>

                {/* Refresh Button */}
                <button
                  onClick={fetchProjects}
                  disabled={loadingProjects}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm ${buttonPrimary} text-white rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <svg
                    className={`w-4 h-4 ${loadingProjects ? "animate-spin" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {loadingProjects ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            {/* Projects List */}
            {loadingProjects ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                  <p className={`${textMuted} text-lg`}>Loading projects...</p>
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div
                className={`${cardBg} rounded-xl shadow-lg p-12 text-center border transition-colors`}
              >
                <div className="text-5xl mb-4">📁</div>
                <h3 className={`text-xl font-bold ${textPrimary} mb-2`}>
                  No projects found
                </h3>
                <p className={`${textMuted}`}>
                  {searchTerm || filterCategory !== "ALL"
                    ? "Try adjusting your search or filter"
                    : "Start by uploading your first project"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className={`${cardBg} rounded-lg shadow-lg border transition-all duration-300 overflow-hidden ${
                      editingProject === project._id
                        ? "ring-2 ring-purple-500"
                        : ""
                    }`}
                  >
                    {editingProject === project._id ? (
                      // Edit Mode
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className={`text-lg font-bold ${textPrimary}`}>
                            Edit Project
                          </h3>
                          <button
                            onClick={() => {
                              setEditingProject(null);
                              setEditFormData(null);
                            }}
                            className={`${textMuted} hover:${textPrimary} transition-colors`}
                          >
                            <X size={20} />
                          </button>
                        </div>

                        <div className="space-y-4">
                          {/* Title */}
                          <div>
                            <label
                              className={`block ${textLabel} text-sm font-medium mb-1.5`}
                            >
                              Title *
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={editFormData.title}
                              onChange={handleEditInputChange}
                              className={`w-full ${inputBg} border px-3 py-2 rounded-lg ${inputText} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                            />
                          </div>

                          {/* Category and Order */}
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label
                                className={`block ${textLabel} text-sm font-medium mb-1.5`}
                              >
                                Category *
                              </label>
                              <select
                                name="category"
                                value={editFormData.category}
                                onChange={handleEditInputChange}
                                className={`w-full ${inputBg} border px-3 py-2 rounded-lg ${inputText} focus:outline-none ${inputFocus} focus:ring-1 transition-all cursor-pointer`}
                              >
                                <option value="Web Development">
                                  Web Development
                                </option>
                                <option value="Machine Learning">
                                  Machine Learning
                                </option>
                                <option value="Data Science">
                                  Data Science
                                </option>
                                <option value="Mobile App">Mobile App</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label
                                className={`block ${textLabel} text-sm font-medium mb-1.5`}
                              >
                                Update Project Image (Optional)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={`w-full ${inputBg} border px-3 py-2 rounded-lg ${textSecondary} file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 ${fileButtonBg} file:text-white file:text-sm file:font-medium file:cursor-pointer focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                              />
                              <p className={`${textMuted} text-xs mt-1`}>
                                Leave empty to keep current image
                              </p>
                            </div>
                            <div>
                              <label
                                className={`block ${textLabel} text-sm font-medium mb-1.5`}
                              >
                                Order
                              </label>
                              <input
                                type="number"
                                name="order"
                                min="1"
                                value={editFormData.order}
                                onChange={handleEditInputChange}
                                className={`w-full ${inputBg} border px-3 py-2 rounded-lg ${inputText} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                              />
                            </div>
                          </div>

                          {/* Technologies */}
                          <div>
                            <label
                              className={`block ${textLabel} text-sm font-medium mb-1.5`}
                            >
                              Technologies
                            </label>
                            <input
                              type="text"
                              name="technologies"
                              value={editFormData.technologies}
                              onChange={handleEditInputChange}
                              placeholder="React, Node.js, MongoDB"
                              className={`w-full ${inputBg} border px-3 py-2 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                            />
                          </div>

                          {/* URLs */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label
                                className={`block ${textLabel} text-sm font-medium mb-1.5`}
                              >
                                Live URL
                              </label>
                              <input
                                type="url"
                                name="liveUrl"
                                value={editFormData.liveUrl}
                                onChange={handleEditInputChange}
                                placeholder="https://example.com"
                                className={`w-full ${inputBg} border px-3 py-2 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                              />
                            </div>

                            <div>
                              <label
                                className={`block ${textLabel} text-sm font-medium mb-1.5`}
                              >
                                GitHub URL
                              </label>
                              <input
                                type="url"
                                name="githubUrl"
                                value={editFormData.githubUrl}
                                onChange={handleEditInputChange}
                                placeholder="https://github.com/..."
                                className={`w-full ${inputBg} border px-3 py-2 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label
                                className={`block ${textLabel} text-sm font-medium`}
                              >
                                Description
                              </label>
                              <span
                                className={`text-xs ${
                                  editDescWords > 65
                                    ? errorText
                                    : editDescWords > 60
                                      ? "text-yellow-500"
                                      : textMuted
                                }`}
                              >
                                {editDescWords} / 65 words
                              </span>
                            </div>
                            <textarea
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditInputChange}
                              rows={3}
                              className={`w-full ${inputBg} border px-3 py-2 rounded-lg ${inputText} focus:outline-none ${inputFocus} focus:ring-1 transition-all resize-none ${
                                editDescWords > 65 ? "border-red-500" : ""
                              }`}
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() =>
                                handleProjectChange(project._id, editFormData)
                              }
                              disabled={editDescWords > 65}
                              className={`flex-1 ${buttonPrimary} text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              <Save size={18} />
                              Save Changes
                            </button>
                            <button
                              onClick={() => {
                                setEditingProject(null);
                                setEditFormData(null);
                                setEditImageFile(null);
                              }}
                              className={`px-6 py-2 ${isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-300 hover:bg-gray-400"} ${textPrimary} rounded-lg font-medium transition-all`}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex gap-4 p-4">
                        {/* Project Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-32 h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                        </div>

                        {/* Project Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3
                              className={`text-lg font-bold ${textPrimary} line-clamp-2`}
                              title={project.title}
                            >
                              {project.title}
                            </h3>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleEditClick(project)}
                                className={`p-2 ${isDark ? "bg-purple-900/30 hover:bg-purple-900/50" : "bg-purple-100 hover:bg-purple-200"} ${isDark ? "text-purple-400" : "text-purple-600"} rounded-lg transition-all`}
                                title="Edit project"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project._id)}
                                className={`p-2 ${isDark ? "bg-red-900/30 hover:bg-red-900/50" : "bg-red-100 hover:bg-red-200"} ${isDark ? "text-red-400" : "text-red-600"} rounded-lg transition-all`}
                                title="Delete project"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                          <p
                            className={`${textMuted} text-sm mb-3 line-clamp-2`}
                            title={project.description}
                          >
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? "bg-purple-900/30 text-purple-300 border border-purple-700" : "bg-purple-100 text-purple-700 border border-purple-200"}`}
                            >
                              {project.category}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? "bg-blue-900/30 text-blue-300 border border-blue-700" : "bg-blue-100 text-blue-700 border border-blue-200"}`}
                            >
                              Order: {project.order || "N/A"}
                            </span>
                          </div>

                          {/* Technologies */}
                          {project.technologies && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {(Array.isArray(project.technologies)
                                ? project.technologies
                                : project.technologies.split(",")
                              ).map((tech, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 rounded text-xs ${isDark ? "bg-slate-700 text-slate-300" : "bg-gray-200 text-gray-700"}`}
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Links */}
                          <div className="flex gap-3">
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-1.5 text-sm ${isDark ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-700"} transition-colors`}
                              >
                                <ExternalLink size={16} />
                                Live Demo
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-1.5 text-sm ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"} transition-colors`}
                              >
                                <Github size={16} />
                                GitHub
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

        {/* Upload Project Tab */}
        {activeTab === "upload" && (
          <div>
            <p
              className={`text-center ${textSecondary} mb-4 transition-colors`}
            >
              Add a new project to your portfolio
            </p>

            <div
              className={`${cardBg} backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 border transition-colors max-w-5xl mx-auto`}
            >
              <h2
                className={`text-2xl font-bold ${textPrimary} text-center mb-8 tracking-tight`}
              >
                Enter Project Details
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-5">
                  {/* Title */}
                  <div className="mb-5">
                    <label
                      className={`block ${textLabel} font-medium mb-2 text-sm`}
                    >
                      Project Title *
                    </label>
                    <input
                      type="text"
                      className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                      {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                      <p className={`${errorText} text-xs mt-1.5`}>
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Technologies */}
                  <div className="mb-5">
                    <label
                      className={`block ${textLabel} font-medium mb-2 text-sm`}
                    >
                      Technologies
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React, Node.js"
                      className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                      {...register("technologies")}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category */}
                    <div>
                      <label
                        className={`block ${textLabel} font-medium mb-2 text-sm`}
                      >
                        Category *
                      </label>
                      <select
                        className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} focus:outline-none ${inputFocus} focus:ring-1 transition-all cursor-pointer`}
                        {...register("category", {
                          required: "Category is required",
                        })}
                      >
                        <option value="" className={selectBg}>
                          Select Category
                        </option>
                        <option value="Web Development" className={selectBg}>
                          Web Development
                        </option>
                        <option value="Machine Learning" className={selectBg}>
                          Machine Learning
                        </option>
                        <option value="Data Science" className={selectBg}>
                          Data Science
                        </option>
                        <option value="Mobile App" className={selectBg}>
                          Mobile App
                        </option>
                        <option value="Other" className={selectBg}>
                          Other
                        </option>
                      </select>
                      {errors.category && (
                        <p className={`${errorText} text-xs mt-1.5`}>
                          {errors.category.message}
                        </p>
                      )}
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label
                        className={`block ${textLabel} font-medium mb-2 text-sm`}
                      >
                        Project Image *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className={`w-full ${inputBg} border px-4 py-2 rounded-lg ${textSecondary} file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 ${fileButtonBg} file:text-white file:text-sm file:font-medium file:cursor-pointer focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                        {...register("image", {
                          required: "Image is required",
                        })}
                      />
                      {errors.image && (
                        <p className={`${errorText} text-xs mt-1.5`}>
                          {errors.image.message}
                        </p>
                      )}
                    </div>

                    {/* Display Order */}
                    <div>
                      <label
                        className={`block ${textLabel} font-medium mb-2 text-sm`}
                      >
                        Display Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="1"
                        className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                        {...register("order")}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {/* Live URL */}
                  <div className="mb-5">
                    <label
                      className={`block ${textLabel} font-medium mb-2 text-sm`}
                    >
                      Live URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                      {...register("liveUrl")}
                    />
                  </div>

                  {/* GitHub URL */}
                  <div className="mb-5">
                    <label
                      className={`block ${textLabel} font-medium mb-2 text-sm`}
                    >
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/repo"
                      className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all`}
                      {...register("githubUrl")}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className={`block ${textLabel} font-medium text-sm`}>
                      Description
                    </label>
                    <span
                      className={`text-xs ${
                        descriptionWords > 65
                          ? errorText
                          : descriptionWords > 60
                            ? "text-yellow-500"
                            : textMuted
                      }`}
                    >
                      {descriptionWords} / 65 words
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Describe your project..."
                    className={`w-full ${inputBg} border px-4 py-2.5 rounded-lg ${inputText} ${placeholderColor} focus:outline-none ${inputFocus} focus:ring-1 transition-all resize-none ${
                      descriptionWords > 65 ? "border-red-500" : ""
                    }`}
                    {...register("description", {
                      validate: (value) => {
                        const words = value
                          .trim()
                          .split(/\s+/)
                          .filter(Boolean).length;
                        if (words > 65)
                          return "Description must be 65 words or less";
                        return true;
                      },
                    })}
                    onChange={(e) => {
                      const words = e.target.value
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean).length;
                      setDescriptionWords(words);
                      register("description").onChange(e);
                    }}
                  />
                  {errors.description && (
                    <p className={`${errorText} text-xs mt-1.5`}>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className={`w-full ${buttonPrimary} text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {buttonText}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
