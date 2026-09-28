import { useState } from "react";
import { Student } from "../data/students";
import { useFocusTrap } from "../components/common/useFocusTrap";
import { sendDirectEmail } from "../lib/email";

interface UseResolveDialogManagerProps {
  students: Student[];
  setStudents: (students: Student[]) => void;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
  setToastMessage: (msg: string | null) => void;
}

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ta616249@ucf.edu";

export function useResolveDialogManager({
  students,
  setStudents,
  selectedStudent,
  setSelectedStudent,
  showConfirm,
  setToastMessage,
}: UseResolveDialogManagerProps) {
  const [resolveDialogStudent, setResolveDialogStudent] = useState<Student | null>(null);
  const [selectedDuplicateIds, setSelectedDuplicateIds] = useState<string[]>([]);

  const resolveDialogRef = useFocusTrap(!!resolveDialogStudent, () => setResolveDialogStudent(null));

  const handleOpenResolveDialog = (student: Student) => {
    setResolveDialogStudent(student);
    if (student.duplicateGroup) {
      setSelectedDuplicateIds([student.id]);
    } else {
      setSelectedDuplicateIds([]);
    }
  };

  const dispatchUnflagEmails = async (unflaggedStudents: Student[]) => {
    try {
      const emailPromises = unflaggedStudents.flatMap((student) => {
        const subjectStudent = "[IEEE UCF Resume Database] Profile Flag Resolved";
        const bodyStudent = `Hello ${student.name},\n\nGood news! Your candidate profile in the UCF Member Resume Database has been reviewed by an administrator and unflagged.\n\nYour profile is now active and restored to public directory searches.\n\nBest,\nUCF IEEE Admin Team`;

        const subjectAdmin = `[MRD Resolution] Candidate Profile Unflagged: ${student.name}`;
        const bodyAdmin = `Hello MRD Administrator,\n\nCandidate profile for ${student.name} (${student.email}) has been reviewed and unflagged.\n\nThe profile is now restored to active directory searches.\n\nBest,\nUCF Member Resume Database System`;

        return [
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
        ];
      });

      await Promise.all(emailPromises);
      setToastMessage(`Profile unflagged. Notification emails sent to student and admin (${ADMIN_EMAIL}).`);
    } catch (err: any) {
      console.error("Unflag email dispatch error:", err);
      setToastMessage(`Profile unflagged, email notice: ${err?.message || "Check Resend key"}`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const dispatchDeletionEmails = async (deletedStudents: Student[]) => {
    try {
      const emailPromises = deletedStudents.flatMap((student) => {
        const subjectStudent = "[IEEE UCF Resume Database] Profile Record Deleted";
        const bodyStudent = `Hello ${student.name},\n\nYour profile has been permanently deleted from the UCF Member Resume Database by an administrator.\n\nReason / Details:\n"${
          student.flagReason || "Administrative resolution / Profile record deletion"
        }"\n\nIf you believe this was performed in error or would like to re-submit your profile, please contact our administrative team directly at ta616249@ucf.edu.\n\nBest,\nUCF IEEE Admin Team`;

        const subjectAdmin = `[MRD Notice] Student Profile Deleted: ${student.name}`;
        const bodyAdmin = `Hello MRD Administrator,\n\nA student profile record has been deleted from the UCF Member Resume Database.\n\nDeleted Candidate Details:\n- Name: ${student.name}\n- Email: ${student.email}\n- Major: ${student.major}\n- Graduation: ${student.gradDate}\n- Flag/Deletion Reason: "${
          student.flagReason || "Administrative resolution / Profile record deletion"
        }"\n- Performed By: Administrator\n\nBest,\nUCF Member Resume Database System`;

        return [
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
        ];
      });

      await Promise.all(emailPromises);
      setToastMessage(`Profile record deleted. Notification emails sent to student and admin (${ADMIN_EMAIL}).`);
    } catch (err: any) {
      console.error("Deletion email dispatch error:", err);
      setToastMessage(`Profile deleted, email notice: ${err?.message || "Check Resend key"}`);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  const handleResolveKeepAll = async (duplicateGroup: string) => {
    const toUnflag = students.filter((s) => s.duplicateGroup === duplicateGroup);
    const updated = students.map((s) => {
      if (s.duplicateGroup === duplicateGroup) {
        return {
          ...s,
          flagged: false,
          duplicateGroup: undefined,
        };
      }
      return s;
    });
    setStudents(updated);
    setResolveDialogStudent(null);
    setSelectedStudent(null);
    await dispatchUnflagEmails(toUnflag);
  };

  const handleResolveRemoveAll = (duplicateGroup: string) => {
    const toDelete = students.filter((s) => s.duplicateGroup === duplicateGroup);

    showConfirm(
      "Delete All Duplicates",
      `Are you sure you want to permanently delete all ${toDelete.length} student profiles associated with this duplicate group? This action is irreversible and will send deletion emails to students and admin.`,
      async () => {
        const updated = students.filter((s) => s.duplicateGroup !== duplicateGroup);
        setStudents(updated);
        setResolveDialogStudent(null);
        setSelectedStudent(null);
        await dispatchDeletionEmails(toDelete);
      }
    );
  };

  const handleResolveKeepSelection = async (duplicateGroup: string, selectedIds: string[]) => {
    const toUnflag = students.filter(
      (s) => s.duplicateGroup === duplicateGroup && selectedIds.includes(s.id)
    );
    const updated = students
      .filter((s) => {
        if (s.duplicateGroup === duplicateGroup) {
          return selectedIds.includes(s.id);
        }
        return true;
      })
      .map((s) => {
        if (s.duplicateGroup === duplicateGroup) {
          return {
            ...s,
            flagged: false,
            duplicateGroup: undefined,
          };
        }
        return s;
      });
    setStudents(updated);
    setResolveDialogStudent(null);
    setSelectedStudent(null);
    await dispatchUnflagEmails(toUnflag);
  };

  const handleResolveRemoveSelection = (duplicateGroup: string, selectedIds: string[]) => {
    const toDelete = students.filter(
      (s) => s.duplicateGroup === duplicateGroup && selectedIds.includes(s.id)
    );

    showConfirm(
      "Delete Selected Duplicates",
      `Are you sure you want to permanently delete the ${selectedIds.length} selected duplicate profiles? This action is irreversible and will send deletion emails.`,
      async () => {
        const updated = students
          .filter((s) => {
            if (s.duplicateGroup === duplicateGroup) {
              return !selectedIds.includes(s.id);
            }
            return true;
          })
          .map((s) => {
            if (s.duplicateGroup === duplicateGroup) {
              return {
                ...s,
                flagged: false,
                duplicateGroup: undefined,
              };
            }
            return s;
          });
        setStudents(updated);
        setResolveDialogStudent(null);
        setSelectedStudent(null);
        await dispatchDeletionEmails(toDelete);
      }
    );
  };

  const handleResolveUnflag = async (studentId: string) => {
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
    setResolveDialogStudent(null);
    setSelectedStudent(null);

    if (targetStudent) {
      await dispatchUnflagEmails([targetStudent]);
    }
  };

  const handleResolveDelete = (student: Student) => {
    showConfirm(
      "Confirm Profile Deletion",
      `Are you sure you want to permanently delete ${student.name}'s profile? This action is irreversible and will send deletion notification emails.`,
      async () => {
        const updated = students.filter((s) => s.id !== student.id);
        setStudents(updated);
        setResolveDialogStudent(null);
        setSelectedStudent(null);
        await dispatchDeletionEmails([student]);
      }
    );
  };

  return {
    resolveDialogStudent,
    setResolveDialogStudent,
    selectedDuplicateIds,
    setSelectedDuplicateIds,
    resolveDialogRef,
    handleOpenResolveDialog,
    handleResolveKeepAll,
    handleResolveRemoveAll,
    handleResolveKeepSelection,
    handleResolveRemoveSelection,
    handleResolveUnflag,
    handleResolveDelete,
  };
}
