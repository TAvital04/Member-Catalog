"use client";

import React from "react";
import { ProjectEntry, Student } from "../../../data/students";
import ProjectCard from "../cards/ProjectCard";
import { Sparkles } from "lucide-react";
import { isRsoProject } from "../../../lib/rsoAffiliation";

interface ProjectsTabProps {
  projects: ProjectEntry[];
  formatDateStr: (dateStr: string) => string;
  student?: Student;
}

export default function ProjectsTab({ projects, formatDateStr, student }: ProjectsTabProps) {
  const rsoCount = projects.filter((p) => isRsoProject(p, student)).length;

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2 text-slate-900 dark:text-zinc-200 font-extrabold text-xs uppercase tracking-wider leading-normal">
          <Sparkles size={14} className="text-amber-500 shrink-0" />
          <span>Highlight Projects ({projects.length})</span>
        </div>
        {rsoCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-400/60 text-amber-800 dark:text-amber-300">
            <Sparkles size={11} className="text-amber-500 fill-current" />
            <span>{rsoCount} RSO Affiliated</span>
          </span>
        )}
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((proj, idx) => (
            <ProjectCard key={idx} project={proj} formatDateStr={formatDateStr} student={student} />
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
