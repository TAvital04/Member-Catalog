"use client";

import React from "react";
import { Briefcase, MapPin, CheckCircle2 } from "lucide-react";
import { JobPosting, JobApplication } from "@/data/jobs";
import { CARD_INTERACTIVE, CARD_TITLE_HOVER } from "@/lib/cardStyles";

export interface JobCardProps {
  job: JobPosting;
  hasApplied: boolean;
  application?: JobApplication;
  onSelectJob: (job: JobPosting) => void;
}

/**
 * JobCard — Reusable Matchy-Matchy Job Posting Card
 * Displays role specifications, compensation, skills, and application status.
 */
export default function JobCard({
  job,
  hasApplied,
  application,
  onSelectJob,
}: JobCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View details and apply for ${job.title} at ${job.companyName}`}
      onClick={() => onSelectJob(job)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectJob(job);
        }
      }}
      className={`${CARD_INTERACTIVE} p-5 flex flex-col justify-between gap-4 h-[250px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400`}
    >
      {/* Top Row: Company Logo & Titles */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-300 text-black font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {job.companyLogo || job.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                {job.companyName}
              </span>
              <h3 className={`font-black text-sm leading-snug truncate ${CARD_TITLE_HOVER}`}>
                {job.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Location & Salary pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-medium flex items-center gap-1 shadow-2xs">
            <MapPin size={10} className="text-slate-400" />
            <span>{job.location} ({job.locationType})</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 font-medium flex items-center gap-1 shadow-2xs">
            <Briefcase size={10} className="text-slate-400" />
            <span>{job.employmentType}</span>
          </span>
          {job.salaryRange && (
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-black font-semibold shadow-2xs">
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
            className="px-2 py-0.5 rounded-lg text-[10.5px] bg-slate-100 border border-slate-200 text-slate-700 font-medium shadow-2xs"
          >
            {skill}
          </span>
        ))}
        {(job.skillsRequired || []).length > 4 && (
          <span className="text-[10px] text-slate-400 font-medium">
            +{(job.skillsRequired || []).length - 4} more
          </span>
        )}
      </div>

      {/* Footer / Application Status */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        {hasApplied ? (
          <span className="flex items-center gap-1.5 text-black font-bold text-[11px]">
            <CheckCircle2 size={13} className="text-black" />
            <span>Applied ({application?.status || "Submitted"})</span>
          </span>
        ) : (
          <span className="text-[11px] text-slate-500 font-medium">
            Portfolio Application Open
          </span>
        )}
      </div>
    </div>
  );
}
