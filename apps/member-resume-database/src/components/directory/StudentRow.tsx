"use client";

import React from "react";
import { Student, getPrimaryEducation } from "../../data/students";
import { Calendar, Trash2, Flag, Eye } from "lucide-react";
import Avatar from "../common/Avatar";
import StatusBadge from "../common/StatusBadge";
import Tooltip from "../common/Tooltip";
import TruncatedText from "../common/TruncatedText";
import SkillTag from "../common/SkillTag";

interface StudentRowProps {
  student: Student;
  onClick: (student: Student) => void;
  adminMode: boolean;
  onDelete?: (id: string) => void;
  onToggleFlag?: (id: string) => void;
}

function StudentRow({
  student,
  onClick,
  adminMode,
  onDelete,
  onToggleFlag,
}: StudentRowProps) {
  return (
    <div
      onClick={() => onClick(student)}
      data-student-id={student.id}
      className={`relative group hover:z-30 flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl glass-panel hover:bg-zinc-900/60 transition-all border border-zinc-800/85 cursor-pointer gap-4 ${
        adminMode && student.flagged ? "border-red-500/30 bg-red-950/5 hover:border-red-500/50" : ""
      }`}
    >
      {/* Left: Avatar & Personal Info */}
      <div className="flex items-center gap-3.5 min-w-[240px]">
        {/* Small badge */}
        <Avatar name={student.name} size="sm" />
        <div className="flex flex-col min-w-0">
          <h4 className="font-bold text-zinc-200 text-sm group-hover:text-amber-400 transition-colors flex">
            <TruncatedText text={student.name} maxLength={28} align="left" />
          </h4>
          <div className="text-xs text-zinc-500 flex">
            <TruncatedText text={student.major} maxLength={30} align="left" />
          </div>
        </div>
      </div>

      {/* Middle: Degree, Grad, GPA */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 text-xs text-zinc-400 grow">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">Degree</span>
          <div className="text-zinc-300 flex">
            <TruncatedText text={student.degree} maxLength={22} align="left" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">Graduation</span>
          <span className="flex items-center gap-1 text-zinc-300">
            <Calendar size={11} className="text-zinc-500" />
            {student.gradDate}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">GPA</span>
          <span className="text-zinc-300 font-semibold">{getPrimaryEducation(student)?.gpa || "N/A"}</span>
        </div>
      </div>

      {/* Right: Status and Skills */}
      <div className="flex items-center gap-4 min-w-[280px] justify-between md:justify-end">
        {/* Status Badge */}
        <div className="flex flex-col items-start md:items-end">
          <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider mb-1 md:hidden">Status</span>
          <StatusBadge status={student.status} />
        </div>

        {/* Skills (Truncated to fit single row) */}
        <div className="hidden lg:flex items-center gap-1 max-w-[140px] overflow-visible">
          {student.skills.slice(0, 2).map((skill) => (
            <SkillTag
              key={skill}
              skill={skill}
              variant="row"
              maxCharLength={8}
              maxWidthClass="max-w-[60px]"
            />
          ))}
          {student.skills.length > 2 && (
            <span className="text-[9px] text-zinc-500 font-medium">
              +{student.skills.length - 2}
            </span>
          )}
        </div>

        {/* Action column */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
            {/* Flag Profile Button */}
            {onToggleFlag && (
              <button
                onClick={() => onToggleFlag(student.id)}
                className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-red-400 transition-all cursor-pointer relative group/tooltip"
              >
                <Flag size={11} />
                <Tooltip content="Flag / Report Profile" groupClass="group-hover/tooltip:opacity-100" />
              </button>
            )}
            {/* Delete Button in Admin Mode */}
            {adminMode && onDelete && (
              <button
                onClick={() => onDelete(student.id)}
                className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-red-500/10 hover:border-red-900/40 text-zinc-500 hover:text-red-400 transition-all cursor-pointer relative group/tooltip"
              >
                <Trash2 size={11} />
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity bg-red-950 border border-red-900/40 text-red-400 text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50 leading-none font-sans font-semibold">
                  Delete Profile
                </span>
              </button>
            )}
            <div className="flex items-center justify-center p-1 bg-zinc-900 border border-zinc-800 rounded text-amber-400">
              <Eye size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(StudentRow);
