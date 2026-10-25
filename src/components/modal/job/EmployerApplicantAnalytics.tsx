"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Users,
  GraduationCap,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronDown,
  Building2,
  FolderGit2,
  Award,
} from "lucide-react";
import { JobPosting, JobApplication } from "@/data/jobs";
import CustomDropdown from "@/components/common/CustomDropdown";

interface EmployerApplicantAnalyticsProps {
  jobs: JobPosting[];
  applications: JobApplication[];
  selectedJobId?: string;
  onSelectJobId?: (id: string) => void;
}

export default function EmployerApplicantAnalytics({
  jobs,
  applications,
  selectedJobId = "all",
  onSelectJobId,
}: EmployerApplicantAnalyticsProps) {
  const [internalJobFilter, setInternalJobFilter] = useState<string>(selectedJobId);

  const activeJobId = onSelectJobId ? selectedJobId : internalJobFilter;
  const setJobId = onSelectJobId || setInternalJobFilter;

  // Filtered applications based on selected job
  const filteredApps = useMemo(() => {
    if (activeJobId === "all") return applications;
    return applications.filter((a) => a.jobId === activeJobId);
  }, [applications, activeJobId]);

  const activeJob = useMemo(() => {
    return jobs.find((j) => j.id === activeJobId);
  }, [jobs, activeJobId]);

  // Total unique candidates
  const uniqueCandidateEmails = useMemo(() => {
    const set = new Set(filteredApps.map((a) => a.portfolioSnapshot.email));
    return set.size;
  }, [filteredApps]);

  // Major distribution
  const majorStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredApps.forEach((app) => {
      const major = app.portfolioSnapshot.major || "Other";
      counts[major] = (counts[major] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredApps]);

  // Grad date distribution
  const gradStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredApps.forEach((app) => {
      const date = app.portfolioSnapshot.gradDate || "Unknown";
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredApps]);

  // Status breakdown
  const statusStats = useMemo(() => {
    const counts: Record<string, number> = {
      Submitted: 0,
      "Under Review": 0,
      Interviewing: 0,
      Offered: 0,
      Declined: 0,
    };
    filteredApps.forEach((app) => {
      if (counts[app.status] !== undefined) {
        counts[app.status] += 1;
      }
    });
    return counts;
  }, [filteredApps]);

  // Skills frequency
  const skillFrequency = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredApps.forEach((app) => {
      (app.portfolioSnapshot.skills || []).forEach((skill) => {
        counts[skill] = (counts[skill] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [filteredApps]);

  // Top chapter projects represented
  const chapterProjects = useMemo(() => {
    const set = new Set<string>();
    filteredApps.forEach((app) => {
      if (app.portfolioSnapshot.mainProjectName) {
        set.add(app.portfolioSnapshot.mainProjectName);
      }
    });
    return Array.from(set);
  }, [filteredApps]);

  // Advanced pipeline conversion %
  const advancedCount = (statusStats["Interviewing"] || 0) + (statusStats["Offered"] || 0);
  const conversionRate = filteredApps.length > 0
    ? Math.round((advancedCount / filteredApps.length) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Controller Bar */}
      <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 shrink-0">
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              Applicant Pool Analytics & Demographics
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live aggregate metrics on member skills, academic distribution, and pipeline velocity.
            </p>
          </div>
        </div>

        {/* Role Selector Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Role:
          </span>
          <CustomDropdown
            value={activeJobId}
            onChange={(val) => setJobId(val)}
            options={[
              {
                value: "all",
                label: `All Postings (${applications.length} applicants)`,
              },
              ...jobs.map((j) => {
                const count = applications.filter((a) => a.jobId === j.id).length;
                return {
                  value: j.id,
                  label: `${j.companyName} — ${j.title}`,
                  badge: `${count} applicants`,
                  sublabel: `${j.employmentType} • ${j.location}`,
                };
              }),
            ]}
            className="w-full sm:w-72"
            buttonClassName="bg-slate-50/80 hover:bg-slate-100 text-xs font-semibold"
            align="right"
          />
        </div>
      </div>

      {/* 4 High-Level Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Tile 1: Total Submissions */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Users size={12} className="text-slate-400" />
            <span>Total Applications</span>
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{filteredApps.length}</span>
            <span className="text-[11px] font-semibold text-slate-500">
              ({uniqueCandidateEmails} unique candidates)
            </span>
          </div>
        </div>

        {/* Tile 2: Pipeline Conversion Rate */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp size={12} className="text-purple-500" />
            <span>Interview/Offer Rate</span>
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-purple-700">{conversionRate}%</span>
            <span className="text-[11px] font-semibold text-slate-500">
              ({advancedCount} advanced)
            </span>
          </div>
        </div>

        {/* Tile 3: Top Major Representation */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <GraduationCap size={12} className="text-amber-600" />
            <span>Top Degree</span>
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-black text-slate-900 truncate">
              {majorStats[0]?.[0] || "N/A"}
            </span>
            {majorStats[0] && (
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                {Math.round((majorStats[0][1] / (filteredApps.length || 1)) * 100)}%
              </span>
            )}
          </div>
        </div>

        {/* Tile 4: Primary Graduation Year */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Award size={12} className="text-emerald-600" />
            <span>Leading Cohort</span>
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-black text-slate-900 truncate">
              {gradStats[0]?.[0] || "N/A"}
            </span>
            {gradStats[0] && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold shrink-0">
                Full-time Ready
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2x2 Analytics Modules Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Module 1: Academic Major Breakdown & Proportions */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-amber-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Academic Major Breakdown
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">Degree Proportions</span>
          </div>

          {/* Composite Proportion Bar */}
          {filteredApps.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pool Composition
              </span>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                {majorStats.map(([major, count], idx) => {
                  const percent = Math.round((count / (filteredApps.length || 1)) * 100);
                  const colors = [
                    "bg-amber-500",
                    "bg-sky-500",
                    "bg-emerald-500",
                    "bg-purple-500",
                    "bg-rose-500",
                  ];
                  return (
                    <div
                      key={major}
                      title={`${major}: ${count} (${percent}%)`}
                      style={{ width: `${percent}%` }}
                      className={`${colors[idx % colors.length]} h-full transition-all duration-500`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Individual Major Proportions */}
          <div className="flex flex-col gap-3">
            {majorStats.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No candidate majors recorded yet.</p>
            ) : (
              majorStats.map(([major, count], idx) => {
                const percent = Math.round((count / (filteredApps.length || 1)) * 100);
                const barColors = [
                  "bg-amber-500",
                  "bg-sky-500",
                  "bg-emerald-500",
                  "bg-purple-500",
                  "bg-rose-500",
                ];
                const dotColors = [
                  "bg-amber-500",
                  "bg-sky-500",
                  "bg-emerald-500",
                  "bg-purple-500",
                  "bg-rose-500",
                ];
                return (
                  <div key={major} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${dotColors[idx % dotColors.length]} shrink-0`} />
                        <span className="text-slate-800 font-bold truncate">{major}</span>
                      </div>
                      <span className="text-slate-500 text-[11px] shrink-0 font-medium">
                        <strong className="text-slate-900 font-bold">{count}</strong> {count === 1 ? "student" : "students"} ({percent}%)
                      </span>
                    </div>
                    {/* Visual Proportion Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColors[idx % barColors.length]} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Module 2: Top Technical Skills in Candidate Pool */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Top Technical Skills
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">Applicant Frequency</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {skillFrequency.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No skills recorded yet.</p>
            ) : (
              skillFrequency.map(([skill, count]) => {
                const percent = Math.round((count / (filteredApps.length || 1)) * 100);
                return (
                  <div key={skill} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-800">{skill}</span>
                      <span className="text-slate-500 text-[11px]">
                        {count} {count === 1 ? "applicant" : "applicants"} ({percent}%)
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Module 3: Hiring Funnel Status Breakdown */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-purple-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recruitment Funnel Stages
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">Status Distribution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
                  1. Submitted
                </span>
                <span className="text-xl font-black text-sky-950 mt-0.5 block">
                  {statusStats["Submitted"]}
                </span>
              </div>
              <span className="text-xs font-bold text-sky-700">
                {Math.round(((statusStats["Submitted"] || 0) / (filteredApps.length || 1)) * 100)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                  2. Under Review
                </span>
                <span className="text-xl font-black text-amber-950 mt-0.5 block">
                  {statusStats["Under Review"]}
                </span>
              </div>
              <span className="text-xs font-bold text-amber-700">
                {Math.round(((statusStats["Under Review"] || 0) / (filteredApps.length || 1)) * 100)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">
                  3. Interviewing
                </span>
                <span className="text-xl font-black text-purple-950 mt-0.5 block">
                  {statusStats["Interviewing"]}
                </span>
              </div>
              <span className="text-xs font-bold text-purple-700">
                {Math.round(((statusStats["Interviewing"] || 0) / (filteredApps.length || 1)) * 100)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  4. Offers Extended
                </span>
                <span className="text-xl font-black text-emerald-950 mt-0.5 block">
                  {statusStats["Offered"]}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700">
                {Math.round(((statusStats["Offered"] || 0) / (filteredApps.length || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Module 4: Graduation Cohorts & Standings */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Award size={15} className="text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Graduation Class Standings
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">Cohort Timeline</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {gradStats.map(([gradDate, count]) => {
              const percent = Math.round((count / (filteredApps.length || 1)) * 100);
              return (
                <div key={gradDate} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800 font-bold">{gradDate}</span>
                    <span className="text-slate-500 text-[11px]">
                      {count} {count === 1 ? "candidate" : "candidates"} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Module 3: Verified Chapter Projects Represented in Pool */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <FolderGit2 size={15} className="text-amber-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verified Chapter Projects Represented by Applicants
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">Hands-on Collegiate Engineering Experience</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {chapterProjects.map((projectName) => (
            <div
              key={projectName}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs font-semibold text-slate-800 shadow-2xs"
            >
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
              <span className="truncate">{projectName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
