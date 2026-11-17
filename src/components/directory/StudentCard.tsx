"use client";

import React from "react";
import { Student } from "@/data/students";
import { Calendar } from "lucide-react";
import Avatar from "../common/Avatar";
import { CatalogCard } from "@/components/ui";

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
