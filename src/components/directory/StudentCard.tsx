"use client";

import React from "react";
import { Student } from "@/data/students";
import { Calendar } from "lucide-react";
import Avatar from "../common/Avatar";
import TruncatedText from "../common/TruncatedText";
import { getCardClasses, CARD_TITLE_HOVER } from "@/lib/cardStyles";

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
  adminMode?: boolean;
  canFilter?: boolean;
  onToggleFlag?: (id: string) => void;
}

function StudentCard({
  student,
  onClick,
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
        className: "relative p-4 md:p-5 flex flex-col justify-between h-[185px] md:h-[215px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
      })}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between min-w-0">
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
      </div>
    </div>
  );
}

export default React.memo(StudentCard);
