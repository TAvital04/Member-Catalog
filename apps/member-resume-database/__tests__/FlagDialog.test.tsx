import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FlagDialog from "../components/dialogs/FlagDialog";
import { Student } from "../data/students";

describe("FlagDialog AI Slop Report Type", () => {
  const mockStudent: Student = {
    id: "student-1",
    name: "Jane Doe",
    major: "Computer Engineering",
    degree: "Bachelor of Science",
    gradDate: "May 2026",
    bio: "AI Researcher",
    skills: ["Python", "PyTorch"],
    status: "Seeking Full-time",
    links: [],
    education: [],
    workExperiences: [],
    clubs: [],
    projects: [],
    certifications: [],
    flagged: false,
    email: "jane.doe@ucf.edu",
  };

  const defaultProps = {
    flagDialog: {
      isOpen: true,
      studentId: "student-1",
      studentName: "Jane Doe",
      isUnflagging: false,
      defaultReason: "Flagged profile",
    },
    onClose: jest.fn(),
    adminFlagChoice: null,
    setAdminFlagChoice: jest.fn(),
    flagReportType: "other" as const,
    setFlagReportType: jest.fn(),
    flagReasonInput: "",
    setFlagReasonInput: jest.fn(),
    duplicateSearchQuery: "",
    setDuplicateSearchQuery: jest.fn(),
    selectedDuplicateTargetIds: [],
    setSelectedDuplicateTargetIds: jest.fn(),
    students: [mockStudent],
    handleConfirmFlagAction: jest.fn(),
    handleDeleteStudent: jest.fn(),
    flagDialogRef: React.createRef<HTMLDivElement>(),
  };

  test("renders AI Slop button option in Report Type choices", () => {
    render(<FlagDialog {...defaultProps} />);

    expect(screen.getByRole("button", { name: "AI Slop" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Duplicate Entry" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Other" })).toBeInTheDocument();
  });

  test("clicking AI Slop report type calls setFlagReportType with 'ai_slop'", () => {
    render(<FlagDialog {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "AI Slop" }));
    expect(defaultProps.setFlagReportType).toHaveBeenCalledWith("ai_slop");
  });

  test("renders AI Slop header and input when flagReportType is 'ai_slop'", () => {
    render(<FlagDialog {...defaultProps} flagReportType="ai_slop" />);

    expect(screen.getByText("Reporting AI Slop / Generated Content")).toBeInTheDocument();
    expect(screen.getByText("Reason for Flagging AI Slop")).toBeInTheDocument();
  });
});
