"use client";

import React from "react";
import Link from "next/link";
import { Student } from "../../../data/students";
import CertificationCard from "../cards/CertificationCard";
import { Code, CheckCircle2, Sparkles } from "lucide-react";
import { isRsoSkill } from "../../../lib/rsoAffiliation";

interface SkillsTabProps {
  student: Student;
  formatDateStr: (dateStr: string) => string;
  onClose?: () => void;
  role?: "standard" | "sponsor" | "admin";
  canFilter?: boolean;
}

export default function SkillsTab({ student, formatDateStr, onClose, role, canFilter: explicitCanFilter }: SkillsTabProps) {
  const canFilter = explicitCanFilter ?? (role ? role !== "standard" : true);
  const rsoSkillCount = student.skills.filter((s) => isRsoSkill(s, student)).length;

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
            {rsoSkillCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-amber-500/15 border border-amber-400/60 text-amber-800 dark:text-amber-300">
                <Sparkles size={10} className="text-amber-500 fill-current" />
                <span>Gold = RSO Affiliated</span>
              </span>
            )}
            {canFilter && (
              <span className="text-slate-400 dark:text-zinc-500">Click to filter candidates</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-900/60 border border-slate-200/90 dark:border-zinc-800 overflow-visible">
          {student.skills.map((skill) => {
            const isAffiliated = isRsoSkill(skill, student);
            const rsoClasses = isAffiliated
              ? "bg-amber-500/15 border-amber-400/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/30 font-bold hover:bg-amber-500/25 shadow-2xs"
              : "bg-white dark:bg-zinc-850 border-slate-200/90 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 font-medium hover:border-amber-300 hover:text-amber-900 hover:bg-amber-50/70 shadow-2xs";

            return canFilter ? (
              <Link
                key={skill}
                href={`/?skills=${encodeURIComponent(skill)}`}
                onClick={() => onClose?.()}
                className={`text-xs border px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${rsoClasses}`}
                title={isAffiliated ? `RSO Affiliated Skill: ${skill} (Click to filter)` : `Filter candidates with skill: ${skill}`}
              >
                {isAffiliated && <Sparkles size={11} className="text-amber-500 shrink-0 fill-current" />}
                <span>{skill}</span>
              </Link>
            ) : (
              <span
                key={skill}
                className={`text-xs border px-3 py-1.5 rounded-lg select-none flex items-center gap-1.5 ${rsoClasses}`}
                title={isAffiliated ? `RSO Affiliated Skill: ${skill}` : `Skill: ${skill}`}
              >
                {isAffiliated && <Sparkles size={11} className="text-amber-500 shrink-0 fill-current" />}
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
