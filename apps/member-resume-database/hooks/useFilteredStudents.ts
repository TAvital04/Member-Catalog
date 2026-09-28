import { useMemo } from "react";
import { Student, getStudentBadgeLabels, getPrimaryEducation } from "../data/students";
import { getGradValue } from "../lib/gradDate";

interface UseFilteredStudentsProps {
  students: Student[];
  searchQuery: string;
  selectedMajors: string[];
  selectedSkills: string[];
  selectedGradDates: string[];
  selectedBadges: string[];
  skillFilterMode: "AND" | "OR";
  adminMode: boolean;
  adminFilterFlagged: boolean | null;
  sortBy: "name" | "gradDate" | "gpa";
}

export function useFilteredStudents({
  students,
  searchQuery,
  selectedMajors,
  selectedSkills,
  selectedGradDates,
  selectedBadges,
  skillFilterMode,
  adminMode,
  adminFilterFlagged,
  sortBy,
}: UseFilteredStudentsProps) {
  // Memoize unique metadata for filter selection options
  const { availableMajors, availableSkills, availableGradDates } = useMemo(() => {
    const majors = new Set<string>();
    const skills = new Set<string>();
    const gradDates = new Set<string>();

    students.forEach((s) => {
      majors.add(s.major);
      s.skills.forEach((sk) => skills.add(sk));
      gradDates.add(s.gradDate);
    });

    return {
      availableMajors: Array.from(majors).sort(),
      availableSkills: Array.from(skills).sort(),
      availableGradDates: Array.from(gradDates).sort((a, b) => {
        const yearA = parseInt(a.slice(-4));
        const yearB = parseInt(b.slice(-4));
        return yearA - yearB;
      }),
    };
  }, [students]);

  // Compute filtered & sorted students
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        // Standard non-admin directory view hides flagged profiles pending admin moderation
        if (!adminMode && student.flagged) {
          return false;
        }

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = student.name.toLowerCase().includes(query);
          const matchesMajor = student.major.toLowerCase().includes(query);
          const matchesBio = student.bio.toLowerCase().includes(query);
          const matchesSkills = student.skills.some((s) => s.toLowerCase().includes(query));

          if (!matchesName && !matchesMajor && !matchesBio && !matchesSkills) {
            return false;
          }
        }

        if (selectedMajors.length > 0 && !selectedMajors.includes(student.major)) {
          return false;
        }

        if (selectedGradDates.length > 0 && !selectedGradDates.includes(student.gradDate)) {
          return false;
        }

        if (selectedSkills.length > 0) {
          if (skillFilterMode === "AND") {
            const hasAll = selectedSkills.every((s) => student.skills.includes(s));
            if (!hasAll) return false;
          } else {
            const hasAny = selectedSkills.some((s) => student.skills.includes(s));
            if (!hasAny) return false;
          }
        }

        if (selectedBadges.length > 0) {
          const studentBadgeLabels = getStudentBadgeLabels(student.id);
          const hasAny = selectedBadges.some((b) => studentBadgeLabels.includes(b));
          if (!hasAny) return false;
        }

        if (adminMode) {
          if (adminFilterFlagged !== null) {
            if (adminFilterFlagged && !student.flagged) return false;
            if (!adminFilterFlagged && student.flagged) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "gradDate") {
          return getGradValue(a.gradDate) - getGradValue(b.gradDate);
        }
        if (sortBy === "gpa") {
          const gpaA = getPrimaryEducation(a)?.gpa ?? 0;
          const gpaB = getPrimaryEducation(b)?.gpa ?? 0;
          return gpaB - gpaA;
        }
        return 0;
      });
  }, [
    students,
    searchQuery,
    selectedMajors,
    selectedSkills,
    selectedGradDates,
    selectedBadges,
    skillFilterMode,
    adminMode,
    adminFilterFlagged,
    sortBy,
  ]);

  // Calculate summary stats
  const { totalResumes, majorCount, totalSkillsCount } = useMemo(() => {
    return {
      totalResumes: students.length,
      majorCount: new Set(students.map((s) => s.major)).size,
      totalSkillsCount: new Set(students.flatMap((s) => s.skills)).size,
    };
  }, [students]);

  return {
    availableMajors,
    availableSkills,
    availableGradDates,
    filteredStudents,
    totalResumes,
    majorCount,
    totalSkillsCount,
  };
}
