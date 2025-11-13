"use client";
import React, { useEffect, useState } from "react";
import Projects from "./Project";
import { PortfolioApiService } from "@/services/PortfolioApiService";

export default function Page() {
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await PortfolioApiService.fetchProjects();
        setProjectsData(data || []);
      } catch (error) {
        console.error("❌ Error fetching projects data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-400">
        <p>Loading projects...</p>
      </main>
    );
  }

  if (!projectsData.length) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-400">
        <p>🚧 No projects available.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Projects projectsData={projectsData} />
    </main>
  );
}
