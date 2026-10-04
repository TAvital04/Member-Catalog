"use client";

import React, { useState } from "react";
import { Student, getIeeeLeadershipRole } from "../../data/students";
import { ShieldCheck, Award, ChevronRight, UserCheck, Sparkles } from "lucide-react";
import Avatar from "../common/Avatar";
import SkillTag from "../common/SkillTag";

interface IEEELeadershipSectionProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onlyLeadersFilter: boolean;
  onToggleOnlyLeaders: () => void;
}

export default function IEEELeadershipSection({
  students,
  onSelectStudent,
  onlyLeadersFilter,
  onToggleOnlyLeaders,
}: IEEELeadershipSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter leaders who have an IEEE leadership role
  const ieeeLeaders = React.useMemo(() => {
    return students.filter((s) => Boolean(getIeeeLeadershipRole(s)));
  }, [students]);

  if (ieeeLeaders.length === 0) return null;

  return (
    <section className="w-full bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-4 md:p-6 mb-6 relative overflow-hidden shadow-xl animate-fade-in">
      {/* Gold Ambient Glow Background Overlay */}
      <div className="absolute -right-16 -top-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-zinc-955 shadow-md shrink-0">
            <ShieldCheck size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black text-zinc-100 uppercase tracking-wider">
                IEEE UCF Officers & Committee Leads
              </h2>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={10} />
                Student Chapter Leaders
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              Student officers, committee leads, and SIG chairs driving IEEE innovation labs, technical build sprints, and peer mentorship.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Quick Filter Toggle Button */}
          <button
            type="button"
            onClick={onToggleOnlyLeaders}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
              onlyLeadersFilter
                ? "bg-amber-500 text-zinc-955 border-amber-400 font-extrabold shadow-amber-500/20"
                : "bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700"
            }`}
          >
            <UserCheck size={13} />
            <span>{onlyLeadersFilter ? "Showing IEEE Officers Only" : "Filter IEEE Officers"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-zinc-400 hover:text-amber-400 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? "Collapse" : "Expand"}</span>
            <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-fade-in">
          {ieeeLeaders.map((leader) => {
            const roleTitle = getIeeeLeadershipRole(leader);
            return (
              <div
                key={leader.id}
                onClick={() => onSelectStudent(leader)}
                className="p-4 rounded-xl border border-amber-500/30 bg-zinc-955/80 hover:bg-zinc-850 hover:border-amber-500/60 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group relative shadow-md"
              >
                <div className="flex flex-col gap-2.5">
                  {/* Top Avatar & Name */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={leader.name} size="sm" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                          {leader.name}
                        </h4>
                        <span className="text-[10px] text-zinc-500 block truncate">{leader.major}</span>
                      </div>
                    </div>
                  </div>

                  {/* IEEE Role Badge */}
                  <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-extrabold flex items-center gap-1.5 shadow-sm">
                    <Award size={13} className="text-amber-400 shrink-0" />
                    <span className="truncate">{roleTitle}</span>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                {/* Skills tags */}
                <div className="flex items-center gap-1 overflow-hidden pt-2 border-t border-zinc-850">
                  {leader.skills.slice(0, 3).map((sk) => (
                    <SkillTag key={sk} skill={sk} variant="card" maxCharLength={8} maxWidthClass="max-w-[65px]" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
