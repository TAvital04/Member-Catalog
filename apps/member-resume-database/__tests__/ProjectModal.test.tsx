import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectModal from "@/components/modal/project/ProjectModal";
import { SAMPLE_IEEE_PROJECTS } from "@/data/projects";

describe("ProjectModal Component & Interactive Tabs", () => {
  const sampleProject = SAMPLE_IEEE_PROJECTS[0]; // IEEE Micromouse

  test("renders project title, category, and quick stats in ProjectModal", () => {
    render(
      <ProjectModal
        project={sampleProject}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText("IEEE Micromouse Autonomous Maze Solver")).toBeInTheDocument();
    expect(screen.getByText("Robotics")).toBeInTheDocument();
    expect(screen.getByText(/Project Mission & Technical Overview/i)).toBeInTheDocument();
  });

  test("switches between interactive tabs (Tools, Timeline, People, Skills, Sponsor)", () => {
    render(
      <ProjectModal
        project={sampleProject}
        onClose={jest.fn()}
      />
    );

    // Click Tools Tab
    const toolsTabButton = screen.getByRole("button", { name: /tools/i });
    fireEvent.click(toolsTabButton);
    expect(screen.getByText(/Tools, Hardware & Tech Stack/i)).toBeInTheDocument();
    expect(screen.getByText("STM32F4 Cortex-M4")).toBeInTheDocument();

    // Click Timeline Tab
    const timelineTabButton = screen.getByRole("button", { name: /timeline/i });
    fireEvent.click(timelineTabButton);
    expect(screen.getByText(/Project Roadmap & Sprint Milestones/i)).toBeInTheDocument();

    // Click People Tab
    const teamTabButton = screen.getByRole("button", { name: /team/i });
    fireEvent.click(teamTabButton);
    expect(screen.getByText(/Student Team & Contributors/i)).toBeInTheDocument();
    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();

    // Click Skills Taught Tab
    const skillsTabButton = screen.getByRole("button", { name: /skills taught/i });
    fireEvent.click(skillsTabButton);
    expect(screen.getByText(/Skills Taught & Engineering Competencies/i)).toBeInTheDocument();
    expect(screen.getByText(/Custom 4-Layer PCB Design in KiCAD/i)).toBeInTheDocument();

    // Click Sponsor Benefits Tab
    const sponsorTabButton = screen.getByRole("button", { name: /sponsor benefits/i });
    fireEvent.click(sponsorTabButton);
    expect(screen.getByText(/Sponsorship Opportunities & Partner Benefits/i)).toBeInTheDocument();
    expect(screen.getByText(/Branding on Robot Carbon-Fiber Chassis/i)).toBeInTheDocument();
  });

  test("renders direct sponsorship inquiry form with input fields", () => {
    render(
      <ProjectModal
        project={sampleProject}
        onClose={jest.fn()}
        initialTab="sponsor"
      />
    );

    expect(screen.getByPlaceholderText(/e\.g\. Dr\. Jane Smith/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contact@company\.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Sponsorship Inquiry/i })).toBeInTheDocument();
  });
});
