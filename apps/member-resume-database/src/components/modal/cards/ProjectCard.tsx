"use client";

import React from "react";
import { ProjectEntry, Student } from "../../../data/students";
import { ExternalLink, Sparkles } from "lucide-react";
import { isRsoProject } from "../../../lib/rsoAffiliation";

interface ProjectCardProps {
  project: ProjectEntry;
  formatDateStr: (dateStr: string) => string;
  student?: Student;
}

export default function ProjectCard({ project, formatDateStr, student }: ProjectCardProps) {
  const cleanName = project.name.replace(/^(Project Name|Project Title|Project)\s*/i, "").trim();
  const displayName = cleanName || project.name;
  const isRso = isRsoProject(project, student);

  return (
    <div
      className={`p-4 rounded-xl transition-all flex flex-col gap-2 min-w-0 overflow-hidden ${
        isRso
          ? "bg-gradient-to-br from-amber-500/10 via-zinc-850 to-zinc-850 dark:from-amber-500/10 dark:via-zinc-850 dark:to-zinc-850 border border-amber-400/60 shadow-md ring-1 ring-amber-400/30 hover:border-amber-400"
          : "bg-zinc-850 border border-zinc-800 hover:border-zinc-700 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-center gap-2 border-b border-zinc-800/60 pb-2">
        {isRso ? (
          <span className="inline-flex items-center gap-1.5 text-[9.5px] text-amber-400 font-extrabold uppercase tracking-wider bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full shadow-2xs">
            <Sparkles size={11} className="text-amber-400 fill-current" />
            <span>RSO Chapter Project</span>
          </span>
        ) : (
          <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider">
            PROJECT
          </span>
        )}
        <span className="text-[9.5px] text-zinc-400 font-semibold bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 rounded-md">
          {formatDateStr(project.startDate)} - {project.current ? "Current" : formatDateStr(project.endDate || "")}
        </span>
      </div>

      <h5
        className={`font-extrabold text-xs whitespace-normal break-all [overflow-wrap:anywhere] leading-snug ${
          isRso ? "text-amber-200" : "text-zinc-100"
        }`}
      >
        {displayName}
      </h5>

      <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap break-all [overflow-wrap:anywhere] pt-1 border-t border-zinc-800/60">
        {project.description}
      </p>

      {project.projectLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/60">
          {project.projectLinks.map((link, lIdx) => {
            const label = link.includes("github.com") ? "GitHub Repository" : "External Link " + (lIdx + 1);
            return (
              <a
                key={lIdx}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-md transition-colors shadow-sm ${
                  isRso
                    ? "bg-zinc-950/90 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-400"
                    : "bg-zinc-950 text-zinc-400 hover:text-amber-400 border border-zinc-800"
                }`}
              >
                <ExternalLink size={10} />
                <span>{label}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
