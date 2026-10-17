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
      className={`relative group flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded-xl bg-white hover:bg-slate-50 transition-all border shadow-2xs cursor-pointer gap-4 ${
        adminMode && student.flagged ? "border-red-300 bg-red-50/20 hover:border-red-400" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Left: Avatar & Personal Info */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <Avatar name={student.name} size="sm" />
        <div className="flex flex-col min-w-0">
          <h4 className="font-bold text-slate-900 text-sm group-hover:text-slate-700 transition-colors flex">
            <TruncatedText text={student.name} maxLength={28} align="left" />
          </h4>
          <div className="text-xs text-slate-600 font-medium flex">
            <TruncatedText text={student.major} maxLength={30} align="left" />
          </div>
        </div>
      </div>

      {/* Middle: Degree, Grad, GPA */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 text-xs text-slate-600 grow">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Degree</span>
          <div className="text-slate-800 flex font-medium">
            <TruncatedText text={student.degree} maxLength={22} align="left" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Graduation</span>
          <span className="flex items-center gap-1 text-slate-800 font-medium">
            <Calendar size={11} className="text-slate-400" />
            {student.gradDate}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GPA</span>
          <span className="text-slate-800 font-bold">{getPrimaryEducation(student)?.gpa || "N/A"}</span>
        </div>
      </div>

      {/* Right: Status and Skills */}
      <div className="flex items-center gap-4 min-w-[280px] justify-between md:justify-end">
        {/* Status Badge */}
        <div className="flex flex-col items-start md:items-end">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 md:hidden">Status</span>
          <StatusBadge status={student.status} />
        </div>

        {/* Skills */}
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
            <span className="text-[9px] text-slate-500 font-semibold">
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
                className="p-1 rounded bg-slate-100 border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600 transition-all cursor-pointer relative group/tooltip"
              >
                <Flag size={11} />
                <Tooltip content="Flag / Report Profile" groupClass="group-hover/tooltip:opacity-100" />
              </button>
            )}
            {/* Delete Button in Admin Mode */}
            {adminMode && onDelete && (
              <button
                onClick={() => onDelete(student.id)}
                className="p-1 rounded bg-slate-100 border border-slate-200 hover:bg-red-50 hover:border-red-300 text-slate-500 hover:text-red-600 transition-all cursor-pointer relative group/tooltip"
              >
                <Trash2 size={11} />
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50 leading-none font-sans font-semibold">
                  Delete Profile
                </span>
              </button>
            )}
            <div className="flex items-center justify-center p-1 bg-amber-50 border border-amber-200 rounded text-amber-700">
              <Eye size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(StudentRow);
