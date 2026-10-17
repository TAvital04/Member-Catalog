"use client";

import React from "react";
import { Users, GraduationCap, Sparkles } from "lucide-react";

interface DirectoryStatsHeaderProps {
  totalResumes: number;
  majorCount: number;
  totalSkillsCount: number;
}

export default function DirectoryStatsHeader({
  totalResumes,
  majorCount,
  totalSkillsCount,
}: DirectoryStatsHeaderProps) {
  return (
    <header className="max-w-7xl w-full mx-auto px-4 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          Member Candidate Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
          Explore verified UCF engineering and computer science student resumes, portfolios, and project achievements.
        </p>
      </div>

      {/* Lightweight compact metrics */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs font-semibold">
          <Users size={13} className="text-amber-600" />
          <span>{totalResumes} Candidates</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs font-semibold">
          <GraduationCap size={13} className="text-amber-600" />
          <span>{majorCount} Majors</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs font-semibold">
          <Sparkles size={13} className="text-amber-600" />
          <span>{totalSkillsCount} Skills</span>
        </div>
      </div>
    </header>
  );
}
