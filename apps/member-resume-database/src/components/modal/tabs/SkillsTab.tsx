"use client";

import React from "react";
import { Student } from "../../../data/students";
import CertificationCard from "../cards/CertificationCard";
import { Code, CheckCircle2 } from "lucide-react";


interface SkillsTabProps {
  student: Student;
  formatDateStr: (dateStr: string) => string;
}

export default function SkillsTab({ student, formatDateStr }: SkillsTabProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-1 pb-4">
      {/* Tech Stacks */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal">
          <Code size={14} className="text-amber-500 shrink-0" />
          <span>Skills & Tech Stack ({student.skills.length})</span>
        </div>
        <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-zinc-850 border border-zinc-800 overflow-visible">
          {student.skills.map((skill) => (
            <span key={skill} className="text-xs bg-zinc-955 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg font-medium hover:border-amber-500/50 hover:text-amber-300 transition-colors block">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications and Credentials */}
      <div className="flex flex-col gap-3 border-t border-zinc-800/80 pt-6">
        <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal">
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
          <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-650 text-xs">No certification credentials listed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
