/**
 * @file shortlist.ts
 * @description Type definitions for recruiter candidate shortlists, private evaluation notes,
 * and talent tags in the RSO USF Member Catalog.
 */

export interface ShortlistedCandidate {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateMajor: string;
  gradDate: string;
  savedAt: string; // ISO 8601 string
  listName?: string; // Optional named list (e.g. "Fall 2026 Interns", "Hardware Leads")
  notes?: string; // Private recruiter evaluation note
  tags?: string[]; // Custom recruiter tags (e.g. "Phone Screened", "FPGA", "Top Choice")
  recruiterId?: string; // Org identifier or recruiter email
}

export interface ShortlistFilterState {
  activeList: string; // "all" or specific listName
  searchQuery: string;
  selectedTag?: string;
}
