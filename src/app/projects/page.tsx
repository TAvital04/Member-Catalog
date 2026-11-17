"use client";

/**
 * @file page.tsx — IEEE UCF Chapter Projects Page
 * @description Dedicated project showcase directory highlighting active builds, hardware initiatives,
 * autonomous robotics, and IoT sensor platforms. Integrates the comprehensive ProjectModal for deep-dives
 * into tooling, milestone timelines, participant rosters, skills taught, and sponsorship benefits.
 */

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GitBranch, Plus, CheckCircle2, X } from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import DirectoryStatsHeader from "@/components/directory/DirectoryStatsHeader";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useRoleManager } from "@/hooks/useRoleManager";
import { useStudentData } from "@/hooks/useStudentData";
import ProjectModal from "@/components/modal/project/ProjectModal";
import { ProjectTabType } from "@/components/modal/project/ProjectTabNavigation";
import PortfolioModal from "@/components/modal/PortfolioModal";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFilters from "@/components/projects/ProjectFilters";
import LeadershipProjectForm from "@/components/forms/LeadershipProjectForm";
import EmptyState from "@/components/common/EmptyState";
import { IEEEProject } from "@/data/projects";
import { Student } from "@/data/students";

function IEEEProjectsContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { role, handleRoleChange, isAdmin } = useRoleManager();
  const { students } = useStudentData();
  const [projects, setProjects] = useState<IEEEProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search") || searchParams.get("q");

  const [searchQuery, setSearchQuery] = useState<string>(() => searchParam || "");

  // Modal inspection state
  const [activeModalProject, setActiveModalProject] = useState<IEEEProject | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<ProjectTabType>("overview");
  const [selectedMemberStudent, setSelectedMemberStudent] = useState<Student | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleProjectCreated = (newProject: IEEEProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setToastMessage(`Created ${newProject.title}.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleOpenProjectModal = (project: IEEEProject, tab: ProjectTabType = "overview") => {
    setActiveModalProject(project);
    setActiveModalTab(tab);
    setSelectedMemberStudent(null);
    const url = new URL(window.location.href);
    url.searchParams.set("project", project.slug);
    if (tab !== "overview") {
      url.searchParams.set("tab", tab);
    } else {
      url.searchParams.delete("tab");
    }
    window.history.pushState(null, "", url.pathname + (url.search ? url.search : ""));
  };

  useEffect(() => {
    if (searchParam) {
      const timer = setTimeout(() => {
        setSearchQuery(searchParam);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParam]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
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

  // Automatically open project modal if requested in URL search params
  useEffect(() => {
    if (projects.length === 0) return;

    const tabParam = searchParams.get("tab");
    const validTab = tabParam && ["info", "overview", "tools", "timeline", "people", "skills", "sponsor"].includes(tabParam)
      ? (tabParam as ProjectTabType)
      : "overview";

    const projectParam = searchParams.get("project") || searchParams.get("projectId") || searchParams.get("slug");
    if (projectParam) {
      const targetSlug = projectParam.toLowerCase();
      const matched = projects.find(
        (p) => p.slug.toLowerCase() === targetSlug || p.id.toLowerCase() === targetSlug
      );
      if (matched) {
        const timer = setTimeout(() => {
          setActiveModalProject(matched);
          setActiveModalTab(validTab);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [projects, searchParams]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesDesc = project.description.toLowerCase().includes(q);
        const matchesTagline = project.tagline?.toLowerCase().includes(q) || false;
        const matchesTools = (project.tools || []).some((t) => t.name.toLowerCase().includes(q));
        const matchesSkills = (project.skillsTaught || []).some((s: string) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTagline && !matchesTools && !matchesSkills) {
          return false;
        }
      }
      return true;
    });
  }, [projects, searchQuery]);

  const handleSelectMember = (memberId?: string, name?: string, email?: string) => {
    if (!students || students.length === 0) return;

    const cleanId = (memberId || "").toLowerCase().trim();
    const cleanName = (name || "").toLowerCase().trim();
    const cleanEmail = (email || "").toLowerCase().trim();

    let match = cleanId ? students.find((s) => s.id.toLowerCase() === cleanId) : undefined;
    if (!match && cleanEmail) {
      match = students.find((s) => s.email.toLowerCase() === cleanEmail);
    }
    if (!match && cleanName) {
      match = students.find((s) => s.name.toLowerCase() === cleanName);
    }
    if (!match && cleanId) {
      const slugName = cleanId.replace(/^mem-/, "").replace(/^(cand|candidate)-/, "").replace(/[-_]/g, " ");
      match = students.find((s) => {
        const sName = s.name.toLowerCase();
        return (
          sName === slugName ||
          sName.includes(slugName) ||
          slugName.includes(sName) ||
          s.email.toLowerCase().includes(slugName.replace(/\s+/g, ""))
        );
      });
    }

    if (match) {
      setSelectedMemberStudent(match);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Primary Header Navbar */}
      <DirectoryNavbar
        role={role}
        theme={theme}
        roleDropdownOpen={false}
        setRoleDropdownOpen={() => {}}
        toggleTheme={toggleTheme}
        handleRoleChange={handleRoleChange}
      />

      {/* Directory Page Header */}
      <DirectoryStatsHeader
        title="IEEE UCF Chapter Projects"
        description="Explore hands-on hardware builds, autonomous robotics, power inverters, and wireless IoT networks engineered by UCF IEEE students."
      >
        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsProjectFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-all cursor-pointer shrink-0"
          >
            <Plus size={14} />
            <span>New Chapter Project</span>
          </button>
        )}
      </DirectoryStatsHeader>

      {/* Floating Success Feedback Toast */}
      {toastMessage && (
        <aside aria-label="Notification" className="max-w-7xl w-full mx-auto px-4 -mt-2 mb-3 animate-fade-in">
          <div className="p-3 rounded-lg bg-neutral-100 border border-neutral-300 text-black text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-black shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              aria-label="Dismiss notification"
              className="p-1 text-neutral-500 hover:text-black cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </aside>
      )}

      {/* Controls Bar: Search */}
      <ProjectFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 flex flex-col gap-6 relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[195px] sm:h-[220px] bg-neutral-100 rounded-2xl border border-neutral-200" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            icon={<GitBranch size={32} />}
            headline="No projects found"
            subtext="No projects match your current search criteria. Try searching for a different tool, technology, or title."
            actionLabel="Reset Search"
            onAction={() => {
              setSearchQuery("");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenModal={handleOpenProjectModal}
                onSelectMember={handleSelectMember}
              />
            ))}
          </div>
        )}
      </main>

      {/* Project Modal Inspection Window */}
      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          students={students}
          role={role}
          initialTab={activeModalTab}
          onClose={() => {
            setActiveModalProject(null);
            setActiveModalTab("overview");
            const url = new URL(window.location.href);
            url.searchParams.delete("project");
            url.searchParams.delete("projectId");
            url.searchParams.delete("slug");
            url.searchParams.delete("tab");
            window.history.pushState(null, "", url.pathname + (url.search ? url.search : ""));
          }}
          onSelectMember={(memberId, name, email) => {
            handleSelectMember(memberId, name, email);
          }}
        />
      )}

      {/* Candidate Portfolio Modal (when clicked from team roster) */}
      {selectedMemberStudent && (
        <PortfolioModal
          student={selectedMemberStudent}
          onClose={() => setSelectedMemberStudent(null)}
          adminMode={isAdmin}
          role={role}
          allStudents={students}
          onSelectProject={(projectSlugOrId) => {
            setSelectedMemberStudent(null);
            const clean = projectSlugOrId.toLowerCase().trim();
            const match = projects.find(
              (p) =>
                p.id.toLowerCase() === clean ||
                p.slug.toLowerCase() === clean ||
                p.title.toLowerCase() === clean ||
                p.title.toLowerCase().includes(clean) ||
                clean.includes(p.title.toLowerCase())
            );
            if (match) {
              setActiveModalProject(match);
              window.history.pushState(null, "", `/projects?project=${match.slug}`);
            }
          }}
        />
      )}

      {/* RSO Leadership Form 3: Create Chapter Project & Team Roster Modal */}
      {isProjectFormOpen && (
        <LeadershipProjectForm
          role={role}
          students={students}
          onClose={() => setIsProjectFormOpen(false)}
          onProjectCreated={handleProjectCreated}
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
