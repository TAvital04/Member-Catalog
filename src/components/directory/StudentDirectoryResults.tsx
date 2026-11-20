import React from "react";
import { Compass } from "lucide-react";
import { Student } from "@/data/students";
import StudentCard from "./StudentCard";
import StudentRow from "./StudentRow";
import StudentCardSkeleton from "./StudentCardSkeleton";
import EmptyState from "@/components/common/EmptyState";

interface StudentDirectoryResultsProps {
  isLoading: boolean;
  filteredStudents: Student[];
  viewMode: "grid" | "list";
  adminMode: boolean;
  canFilter?: boolean;
  onSelectStudent: (student: Student | null) => void;
  onDeleteStudent?: (id: string) => void;
  onResetAllFilters: () => void;
}

export default function StudentDirectoryResults({
  isLoading,
  filteredStudents,
  viewMode,
  adminMode,
  canFilter,
  onSelectStudent,
  onDeleteStudent,
  onResetAllFilters,
}: StudentDirectoryResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <StudentCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (filteredStudents.length > 0) {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={onSelectStudent}
              adminMode={adminMode}
              canFilter={canFilter}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {filteredStudents.map((student) => (
          <StudentRow
            key={student.id}
            student={student}
            onClick={onSelectStudent}
            adminMode={adminMode}
            canFilter={canFilter}
            onDelete={onDeleteStudent}
          />
        ))}
      </div>
    );
  }

  return (
    <EmptyState
      icon={<Compass size={36} className="stroke-1" />}
      headline="No resumes match your criteria"
      subtext="Try loosening your active filters or adjusting the search query."
      actionLabel="Reset All Filters"
      onAction={onResetAllFilters}
    />
  );
}
