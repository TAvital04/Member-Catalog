"use client";

import React from "react";
import { ProjectParticipant } from "@/data/projects";
import Avatar from "@/components/common/Avatar";
import { Users, GraduationCap, Crown, ExternalLink } from "lucide-react";
import { CARD_TITLE_HOVER } from "@/lib/cardStyles";

interface ProjectPeopleTabProps {
  participants: ProjectParticipant[];
  onSelectMember?: (memberId: string, name?: string, email?: string) => void;
}

export default function ProjectPeopleTab({ participants = [], onSelectMember }: ProjectPeopleTabProps) {
  const safeParticipants = Array.isArray(participants) ? participants : [];

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
          <Users size={14} className="text-slate-400 shrink-0" />
          <span>Student Team & Contributors ({safeParticipants.length})</span>
        </div>
      </div>

      {/* Roster Grid */}
      {safeParticipants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-1">
          {safeParticipants.map((person) => {
            const isDirector = /director|lead|chair/i.test(person.roleTitle);
            return (
              <div
                key={person.memberId}
                role="button"
                tabIndex={0}
                onClick={() => onSelectMember?.(person.memberId, person.name, person.email)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectMember?.(person.memberId, person.name, person.email);
                  }
                }}
                aria-label={`View member profile of ${person.name}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-3.5 shadow-2xs group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="flex items-center gap-3.5">
                  <Avatar name={person.name} size="md" className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate text-slate-900 group-hover:text-amber-800 transition-colors">
                      {person.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs min-w-0">
                      {isDirector && <Crown size={12} className="text-amber-500 shrink-0" />}
                      <span className={`truncate ${isDirector ? "font-semibold text-slate-700" : "font-medium text-slate-600"}`}>
                        {person.roleTitle}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 pl-0.5">
                  <GraduationCap size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{person.major}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
          <Users size={24} className="text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No Team Members Listed Yet</h4>
          <p className="text-slate-500 text-xs mt-1">This project roster has not been populated yet — active recruitment is currently open.</p>
          <p className="text-slate-400 text-[11px] mt-0.5">Students can reach out to chapter officers or attend weekly project work sessions to join.</p>
        </div>
      )}
    </div>
  );
}
