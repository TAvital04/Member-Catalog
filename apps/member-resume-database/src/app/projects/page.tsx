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
import DirectoryStatsHeader from "@/components/directory/DirectoryStatsHeader";
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
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 relative pb-16 overflow-x-hidden">
      {/* Primary Header Navbar */}
      <DirectoryNavbar
        role="standard"
        theme={theme}
        roleDropdownOpen={false}
        setRoleDropdownOpen={() => {}}
        toggleTheme={toggleTheme}
        handleRoleChange={() => {}}
      />

      {/* Directory Page Header */}
      <DirectoryStatsHeader
        title="RSO UCF Chapter Projects"
        description="Explore hands-on hardware builds, autonomous robotics, power inverters, and wireless IoT networks engineered by UCF RSO students."
      />

      {/* Controls Bar: Search & Category Filter */}
      <section className="max-w-7xl w-full mx-auto px-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, tool, or skill..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 shadow-2xs transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-200/90 text-slate-900 border border-slate-300 font-bold shadow-2xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 font-medium shadow-2xs"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 flex flex-col gap-6 relative z-10">

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
            <div className="h-80 glass-panel rounded-2xl animate-shimmer" />
            <div className="h-80 glass-panel rounded-2xl animate-shimmer" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm">No projects match the selected filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setActiveModalProject(project)}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-5 relative group shadow-2xs cursor-pointer"
              >
                <div className="flex flex-col gap-4">
                  {/* Header Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                        project.status === "Completed"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200/70"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {project.status === "Completed" ? (
                        <CheckCircle2 size={10} className="text-emerald-600" />
                      ) : (
                        <Clock size={10} className="text-slate-400" />
                      )}
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-lg md:text-xl font-black text-slate-900 group-hover:text-slate-700 transition-colors leading-tight">
                      {project.title}
                    </h3>
                    {project.tagline ? (
                      <p className="text-xs text-slate-800 font-medium mt-1 leading-snug">
                        {project.tagline}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic mt-1 leading-snug">
                        Tagline not provided
                      </p>
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed font-sans mt-2 line-clamp-2">
                      {project.description || "Technical description has not been provided yet."}
                    </p>
                  </div>

                  {/* Tools Preview Tags */}
                  {project.tools && project.tools.length > 0 ? (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Wrench size={11} className="text-slate-400" />
                        Key Tech Stack ({project.tools.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tools.slice(0, 4).map((tool, idx) => (
                          <Link
                            key={idx}
                            href={`/?skills=${encodeURIComponent(tool.name)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-amber-300 hover:text-amber-900 hover:bg-amber-50/70 text-[10.5px] font-mono font-medium text-slate-700 transition-colors cursor-pointer inline-block"
                            title={`Filter candidates with skill/tool: ${tool.name}`}
                          >
                            {tool.name}
                          </Link>
                        ))}
                        {project.tools.length > 4 && (
                          <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500">
                            +{project.tools.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Wrench size={11} className="text-slate-400" />
                        Key Tech Stack (0)
                      </span>
                      <p className="text-xs text-slate-400 italic">
                        Tools & tech stack not specified yet
                      </p>
                    </div>
                  )}

                  {/* Team Roster Preview */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-slate-400" />
                        Team Roster ({project.participants ? project.participants.length : 0})
                      </span>
                    </div>

                    {project.participants && project.participants.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        {project.participants.map((part) => (
                          <div
                            key={part.memberId}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectMember(part.memberId);
                            }}
                            className="flex items-center gap-2 p-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium cursor-pointer hover:border-slate-300 transition-colors"
                          >
                            <Avatar name={part.name} size="sm" />
                            <div>
                              <span className="block font-bold text-slate-900 leading-tight text-[11px]">
                                {part.name}
                              </span>
                              <span className="block text-[9px] text-slate-500 font-medium leading-none mt-0.5">
                                {part.roleTitle}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic pt-0.5">
                        No team members listed yet — recruitment currently active
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {project.repositoryUrl ? (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-colors"
                        title="GitHub Repository"
                      >
                        <GitBranch size={14} className="text-slate-400" />
                      </a>
                    ) : (
                      <span
                        className="p-2 rounded-xl bg-slate-50/60 border border-slate-100 text-slate-300 cursor-not-allowed"
                        title="Repository not provided"
                      >
                        <GitBranch size={14} className="text-slate-300" />
                      </span>
                    )}
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink size={14} className="text-slate-400" />
                      </a>
                    ) : (
                      <span
                        className="p-2 rounded-xl bg-slate-50/60 border border-slate-100 text-slate-300 cursor-not-allowed"
                        title="Live demo not deployed"
                      >
                        <ExternalLink size={14} className="text-slate-300" />
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveModalProject(project)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>Explore Project Hub</span>
                    <ChevronRight size={13} className="text-slate-400" />
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
          students={students}
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8 animate-pulse" />}>
      <IEEEProjectsContent />
    </Suspense>
  );
}
