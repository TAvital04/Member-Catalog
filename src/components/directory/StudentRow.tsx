"use client";

import React from "react";
import { Student } from "@/data/students";
import { Calendar, Trash2, Eye } from "lucide-react";
import Avatar from "../common/Avatar";
import TruncatedText from "../common/TruncatedText";
import Tooltip from "../common/Tooltip";
import { CARD_TITLE_HOVER } from "@/lib/cardStyles";

interface StudentRowProps {
  student: Student;
  onClick: (student: Student) => void;
  adminMode: boolean;
  canFilter?: boolean;
  onDelete?: (id: string) => void;
  onToggleFlag?: (id: string) => void;
}

function StudentRow({
  student,
  onClick,
  adminMode,
  onDelete,
}: StudentRowProps) {
  return (
    <div
      onClick={() => onClick(student)}
      data-student-id={student.id}
      className="relative group flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded-xl bg-white hover:bg-slate-50 transition-all border border-slate-200 hover:border-slate-300 shadow-2xs cursor-pointer gap-4"
    >
      {/* Left: Avatar & Personal Info */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <Avatar name={student.name} size="sm" />
        <div className="flex flex-col min-w-0">
          <h4 className={`font-bold text-sm flex ${CARD_TITLE_HOVER}`}>
            <TruncatedText text={student.name} maxLength={28} align="left" />
          </h4>
          <div className="text-xs text-slate-600 font-medium flex">
            <TruncatedText text={student.major} maxLength={30} align="left" />
          </div>
        </div>
      </div>

      {/* Middle: Degree, Grad, Dashboard metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-xs text-slate-600 grow">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Graduation</span>
          <span className="flex items-center gap-1 text-slate-800 font-medium">
            <Calendar size={11} className="text-slate-400" />
            {student.gradDate}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Events Attended</span>
          <span className="text-slate-800 font-semibold">{student.events?.length || 0} Events</span>
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Projects</span>
          <span className="text-slate-800 font-semibold">{student.projects?.length || 0} Projects</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 min-w-[100px] justify-end">
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
            {/* Delete Button in Admin Mode */}
            {adminMode && onDelete && (
              <button
                onClick={() => onDelete(student.id)}
                aria-label="Delete Profile"
                className="p-1 rounded bg-slate-100 border border-slate-200 hover:bg-red-50 hover:border-red-300 text-slate-500 hover:text-red-600 transition-all cursor-pointer"
              >
                <Trash2 size={11} />
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
