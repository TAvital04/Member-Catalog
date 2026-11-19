import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProjectSponsorshipForm from "@/components/forms/ProjectSponsorshipForm";
import { IEEEProject } from "@/data/projects";

describe("ProjectSponsorshipForm Component", () => {
  const mockProject: IEEEProject = {
    id: "proj-micromouse-001",
    title: "RSO Micromouse Autonomous Maze Solver",
    slug: "ieee-micromouse-autonomous-maze-solver",
    tagline: "High-speed autonomous robotics solving 16x16 maze grids.",
    description: "The RSO Micromouse is an autonomous, battery-powered robotics competition platform.",
    category: "Robotics",
    status: "Active",
    active: true,
    tools: [],
    timeline: [],
    skillsTaught: [],
    participants: [],
    sponsorshipInfo: {
      overview: "Sponsoring Micromouse equips students with high-precision components.",
      benefits: [],
    },
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders project snapshot and inputs with empty fields by default", () => {
    render(<ProjectSponsorshipForm project={mockProject} />);

    // Project snapshot
    expect(screen.getByText("RSO Micromouse Autonomous Maze Solver")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText(/Robotics/)).toBeInTheDocument();

    // Field labels
    expect(screen.getByLabelText(/Your Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company \/ Organization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work \/ Contact Email/i)).toBeInTheDocument();
    expect(screen.getByText("Sponsorship Focus")).toBeInTheDocument();
    expect(screen.getByLabelText(/Estimated Funding \/ Equipment Value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Collaboration Vision & Notes/i)).toBeInTheDocument();

    // Submit button
    expect(screen.getByRole("button", { name: /Submit Sponsorship Pledge/i })).toBeInTheDocument();
  });

  test("pre-fills sponsor credentials from active session", () => {
    render(
      <ProjectSponsorshipForm
        project={mockProject}
        session={{
          email: "partner@lockheedmartin.com",
          displayName: "Dr. Robert Vance",
          accountType: "sponsor",
          organization: "Lockheed Martin",
          sponsorId: "lockheed-martin",
        }}
      />
    );

    expect(screen.getByDisplayValue("Dr. Robert Vance")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Lockheed Martin")).toBeInTheDocument();
    expect(screen.getByDisplayValue("partner@lockheedmartin.com")).toBeInTheDocument();
  });

  test("submits sponsorship pledge and displays dispatched confirmation card", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const onSuccess = jest.fn();
    render(
      <ProjectSponsorshipForm
        project={mockProject}
        session={{
          email: "partner@lockheedmartin.com",
          displayName: "Dr. Robert Vance",
          accountType: "sponsor",
          organization: "Lockheed Martin",
        }}
        onSuccess={onSuccess}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Submit Sponsorship Pledge/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Sponsorship Proposal Dispatched")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/send-email",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    );

    expect(onSuccess).toHaveBeenCalled();
  });

  test("displays error message when required fields are missing", async () => {
    render(<ProjectSponsorshipForm project={mockProject} />);

    const submitBtn = screen.getByRole("button", { name: /Submit Sponsorship Pledge/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Sponsor full name and contact email are required.")
      ).toBeInTheDocument();
    });
  });
});
