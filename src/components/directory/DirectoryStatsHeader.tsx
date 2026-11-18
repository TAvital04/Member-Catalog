"use client";

import React from "react";
import { Heading, Subheading } from "@/components/ui";

export interface DirectoryStatsHeaderProps {
  title?: string;
  description?: string;
  totalResumes?: number;
  majorCount?: number;
  totalSkillsCount?: number;
  children?: React.ReactNode;
}

/**
 * DirectoryStatsHeader — Standardized Header Banner for Catalog Pages
 * Uses the single-source Heading and Subheading primitive components.
 */
export default function DirectoryStatsHeader({
  title = "Member Candidate Directory",
  description = "Explore USF engineering and computer science student resumes, portfolios, and project achievements.",
  children,
}: DirectoryStatsHeaderProps) {
  return (
    <header className="max-w-7xl w-full mx-auto px-4 pt-6 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200 mb-6 bg-white">
      <div className="space-y-1 max-w-2xl">
        <Heading variant="page">{title}</Heading>
        {description && (
          <Subheading variant="page">{description}</Subheading>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </header>
  );
}
