"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectEntry, Student } from "@/data/students";
import { ExternalLink } from "lucide-react";
import { isRsoProject, findMatchingIeeeProject } from "@/lib/rsoAffiliation";
import { getSafeUrl } from "@/shared";

interface ProjectCardProps {
  project: ProjectEntry;
  formatDateStr: (dateStr: string) => string;
  student?: Student;
  onSelectProject?: (projectSlugOrId: string) => void;
  onCloseModal?: () => void;
}

export default function ProjectCard({
  project,
  formatDateStr,
  student,
  onSelectProject,
  onCloseModal,
}: ProjectCardProps) {
  const router = useRouter();
  const cleanName = project.name.replace(/^(Project Name|Project Title|Project)\s*/i, "").trim();
  const displayName = cleanName || project.name;
  const isRso = isRsoProject(project, student);
  const matchedProject = findMatchingIeeeProject(project, student);
  const projectSiteUrl = matchedProject
    ? `/projects?project=${matchedProject.slug}`
    : isRso
    ? `/projects?search=${encodeURIComponent(cleanName)}`
    : `/projects?project=${encodeURIComponent(cleanName)}`;

  const isClickable = Boolean(onSelectProject || projectSiteUrl);

  const handleNavigateToProject = (e: React.MouseEvent) => {
    if (onSelectProject) {
      e.preventDefault();
      e.stopPropagation();
      onSelectProject(matchedProject ? matchedProject.slug : cleanName);
      return;
    }

    if (projectSiteUrl) {
      e.preventDefault();
      e.stopPropagation();
      onCloseModal?.();
      router.push(projectSiteUrl);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't intercept clicks inside external links
    if (target.closest("a[target='_blank']") || target.closest(".external-link-btn")) {
      return;
    }
    handleNavigateToProject(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && isClickable) {
      e.preventDefault();
      if (onSelectProject) {
        onSelectProject(matchedProject ? matchedProject.slug : cleanName);
      } else if (projectSiteUrl) {
        onCloseModal?.();
        router.push(projectSiteUrl);
      }
    }
  };

  const externalLinks = project.projectLinks?.filter((link) => !link.includes("github.com")) || [];
  const hasExternalLinks = externalLinks.length > 0;

  const btnHoverClass =
    "transition-all duration-200 border border-zinc-800 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 shadow-sm hover:shadow active:scale-95 cursor-pointer";

  return (
    <div
      onClick={isClickable ? handleCardClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `View project modal for ${displayName}` : undefined}
      className={`p-4 rounded-xl transition-all duration-200 flex flex-col gap-2 min-w-0 overflow-hidden bg-zinc-850 border border-zinc-800 shadow-sm ${
        isClickable
          ? "cursor-pointer hover:border-zinc-700 hover:bg-zinc-800/80 hover:shadow-md group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800/60 pb-2">
        <h5 className="font-extrabold text-xs whitespace-normal break-all [overflow-wrap:anywhere] leading-snug text-zinc-100 group-hover:text-amber-400 transition-colors">
          {displayName}
        </h5>
        <span className="text-[9.5px] text-zinc-400 font-semibold bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 rounded-md shrink-0">
          {formatDateStr(project.startDate)} - {project.current ? "Current" : formatDateStr(project.endDate || "")}
        </span>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap break-all [overflow-wrap:anywhere] pt-1">
        {project.description}
      </p>

      {hasExternalLinks && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/60">
          {externalLinks.map((link, lIdx) => {
            const safe = getSafeUrl(link) || "#";
            return (
              <a
                key={lIdx}
                href={safe}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`external-link-btn flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-md ${btnHoverClass}`}
              >
                <ExternalLink size={10} />
                <span>External Link {lIdx + 1}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
