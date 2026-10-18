"use client";

import React from "react";
import { Student, getPrimaryEducation } from "../../data/students";
import { Calendar, Award, Flag } from "lucide-react";
import Avatar from "../common/Avatar";
import StatusBadge from "../common/StatusBadge";
import TruncatedText from "../common/TruncatedText";
import SkillTag from "../common/SkillTag";
import Tooltip from "../common/Tooltip";

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
  adminMode: boolean;
  canFilter?: boolean;
  onToggleFlag?: (id: string) => void;
}

function StudentCard({
  student,
  onClick,
  adminMode,
  canFilter,
  onToggleFlag,
}: StudentCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(student);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View ${student.name}'s engineering profile and portfolio`}
      onClick={() => onClick(student)}
      onKeyDown={handleKeyDown}
      data-student-id={student.id}
      className={`relative group rounded-2xl bg-white border p-4 md:p-5 flex flex-col justify-between h-[195px] md:h-[295px] cursor-pointer transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
        adminMode && student.flagged
          ? "border-red-300 bg-red-50/20 hover:border-red-400"
          : "border-slate-200/90 hover:border-slate-300"
      }`}
    >
      {/* Flagged Indicator Icon at Top Right */}
      {student.flagged && (
        <div
          className="absolute top-3 right-3 md:top-4 md:right-4 text-red-600 bg-red-50 border border-red-200 p-1.5 rounded-lg shadow-2xs z-20"
          title={student.flagReason || "Flagged / Reported"}
        >
          <Flag size={12} className="fill-current" />
        </div>
      )}

      {/* Top Section */}
      <div className="flex flex-col gap-2 md:gap-3">
        <div className="flex items-start justify-between min-w-0">
          <div className="flex items-center gap-2.5 md:gap-3 min-w-0 grow">
            <Avatar name={student.name} size="sm" className="md:hidden" />
            <Avatar name={student.name} size="md" className="hidden md:flex" />
            <div className="min-w-0 grow flex flex-col">
              <h3 className="font-bold text-slate-900 text-sm md:text-base leading-tight group-hover:text-slate-700 transition-colors flex">
                <TruncatedText text={student.name} maxLength={26} align="left" />
              </h3>
              <div className="text-[11px] md:text-xs text-slate-600 font-medium leading-none md:leading-[1.1] mt-1 flex">
                <TruncatedText text={student.major} maxLength={28} align="left" />
              </div>
            </div>
          </div>
        </div>

        {/* Bio snippet - Desktop only */}
        <p className="hidden md:block text-slate-600 text-xs leading-relaxed mt-0.5">
          {student.bio.length > 105 ? student.bio.substring(0, 102) + "..." : student.bio}
        </p>
      </div>

      {/* Middle Section (Job Search Status Only) */}
      <div className="flex items-center">
        <StatusBadge status={student.status} />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2 md:gap-3 pt-2.5 md:pt-3 border-t border-slate-100 w-full">
        <div className="flex items-center justify-between text-slate-500 text-[11px] md:text-xs font-medium">
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-slate-400 md:hidden" />
            <Calendar size={13} className="text-slate-400 hidden md:block" />
            <span>Grad: {student.gradDate}</span>
          </div>
          {getPrimaryEducation(student)?.gpa && (
            <div className="flex items-center gap-1">
              <Award size={12} className="text-slate-400 md:hidden" />
              <Award size={13} className="text-slate-400 hidden md:block" />
              <span>GPA: {getPrimaryEducation(student)?.gpa}</span>
            </div>
          )}
        </div>

        {/* Skills Row & Action */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 overflow-visible">
            {student.skills.slice(0, 3).map((skill) => (
              <SkillTag
                key={skill}
                skill={skill}
                variant="card"
                maxCharLength={10}
                maxWidthClass="max-w-[70px]"
                clickable={canFilter ?? true}
              />
            ))}
          </div>

          {/* Flag / Report Button */}
          {onToggleFlag && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFlag(student.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 bg-slate-50 border border-slate-200 rounded-md text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer relative group/tooltip"
            >
              <Flag size={12} className="md:hidden" />
              <Flag size={13} className="hidden md:block" />
              <Tooltip content="Flag / Report Profile" groupClass="group-hover/tooltip:opacity-100" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(StudentCard);
