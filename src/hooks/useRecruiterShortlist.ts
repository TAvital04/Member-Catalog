"use client";

/**
 * @file useRecruiterShortlist.ts
 * @description Custom React hook managing candidate shortlists, recruiter notes,
 * and talent categorization for corporate sponsors and RSO leadership.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { ShortlistedCandidate } from "@/types/shortlist";
import { Student } from "@/data/students";
import {
  loadShortlistFromStorage,
  saveShortlistToStorage,
  SHORTLIST_CHANGE_EVENT,
  exportShortlistToCsv,
  formatShortlistEmails,
} from "@/lib/shortlistStorage";

export function useRecruiterShortlist(recruiterIdentifier?: string) {
  const [candidates, setCandidates] = useState<ShortlistedCandidate[]>(() =>
    loadShortlistFromStorage(recruiterIdentifier)
  );

  // Sync state when storage changes across tabs or other components
  const refreshFromStorage = useCallback(() => {
    setCandidates(loadShortlistFromStorage(recruiterIdentifier));
  }, [recruiterIdentifier]);

  useEffect(() => {
    refreshFromStorage();
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ recruiterKey?: string }>;
      if (!customEvent.detail || !customEvent.detail.recruiterKey || customEvent.detail.recruiterKey === recruiterIdentifier) {
        refreshFromStorage();
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key.includes("rso-shortlist-")) {
        refreshFromStorage();
      }
    };

    window.addEventListener(SHORTLIST_CHANGE_EVENT, handleCustomChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(SHORTLIST_CHANGE_EVENT, handleCustomChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshFromStorage, recruiterIdentifier]);

  const isShortlisted = useCallback(
    (candidateId: string): boolean => {
      if (!candidateId) return false;
      const clean = candidateId.toLowerCase();
      return candidates.some((c) => c.candidateId.toLowerCase() === clean);
    },
    [candidates]
  );

  const getShortlistEntry = useCallback(
    (candidateId: string): ShortlistedCandidate | undefined => {
      if (!candidateId) return undefined;
      const clean = candidateId.toLowerCase();
      return candidates.find((c) => c.candidateId.toLowerCase() === clean);
    },
    [candidates]
  );

  const saveCandidate = useCallback(
    (
      student: Student,
      listName = "General",
      notes = "",
      tags: string[] = []
    ) => {
      const existing = candidates.find((c) => c.candidateId.toLowerCase() === student.id.toLowerCase());
      let updated: ShortlistedCandidate[];

      if (existing) {
        updated = candidates.map((c) =>
          c.candidateId.toLowerCase() === student.id.toLowerCase()
            ? {
                ...c,
                listName: listName || c.listName || "General",
                notes: notes !== undefined ? notes : c.notes,
                tags: tags && tags.length > 0 ? tags : c.tags,
              }
            : c
        );
      } else {
        const newEntry: ShortlistedCandidate = {
          candidateId: student.id,
          candidateName: student.name,
          candidateEmail: student.email,
          candidateMajor: student.major,
          gradDate: student.gradDate,
          savedAt: new Date().toISOString(),
          listName: listName || "General",
          notes,
          tags,
          recruiterId: recruiterIdentifier,
        };
        updated = [newEntry, ...candidates];
      }

      setCandidates(updated);
      saveShortlistToStorage(updated, recruiterIdentifier);
    },
    [candidates, recruiterIdentifier]
  );

  const removeCandidate = useCallback(
    (candidateId: string) => {
      const clean = candidateId.toLowerCase();
      const updated = candidates.filter((c) => c.candidateId.toLowerCase() !== clean);
      setCandidates(updated);
      saveShortlistToStorage(updated, recruiterIdentifier);
    },
    [candidates, recruiterIdentifier]
  );

  /**
   * Toggles candidate in the shortlist. Returns true if saved, false if removed.
   */
  const toggleCandidate = useCallback(
    (student: Student, listName = "General"): boolean => {
      const alreadySaved = isShortlisted(student.id);
      if (alreadySaved) {
        removeCandidate(student.id);
        return false;
      } else {
        saveCandidate(student, listName);
        return true;
      }
    },
    [isShortlisted, removeCandidate, saveCandidate]
  );

  const updateCandidateNotes = useCallback(
    (candidateId: string, notes: string) => {
      const clean = candidateId.toLowerCase();
      const updated = candidates.map((c) =>
        c.candidateId.toLowerCase() === clean ? { ...c, notes } : c
      );
      setCandidates(updated);
      saveShortlistToStorage(updated, recruiterIdentifier);
    },
    [candidates, recruiterIdentifier]
  );

  const updateCandidateTags = useCallback(
    (candidateId: string, tags: string[]) => {
      const clean = candidateId.toLowerCase();
      const updated = candidates.map((c) =>
        c.candidateId.toLowerCase() === clean ? { ...c, tags } : c
      );
      setCandidates(updated);
      saveShortlistToStorage(updated, recruiterIdentifier);
    },
    [candidates, recruiterIdentifier]
  );

  const updateCandidateListName = useCallback(
    (candidateId: string, listName: string) => {
      const clean = candidateId.toLowerCase();
      const updated = candidates.map((c) =>
        c.candidateId.toLowerCase() === clean ? { ...c, listName } : c
      );
      setCandidates(updated);
      saveShortlistToStorage(updated, recruiterIdentifier);
    },
    [candidates, recruiterIdentifier]
  );

  const clearShortlist = useCallback(() => {
    setCandidates([]);
    saveShortlistToStorage([], recruiterIdentifier);
  }, [recruiterIdentifier]);

  const availableListNames = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      if (c.listName) set.add(c.listName);
    });
    return Array.from(set).sort();
  }, [candidates]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      (c.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [candidates]);

  const exportCsv = useCallback(
    (students: Student[], filename?: string) => {
      exportShortlistToCsv(candidates, students, filename);
    },
    [candidates]
  );

  const copyEmails = useCallback(async (): Promise<boolean> => {
    const formatted = formatShortlistEmails(candidates);
    if (!formatted) return false;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(formatted);
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, [candidates]);

  return {
    shortlistedCandidates: candidates,
    shortlistCount: candidates.length,
    isShortlisted,
    getShortlistEntry,
    saveCandidate,
    removeCandidate,
    toggleCandidate,
    updateCandidateNotes,
    updateCandidateTags,
    updateCandidateListName,
    clearShortlist,
    availableListNames,
    allTags,
    exportCsv,
    copyEmails,
  };
}
