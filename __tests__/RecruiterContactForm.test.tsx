import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecruiterContactForm from "@/components/forms/RecruiterContactForm";
import { Student } from "@/data/students";

// Mock sendDirectEmail
jest.mock("@/lib/email", () => ({
  sendDirectEmail: jest.fn().mockResolvedValue({ success: true }),
}));

describe("RecruiterContactForm Component", () => {
  const mockStudent: Student = {
    id: "student-1",
    name: "Alex Rivera",
    major: "Computer Engineering",
    degree: "Bachelor of Science",
    gradDate: "May 2026",
    bio: "Robotics and firmware enthusiast.",
    skills: ["PCB Layout", "Altium Designer"],
    status: "Seeking Internship",
    links: [
      { name: "LinkedIn", text: "https://linkedin.com/in/alex-rivera" },
      { name: "GitHub", text: "https://github.com/alex-rivera" },
    ],
    education: [],
    workExperiences: [],
    clubs: [],
    projects: [],
    certifications: [],
    flagged: false,
    email: "arivera@knights.ucf.edu",
  };

  test("renders locked banner when role is 'standard'", () => {
    render(<RecruiterContactForm student={mockStudent} role="standard" />);

    expect(screen.getByText("Direct Candidate Messaging Locked")).toBeInTheDocument();
    expect(screen.getByText("Learn More About Sponsoring")).toBeInTheDocument();
  });

  test("renders multi-card outreach layout for sponsor role with candidate channels", () => {
    render(
      <RecruiterContactForm
        student={mockStudent}
        role="sponsor"
        session={{
          email: "recruiter@ti.com",
          displayName: "Sarah Connor",
          accountType: "sponsor",
          organization: "Texas Instruments",
          sponsorId: "texas-instruments",
        }}
      />
    );

    // Card 1: Candidate Contact
    expect(screen.getByText("Candidate Contact")).toBeInTheDocument();
    expect(screen.getByText("arivera@knights.ucf.edu")).toBeInTheDocument();
    expect(screen.getByText("Copy Email")).toBeInTheDocument();
    expect(screen.getByText("Open Mail")).toBeInTheDocument();

    // Card 2: Recruiter Credentials pre-filled from session
    expect(screen.getByText("Recruiter & Organization Identity")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sarah Connor")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Texas Instruments")).toBeInTheDocument();
    expect(screen.getByDisplayValue("recruiter@ti.com")).toBeInTheDocument();

    // Card 3: Message to Candidate
    expect(screen.getByText("Message to Alex Rivera (Optional)")).toBeInTheDocument();
    expect(screen.getByText("Submit Direct Outreach Inquiry")).toBeInTheDocument();
  });

  test("submits outreach inquiry and displays delivered confirmation state", async () => {
    const onSuccess = jest.fn();
    render(
      <RecruiterContactForm
        student={mockStudent}
        role="sponsor"
        session={{
          email: "recruiter@ti.com",
          displayName: "Sarah Connor",
          accountType: "sponsor",
          organization: "Texas Instruments",
          sponsorId: "texas-instruments",
        }}
        onSuccess={onSuccess}
      />
    );

    const submitBtn = screen.getByText("Submit Direct Outreach Inquiry");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Direct Message Delivered")).toBeInTheDocument();
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});
