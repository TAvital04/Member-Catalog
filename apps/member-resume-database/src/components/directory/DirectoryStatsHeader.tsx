"use client";

import React from "react";

export interface DirectoryStatsHeaderProps {
  title?: string;
  description?: string;
  totalResumes?: number;
  majorCount?: number;
  totalSkillsCount?: number;
  children?: React.ReactNode;
}

export default function DirectoryStatsHeader({
  title = "Member Candidate Directory",
  description = "Explore verified UCF engineering and computer science student resumes, portfolios, and project achievements.",
  children,
}: DirectoryStatsHeaderProps) {
  return (
    <header className="max-w-7xl w-full mx-auto px-4 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
          {description}
        </p>
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </header>
  );
}
