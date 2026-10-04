"use client";

import React from "react";
import { IEEEProject } from "@/data/projects";
import { FolderGit2, Target, Lightbulb, Compass, ArrowRight } from "lucide-react";
import { ProjectTabType } from "../ProjectTabNavigation";

interface ProjectOverviewTabProps {
  project: IEEEProject;
  onNavigateTab: (tab: ProjectTabType) => void;
}

export default function ProjectOverviewTab({ project, onNavigateTab }: ProjectOverviewTabProps) {
  const currentMilestone = project.timeline.find((m) => m.status === "in_progress") || project.timeline[0];

  return (
    <div className="flex flex-col gap-5 animate-fade-in pt-1 pb-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal">
        <FolderGit2 size={14} className="text-amber-500 shrink-0" />
        <span>Project Mission & Technical Overview</span>
      </div>

      {/* Main Narrative Description */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Lightbulb size={13} className="text-amber-400" />
          The Challenge & Vision
        </h3>
        <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-line">
          {project.description}
        </p>
      </div>

      {/* Current Sprint Focus Banner */}
      {currentMilestone && (
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Compass size={13} className="animate-spin text-amber-400" style={{ animationDuration: "12s" }} />
              Current Sprint Focus ({currentMilestone.date})
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab("timeline")}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View full timeline</span>
              <ArrowRight size={11} />
            </button>
          </div>
          <h4 className="text-sm font-black text-zinc-100">{currentMilestone.title}</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">{currentMilestone.description}</p>
        </div>
      )}

      {/* Highlights & Interactive Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div
          onClick={() => onNavigateTab("tools")}
          className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-cyan-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
            <span>Hardware & Software Stack</span>
            <ArrowRight size={13} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Built using {project.tools.slice(0, 3).map((t) => t.name).join(", ")} and {Math.max(0, project.tools.length - 3)} more tools.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab("skills")}
          className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-purple-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
            <span>Member Learning Outcomes</span>
            <ArrowRight size={13} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">
            Teaches {project.skillsTaught.length} core engineering competencies to student members.
          </p>
        </div>
      </div>
    </div>
  );
}
