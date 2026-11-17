"use client";

import React from "react";
import { Briefcase, MapPin, CheckCircle2 } from "lucide-react";
import { JobPosting, JobApplication } from "@/data/jobs";
import { Card, Badge } from "@/components/ui";

export interface JobCardProps {
  job: JobPosting;
  hasApplied: boolean;
  application?: JobApplication;
  onSelectJob: (job: JobPosting) => void;
}

/**
 * JobCard — Reusable Standardized Job Posting Card
 * Uses standardized Card & Badge components from the UI suite.
 */
export default function JobCard({
  job,
  hasApplied,
  application,
  onSelectJob,
}: JobCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectJob(job);
    }
  };

  return (
    <Card
      as="div"
      role="button"
      tabIndex={0}
      variant="interactive"
      padding="none"
      onClick={() => onSelectJob(job)}
      onKeyDown={handleKeyDown}
      className="text-left p-5 flex flex-col justify-between gap-4 h-[250px] w-full cursor-pointer"
      aria-label={`View details and apply for ${job.title} at ${job.companyName}`}
    >
      {/* Top Row: Company Logo & Titles */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-300 text-black font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {job.companyLogo || job.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block truncate">
                {job.companyName}
              </span>
              <h3 className="font-black text-sm text-black leading-snug truncate">
                {job.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Location & Salary pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium flex items-center gap-1">
            <MapPin size={10} className="text-neutral-500" />
            <span>{job.location} ({job.locationType})</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium flex items-center gap-1">
            <Briefcase size={10} className="text-neutral-500" />
            <span>{job.employmentType}</span>
          </span>
          {job.salaryRange && (
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-black font-semibold">
              {job.salaryRange}
            </span>
          )}
        </div>
      </div>

      {/* Middle: Required Skills */}
      <div className="flex flex-wrap gap-1 items-center">
        {(job.skillsRequired || []).slice(0, 4).map((skill, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded-lg text-[10.5px] bg-neutral-100 border border-neutral-200 text-black font-medium"
          >
            {skill}
          </span>
        ))}
        {(job.skillsRequired || []).length > 4 && (
          <span className="text-[10px] text-neutral-400 font-medium">
            +{(job.skillsRequired || []).length - 4} more
          </span>
        )}
      </div>

      {/* Footer / Application Status */}
      {hasApplied && (
        <div className="pt-2.5 border-t border-neutral-200 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-black font-bold text-[11px]">
            <CheckCircle2 size={13} className="text-black" />
            <span>Applied ({application?.status || "Submitted"})</span>
          </span>
        </div>
      )}
    </Card>
  );
}
