"use client";

import React from "react";
import Link from "next/link";
import {
  GitBranch,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock,
  Wrench,
} from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { IEEEProject } from "@/data/projects";
import { ProjectTabType } from "@/components/modal/project/ProjectTabNavigation";
import { CARD_INTERACTIVE, CARD_TITLE_HOVER } from "@/lib/cardStyles";

export interface ProjectCardProps {
  project: IEEEProject;
  onOpenModal: (project: IEEEProject, tab?: ProjectTabType) => void;
  onSelectMember: (memberId?: string, name?: string, email?: string) => void;
}

/**
 * ProjectCard — Reusable Matchy-Matchy Project Showcase Card
 * Presents project details, tool chips, team leads, and deep-dive actions.
 */
export default function ProjectCard({
  project,
  onOpenModal,
  onSelectMember,
}: ProjectCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View project details for ${project.title}`}
      onClick={() => onOpenModal(project, "overview")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenModal(project, "overview");
        }
      }}
      className={`${CARD_INTERACTIVE} p-6 flex flex-col justify-between gap-5 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500`}
    >
      <div className="flex flex-col gap-4">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            {project.category}
          </span>
          <span
            className={`text-[10px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
              project.status === "Completed"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/70"
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            {project.status === "Completed" ? (
              <CheckCircle2 size={11} className="text-emerald-600" />
            ) : (
              <Clock size={11} className="text-slate-400" />
            )}
            {project.status}
          </span>
        </div>

        {/* Title & Tagline */}
        <div>
          <h3 className={`text-lg md:text-xl font-black leading-tight ${CARD_TITLE_HOVER}`}>
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
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(project, "tools");
                }}
                className="text-[10px] font-bold text-slate-500 hover:text-amber-500 uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer group/stack text-left"
                title={`View all ${project.tools.length} tools & skills for ${project.title}`}
              >
                <Wrench size={11} className="text-slate-400 group-hover/stack:text-amber-500 transition-colors" />
                <span>Key Tech Stack ({project.tools.length})</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.tools.slice(0, 4).map((tool, idx) => (
                <Link
                  key={idx}
                  href={`/?skills=${encodeURIComponent(tool.name)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:border-amber-300 hover:text-amber-900 hover:bg-amber-50/70 text-[10.5px] font-mono font-medium text-slate-700 transition-colors cursor-pointer inline-block"
                  title={`Filter candidates with skill/tool: ${tool.name}`}
                >
                  {tool.name}
                </Link>
              ))}
              {project.tools.length > 4 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(project, "tools");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-500/15 border border-slate-200 hover:border-amber-500/40 text-[10.5px] font-medium text-slate-600 hover:text-amber-500 transition-all cursor-pointer active:scale-95 shadow-2xs"
                  title={`Show all ${project.tools.length} tools & skills for ${project.title}`}
                  aria-label={`Show more tools and skills for ${project.title}`}
                >
                  +{project.tools.length - 4} more
                </button>
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
                    onSelectMember(part.memberId, part.name, part.email);
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
              <GitBranch size={14} />
            </a>
          ) : (
            <span
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-300 cursor-not-allowed"
              title="Repository not provided"
            >
              <GitBranch size={14} />
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
              <ExternalLink size={14} />
            </a>
          ) : (
            <span
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-300 cursor-not-allowed"
              title="Live demo not provided"
            >
              <ExternalLink size={14} />
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(project, "overview");
          }}
          className="btn-base btn-md btn-secondary-surface"
        >
          Explore Project Hub
        </button>
      </div>
    </div>
  );
}
