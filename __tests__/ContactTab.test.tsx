import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactTab from "@/components/modal/tabs/ContactTab";
import { Student } from "@/data/students";
import * as emailLib from "@/lib/email";

// Mock email library
jest.mock("@/lib/email", () => ({
  sendDirectEmail: jest.fn().mockResolvedValue({ success: true }),
}));

const mockStudent: Student = {
  id: "student-1",
  name: "Marcus Vance",
  email: "marcus.vance@knights.ucf.edu",
  bio: "Computer Engineering senior passionate about robotics.",
  skills: ["Robotics", "C++", "ROS", "Embedded Systems"],
  links: [
    { name: "LinkedIn", text: "https://linkedin.com/in/marcus-vance" },
    { name: "GitHub", text: "https://github.com/marcusvance" },
    { name: "Portfolio", text: "https://marcusvance.dev" },
  ],
  education: [
    {
      schoolName: "University of Central Florida",
      degreeType: "Bachelor of Science",
      major: "Computer Engineering",
      startDate: "2022-08-20",
      current: true,
    },
  ],
  projects: [],
  workExperiences: [],
  clubs: [],
  certifications: [],
  major: "Computer Engineering",
  degree: "B.S.",
  gradDate: "May 2026",
  status: "Seeking Full-time",
  flagged: false,
};

describe("ContactTab Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders locked state when role is standard", () => {
    render(<ContactTab student={mockStudent} role="standard" />);
    expect(screen.getByText("Direct Candidate Messaging Locked")).toBeInTheDocument();
    expect(screen.getByText(/Sponsor access is required/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Learn More About Sponsoring/i })).toHaveAttribute(
      "href",
      "https://www.ieeeucf.com/sponsorships"
    );
  });

  it("renders verified channels, profile links, and outreach form for sponsor role", () => {
    render(<ContactTab student={mockStudent} role="sponsor" />);

    // Direct channels header
    expect(screen.getByText("Direct Candidate Outreach")).toBeInTheDocument();
    expect(screen.getByText("Verified Channels & Profiles")).toBeInTheDocument();
    expect(screen.getByText("Seeking Full-time")).toBeInTheDocument();
    expect(screen.getByText("marcus.vance@knights.ucf.edu")).toBeInTheDocument();

    // Profile links
    expect(screen.getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/marcus-vance"
    );
    expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/marcusvance"
    );
    expect(screen.getByRole("link", { name: /Portfolio/i })).toHaveAttribute(
      "href",
      "https://marcusvance.dev/"
    );

    // Form inputs
    expect(screen.getByPlaceholderText("e.g. Jane Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Lockheed Martin, TI, or Independent")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("jane@company.com")).toBeInTheDocument();
    expect(screen.getByText("Submit Direct Outreach Inquiry")).toBeInTheDocument();
  });

  it("copies student email to clipboard when Copy button is clicked", async () => {
    render(<ContactTab student={mockStudent} role="sponsor" />);
    const copyBtn = screen.getByRole("button", { name: /Copy/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("marcus.vance@knights.ucf.edu");
    await waitFor(() => {
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });
  });

  it("allows selecting an inquiry topic from the select dropdown", () => {
    render(<ContactTab student={mockStudent} role="sponsor" />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("Full-Time Opportunity");

    fireEvent.change(select, { target: { value: "Internship Interview" } });
    expect(select).toHaveValue("Internship Interview");
  });

  it("successfully submits outreach form and dispatches direct email notifications", async () => {
    render(<ContactTab student={mockStudent} role="admin" />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText("e.g. Jane Doe"), {
      target: { value: "Recruiter Sarah" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Lockheed Martin, TI, or Independent"), {
      target: { value: "Lockheed Martin" },
    });
    fireEvent.change(screen.getByPlaceholderText("jane@company.com"), {
      target: { value: "sarah@lockheed.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Tell us what technologies/i), {
      target: { value: "We would like to interview you for our robotics team." },
    });

    // Submit
    fireEvent.click(screen.getByText("Submit Direct Outreach Inquiry"));

    await waitFor(() => {
      expect(emailLib.sendDirectEmail).toHaveBeenCalledTimes(2);
    });

    // Check email to student
    expect(emailLib.sendDirectEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "marcus.vance@knights.ucf.edu",
        recipientType: "student",
        senderName: "Recruiter Sarah",
        senderEmail: "sarah@lockheed.com",
      })
    );

    // Check confirmation to recruiter
    expect(emailLib.sendDirectEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "sarah@lockheed.com",
        recipientType: "general",
      })
    );

    // Success confirmation banner
    await waitFor(() => {
      expect(
        screen.getByText(/Thank you! Your direct message to Marcus Vance has been delivered/i)
      ).toBeInTheDocument();
    });
  });
});
