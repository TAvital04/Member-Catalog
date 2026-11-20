/**
 * @file shortlistStorage.ts
 * @description LocalStorage management and CSV export utilities for recruiter candidate shortlists.
 * Fully cross-tab synchronized and scoped per recruiter / sponsor organization.
 */

import { ShortlistedCandidate } from "@/types/shortlist";
import { Student } from "@/data/students";

export const SHORTLIST_STORAGE_PREFIX = "rso-shortlist-";
export const SHORTLIST_CHANGE_EVENT = "rso-shortlist-change";

export function getShortlistStorageKey(recruiterKey?: string): string {
  const clean = (recruiterKey || "default").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_");
  return `${SHORTLIST_STORAGE_PREFIX}${clean}`;
}

export function loadShortlistFromStorage(recruiterKey?: string): ShortlistedCandidate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getShortlistStorageKey(recruiterKey));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn("Failed to load recruiter shortlist from localStorage:", err);
  }
  return [];
}

export function saveShortlistToStorage(candidates: ShortlistedCandidate[], recruiterKey?: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getShortlistStorageKey(recruiterKey), JSON.stringify(candidates));
    window.dispatchEvent(new CustomEvent(SHORTLIST_CHANGE_EVENT, { detail: { recruiterKey } }));
  } catch (err) {
    console.warn("Failed to save recruiter shortlist to localStorage:", err);
  }
}

/**
 * Generates and downloads a CSV export file for shortlisted candidates.
 */
export function exportShortlistToCsv(
  shortlist: ShortlistedCandidate[],
  students: Student[],
  filename = "recruiter_shortlist.csv"
): void {
  if (typeof window === "undefined" || shortlist.length === 0) return;

  const headers = [
    "Name",
    "Email",
    "Major",
    "Graduation Date",
    "List Category",
    "Recruiter Notes",
    "Tags",
    "Saved Date",
    "Skills",
    "Main Project",
  ];

  const escapeCsv = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = shortlist.map((item) => {
    const matchedStudent = students.find((s) => s.id.toLowerCase() === item.candidateId.toLowerCase());
    const skillsStr = matchedStudent ? matchedStudent.skills.join("; ") : "";
    const projectStr = matchedStudent?.mainProjectName || "";
    const tagsStr = (item.tags || []).join("; ");
    const savedDateFormatted = item.savedAt ? new Date(item.savedAt).toLocaleDateString("en-US") : "";

    return [
      escapeCsv(item.candidateName),
      escapeCsv(item.candidateEmail),
      escapeCsv(item.candidateMajor),
      escapeCsv(item.gradDate),
      escapeCsv(item.listName || "General"),
      escapeCsv(item.notes || ""),
      escapeCsv(tagsStr),
      escapeCsv(savedDateFormatted),
      escapeCsv(skillsStr),
      escapeCsv(projectStr),
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
 * Formats a comma-separated email list for all shortlisted candidates.
 */
export function formatShortlistEmails(shortlist: ShortlistedCandidate[]): string {
  return Array.from(
    new Set(
      shortlist
        .map((c) => c.candidateEmail?.trim())
        .filter((e): e is string => Boolean(e && e.includes("@")))
    )
  ).join(", ");
}
