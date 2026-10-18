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
import { DirectorySortOption } from "./useDirectoryFilters";
import { studentHasSkill } from "@/lib/skillMatching";

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
  sortBy: DirectorySortOption | string;
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
            const hasAll = selectedSkills.every((s) => studentHasSkill(student.skills, s));
            if (!hasAll) return false;
          } else {
            const hasAny = selectedSkills.some((s) => studentHasSkill(student.skills, s));
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
        // Activity: Most Active in the Last 2 Weeks vs Least Active Recent
        if (sortBy === "activity-recent") {
          const recA = a.recentPoints ?? (a.updatedAt ? (Date.now() - new Date(a.updatedAt).getTime() < 14 * 86400000 ? 10 : 0) : 0);
          const recB = b.recentPoints ?? (b.updatedAt ? (Date.now() - new Date(b.updatedAt).getTime() < 14 * 86400000 ? 10 : 0) : 0);
          const diff = recB - recA;
          if (diff !== 0) return diff;
          const ptDiff = (b.points ?? 0) - (a.points ?? 0);
          if (ptDiff !== 0) return ptDiff;
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "activity-recent-asc") {
          const recA = a.recentPoints ?? (a.updatedAt ? (Date.now() - new Date(a.updatedAt).getTime() < 14 * 86400000 ? 10 : 0) : 0);
          const recB = b.recentPoints ?? (b.updatedAt ? (Date.now() - new Date(b.updatedAt).getTime() < 14 * 86400000 ? 10 : 0) : 0);
          const diff = recA - recB;
          if (diff !== 0) return diff;
          const ptDiff = (a.points ?? 0) - (b.points ?? 0);
          if (ptDiff !== 0) return ptDiff;
          return a.name.localeCompare(b.name);
        }

        // Activity: Most Active Ever vs Least Active Ever
        if (sortBy === "activity" || sortBy === "points") {
          const diff = (b.points ?? 0) - (a.points ?? 0);
          if (diff !== 0) return diff;
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "activity-asc" || sortBy === "points-asc") {
          const diff = (a.points ?? 0) - (b.points ?? 0);
          if (diff !== 0) return diff;
          return a.name.localeCompare(b.name);
        }

        // Recently Updated (Most recently updated profiles first vs oldest updated)
        if (sortBy === "updated") {
          const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          if (timeB !== timeA) return timeB - timeA;
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "updated-asc") {
          const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          if (timeA !== timeB) return timeA - timeB;
          return a.name.localeCompare(b.name);
        }

        // Recently Created (Most recently created profiles first vs oldest created)
        if (sortBy === "created") {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (timeB !== timeA) return timeB - timeA;
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "created-asc") {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (timeA !== timeB) return timeA - timeB;
          return a.name.localeCompare(b.name);
        }

        // Name (A-Z vs Z-A)
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "name-desc") {
          return b.name.localeCompare(a.name);
        }

        // Graduation Date (Soonest first vs Latest first)
        if (sortBy === "gradDate") {
          return getGradValue(a.gradDate) - getGradValue(b.gradDate);
        }
        if (sortBy === "gradDate-desc") {
          return getGradValue(b.gradDate) - getGradValue(a.gradDate);
        }

        // GPA (Highest first vs Lowest first)
        if (sortBy === "gpa") {
          const gpaA = getPrimaryEducation(a)?.gpa ?? 0;
          const gpaB = getPrimaryEducation(b)?.gpa ?? 0;
          return gpaB - gpaA;
        }
        if (sortBy === "gpa-asc") {
          const gpaA = getPrimaryEducation(a)?.gpa ?? 0;
          const gpaB = getPrimaryEducation(b)?.gpa ?? 0;
          return gpaA - gpaB;
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

