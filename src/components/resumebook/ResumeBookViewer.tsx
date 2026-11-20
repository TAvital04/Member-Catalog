"use client";

/**
 * @file ResumeBookViewer.tsx
 * @description High-resolution, print-ready multi-page Candidate Resume Book view.
 * Formatted with page-break controls for seamless browser Print-to-PDF export.
 */

import React from "react";
import {
  Printer,
  Download,
  ArrowLeft,
  Calendar,
  Mail,
  ExternalLink,
  Award,
  BookOpen,
  FolderGit2,
  FileText,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { ResumeBookCandidate, ResumeBookOptions } from "@/types/resumeBook";
import { exportResumeBookCsv, exportResumeBookJson } from "@/lib/resumeBook";

interface ResumeBookViewerProps {
  candidates: ResumeBookCandidate[];
  options: ResumeBookOptions;
  onClose: () => void;
}

export default function ResumeBookViewer({
  candidates,
  options,
  onClose,
}: ResumeBookViewerProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    exportResumeBookCsv(candidates, options);
  };

  const handleDownloadJson = () => {
    exportResumeBookJson(candidates, options);
  };

  // Major distribution statistics for Cover Sheet
  const majorCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach((c) => {
      counts[c.major] = (counts[c.major] || 0) + 1;
    });
    return counts;
  }, [candidates]);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-100 overflow-y-auto">
      {/* Print CSS Rules */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body, html {
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always !important;
            break-after: page !important;
          }
          .resume-sheet {
            box-shadow: none !important;
            border: none !important;
            padding: 2.5rem !important;
            max-width: 100% !important;
            margin: 0 !important;
            min-height: 100vh !important;
          }
          @page {
            size: letter portrait;
            margin: 0.5in;
          }
        }
      `}} />

      {/* Floating Control Bar (Hidden when printing) */}
      <div className="no-print sticky top-0 z-50 bg-white border-b border-neutral-300 px-6 py-3.5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit Resume Book view"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Catalog</span>
          </button>
          <div className="h-4 w-px bg-neutral-200" />
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-black" />
            <span className="text-sm font-black text-black">
              {options.title || "RSO USF Candidate Resume Book"}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 border border-neutral-200 text-black">
              {candidates.length} {candidates.length === 1 ? "Candidate" : "Candidates"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-black hover:bg-neutral-50 transition-colors cursor-pointer shadow-2xs"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-black hover:bg-neutral-50 transition-colors cursor-pointer shadow-2xs"
          >
            <FileText size={13} />
            <span>ATS JSON</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print or save Resume Book as PDF"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer shadow-2xs"
          >
            <Printer size={14} className="text-white" />
            <span>Print / Save to PDF</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Page Resume Book Container */}
      <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
        {/* ================= PAGE 1: COVER SHEET ================= */}
        <div className="resume-sheet page-break bg-white border border-neutral-300 rounded-3xl p-10 sm:p-14 shadow-md flex flex-col justify-between min-h-[1050px]">
          {/* Top Organization Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-6">
            <div>
              <span className="text-xs font-extrabold tracking-widest uppercase text-neutral-500 block">
                University of South Florida • College of Engineering
              </span>
              <h1 className="text-2xl font-black text-black tracking-tight mt-0.5">
                RSO USF Student Chapter
              </h1>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-neutral-400 block">Official Chapter Publication</span>
              <span className="text-xs font-bold text-neutral-800">
                {options.academicTerm || "Academic Year 2025–2026"}
              </span>
            </div>
          </div>

          {/* Middle Hero Presentation */}
          <div className="flex flex-col gap-6 my-auto py-12">
            <div className="inline-block px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-black uppercase tracking-wider text-black w-fit">
              Official Corporate Partner Dossier
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl font-black text-black tracking-tight leading-tight">
                {options.title || "Engineering & Computing Candidate Resume Book"}
              </h2>
              {options.targetRole && (
                <p className="text-lg font-bold text-neutral-600">
                  Target Focus: {options.targetRole}
                </p>
              )}
            </div>

            <div className="border-l-4 border-black pl-5 py-2 my-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                Prepared Exclusively For
              </span>
              <h3 className="text-2xl font-black text-black mt-1">
                {options.sponsorName || "Corporate Partner"}
              </h3>
            </div>

            {/* Candidate Breakdown Metrics */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 mt-4">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500 block mb-3">
                Candidate Cohort Overview ({candidates.length} Verified Members)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(majorCounts).map(([major, count]) => (
                  <div key={major} className="flex flex-col bg-white border border-neutral-200 rounded-xl p-3">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide truncate">
                      {major}
                    </span>
                    <span className="text-lg font-black text-black">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Footer & Chapter Verification */}
          <div className="border-t border-neutral-200 pt-6 flex items-center justify-between text-xs text-neutral-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-black" />
              <span>Verified Chapter Build Projects & Workshop Attendance</span>
            </div>
            <span>Generated on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>

        {/* ================= PAGE 2: TABLE OF CONTENTS ================= */}
        <div className="resume-sheet page-break bg-white border border-neutral-300 rounded-3xl p-10 sm:p-12 shadow-md min-h-[1050px] flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className="border-b border-neutral-200 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-black tracking-tight">Executive Candidate Index</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Alphabetical roster of all candidates included in this compilation.</p>
              </div>
              <span className="text-xs font-bold text-neutral-600">{candidates.length} Profiles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-neutral-300 text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    <th className="py-2.5 px-3">Candidate Name</th>
                    <th className="py-2.5 px-3">Degree & Major</th>
                    <th className="py-2.5 px-3">Graduation</th>
                    {options.includeGpa && <th className="py-2.5 px-3">GPA</th>}
                    <th className="py-2.5 px-3">Primary Chapter Build</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {candidates.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-neutral-50">
                      <td className="py-2.5 px-3 font-bold text-black whitespace-nowrap">
                        {idx + 1}. {c.name}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-700">
                        {c.degree} in {c.major}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-600 whitespace-nowrap">
                        {c.gradDate}
                      </td>
                      {options.includeGpa && (
                        <td className="py-2.5 px-3 font-mono font-bold text-black whitespace-nowrap">
                          {c.gpa ? `${c.gpa.toFixed(2)}` : "—"}
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-neutral-700 truncate max-w-[200px]">
                        {c.mainProjectName || "Independent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-4 flex justify-between text-[11px] text-neutral-400 font-mono">
            <span>RSO USF Member Catalog</span>
            <span>Index Page</span>
          </div>
        </div>

        {/* ================= CANDIDATE DOSSIERS (1 PER PAGE) ================= */}
        {candidates.map((candidate, idx) => (
          <div
            key={candidate.id}
            className="resume-sheet page-break bg-white border border-neutral-300 rounded-3xl p-8 sm:p-10 shadow-md min-h-[1050px] flex flex-col justify-between"
          >
            {/* Header Identity Bar */}
            <div className="flex flex-col gap-4 border-b-2 border-black pb-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                    {candidate.name}
                  </h3>
                  <div className="text-sm font-bold text-neutral-700 mt-0.5">
                    {candidate.degree} in {candidate.major}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 mt-1.5 font-medium">
                    <span className="flex items-center gap-1 font-semibold text-black">
                      <Calendar size={13} className="text-neutral-500" />
                      Graduation: {candidate.gradDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail size={13} className="text-neutral-500" />
                      {candidate.email}
                    </span>
                    {options.includeGpa && candidate.gpa && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-black font-mono">
                          GPA: {candidate.gpa.toFixed(2)} / {candidate.gpaScale || 4.0}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-black text-white block w-fit ml-auto">
                    Candidate #{idx + 1}
                  </span>
                  {options.includeDirectResumeLinks && (
                    <a
                      href={candidate.resumePdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-black underline mt-2 block hover:text-neutral-600"
                    >
                      View Uploaded Resume PDF
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Candidate Body Dossier */}
            <div className="flex flex-col gap-5 py-4 grow">
              {/* Bio / Summary */}
              {candidate.bio && (
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    Candidate Summary
                  </h4>
                  <p className="text-xs text-neutral-800 leading-relaxed font-sans">
                    {candidate.bio}
                  </p>
                </div>
              )}

              {/* Technical Skills Inventory */}
              {candidate.skills && candidate.skills.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    Verified Technical Proficiencies ({candidate.skills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-neutral-100 border border-neutral-300 text-black"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Chapter Build Projects */}
              {options.includeProjects && candidate.projects && candidate.projects.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <FolderGit2 size={12} className="text-black" />
                    <span>Verified Chapter Projects ({candidate.projects.length})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {candidate.projects.slice(0, 4).map((p, pIdx) => (
                      <div key={pIdx} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                        <div className="font-bold text-black">{p.name}</div>
                        {p.role && <div className="text-[10px] font-semibold text-neutral-500 mb-1">{p.role}</div>}
                        <p className="text-[11px] text-neutral-700 leading-snug line-clamp-2 mt-1">
                          {p.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Work Experience */}
              {candidate.workExperiences && candidate.workExperiences.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Briefcase size={12} className="text-black" />
                    <span>Engineering & Industry Experience</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {candidate.workExperiences.slice(0, 2).map((w, wIdx) => (
                      <div key={wIdx} className="p-2.5 rounded-xl border border-neutral-200 bg-white text-xs">
                        <div className="font-bold text-black">{w.title}</div>
                        <div className="text-[11px] text-neutral-600 font-medium">
                          {w.name} • {w.startDate} {w.endDate ? `– ${w.endDate}` : "– Present"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Workshop Attendance */}
              {options.includeEvents && candidate.events && candidate.events.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-neutral-200">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    Chapter Technical Workshops Attended ({candidate.events.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.events.slice(0, 5).map((e, eIdx) => (
                      <span key={eIdx} className="px-2 py-0.5 rounded-lg text-[10.5px] font-medium bg-neutral-50 border border-neutral-200 text-neutral-800">
                        {e.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recruiter Evaluation Notes (Optional internal circulation) */}
              {options.includeRecruiterNotes && candidate.recruiterNotes && (
                <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    Internal Recruiter Notes ({options.sponsorName})
                  </span>
                  <p className="text-neutral-800 italic">{candidate.recruiterNotes}</p>
                </div>
              )}
            </div>

            {/* Footer with Portfolio Link */}
            <div className="border-t border-neutral-200 pt-3 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
              <span>RSO USF Student Chapter Dossier</span>
              <a
                href={candidate.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black font-bold underline flex items-center gap-1"
              >
                <span>Interactive Web Portfolio</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
