"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Cpu, GitBranch, ExternalLink, Users, ArrowLeft, FolderGit2, Sparkles, CheckCircle2, Clock } from "lucide-react";
import DirectoryNavbar from "../../components/directory/DirectoryNavbar";
import { useThemeManager } from "../../hooks/useThemeManager";
import Avatar from "../../components/common/Avatar";

interface ProjectParticipant {
  memberId: string;
  name: string;
  email: string;
  major: string;
  roleTitle: string;
  resumeId?: string;
}

interface IEEEProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  repositoryUrl?: string;
  demoUrl?: string;
  active: boolean;
  participants: ProjectParticipant[];
}

function IEEEProjectsContent() {
  const { theme, toggleTheme } = useThemeManager();
  const [projects, setProjects] = useState<IEEEProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/ieee-projects");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProjects(json.data);
        }
      } catch (err) {
        console.error("Failed to load IEEE projects:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-zinc-955 text-zinc-200 relative pb-16 overflow-x-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="circuit-overlay"></div>
      </div>

      {/* Primary Header Navbar */}
      <DirectoryNavbar
        role="admin"
        theme={theme}
        roleDropdownOpen={false}
        setRoleDropdownOpen={() => {}}
        toggleTheme={toggleTheme}
        handleRoleChange={() => {}}
      />

      {/* Hero Header Banner */}
      <div className="w-full bg-zinc-900/80 border-b border-zinc-800 py-10 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold mb-3 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Member Catalog Directory</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-955 shadow-lg">
                <FolderGit2 size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-black text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                  IEEE UCF Chapter Projects
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 mt-1 leading-relaxed max-w-2xl">
                  Explore hands-on hardware builds, autonomous robotics, FPGA accelerators, and full-stack software built by IEEE UCF members.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3 shadow-inner">
              <div className="text-center">
                <span className="block text-lg font-black text-amber-400 leading-none">{projects.length}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 pt-8 flex flex-col gap-6 relative z-10">
        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-4">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider pr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-amber-500 text-zinc-955 shadow-md font-extrabold"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="h-64 glass-panel rounded-2xl animate-shimmer" />
            <div className="h-64 glass-panel rounded-2xl animate-shimmer" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-6 rounded-2xl glass-panel border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between gap-5 relative group shadow-xl"
              >
                <div className="flex flex-col gap-3">
                  {/* Category & Status badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                        project.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}
                    >
                      {project.status === "Completed" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-black text-zinc-100 group-hover:text-amber-400 transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    {project.description}
                  </p>
                </div>

                {/* Team Roster */}
                <div className="flex flex-col gap-2 pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-amber-500" />
                      Student Team Roster ({project.participants.length})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.participants.map((part) => (
                      <div
                        key={part.memberId}
                        className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-medium"
                      >
                        <Avatar name={part.name} size="sm" />
                        <div>
                          <span className="block font-bold text-zinc-200 leading-tight">{part.name}</span>
                          <span className="block text-[9.5px] text-amber-500 font-semibold leading-none mt-0.5">
                            {part.roleTitle}
                          </span>
                        </div>
                      </div>
                    ))}
                    {project.participants.length === 0 && (
                      <span className="text-xs text-zinc-550 italic py-1">Open for student recruitment</span>
                    )}
                  </div>
                </div>

                {/* External Repo & Demo Links */}
                <div className="flex items-center gap-3 pt-3 border-t border-zinc-800/80">
                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-zinc-100 transition-colors flex items-center gap-1.5"
                    >
                      <GitBranch size={13} />
                      <span>Repository</span>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink size={13} />
                      <span>Live Project Link</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function IEEEProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-955 p-8 animate-pulse" />}>
      <IEEEProjectsContent />
    </Suspense>
  );
}
