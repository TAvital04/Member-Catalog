"use client";

import React from "react";
import { IEEEProject } from "@/data/projects";
import { FolderGit2, GitBranch, ExternalLink, CheckCircle2, Clock } from "lucide-react";

interface ProjectUpperInfoProps {
  project: IEEEProject;
}

export default function ProjectUpperInfo({ project }: ProjectUpperInfoProps) {
  const completedMilestones = (project.timeline || []).filter((m) => m.status === "completed").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Category & Status Badges */}
      <div className="flex items-center justify-between gap-2">
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {project.category}
        </span>
        <span
          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
            project.status === "Completed"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
          }`}
        >
          {project.status === "Completed" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
          {project.status}
        </span>
      </div>

      {/* Project Icon & Title */}
      <div className="flex items-start gap-3.5">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-zinc-955 shadow-lg shrink-0 mt-0.5">
          <FolderGit2 size={24} className="stroke-[2.5]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-black text-zinc-50 tracking-tight leading-tight">
            {project.title}
          </h2>
          {project.tagline && (
            <p className="text-xs text-amber-400/90 font-medium mt-1 leading-snug">
              {project.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center">
          <span className="block text-base font-black text-amber-400 leading-none">
            {project.participants.length}
          </span>
          <span className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-wider mt-1 block">
            Team Size
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center">
          <span className="block text-base font-black text-cyan-400 leading-none">
            {project.tools.length}
          </span>
          <span className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-wider mt-1 block">
            Tools Used
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-center">
          <span className="block text-base font-black text-purple-400 leading-none">
            {completedMilestones}/{project.timeline.length}
          </span>
          <span className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-wider mt-1 block">
            Milestones
          </span>
        </div>
      </div>

      {/* External Repository & Demo Links */}
      <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800/80">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Project Links</span>
        <div className="flex flex-wrap gap-2">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-300 hover:text-zinc-100 transition-colors flex items-center gap-1.5"
            >
              <GitBranch size={13} className="text-zinc-400" />
              <span>GitHub Repo</span>
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              <span>Project Website</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
