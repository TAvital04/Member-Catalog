import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IEEEProjectsPage from "@/app/projects/page";
import { SAMPLE_IEEE_PROJECTS } from "@/data/projects";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
  usePathname: () => "/projects",
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          success: true,
          data: SAMPLE_IEEE_PROJECTS,
        }),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Projects Page - Skills / Tech Stack Direct Navigation", () => {
  test("renders +X more as an interactive button and clicking it opens the Tools & Skills tab in ProjectModal", async () => {
    render(<IEEEProjectsPage />);

    // Wait for project cards to load
    await waitFor(() => {
      expect(screen.getByText("RSO Micromouse Autonomous Maze Solver")).toBeInTheDocument();
    });

    // Find the +X more button on the Micromouse project card (it has 8 tools, 4 displayed, 4 more)
    const showMoreToolsBtn = screen.getByRole("button", {
      name: /Show more tools and skills for RSO Micromouse Autonomous Maze Solver/i,
    });
    expect(showMoreToolsBtn).toBeInTheDocument();
    expect(showMoreToolsBtn).toHaveTextContent("+4 more");

    // Click +4 more
    fireEvent.click(showMoreToolsBtn);

    // Verify ProjectModal opens directly on the Tools & Skills tab
    await waitFor(() => {
      expect(screen.getByText("Tools & Tech Stack (8)")).toBeInTheDocument();
      expect(screen.getByText(/Skills & Engineering Competencies/i)).toBeInTheDocument();
    });

    // Verify tools from the full stack are displayed in the modal
    expect(screen.getAllByText("STM32F4 Cortex-M4").length).toBeGreaterThan(1);
    // SolidWorks CAD was not in the 4 preview tags on the card, only in the full modal tools tab
    expect(screen.getByText("SolidWorks CAD")).toBeInTheDocument();
  });

  test("clicking Key Tech Stack header button opens Tools & Skills tab directly", async () => {
    render(<IEEEProjectsPage />);

    await waitFor(() => {
      expect(screen.getByText("RSO Micromouse Autonomous Maze Solver")).toBeInTheDocument();
    });

    const techStackHeaderBtn = screen.getByRole("button", {
      name: /Key Tech Stack \(8\)/i,
    });
    expect(techStackHeaderBtn).toBeInTheDocument();

    fireEvent.click(techStackHeaderBtn);

    await waitFor(() => {
      expect(screen.getByText("Tools & Tech Stack (8)")).toBeInTheDocument();
    });
  });
});
