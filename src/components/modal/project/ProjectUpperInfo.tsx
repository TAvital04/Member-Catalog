"use client";

import React from "react";
import { IEEEProject } from "@/data/projects";
import { FolderGit2, GitBranch, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import CurrentSponsorsSegment from "@/components/common/CurrentSponsorsSegment";

interface ProjectUpperInfoProps {
  project: IEEEProject;
}

export default function ProjectUpperInfo({ project }: ProjectUpperInfoProps) {
  const completedMilestones = (project.timeline || []).filter((m) => m.status === "completed").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Category & Status Badges */}
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

      {/* Project Icon & Title */}
      <div className="flex items-start gap-3.5">
        <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 shadow-2xs shrink-0 mt-0.5">
          <FolderGit2 size={24} className="stroke-[2]" />
        </div>
        <div className="flex-1 min-w-0">
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
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-3 gap-2">
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
            {project.tools ? project.tools.length : 0}
          </span>
          <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">
            Tools Used
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
          {project.repositoryUrl ? (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
              <GitBranch size={13} className="text-slate-400" />
              <span>GitHub Repo</span>
            </a>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-slate-50/60 border border-slate-200 text-xs font-medium text-slate-400 flex items-center gap-1.5 cursor-not-allowed italic">
              <GitBranch size={13} className="text-slate-300" />
              <span>No repo linked</span>
            </span>
          )}
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={13} className="text-slate-400" />
              <span>Project Website</span>
            </a>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-slate-50/60 border border-slate-200 text-xs font-medium text-slate-400 flex items-center gap-1.5 cursor-not-allowed italic">
              <ExternalLink size={13} className="text-slate-300" />
              <span>No demo deployed</span>
            </span>
          )}
        </div>
      </div>

      {/* Current Sponsors Segment */}
      <CurrentSponsorsSegment variant="panel" />
    </div>
  );
}
