"use client";

import React from "react";
import { ProjectEntry, Student } from "@/data/students";
import ProjectCard from "../cards/ProjectCard";
import { Sparkles } from "lucide-react";

interface ProjectsTabProps {
  projects: ProjectEntry[];
  formatDateStr: (dateStr: string) => string;
  student?: Student;
  onSelectProject?: (projectSlugOrId: string) => void;
  onCloseModal?: () => void;
}

export default function ProjectsTab({
  projects,
  formatDateStr,
  student,
  onSelectProject,
  onCloseModal,
}: ProjectsTabProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
          <Sparkles size={14} className="text-amber-600 dark:text-amber-500 shrink-0" />
          <span>Projects & Technical Builds</span>
          {projects.length > 0 && (
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-2 py-0.2 rounded-full font-bold">
              {projects.length}
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-500 font-medium">IEEE UCF Chapter Initiatives</span>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5">
          {projects.map((proj, idx) => (
            <ProjectCard
              key={idx}
              project={proj}
              formatDateStr={formatDateStr}
              student={student}
              onSelectProject={onSelectProject}
              onCloseModal={onCloseModal}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-6 shadow-2xs">
          <p className="text-slate-500 text-xs">No projects cataloged on this profile yet.</p>
        </div>
      )}
    </div>
  );
}
