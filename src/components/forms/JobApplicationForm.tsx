"use client";

/**
 * @file JobApplicationForm.tsx — Form 7: Member 1-Click Portfolio Job Application Form
 * @description Allows student members to apply directly to corporate sponsor job postings
 * with their verified chapter portfolio, workshop-earned skills, and optional recruiter note.
 * Adheres strictly to the chapter zero-hover policy and monochrome minimalist aesthetic.
 */

import React, { useState } from "react";
import {
  X,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { JobPosting, JobApplication } from "@/data/jobs";
import { Student } from "@/data/students";
import Avatar from "@/components/common/Avatar";
import PortfolioModal from "@/components/modal/PortfolioModal";

export interface JobApplicationFormProps {
  job: JobPosting;
  activeStudent: Student;
  existingApplication?: JobApplication;
  onApplySuccess: (application: JobApplication) => void;
  onClose?: () => void;
  isStandaloneModal?: boolean;
  onViewPortfolio?: (student: Student) => void;
}

export default function JobApplicationForm({
  job,
  activeStudent,
  existingApplication,
  onApplySuccess,
  onClose,
  isStandaloneModal = false,
  onViewPortfolio,
}: JobApplicationFormProps) {
  const [coverNote, setCoverNote] = useState("");
  const [customResumeUrl, setCustomResumeUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [hasAppliedLocally, setHasAppliedLocally] = useState(Boolean(existingApplication));
  const [isViewingPortfolio, setIsViewingPortfolio] = useState(false);

  const defaultResume =
    activeStudent.resumeLink ||
    activeStudent.links?.find((l) => /resume|cv/i.test(l.name))?.text;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        jobId: job.id,
        memberId: activeStudent.id,
        coverNote: coverNote.trim(),
        customResumeUrl: customResumeUrl.trim() || undefined,
        portfolioSnapshot: {
          name: activeStudent.name,
          email: activeStudent.email,
          major: activeStudent.major,
          gradDate: activeStudent.gradDate,
          skills: activeStudent.skills || [],
          mainProjectName: activeStudent.mainProjectName || undefined,
          resumePdfUrl: customResumeUrl.trim() || defaultResume,
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
        throw new Error(data.error || "Failed to submit application.");
      }

      setHasAppliedLocally(true);
      onApplySuccess(data.data);
    } catch (err: any) {
      console.error("[JobApplicationForm Error] Application submission failed:", err);
      setSubmitError(err.message || "An unexpected error occurred while transmitting your portfolio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formBody = (
    <div className="flex flex-col gap-5">
      {hasAppliedLocally ? (
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-2xs flex flex-col items-center text-center gap-3 py-10">
          <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-300 text-black flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="font-black text-lg text-black">Application Successfully Transmitted</h4>
          <p className="text-xs text-neutral-600 max-w-md leading-relaxed font-sans">
            Your verified chapter portfolio, workshop credentials, and resume have been dispatched directly to{" "}
            <span className="font-bold text-black">{job.companyName}</span>&apos;s university recruiting department.
          </p>
          <div className="mt-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Status: Under Review
          </div>

          {onClose && isStandaloneModal && (
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-5 py-2 rounded-xl bg-black text-white text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Card 1: Candidate Identity Snapshot Card */}
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={activeStudent.name} size="sm" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-black truncate">
                  {activeStudent.name}
                </h4>
                <p className="text-[11px] text-neutral-600 truncate font-sans">
                  {activeStudent.major} • Graduating {activeStudent.gradDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onViewPortfolio) {
                    onViewPortfolio(activeStudent);
                  } else {
                    setIsViewingPortfolio(true);
                  }
                }}
                className="text-xs font-semibold text-neutral-800 bg-white px-3 py-1.5 rounded-lg border border-neutral-300 flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink size={12} className="text-black" />
                <span>Review Full Portfolio</span>
              </button>
            </div>
          </div>

          {/* Card 2: Quick Note to Recruiter */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Quick Note to {job.companyName} Recruiters (Optional)
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <textarea
                id="cover-note"
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Briefly highlight why you're interested in this role, or note relevant chapter projects, lab experience, or robotics builds..."
                className="w-full text-xs focus:outline-none resize-none font-sans bg-transparent text-black"
              />
            </div>
          </div>

          {/* Card 3: Tailored Resume URL */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Tailored Resume URL (Optional Override)
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <input
                id="custom-resume"
                type="url"
                value={customResumeUrl}
                onChange={(e) => setCustomResumeUrl(e.target.value)}
                placeholder={defaultResume || "https://drive.google.com/file/d/tailored-resume/view"}
                className="w-full text-xs focus:outline-none font-sans bg-transparent text-black"
              />
            </div>
          </div>

          {submitError && (
            <div className="p-3 rounded-2xl bg-neutral-100 border border-black text-black text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Form Action Controls */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            {onClose && isStandaloneModal && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-black font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-black text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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
          </div>
        </form>
      )}
    </div>
  );

  return (
    <>
      {isStandaloneModal ? (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-modal-overlay backdrop-blur-md cursor-pointer"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Apply for ${job.title} at ${job.companyName}`}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white border border-neutral-300 shadow-2xl flex flex-col overflow-hidden animate-scale-in text-black cursor-default"
          >
            {/* Standalone Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-300 text-black font-black text-xs flex items-center justify-center shrink-0">
                  {job.companyLogo || job.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-black">{job.title}</h2>
                  <p className="text-xs text-neutral-600">
                    {job.companyName} • {job.location} ({job.employmentType})
                  </p>
                </div>
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close application form"
                  className="p-1 rounded-full bg-neutral-100 border border-neutral-300 text-black cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="p-6 overflow-y-auto flex-1">{formBody}</div>
          </div>
        </div>
      ) : (
        formBody
      )}

      {isViewingPortfolio && (
        <PortfolioModal
          student={activeStudent}
          onClose={() => setIsViewingPortfolio(false)}
          role="standard"
        />
      )}
    </>
  );
}
