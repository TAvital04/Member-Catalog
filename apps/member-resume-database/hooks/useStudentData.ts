import { useState, useEffect, useCallback } from "react";
import { Student, INITIAL_STUDENTS } from "../data/students";

export function useStudentData() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ieee_resume_database_students");
    let finalStudents = INITIAL_STUDENTS;

    if (stored) {
      try {
        const parsed = (JSON.parse(stored) as Student[]).map((s) => {
          if ((s.status as string) === "Graduated") {
            return { ...s, status: "Seeking Full-time" as const };
          }
          return s;
        });

        if (parsed.length !== INITIAL_STUDENTS.length) {
          localStorage.setItem("ieee_resume_database_students", JSON.stringify(INITIAL_STUDENTS));
        } else {
          finalStudents = parsed;
        }
      } catch (err) {
        console.error("Failed to load local storage resume database", err);
        localStorage.setItem("ieee_resume_database_students", JSON.stringify(INITIAL_STUDENTS));
      }
    } else {
      localStorage.setItem("ieee_resume_database_students", JSON.stringify(INITIAL_STUDENTS));
    }

    const t = setTimeout(() => {
      setStudents(finalStudents);
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const updateStudents = useCallback((newStudents: Student[]) => {
    setStudents(newStudents);
    localStorage.setItem("ieee_resume_database_students", JSON.stringify(newStudents));
  }, []);

  return {
    students,
    setStudents: updateStudents,
    isLoading,
  };
}
