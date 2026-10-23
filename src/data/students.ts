import type {
  ClubEntry,
  EducationEntry,
  LinkEntry,
  ProjectEntry,
  WorkExperienceEntry,
  CertificationEntry,
} from "@/shared/types";

export type {
  ClubEntry,
  EducationEntry,
  LinkEntry,
  ProjectEntry,
  WorkExperienceEntry,
  CertificationEntry,
};

export interface EventEntry {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime?: string;
  description: string;
  slug?: string;
  category?: string;
  skills?: string[];
  pointsAwarded?: number;
}

export interface Student {
  id: string;
  name: string;
  bio: string;
  skills: string[];
  links: LinkEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  workExperiences: WorkExperienceEntry[];
  clubs: ClubEntry[];
  certifications: CertificationEntry[];
  events?: EventEntry[];
  resumeLink?: string;
  major: string;
  degree: string;
  gradDate: string;
  status: "Seeking Internship" | "Seeking Full-time" | "Employed";
  flagged: boolean;
  flagReason?: string;
  duplicateGroup?: string;
  mainProjectName?: string;
  email: string;
  points?: number;
  recentPoints?: number;
  pointBreakdown?: PointBreakdown;
  createdAt?: string;
  updatedAt?: string;
}

import type { PointBreakdown } from "@/lib/points";
export type { PointBreakdown };



/**
 * Helper to retrieve primary education record (first education entry or fallback)
 */
export function getPrimaryEducation(student: Student): EducationEntry | null {
  if (student.education && student.education.length > 0) {
    return student.education[0];
  }
  return null;
}

/**
 * Helper to retrieve IEEE leadership role if student is an officer or committee chair
 */
export function getIeeeLeadershipRole(student: Student): string | null {
  if (!student.clubs || student.clubs.length === 0) return null;
  const ieeeClub = student.clubs.find((c) => /ieee|institute of electrical/i.test(c.name));
  return ieeeClub ? ieeeClub.title : null;
}

/**
 * Zero hard-coded static student records.
 * All candidate profiles are dynamically fetched from the Drizzle database.
 */
export const INITIAL_STUDENTS: Student[] = [];
