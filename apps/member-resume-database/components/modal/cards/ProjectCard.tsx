"use client";

import React from "react";
import { ProjectEntry } from "../../../data/students";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  project: ProjectEntry;
  formatDateStr: (dateStr: string) => string;
}

export default function ProjectCard({ project, formatDateStr }: ProjectCardProps) {
  const cleanName = project.name.replace(/^(Project Name|Project Title|Project)\s*/i, "").trim();
  const displayName = cleanName || project.name;

  return (
    <div className="p-4 rounded-xl bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col gap-2 shadow-sm min-w-0 overflow-hidden">
      <div className="flex justify-between items-start gap-2 border-b border-zinc-800/60 pb-1.5">
        <span className="text-[9px] text-amber-500 font-extrabold uppercase tracking-wider">
          PROJECT NAME
        </span>
        <span className="text-[9.5px] text-zinc-500 font-semibold bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 rounded-md">
          {formatDateStr(project.startDate)} - {project.current ? "Current" : formatDateStr(project.endDate || "")}
        </span>
      </div>

      <h5 className="font-extrabold text-zinc-100 text-xs whitespace-normal break-all [overflow-wrap:anywhere] leading-snug">
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
                className="text-zinc-400 hover:text-amber-400 flex items-center gap-1.5 text-[10px] font-medium bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-md transition-colors shadow-sm"
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
