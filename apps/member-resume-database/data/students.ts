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

export interface StudentBadge {
  id: string;
  label: string;
  description: string;
  iconPath: string;
}

export const ALL_BADGES: StudentBadge[] = [
  {
    id: "avid-learner",
    label: "Avid Learner",
    description: "Possesses 5+ technical skills",
    iconPath: "/badges/avid-learner.svg",
  },
  {
    id: "professional-socialite",
    label: "Professional Socialite",
    description: "Connected across multiple professional platforms",
    iconPath: "/badges/professional-socialite.svg",
  },
  {
    id: "committed-worker",
    label: "Committed Worker",
    description: "Has industry work experience",
    iconPath: "/badges/committed-worker.svg",
  },
];

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
 * Dynamically computes badge badges for a candidate based on their live profile data
 */
export function getStudentBadges(student: Student): StudentBadge[] {
  const badges: StudentBadge[] = [];

  if (student.skills && student.skills.length >= 5) {
    const b = ALL_BADGES.find((badge) => badge.id === "avid-learner");
    if (b) badges.push(b);
  }

  if (student.links && student.links.length >= 2) {
    const b = ALL_BADGES.find((badge) => badge.id === "professional-socialite");
    if (b) badges.push(b);
  }

  if (student.workExperiences && student.workExperiences.length >= 1) {
    const b = ALL_BADGES.find((badge) => badge.id === "committed-worker");
    if (b) badges.push(b);
  }

  return badges;
}

/**
 * Returns array of badge label strings for filtering
 */
export function getStudentBadgeLabels(student: Student): string[] {
  return getStudentBadges(student).map((b) => b.label);
}

/**
 * Zero hard-coded static student records.
 * All candidate profiles are dynamically fetched from the Drizzle database.
 */
export const INITIAL_STUDENTS: Student[] = [];
