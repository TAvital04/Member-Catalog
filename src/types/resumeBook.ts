/**
 * @file resumeBook.ts
 * @description Type definitions for corporate sponsor Resume Book compilation,
 * candidate dossier formatting, and batch export configurations.
 */

export interface ResumeBookOptions {
  title?: string;
  sponsorName?: string;
  targetRole?: string;
  academicTerm?: string;
  includeGpa?: boolean;
  includeProjects?: boolean;
  includeEvents?: boolean;
  includeRecruiterNotes?: boolean;
  includeDirectResumeLinks?: boolean;
  selectedMajor?: string;
  selectedGradYear?: string;
  sourceScope?: "filtered" | "shortlist" | "all";
}

export interface ResumeBookCandidate {
  id: string;
  name: string;
  email: string;
  major: string;
  degree: string;
  gradDate: string;
  gpa?: number;
  gpaScale?: number;
  bio: string;
  skills: string[];
  mainProjectName?: string;
  resumePdfUrl: string;
  portfolioUrl: string;
  projects: Array<{
    name: string;
    description: string;
    role?: string;
    tools?: string[];
  }>;
  events: Array<{
    title: string;
    category?: string;
  }>;
  workExperiences: Array<{
    name: string;
    title: string;
    startDate: string;
    endDate?: string;
  }>;
  recruiterNotes?: string;
  tags?: string[];
}
