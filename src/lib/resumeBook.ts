/**
 * @file resumeBook.ts
 * @description Compilation, transformation, and export utilities for corporate partner Resume Books.
 */

import { Student, getPrimaryEducation } from "@/data/students";
import { ResumeBookOptions, ResumeBookCandidate } from "@/types/resumeBook";
import { getStudentSlug } from "@/lib/studentSlug";

export function formatResumeUrl(student: Student): string {
  if (student.resumeLink && student.resumeLink.trim()) {
    return student.resumeLink.trim();
  }
  const cvLink = student.links?.find((l) => /resume|cv/i.test(l.name))?.text;
  if (cvLink && cvLink.trim()) {
    return cvLink.trim();
  }
  return `https://drive.google.com/file/d/${student.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-resume/view`;
}

export function compileResumeBookCandidates(
  students: Student[],
  options: ResumeBookOptions,
  recruiterNotesMap?: Record<string, { notes?: string; tags?: string[] }>
): ResumeBookCandidate[] {
  return students
    .filter((student) => {
      // Filter by Major if specified
      if (options.selectedMajor && options.selectedMajor !== "all") {
        if (student.major.toLowerCase() !== options.selectedMajor.toLowerCase()) {
          return false;
        }
      }

      // Filter by Graduation Year if specified
      if (options.selectedGradYear && options.selectedGradYear !== "all") {
        const yearMatch = student.gradDate.includes(options.selectedGradYear);
        if (!yearMatch) return false;
      }

      return true;
    })
    .map((student) => {
      const primaryEdu = getPrimaryEducation(student);
      const slug = getStudentSlug(student);
      const portfolioUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/u/${slug}`
          : `/u/${slug}`;

      const notesData = recruiterNotesMap?.[student.id.toLowerCase()];

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        major: primaryEdu?.major || student.major,
        degree: primaryEdu?.degreeType || student.degree || "Bachelor of Science",
        gradDate: student.gradDate,
        gpa: primaryEdu?.gpa,
        gpaScale: primaryEdu?.gpaScale || 4.0,
        bio: student.bio || "No candidate biography provided.",
        skills: student.skills || [],
        mainProjectName: student.mainProjectName,
        resumePdfUrl: formatResumeUrl(student),
        portfolioUrl,
        projects: (student.projects || []).map((p) => ({
          name: p.name,
          description: p.description,
          role: (p as any).role || undefined,
          tools: (p as any).tools || undefined,
        })),
        events: (student.events || []).map((e) => ({
          title: e.title,
          category: e.category,
        })),
        workExperiences: (student.workExperiences || []).map((w) => ({
          name: w.name,
          title: w.title,
          startDate: w.startDate,
          endDate: w.endDate,
        })),
        recruiterNotes: notesData?.notes || undefined,
        tags: notesData?.tags || undefined,
      };
    });
}

/**
 * Generates and triggers download of a Resume Book CSV Index.
 */
export function exportResumeBookCsv(
  candidates: ResumeBookCandidate[],
  options: ResumeBookOptions,
  filename = "rso_usf_resume_book_index.csv"
): void {
  if (typeof window === "undefined" || candidates.length === 0) return;

  const escapeCsv = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = [
    "Candidate Name",
    "Major",
    "Degree",
    "Graduation Date",
    "GPA (Consent)",
    "USF Email",
    "Technical Skills",
    "Primary Chapter Project",
    "Resume PDF Link",
    "Portfolio Vanity Link",
    "Recruiter Notes",
    "Tags",
  ];

  const rows = candidates.map((c) => {
    const gpaDisplay = options.includeGpa && c.gpa ? `${c.gpa.toFixed(2)} / ${c.gpaScale || 4.0}` : "Confidential";
    const skillsStr = c.skills.join("; ");
    const tagsStr = (c.tags || []).join("; ");

    return [
      escapeCsv(c.name),
      escapeCsv(c.major),
      escapeCsv(c.degree),
      escapeCsv(c.gradDate),
      escapeCsv(gpaDisplay),
      escapeCsv(c.email),
      escapeCsv(skillsStr),
      escapeCsv(c.mainProjectName || ""),
      escapeCsv(c.resumePdfUrl),
      escapeCsv(c.portfolioUrl),
      escapeCsv(options.includeRecruiterNotes ? c.recruiterNotes || "" : ""),
      escapeCsv(tagsStr),
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and triggers download of structured Resume Book ATS JSON.
 */
export function exportResumeBookJson(
  candidates: ResumeBookCandidate[],
  options: ResumeBookOptions,
  filename = "rso_usf_resume_book_ats.json"
): void {
  if (typeof window === "undefined" || candidates.length === 0) return;

  const payload = {
    exportMetadata: {
      title: options.title || "RSO USF Candidate Resume Book",
      preparedFor: options.sponsorName || "Corporate Sponsor",
      generatedAt: new Date().toISOString(),
      totalCandidates: candidates.length,
      chapter: "RSO USF Student Chapter - University of South Florida",
    },
    candidates: candidates.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      major: c.major,
      degree: c.degree,
      gradDate: c.gradDate,
      gpa: options.includeGpa ? c.gpa : undefined,
      skills: c.skills,
      mainProject: c.mainProjectName,
      resumePdfUrl: c.resumePdfUrl,
      portfolioUrl: c.portfolioUrl,
      projects: options.includeProjects ? c.projects : [],
      eventsAttended: options.includeEvents ? c.events : [],
      workExperiences: c.workExperiences,
      recruiterNotes: options.includeRecruiterNotes ? c.recruiterNotes : undefined,
      tags: c.tags,
    })),
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
