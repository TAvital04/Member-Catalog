"use client";

import React from "react";
interface DirectoryStatsHeaderProps {
  totalResumes?: number;
  majorCount?: number;
  totalSkillsCount?: number;
}

export default function DirectoryStatsHeader({}: DirectoryStatsHeaderProps) {
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
    </header>
  );
}
