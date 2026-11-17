"use client";

import React from "react";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { JobPosting, JobApplication } from "@/data/jobs";
import { CatalogCard } from "@/components/ui";

export interface JobCardProps {
  job: JobPosting;
  hasApplied: boolean;
  application?: JobApplication;
  onSelectJob: (job: JobPosting) => void;
}

/**
 * JobCard — Reusable Standardized Job Posting Card
 * Built with the unified CatalogCard primitive.
 */
export default function JobCard({
  job,
  hasApplied,
  application,
  onSelectJob,
}: JobCardProps) {
  return (
    <CatalogCard
      avatar={
        <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-300 text-black font-black text-xs flex items-center justify-center shrink-0">
          {job.companyLogo || job.companyName.slice(0, 2).toUpperCase()}
        </div>
      }
      title={job.title}
      subtitle={`${job.companyName} • ${job.location}`}
      description={
        job.description ||
        `Engineering opportunity for ${job.employmentType} roles at ${job.companyName}.`
      }
      footerIcon={<Briefcase size={13} className="text-neutral-400" />}
      footerText={`${job.employmentType}${job.salaryRange ? ` • ${job.salaryRange}` : ""}`}
      footerRight={
        hasApplied ? (
          <span className="flex items-center gap-1 text-black font-bold text-[10px]">
            <CheckCircle2 size={11} /> Applied
          </span>
        ) : null
      }
      onClick={() => onSelectJob(job)}
      ariaLabel={`View details and apply for ${job.title} at ${job.companyName}`}
    />
  );
}
