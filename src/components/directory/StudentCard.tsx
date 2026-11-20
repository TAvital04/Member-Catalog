"use client";

import React from "react";
import { Student } from "@/data/students";
import { Calendar, Bookmark, BookmarkCheck } from "lucide-react";
import Avatar from "../common/Avatar";
import { CatalogCard } from "@/components/ui";

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
  adminMode?: boolean;
  canFilter?: boolean;
  isRecruiter?: boolean;
  isShortlisted?: boolean;
  onToggleShortlist?: (student: Student) => void;
}

function StudentCard({
  student,
  onClick,
  isRecruiter,
  isShortlisted,
  onToggleShortlist,
}: StudentCardProps) {
  return (
    <CatalogCard
      avatar={
        <>
          <Avatar name={student.name} size="sm" className="sm:hidden" />
          <Avatar name={student.name} size="md" className="hidden sm:flex" />
        </>
      }
      title={student.name}
      subtitle={student.major}
      badgeRight={
        isRecruiter && onToggleShortlist ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleShortlist(student);
            }}
            aria-label={isShortlisted ? `Remove ${student.name} from shortlist` : `Save ${student.name} to shortlist`}
            title={isShortlisted ? "Remove from shortlist" : "Save candidate to shortlist"}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isShortlisted
                ? "bg-black text-white border-black shadow-2xs"
                : "bg-white text-neutral-400 border-neutral-200 hover:text-black hover:border-black"
            }`}
          >
            {isShortlisted ? (
              <BookmarkCheck size={14} className="stroke-[2.5]" />
            ) : (
              <Bookmark size={14} />
            )}
          </button>
        ) : undefined
      }
      description={student.bio}
      emptyDescription="No bio provided."
      footerIcon={<Calendar size={13} className="text-neutral-400" />}
      footerText={`Grad: ${student.gradDate}`}
      onClick={() => onClick(student)}
      ariaLabel={`View ${student.name}'s engineering profile and portfolio`}
      className="data-student"
    />
  );
}

export default React.memo(StudentCard);
