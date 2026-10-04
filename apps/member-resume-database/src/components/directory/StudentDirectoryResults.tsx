import React from "react";
import { Compass } from "lucide-react";
import { Student } from "../../data/students";
import StudentCard from "./StudentCard";
import StudentRow from "./StudentRow";
import StudentCardSkeleton from "./StudentCardSkeleton";

interface StudentDirectoryResultsProps {
  isLoading: boolean;
  filteredStudents: Student[];
  viewMode: "grid" | "list";
  adminMode: boolean;
  onSelectStudent: (student: Student | null) => void;
  onDeleteStudent: (id: string) => void;
  onToggleFlagStudent: (id: string) => void;
  onResetAllFilters: () => void;
}

export default function StudentDirectoryResults({
  isLoading,
  filteredStudents,
  viewMode,
  adminMode,
  onSelectStudent,
  onDeleteStudent,
  onToggleFlagStudent,
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
              onToggleFlag={onToggleFlagStudent}
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
            onDelete={onDeleteStudent}
            onToggleFlag={onToggleFlagStudent}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-3xl p-8 bg-zinc-955/40">
      <Compass size={40} className="text-zinc-600 mb-4 stroke-1 animate-pulse" />
      <h3 className="font-bold text-zinc-300 text-sm mb-1">No resumes match your criteria</h3>
      <p className="text-zinc-500 text-xs text-center max-w-sm mb-4">
        Try loosening your active filters, adjusting the search query, or toggling Admin Edit Mode to check flagged maintenance entries.
      </p>
      <button
        type="button"
        onClick={onResetAllFilters}
        className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 text-xs font-bold rounded-xl transition-all cursor-pointer"
      >
        Reset All Filters
      </button>
    </div>
  );
}
