export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface SocialLinkInput {
  platformName: string;
  profileUrl: string;
}

export interface EducationInput {
  schoolName: string;
  degreeType: string;
  major: string;
  gpa?: number;
  gpaScale?: number;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface WorkExperienceInput {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  isCurrentJob: boolean;
  description: string;
}

export interface ProjectInput {
  projectName: string;
  description: string;
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  projectLinks: string[];
}

export interface ClubMembershipInput {
  clubName: string;
  roleTitle: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  description?: string;
}

export interface CertificationInput {
  certificationName: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface MemberResumeFormData {
  fullName: string;
  email: string;
  status: 'Seeking Internship' | 'Seeking Full-time' | 'Employed';
  bio: string;
  resumePdfUrl: string;
  socialLinks: SocialLinkInput[];
  education: EducationInput[];
  skills: string[];
  workExperience: WorkExperienceInput[];
  projects: ProjectInput[];
  clubMemberships: ClubMembershipInput[];
  certifications: CertificationInput[];
  mainProjectName?: string;
}

const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

export function validateMemberResumeForm(data: Partial<MemberResumeFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 1) {
    errors.fullName = 'Full name is required.';
  } else if (data.fullName.length > 50) {
    errors.fullName = 'Full name cannot exceed 50 characters.';
  } else if (!NAME_REGEX.test(data.fullName)) {
    errors.fullName = 'Full name must contain letters and spaces only.';
  }

  if (!data.email || !EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  const validStatuses = ['Seeking Internship', 'Seeking Full-time', 'Employed'];
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.status = 'Status must be Seeking Internship, Seeking Full-time, or Employed.';
  }

  if (!data.bio || data.bio.trim().length < 1) {
    errors.bio = 'Personal bio is required.';
  } else if (data.bio.length > 300) {
    errors.bio = 'Personal bio cannot exceed 300 characters.';
  }

  if (!data.resumePdfUrl || data.resumePdfUrl.trim().length < 1) {
    errors.resumePdfUrl = 'Resume PDF URL is required.';
  } else if (data.resumePdfUrl.length > 200) {
    errors.resumePdfUrl = 'Resume PDF link cannot exceed 200 characters.';
  } else if (!URL_REGEX.test(data.resumePdfUrl.trim()) || /\s/.test(data.resumePdfUrl)) {
    errors.resumePdfUrl = 'Must be a valid URL without spaces.';
  }

  if (data.socialLinks && data.socialLinks.length > 5) {
    errors.socialLinks = 'You can submit up to 5 social links.';
  }

  if (!data.education || data.education.length === 0) {
    errors.education = 'At least one education entry is required.';
  } else {
    data.education.forEach((edu, idx) => {
      if (!edu.schoolName || edu.schoolName.trim().length < 1 || edu.schoolName.length > 100) {
        errors[`education_${idx}_schoolName`] = 'School name is required (max 100 characters).';
      }
      if (!edu.major || edu.major.trim().length < 1 || edu.major.length > 100) {
        errors[`education_${idx}_major`] = 'Major is required (max 100 characters).';
      }
    });
  }

  if (data.skills && data.skills.length > 50) {
    errors.skills = 'You can submit up to 50 skills.';
  }

  if (data.workExperience && data.workExperience.length > 10) {
    errors.workExperience = 'You can list up to 10 work experiences.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
