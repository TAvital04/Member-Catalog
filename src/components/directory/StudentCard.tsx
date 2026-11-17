"use client";

import React from "react";
import { Student } from "@/data/students";
import { Calendar } from "lucide-react";
import Avatar from "../common/Avatar";
import TruncatedText from "../common/TruncatedText";
import { Card } from "@/components/ui";

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
    <Card
      as="button"
      variant="interactive"
      padding="none"
      onClick={() => onClick(student)}
      onKeyDown={handleKeyDown}
      data-student-id={student.id}
      className="relative p-4 md:p-5 flex flex-col justify-between h-[185px] md:h-[215px] w-full text-left cursor-pointer"
      aria-label={`View ${student.name}'s engineering profile and portfolio`}
    >
      {/* Top Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between min-w-0">
          <div className="flex items-center gap-2.5 md:gap-3 min-w-0 grow">
            <Avatar name={student.name} size="sm" className="md:hidden" />
            <Avatar name={student.name} size="md" className="hidden md:flex" />
            <div className="min-w-0 grow flex flex-col">
              <h3 className="font-bold text-sm md:text-base text-black leading-tight flex">
                <TruncatedText text={student.name} maxLength={26} align="left" />
              </h3>
              <div className="text-[11px] md:text-xs text-neutral-600 font-medium leading-none md:leading-[1.1] mt-1 flex">
                <TruncatedText text={student.major} maxLength={28} align="left" />
              </div>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        {student.bio ? (
          <p className="text-xs text-neutral-600 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {student.bio}
          </p>
        ) : (
          <p className="text-xs text-neutral-400 italic">
            No bio provided.
          </p>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between pt-2.5 md:pt-3 border-t border-neutral-200 w-full text-neutral-500 text-[11px] md:text-xs font-medium">
        <div className="flex items-center gap-1">
          <Calendar size={12} className="text-neutral-400 md:hidden" />
          <Calendar size={13} className="text-neutral-400 hidden md:block" />
          <span>Grad: {student.gradDate}</span>
        </div>
      </div>
    </Card>
  );
}

export default React.memo(StudentCard);
