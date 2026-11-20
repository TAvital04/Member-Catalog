"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Users,
  CheckCircle2,
  FileText,
  Briefcase,
  Calendar,
  GraduationCap,
  Info,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { JobPosting, JobApplication } from "@/data/jobs";
import { Student } from "@/data/students";
import CustomDropdown from "@/components/common/CustomDropdown";
import Avatar from "@/components/common/Avatar";
import Tooltip from "@/components/common/Tooltip";
import { Heading, Subheading, Badge } from "@/components/ui";
import CurrentSponsorsSegment from "@/components/common/CurrentSponsorsSegment";
import { useRecruiterShortlist } from "@/hooks/useRecruiterShortlist";

export type ApplicantTabType = "info" | "all" | "review" | "interviewing" | "offered";

interface EmployerApplicantsModalProps {
  job: JobPosting;
  applications: JobApplication[];
  students: Student[];
  onClose: () => void;
  onViewPortfolio: (student: Student) => void;
  onStatusUpdate: (appId: string, newStatus: JobApplication["status"]) => void;
}

function formatFractionalPercent(count: number, total: number): string {
  if (total === 0) return "0%";
  const pct = (count / total) * 100;
  if (Number.isInteger(pct)) return `${pct}%`;
  return `${pct.toFixed(1)}%`;
}

const barColors = [
  "bg-black",
  "bg-neutral-600",
  "bg-neutral-400",
  "bg-neutral-300",
  "bg-neutral-200",
];

/**
 * EmployerApplicantsModal — Standardized Employer Applicant Roster Modal
 * Adopts the unified two-column split modal architecture matching Candidates, Events, Projects, and Job Details.
 */
export default function EmployerApplicantsModal({
  job,
  applications,
  students,
  onClose,
  onViewPortfolio,
  onStatusUpdate,
}: EmployerApplicantsModalProps) {
  const [activeTab, setActiveTab] = useState<ApplicantTabType>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const shortlist = useRecruiterShortlist();

  // Body scroll locking and escape key listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Responsive tab switcher
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setActiveTab((prev) => (prev === "info" ? "all" : prev));
      }
    };

    const timer = setTimeout(handleResize, 0);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Major distribution proportions
  const majorProportions = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((a) => {
      const major = a.portfolioSnapshot.major || "Engineering";
      counts[major] = (counts[major] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [applications]);

  // Pipeline Stage counts
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    applications.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  }, [applications]);

  const handleStatusChange = async (appId: string, newStatus: JobApplication["status"]) => {
    setUpdatingId(appId);
    try {
      const res = await fetch("/api/jobs/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status: newStatus }),
      });
      if (res.ok) {
        onStatusUpdate(appId, newStatus);
      }
    } catch (err) {
      console.warn("Failed to update applicant status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = () => {
    return "bg-white text-black border-neutral-300 font-bold";
  };

  // Filter applications based on activeTab
  const filteredApplications = useMemo(() => {
    if (activeTab === "all" || activeTab === "info") return applications;
    if (activeTab === "review") {
      return applications.filter((a) => a.status === "Under Review" || a.status === "Submitted");
    }
    if (activeTab === "interviewing") {
      return applications.filter((a) => a.status === "Interviewing");
    }
    if (activeTab === "offered") {
      return applications.filter((a) => a.status === "Offered");
    }
    return applications;
  }, [applications, activeTab]);

  const tabsList: Array<{
    id: ApplicantTabType;
    label: string;
    ariaLabel?: string;
  }> = [
    { id: "all", label: `All (${applications.length})`, ariaLabel: "All applicants" },
    {
      id: "review",
      label: `Review (${(stageCounts["Under Review"] || 0) + (stageCounts["Submitted"] || 0)})`,
      ariaLabel: "Applicants under review",
    },
    {
      id: "interviewing",
      label: `Interview (${stageCounts["Interviewing"] || 0})`,
      ariaLabel: "Interviewing applicants",
    },
    {
      id: "offered",
      label: `Offered (${stageCounts["Offered"] || 0})`,
      ariaLabel: "Offered candidates",
    },
  ];

  // Left Column Hero Content (mirrors EventModal and ProjectModal Left Column)
  const ApplicantHeroContent = (
    <div className="flex flex-col gap-5">
      {/* Top Header: Company Avatar & Badges */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-300 text-black font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
            {job.companyLogo || job.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block truncate">
              {job.companyName}
            </span>
            <span className="text-[10px] text-neutral-400 font-medium block truncate">
              {job.department || "Engineering Division"}
            </span>
          </div>
        </div>

        <Badge variant="neutral" className="text-[10px] uppercase font-bold shrink-0">
          Applicant Roster
        </Badge>
      </div>

      {/* Title & Subtitle */}
      <div className="flex flex-col">
        <Heading variant="modal">{job.title}</Heading>
        <Subheading variant="modal">
          {job.location} ({job.locationType}) • {job.employmentType}
        </Subheading>
      </div>

      {/* Metadata Badges */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-neutral-700 font-medium flex items-center gap-1 text-[11px]">
          <Briefcase size={11} className="text-neutral-400" />
          <span>{job.employmentType}</span>
        </span>
        <span className="px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-300 text-black font-bold flex items-center gap-1 text-[11px]">
          <Users size={11} className="text-black" />
          <span>{applications.length} {applications.length === 1 ? "Candidate" : "Candidates"}</span>
        </span>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-center shadow-2xs">
          <span className="block text-base font-black text-black leading-none">
            {applications.length}
          </span>
          <span className="text-[9.5px] text-neutral-500 font-bold uppercase tracking-wider mt-1 block">
            Total In Pool
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-center shadow-2xs">
          <span className="block text-base font-black text-black leading-none">
            {majorProportions.length}
          </span>
          <span className="text-[9.5px] text-neutral-500 font-bold uppercase tracking-wider mt-1 block">
            Majors Represented
          </span>
        </div>
      </div>

      {/* Pipeline Funnel Breakdown Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs flex flex-col gap-2.5">
        <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          <span>Hiring Pipeline Stage Counts</span>
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <span className="text-neutral-600 font-medium">Submitted</span>
            <strong className="text-black font-bold">{stageCounts["Submitted"] || 0}</strong>
          </div>
          <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <span className="text-neutral-600 font-medium">Under Review</span>
            <strong className="text-black font-bold">{stageCounts["Under Review"] || 0}</strong>
          </div>
          <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <span className="text-neutral-600 font-medium">Interviewing</span>
            <strong className="text-black font-bold">{stageCounts["Interviewing"] || 0}</strong>
          </div>
          <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between">
            <span className="text-neutral-600 font-medium">Offered</span>
            <strong className="text-black font-bold">{stageCounts["Offered"] || 0}</strong>
          </div>
        </div>
      </div>

      {/* Academic Major Proportions Breakdown */}
      {majorProportions.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
              <GraduationCap size={12} className="text-neutral-500" />
              <span>Major Proportions</span>
            </h3>
            <span className="text-[10px] text-neutral-400 font-medium">
              {applications.length} students
            </span>
          </div>

          {/* Composite Bar with exact fractional math */}
          <div className="w-full h-2 rounded-full bg-neutral-100 border border-neutral-300 overflow-hidden flex">
            {majorProportions.map(([major, count], idx) => {
              const fraction = count / applications.length;
              const percentStr = formatFractionalPercent(count, applications.length);
              return (
                <div
                  key={major}
                  style={{ width: `${fraction * 100}%`, flexGrow: count }}
                  className={`relative group/tooltip ${barColors[idx % barColors.length]} h-full`}
                >
                  <Tooltip content={`${major}: ${count}/${applications.length} (${percentStr})`} position="top" />
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            {majorProportions.map(([major, count], idx) => {
              const fraction = count / applications.length;
              const percentStr = formatFractionalPercent(count, applications.length);
              return (
                <div key={major} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${barColors[idx % barColors.length]} shrink-0`} />
                    <span className="text-neutral-800 font-medium truncate">{major}</span>
                  </div>
                  <span className="text-neutral-500 text-[11px] font-medium shrink-0">
                    <strong className="text-black font-bold">{count}/{applications.length}</strong> ({percentStr})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chapter Sponsor Recognition Segment */}
      <CurrentSponsorsSegment variant="panel" />
    </div>
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-modal-overlay backdrop-blur-md cursor-pointer animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Applicant Roster for ${job.title} - ${job.companyName}`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-full md:h-[82vh] rounded-none md:rounded-3xl bg-white border-0 md:border border-neutral-200 shadow-2xl flex flex-col max-h-screen md:max-h-[85vh] animate-scale-in cursor-default overflow-hidden"
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close applicant roster modal"
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-black cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container Wrapper */}
        <div className="w-full flex flex-col md:flex-row overflow-hidden h-full">
          {/* Left Side Panel: Hero & Quick Stats (Desktop) */}
          <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col justify-between md:overflow-y-auto overflow-x-hidden relative z-10 bg-neutral-50/70 hidden md:flex">
            {ApplicantHeroContent}
          </div>

          {/* Right Side Panel: Interactive Tabs */}
          <div className="w-full md:w-3/5 p-5 md:p-6 pt-12 md:pt-6 flex flex-col h-full relative z-10 bg-neutral-50/70 overflow-hidden">
            {/* Standardized Tab Navigation Header */}
            <div
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
              className="flex border-b border-neutral-200 mb-5 pb-1 text-xs md:text-sm gap-1 md:gap-2 overflow-x-auto no-scrollbar pr-10 md:pr-12 shrink-0 cursor-default"
            >
              {/* Mobile Info Tab */}
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className={`py-2 px-2.5 font-bold uppercase tracking-wider relative md:hidden shrink-0 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "info"
                    ? "text-black font-extrabold"
                    : "text-neutral-500 hover:text-black font-semibold"
                }`}
              >
                <Info size={14} className={activeTab === "info" ? "text-black" : "text-neutral-400"} />
                <span>Info</span>
                {activeTab === "info" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></span>
                )}
              </button>

              {/* Main Pipeline Tabs */}
              {tabsList.map(({ id, label, ariaLabel }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-label={ariaLabel || label}
                    onClick={() => setActiveTab(id)}
                    className={`py-2 px-2.5 sm:px-3 font-bold uppercase tracking-wider relative shrink-0 md:shrink md:flex-1 md:text-center whitespace-nowrap text-xs md:text-xs lg:text-sm cursor-pointer ${
                      isActive
                        ? "text-black font-extrabold"
                        : "text-neutral-500 hover:text-black font-semibold"
                    }`}
                  >
                    <span>{label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Display */}
            <div className={`grow pr-1 ${activeTab === "info" ? "overflow-hidden" : "overflow-y-auto"} md:overflow-y-auto`}>
              {/* Mobile Info Panel */}
              {activeTab === "info" && (
                <div className="flex flex-col h-full md:hidden relative overflow-y-auto pb-10 pr-1 animate-fade-in">
                  {ApplicantHeroContent}
                </div>
              )}

              {/* Applicants List Content */}
              {activeTab !== "info" && (
                <div className="flex flex-col gap-4 animate-fade-in pb-6">
                  {filteredApplications.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-white border border-dashed border-neutral-200 text-neutral-500 text-xs flex flex-col items-center gap-2 shadow-2xs">
                      <Users size={22} className="text-neutral-400" />
                      <p className="font-semibold text-black">No candidates found in this stage.</p>
                      <p className="font-sans text-neutral-500">
                        Select &ldquo;All&rdquo; above to view the complete applicant pool for this role.
                      </p>
                    </div>
                  ) : (
                    filteredApplications.map((app) => {
                      const student: Student =
                        students.find((s) => s.id === app.memberId) ||
                        students.find((s) => s.email.toLowerCase() === app.portfolioSnapshot.email.toLowerCase()) || {
                          id: app.memberId,
                          name: app.portfolioSnapshot.name,
                          email: app.portfolioSnapshot.email,
                          major: app.portfolioSnapshot.major,
                          gradDate: app.portfolioSnapshot.gradDate,
                          skills: app.portfolioSnapshot.skills,
                          resumeLink: app.portfolioSnapshot.resumePdfUrl,
                          bio: app.coverNote || "",
                          degree: "Bachelor of Science",
                          status: "Seeking Internship",
                          flagged: false,
                          links: [],
                          projects: [],
                          workExperiences: [],
                          clubs: [],
                          education: [],
                          certifications: [],
                          events: [],
                          points: 0,
                          recentPoints: 0,
                        };

                      const matchedSkills = (job.skillsRequired || []).filter((reqSkill) =>
                        (app.portfolioSnapshot.skills || []).some(
                          (s) => s.toLowerCase() === reqSkill.toLowerCase()
                        )
                      );

                      return (
                        <div
                          key={app.id}
                          className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col gap-3.5"
                        >
                          {/* Top Bar: Identity & Status Dropdown */}
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex items-start gap-3 min-w-0">
                              <Avatar name={app.portfolioSnapshot.name} size="sm" />
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm text-black leading-snug">
                                  {app.portfolioSnapshot.name}
                                </h4>
                                <p className="text-xs text-neutral-600 font-medium font-sans">
                                  {app.portfolioSnapshot.major} • Graduating {app.portfolioSnapshot.gradDate}
                                </p>
                                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                                  {app.portfolioSnapshot.email}
                                </p>
                              </div>
                            </div>

                            {/* Status Selector Dropdown & Shortlist Action */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => shortlist.toggleCandidate(student, job.title)}
                                aria-label={shortlist.isShortlisted(student.id) ? "Remove applicant from shortlist" : "Save applicant to shortlist"}
                                title={shortlist.isShortlisted(student.id) ? "Remove from shortlist" : "Save applicant to shortlist"}
                                className={`p-2 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                                  shortlist.isShortlisted(student.id)
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-neutral-400 border-neutral-300 hover:text-black hover:border-black"
                                }`}
                              >
                                {shortlist.isShortlisted(student.id) ? (
                                  <BookmarkCheck size={14} className="stroke-[2.5]" />
                                ) : (
                                  <Bookmark size={14} />
                                )}
                              </button>

                              <CustomDropdown
                                value={app.status}
                                disabled={updatingId === app.id}
                                onChange={(val) =>
                                  handleStatusChange(app.id, val as JobApplication["status"])
                                }
                                options={[
                                  { value: "Submitted", label: "Status: Submitted" },
                                  { value: "Under Review", label: "Status: Under Review" },
                                  { value: "Interviewing", label: "Status: Interviewing" },
                                  { value: "Offered", label: "Status: Offered" },
                                  { value: "Declined", label: "Status: Declined" },
                                ]}
                                buttonClassName={`text-xs font-bold ${getStatusBadgeClass()}`}
                                className="w-44"
                                align="right"
                                aria-label="Applicant Status"
                              />
                            </div>
                          </div>

                          {/* Skills Match Overview */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mr-1">
                              Skills ({matchedSkills.length} matched):
                            </span>
                            {app.portfolioSnapshot.skills.slice(0, 6).map((skill, idx) => {
                              const isMatch = matchedSkills.includes(skill);
                              return (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 rounded-lg text-[10.5px] font-semibold border shadow-2xs ${
                                    isMatch
                                      ? "bg-black text-white border-black font-bold"
                                      : "bg-neutral-100 border-neutral-300 text-neutral-700"
                                  }`}
                                >
                                  {skill}
                                </span>
                              );
                            })}
                            {app.portfolioSnapshot.skills.length > 6 && (
                              <span className="text-[10px] text-neutral-400 font-medium">
                                +{app.portfolioSnapshot.skills.length - 6} more
                              </span>
                            )}
                          </div>

                          {/* Candidate Note if provided */}
                          {app.coverNote && (
                            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 leading-relaxed font-sans">
                              <span className="font-bold text-black block text-[10px] uppercase tracking-wider mb-0.5">
                                Candidate Note:
                              </span>
                              &ldquo;{app.coverNote}&rdquo;
                            </div>
                          )}

                          {/* Action Buttons: View Portfolio & Resume */}
                          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                              <Calendar size={12} />
                              <span>
                                Applied{" "}
                                {new Date(app.appliedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </span>

                            <div className="flex items-center gap-2">
                              {app.portfolioSnapshot.resumePdfUrl && (
                                <a
                                  href={app.portfolioSnapshot.resumePdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-semibold border border-neutral-300 flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <FileText size={12} className="text-black" />
                                  <span>Resume PDF</span>
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={() => onViewPortfolio(student)}
                                className="px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all cursor-pointer"
                              >
                                View Portfolio
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
