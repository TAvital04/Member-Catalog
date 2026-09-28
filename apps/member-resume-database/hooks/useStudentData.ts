import { useState, useEffect, useCallback } from "react";
import { Student } from "../data/students";

/**
 * Custom React hook for fetching and managing live candidate profiles directly
 * from the Drizzle database via /api/members. Zero hard-coded static records.
 */
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
