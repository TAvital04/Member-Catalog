"use client";

import React from "react";
import { Student, getIeeeLeadershipRole } from "@/data/students";
import { Globe, AlertTriangle, ShieldCheck, Sparkles, Calendar, Mail, FileText, ExternalLink } from "lucide-react";
import { getSafeUrl } from "@/shared";

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

import Link from "next/link";
import { useRouter } from "next/navigation";
import { findMatchingIeeeProject, isLeadSkill } from "@/lib/rsoAffiliation";

interface StudentLowerInfoProps {
  student: Student;
  adminMode?: boolean;
  onResolve?: (student: Student) => void;
  onSelectProject?: (projectSlugOrId: string) => void;
  onClose?: () => void;
  onSelectTab?: (tab: "about" | "projects" | "events" | "contact" | "experience" | "skills") => void;
}

export default function StudentLowerInfo({
  student,
  adminMode,
  onResolve,
  onSelectProject,
  onClose,
  onSelectTab,
}: StudentLowerInfoProps) {
  const router = useRouter();
  const leadershipRole = getIeeeLeadershipRole(student);
  const matchedMainProject = student.mainProjectName
    ? findMatchingIeeeProject(
        {
          name: student.mainProjectName,
          description: "",
          startDate: "",
          current: true,
          projectLinks: [],
        },
        student
      )
    : undefined;

  const mainProjectUrl = matchedMainProject
    ? `/projects?project=${matchedMainProject.slug}`
    : student.mainProjectName
    ? `/projects?search=${encodeURIComponent(student.mainProjectName)}`
    : null;

  const resumeUrl =
    student.resumeLink ||
    student.links?.find((l) => /resume|cv/i.test(l.name))?.text ||
    `https://drive.google.com/file/d/${student.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-resume/view`;

  return (
    <div className="flex flex-col justify-between gap-4 w-full h-full min-h-full">
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 1055px) {
          .links-stack {
            flex-direction: column !important;
            align-items: stretch !important;
          }
        }
      `}} />

      {/* RSO Leadership Officer Badge & Primary Project Badge */}
      {(leadershipRole || student.mainProjectName) && (
        <div className="flex flex-col gap-2.5 shrink-0">
          {leadershipRole && (
            <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs font-bold flex items-center gap-2.5 shadow-2xs">
              <ShieldCheck size={16} className="text-slate-400 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-none mb-1">IEEE UCF Chapter Leadership</span>
                <span className="leading-tight font-extrabold text-slate-900">{leadershipRole}</span>
              </div>
            </div>
          )}
          {student.mainProjectName && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                if (onSelectProject) {
                  onSelectProject(matchedMainProject ? matchedMainProject.slug : student.mainProjectName!);
                } else if (mainProjectUrl) {
                  onClose?.();
                  router.push(mainProjectUrl);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (onSelectProject) {
                    onSelectProject(matchedMainProject ? matchedMainProject.slug : student.mainProjectName!);
                  } else if (mainProjectUrl) {
                    onClose?.();
                    router.push(mainProjectUrl);
                  }
                }
              }}
              aria-label={`View project modal for ${student.mainProjectName}`}
              className="bg-white hover:border-slate-300 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs font-bold flex items-center justify-between gap-2.5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer active:scale-95 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles size={16} className="text-slate-400 group-hover:text-amber-800 transition-colors shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block leading-none mb-1 flex items-center gap-1">
                    Primary IEEE Project Affiliation
                  </span>
                  <span className="leading-tight font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors truncate block">
                    {student.mainProjectName}
                  </span>
                </div>
              </div>
              <ExternalLink size={12} className="text-slate-400 group-hover:text-amber-800 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
            </div>
          )}
        </div>
      )}

      {/* High-level status bar */}
      <div className="flex flex-wrap gap-2 text-xs w-full status-stack shrink-0">
        <span className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full flex items-center justify-center gap-1.5 shadow-2xs font-semibold grow">
          <Calendar size={12} className="text-slate-400 shrink-0" />
          <span>Grad: {student.gradDate}</span>
        </span>
        <span className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full flex items-center justify-center gap-1.5 shadow-2xs font-semibold grow min-w-0">
          <Mail size={12} className="text-slate-400 shrink-0" />
          <span className="truncate">{student.email}</span>
        </span>
      </div>

      {/* Candidate Biography & Skills Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 md:p-5 shadow-2xs flex flex-col gap-3 shrink-0">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            About
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {student.bio || "No candidate biography provided yet."}
          </p>
        </div>

        {student.skills && student.skills.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <span>Skills ({student.skills.length})</span>
              </span>
              {onSelectTab && (
                <button
                  type="button"
                  onClick={() => onSelectTab("skills")}
                  className="text-[10px] font-semibold text-slate-500 hover:text-amber-800 transition-colors cursor-pointer"
                >
                  See more →
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {student.skills.slice(0, 6).map((skill, idx) => {
                const isLead = isLeadSkill(skill, student);
                return (
                  <Link
                    key={idx}
                    href={`/?skills=${encodeURIComponent(skill)}`}
                    onClick={() => onClose?.()}
                    className={`px-2 py-0.5 rounded-lg text-[10.5px] font-semibold transition-all active:scale-95 cursor-pointer shadow-2xs ${
                      isLead
                        ? "bg-amber-50/40 hover:bg-amber-100/60 border-2 border-amber-500 text-slate-900 font-bold"
                        : "bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-slate-900"
                    }`}
                    title={isLead ? `Project / Workshop Lead Skill: ${skill} (Click to filter)` : `Filter candidates with skill: ${skill}`}
                  >
                    <span>{skill}</span>
                  </Link>
                );
              })}
              {student.skills.length > 6 && (
                <button
                  type="button"
                  onClick={() => onSelectTab?.("skills")}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-[10px] font-semibold text-slate-600 hover:text-amber-800 transition-all cursor-pointer active:scale-95 shadow-2xs"
                  title="View all skills in the Skills tab"
                >
                  +{student.skills.length - 6} more
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* External Profile Links & Actions */}
      <div className="flex flex-col gap-3 shrink-0">
        {student.links && student.links.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 w-full links-stack">
            {student.links.map((link, idx) => {
              const lowerName = link.name.toLowerCase();
              const isGithub = lowerName.includes("github");
              const isLinkedin = lowerName.includes("linkedin");

              const safeLinkUrl = getSafeUrl(link.text) || "#";
              return (
                <a
                  key={idx}
                  href={safeLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:border-slate-300 border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer grow"
                >
                  {isGithub && <Github size={13} className="text-slate-700" />}
                  {isLinkedin && <Linkedin size={13} className="text-sky-600" />}
                  {!isGithub && !isLinkedin && <Globe size={13} className="text-amber-600" />}
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>
        )}

        {/* View Resume PDF Button */}
        <a
          href={getSafeUrl(resumeUrl) || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm active:scale-98 cursor-pointer group/resume"
        >
          <FileText size={14} className="text-slate-300 group-hover/resume:text-white transition-colors" />
          <span>View Resume PDF</span>
          <ExternalLink size={12} className="text-slate-400 group-hover/resume:text-slate-200 ml-auto transition-colors" />
        </a>

        {student.flagged && (
          <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4 shadow-2xs">
            <h3 className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle size={13} className="text-red-600" />
              <span>{adminMode ? "Admin Moderation" : "Moderation Warning"}</span>
            </h3>
            <div className="flex flex-col gap-2.5">
              <div>
                <span className="font-extrabold uppercase tracking-wider block text-[10px] text-red-600">
                  {student.duplicateGroup
                    ? "Profile Duplicate Flagged"
                    : student.flagReason && /ai|slop|generated|chatgpt/i.test(student.flagReason)
                    ? "Profile AI Slop Flagged"
                    : "Profile Flagged / Reported"}
                </span>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  <span className="font-bold text-slate-800">Reason:</span>{" "}
                  <span className="italic text-red-700/90">&ldquo;{student.flagReason || (student.duplicateGroup ? `Duplicate group: ${student.duplicateGroup}` : "Under administrative review")}&rdquo;</span>
                </p>
              </div>
              {onResolve && adminMode && (
                <button
                  type="button"
                  onClick={() => onResolve(student)}
                  className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Resolve Issue</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
