"use client";

import React, { useState } from "react";
import { Users, Calendar, Briefcase, FolderGit2 } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import Tooltip from "@/components/common/Tooltip";
import { StudentInteraction } from "@/data/sponsors";
import { Student } from "@/data/students";
import { CARD_INTERACTIVE } from "@/lib/cardStyles";

export interface SponsorMemberRosterProps {
  interactions: StudentInteraction[];
  sponsorName: string;
  onSelectStudent: (student: Student) => void;
  role?: string;
}

/**
 * SponsorMemberRoster — Displays members who interacted with the sponsor
 * (workshop attendees, job applicants, project contributors) with 1-click portfolio view.
 */
export default function SponsorMemberRoster({
  interactions,
  sponsorName,
  onSelectStudent,
  role,
}: SponsorMemberRosterProps) {
  const isPremium = role !== "standard";
  const [activeFilter, setActiveFilter] = useState<"All" | "Event Attendee" | "Project Contributor">("All");

  const visibleInteractions = interactions;

  const filteredInteractions = visibleInteractions.filter((item) => {
    if (activeFilter === "All") return true;
    return item.interactionType === activeFilter;
  });

  const availableFilters = ["All", "Event Attendee", "Project Contributor"] as const;

  const getInteractionBadge = (type: StudentInteraction["interactionType"]) => {
    switch (type) {
      case "Event Attendee":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-black border border-neutral-300">
            <Calendar size={10} />
            <span>Workshop Attendee</span>
          </span>
        );
      case "Project Contributor":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-black border border-neutral-300">
            <FolderGit2 size={10} />
            <span>Project Contributor</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header and Type Filter Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="section-title">
            <span>Engaged Members & Candidate Interactions</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {visibleInteractions.length} Students
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isPremium
              ? `Students who attended technical workshops, submitted job applications, or built hardware sponsored by ${sponsorName}.`
              : `Students who attended technical workshops or built hardware sponsored by ${sponsorName}.`}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {availableFilters.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat as any)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                activeFilter === cat
                  ? "bg-white text-slate-950 font-bold border-slate-300 shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
              }`}
            >
              {cat === "All" ? "All Interactions" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      {filteredInteractions.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500">No member interactions found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredInteractions.map(({ student, interactionType, context, date }, idx) => (
            <div
              key={`${student.id}-${idx}`}
              role="button"
              tabIndex={0}
              aria-label={`Inspect portfolio for ${student.name}`}
              onClick={() => onSelectStudent(student)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectStudent(student);
                }
              }}
              className={`${CARD_INTERACTIVE} p-4 flex flex-col justify-between gap-3 group`}
            >
              <div className="flex items-start gap-3">
                <Avatar name={student.name} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-black transition-colors truncate">
                      {student.name}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 block truncate">
                    {student.major} • Class of {student.gradDate}
                  </span>
                  <div className="mt-1.5">
                    {getInteractionBadge(interactionType)}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate pr-2 font-medium">
                  <span>{context}</span>
                </span>
                <span className="text-black font-bold shrink-0 flex items-center gap-0.5">
                  Portfolio
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
