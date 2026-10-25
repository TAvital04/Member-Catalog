"use client";

import React, { useState } from "react";
import {
  X,
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  FileText,
  Send,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { JobPosting, JobApplication } from "@/data/jobs";
import { Student } from "@/data/students";

interface JobDetailModalProps {
  job: JobPosting;
  activeStudent: Student;
  existingApplication?: JobApplication;
  onClose: () => void;
  onApplySuccess: (application: JobApplication) => void;
}

export default function JobDetailModal({
  job,
  activeStudent,
  existingApplication,
  onClose,
  onApplySuccess,
}: JobDetailModalProps) {
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [hasAppliedLocally, setHasAppliedLocally] = useState(Boolean(existingApplication));

  // Compute matched skills
  const matchedSkills = (job.skillsRequired || []).filter((skill) =>
    (activeStudent.skills || []).some(
      (s) => s.toLowerCase() === skill.toLowerCase()
    )
  );

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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-modal-overlay backdrop-blur-md cursor-pointer animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${job.title} at ${job.companyName}`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden cursor-default animate-scale-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close job details modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white border border-slate-200/90 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all shadow-xs cursor-pointer active:scale-90"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/70 flex flex-col gap-3 shrink-0">
          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
              {job.companyLogo || job.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {job.companyName}
                </span>
                {job.department && (
                  <span className="text-[11px] text-slate-400 font-medium">
                    • {job.department}
                  </span>
                )}
                {job.featured && (
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles size={11} /> Featured Partner
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {job.title}
              </h2>
            </div>
          </div>

          {/* Quick Details Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
              <Briefcase size={12} className="text-slate-400" />
              <span>{job.employmentType}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 shadow-2xs">
              <MapPin size={12} className="text-slate-400" />
              <span>{job.location} ({job.locationType})</span>
            </span>
            {job.salaryRange && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1.5 shadow-2xs">
                <DollarSign size={12} className="text-emerald-600" />
                <span>{job.salaryRange}</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-medium text-[11px] flex items-center gap-1.5 shadow-2xs ml-auto hidden sm:flex">
              <Clock size={12} className="text-slate-400" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </span>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto p-6 flex flex-col gap-6 flex-1">
          {/* Role Overview */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Role Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Key Responsibilities
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Qualifications & Requirements
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills & Match Breakdown */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-600" />
                  <span>Technical Skills Match</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-600">
                  {matchedSkills.length} of {job.skillsRequired.length} skills in your portfolio
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.skillsRequired.map((skill, idx) => {
                  const isMatch = matchedSkills.includes(skill);
                  return (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-2xs ${
                        isMatch
                          ? "bg-amber-500/15 border-amber-500 text-slate-900 font-bold"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      {skill} {isMatch && "✓"}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Benefits & Perks
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {job.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* One-Click Apply With Portfolio Section */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Apply With Your IEEE Portfolio
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Verified Member Fast-Track
              </span>
            </div>

            {hasAppliedLocally ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Application Submitted!</h4>
                  <p className="mt-0.5 text-emerald-800">
                    Your full engineering portfolio and verified credentials have been transmitted directly to {job.companyName}&apos;s university recruiting team.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApply} className="flex flex-col gap-3.5">
                {/* Candidate Portfolio Snapshot Card */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                      {activeStudent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {activeStudent.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {activeStudent.major} • Graduating {activeStudent.gradDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10.5px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      Portfolio Linked
                    </span>
                  </div>
                </div>

                {/* Optional Note to Hiring Team */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Quick Note to {job.companyName} (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly highlight why you're interested in this role or mention relevant coursework/projects..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-sans"
                  />
                </div>

                {submitError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Submit Application Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
