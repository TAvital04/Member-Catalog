import React from "react";
import { render, screen } from "@testing-library/react";
import FlagDialog from "../components/dialogs/FlagDialog";
import ResolveDialog from "../components/dialogs/ResolveDialog";
import { Student } from "../data/students";

const targetStudent: Student = {
  id: "test-student-1",
  name: "Test Candidate",
  email: "candidate@knights.ucf.edu",
  bio: "UCF Engineering student",
  skills: ["React", "TypeScript"],
  links: [{ name: "GitHub", text: "https://github.com/test" }],
  education: [
    {
      schoolName: "University of Central Florida",
      degreeType: "Bachelor of Science",
      major: "Computer Science",
      startDate: "2022-08-20",
      current: true,
    },
  ],
  projects: [],
  workExperiences: [],
  clubs: [],
  certifications: [],
  major: "Computer Science",
  degree: "Bachelor of Science",
  gradDate: "May 2026",
  status: "Seeking Internship",
  flagged: false,
};

describe("Moderation & Flagging Workflows", () => {
  test("renders structured flag reason presets in FlagDialog", () => {
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
        flagReasonInput=""
        setFlagReasonInput={jest.fn()}
        onSubmitFlag={jest.fn()}
      />
    );

    expect(screen.getByText(/Flag Profile/i)).toBeInTheDocument();
  });

  test("renders ResolveDialog actions for flagged student", () => {
    render(
      <ResolveDialog
        student={{ ...targetStudent, flagged: true, flagReason: "Test flag reason" }}
        selectedDuplicateIds={[]}
        onClose={jest.fn()}
        onKeepAll={jest.fn()}
        onRemoveAll={jest.fn()}
        onKeepSelection={jest.fn()}
        onRemoveSelection={jest.fn()}
        onUnflag={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText(/Test Candidate/i)).toBeInTheDocument();
  });
});
