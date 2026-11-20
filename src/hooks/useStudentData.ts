/**
 * @file useStudentData.ts
 * @description Data synchronization hook for fetching live candidate profiles from the backend REST API (/api/members).
 * Manages loading states, error fallbacks, and local state updates for client-side optimistic mutations (e.g. unflagging/removal).
 *
 * @returns {{ students: Student[], setStudents: React.Dispatch<React.SetStateAction<Student[]>>, isLoading: boolean, refetch: () => Promise<void> }}
 */

import { useState, useEffect, useCallback } from "react";
import { Student } from "@/data/students";
export function useStudentData(role?: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDatabaseStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = role ? `/api/members?role=${encodeURIComponent(role)}` : "/api/members";
      const response = await fetch(url, {
        headers: role ? { "x-user-role": role } : undefined,
      });
      if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
        const resData = await response.json();
        if (resData.success && Array.isArray(resData.data)) {
          setStudents(resData.data);
          return;
        }
      }
      setStudents([]);
    } catch (err) {
      console.warn("[useStudentData] Could not load database members, using empty state:", err);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchDatabaseStudents();
  }, [fetchDatabaseStudents]);

  const updateStudents = useCallback((newStudents: Student[]) => {
    setStudents(newStudents);
  }, []);

  return {
    students,
    setStudents: updateStudents,
    refetch: fetchDatabaseStudents,
    isLoading,
  };
}
