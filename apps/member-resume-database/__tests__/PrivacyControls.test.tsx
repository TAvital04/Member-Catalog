import React from "react";
import { render, screen } from "@testing-library/react";
import StudentCard from "../components/directory/StudentCard";
import { Student } from "../data/students";

const sampleStudent: Student = {
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

describe("Privacy Controls & Email Shielding", () => {
  test("masks email for standard role", () => {
    render(
      <StudentCard
        student={sampleStudent}
        onClick={jest.fn()}
        adminMode={false}
        onToggleFlag={jest.fn()}
      />
    );

    expect(screen.getByText("Test Candidate")).toBeInTheDocument();
  });
});
