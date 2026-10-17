"use client";

import React from "react";
import { ProjectParticipant } from "@/data/projects";
import Avatar from "@/components/common/Avatar";
import { Users, GraduationCap, Crown, ExternalLink } from "lucide-react";

interface ProjectPeopleTabProps {
  participants: ProjectParticipant[];
  onSelectMember?: (memberId: string) => void;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {safeParticipants.map((person) => {
            const isDirector = /director|lead|chair/i.test(person.roleTitle);
            return (
              <div
                key={person.memberId}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between gap-3 shadow-2xs group"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={person.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isDirector
                            ? "bg-slate-100 text-slate-800 border border-slate-200"
                            : "bg-slate-50 text-slate-700 border border-slate-200 font-medium"
                        }`}
                      >
                        {isDirector && <Crown size={10} className="text-slate-400" />}
                        {person.roleTitle}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors truncate">
                      {person.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 truncate">
                      <GraduationCap size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{person.major}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 truncate">{person.email}</span>
                  {onSelectMember && (
                    <button
                      type="button"
                      onClick={() => onSelectMember(person.memberId)}
                      className="text-slate-800 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Resume Profile</span>
                      <ExternalLink size={11} className="text-slate-400" />
                    </button>
                  )}
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
