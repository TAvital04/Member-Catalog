"use client";

import React from "react";
import { IEEEProject } from "@/data/projects";
import CurrentSponsorsSegment from "@/components/common/CurrentSponsorsSegment";
import { getSafeUrl } from "@/shared";
import { UserRole } from "@/hooks/useRoleManager";

interface ProjectUpperInfoProps {
  project: IEEEProject;
  role?: UserRole;
}

export default function ProjectUpperInfo({ project, role }: ProjectUpperInfoProps) {
  const completedMilestones = (project.timeline || []).filter((m) => m.status === "completed").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 border border-neutral-200 text-neutral-800">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              project.status === "Completed" ? "bg-black" : "bg-emerald-500"
            }`}
            aria-hidden="true"
          />
          <span>{project.status}</span>
        </span>
      </div>

      {/* Project Title */}
      <div className="flex flex-col">
        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
          {project.title}
        </h2>
        {project.tagline ? (
          <p className="text-xs text-slate-800 font-medium mt-1 leading-snug">
            {project.tagline}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mt-1 leading-snug">
            Tagline not provided
          </p>
        )}
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="block text-base font-black text-slate-900 leading-none">
            {project.participants ? project.participants.length : 0}
          </span>
          <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">
            Team Size
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="block text-base font-black text-slate-900 leading-none">
            {completedMilestones}/{(project.timeline || []).length}
          </span>
          <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">
            Milestones
          </span>
        </div>
      </div>


      {/* External Repository & Demo Links */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Links</span>
        <div className="flex flex-wrap gap-2">
          {getSafeUrl(project.repositoryUrl) ? (
            <a
              href={getSafeUrl(project.repositoryUrl)!}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 hover:bg-neutral-100 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span>GitHub Repo</span>
            </a>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-slate-50/60 border border-slate-200 text-xs font-medium text-slate-400 flex items-center gap-1.5 cursor-not-allowed italic">
              <span>No repo linked</span>
            </span>
          )}
          {getSafeUrl(project.demoUrl) ? (
            <a
              href={getSafeUrl(project.demoUrl)!}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 hover:bg-neutral-100 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <span>Project Website</span>
            </a>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-slate-50/60 border border-slate-200 text-xs font-medium text-slate-400 flex items-center gap-1.5 cursor-not-allowed italic">
              <span>No demo deployed</span>
            </span>
          )}
        </div>
      </div>

      {/* Current Sponsors Segment (Hidden from Standard View) */}
      {role !== "standard" && <CurrentSponsorsSegment variant="panel" />}
    </div>
  );
}
