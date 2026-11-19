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

    expect(screen.getByText("RSO Micromouse Autonomous Maze Solver")).toBeInTheDocument();
    expect(screen.getByText("Robotics")).toBeInTheDocument();
    expect(screen.getByText(/Project Mission & Technical Overview/i)).toBeInTheDocument();
  });

  test("switches between interactive tabs (Tools, Timeline, People, Skills, Backer in standard role)", () => {
    render(
      <ProjectModal
        project={sampleProject}
        onClose={jest.fn()}
        role="standard"
      />
    );

    // Click Tools Tab
    const toolsTabButton = screen.getByRole("button", { name: /tools/i });
    fireEvent.click(toolsTabButton);
    expect(screen.getByText(/Tools & Tech Stack/i)).toBeInTheDocument();
    expect(screen.getByText("STM32F4 Cortex-M4")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /STM32F4 Cortex-M4/i })).toHaveAttribute(
      "href",
      expect.stringContaining("/?skills=")
    );

    // Click Timeline Tab
    const timelineTabButton = screen.getByRole("button", { name: /timeline/i });
    fireEvent.click(timelineTabButton);
    expect(screen.getByText(/Project Roadmap & Sprint Milestones/i)).toBeInTheDocument();

    // Click People Tab
    const teamTabButton = screen.getByRole("button", { name: /team/i });
    fireEvent.click(teamTabButton);
    expect(screen.getByText(/Student Team & Contributors/i)).toBeInTheDocument();
    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();

    // Click Back Tab (standard role)
    const backTabButton = screen.getByRole("button", { name: /^back$/i });
    fireEvent.click(backTabButton);
    expect(screen.getByText(/Project Target & Community Backing/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back This Project/i })).toBeInTheDocument();
  });

  test("renders Corporate Sponsor tab and corporate pledge form when role is sponsor", () => {
    render(
      <ProjectModal
        project={sampleProject}
        onClose={jest.fn()}
        role="sponsor"
      />
    );

    // Click Sponsor Tab (sponsor role)
    const sponsorTabButton = screen.getByRole("button", { name: /sponsor/i });
    fireEvent.click(sponsorTabButton);
    expect(screen.getByText(/Why Partner With This Project\?/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit Sponsorship Pledge/i })).toBeInTheDocument();
  });

  test("renders tools and skills as clickable filter links even in standard role", () => {
    render(
      <ProjectModal
        project={sampleProject}
        onClose={jest.fn()}
        initialTab="tools"
        role="standard"
      />
    );

    // Tools are clickable links to member filtering
    const stm32Link = screen.getByRole("link", { name: /STM32F4 Cortex-M4/i });
    expect(stm32Link).toHaveAttribute("href", "/?skills=STM32F4%20Cortex-M4");

    const freeRtosLink = screen.getByRole("link", { name: /FreeRTOS/i });
    expect(freeRtosLink).toHaveAttribute("href", "/?skills=FreeRTOS");

    // Skills are clickable links to member filtering
    const pcbSkillLink = screen.getByRole("link", { name: /Custom 4-Layer PCB Design in KiCAD/i });
    expect(pcbSkillLink).toHaveAttribute("href", "/?skills=Custom%204-Layer%20PCB%20Design%20in%20KiCAD");
  });
});
