"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
} from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { IEEEProject } from "@/data/projects";
import { ProjectTabType } from "@/components/modal/project/ProjectTabNavigation";
import { Card, Badge } from "@/components/ui";

export interface ProjectCardProps {
  project: IEEEProject;
  onOpenModal: (project: IEEEProject, tab?: ProjectTabType) => void;
  onSelectMember: (memberId?: string, name?: string, email?: string) => void;
}

/**
 * ProjectCard — Reusable Standardized Project Showcase Card
 * Built with the Card and Badge primitive suite.
 */
export default function ProjectCard({
  project,
  onOpenModal,
  onSelectMember,
}: ProjectCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenModal(project, "overview");
    }
  };

  return (
    <Card
      as="div"
      role="button"
      tabIndex={0}
      variant="interactive"
      padding="none"
      onClick={() => onOpenModal(project, "overview")}
      onKeyDown={handleKeyDown}
      className="text-left p-6 flex flex-col justify-between gap-5 relative group w-full cursor-pointer"
      aria-label={`View project details for ${project.title}`}
    >
      <div className="flex flex-col gap-4">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="neutral">{project.category}</Badge>
          <Badge
            variant={project.status === "Completed" ? "solid" : "neutral"}
            className="flex items-center gap-1.5"
          >
            {project.status === "Completed" ? (
              <CheckCircle2 size={11} className="text-white" />
            ) : (
              <Clock size={11} className="text-neutral-500" />
            )}
            <span>{project.status}</span>
          </Badge>
        </div>

        {/* Title & Tagline */}
        <div>
          <h3 className="text-lg md:text-xl font-black text-black leading-tight">
            {project.title}
          </h3>
          {project.tagline ? (
            <p className="text-xs text-neutral-800 font-medium mt-1 leading-snug">
              {project.tagline}
            </p>
          ) : (
            <p className="text-xs text-neutral-400 italic mt-1 leading-snug">
              Tagline not provided
            </p>
          )}
          <p className="text-xs text-neutral-600 leading-relaxed font-sans mt-2 line-clamp-2">
            {project.description || "Technical description has not been provided yet."}
          </p>
        </div>

        {/* Tools Preview Tags */}
        {project.tools && project.tools.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(project, "tools");
                }}
                className="text-[10px] font-bold text-neutral-500 hover:text-black uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer group/stack text-left"
              >
                <span>Key Tech Stack ({project.tools.length})</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.tools.slice(0, 4).map((tool, idx) => (
                <Link
                  key={idx}
                  href={`/?skills=${encodeURIComponent(tool.name)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-300 hover:border-black text-[10.5px] font-mono font-medium text-black transition-colors cursor-pointer inline-block"
                >
                  <span>{tool.name}</span>
                </Link>
              ))}
              {project.tools.length > 4 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(project, "tools");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 hover:border-black text-[10.5px] font-medium text-black transition-all cursor-pointer active:scale-95 shadow-2xs"
                  aria-label={`Show more tools and skills for ${project.title}`}
                >
                  <span>+{project.tools.length - 4} more</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              Key Tech Stack (0)
            </span>
            <p className="text-xs text-neutral-400 italic">
              Tools & tech stack not specified yet
            </p>
          </div>
        )}

        {/* Team Roster Preview */}
        <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200">
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            <span className="flex items-center gap-1">
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
                    onSelectMember(part.memberId, part.name, part.email);
                  }}
                  className="flex items-center gap-2 p-1.5 px-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium cursor-pointer hover:border-black transition-colors"
                >
                  <Avatar name={part.name} size="sm" />
                  <div>
                    <span className="block font-bold text-black leading-tight text-[11px]">
                      {part.name}
                    </span>
                    <span className="block text-[9px] text-neutral-500 font-medium leading-none mt-0.5">
                      {part.roleTitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400 italic pt-0.5">
              No team members listed yet — recruitment currently active
            </p>
          )}
        </div>
      </div>

      {/* Card Bottom Actions */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-200">
        <div className="flex items-center gap-2">
          {project.repositoryUrl ? (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="GitHub Repository"
              className="px-2.5 py-1.5 rounded-lg bg-neutral-100 border border-neutral-300 hover:border-black text-xs font-semibold text-black transition-colors"
            >
              GitHub Repo
            </a>
          ) : (
            <span className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-400 cursor-not-allowed">
              No Repo
            </span>
          )}

          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Live Demo"
              className="px-2.5 py-1.5 rounded-lg bg-neutral-100 border border-neutral-300 hover:border-black text-xs font-semibold text-black transition-colors"
            >
              Live Demo
            </a>
          ) : (
            <span className="px-2.5 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-400 cursor-not-allowed">
              No Demo
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(project, "overview");
          }}
          className="px-3.5 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 border border-black text-xs font-bold transition-all cursor-pointer"
        >
          Explore Project Hub
        </button>
      </div>
    </Card>
  );
}
