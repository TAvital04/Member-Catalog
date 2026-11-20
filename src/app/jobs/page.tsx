"use client";

/**
 * @file page.tsx — RSO USF Career & Job Opportunities Portal
 * @description Dedicated chapter engineering career hub supporting member 1-click portfolio applications
 * and streamlined corporate partner / employer posting management.
 */

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  Building2,
  Users,
  BarChart3,
  Shield,
  GraduationCap,
  Lock,
} from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import DirectoryStatsHeader from "@/components/directory/DirectoryStatsHeader";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useRoleManager } from "@/hooks/useRoleManager";
import { useStudentData } from "@/hooks/useStudentData";
import {
  JobPosting,
  JobApplication,
  SAMPLE_JOB_POSTINGS,
  SAMPLE_JOB_APPLICATIONS,
} from "@/data/jobs";
import { Student } from "@/data/students";
import { CURRENT_CHAPTER_SPONSORS } from "@/data/sponsors";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import EmployerJobPostings from "@/components/jobs/EmployerJobPostings";
import JobDetailModal from "@/components/modal/job/JobDetailModal";
import SponsorJobPostingForm from "@/components/forms/SponsorJobPostingForm";
import EmployerApplicantsModal from "@/components/modal/job/EmployerApplicantsModal";
import EmployerApplicantAnalytics from "@/components/modal/job/EmployerApplicantAnalytics";
import PortfolioModal from "@/components/modal/PortfolioModal";
import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";
import SearchInput from "@/components/common/SearchInput";
import { getStudentSlug, findStudentBySlugOrId } from "@/lib/studentSlug";

function JobsPageContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { role, session, handleRoleChange, isAdmin, isStudent, isSponsor } = useRoleManager();
  const isPremium = isAdmin || isSponsor || isStudent;
  const { students } = useStudentData(role);

  // Screen Mode: "member" (browse & apply) vs "employer" (manage postings & applicants)
  // Tailored to the 3 logins: Leadership & Sponsors default to Employer Management; Students/Guests to Member Board.
  const [portalMode, setPortalMode] = useState<"member" | "employer">(
    isAdmin || isSponsor ? "employer" : "member"
  );

  const [onlyMyApplications, setOnlyMyApplications] = useState(false);
  const [onlyMyCompanyJobs, setOnlyMyCompanyJobs] = useState(false);

  // Match active student profile from authenticated session
  const loggedInStudent = useMemo(() => {
    if (!isStudent || students.length === 0) return null;
    const targetId = session?.studentId?.toLowerCase();
    const targetEmail = session?.email?.toLowerCase();
    const targetName = session?.displayName?.toLowerCase();

    return (
      students.find((s) => {
        if (targetId && s.id.toLowerCase() === targetId) return true;
        if (targetEmail && s.email.toLowerCase() === targetEmail) return true;
        if (targetName && s.name.toLowerCase() === targetName) return true;
        return false;
      }) || students[0]
    );
  }, [isStudent, session, students]);

  // Match active sponsor company from authenticated session
  const loggedInSponsor = useMemo(() => {
    if (!isSponsor) return null;
    const sponsorId = session?.sponsorId?.toLowerCase();
    const org = session?.organization?.toLowerCase().trim();
    const email = session?.email?.toLowerCase().trim();

    return (
      CURRENT_CHAPTER_SPONSORS.find(
        (s) =>
          (sponsorId && s.id.toLowerCase() === sponsorId) ||
          (org && (s.name.toLowerCase().includes(org) || org.includes(s.name.toLowerCase()))) ||
          (email && email.includes(s.id.toLowerCase()))
      ) || CURRENT_CHAPTER_SPONSORS[0]
    );
  }, [isSponsor, session]);

  // URL search parameter synchronization
  const searchParams = useSearchParams();
  const jobParam = searchParams.get("job") || searchParams.get("jobId") || searchParams.get("slug");
  const qParam = searchParams.get("q") || searchParams.get("search");
  const typesParam = searchParams.get("types") || searchParams.get("employment");
  const locationsParam = searchParams.get("locations");
  const skillsParam = searchParams.get("skills");
  const companiesParam = searchParams.get("companies");
  const myParam = searchParams.get("my");
  const portalParam = searchParams.get("portal");
  const memberParam = searchParams.get("member") || searchParams.get("student");

  // Jobs and applications state
  const [jobsList, setJobsList] = useState<JobPosting[]>([]);
  const [applicationsList, setApplicationsList] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters for Member view initialized from URL params
  const [searchQuery, setSearchQuery] = useState(() => qParam || "");
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>(() =>
    typesParam ? typesParam.split(",").filter(Boolean) : []
  );
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>(() =>
    locationsParam ? locationsParam.split(",").filter(Boolean) : []
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(() =>
    skillsParam ? skillsParam.split(",").filter(Boolean) : []
  );
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(() =>
    companiesParam ? companiesParam.split(",").filter(Boolean) : []
  );

  const updateJobUrl = (updates: Record<string, string | null | undefined>) => {
    const url = new URL(window.location.href);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, val);
      }
    });
    window.history.pushState(null, "", url.pathname + (url.search ? url.search : ""));
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    updateJobUrl({ q: q.trim() ? q : null });
  };

  const handleEmploymentTypesChange = (types: string[]) => {
    setSelectedEmploymentTypes(types);
    updateJobUrl({ types: types.length ? types.join(",") : null });
  };

  const handleLocationTypesChange = (locs: string[]) => {
    setSelectedLocationTypes(locs);
    updateJobUrl({ locations: locs.length ? locs.join(",") : null });
  };

  const handleSkillsChange = (skills: string[]) => {
    setSelectedSkills(skills);
    updateJobUrl({ skills: skills.length ? skills.join(",") : null });
  };

  const handleCompaniesChange = (companies: string[]) => {
    setSelectedCompanies(companies);
    updateJobUrl({ companies: companies.length ? companies.join(",") : null });
  };

  const handleOnlyMyApplicationsChange = (val: boolean) => {
    setOnlyMyApplications(val);
    updateJobUrl({ my: val ? "true" : null });
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedEmploymentTypes([]);
    setSelectedLocationTypes([]);
    setSelectedSkills([]);
    setSelectedCompanies([]);
    setOnlyMyApplications(false);
    updateJobUrl({
      q: null,
      types: null,
      locations: null,
      skills: null,
      companies: null,
      my: null,
    });
  };

  // Filters for Employer view
  const [selectedEmployerCompany, setSelectedEmployerCompany] = useState<string>("All");
  const [employerSubTab, setEmployerSubTab] = useState<"postings" | "analytics">("postings");

  // Modals state
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<JobPosting | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<JobPosting | null>(null);
  const [inspectedStudent, setInspectedStudent] = useState<Student | null>(null);

  const handleSelectJob = (job: JobPosting) => {
    setSelectedJobForDetail(job);
    updateJobUrl({ job: job.slug });
  };

  const handleCloseJobModal = () => {
    setSelectedJobForDetail(null);
    updateJobUrl({ job: null, jobId: null, slug: null });
  };

  // Automatically open job detail modal when job query param is present
  useEffect(() => {
    if (jobsList.length === 0) return;
    if (jobParam) {
      const clean = jobParam.toLowerCase().trim();
      const matched = jobsList.find(
        (j) =>
          j.slug.toLowerCase() === clean ||
          j.id.toLowerCase() === clean ||
          j.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clean
      );
      if (matched) {
        setSelectedJobForDetail(matched);
      }
    } else {
      setSelectedJobForDetail(null);
    }
  }, [jobsList, jobParam]);

  // Automatically open inspected candidate portfolio if member is in URL
  useEffect(() => {
    if (students.length === 0 || !memberParam) {
      if (!memberParam) setInspectedStudent(null);
      return;
    }
    const match = findStudentBySlugOrId(students, memberParam);
    if (match) {
      setInspectedStudent(match);
    }
  }, [students, memberParam]);

  const activeStudent = useMemo(() => {
    if (isStudent && loggedInStudent) {
      return loggedInStudent;
    }
    return students[0] || null;
  }, [isStudent, loggedInStudent, students]);

  // Count applications submitted by the logged-in student
  const studentApplicationsCount = useMemo(() => {
    if (!isStudent || !loggedInStudent) return 0;
    const studentName = loggedInStudent.name.toLowerCase();
    const studentEmail = loggedInStudent.email.toLowerCase();
    const studentId = loggedInStudent.id.toLowerCase();

    return applicationsList.filter((app) => {
      const appName = app.portfolioSnapshot?.name?.toLowerCase() || "";
      const appEmail = app.portfolioSnapshot?.email?.toLowerCase() || "";
      const appMemId = app.memberId?.toLowerCase() || "";
      return (
        (appName && (appName === studentName || studentName.includes(appName))) ||
        (appEmail && (appEmail === studentEmail || appEmail.includes("alex"))) ||
        (appMemId && appMemId === studentId)
      );
    }).length;
  }, [isStudent, loggedInStudent, applicationsList]);

  // Fetch jobs and applications
  useEffect(() => {
    async function loadData() {
      if (!isPremium) {
        setIsLoading(false);
        return;
      }

      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/jobs/applications"),
        ]);

        let jobsData: JobPosting[] = SAMPLE_JOB_POSTINGS;
        let appsData: JobApplication[] = SAMPLE_JOB_APPLICATIONS;

        if (jobsRes.ok && jobsRes.headers.get("content-type")?.includes("application/json")) {
          const jobsJson = await jobsRes.json();
          if (jobsJson.success && Array.isArray(jobsJson.data)) {
            jobsData = jobsJson.data;
          }
        }

        if (appsRes.ok && appsRes.headers.get("content-type")?.includes("application/json")) {
          const appsJson = await appsRes.json();
          if (appsJson.success && Array.isArray(appsJson.data)) {
            appsData = appsJson.data;
          }
        }

        setJobsList(jobsData);
        setApplicationsList(appsData);
      } catch (err) {
        console.warn("Could not fetch jobs from API, using fallback data:", err);
        setJobsList(SAMPLE_JOB_POSTINGS);
        setApplicationsList(SAMPLE_JOB_APPLICATIONS);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [isPremium]);

  // Filtered jobs for Member View
  const filteredMemberJobs = useMemo(() => {
    return jobsList.filter((job) => {
      if (job.status === "Closed") return false;

      // Member filter: only jobs the student applied to
      if (isStudent && onlyMyApplications && loggedInStudent) {
        const studentName = loggedInStudent.name.toLowerCase();
        const studentEmail = loggedInStudent.email.toLowerCase();
        const studentId = loggedInStudent.id.toLowerCase();

        const hasApplied = applicationsList.some((app) => {
          if (app.jobId !== job.id) return false;
          const appName = app.portfolioSnapshot?.name?.toLowerCase() || "";
          const appEmail = app.portfolioSnapshot?.email?.toLowerCase() || "";
          const appMemId = app.memberId?.toLowerCase() || "";
          const appCandId = (app as any).candidateId?.toLowerCase() || "";
          return (
            (appName &&
              (appName === studentName || appName.includes("alex") || studentName.includes(appName))) ||
            (appEmail &&
              (appEmail === studentEmail || appEmail.includes("alex") || appEmail.includes("arivera"))) ||
            (appMemId &&
              (appMemId === studentId ||
                appMemId.includes("candidate-1") ||
                appMemId.includes("student-3"))) ||
            (appCandId && (appCandId === studentId || appCandId.includes("candidate-1")))
          );
        });

        if (!hasApplied) {
          return false;
        }
      }

      // Sponsor filter: only jobs posted by this company
      if (isSponsor && onlyMyCompanyJobs && loggedInSponsor) {
        const sponsorName = loggedInSponsor.name.toLowerCase();
        const isSponsorJob =
          loggedInSponsor.jobCompanyNames.some((c) =>
            job.companyName.toLowerCase().includes(c.toLowerCase())
          ) || job.companyName.toLowerCase().includes(sponsorName);
        if (!isSponsorJob) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.companyName.toLowerCase().includes(q);
        const matchesDesc = job.description.toLowerCase().includes(q);
        const matchesSkills = (job.skillsRequired || []).some((s) =>
          s.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesSkills) {
          return false;
        }
      }

      // Employment Types
      if (
        selectedEmploymentTypes.length > 0 &&
        !selectedEmploymentTypes.includes(job.employmentType)
      ) {
        return false;
      }

      // Location Types
      if (
        selectedLocationTypes.length > 0 &&
        !selectedLocationTypes.includes(job.locationType)
      ) {
        return false;
      }

      // Skills Filter
      if (selectedSkills.length > 0) {
        const hasSkill = selectedSkills.some((skill) =>
          (job.skillsRequired || []).some(
            (s) => s.toLowerCase() === skill.toLowerCase()
          )
        );
        if (!hasSkill) {
          return false;
        }
      }

      // Company Filter
      if (
        selectedCompanies.length > 0 &&
        !selectedCompanies.includes(job.companyName)
      ) {
        return false;
      }

      return true;
    });
  }, [
    jobsList,
    searchQuery,
    selectedEmploymentTypes,
    selectedLocationTypes,
    selectedSkills,
    selectedCompanies,
    isStudent,
    onlyMyApplications,
    loggedInStudent,
    isSponsor,
    onlyMyCompanyJobs,
    loggedInSponsor,
    applicationsList,
  ]);

  // Filtered jobs for Employer View
  const employerJobs = useMemo(() => {
    if (selectedEmployerCompany === "All") return jobsList;
    return jobsList.filter(
      (j) => j.companyName.toLowerCase() === selectedEmployerCompany.toLowerCase()
    );
  }, [jobsList, selectedEmployerCompany]);

  // List of unique hiring companies
  const hiringCompanies = useMemo(() => {
    const set = new Set(jobsList.map((j) => j.companyName));
    return Array.from(set);
  }, [jobsList]);

  // List of all unique skills across jobs, sorted alphabetically
  const allJobSkills = useMemo(() => {
    const set = new Set<string>();
    jobsList.forEach((j) => (j.skillsRequired || []).forEach((s) => set.add(s)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [jobsList]);

  // Handle application success
  const handleApplySuccess = (newApp: JobApplication) => {
    setApplicationsList((prev) => [newApp, ...prev]);
  };

  // Handle job created
  const handleJobCreated = (newJob: JobPosting) => {
    setJobsList((prev) => [newJob, ...prev]);
  };

  // Handle status update
  const handleStatusUpdate = (appId: string, newStatus: JobApplication["status"]) => {
    setApplicationsList((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="page-wrapper font-sans transition-colors duration-200">
      {/* Primary Top Navigation */}
      <DirectoryNavbar
        role={role}
        theme={theme}
        toggleTheme={toggleTheme}
        handleRoleChange={handleRoleChange}
      />

      {/* Directory Page Header — Customized for the 3 Different Logins */}
      <DirectoryStatsHeader
        title={
          !isPremium
            ? "Engineering Opportunities Hub"
            : isAdmin
            ? "Engineering Opportunities Management"
            : isSponsor
              ? `${loggedInSponsor?.name || "Corporate Partner"} Hiring Portal`
              : "Engineering Opportunities Hub"
        }
        description={
          !isPremium
            ? "Official chapter engineering career and recruiting opportunities portal."
            : isAdmin
            ? "Oversee active corporate sponsor job postings, review student application portfolios, and monitor chapter career outcomes."
            : isSponsor
              ? `Manage active engineering opportunities, review USF candidate portfolios, and track hiring analytics for ${loggedInSponsor?.name || "your company"}.`
              : "Explore direct internships, co-ops, and full-time engineering roles from corporate partners. Apply with your verified RSO USF engineering portfolio."
        }
      >
        {isPremium && (
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Action: Post Opportunity (Available to RSO Leadership & Corporate Sponsors) */}
            {(isAdmin || isSponsor) && (
              <button
                type="button"
                onClick={() => setIsPostJobModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white font-bold text-xs cursor-pointer shadow-xs shrink-0"
              >
                <Briefcase size={14} />
                <span>+ Post Opportunity</span>
              </button>
            )}

            {/* Mode Selector for RSO Leadership (Chapter Management vs Student Directory View) */}
            {isAdmin && (
              <div className="flex items-center bg-white p-1 rounded-2xl border border-neutral-300 shadow-2xs shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setPortalMode("employer")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs cursor-pointer select-none ${portalMode === "employer"
                    ? "bg-black text-white font-bold border border-black shadow-xs"
                    : "bg-transparent text-neutral-700 font-semibold border border-transparent"
                    }`}
                >
                  <Building2 size={13} />
                  <span>Chapter Job Management</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPortalMode("member")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs cursor-pointer select-none ${portalMode === "member"
                    ? "bg-black text-white font-bold border border-black shadow-xs"
                    : "bg-transparent text-neutral-700 font-semibold border border-transparent"
                    }`}
                >
                  <Users size={13} />
                  <span>Browse Chapter Board</span>
                </button>
              </div>
            )}

            {/* Mode Selector for Corporate Sponsors (My Company Postings vs Browse Chapter Board) */}
            {isSponsor && (
              <div className="flex items-center bg-white p-1 rounded-2xl border border-neutral-300 shadow-2xs shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => setPortalMode("employer")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs cursor-pointer select-none ${portalMode === "employer"
                    ? "bg-black text-white font-bold border border-black shadow-xs"
                    : "bg-transparent text-neutral-700 font-semibold border border-transparent"
                    }`}
                >
                  <Building2 size={13} />
                  <span>My Company Postings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPortalMode("member")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs cursor-pointer select-none ${portalMode === "member"
                    ? "bg-black text-white font-bold border border-black shadow-xs"
                    : "bg-transparent text-neutral-700 font-semibold border border-transparent"
                    }`}
                >
                  <Users size={13} />
                  <span>Browse Chapter Board</span>
                </button>
              </div>
            )}

            {/* Member Filtering: All Opportunities vs My Applications */}
            {isStudent && loggedInStudent && (
              <div className="inline-flex p-0.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => handleOnlyMyApplicationsChange(false)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${!onlyMyApplications
                    ? "bg-white text-black shadow-2xs font-black"
                    : "text-neutral-500 font-semibold"
                    }`}
                >
                  All Opportunities
                </button>
                <button
                  type="button"
                  onClick={() => handleOnlyMyApplicationsChange(true)}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer ${onlyMyApplications
                    ? "bg-black text-white shadow-2xs font-black"
                    : "text-neutral-500 font-semibold"
                    }`}
                >
                  My Applications ({studentApplicationsCount})
                </button>
              </div>
            )}
          </div>
        )}
      </DirectoryStatsHeader>

      <main className="max-w-7xl w-full mx-auto px-4 pb-8 flex flex-col gap-6">
        {!isPremium ? (
          <div className="flex flex-col gap-6 animate-fade-in pt-8 pb-16 w-full max-w-lg mx-auto">
            <div className="p-8 sm:p-10 rounded-2xl border border-neutral-300 bg-white flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xs">
              <div className="w-14 h-14 rounded-full bg-neutral-100 text-black border border-neutral-300 flex items-center justify-center shrink-0 mb-4">
                <Lock size={22} className="text-black" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-100 text-black border border-neutral-300 mb-2">
                Private Career Hub
              </span>

              <h2 className="text-base sm:text-lg font-black text-black mb-2">
                Job Openings Unavailable
              </h2>

              <p className="text-xs text-neutral-600 leading-relaxed mb-6 max-w-sm font-sans">
                This is unavailable because you aren&apos;t one of the premium profiles. Engineering job openings and career opportunities are completely private to premium profiles.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full justify-center">
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-5 py-2.5 bg-black text-white font-bold rounded-xl text-xs cursor-pointer text-center"
                >
                  Sign In with Premium Profile
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* MEMBER PORTAL VIEW (BROWSE & APPLY WITH PORTFOLIO) */}
            {portalMode === "member" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Active Candidate Identifier / Role Context Banner */}
            {isStudent && loggedInStudent ? (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={loggedInStudent.name} size="sm" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-none">
                      Applying with Verified Member Portfolio
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">
                      {loggedInStudent.name} • {loggedInStudent.major} (Class of {loggedInStudent.gradDate})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInspectedStudent(loggedInStudent)}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-100 border border-neutral-300 text-black text-xs font-bold cursor-pointer"
                >
                  View My Portfolio
                </button>
              </div>
            ) : isSponsor ? (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-300 flex items-center justify-center text-black shrink-0">
                    <Building2 size={15} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-none">
                      Corporate Sponsor Browsing Mode
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">
                      Browsing live chapter engineering opportunities board as {loggedInSponsor?.name || "Corporate Partner"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPortalMode("employer")}
                  className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold cursor-pointer"
                >
                  Return to Hiring Portal
                </button>
              </div>
            ) : isAdmin ? (
              <div className="p-3.5 rounded-2xl bg-white border border-neutral-300 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-300 flex items-center justify-center text-black shrink-0">
                    <Shield size={15} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block leading-none">
                      RSO Leadership Chapter View
                    </span>
                    <span className="text-xs font-bold text-black truncate block mt-0.5">
                      Reviewing live chapter job postings across corporate partners
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPortalMode("employer")}
                  className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold cursor-pointer"
                >
                  Return to Chapter Job Management
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-300 flex items-center justify-center text-black shrink-0">
                    <GraduationCap size={15} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-none">
                      USF Member Career Directory
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">
                      Sign in with your RSO USF member account to submit 1-click portfolio applications to corporate partners.
                    </span>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold cursor-pointer"
                >
                  Sign In to Apply
                </Link>
              </div>
            )}

            {/* Top Search Bar */}
            <div className="w-full">
              <SearchInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by job title, company, skills (e.g. C++, RTOS, Altium)..."
                ariaLabel="Search by job title, company, skills"
              />
            </div>

            {/* Core Member Opportunities Hub Layout (Sidebar + Results) */}
            <div className="flex flex-col min-[1056px]:flex-row gap-8 items-start relative z-10">
              {/* Job Filters (Top on mobile/tablet, Sidebar on min-[1056px]) */}
              <JobFilters
                selectedEmploymentTypes={selectedEmploymentTypes}
                setSelectedEmploymentTypes={handleEmploymentTypesChange}
                selectedLocationTypes={selectedLocationTypes}
                setSelectedLocationTypes={handleLocationTypesChange}
                selectedSkills={selectedSkills}
                setSelectedSkills={handleSkillsChange}
                selectedCompanies={selectedCompanies}
                setSelectedCompanies={handleCompaniesChange}
                availableSkills={allJobSkills}
                availableCompanies={hiringCompanies}
                onResetAll={resetAllFilters}
                layout="side"
              />

              {/* Main Jobs Directory Area */}
              <div className="grow flex flex-col gap-4 w-full">
                {/* Active Filter Badges (if any are active) */}
                {(selectedEmploymentTypes.length > 0 ||
                  selectedLocationTypes.length > 0 ||
                  selectedSkills.length > 0 ||
                  selectedCompanies.length > 0) && (
                    <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-200/80 text-xs">
                      <span className="text-slate-500 pr-1 select-none font-bold uppercase tracking-wider text-[11px]">
                        Active Filters:
                      </span>
                      {selectedEmploymentTypes.map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-medium"
                        >
                          {type}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedEmploymentTypes(
                                selectedEmploymentTypes.filter((t) => t !== type)
                              )
                            }
                            className="text-neutral-500 cursor-pointer font-bold ml-0.5"
                            aria-label={`Remove ${type} filter`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {selectedLocationTypes.map((loc) => (
                        <span
                          key={loc}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-medium"
                        >
                          {loc}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedLocationTypes(
                                selectedLocationTypes.filter((l) => l !== loc)
                              )
                            }
                            className="text-neutral-500 cursor-pointer font-bold ml-0.5"
                            aria-label={`Remove ${loc} filter`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {selectedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-medium"
                        >
                          {sk}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedSkills(selectedSkills.filter((s) => s !== sk))
                            }
                            className="text-neutral-500 cursor-pointer font-bold ml-0.5"
                            aria-label={`Remove ${sk} filter`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      {selectedCompanies.map((comp) => (
                        <span
                          key={comp}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 border border-neutral-300 text-xs font-medium"
                        >
                          {comp}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedCompanies(
                                selectedCompanies.filter((c) => c !== comp)
                              )
                            }
                            className="text-neutral-500 cursor-pointer font-bold ml-0.5"
                            aria-label={`Remove ${comp} filter`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="text-xs text-slate-500 underline ml-2 cursor-pointer font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                  )}

                {/* Results Count Bar */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold">
                    Showing {filteredMemberJobs.length}{" "}
                    {filteredMemberJobs.length === 1 ? "opportunity" : "opportunities"}
                  </span>
                </div>

                {/* Jobs Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="bg-neutral-100 border border-neutral-200 rounded-2xl p-5 animate-pulse h-[195px] sm:h-[220px]"
                      />
                    ))}
                  </div>
                ) : filteredMemberJobs.length === 0 ? (
                  <EmptyState
                    icon={<Briefcase size={32} />}
                    headline="No job opportunities found"
                    subtext="No positions matched your selected search query or filters. Try adjusting your parameters."
                    actionLabel="Clear Filters"
                    onAction={resetAllFilters}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredMemberJobs.map((job) => {
                      const hasApplied = applicationsList.some(
                        (a) => a.jobId === job.id && a.memberId === activeStudent?.id
                      );
                      const application = applicationsList.find(
                        (a) => a.jobId === job.id && a.memberId === activeStudent?.id
                      );

                      return (
                        <JobCard
                          key={job.id}
                          job={job}
                          hasApplied={hasApplied}
                          application={application}
                          onSelectJob={handleSelectJob}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EMPLOYER PORTAL VIEW (MANAGE POSTINGS & APPLICANTS) */}
        {portalMode === "employer" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Employer Sub-Navigation: Postings vs Applicant Pool Analytics */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-2xl w-fit border border-neutral-300 shadow-2xs">
              <button
                type="button"
                onClick={() => setEmployerSubTab("postings")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs cursor-pointer select-none ${employerSubTab === "postings"
                  ? "bg-black text-white font-bold border border-black shadow-xs"
                  : "bg-transparent text-neutral-700 font-semibold border border-transparent"
                  }`}
              >
                <Briefcase size={14} className={employerSubTab === "postings" ? "text-white" : "text-neutral-500"} />
                <span>Active Postings ({employerJobs.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setEmployerSubTab("analytics")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs cursor-pointer select-none ${employerSubTab === "analytics"
                  ? "bg-black text-white font-bold border border-black shadow-xs"
                  : "bg-transparent text-neutral-700 font-semibold border border-transparent"
                  }`}
              >
                <BarChart3 size={14} className={employerSubTab === "analytics" ? "text-white" : "text-neutral-500"} />
                <span>Applicant Pool Analytics ({applicationsList.length})</span>
              </button>
            </div>

            {employerSubTab === "analytics" ? (
              <EmployerApplicantAnalytics
                jobs={isSponsor ? employerJobs : jobsList}
                applications={
                  isSponsor
                    ? applicationsList.filter((a) =>
                      employerJobs.some((j) => j.id === a.jobId)
                    )
                    : applicationsList
                }
              />
            ) : (
              <EmployerJobPostings
                employerJobs={employerJobs}
                jobsList={jobsList}
                applicationsList={applicationsList}
                selectedEmployerCompany={selectedEmployerCompany}
                setSelectedEmployerCompany={setSelectedEmployerCompany}
                hiringCompanies={hiringCompanies}
                onOpenPostJobModal={() => setIsPostJobModalOpen(true)}
                onSelectJobForApplicants={setSelectedJobForApplicants}
                role={role}
                sponsorName={loggedInSponsor?.name}
              />
            )}
          </div>
        )}
      </>
    )}
  </main>

      {/* MODALS */}
      {/* Member: Job Detail & Apply Modal */}
      {isPremium && selectedJobForDetail && activeStudent && (
        <JobDetailModal
          job={selectedJobForDetail}
          activeStudent={activeStudent}
          existingApplication={applicationsList.find(
            (a) => a.jobId === selectedJobForDetail.id && a.memberId === activeStudent.id
          )}
          onClose={handleCloseJobModal}
          onApplySuccess={handleApplySuccess}
        />
      )}

      {/* Employer / Sponsor: Post Job Modal (Form 4) */}
      {isPostJobModalOpen && (
        <SponsorJobPostingForm
          role={role}
          session={session}
          onClose={() => setIsPostJobModalOpen(false)}
          onJobCreated={handleJobCreated}
        />
      )}

      {/* Employer: Applicants List Modal */}
      {selectedJobForApplicants && (
        <EmployerApplicantsModal
          job={selectedJobForApplicants}
          applications={applicationsList.filter((a) => a.jobId === selectedJobForApplicants.id)}
          students={students}
          onClose={() => setSelectedJobForApplicants(null)}
          onViewPortfolio={(student: Student) => {
            setSelectedJobForApplicants(null);
            setSelectedJobForDetail(null);
            setInspectedStudent(student);
            updateJobUrl({ member: getStudentSlug(student) });
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* Inspected Student Portfolio Modal */}
      {inspectedStudent && (
        <PortfolioModal
          student={inspectedStudent}
          onClose={() => {
            setInspectedStudent(null);
            updateJobUrl({ member: null });
          }}
          adminMode={true}
          role="admin"
          allStudents={students}
        />
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading RSO USF Jobs Portal...
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
