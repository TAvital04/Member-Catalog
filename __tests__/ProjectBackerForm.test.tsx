import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProjectBackerForm from "@/components/forms/ProjectBackerForm";
import { IEEEProject } from "@/data/projects";

describe("ProjectBackerForm Component", () => {
  const mockProject: IEEEProject = {
    id: "proj-drone-1",
    title: "Autonomous Quadcopter Swarm",
    slug: "autonomous-quadcopter-swarm",
    tagline: "Mesh-networking micro-UAVs coordinating autonomous formation flight.",
    description: "Autonomous swarm drone platform.",
    category: "Autonomous Systems",
    status: "Active",
    active: true,
    tools: [],
    timeline: [],
    skillsTaught: [],
    participants: [],
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders project backing heading, universal scope, and fields", () => {
    render(<ProjectBackerForm project={mockProject} />);

    // Heading and universal scope
    expect(screen.getByText("Project Target & Community Backing")).toBeInTheDocument();
    expect(screen.getByText(/direct support for student engineering/i)).toBeInTheDocument();

    // Fields
    expect(screen.getByLabelText(/Full Name \/ Handle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Email/i)).toBeInTheDocument();
    expect(screen.getByText("Your Affiliation")).toBeInTheDocument();
    expect(screen.getByLabelText(/Keep my backing anonymous/i)).toBeInTheDocument();
    expect(screen.getByText("Backing Focus")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back This Project/i })).toBeInTheDocument();
  });

  test("pre-fills backer credentials from session", () => {
    render(
      <ProjectBackerForm
        project={mockProject}
        session={{
          email: "alex.alum@usf.edu",
          displayName: "Alex Alum",
          accountType: "standard",
        }}
      />
    );

    expect(screen.getByDisplayValue("Alex Alum")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alex.alum@usf.edu")).toBeInTheDocument();
  });

  test("submits backing proposal and displays confirmation card", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const onSuccess = jest.fn();
    render(
      <ProjectBackerForm
        project={mockProject}
        session={{
          email: "alex.alum@usf.edu",
          displayName: "Alex Alum",
          accountType: "standard",
        }}
        onSuccess={onSuccess}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Back This Project/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Project Backing Transmitted")).toBeInTheDocument();
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

  test("validates required name and email before submitting", async () => {
    render(<ProjectBackerForm project={mockProject} />);

    const submitBtn = screen.getByRole("button", { name: /Back This Project/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Backer full name and contact email are required.")).toBeInTheDocument();
    });
  });
});
