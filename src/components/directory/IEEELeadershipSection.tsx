"use client";

import React, { useState } from "react";
import { Student, getIeeeLeadershipRole } from "@/data/students";
import { ShieldCheck, Award, UserCheck } from "lucide-react";
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
    <section className="w-full bg-white border border-neutral-300 rounded-xl p-4 md:p-6 mb-6 relative overflow-hidden animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-black text-white shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black text-black uppercase tracking-wider">
                RSO USF Officers & Committee Leads
              </h2>
              <span className="border border-black bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Student Leaders
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
              Student officers, committee leads, and SIG chairs driving RSO innovation labs, technical build sprints, and peer mentorship.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Quick Filter Toggle Button */}
          <button
            type="button"
            onClick={onToggleOnlyLeaders}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              onlyLeadersFilter
                ? "bg-black text-white border-black"
                : "bg-white border-neutral-300 text-black hover:border-black"
            }`}
          >
            <UserCheck size={13} />
            <span>{onlyLeadersFilter ? "Showing RSO Officers Only" : "Filter RSO Officers"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-neutral-600 hover:text-black font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? "Collapse" : "Expand"}</span>
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
                className="p-4 rounded-lg border border-neutral-200 bg-white cursor-pointer flex flex-col justify-between gap-3 group relative"
              >
                <div className="flex flex-col gap-2.5">
                  {/* Top Avatar & Name */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={leader.name} size="sm" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-black transition-colors truncate">
                          {leader.name}
                        </h4>
                        <span className="text-[10px] text-neutral-500 block truncate">{leader.major}</span>
                      </div>
                    </div>
                  </div>

                  {/* IEEE Role Badge */}
                  <div className="px-2 py-0.5 rounded border border-neutral-200 bg-neutral-100 text-black text-[11px] font-bold flex items-center gap-1.5">
                    <Award size={13} className="text-black shrink-0" />
                    <span className="truncate">{roleTitle}</span>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                {/* Skills tags */}
                <div className="flex items-center gap-1 overflow-hidden pt-2 border-t border-neutral-100">
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
