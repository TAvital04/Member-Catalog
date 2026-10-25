"use client";

import React, { useState } from "react";
import {
  X,
  Users,
  CheckCircle2,
  FileText,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Briefcase,
  Mail,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { JobPosting, JobApplication } from "@/data/jobs";
import { Student } from "@/data/students";

interface EmployerApplicantsModalProps {
  job: JobPosting;
  applications: JobApplication[];
  students: Student[];
  onClose: () => void;
  onViewPortfolio: (student: Student) => void;
  onStatusUpdate: (appId: string, newStatus: JobApplication["status"]) => void;
}

export default function EmployerApplicantsModal({
  job,
  applications,
  students,
  onClose,
  onViewPortfolio,
  onStatusUpdate,
}: EmployerApplicantsModalProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const getStatusBadgeClass = (status: JobApplication["status"]) => {
    switch (status) {
      case "Offered":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Interviewing":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Under Review":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Declined":
        return "bg-slate-100 text-slate-500 border-slate-200";
      default:
        return "bg-sky-50 text-sky-800 border-sky-200";
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
        aria-label={`Applicants for ${job.title}`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden cursor-default animate-scale-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close applicants modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white border border-slate-200/90 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all shadow-xs cursor-pointer active:scale-90"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Users size={14} className="text-amber-600" />
            <span>Applicant Roster</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {job.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
            <span>{job.companyName}</span>
            <span>•</span>
            <span>{job.location} ({job.locationType})</span>
            <span>•</span>
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {applications.length} {applications.length === 1 ? "Applicant" : "Applicants"}
            </span>
          </div>
        </div>

        {/* Applicant Cards List */}
        <div className="overflow-y-auto p-6 flex flex-col gap-4 flex-1">
          {applications.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-500 text-xs flex flex-col items-center gap-2">
              <Users size={24} className="text-slate-400" />
              <p className="font-semibold text-slate-700">No applications received yet for this role.</p>
              <p>Applications submitted by IEEE UCF student members will appear here with complete portfolio data.</p>
            </div>
          ) : (
            applications.map((app) => {
              // Try to find matching full student object
              const student =
                students.find((s) => s.id === app.memberId) ||
                students.find((s) => s.email === app.portfolioSnapshot.email);

              // Matching skills calculation
              const matchedSkills = (job.skillsRequired || []).filter((reqSkill) =>
                (app.portfolioSnapshot.skills || []).some(
                  (s) => s.toLowerCase() === reqSkill.toLowerCase()
                )
              );

              return (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3.5 transition-all hover:border-slate-300 hover:shadow-xs"
                >
                  {/* Top Bar: Candidate Identity + Status Pill */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                        {app.portfolioSnapshot.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-sm text-slate-900 leading-snug">
                          {app.portfolioSnapshot.name}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium">
                          {app.portfolioSnapshot.major} • Graduating {app.portfolioSnapshot.gradDate}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {app.portfolioSnapshot.email}
                        </p>
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as any)
                        }
                        disabled={updatingId === app.id}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${getStatusBadgeClass(
                          app.status
                        )}`}
                      >
                        <option value="Submitted">Status: Submitted</option>
                        <option value="Under Review">Status: Under Review</option>
                        <option value="Interviewing">Status: Interviewing</option>
                        <option value="Offered">Status: Offered</option>
                        <option value="Declined">Status: Declined</option>
                      </select>
                    </div>
                  </div>

                  {/* Skills Match Overview */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                      Skills:
                    </span>
                    {app.portfolioSnapshot.skills.slice(0, 7).map((skill, idx) => {
                      const isMatch = matchedSkills.includes(skill);
                      return (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-lg text-[10.5px] font-semibold border shadow-2xs ${
                            isMatch
                              ? "bg-amber-500/15 border-amber-500 text-slate-900 font-bold"
                              : "bg-slate-100 border-slate-200 text-slate-600"
                          }`}
                        >
                          {skill} {isMatch && "✓"}
                        </span>
                      );
                    })}
                    {app.portfolioSnapshot.skills.length > 7 && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        +{app.portfolioSnapshot.skills.length - 7} more
                      </span>
                    )}
                  </div>

                  {/* Cover Note if provided */}
                  {app.coverNote && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed font-sans">
                      <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider mb-0.5">
                        Candidate Note:
                      </span>
                      &ldquo;{app.coverNote}&rdquo;
                    </div>
                  )}

                  {/* Action Buttons: View Portfolio & Resume */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
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
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          <FileText size={12} className="text-emerald-600" />
                          <span>Resume PDF</span>
                          <ExternalLink size={11} className="text-slate-400" />
                        </a>
                      )}

                      {student && (
                        <button
                          type="button"
                          onClick={() => onViewPortfolio(student)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles size={12} className="text-amber-400" />
                          <span>Inspect Full Portfolio</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
