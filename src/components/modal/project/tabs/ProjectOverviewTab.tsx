"use client";

import React from "react";
import { IEEEProject } from "@/data/projects";
import { FolderGit2, Target, Lightbulb, Compass, ArrowRight } from "lucide-react";
import { ProjectTabType } from "../ProjectTabNavigation";
import { CARD_TITLE_HOVER } from "@/lib/cardStyles";

interface ProjectOverviewTabProps {
  project: IEEEProject;
  onNavigateTab: (tab: ProjectTabType) => void;
}

export default function ProjectOverviewTab({ project, onNavigateTab }: ProjectOverviewTabProps) {
  const timeline = project.timeline || [];
  const currentMilestone = timeline.find((m) => m.status === "in_progress") || timeline[0];
  const tools = project.tools || [];
  const skillsTaught = project.skillsTaught || [];

  return (
    <div className="flex flex-col gap-5 animate-fade-in pt-1 pb-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
        <FolderGit2 size={14} className="text-slate-400 shrink-0" />
        <span>Project Mission & Technical Overview</span>
      </div>

      {/* Main Narrative Description */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Lightbulb size={13} className="text-slate-400" />
          The Challenge & Vision
        </h3>
        <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line">
          {project.description || "Detailed technical overview has not been provided yet for this project."}
        </p>
      </div>

      {/* Current Sprint Focus Banner */}
      {currentMilestone ? (
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Compass size={13} className="animate-spin text-slate-400" style={{ animationDuration: "12s" }} />
              Current Sprint Focus ({currentMilestone.date})
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab("timeline")}
              className="text-[11px] font-bold text-slate-800 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View full timeline</span>
              <ArrowRight size={11} className="text-slate-400" />
            </button>
          </div>
          <h4 className="text-sm font-bold text-slate-900">{currentMilestone.title}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">{currentMilestone.description}</p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Current Sprint Focus</span>
            <p className="text-xs text-slate-400 italic mt-0.5">Sprint focus and roadmap milestones have not been published yet.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("timeline")}
            className="text-[11px] font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Timeline</span>
            <ArrowRight size={11} className="text-slate-400" />
          </button>
        </div>
      )}

      {/* Highlights & Interactive Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div
          onClick={() => onNavigateTab("tools")}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-2xs"
        >
          <div className={`flex items-center justify-between text-xs font-bold ${CARD_TITLE_HOVER}`}>
            <span>Hardware & Software Stack</span>
            <ArrowRight size={13} className="text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {tools.length > 0
              ? `Built using ${tools.slice(0, 3).map((t) => t.name).join(", ")}${tools.length > 3 ? ` and ${tools.length - 3} more tools.` : "."}`
              : "Tools and tech stack have not been specified yet."}
          </p>
        </div>

        <div
          onClick={() => onNavigateTab("skills")}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-2xs"
        >
          <div className={`flex items-center justify-between text-xs font-bold ${CARD_TITLE_HOVER}`}>
            <span>Member Learning Outcomes</span>
            <ArrowRight size={13} className="text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {skillsTaught.length > 0
              ? `Teaches ${skillsTaught.length} core engineering competencies to student members.`
              : "Learning outcomes have not been listed yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
