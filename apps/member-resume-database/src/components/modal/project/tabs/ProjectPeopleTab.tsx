"use client";

import React from "react";
import { ProjectParticipant } from "@/data/projects";
import Avatar from "@/components/common/Avatar";
import { Users, GraduationCap, Crown, ExternalLink } from "lucide-react";

interface ProjectPeopleTabProps {
  participants: ProjectParticipant[];
  onSelectMember?: (memberId: string) => void;
}

export default function ProjectPeopleTab({ participants, onSelectMember }: ProjectPeopleTabProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal">
          <Users size={14} className="text-amber-500 shrink-0" />
          <span>Student Team & Contributors ({participants.length})</span>
        </div>
      </div>

      {/* Roster Grid */}
      {participants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {participants.map((person) => {
            const isDirector = /director|lead|chair/i.test(person.roleTitle);
            return (
              <div
                key={person.memberId}
                className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/30 transition-all flex flex-col justify-between gap-3 shadow-md group"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={person.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          isDirector
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                        }`}
                      >
                        {isDirector && <Crown size={10} />}
                        {person.roleTitle}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                      {person.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5 truncate">
                      <GraduationCap size={12} className="text-zinc-500 shrink-0" />
                      <span className="truncate">{person.major}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-500 truncate">{person.email}</span>
                  {onSelectMember && (
                    <button
                      type="button"
                      onClick={() => onSelectMember(person.memberId)}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Resume Profile</span>
                      <ExternalLink size={11} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-xs">Open for active student recruitment.</p>
        </div>
      )}
    </div>
  );
}
