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
import QuickJobPostModal from "@/components/modal/job/QuickJobPostModal";
import EmployerApplicantsModal from "@/components/modal/job/EmployerApplicantsModal";
import EmployerApplicantAnalytics from "@/components/modal/job/EmployerApplicantAnalytics";
import PortfolioModal from "@/components/modal/PortfolioModal";
import CustomDropdown from "@/components/common/CustomDropdown";
import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";

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
        <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/90 shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setPortalMode("member")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              portalMode === "member"
                ? "bg-white text-slate-950 font-bold shadow-xs border border-slate-200/90"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
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
                ? "bg-white text-slate-950 font-bold shadow-xs border border-slate-200/90"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Building2 size={14} />
            <span>Employer Portal (Manage & Post)</span>
          </button>
        </div>
      </DirectoryStatsHeader>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pb-8 flex flex-col gap-6">
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
                    buttonClassName="bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-800 text-xs font-semibold"
                    align="right"
                    aria-label="Switch Test Candidate"
                  />
                </div>
              </div>
            )}

            {/* Reusable Matchy-Matchy Filter Bar */}
            <JobFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedEmploymentType={selectedEmploymentType}
              setSelectedEmploymentType={setSelectedEmploymentType}
              selectedLocationType={selectedLocationType}
              setSelectedLocationType={setSelectedLocationType}
              allJobSkills={allJobSkills}
              selectedSkill={selectedSkill}
              setSelectedSkill={setSelectedSkill}
            />

            {/* Results Count Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">
                Showing {filteredMemberJobs.length} {filteredMemberJobs.length === 1 ? "opportunity" : "opportunities"}
              </span>
              <span className="text-[11px]">Click any role to inspect full details and apply with portfolio</span>
            </div>

            {/* Jobs Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs animate-pulse h-[250px]"
                  />
                ))}
              </div>
            ) : filteredMemberJobs.length === 0 ? (
              <EmptyState
                icon={<Briefcase size={32} />}
                headline="No job opportunities found"
                subtext="No positions matched your selected search query or filters. Try adjusting your parameters."
                actionLabel="Clear Filters"
                onAction={() => {
                  setSearchQuery("");
                  setSelectedEmploymentType("All");
                  setSelectedLocationType("All");
                  setSelectedSkill(null);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        )}

        {/* EMPLOYER PORTAL VIEW (MANAGE POSTINGS & APPLICANTS) */}
        {portalMode === "employer" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* Employer Sub-Navigation: Postings vs Applicant Pool Analytics */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200">
              <button
                type="button"
                onClick={() => setEmployerSubTab("postings")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  employerSubTab === "postings"
                    ? "bg-white text-slate-950 font-bold shadow-xs border border-slate-200/90"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Briefcase size={14} className={employerSubTab === "postings" ? "text-black" : ""} />
                <span>Active Postings ({employerJobs.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setEmployerSubTab("analytics")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  employerSubTab === "analytics"
                    ? "bg-white text-slate-950 font-bold shadow-xs border border-slate-200/90"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <BarChart3 size={14} className={employerSubTab === "analytics" ? "text-black" : ""} />
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

      {/* Employer: Quick Post Job Modal */}
      {isPostJobModalOpen && (
        <QuickJobPostModal
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
