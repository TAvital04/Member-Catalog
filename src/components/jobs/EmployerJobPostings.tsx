"use client";

import React from "react";
import { Building2, Plus, Clock, Users } from "lucide-react";
import CustomDropdown from "@/components/common/CustomDropdown";
import { JobPosting, JobApplication } from "@/data/jobs";
import { CARD_INTERACTIVE, CARD_TITLE_HOVER } from "@/lib/cardStyles";

export interface EmployerJobPostingsProps {
  employerJobs: JobPosting[];
  jobsList: JobPosting[];
  applicationsList: JobApplication[];
  selectedEmployerCompany: string;
  setSelectedEmployerCompany: (company: string) => void;
  hiringCompanies: string[];
  onOpenPostJobModal: () => void;
  onSelectJobForApplicants: (job: JobPosting) => void;
}

/**
 * EmployerJobPostings — Reusable Matchy-Matchy Employer Management Dashboard
 * Displays corporate job listings, applicant badges, and new opportunity actions.
 */
export default function EmployerJobPostings({
  employerJobs,
  jobsList,
  applicationsList,
  selectedEmployerCompany,
  setSelectedEmployerCompany,
  hiringCompanies,
  onOpenPostJobModal,
  onSelectJobForApplicants,
}: EmployerJobPostingsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Employer Action & Stats Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-900">
            Employer Hiring Dashboard
          </h2>
          <p className="text-xs text-slate-500">
            Manage active corporate engineering postings and inspect applicant portfolios.
          </p>
        </div>

        {/* + Post New Job Button */}
        <button
          type="button"
          onClick={onOpenPostJobModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Plus size={15} />
          <span>+ Post New Opportunity</span>
        </button>
      </div>

      {/* Filter by Employer Company */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Company Filter:
          </span>
          <CustomDropdown
            value={selectedEmployerCompany}
            onChange={(val) => setSelectedEmployerCompany(val)}
            options={[
              { value: "All", label: "All Companies" },
              ...hiringCompanies.map((c) => ({
                value: c,
                label: c,
              })),
            ]}
            className="w-48 sm:w-60"
            buttonClassName="bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-800 text-xs font-semibold"
            align="left"
            aria-label="Company Filter"
          />
        </div>

        <span className="text-slate-500">
          {employerJobs.length} active posting{employerJobs.length === 1 ? "" : "s"} listed
        </span>
      </div>

      {/* Employer Postings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {employerJobs.map((job) => {
          const jobApps = applicationsList.filter((a) => a.jobId === job.id);

          return (
            <div
              key={job.id}
              role="button"
              tabIndex={0}
              aria-label={`Manage posting and review applicants for ${job.title}`}
              onClick={() => onSelectJobForApplicants(job)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectJobForApplicants(job);
                }
              }}
              className={`${CARD_INTERACTIVE} p-5 flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400`}
            >
              {/* Header: Company, Title & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {job.companyName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      • {job.department || "Engineering"}
                    </span>
                  </div>
                  <h3 className={`font-black text-base leading-snug ${CARD_TITLE_HOVER}`}>
                    {job.title}
                  </h3>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                    job.status === "Active"
                      ? "bg-neutral-100 text-black border-neutral-300 font-bold"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              {/* Metadata Specs */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-medium">
                  {job.employmentType}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-medium">
                  {job.location} ({job.locationType})
                </span>
                {job.salaryRange && (
                  <span className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-300 text-black font-semibold">
                    {job.salaryRange}
                  </span>
                )}
              </div>

              {/* Actions Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock size={12} />
                  <span>
                    Posted{" "}
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </span>

                {/* Review Applicants Action */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-300 text-black text-xs font-bold shadow-none">
                  <Users size={13} className="text-black" />
                  <span>Review Applicants ({jobApps.length})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
