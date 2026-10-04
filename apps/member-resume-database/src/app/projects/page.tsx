"use client";

/**
 * @file page.tsx — IEEE UCF Chapter Projects Page
 * @description Dedicated project showcase directory highlighting active builds, hardware initiatives,
 * autonomous robotics, and IoT sensor platforms. Integrates the comprehensive ProjectModal for deep-dives
 * into tooling, milestone timelines, participant rosters, skills taught, and sponsorship benefits.
 */

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  FolderGit2,
  GitBranch,
  ExternalLink,
  Users,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Wrench,
  Search,
  ChevronRight,
} from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useStudentData } from "@/hooks/useStudentData";
import Avatar from "@/components/common/Avatar";
import ProjectModal from "@/components/modal/project/ProjectModal";
import PortfolioModal from "@/components/modal/PortfolioModal";
import { IEEEProject } from "@/data/projects";
import { Student } from "@/data/students";

function IEEEProjectsContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { students } = useStudentData();
  const [projects, setProjects] = useState<IEEEProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal inspection state
  const [activeModalProject, setActiveModalProject] = useState<IEEEProject | null>(null);
  const [selectedMemberStudent, setSelectedMemberStudent] = useState<Student | null>(null);

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

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTagline = p.tagline?.toLowerCase().includes(q);
        const matchesTool = (p.tools || []).some((t) => t.name.toLowerCase().includes(q));
        const matchesSkill = (p.skillsTaught || []).some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTagline && !matchesTool && !matchesSkill) {
          return false;
        }
      }
      return true;
    });
  }, [projects, selectedCategory, searchQuery]);

  const handleSelectMember = (memberId: string) => {
    const student = students.find((s) => s.id === memberId || s.email.includes(memberId));
    if (student) {
      setSelectedMemberStudent(student);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-955 text-zinc-200 relative pb-16 overflow-x-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="circuit-overlay"></div>
      </div>

      {/* Primary Header Navbar */}
      <DirectoryNavbar
        role="standard"
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
                  Explore hands-on hardware builds, autonomous robotics, power inverters, and wireless IoT networks engineered by UCF IEEE students.
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
        {/* Controls Bar: Search & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider pr-1">Category:</span>
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

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3 top-3 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, tools, skills..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
            <div className="h-80 glass-panel rounded-2xl animate-shimmer" />
            <div className="h-80 glass-panel rounded-2xl animate-shimmer" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">No projects match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setActiveModalProject(project)}
                className="p-6 rounded-2xl glass-panel border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between gap-5 relative group shadow-xl cursor-pointer"
              >
                <div className="flex flex-col gap-4">
                  {/* Header Badges */}
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

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-zinc-100 group-hover:text-amber-400 transition-colors leading-tight">
                      {project.title}
                    </h3>
                    {project.tagline && (
                      <p className="text-xs text-amber-400/90 font-medium mt-1 leading-snug">
                        {project.tagline}
                      </p>
                    )}
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans mt-2 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Tools Preview Tags */}
                  {project.tools && project.tools.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                        <Wrench size={11} className="text-cyan-400" />
                        Key Tech Stack ({project.tools.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tools.slice(0, 4).map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-[10.5px] font-mono font-medium text-zinc-300"
                          >
                            {tool.name}
                          </span>
                        ))}
                        {project.tools.length > 4 && (
                          <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500">
                            +{project.tools.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Team Roster Preview */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-amber-500" />
                        Team Roster ({project.participants.length})
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {project.participants.map((part) => (
                        <div
                          key={part.memberId}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectMember(part.memberId);
                          }}
                          className="flex items-center gap-2 p-1.5 px-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-medium cursor-pointer hover:border-zinc-700 transition-colors"
                        >
                          <Avatar name={part.name} size="sm" />
                          <div>
                            <span className="block font-bold text-zinc-200 leading-tight text-[11px]">
                              {part.name}
                            </span>
                            <span className="block text-[9px] text-amber-500 font-semibold leading-none mt-0.5">
                              {part.roleTitle}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title="GitHub Repository"
                      >
                        <GitBranch size={14} />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalProject(project)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-955 text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Explore Project Hub</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Project Modal Inspection Window */}
      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
          onSelectMember={(memberId) => {
            handleSelectMember(memberId);
          }}
        />
      )}

      {/* Candidate Portfolio Modal (when clicked from team roster) */}
      {selectedMemberStudent && (
        <PortfolioModal
          student={selectedMemberStudent}
          onClose={() => setSelectedMemberStudent(null)}
          adminMode={false}
          role="standard"
        />
      )}
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
