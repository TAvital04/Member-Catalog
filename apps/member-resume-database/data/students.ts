export interface ClubEntry {
  name: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface EducationEntry {
  schoolName: string;
  degreeType: string;
  major: string;
  gpa?: number;
  gpaScale?: number;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface LinkEntry {
  text: string;
  name: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  projectLinks: string[];
}

export interface WorkExperienceEntry {
  name: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  currentJob: boolean;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface EventEntry {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime?: string;
  description: string;
  slug?: string;
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
  email: string;
}



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
 * Zero hard-coded static student records.
 * All candidate profiles are dynamically fetched from the Drizzle database.
 */
export const INITIAL_STUDENTS: Student[] = [];
