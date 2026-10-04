"use client";

import React from "react";
import { Student, getPrimaryEducation, getIeeeLeadershipRole } from "../../data/students";
import Avatar from "../common/Avatar";
import { Calendar, Award, User, AlertTriangle, ShieldCheck, FolderGit2 } from "lucide-react";

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
      {adminMode && student.flagged && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-xs text-red-400 flex items-start gap-2.5 shadow-inner">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold uppercase tracking-wider block text-[10px] mb-0.5 text-red-500">Profile Flagged / Reported</span>
            <span className="leading-relaxed font-medium">{student.flagReason || "No reason specified"}</span>
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
          <div className="text-sm font-extrabold text-amber-400 leading-snug whitespace-normal break-words mt-0.5">
            {primaryDegree} in {primaryMajor}
          </div>
          {minorEdu && (
            <div className="text-xs font-semibold text-zinc-400 leading-snug whitespace-normal break-words">
              {minorEdu.degreeType} in {minorEdu.major}
            </div>
          )}
        </div>
      </div>

      {/* IEEE Leadership Officer Badge & Primary Project Badge */}
      <div className="flex flex-col gap-2.5">
        {leadershipRole && (
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-zinc-900 border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs font-extrabold text-amber-300 flex items-center gap-2.5 shadow-sm animate-fade-in">
            <ShieldCheck size={16} className="text-amber-400 shrink-0" />
            <div>
              <span className="text-[9.5px] font-extrabold text-amber-500 uppercase tracking-wider block leading-none mb-0.5">IEEE UCF Chapter Leadership</span>
              <span className="leading-tight">{leadershipRole}</span>
            </div>
          </div>
        )}
        {student.mainProjectName && (
          <div className="bg-gradient-to-r from-cyan-500/15 via-cyan-500/10 to-zinc-900 border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs font-extrabold text-cyan-300 flex items-center gap-2.5 shadow-sm animate-fade-in">
            <FolderGit2 size={16} className="text-cyan-400 shrink-0" />
            <div>
              <span className="text-[9.5px] font-extrabold text-cyan-500 uppercase tracking-wider block leading-none mb-0.5">Primary IEEE Project Affiliation</span>
              <span className="leading-tight">{student.mainProjectName}</span>
            </div>
          </div>
        )}
      </div>

      {/* High-level status bar */}
      <div className="flex flex-wrap gap-2 text-xs w-full status-stack">
        <span className="bg-zinc-850 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full flex items-center justify-center gap-1.5 shadow-sm grow">
          <Calendar size={12} className="text-amber-500" />
          <span>Grad: {student.gradDate}</span>
        </span>
        {getPrimaryEducation(student)?.gpa && (
          <span className="bg-zinc-850 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full flex items-center justify-center gap-1.5 shadow-sm grow">
            <Award size={12} className="text-amber-500" />
            <span>GPA: {getPrimaryEducation(student)?.gpa} / {getPrimaryEducation(student)?.gpaScale || 4.0}</span>
          </span>
        )}
      </div>

      {/* Biography Card Component */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-850 p-5 shadow-sm backdrop-blur-sm flex flex-col bio-stretch">
        <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <User size={13} className="text-amber-500" />
          <span>Biography</span>
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          {student.bio}
        </p>
      </div>
    </div>
  );
}

