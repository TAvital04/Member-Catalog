"use client";

/**
 * @file page.tsx — IEEE UCF Career & Job Opportunities Portal
 * @description Dedicated chapter engineering career hub supporting member 1-click portfolio applications
 * and streamlined corporate partner / employer posting management.
 */

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Search,
  X,
  Filter,
  Sparkles,
  Users,
  CheckCircle2,
  Plus,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Award,
  BarChart3,
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
import { CARD_INTERACTIVE, CARD_TITLE_HOVER } from "@/lib/cardStyles";
import JobDetailModal from "@/components/modal/job/JobDetailModal";
import QuickJobPostModal from "@/components/modal/job/QuickJobPostModal";
import EmployerApplicantsModal from "@/components/modal/job/EmployerApplicantsModal";
import EmployerApplicantAnalytics from "@/components/modal/job/EmployerApplicantAnalytics";
import PortfolioModal from "@/components/modal/PortfolioModal";
import CustomDropdown from "@/components/common/CustomDropdown";

function JobsPageContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { role, handleRoleChange } = useRoleManager();
  const { students } = useStudentData();

  // Screen Mode: "member" (browse & apply) vs "employer" (manage postings & applicants)
  const [portalMode, setPortalMode] = useState<"member" | "employer">("member");

  // Active student for member application (defaults to first student)
  const [activeStudentId, setActiveStudentId] = useState<string>("");

  // Jobs and applications state
  const [jobsList, setJobsList] = useState<JobPosting[]>([]);
  const [applicationsList, setApplicationsList] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters for Member view
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("All");
  const [selectedLocationType, setSelectedLocationType] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Filters for Employer view
  const [selectedEmployerCompany, setSelectedEmployerCompany] = useState<string>("All");
  const [employerSubTab, setEmployerSubTab] = useState<"postings" | "analytics">("postings");

  // Modals state
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<JobPosting | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<JobPosting | null>(null);
  const [inspectedStudent, setInspectedStudent] = useState<Student | null>(null);

  // Initialize active student
  useEffect(() => {
    if (students.length > 0 && !activeStudentId) {
      setActiveStudentId(students[0].id);
    }
  }, [students, activeStudentId]);

  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === activeStudentId) || students[0];
  }, [students, activeStudentId]);

  // Fetch jobs and applications
  useEffect(() => {
    async function loadData() {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/jobs/applications"),
        ]);

        const jobsJson = await jobsRes.json();
        const appsJson = await appsRes.json();

        if (jobsJson.success && Array.isArray(jobsJson.data)) {
          setJobsList(jobsJson.data);
        } else {
          setJobsList(SAMPLE_JOB_POSTINGS);
        }

        if (appsJson.success && Array.isArray(appsJson.data)) {
          setApplicationsList(appsJson.data);
        } else {
          setApplicationsList(SAMPLE_JOB_APPLICATIONS);
        }
      } catch (err) {
        console.warn("Could not fetch jobs from API, using fallback data:", err);
        setJobsList(SAMPLE_JOB_POSTINGS);
        setApplicationsList(SAMPLE_JOB_APPLICATIONS);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered jobs for Member View
  const filteredMemberJobs = useMemo(() => {
    return jobsList.filter((job) => {
      if (job.status === "Closed") return false;

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

      // Employment Type
      if (selectedEmploymentType !== "All" && job.employmentType !== selectedEmploymentType) {
        return false;
      }

      // Location Type
      if (selectedLocationType !== "All" && job.locationType !== selectedLocationType) {
        return false;
      }

      // Skill Filter
      if (selectedSkill && !(job.skillsRequired || []).some((s) => s.toLowerCase() === selectedSkill.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [jobsList, searchQuery, selectedEmploymentType, selectedLocationType, selectedSkill]);

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

  // List of all popular skills across jobs
  const allJobSkills = useMemo(() => {
    const set = new Set<string>();
    jobsList.forEach((j) => (j.skillsRequired || []).forEach((s) => set.add(s)));
    return Array.from(set).slice(0, 10);
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
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans transition-colors duration-200">
      {/* Primary Top Navigation */}
      <DirectoryNavbar
        role={role}
        theme={theme}
        toggleTheme={toggleTheme}
        handleRoleChange={handleRoleChange}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <Briefcase size={14} className="text-amber-600" />
              <span>UCF IEEE Career & Engineering Postings</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Engineering Opportunities Hub
            </h1>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Explore direct internships, co-ops, and full-time roles from top corporate partners.
              Apply with your verified member portfolio or post opportunities to source top engineering talent.
            </p>
          </div>

          {/* Screen Mode Switcher: Member Screen vs Employer Screen */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200/90 shadow-2xs shrink-0 self-start md:self-end">
            <button
              type="button"
              onClick={() => setPortalMode("member")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                portalMode === "member"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Users size={14} />
              <span>Member Portal (Browse & Apply)</span>
            </button>
            <button
              type="button"
              onClick={() => setPortalMode("employer")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                portalMode === "employer"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Building2 size={14} />
              <span>Employer Portal (Manage & Post)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MEMBER PORTAL VIEW (BROWSE & APPLY WITH PORTFOLIO)                        */}
        {/* ========================================================================= */}
        {portalMode === "member" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Active Candidate Identifier Bar */}
            {activeStudent && (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                    {activeStudent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-none">
                      Applying with Member Portfolio
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">
                      {activeStudent.name} • {activeStudent.major} ({activeStudent.gradDate})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    Switch Test Candidate:
                  </span>
                  <CustomDropdown
                    value={activeStudentId}
                    onChange={(val) => setActiveStudentId(val)}
                    options={students.slice(0, 10).map((s) => ({
                      value: s.id,
                      label: `${s.name}`,
                      sublabel: `${s.major} • Class of ${s.gradDate}`,
                    }))}
                    className="w-48 sm:w-64"
                    buttonClassName="bg-slate-50/80 hover:bg-slate-100 text-xs font-semibold"
                    align="right"
                    aria-label="Switch Test Candidate"
                  />
                </div>
              </div>
            )}

            {/* Search & Filter Bar */}
            <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search input */}
                <div className="relative flex-1 w-full">
                  <Search
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by job title, company, skills (e.g. C++, RTOS, Altium)..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Employment Type Selector */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {["All", "Full-time", "Internship", "Co-op"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedEmploymentType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                        selectedEmploymentType === type
                          ? "bg-slate-900 text-white border-slate-900 font-bold"
                          : "bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Type & Skills Quick Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Workplace:
                  </span>
                  {["All", "On-site", "Hybrid", "Remote"].map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setSelectedLocationType(loc)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer shadow-2xs ${
                        selectedLocationType === loc
                          ? "bg-amber-500/15 border-amber-500 text-slate-900 font-bold"
                          : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>

                {/* Popular Skill Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Filter by Skill:
                  </span>
                  {allJobSkills.map((skill) => {
                    const isSelected = selectedSkill === skill;
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => setSelectedSkill(isSelected ? null : skill)}
                        className={`px-2 py-0.5 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer shadow-2xs ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 font-bold"
                            : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                  {selectedSkill && (
                    <button
                      type="button"
                      onClick={() => setSelectedSkill(null)}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline ml-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Count Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">
                Showing {filteredMemberJobs.length} {filteredMemberJobs.length === 1 ? "opportunity" : "opportunities"}
              </span>
              <span className="text-[11px]">Click any role to inspect full details and apply with portfolio</span>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMemberJobs.map((job) => {
                // Check if active student applied
                const hasApplied = applicationsList.some(
                  (a) => a.jobId === job.id && a.memberId === activeStudent?.id
                );
                const application = applicationsList.find(
                  (a) => a.jobId === job.id && a.memberId === activeStudent?.id
                );

                return (
                  <div
                    key={job.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details and apply for ${job.title} at ${job.companyName}`}
                    onClick={() => setSelectedJobForDetail(job)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedJobForDetail(job);
                      }
                    }}
                    className={`${CARD_INTERACTIVE} p-5 flex flex-col justify-between gap-4 h-[250px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400`}
                  >
                    {/* Top Row: Company Logo & Titles */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
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

                        {job.featured && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-0.5">
                            <Sparkles size={10} /> Partner
                          </span>
                        )}
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
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold shadow-2xs">
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
                        <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle2 size={13} className="text-emerald-600" />
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
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EMPLOYER PORTAL VIEW (MANAGE POSTINGS & APPLICANTS)                        */}
        {/* ========================================================================= */}
        {portalMode === "employer" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Employer Action & Stats Bar */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Employer Hiring Dashboard
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage active corporate engineering postings and inspect applicant portfolios.
                  </p>
                </div>
              </div>

              {/* + Post New Job Button */}
              <button
                type="button"
                onClick={() => setIsPostJobModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Plus size={15} />
                <span>+ Post New Job Opportunity</span>
              </button>
            </div>

            {/* Employer Sub-Navigation: Postings vs Applicant Pool Analytics */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
              <button
                type="button"
                onClick={() => setEmployerSubTab("postings")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  employerSubTab === "postings"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase size={14} className={employerSubTab === "postings" ? "text-amber-600" : ""} />
                <span>Active Postings ({employerJobs.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setEmployerSubTab("analytics")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  employerSubTab === "analytics"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BarChart3 size={14} className={employerSubTab === "analytics" ? "text-amber-600" : ""} />
                <span>Applicant Pool Analytics ({applicationsList.length})</span>
              </button>
            </div>

            {employerSubTab === "analytics" ? (
              <EmployerApplicantAnalytics
                jobs={jobsList}
                applications={applicationsList}
              />
            ) : (
              <>
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
                        { value: "All", label: `All Companies (${jobsList.length})` },
                        ...hiringCompanies.map((c) => ({
                          value: c,
                          label: c,
                          badge: `${jobsList.filter((j) => j.companyName === c).length} roles`,
                        })),
                      ]}
                      className="w-48 sm:w-60"
                      buttonClassName="bg-white hover:bg-slate-50 text-xs font-semibold"
                      align="left"
                      aria-label="Company Filter"
                    />
                  </div>

                  <span className="text-slate-500">
                    {employerJobs.length} active posting{employerJobs.length === 1 ? "" : "s"} listed
                  </span>
                </div>

                {/* Employer Postings Table / Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employerJobs.map((job) => {
                    const jobApps = applicationsList.filter((a) => a.jobId === job.id);

                    return (
                      <div
                        key={job.id}
                        role="button"
                        tabIndex={0}
                        aria-label={`Manage posting and review applicants for ${job.title}`}
                        onClick={() => setSelectedJobForApplicants(job)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedJobForApplicants(job);
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
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs shrink-0 ${
                              job.status === "Active"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>

                        {/* Metadata Specs */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-medium shadow-2xs">
                            {job.employmentType}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-medium shadow-2xs">
                            {job.location} ({job.locationType})
                          </span>
                          {job.salaryRange && (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold shadow-2xs">
                              {job.salaryRange}
                            </span>
                          )}
                        </div>

                        {/* Actions Row */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock size={12} />
                            <span>Posted {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </span>

                          {/* Review Applicants Action */}
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-amber-50 group-hover:border-amber-300/80 border border-slate-200 text-slate-900 group-hover:text-amber-800 text-xs font-bold transition-all shadow-2xs">
                            <Users size={13} className="text-slate-500 group-hover:text-amber-600 transition-colors" />
                            <span>Review Applicants ({jobApps.length})</span>
                            <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}

      {/* Member: Job Detail & Apply Modal */}
      {selectedJobForDetail && activeStudent && (
        <JobDetailModal
          job={selectedJobForDetail}
          activeStudent={activeStudent}
          existingApplication={applicationsList.find(
            (a) => a.jobId === selectedJobForDetail.id && a.memberId === activeStudent.id
          )}
          onClose={() => setSelectedJobForDetail(null)}
          onApplySuccess={handleApplySuccess}
        />
      )}

      {/* Employer: Quick Post Job Modal */}
      {isPostJobModalOpen && (
        <QuickJobPostModal
          onClose={() => setIsPostJobModalOpen(false)}
          onJobCreated={handleJobCreated}
        />
      )}

      {/* Employer: Applicants Roster Modal */}
      {selectedJobForApplicants && (
        <EmployerApplicantsModal
          job={selectedJobForApplicants}
          applications={applicationsList.filter((a) => a.jobId === selectedJobForApplicants.id)}
          students={students}
          onClose={() => setSelectedJobForApplicants(null)}
          onViewPortfolio={(student) => setInspectedStudent(student)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* Member Portfolio Inspection Modal (when employer clicks "Inspect Full Portfolio") */}
      {inspectedStudent && (
        <PortfolioModal
          student={inspectedStudent}
          onClose={() => setInspectedStudent(null)}
          role="sponsor"
        />
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs font-semibold">Loading Career Hub...</div>}>
      <JobsPageContent />
    </Suspense>
  );
}
