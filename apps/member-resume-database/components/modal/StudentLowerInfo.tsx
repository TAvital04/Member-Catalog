"use client";

import React from "react";
import { Student } from "../../data/students";
import { Globe, FileText, AlertTriangle, ExternalLink } from "lucide-react";

// Custom SVG brand icons since newer lucide-react versions have deprecated them
const Github = ({ size = 18, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 18, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface StudentLowerInfoProps {
  student: Student;
  adminMode?: boolean;
  onResolve?: (student: Student) => void;
}

export default function StudentLowerInfo({
  student,
  adminMode,
  onResolve,
}: StudentLowerInfoProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 1055px) {
          .links-stack {
            flex-direction: column !important;
            align-items: stretch !important;
          }
        }
      `}} />
      <div className="flex flex-wrap items-center gap-2 w-full links-stack">
        {student.links.map((link, idx) => {
          const lowerName = link.name.toLowerCase();
          const isGithub = lowerName.includes("github");
          const isLinkedin = lowerName.includes("linkedin");

          return (
            <a
              key={idx}
              href={link.text}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-850 border border-zinc-800 text-xs text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 hover:bg-zinc-900 transition-all shadow grow"
            >
              {isGithub && <Github size={13} />}
              {isLinkedin && <Linkedin size={13} />}
              {!isGithub && !isLinkedin && <Globe size={13} />}
              <span>{link.name}</span>
            </a>
          );
        })}
      </div>

      {/* PDF Resume Link Download */}
      {student.resumeLink && (
        <a
          href={student.resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-black/30 transition-all"
        >
          <FileText size={15} />
          <span>View Official Resume</span>
          <ExternalLink size={13} className="ml-0.5 opacity-80" />
        </a>
      )}

      {student.flagged && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-850 p-5 shadow-sm backdrop-blur-sm">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertTriangle size={13} className="text-red-500" />
            <span>{adminMode ? "Admin Moderation" : "Moderation Warning"}</span>
          </h3>
          <div className="flex flex-col gap-3">
            <div>
              <span className="font-extrabold uppercase tracking-wider block text-[10px] text-red-500">
                {student.duplicateGroup
                  ? "Profile Duplicate Flagged"
                  : student.flagReason && /ai|slop|generated|chatgpt/i.test(student.flagReason)
                  ? "Profile AI Slop Flagged"
                  : "Profile Flagged / Reported"}
              </span>
              {!student.duplicateGroup && (
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed italic">
                  Reason: {student.flagReason || "No reason specified"}
                </p>
              )}
            </div>
            {onResolve && adminMode && (
              <button
                type="button"
                onClick={() => onResolve(student)}
                className="w-full py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Resolve Issue</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
