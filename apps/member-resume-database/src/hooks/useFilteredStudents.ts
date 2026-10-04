/**
 * @file useFilteredStudents.ts
 * @description Pure calculation hook providing multi-dimensional search, faceted filtering, and sorting
 * across student candidate profiles. Implements boolean skill evaluation (AND vs OR conjunctions),
 * text search across names/bios/skills, attendance event filtering, graduation date matching, and role-based moderation views.
 *
 * @param {UseFilteredStudentsProps} props - Students array, selected filter predicates, and sort preferences
 * @returns {Student[]} Filtered, ranked array of matching student candidates
 */

import { useMemo } from "react";
import { Student, getPrimaryEducation, getIeeeLeadershipRole } from "@/data/students";
import { getGradValue } from "@/lib/gradDate";

interface UseFilteredStudentsProps {
  students: Student[];
  searchQuery: string;
  selectedMajors: string[];
  selectedSkills: string[];
  selectedGradDates: string[];
  selectedEvents?: string[];
  selectedCompanies?: string[];
  onlyLeaders?: boolean;
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
  selectedEvents = [],
  selectedCompanies = [],
  onlyLeaders = false,
  skillFilterMode,
  adminMode,
  adminFilterFlagged,
  sortBy,
}: UseFilteredStudentsProps) {
  // Memoize unique metadata for filter selection options
  const { availableMajors, availableSkills, availableGradDates, availableEvents, availableCompanies } = useMemo(() => {
    const majors = new Set<string>();
    const skills = new Set<string>();
    const gradDates = new Set<string>();
    const eventsSet = new Set<string>();
    const companiesSet = new Set<string>();

    students.forEach((s) => {
      majors.add(s.major);
      s.skills.forEach((sk) => skills.add(sk));
      gradDates.add(s.gradDate);
      (s.events || []).forEach((e) => eventsSet.add(e.title));
      (s.workExperiences || []).forEach((w) => {
        if (w.name) companiesSet.add(w.name);
      });
    });

    return {
      availableMajors: Array.from(majors).sort(),
      availableSkills: Array.from(skills).sort(),
      availableGradDates: Array.from(gradDates).sort((a, b) => {
        const yearA = parseInt(a.slice(-4));
        const yearB = parseInt(b.slice(-4));
        return yearA - yearB;
      }),
      availableEvents: Array.from(eventsSet).sort(),
      availableCompanies: Array.from(companiesSet).sort(),
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
          const matchesCompany = (student.workExperiences || []).some((w) =>
            w.name.toLowerCase().includes(query) || w.title.toLowerCase().includes(query)
          );

          if (!matchesName && !matchesMajor && !matchesBio && !matchesSkills && !matchesCompany) {
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

        if (selectedEvents.length > 0) {
          const studentEventTitles = (student.events || []).map((e) => e.title);
          const hasAnyEvent = selectedEvents.some((evtTitle) => studentEventTitles.includes(evtTitle));
          if (!hasAnyEvent) return false;
        }

        if (selectedCompanies.length > 0) {
          const studentCompanies = (student.workExperiences || []).map((w) => w.name);
          const hasAnyCompany = selectedCompanies.some((comp) => studentCompanies.includes(comp));
          if (!hasAnyCompany) return false;
        }

        if (onlyLeaders && !getIeeeLeadershipRole(student)) {
          return false;
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
    selectedEvents,
    selectedCompanies,
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
    availableEvents,
    availableCompanies,
    filteredStudents,
    totalResumes,
    majorCount,
    totalSkillsCount,
  };
}

