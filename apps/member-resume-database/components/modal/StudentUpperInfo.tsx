"use client";

import React from "react";
import { Student, getPrimaryEducation } from "../../data/students";
import Avatar from "../common/Avatar";
import { Calendar, Award, User, AlertTriangle } from "lucide-react";

interface StudentUpperInfoProps {
  student: Student;
  adminMode?: boolean;
}

export default function StudentUpperInfo({ student, adminMode }: StudentUpperInfoProps) {
  const primaryEdu = getPrimaryEducation(student);
  const primaryDegree = primaryEdu?.degreeType || student.degree || "Bachelor of Science";
  const primaryMajor = primaryEdu?.major || student.major || "Computer Science";

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

