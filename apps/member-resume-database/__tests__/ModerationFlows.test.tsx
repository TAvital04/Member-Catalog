import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FlagDialog from "../components/dialogs/FlagDialog";
import ResolveDialog from "../components/dialogs/ResolveDialog";
import { INITIAL_STUDENTS } from "../data/students";

describe("Moderation & Flagging Workflows", () => {
  const sampleStudents = [...INITIAL_STUDENTS];
  const targetStudent = sampleStudents[0];

  test("renders structured flag reason presets in FlagDialog", () => {
    const setFlagReasonInput = jest.fn();

    render(
      <FlagDialog
        flagDialog={{
          isOpen: true,
          studentId: targetStudent.id,
          studentName: targetStudent.name,
          isUnflagging: false,
          defaultReason: "",
        }}
        onClose={jest.fn()}
        adminFlagChoice="flag"
        setAdminFlagChoice={jest.fn()}
        flagReportType="other"
        setFlagReportType={jest.fn()}
        flagReasonInput=""
        setFlagReasonInput={setFlagReasonInput}
        duplicateSearchQuery=""
        setDuplicateSearchQuery={jest.fn()}
        selectedDuplicateTargetIds={[]}
        setSelectedDuplicateTargetIds={jest.fn()}
        students={sampleStudents}
        handleConfirmFlagAction={jest.fn()}
        handleDeleteStudent={jest.fn()}
        flagDialogRef={{ current: null }}
      />
    );

    // Preset buttons should be present
    expect(screen.getByText("Broken Resume Link")).toBeInTheDocument();
    expect(screen.getByText("Outdated Info / Graduated")).toBeInTheDocument();
    expect(screen.getByText("Inappropriate / Spam Content")).toBeInTheDocument();

    // Clicking a preset should invoke setFlagReasonInput
    fireEvent.click(screen.getByText("Broken Resume Link"));
    expect(setFlagReasonInput).toHaveBeenCalledWith("Broken Resume Link");
  });

  test("renders unflag and resolution options in ResolveDialog", () => {
    const handleResolveUnflag = jest.fn();

    const flaggedStudent = {
      ...targetStudent,
      flagged: true,
      flagReason: "Broken Resume Link",
    };

    render(
      <ResolveDialog
        resolveDialogStudent={flaggedStudent}
        onClose={jest.fn()}
        students={sampleStudents}
        selectedDuplicateIds={[]}
        setSelectedDuplicateIds={jest.fn()}
        handleResolveKeepAll={jest.fn()}
        handleResolveRemoveAll={jest.fn()}
        handleResolveKeepSelection={jest.fn()}
        handleResolveRemoveSelection={jest.fn()}
        handleResolveUnflag={handleResolveUnflag}
        handleResolveDelete={jest.fn()}
        resolveDialogRef={{ current: null }}
      />
    );

    expect(screen.getByText("Broken Resume Link")).toBeInTheDocument();
    
    const unflagButton = screen.getByRole("button", { name: /unflag/i });
    expect(unflagButton).toBeInTheDocument();

    fireEvent.click(unflagButton);
    expect(handleResolveUnflag).toHaveBeenCalledWith(flaggedStudent.id);
  });
});
