"use client";

import React from "react";
import { Users, Laptop, Code2 } from "lucide-react";

interface DirectoryStatsHeaderProps {
  totalResumes: number;
  majorCount: number;
  totalSkillsCount: number;
}

export default function DirectoryStatsHeader({
  totalResumes,
  majorCount,
  totalSkillsCount
}: DirectoryStatsHeaderProps) {
  return (
    <header className="max-w-7xl w-full mx-auto px-4 py-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-black text-zinc-100 tracking-tight leading-tight">Student Directory</h2>
        <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
          Browse engineering and computer science portfolios representing the IEEE Student Chapter at UCF.
        </p>
      </div>

      {/* Dashboard stats cards */}
      <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 text-xs">
        <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800 min-w-[90px] text-center">
          <span className="block text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">Profiles</span>
          <span className="font-extrabold text-zinc-200 text-sm flex items-center justify-center gap-1">
            <Users size={12} className="text-amber-500" />
            {totalResumes}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800 min-w-[90px] text-center">
          <span className="block text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">Majors</span>
          <span className="font-extrabold text-zinc-200 text-sm flex items-center justify-center gap-1">
            <Laptop size={12} className="text-amber-500" />
            {majorCount}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800 min-w-[90px] text-center">
          <span className="block text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">Skills</span>
          <span className="font-extrabold text-zinc-200 text-sm flex items-center justify-center gap-1">
            <Code2 size={12} className="text-amber-500" />
            {totalSkillsCount}
          </span>
        </div>
      </div>
    </header>
  );
}
