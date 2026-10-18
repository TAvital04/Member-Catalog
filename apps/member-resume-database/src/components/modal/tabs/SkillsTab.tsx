"use client";

import React from "react";
import Link from "next/link";
import { Student } from "../../../data/students";
import CertificationCard from "../cards/CertificationCard";
import { Code, CheckCircle2 } from "lucide-react";

interface SkillsTabProps {
  student: Student;
  formatDateStr: (dateStr: string) => string;
  onClose?: () => void;
}

export default function SkillsTab({ student, formatDateStr, onClose }: SkillsTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-1 pb-4">
      {/* Tech Stacks */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider leading-normal">
            <Code size={14} className="text-amber-500 shrink-0" />
            <span>Skills & Tech Stack ({student.skills.length})</span>
          </div>
          <span className="text-[11px] text-slate-400">Click to filter candidates</span>
        </div>
        <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-50/70 border border-slate-200/90 overflow-visible">
          {student.skills.map((skill) => (
            <Link
              key={skill}
              href={`/?skills=${encodeURIComponent(skill)}`}
              onClick={() => onClose?.()}
              className="text-xs bg-white border border-slate-200/90 text-slate-800 px-3 py-1.5 rounded-lg font-medium hover:border-amber-300 hover:text-amber-900 hover:bg-amber-50/70 transition-all cursor-pointer shadow-2xs"
              title={`Filter candidates with skill: ${skill}`}
            >
              {skill}
            </Link>
          ))}
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
