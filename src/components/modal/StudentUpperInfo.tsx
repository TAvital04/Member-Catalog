"use client";

import React from "react";
import { Student, getPrimaryEducation } from "../../data/students";
import Avatar from "../common/Avatar";
import { AlertTriangle } from "lucide-react";

interface StudentUpperInfoProps {
  student: Student;
  adminMode?: boolean;
}

export default function StudentUpperInfo({ student }: StudentUpperInfoProps) {
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
    <div className="flex flex-col gap-4 w-full min-w-0">
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
          <div className="text-sm font-semibold text-zinc-400 leading-snug whitespace-normal break-words mt-0.5">
            {primaryDegree} in {primaryMajor}
          </div>
          {minorEdu && (
            <div className="text-xs font-semibold text-slate-500 leading-snug whitespace-normal break-words">
              {minorEdu.degreeType} in {minorEdu.major}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
