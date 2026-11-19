"use client";

import React from "react";
import { Student } from "@/data/students";
import RecruiterContactForm from "@/components/forms/RecruiterContactForm";
import { UserRole } from "@/hooks/useRoleManager";

interface ContactTabProps {
  student: Student;
  role?: UserRole;
}

export default function ContactTab({ student, role = "sponsor" }: ContactTabProps) {
  return <RecruiterContactForm student={student} role={role} />;
}
