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

  test("standard access disables skill clicking and does not render filter links", () => {
    const { getByRole, queryByText, queryByRole } = render(
      <PortfolioModal
        student={sampleStudent}
        onClose={jest.fn()}
        onToggleFlag={jest.fn()}
        adminMode={false}
        role="standard"
      />
    );

    // Navigate to Skills tab
    const skillsTabButton = getByRole("button", { name: /skills/i });
    fireEvent.click(skillsTabButton);

    // Filter invitation subtitle should NOT be present for standard role
    expect(queryByText("Click to filter candidates")).not.toBeInTheDocument();

    // Skills should NOT be links to /?skills=
    const reactLink = queryByRole("link", { name: /react/i });
    expect(reactLink).not.toBeInTheDocument();

    // Skills should still be displayed as badges
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  test("admin access enables skill clicking and renders filter links", () => {
    const { getByRole, getByText } = render(
      <PortfolioModal
        student={sampleStudent}
        onClose={jest.fn()}
        onToggleFlag={jest.fn()}
        adminMode={true}
        role="admin"
      />
    );

    // Navigate to Skills tab
    const skillsTabButton = getByRole("button", { name: /skills/i });
    fireEvent.click(skillsTabButton);

    // Filter subtitle should be visible for admin role
    expect(getByText("Click to filter candidates")).toBeInTheDocument();

    // Skills SHOULD be links with /?skills=
    const reactLink = getByRole("link", { name: /react/i });
    expect(reactLink).toHaveAttribute("href", "/?skills=React");
  });

  test("sponsor access enables skill clicking and unlocks email features without admin privileges", () => {
    const { getByRole, getByText, queryByText } = render(
      <PortfolioModal
        student={sampleStudent}
        onClose={jest.fn()}
        onToggleFlag={jest.fn()}
        adminMode={false}
        role="sponsor"
      />
    );

    // 1. Verify Skills tab is unlocked for filtering
    const skillsTabButton = getByRole("button", { name: /skills/i });
    fireEvent.click(skillsTabButton);
    expect(getByText("Click to filter candidates")).toBeInTheDocument();
    expect(getByRole("link", { name: /react/i })).toHaveAttribute("href", "/?skills=React");

    // 2. Verify Contact tab is unlocked for direct candidate emailing
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
