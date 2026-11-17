"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Briefcase,
  MapPin,
  DollarSign,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Send,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { JobPosting, JobApplication } from "@/data/jobs";
import { Student } from "@/data/students";
import Avatar from "@/components/common/Avatar";
import { Heading, Subheading, Badge } from "@/components/ui";
import CurrentSponsorsSegment from "@/components/common/CurrentSponsorsSegment";

export type JobTabType = "info" | "overview" | "skills" | "apply";

interface JobDetailModalProps {
  job: JobPosting;
  activeStudent: Student;
  existingApplication?: JobApplication;
  onClose: () => void;
  onApplySuccess: (application: JobApplication) => void;
}

/**
 * JobDetailModal — Standardized Career & Opportunity Inspection Modal
 * Adopts the unified split two-column modal architecture used across Candidates, Events, and Projects.
 */
export default function JobDetailModal({
  job,
  activeStudent,
  existingApplication,
  onClose,
  onApplySuccess,
}: JobDetailModalProps) {
  const [activeTab, setActiveTab] = useState<JobTabType>("overview");
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [hasAppliedLocally, setHasAppliedLocally] = useState(Boolean(existingApplication));

  // Compute matched skills between active candidate and job requirements
  const matchedSkills = (job.skillsRequired || []).filter((skill) =>
    (activeStudent.skills || []).some(
      (s) => s.toLowerCase() === skill.toLowerCase()
    )
  );

  const missingSkills = (job.skillsRequired || []).filter(
    (skill) => !matchedSkills.includes(skill)
  );

  // Handle escape key and body scroll lock
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

  // Handle responsive tab switching between desktop and mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setActiveTab((prev) => (prev === "info" ? "overview" : prev));
      }
    };

    const timer = setTimeout(handleResize, 0);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        jobId: job.id,
        memberId: activeStudent.id,
        coverNote,
        portfolioSnapshot: {
          name: activeStudent.name,
          email: activeStudent.email,
          major: activeStudent.major,
          gradDate: activeStudent.gradDate,
          skills: activeStudent.skills || [],
          mainProjectName: activeStudent.mainProjectName || undefined,
          resumePdfUrl:
            activeStudent.resumeLink ||
            activeStudent.links?.find((l) => /resume|cv/i.test(l.name))?.text,
          bio: activeStudent.bio,
        },
      };

      const res = await fetch("/api/jobs/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit application");
      }

      setHasAppliedLocally(true);
      onApplySuccess(data.data);
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabsList: Array<{
    id: JobTabType;
    label: string;
    ariaLabel?: string;
  }> = [
    { id: "overview", label: "Overview", ariaLabel: "Job overview & responsibilities" },
    { id: "skills", label: `Skills (${matchedSkills.length}/${job.skillsRequired?.length || 0})`, ariaLabel: "Skills breakdown & match" },
    { id: "apply", label: hasAppliedLocally ? "Application (Submitted)" : "Apply", ariaLabel: "Submit portfolio application" },
  ];

  // Left Column Hero Content (mirrors EventModal and ProjectModal Left Column)
  const JobHeroContent = (
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
            {job.department && (
              <span className="text-[10px] text-neutral-400 font-medium block truncate">
                {job.department}
              </span>
            )}
          </div>
        </div>

        {hasAppliedLocally && (
          <Badge variant="solid" className="flex items-center gap-1 text-[10px]">
            <CheckCircle2 size={11} className="text-white" />
            <span>Applied</span>
          </Badge>
        )}
      </div>

      {/* Title & Subtitle */}
      <div className="flex flex-col">
        <Heading variant="modal">{job.title}</Heading>
        <Subheading variant="modal">
          {job.location} • {job.employmentType}
        </Subheading>
      </div>

      {/* Metadata Badges */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-neutral-700 font-medium flex items-center gap-1 text-[11px]">
          <Briefcase size={11} className="text-neutral-400" />
          <span>{job.employmentType}</span>
        </span>
        <span className="px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-neutral-700 font-medium flex items-center gap-1 text-[11px]">
          <MapPin size={11} className="text-neutral-400" />
          <span>{job.location} ({job.locationType})</span>
        </span>
        {job.salaryRange && (
          <span className="px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-300 text-black font-semibold text-[11px]">
            {job.salaryRange}
          </span>
        )}
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-center shadow-2xs">
          <span className="block text-base font-black text-black leading-none">
            {job.skillsRequired ? job.skillsRequired.length : 0}
          </span>
          <span className="text-[9.5px] text-neutral-500 font-bold uppercase tracking-wider mt-1 block">
            Skills Required
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-neutral-200 text-center shadow-2xs">
          <span className="block text-base font-black text-black leading-none">
            {matchedSkills.length}
          </span>
          <span className="text-[9.5px] text-neutral-500 font-bold uppercase tracking-wider mt-1 block">
            Skills Matched
          </span>
        </div>
      </div>

      {/* Brief Overview Snippet */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xs flex flex-col gap-2">
        <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          <span>Position Summary</span>
        </h3>
        <p className="text-xs text-neutral-600 leading-relaxed font-sans line-clamp-3">
          {job.description}
        </p>
      </div>

      {/* Fast Action / Application Callout */}
      {!hasAppliedLocally ? (
        <button
          type="button"
          onClick={() => setActiveTab("apply")}
          className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all shadow-2xs"
        >
          <Send size={13} />
          <span>Apply with Student Portfolio</span>
        </button>
      ) : (
        <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 size={15} className="text-black shrink-0" />
          <span>Application on file with {job.companyName}</span>
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
        aria-label={`${job.title} at ${job.companyName} - Engineering Opportunity`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-full md:h-[82vh] rounded-none md:rounded-3xl bg-white border-0 md:border border-neutral-200 shadow-2xl flex flex-col max-h-screen md:max-h-[85vh] animate-scale-in cursor-default overflow-hidden"
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close job details modal"
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-black cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container Wrapper */}
        <div className="w-full flex flex-col md:flex-row overflow-hidden h-full">
          {/* Left Side Panel: Hero & Quick Stats (Desktop) */}
          <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col justify-between md:overflow-y-auto overflow-x-hidden relative z-10 bg-neutral-50/70 hidden md:flex">
            {JobHeroContent}
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

              {/* Main Tabs */}
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
                  {JobHeroContent}
                </div>
              )}

              {/* Overview Tab Content */}
              {activeTab === "overview" && (
                <div className="flex flex-col gap-6 animate-fade-in pb-6">
                  {/* Full Description / Role Overview */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                      Role Overview
                    </h3>
                    <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-sans whitespace-pre-line">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  {/* Key Responsibilities */}
                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                        Key Responsibilities
                      </h3>
                      <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
                        <ul className="space-y-2 text-xs text-neutral-700 font-sans">
                          {job.responsibilities.map((resp, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Qualifications & Requirements */}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                        Qualifications & Requirements
                      </h3>
                      <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
                        <ul className="space-y-2 text-xs text-neutral-700 font-sans">
                          {job.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Benefits & Perks */}
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                        Benefits & Offerings
                      </h3>
                      <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
                        <ul className="space-y-2 text-xs text-neutral-700 font-sans">
                          {job.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-1.5 shrink-0" />
                              <span className="leading-relaxed">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Skills Match Tab Content */}
              {activeTab === "skills" && (
                <div className="flex flex-col gap-5 animate-fade-in pb-6">
                  {/* Match Summary Card */}
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                        Portfolio Skill Alignment
                      </h3>
                      <span className="text-xs font-bold text-black">
                        {matchedSkills.length} / {job.skillsRequired?.length || 0} Matched
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 font-sans leading-relaxed">
                      Comparing verified engineering competencies in{" "}
                      <span className="font-bold text-black">{activeStudent.name}</span>&apos;s chapter portfolio against role requirements.
                    </p>
                  </div>

                  {/* Verified Matched Skills */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-black" />
                        <span>Matched Skills ({matchedSkills.length})</span>
                      </h3>
                      <span className="text-[11px] text-neutral-500">Verified in your portfolio</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
                      {matchedSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {matchedSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-lg bg-black text-white border border-black text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                            >
                              <CheckCircle2 size={11} className="text-white" />
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-500 italic">
                          No exact keyword matches found in your active portfolio skills.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Remaining Role Requirements */}
                  {missingSkills.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                          Additional Technologies & Tools ({missingSkills.length})
                        </h3>
                        <span className="text-[11px] text-neutral-500">Desired for position</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
                        <div className="flex flex-wrap gap-2">
                          {missingSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Apply Tab Content */}
              {activeTab === "apply" && (
                <div className="flex flex-col gap-5 animate-fade-in pb-6">
                  {hasAppliedLocally ? (
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col items-center text-center gap-3 py-10">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-300 text-black flex items-center justify-center">
                        <CheckCircle2 size={24} />
                      </div>
                      <h4 className="font-black text-lg text-black">Application Successfully Transmitted</h4>
                      <p className="text-xs text-neutral-600 max-w-md leading-relaxed font-sans">
                        Your complete verified IEEE UCF engineering portfolio, resume attachment, and project endorsements have been routed directly to{" "}
                        <span className="font-bold text-black">{job.companyName}</span>&apos;s university recruiting department.
                      </p>
                      <div className="mt-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                        Status: Under Review
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                        <div>
                          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                            Apply with IEEE Engineering Portfolio
                          </h3>
                          <p className="text-[11px] text-neutral-500 mt-0.5 font-sans">
                            Fast-track submission transmitting your active profile directly to corporate recruiters.
                          </p>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200 shrink-0">
                          Verified Candidate
                        </span>
                      </div>

                      <form onSubmit={handleApply} className="flex flex-col gap-4">
                        {/* Candidate Snapshot Box */}
                        <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={activeStudent.name} size="sm" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-black truncate">
                                {activeStudent.name}
                              </h4>
                              <p className="text-[11px] text-neutral-500 truncate font-sans">
                                {activeStudent.major} • Graduating {activeStudent.gradDate}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10.5px] font-semibold text-neutral-700 bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                              Portfolio Linked
                            </span>
                          </div>
                        </div>

                        {/* Optional Candidate Cover Note */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                            Quick Note to {job.companyName} (Optional)
                          </label>
                          <textarea
                            rows={3}
                            value={coverNote}
                            onChange={(e) => setCoverNote(e.target.value)}
                            placeholder="Briefly highlight why you're interested in this role or mention relevant chapter projects and lab experience..."
                            className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none font-sans bg-neutral-50/50"
                          />
                        </div>

                        {submitError && (
                          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{submitError}</span>
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-xs"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              <span>Transmitting Portfolio...</span>
                            </>
                          ) : (
                            <>
                              <Send size={13} />
                              <span>Submit Application With Portfolio</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>
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
