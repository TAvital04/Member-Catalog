/**
 * @file useStudentData.ts
 * @description Data synchronization hook for fetching live candidate profiles from the backend REST API (/api/members).
 * Manages loading states, error fallbacks, and local state updates for client-side optimistic mutations (e.g. unflagging/removal).
 *
 * @returns {{ students: Student[], setStudents: React.Dispatch<React.SetStateAction<Student[]>>, isLoading: boolean, refetch: () => Promise<void> }}
 */

import { useState, useEffect, useCallback } from "react";
import { Student } from "@/data/students";
export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDatabaseStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/members");
      const resData = await response.json();

      if (resData.success && Array.isArray(resData.data)) {
        setStudents(resData.data);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("[useStudentData Error] Failed to fetch database student profiles:", err);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
