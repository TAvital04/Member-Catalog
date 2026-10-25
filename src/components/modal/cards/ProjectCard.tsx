"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProjectEntry, Student } from "@/data/students";
import { ExternalLink, Clock } from "lucide-react";
import { isRsoProject, findMatchingIeeeProject } from "@/lib/rsoAffiliation";
import { getSafeUrl } from "@/shared";

import { CARD_INTERACTIVE, CARD_TITLE_HOVER } from "@/lib/cardStyles";

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

  return (
    <div
      onClick={isClickable ? handleCardClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `View project modal for ${displayName}` : undefined}
      className={`${CARD_INTERACTIVE} p-4 md:p-5 flex flex-col justify-between gap-3 ${
        isClickable ? "focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none" : ""
      }`}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {isRso ? "IEEE UCF Project" : "Technical Build"}
          </span>

          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5 leading-none">
            <Clock size={11} className="text-slate-400" />
            {formatDateStr(project.startDate)} - {project.current ? "Current" : formatDateStr(project.endDate || "")}
          </span>
        </div>

        <h4 className={`font-bold text-sm md:text-base leading-tight ${CARD_TITLE_HOVER} transition-colors`}>
          {displayName}
        </h4>

        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
      </div>

      {hasExternalLinks && (
        <div className="pt-2.5 md:pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          {externalLinks.map((link, lIdx) => {
            const safe = getSafeUrl(link) || "#";
            return (
              <a
                key={lIdx}
                href={safe}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="external-link-btn flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-2xs cursor-pointer active:scale-95"
              >
                <ExternalLink size={11} />
                <span>External Link {lIdx + 1}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
