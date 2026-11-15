"use client";

import React from "react";
import { Student, getPrimaryEducation } from "@/data/students";
import Avatar from "../common/Avatar";

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
      {/* Header info */}
      <div className="flex items-center gap-4 w-full min-w-0">
        <Avatar name={student.name} size="lg" className="shrink-0" />
        <div className="min-w-0 grow flex flex-col gap-0.5">
          <h2 className="text-xl font-black text-slate-900 leading-tight whitespace-normal break-words">
            {student.name}
          </h2>
          <div className="text-sm font-semibold text-slate-600 leading-snug whitespace-normal break-words mt-0.5">
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
