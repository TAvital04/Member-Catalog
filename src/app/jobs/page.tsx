"use client";

/**
 * @file page.tsx — IEEE UCF Career & Job Opportunities Portal
 * @description Dedicated chapter engineering career hub supporting member 1-click portfolio applications
 * and streamlined corporate partner / employer posting management.
 */

import React, { useState, useEffect, useMemo, Suspense } from "react";
import {
  Briefcase,
  Building2,
  Users,
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
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import EmployerJobPostings from "@/components/jobs/EmployerJobPostings";
import JobDetailModal from "@/components/modal/job/JobDetailModal";
import SponsorJobPostingForm from "@/components/forms/SponsorJobPostingForm";
import EmployerApplicantsModal from "@/components/modal/job/EmployerApplicantsModal";
import EmployerApplicantAnalytics from "@/components/modal/job/EmployerApplicantAnalytics";
import PortfolioModal from "@/components/modal/PortfolioModal";
import CustomDropdown from "@/components/common/CustomDropdown";
import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";
import SearchInput from "@/components/common/SearchInput";

function JobsPageContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { role, session, handleRoleChange } = useRoleManager();
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
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([]);
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedEmploymentTypes([]);
    setSelectedLocationTypes([]);
    setSelectedSkills([]);
    setSelectedCompanies([]);
  };

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

      {/* Directory Page Header */}
      <DirectoryStatsHeader
        title="Engineering Opportunities Hub"
        description="Explore direct internships, co-ops, and full-time roles from corporate partners or post opportunities to source top engineering talent."
      >
        {/* Screen Mode Switcher: Member Screen vs Employer Screen */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-neutral-300 shadow-2xs shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setPortalMode("member")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs cursor-pointer select-none ${
              portalMode === "member"
                ? "bg-black text-white font-bold border border-black shadow-xs"
                : "bg-transparent text-neutral-700 font-semibold border border-transparent"
            }`}
          >
            <Users size={14} />
            <span>Member Portal (Browse & Apply)</span>
          </button>
          <button
            type="button"
            onClick={() => setPortalMode("employer")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs cursor-pointer select-none ${
              portalMode === "employer"
                ? "bg-black text-white font-bold border border-black shadow-xs"
                : "bg-transparent text-neutral-700 font-semibold border border-transparent"
            }`}
          >
            <Building2 size={14} />
            <span>Employer Portal (Manage & Post)</span>
          </button>
        </div>
      </DirectoryStatsHeader>

      <main className="max-w-7xl w-full mx-auto px-4 pb-8 flex flex-col gap-6">
        {/* MEMBER PORTAL VIEW (BROWSE & APPLY WITH PORTFOLIO) */}
        {portalMode === "member" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Active Candidate Identifier Bar */}
            {activeStudent && (
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={activeStudent.name} size="sm" />
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
                    buttonClassName="bg-white border-neutral-300 text-black text-xs font-semibold"
                    align="right"
                    aria-label="Switch Test Candidate"
                  />
                </div>
              </div>
            )}

            {/* Top Search Bar */}
            <div className="w-full">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by job title, company, skills (e.g. C++, RTOS, Altium)..."
                ariaLabel="Search by job title, company, skills"
              />
            </div>

            {/* Core Member Opportunities Hub Layout (Sidebar + Results) */}
            <div className="flex flex-col min-[1056px]:flex-row gap-8 items-start relative z-10">
              {/* Job Filters (Top on mobile/tablet, Sidebar on min-[1056px]) */}
              <JobFilters
                selectedEmploymentTypes={selectedEmploymentTypes}
                setSelectedEmploymentTypes={setSelectedEmploymentTypes}
                selectedLocationTypes={selectedLocationTypes}
                setSelectedLocationTypes={setSelectedLocationTypes}
                selectedSkills={selectedSkills}
                setSelectedSkills={setSelectedSkills}
                selectedCompanies={selectedCompanies}
                setSelectedCompanies={setSelectedCompanies}
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
                          className="hover:text-black cursor-pointer font-bold ml-0.5"
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
                          className="hover:text-black cursor-pointer font-bold ml-0.5"
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
                          className="hover:text-black cursor-pointer font-bold ml-0.5"
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
                          className="hover:text-black cursor-pointer font-bold ml-0.5"
                          aria-label={`Remove ${comp} filter`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="text-xs text-slate-500 hover:text-black underline ml-2 cursor-pointer font-medium"
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
                  <span className="text-[11px]">
                    Click any role to inspect full details and apply with portfolio
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
                          onSelectJob={setSelectedJobForDetail}
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs cursor-pointer select-none ${
                  employerSubTab === "postings"
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs cursor-pointer select-none ${
                  employerSubTab === "analytics"
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
                jobs={jobsList}
                applications={applicationsList}
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
              />
            )}
          </div>
        )}
      </main>

      {/* MODALS */}
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
          onViewPortfolio={(student: Student) => setInspectedStudent(student)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      {/* Inspected Student Portfolio Modal */}
      {inspectedStudent && (
        <PortfolioModal
          student={inspectedStudent}
          onClose={() => setInspectedStudent(null)}
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
          Loading IEEE UCF Jobs Portal...
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
