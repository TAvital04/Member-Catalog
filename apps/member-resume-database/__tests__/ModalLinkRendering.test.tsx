import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PortfolioModal from "@/components/modal/PortfolioModal";
import { Student } from "@/data/students";

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
        onToggleFlag={jest.fn()}
        adminMode={false}
        role="standard"
      />
    );

    expect(screen.getAllByText("Test Candidate")[0]).toBeInTheDocument();
  });

  test("renders streamlined tabs: Chapter Projects, Events, and Contact", () => {
    const { getByRole } = render(
      <PortfolioModal
        student={sampleStudent}
        onClose={jest.fn()}
        onToggleFlag={jest.fn()}
        adminMode={false}
        role="standard"
      />
    );

    expect(getByRole("button", { name: /^projects$/i })).toBeInTheDocument();
    expect(getByRole("button", { name: /events/i })).toBeInTheDocument();
    expect(getByRole("button", { name: /contact/i })).toBeInTheDocument();
  });

  test("standard access locks direct contact tab with sponsor required banner", () => {
    const { getByRole, getByText } = render(
      <PortfolioModal
        student={sampleStudent}
        onClose={jest.fn()}
        onToggleFlag={jest.fn()}
        adminMode={false}
        role="standard"
      />
    );

    const contactTabButton = getByRole("button", { name: /contact/i });
    fireEvent.click(contactTabButton);

    expect(getByText("Direct Candidate Messaging Locked")).toBeInTheDocument();
  });

  test("sponsor access unlocks email contact features without admin privileges", () => {
    const { getByRole, queryByText } = render(
      <PortfolioModal
        student={sampleStudent}
        onClose={jest.fn()}
        onToggleFlag={jest.fn()}
        adminMode={false}
        role="sponsor"
      />
    );

    // Verify Contact tab is unlocked for direct candidate emailing
    const contactTabButton = getByRole("button", { name: /contact/i });
    fireEvent.click(contactTabButton);

    // Locked banner should NOT be present
    expect(queryByText("Direct Candidate Messaging Locked")).not.toBeInTheDocument();

    // Recruiter form fields should be available
    expect(screen.getByPlaceholderText(/e\.g\. Recruiter Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/recruiter@company\.com/i)).toBeInTheDocument();
    expect(getByRole("button", { name: /send direct message/i })).toBeInTheDocument();
  });
});
