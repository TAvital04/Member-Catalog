"use client";

import React from "react";
import { ProjectMilestone } from "@/data/projects";
import { Calendar, CheckCircle2, Clock, CircleDot } from "lucide-react";
import { CARD_TITLE_HOVER } from "@/lib/cardStyles";

interface ProjectTimelineTabProps {
  timeline: ProjectMilestone[];
}

export default function ProjectTimelineTab({ timeline = [] }: ProjectTimelineTabProps) {
  const safeTimeline = Array.isArray(timeline) ? timeline : [];

  const getStatusBadge = (status: ProjectMilestone["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/70 flex items-center gap-1">
            <CheckCircle2 size={10} className="text-emerald-600" />
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-300 flex items-center gap-1">
            <CircleDot size={10} className="text-slate-600" />
            In Progress
          </span>
        );
      case "upcoming":
        return (
          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1">
            <Clock size={10} className="text-slate-400" />
            Upcoming
          </span>
        );
    }
  };

  const getMarkerClass = (status: ProjectMilestone["status"]) => {
    switch (status) {
      case "completed":
        return "border-slate-300 bg-emerald-50 text-emerald-600";
      case "in_progress":
        return "border-slate-400 bg-slate-100 text-slate-700";
      case "upcoming":
        return "border-slate-200 bg-slate-50 text-slate-400";
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
          <Calendar size={14} className="text-slate-400 shrink-0" />
          <span>Project Roadmap & Sprint Milestones ({safeTimeline.length})</span>
        </div>
      </div>

      {safeTimeline.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
          <Calendar size={24} className="text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Timeline Not Published</h4>
          <p className="text-slate-500 text-xs mt-1">Milestone timeline has not been published yet.</p>
          <p className="text-slate-400 text-[11px] mt-0.5">Sprint schedules and deliverables will appear here once finalized by project leadership.</p>
        </div>
      ) : (
        /* Timeline Flow */
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {safeTimeline.map((item, idx) => (
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
              <div className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-2xs flex flex-col gap-2 group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      {item.date}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <h4 className={`text-sm font-bold ${CARD_TITLE_HOVER}`}>
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

