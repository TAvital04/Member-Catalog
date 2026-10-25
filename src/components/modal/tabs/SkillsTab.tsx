"use client";

import React from "react";
import Link from "next/link";
import { Student } from "@/data/students";
import CertificationCard from "../cards/CertificationCard";
import { Code, CheckCircle2 } from "lucide-react";
import { isLeadSkill } from "@/lib/rsoAffiliation";

interface SkillsTabProps {
  student: Student;
  formatDateStr: (dateStr: string) => string;
  onClose?: () => void;
  role?: "standard" | "sponsor" | "admin";
  canFilter?: boolean;
}

export default function SkillsTab({ student, formatDateStr, onClose, role, canFilter: explicitCanFilter }: SkillsTabProps) {
  const canFilter = explicitCanFilter ?? true;
  const leadSkillCount = student.skills.filter((s) => isLeadSkill(s, student)).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-1 pb-4">
      {/* Tech Stacks */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
            <Code size={14} className="text-amber-600 dark:text-amber-500 shrink-0" />
            <span>Skills & Tech Stack</span>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-2 py-0.2 rounded-full font-bold">
              {student.skills.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Verified Member Skillset</span>
        </div>

        {/* Lead Skill Filter Legend & Status */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-[11px]">
          {leadSkillCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[10.5px] bg-amber-50 text-amber-800 border border-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Gold Border = Project / Workshop Lead</span>
            </span>
          ) : (
            <span className="text-slate-400">Core Engineering Competencies</span>
          )}
          {canFilter && (
            <span className="text-slate-400 font-medium">Click to filter candidates</span>
          )}
        </div>

        <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap gap-2 overflow-visible">
          {student.skills.map((skill) => {
            const isLead = isLeadSkill(skill, student);
            const chipClasses = isLead
              ? "bg-amber-50/40 hover:bg-amber-100/60 border-2 border-amber-500 text-slate-900 font-bold shadow-2xs"
              : "bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-slate-900 font-semibold shadow-2xs";

            return canFilter ? (
              <Link
                key={skill}
                href={`/?skills=${encodeURIComponent(skill)}`}
                onClick={() => onClose?.()}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer ${chipClasses}`}
                title={isLead ? `Project / Workshop Lead Skill: ${skill} (Click to filter)` : `Filter candidates with skill: ${skill}`}
              >
                <span>{skill}</span>
              </Link>
            ) : (
              <span
                key={skill}
                className={`text-xs px-3 py-1.5 rounded-lg select-none ${chipClasses}`}
                title={isLead ? `Project / Workshop Lead Skill: ${skill}` : `Skill: ${skill}`}
              >
                <span>{skill}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Certifications and Credentials */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 size={14} className="text-amber-600 dark:text-amber-500 shrink-0" />
            <span>Certifications & Verified Credentials</span>
            {student.certifications && student.certifications.length > 0 && (
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-2 py-0.2 rounded-full font-bold">
                {student.certifications.length}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Accredited Achievements</span>
        </div>

        {student.certifications && student.certifications.length > 0 ? (
          <div className="grid grid-cols-1 min-[1056px]:grid-cols-2 gap-3.5">
            {student.certifications.map((cert, idx) => (
              <CertificationCard key={idx} certification={cert} formatDateStr={formatDateStr} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200 p-6 shadow-2xs">
            <p className="text-slate-500 text-xs">No certification credentials listed on this profile yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
