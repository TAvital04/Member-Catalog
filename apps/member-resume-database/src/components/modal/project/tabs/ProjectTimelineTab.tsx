"use client";

import React from "react";
import { ProjectMilestone } from "@/data/projects";
import { Calendar, CheckCircle2, Clock, CircleDot } from "lucide-react";

interface ProjectTimelineTabProps {
  timeline: ProjectMilestone[];
}

export default function ProjectTimelineTab({ timeline }: ProjectTimelineTabProps) {
  const getStatusBadge = (status: ProjectMilestone["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle2 size={10} />
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 animate-pulse">
            <CircleDot size={10} />
            In Progress
          </span>
        );
      case "upcoming":
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700 flex items-center gap-1">
            <Clock size={10} />
            Upcoming
          </span>
        );
    }
  };

  const getMarkerClass = (status: ProjectMilestone["status"]) => {
    switch (status) {
      case "completed":
        return "border-emerald-500 bg-emerald-500/20 text-emerald-400";
      case "in_progress":
        return "border-amber-500 bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/30";
      case "upcoming":
        return "border-zinc-700 bg-zinc-900 text-zinc-500";
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal">
          <Calendar size={14} className="text-purple-400 shrink-0" />
          <span>Project Roadmap & Sprint Milestones ({timeline.length})</span>
        </div>
      </div>

      {/* Timeline Flow */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-800">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Node Marker */}
            <div
              className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${getMarkerClass(
                item.status
              )}`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
            </div>

            {/* Milestone Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all shadow-md flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                    {item.date}
                  </span>
                  {getStatusBadge(item.status)}
                </div>
              </div>

              <h4 className="text-sm font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                {item.title}
              </h4>

              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

