"use client";

import React from "react";
import Link from "next/link";
import { Student } from "../../../data/students";
import CertificationCard from "../cards/CertificationCard";
import { Code, CheckCircle2 } from "lucide-react";
import { isLeadSkill } from "../../../lib/rsoAffiliation";

interface SkillsTabProps {
  student: Student;
  formatDateStr: (dateStr: string) => string;
  onClose?: () => void;
  role?: "standard" | "sponsor" | "admin";
  canFilter?: boolean;
}

export default function SkillsTab({ student, formatDateStr, onClose, role, canFilter: explicitCanFilter }: SkillsTabProps) {
  const canFilter = explicitCanFilter ?? (role ? role !== "standard" : true);
  const leadSkillCount = student.skills.filter((s) => isLeadSkill(s, student)).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-1 pb-4">
      {/* Tech Stacks */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between py-1 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-zinc-200 font-bold text-xs uppercase tracking-wider leading-normal">
            <Code size={14} className="text-amber-500 shrink-0" />
            <span>Skills & Tech Stack ({student.skills.length})</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            {leadSkillCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium text-[11px] bg-zinc-900 border border-amber-400 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                <span>Gold Border = Project / Workshop Lead</span>
              </span>
            )}
            {canFilter && (
              <span className="text-slate-400 dark:text-zinc-500">Click to filter candidates</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-visible">
          {student.skills.map((skill) => {
            const isLead = isLeadSkill(skill, student);
            const chipClasses = isLead
              ? "bg-zinc-900 hover:bg-zinc-800 border-amber-400 hover:border-amber-300 text-zinc-300 hover:text-zinc-100 font-medium shadow-2xs"
              : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 font-medium shadow-2xs";

            return canFilter ? (
              <Link
                key={skill}
                href={`/?skills=${encodeURIComponent(skill)}`}
                onClick={() => onClose?.()}
                className={`text-xs border px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${chipClasses}`}
                title={isLead ? `Project / Workshop Lead Skill: ${skill} (Click to filter)` : `Filter candidates with skill: ${skill}`}
              >
                <span>{skill}</span>
              </Link>
            ) : (
              <span
                key={skill}
                className={`text-xs border px-3 py-1.5 rounded-lg select-none ${chipClasses}`}
                title={isLead ? `Project / Workshop Lead Skill: ${skill}` : `Skill: ${skill}`}
              >
                <span>{skill}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Certifications and Credentials */}
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
          <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
          <span>Certifications & Verified Credentials</span>
        </div>

        {student.certifications && student.certifications.length > 0 ? (
          <div className="grid grid-cols-1 min-[1056px]:grid-cols-2 gap-4">
            {student.certifications.map((cert, idx) => (
              <CertificationCard key={idx} certification={cert} formatDateStr={formatDateStr} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <p className="text-slate-400 text-xs">No certification credentials listed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
