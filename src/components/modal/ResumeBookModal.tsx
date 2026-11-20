"use client";

/**
 * @file ResumeBookModal.tsx
 * @description Configuration dialog for corporate sponsors to customize, filter,
 * and batch-export chapter candidate Resume Books.
 */

import React, { useState, useMemo } from "react";
import {
  X,
  BookOpen,
  Printer,
  Download,
  FileText,
  Building2,
  Users,
  Check,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { Student } from "@/data/students";
import { ShortlistedCandidate } from "@/types/shortlist";
import { ResumeBookOptions } from "@/types/resumeBook";
import {
  compileResumeBookCandidates,
  exportResumeBookCsv,
  exportResumeBookJson,
} from "@/lib/resumeBook";
import CustomDropdown from "@/components/common/CustomDropdown";

interface ResumeBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredStudents: Student[];
  allStudents: Student[];
  shortlistedCandidates: ShortlistedCandidate[];
  initialScope?: "filtered" | "shortlist" | "all";
  sponsorName?: string;
  onOpenViewer: (options: ResumeBookOptions) => void;
}

export default function ResumeBookModal({
  isOpen,
  onClose,
  filteredStudents,
  allStudents,
  shortlistedCandidates,
  initialScope = "filtered",
  sponsorName = "Corporate Partner",
  onOpenViewer,
}: ResumeBookModalProps) {
  const [scope, setScope] = useState<"filtered" | "shortlist" | "all">(initialScope);
  const [companyName, setCompanyName] = useState(sponsorName);
  const [bookTitle, setBookTitle] = useState("Engineering & Computing Candidate Resume Book");
  const [targetRole, setTargetRole] = useState("Full-Time & Internship Opportunities");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [selectedGradYear, setSelectedGradYear] = useState("all");

  const [includeProjects, setIncludeProjects] = useState(true);
  const [includeEvents, setIncludeEvents] = useState(true);
  const [includeDirectLinks, setIncludeDirectLinks] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeGpa, setIncludeGpa] = useState(true);

  // Determine base students by scope
  const baseStudents = useMemo(() => {
    if (scope === "shortlist") {
      const savedIds = new Set(shortlistedCandidates.map((c) => c.candidateId.toLowerCase()));
      return allStudents.filter((s) => savedIds.has(s.id.toLowerCase()));
    }
    if (scope === "all") {
      return allStudents;
    }
    return filteredStudents;
  }, [scope, shortlistedCandidates, allStudents, filteredStudents]);

  // Extract distinct majors and grad years
  const availableMajors = useMemo(() => {
    const set = new Set<string>();
    baseStudents.forEach((s) => set.add(s.major));
    return Array.from(set).sort();
  }, [baseStudents]);

  const availableGradYears = useMemo(() => {
    const set = new Set<string>();
    baseStudents.forEach((s) => {
      const match = s.gradDate.match(/\d{4}/);
      if (match) set.add(match[0]);
    });
    return Array.from(set).sort();
  }, [baseStudents]);

  // Recruiter notes lookup map
  const notesMap = useMemo(() => {
    const map: Record<string, { notes?: string; tags?: string[] }> = {};
    shortlistedCandidates.forEach((c) => {
      map[c.candidateId.toLowerCase()] = {
        notes: c.notes,
        tags: c.tags,
      };
    });
    return map;
  }, [shortlistedCandidates]);

  const currentOptions: ResumeBookOptions = {
    title: bookTitle,
    sponsorName: companyName,
    targetRole,
    academicTerm: "Academic Year 2025–2026",
    includeProjects,
    includeEvents,
    includeDirectResumeLinks: includeDirectLinks,
    includeRecruiterNotes: includeNotes,
    includeGpa,
    selectedMajor,
    selectedGradYear,
    sourceScope: scope,
  };

  const compiledCandidates = useMemo(() => {
    return compileResumeBookCandidates(baseStudents, currentOptions, notesMap);
  }, [baseStudents, currentOptions, notesMap]);

  if (!isOpen) return null;

  const handleOpenViewer = () => {
    onOpenViewer(currentOptions);
    onClose();
  };

  const handleExportCsv = () => {
    exportResumeBookCsv(compiledCandidates, currentOptions);
  };

  const handleExportJson = () => {
    exportResumeBookJson(compiledCandidates, currentOptions);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-modal-overlay backdrop-blur-md cursor-pointer animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Generate Corporate Sponsor Resume Book"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 cursor-default max-h-[90vh] overflow-y-auto animate-scale-in"
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-neutral-100 border border-neutral-200 text-black">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-black">
                Batch Resume Book Export
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Generate tailored candidate books for corporate partner review, recruitment pipelines, and ATS imports.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Resume Book modal"
            className="p-2 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-black cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. Candidate Source Scope Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
            <Users size={14} className="text-neutral-500" />
            <span>Candidate Cohort Selection</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setScope("filtered")}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                scope === "filtered"
                  ? "bg-black text-white border-black shadow-2xs font-bold"
                  : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
              }`}
            >
              <div className="text-xs font-black">Active Filters</div>
              <div className={`text-[11px] mt-0.5 ${scope === "filtered" ? "text-neutral-300" : "text-neutral-500"}`}>
                {filteredStudents.length} candidates
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScope("shortlist")}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                scope === "shortlist"
                  ? "bg-black text-white border-black shadow-2xs font-bold"
                  : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
              }`}
            >
              <div className="text-xs font-black">My Saved Shortlist</div>
              <div className={`text-[11px] mt-0.5 ${scope === "shortlist" ? "text-neutral-300" : "text-neutral-500"}`}>
                {shortlistedCandidates.length} candidates
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScope("all")}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                scope === "all"
                  ? "bg-black text-white border-black shadow-2xs font-bold"
                  : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
              }`}
            >
              <div className="text-xs font-black">All Members</div>
              <div className={`text-[11px] mt-0.5 ${scope === "all" ? "text-neutral-300" : "text-neutral-500"}`}>
                {allStudents.length} candidates
              </div>
            </button>
          </div>
        </div>

        {/* 2. Narrow by Major and Graduation Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-black">
              Engineering Major
            </label>
            <CustomDropdown
              options={[
                { value: "all", label: "All Majors" },
                ...availableMajors.map((m) => ({ value: m, label: m })),
              ]}
              value={selectedMajor}
              onChange={setSelectedMajor}
              placeholder="All Majors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-black">
              Graduation Cohort
            </label>
            <CustomDropdown
              options={[
                { value: "all", label: "All Cohorts" },
                ...availableGradYears.map((y) => ({ value: y, label: `Class of ${y}` })),
              ]}
              value={selectedGradYear}
              onChange={setSelectedGradYear}
              placeholder="All Cohorts"
            />
          </div>
        </div>

        {/* 3. Corporate Partner Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="resumebook-sponsor-field" className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <Building2 size={13} className="text-neutral-500" />
              <span>Prepared Exclusively For</span>
            </label>
            <input
              id="resumebook-sponsor-field"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company / Employer Name"
              className="px-3.5 py-2 text-xs rounded-xl bg-neutral-50 border border-neutral-300 focus:bg-white focus:border-black focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="resumebook-target-field" className="text-xs font-black uppercase tracking-wider text-black">
              Target Focus / Role
            </label>
            <input
              id="resumebook-target-field"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Summer 2026 Hardware Interns"
              className="px-3.5 py-2 text-xs rounded-xl bg-neutral-50 border border-neutral-300 focus:bg-white focus:border-black focus:outline-none"
            />
          </div>
        </div>

        {/* 4. Inclusion Options */}
        <div className="flex flex-col gap-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl p-4">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
            Dossier Inclusions
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-800">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeProjects}
                onChange={(e) => setIncludeProjects(e.target.checked)}
                className="rounded border-neutral-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Verified Chapter Projects & Milestones</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeEvents}
                onChange={(e) => setIncludeEvents(e.target.checked)}
                className="rounded border-neutral-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Technical Workshops & Conferences</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeDirectLinks}
                onChange={(e) => setIncludeDirectLinks(e.target.checked)}
                className="rounded border-neutral-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Uploaded PDF Resume & Vanity Links</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeGpa}
                onChange={(e) => setIncludeGpa(e.target.checked)}
                className="rounded border-neutral-300 text-black focus:ring-black cursor-pointer"
              />
              <span>FERPA-Consented GPA</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none col-span-1 sm:col-span-2">
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={(e) => setIncludeNotes(e.target.checked)}
                className="rounded border-neutral-300 text-black focus:ring-black cursor-pointer"
              />
              <span>Include Private Recruiter Notes from Shortlist</span>
            </label>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-200">
          <div className="text-xs font-bold text-neutral-600">
            <span className="text-black font-black">{compiledCandidates.length}</span> candidates will be compiled
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={compiledCandidates.length === 0}
              className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-black text-xs font-bold hover:bg-neutral-50 transition-colors cursor-pointer shadow-2xs disabled:opacity-40"
            >
              <Download size={13} className="inline mr-1 text-neutral-500" />
              <span>CSV Index</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              disabled={compiledCandidates.length === 0}
              className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-black text-xs font-bold hover:bg-neutral-50 transition-colors cursor-pointer shadow-2xs disabled:opacity-40"
            >
              <FileText size={13} className="inline mr-1 text-neutral-500" />
              <span>ATS JSON</span>
            </button>

            <button
              type="button"
              onClick={handleOpenViewer}
              disabled={compiledCandidates.length === 0}
              className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5 disabled:opacity-40"
            >
              <Printer size={14} className="text-white" />
              <span>Open Print-Ready Book</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
