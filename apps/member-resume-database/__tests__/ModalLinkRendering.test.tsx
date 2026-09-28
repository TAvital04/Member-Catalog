import React from "react";
import { render, screen } from "@testing-library/react";
import PortfolioModal from "../components/modal/PortfolioModal";
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

describe("Portfolio Modal Link & Tab Rendering", () => {
  test("renders student name and primary info in PortfolioModal", () => {
    render(
      <PortfolioModal
        student={sampleStudent}
        onClose={jest.fn()}
        onFlag={jest.fn()}
        onUnflag={jest.fn()}
        role="standard"
      />
    );

    expect(screen.getByText("Test Candidate")).toBeInTheDocument();
  });
});
