import { Student } from "@/data/students";

/**
 * getStudentSlug — Generates a URL-friendly slug for a student (e.g. "alex-rivera")
 */
export function getStudentSlug(student: { id: string; name: string }): string {
  if (!student || !student.name) return (student && student.id) || "";
  const nameSlug = student.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return nameSlug || student.id;
}

/**
 * findStudentBySlugOrId — Looks up a student by slug, name or ID
 */
export function findStudentBySlugOrId(students: Student[], identifier?: string | null): Student | undefined {
  if (!identifier || !Array.isArray(students)) return undefined;
  const clean = identifier.toLowerCase().trim();
  const stripped = clean
    .replace(/^mem-/, "")
    .replace(/^(cand|candidate)-/, "")
    .replace(/-\d+$/, "");

  return students.find((s) => {
    if (s.id.toLowerCase() === clean || s.id.toLowerCase() === stripped) return true;
    const slug = getStudentSlug(s);
    if (slug === clean || slug === stripped) return true;
    const sName = s.name.toLowerCase().trim();
    if (
      sName === clean ||
      sName.replace(/\s+/g, "-") === clean ||
      sName === stripped ||
      sName.replace(/\s+/g, "-") === stripped
    ) return true;
    if (s.email && (s.email.toLowerCase() === clean || s.email.toLowerCase().includes(stripped))) return true;
    return false;
  });
}
