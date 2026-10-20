"use client";

import React from "react";
import { Student, getPrimaryEducation, getIeeeLeadershipRole } from "../../data/students";
import Avatar from "../common/Avatar";
import { Calendar, Award, User, AlertTriangle, ShieldCheck, Sparkles, CheckCircle2, Mail } from "lucide-react";

interface StudentUpperInfoProps {
  student: Student;
  adminMode?: boolean;
}

export default function StudentUpperInfo({ student, adminMode }: StudentUpperInfoProps) {
  const primaryEdu = getPrimaryEducation(student);
  const primaryDegree = primaryEdu?.degreeType || student.degree || "Bachelor of Science";
  const primaryMajor = primaryEdu?.major || student.major || "Computer Science";
  const leadershipRole = getIeeeLeadershipRole(student);

  const minorEdu = student.education?.find(
    (edu) =>
      edu !== primaryEdu &&
      !edu.degreeType.toLowerCase().includes("high school") &&
      (edu.degreeType.toLowerCase().includes("minor") || edu.description?.toLowerCase().includes("minor"))
  );

  return (
    <div className="flex flex-col gap-6 w-full min-w-0">
      {/* Moderation Flag Banner Alert */}
      {student.flagged && (
        <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-4 text-xs text-red-400 flex items-start gap-2.5 shadow-inner">
          <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-500" />
          <div className="min-w-0 grow">
            <span className="font-extrabold uppercase tracking-wider block text-[10px] mb-1 text-red-500">
              Profile Flagged / Reported
            </span>
            <p className="leading-relaxed font-semibold text-slate-200 text-xs">
              Reason: <span className="text-red-400 font-normal italic">&ldquo;{student.flagReason || "Under administrative review"}&rdquo;</span>
            </p>
          </div>
        </div>
      )}

      {/* Header info */}
      <div className="flex items-center gap-4 w-full min-w-0">
        <Avatar name={student.name} size="lg" className="shrink-0" />
        <div className="min-w-0 grow flex flex-col gap-0.5">
          <h2 className="text-xl font-black text-zinc-100 leading-tight whitespace-normal break-words">
            {student.name}
          </h2>
          <div className="text-sm font-bold text-amber-800 leading-snug whitespace-normal break-words mt-0.5">
            {primaryDegree} in {primaryMajor}
          </div>
          {minorEdu && (
            <div className="text-xs font-semibold text-slate-500 leading-snug whitespace-normal break-words">
              {minorEdu.degreeType} in {minorEdu.major}
            </div>
          )}
        </div>
      </div>

      {/* RSO Leadership Officer Badge & Primary Project Badge */}
      <div className="flex flex-col gap-2.5">
        {leadershipRole && (
          <div className="bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200/90 dark:border-amber-400/30 rounded-xl px-3.5 py-2.5 text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2.5 shadow-2xs">
            <ShieldCheck size={16} className="text-amber-700 dark:text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-amber-800/80 dark:text-amber-400/80 uppercase tracking-wider block leading-none mb-1">RSO UCF Chapter Leadership</span>
              <span className="leading-tight font-extrabold text-slate-900 dark:text-zinc-100">{leadershipRole}</span>
            </div>
          </div>
        )}
        {student.mainProjectName && (
          <div className="bg-amber-500/15 border border-amber-400/70 rounded-xl px-3.5 py-2.5 text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2.5 shadow-2xs ring-1 ring-amber-400/25">
            <Sparkles size={16} className="text-amber-500 shrink-0 fill-current" />
            <div>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block leading-none mb-1 flex items-center gap-1">
                Primary RSO Project Affiliation
              </span>
              <span className="leading-tight font-extrabold text-slate-900 dark:text-amber-100">{student.mainProjectName}</span>
            </div>
          </div>
        )}
      </div>

      {/* High-level status bar */}
      <div className="flex flex-wrap gap-2 text-xs w-full status-stack">
        <span className="bg-zinc-850 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full flex items-center justify-center gap-1.5 shadow-sm grow">
          <Calendar size={12} className="text-slate-400" />
          <span>Grad: {student.gradDate}</span>
        </span>
        <span className="bg-zinc-850 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full flex items-center justify-center gap-1.5 shadow-sm grow">
          <Mail size={12} className="text-amber-500" />
          <span className="truncate">{student.email}</span>
        </span>
      </div>

      {/* Verified Chapter Activity & Telemetry Summary Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-850 p-4 md:p-5 shadow-sm backdrop-blur-sm flex flex-col gap-3">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-amber-500" />
            <span>Verified Chapter Activity</span>
          </span>
          <span className="text-amber-400 font-extrabold text-[11px]">
            {student.points || 0} Total Points
          </span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Events Attended</span>
            <span className="text-base font-extrabold text-zinc-100 mt-0.5">
              {student.events?.length || 0}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Workshops & GMs</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 flex flex-col">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Chapter Projects</span>
            <span className="text-base font-extrabold text-zinc-100 mt-0.5">
              {student.projects?.length || 0}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Engineering Teams</span>
          </div>
        </div>

        {student.pointBreakdown?.details && student.pointBreakdown.details.length > 0 && (
          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-1.5">
            <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wider">Activity Breakdown</span>
            <div className="flex flex-col gap-1 max-h-24 overflow-y-auto pr-1">
              {student.pointBreakdown.details.slice(0, 3).map((detail, idx) => (
                <div key={idx} className="text-[11px] text-zinc-300 flex items-start gap-1.5">
                  <span className="text-amber-500 leading-none mt-0.5">•</span>
                  <span className="leading-tight">{detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

