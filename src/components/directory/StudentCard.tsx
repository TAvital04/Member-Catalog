"use client";

import React from "react";
import { Student } from "@/data/students";
import { Calendar, Flag } from "lucide-react";
import Avatar from "../common/Avatar";
import TruncatedText from "../common/TruncatedText";
import Tooltip from "../common/Tooltip";
import { getCardClasses, CARD_TITLE_HOVER } from "@/lib/cardStyles";

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
      className={getCardClasses({
        flagged: student.flagged,
        className: "relative p-4 md:p-5 flex flex-col justify-between h-[185px] md:h-[215px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
      })}
    >
      {/* Flagged Indicator at Top Right */}
      {student.flagged && (
        <div
          className="absolute top-3 right-3 md:top-4 md:right-4 text-red-600 bg-red-50 border border-red-200 p-1.5 rounded-lg shadow-2xs z-20 flex items-center justify-center"
          title={`Flagged: ${student.flagReason || "Under review"}`}
        >
          <Flag size={12} className="fill-current text-red-500" />
        </div>
      )}

      {/* Top Section */}
      <div className="flex flex-col gap-2.5">
        <div className={`flex items-start justify-between min-w-0 ${student.flagged ? "pr-8 md:pr-10" : ""}`}>
          <div className="flex items-center gap-2.5 md:gap-3 min-w-0 grow">
            <Avatar name={student.name} size="sm" className="md:hidden" />
            <Avatar name={student.name} size="md" className="hidden md:flex" />
            <div className="min-w-0 grow flex flex-col">
              <h3 className={`font-bold text-sm md:text-base leading-tight flex ${CARD_TITLE_HOVER}`}>
                <TruncatedText text={student.name} maxLength={26} align="left" />
              </h3>
              <div className="text-[11px] md:text-xs text-slate-600 dark:text-zinc-400 font-medium leading-none md:leading-[1.1] mt-1 flex">
                <TruncatedText text={student.major} maxLength={28} align="left" />
              </div>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        {student.bio ? (
          <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {student.bio}
          </p>
        ) : (
          <p className="text-xs text-slate-400 dark:text-zinc-500 italic">
            No bio provided.
          </p>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between pt-2.5 md:pt-3 border-t border-slate-100 dark:border-zinc-800 w-full text-slate-500 dark:text-zinc-400 text-[11px] md:text-xs font-medium">
        <div className="flex items-center gap-1">
          <Calendar size={12} className="text-slate-400 md:hidden" />
          <Calendar size={13} className="text-slate-400 hidden md:block" />
          <span>Grad: {student.gradDate}</span>
        </div>

        {/* Flag / Report Button */}
        {onToggleFlag && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFlag(student.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-md text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer relative group/tooltip"
          >
            <Flag size={12} className="md:hidden" />
            <Flag size={13} className="hidden md:block" />
            <Tooltip content="Flag / Report Profile" groupClass="group-hover/tooltip:opacity-100" />
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(StudentCard);
