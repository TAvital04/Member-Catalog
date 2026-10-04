/**
 * @file useFlagDialogManager.ts
 * @description Hook managing candidate moderation flagging workflows across user roles.
 * Supports public member reports (with structured categories like AI Slop, Duplicate, Inappropriate Content)
 * as well as admin instant flags/toggles with automatic student notification and administrative alerts.
 *
 * @param {UseFlagDialogManagerProps} props - Current student collection, selected modal candidate, and toast dispatchers
 * @returns {FlagDialogManagerReturn} State, modal refs, and trigger actions for profile reporting
 */

import { useState, useCallback } from "react";
import { Student } from "@/data/students";
import { useFocusTrap } from "@/components/common/useFocusTrap";
import { sendDirectEmail } from "@/lib/email";

type UserRole = "standard" | "sponsor" | "admin";

interface FlagDialogState {
  isOpen: boolean;
  studentId: string;
  studentName: string;
  isUnflagging: boolean;
  defaultReason: string;
}

interface UseFlagDialogManagerProps {
  students: Student[];
  setStudents: (students: Student[]) => void;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  adminMode: boolean;
  role: UserRole;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  setToastMessage: (msg: string | null) => void;
}

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ta616249@ucf.edu";

export function useFlagDialogManager({
  students,
  setStudents,
  selectedStudent,
  setSelectedStudent,
  adminMode,
  role,
  showConfirm,
  setToastMessage,
}: UseFlagDialogManagerProps) {
  const [flagDialog, setFlagDialog] = useState<FlagDialogState | null>(null);
  const [flagReasonInput, setFlagReasonInput] = useState("");
  const [flagReportType, setFlagReportType] = useState<"other" | "duplicate" | "ai_slop">("other");
  const [duplicateSearchQuery, setDuplicateSearchQuery] = useState("");
  const [selectedDuplicateTargetIds, setSelectedDuplicateTargetIds] = useState<string[]>([]);
  const [adminFlagChoice, setAdminFlagChoice] = useState<"choose" | "flag" | null>(null);

  const flagDialogRef = useFocusTrap(!!flagDialog, () => setFlagDialog(null));

  const handleDeleteStudent = useCallback(
    (id: string) => {
      const student = students.find((s) => s.id === id);
      if (!student) return;

      showConfirm(
        "Confirm Profile Deletion",
        `Are you sure you want to permanently delete ${student.name}'s profile? This action is irreversible and will send notification emails to student and admin.`,
        async () => {
          const updated = students.filter((s) => s.id !== id);
          setStudents(updated);
          if (selectedStudent && selectedStudent.id === id) {
            setSelectedStudent(null);
          }
          setFlagDialog(null);

          const subjectStudent = "[IEEE UCF Resume Database] Profile Record Deleted";
          const bodyStudent = `Hello ${student.name},\n\nYour profile has been permanently deleted from the UCF Member Resume Database by an administrator.\n\nReason / Details:\n"${
            student.flagReason || "Administrative review / Profile record deletion"
          }"\n\nIf you believe this was performed in error or would like to re-submit your profile, please contact our administrative team directly at ta616249@ucf.edu.\n\nBest,\nUCF IEEE Admin Team`;

          const subjectAdmin = `[MRD Notice] Student Profile Deleted: ${student.name}`;
          const bodyAdmin = `Hello MRD Administrator,\n\nA student profile record has been deleted from the UCF Member Resume Database.\n\nDeleted Candidate Details:\n- Name: ${student.name}\n- Email: ${student.email}\n- Major: ${student.major}\n- Graduation: ${student.gradDate}\n- Flag/Deletion Reason: "${
            student.flagReason || "Administrative review / Profile record deletion"
          }"\n- Performed By: Administrator\n\nBest,\nUCF Member Resume Database System`;

          try {
            await Promise.all([
              student.email
                ? sendDirectEmail({
                    to: student.email,
                    recipientType: "student",
                    subject: subjectStudent,
                    message: bodyStudent,
                  })
                : Promise.resolve(),
              sendDirectEmail({
                to: ADMIN_EMAIL,
                recipientType: "admin",
                subject: subjectAdmin,
                message: bodyAdmin,
              }),
            ]);

            setToastMessage(`Profile deleted & notification emails sent to student and admin (${ADMIN_EMAIL}).`);
          } catch (err: any) {
            console.error("Deletion email dispatch error:", err);
            setToastMessage(`Profile deleted, email notice: ${err?.message || "Check Resend key"}`);
          }

          setTimeout(() => {
            setToastMessage(null);
          }, 5000);
        }
      );
    },
    [students, selectedStudent, showConfirm, setStudents, setSelectedStudent, setToastMessage]
  );

  const handleToggleFlagStudent = useCallback(
    (id: string) => {
      const student = students.find((s) => s.id === id);
      if (!student) return;

      const defaultReason = adminMode ? "Flagged by Admin Audit" : "Flagged by User Report";
      setFlagDialog({
        isOpen: true,
        studentId: id,
        studentName: student.name,
        isUnflagging: student.flagged,
        defaultReason,
      });
      setFlagReasonInput(defaultReason);
      setFlagReportType("other");
      setDuplicateSearchQuery("");
      setSelectedDuplicateTargetIds([]);

      if (adminMode && !student.flagged) {
        setAdminFlagChoice("choose");
      } else {
        setAdminFlagChoice(null);
      }
    },
    [students, adminMode]
  );

  const handleConfirmFlagAction = async () => {
    if (!flagDialog) return;
    const { studentId, isUnflagging, defaultReason } = flagDialog;

    if (isUnflagging) {
      const targetStudent = students.find((s) => s.id === studentId);

      const updated = students.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            flagged: false,
            flagReason: undefined,
          };
        }
        return s;
      });
      setStudents(updated);
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent({ ...selectedStudent, flagged: false, flagReason: undefined });
      }

      if (targetStudent) {
        const subjectStudent = "[IEEE UCF Resume Database] Profile Flag Resolved";
        const bodyStudent = `Hello ${targetStudent.name},\n\nGood news! Your candidate profile in the UCF Member Resume Database has been reviewed by an administrator and unflagged.\n\nYour profile is now active and restored to public directory searches.\n\nBest,\nUCF IEEE Admin Team`;

        const subjectAdmin = `[MRD Resolution] Candidate Profile Unflagged: ${targetStudent.name}`;
        const bodyAdmin = `Hello MRD Administrator,\n\nCandidate profile for ${targetStudent.name} (${targetStudent.email}) has been reviewed and unflagged.\n\nThe profile is now restored to active directory searches.\n\nBest,\nUCF Member Resume Database System`;

        try {
          await Promise.all([
            targetStudent.email
              ? sendDirectEmail({
                  to: targetStudent.email,
                  recipientType: "student",
                  subject: subjectStudent,
                  message: bodyStudent,
                })
              : Promise.resolve(),
            sendDirectEmail({
              to: ADMIN_EMAIL,
              recipientType: "admin",
              subject: subjectAdmin,
              message: bodyAdmin,
            }),
          ]);

          setToastMessage(`Profile unflagged. Notifications emailed to ${targetStudent.name} and admin (${ADMIN_EMAIL}).`);
        } catch (err: any) {
          console.error("Unflag email dispatch error:", err);
          setToastMessage(`Profile unflagged, email notice: ${err?.message || "Check Resend key"}`);
        }

        setTimeout(() => {
          setToastMessage(null);
        }, 5000);
      }
    } else {
      if (flagReportType === "duplicate") {
        if (selectedDuplicateTargetIds.length === 0) return;

        const studentA = students.find((s) => s.id === studentId);
        if (!studentA) return;

        const targetStudents = students.filter(
          (s) => s.id === studentId || selectedDuplicateTargetIds.includes(s.id)
        );

        const existingGroups = Array.from(
          new Set(targetStudents.map((s) => s.duplicateGroup).filter(Boolean))
        ) as string[];

        const sharedGroup =
          existingGroups[0] || `dup-${studentId}-${selectedDuplicateTargetIds.join("-")}`.substring(0, 100);

        const updated = students.map((s) => {
          const belongsToAnyExistingGroup =
            s.duplicateGroup && existingGroups.includes(s.duplicateGroup);
          const isDirectTarget =
            s.id === studentId || selectedDuplicateTargetIds.includes(s.id);

          if (isDirectTarget || belongsToAnyExistingGroup || s.duplicateGroup === sharedGroup) {
            return {
              ...s,
              flagged: true,
              duplicateGroup: sharedGroup,
              flagReason: "Duplicate Profile Group",
            };
          }
          return s;
        });

        setStudents(updated);

        if (
          selectedStudent &&
          (selectedStudent.id === studentId || selectedDuplicateTargetIds.includes(selectedStudent.id))
        ) {
          const matched = updated.find((s) => s.id === selectedStudent.id);
          if (matched) {
            setSelectedStudent(matched);
          }
        }

        if (studentA) {
          const subjectAdmin = `[MRD Report] Duplicate Profile Reported: ${studentA.name}`;
          const bodyAdmin = `Hello MRD Administrator,\n\nA duplicate candidate entry has been reported in the UCF Member Resume Database.\n\nReported Candidate:\n- Name: ${studentA.name}\n- Linked Duplicate Count: ${selectedDuplicateTargetIds.length + 1}\n- Reported By: ${role === "admin" ? "Administrator" : "Directory User"}\n\nThese candidate entries have been flagged under duplicate group "${sharedGroup}" pending your administrative review.\n\nBest,\nUCF Member Resume Database System`;

          const subjectStudent = `[MRD Notice] Duplicate Profile Reported for ${studentA.name}`;
          const bodyStudent = `Hello ${studentA.name},\n\nA duplicate profile report has been filed regarding your entry in the UCF Member Resume Database.\n\nGroup ID: "${sharedGroup}"\n\nYour profile has been flagged internally for review. If you have questions, please contact our team at ta616249@ucf.edu.\n\nBest,\nUCF Member Resume Database System`;

          try {
            await Promise.all([
              sendDirectEmail({
                to: ADMIN_EMAIL,
                recipientType: "admin",
                subject: subjectAdmin,
                message: bodyAdmin,
              }),
              studentA.email
                ? sendDirectEmail({
                    to: studentA.email,
                    recipientType: "student",
                    subject: subjectStudent,
                    message: bodyStudent,
                  })
                : Promise.resolve(),
            ]);

            setToastMessage(`Duplicate report submitted & emailed via Resend.`);
          } catch (err: any) {
            console.error("Resend flag notification error:", err);
            setToastMessage(`Report saved, email notice: ${err?.message || "Check Resend key"}`);
          }

          setTimeout(() => {
            setToastMessage(null);
          }, 5000);
        }
      } else if (flagReportType === "ai_slop") {
        const flagReasonVal =
          flagReasonInput.trim() || "AI Slop / Low-quality AI-generated content";
        const updated = students.map((s) => {
          if (s.id === studentId) {
            return {
              ...s,
              flagged: true,
              flagReason: flagReasonVal,
            };
          }
          return s;
        });
        setStudents(updated);
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent({ ...selectedStudent, flagged: true, flagReason: flagReasonVal });
        }

        const targetStudent = students.find((s) => s.id === studentId);
        if (targetStudent) {
          const subjectStudent = "IEEE UCF Resume Database Profile Flagged (AI Slop)";
          const bodyStudent = `Hello ${targetStudent.name},\n\nYour profile has been flagged by an administrator for AI-generated content / low-quality slop:\n"${flagReasonVal}"\n\nYour profile is currently hidden from public directory searches. Please review and update your profile content. If you believe this is a mistake, contact ta616249@ucf.edu.\n\nBest,\nUCF IEEE Admin Team`;

          const subjectAdmin = `[MRD Audit] Profile Flagged for AI Slop: ${targetStudent.name}`;
          const bodyAdmin = `Hello MRD Administrator,\n\nCandidate ${targetStudent.name} (${targetStudent.email}) has been flagged for AI Slop / low-quality content.\n\nFlag Reason:\n"${flagReasonVal}"\n\nBest,\nUCF Member Resume Database System`;

          try {
            await Promise.all([
              sendDirectEmail({
                to: targetStudent.email,
                recipientType: "student",
                subject: subjectStudent,
                message: bodyStudent,
              }),
              sendDirectEmail({
                to: ADMIN_EMAIL,
                recipientType: "admin",
                subject: subjectAdmin,
                message: bodyAdmin,
              }),
            ]);

            setToastMessage(`AI Slop flag notifications emailed via Resend.`);
          } catch (err: any) {
            console.error("Resend AI Slop flag error:", err);
            setToastMessage(`Profile flagged, email notice: ${err?.message || "Check Resend key"}`);
          }

          setTimeout(() => {
            setToastMessage(null);
          }, 5000);
        }
      } else {
        const flagReasonVal = flagReasonInput.trim() || defaultReason;
        const updated = students.map((s) => {
          if (s.id === studentId) {
            return {
              ...s,
              flagged: true,
              flagReason: flagReasonVal,
            };
          }
          return s;
        });
        setStudents(updated);
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent({ ...selectedStudent, flagged: true, flagReason: flagReasonVal });
        }

        const targetStudent = students.find((s) => s.id === studentId);
        if (targetStudent) {
          const subjectAdmin = `[MRD Report] Candidate Profile Flagged: ${targetStudent.name}`;
          const bodyAdmin = `Hello MRD Administrator,\n\nA student profile has been flagged in the UCF Member Resume Database.\n\nCandidate Details:\n- Name: ${targetStudent.name}\n- Major: ${targetStudent.major}\n- Graduation: ${targetStudent.gradDate}\n- Flag Reason: ${flagReasonVal}\n- Reported By: ${role === "admin" ? "Administrator" : "Directory User"}\n\nThis profile has been flagged internally and hidden from standard directory searches pending your administrative review.\n\nBest,\nUCF Member Resume Database System`;

          const subjectStudent = `[MRD Notice] Your UCF Member Resume Database Profile Has Been Flagged`;
          const bodyStudent = `Hello ${targetStudent.name},\n\nYour profile in the UCF Member Resume Database has been flagged for administrative review.\n\nReason:\n"${flagReasonVal}"\n\nYour profile is currently pending review by the admin team. If you believe this is a mistake, contact ta616249@ucf.edu.\n\nBest,\nUCF Member Resume Database System`;

          try {
            await Promise.all([
              sendDirectEmail({
                to: ADMIN_EMAIL,
                recipientType: "admin",
                subject: subjectAdmin,
                message: bodyAdmin,
              }),
              targetStudent.email
                ? sendDirectEmail({
                    to: targetStudent.email,
                    recipientType: "student",
                    subject: subjectStudent,
                    message: bodyStudent,
                  })
                : Promise.resolve(),
            ]);

            setToastMessage(`Report submitted & emailed via Resend.`);
          } catch (err: any) {
            console.error("Resend general flag error:", err);
            setToastMessage(`Report submitted, email notice: ${err?.message || "Check Resend key"}`);
          }

          setTimeout(() => {
            setToastMessage(null);
          }, 5000);
        }
      }
    }

    setFlagDialog(null);
  };

  return {
    flagDialog,
    setFlagDialog,
    flagReasonInput,
    setFlagReasonInput,
    flagReportType,
    setFlagReportType,
    duplicateSearchQuery,
    setDuplicateSearchQuery,
    selectedDuplicateTargetIds,
    setSelectedDuplicateTargetIds,
    adminFlagChoice,
    setAdminFlagChoice,
    flagDialogRef,
    handleDeleteStudent,
    handleToggleFlagStudent,
    handleConfirmFlagAction,
  };
}
