"use client";

import React from "react";
import { ProjectEntry } from "../../../data/students";
import ProjectCard from "../cards/ProjectCard";
import { Sparkles } from "lucide-react";

interface ProjectsTabProps {
  projects: ProjectEntry[];
  formatDateStr: (dateStr: string) => string;
}

export default function ProjectsTab({ projects, formatDateStr }: ProjectsTabProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal">
        <Sparkles size={14} className="text-amber-500 shrink-0" />
        <span>Highlight Projects ({projects.length})</span>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((proj, idx) => (
            <ProjectCard key={idx} project={proj} formatDateStr={formatDateStr} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-550 text-xs">No projects cataloged on this profile yet.</p>
        </div>
      )}
    </div>
  );
}
