"use client";

import React from "react";
import Link from "next/link";
import { Student } from "@/data/students";
import { isLeadSkill } from "@/lib/rsoAffiliation";
import { UserRole } from "@/hooks/useRoleManager";

interface SkillsTabProps {
  student: Student;
  formatDateStr?: (dateStr: string) => string;
  onClose?: () => void;
  role?: UserRole;
  canFilter?: boolean;
}

export default function SkillsTab({ student, onClose, role, canFilter: explicitCanFilter }: SkillsTabProps) {
  const canFilter = explicitCanFilter ?? true;
  const leadSkillCount = student.skills.filter((s) => isLeadSkill(s, student)).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-1 pb-4">
      {/* Tech Stacks */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
            <span>Skills & Tech Stack</span>
            <span className="bg-neutral-100 text-black border border-neutral-300 text-[10px] px-2 py-0.2 rounded-full font-bold">
              {student.skills.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Workshop Attendance</span>
        </div>

        {/* Lead Skill Filter Legend & Status */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
          {leadSkillCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[10.5px] bg-neutral-100 text-black border border-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></span>
              <span>Black Border = Workshop Lead</span>
            </span>
          ) : (
            <span className="text-slate-400">Earned Exclusively via Chapter Workshops</span>
          )}
          {canFilter && (
            <span className="text-slate-400 font-medium">Click to filter candidates</span>
          )}
        </div>

        <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap gap-2 overflow-visible">
          {student.skills.map((skill) => {
            const isLead = isLeadSkill(skill, student);
            const chipClasses = isLead
              ? "bg-neutral-100 border-2 border-black text-black font-bold shadow-2xs"
              : "bg-white border border-neutral-300 text-black font-semibold shadow-2xs";

            return canFilter ? (
              <Link
                key={skill}
                href={`/?skills=${encodeURIComponent(skill)}`}
                onClick={() => onClose?.()}
                className={`text-xs px-3 py-1.5 rounded-lg cursor-pointer ${chipClasses}`}
              >
                <span>{skill}</span>
              </Link>
            ) : (
              <span
                key={skill}
                className={`text-xs px-3 py-1.5 rounded-lg select-none ${chipClasses}`}
              >
                <span>{skill}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
