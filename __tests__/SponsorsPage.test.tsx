import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SponsorsPage from "@/app/sponsors/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
  usePathname: () => "/sponsors",
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Corporate Sponsors Hub & Initiatives Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Sponsors catalog page with header and partner cards", async () => {
    render(<SponsorsPage />);

    expect(screen.getByText("Corporate Sponsors & Industry Initiatives")).toBeInTheDocument();
    expect(
      screen.getByText(/Explore active corporate partners supporting IEEE UCF build projects/i)
    ).toBeInTheDocument();

    // Verify all premier sponsors are displayed
    expect(screen.getByText("Lockheed Martin")).toBeInTheDocument();
    expect(screen.getByText("Texas Instruments")).toBeInTheDocument();
    expect(screen.getByText("L3Harris Technologies")).toBeInTheDocument();
    expect(screen.getByText("Northrop Grumman")).toBeInTheDocument();
    expect(screen.getByText("Siemens EDA")).toBeInTheDocument();
  });

  test("filters sponsors by tier pills", async () => {
    render(<SponsorsPage />);

    // Click Gold tier pill
    const goldPill = screen.getByRole("button", { name: "Gold" });
    fireEvent.click(goldPill);

    // Verify Gold partners visible, Platinum filtered out
    expect(screen.getByText("L3Harris Technologies")).toBeInTheDocument();
    expect(screen.getByText("Northrop Grumman")).toBeInTheDocument();
    expect(screen.queryByText("Texas Instruments")).not.toBeInTheDocument();
  });

  test("searches sponsors by keyword", async () => {
    render(<SponsorsPage />);

    const searchInput = screen.getByPlaceholderText(/Search sponsors by name, technology, or focus/i);
    fireEvent.change(searchInput, { target: { value: "Semiconductor" } });

    expect(screen.getByText("Texas Instruments")).toBeInTheDocument();
    expect(screen.queryByText("Lockheed Martin")).not.toBeInTheDocument();
  });

  test("navigates into sponsor detailed view and displays initiatives, workshops, jobs, skills, and student interactions", async () => {
    render(<SponsorsPage />);

    // Click on Lockheed Martin card
    const lockheedCard = screen.getByRole("button", { name: /View initiatives and interactions for Lockheed Martin/i });
    fireEvent.click(lockheedCard);

    // Verify detailed hub view is open
    expect(screen.getByText("Defense Electronics & Radar Tech Talks")).toBeInTheDocument();
    expect(screen.getByText(/Autonomous Systems & Robotics Sponsorship/i)).toBeInTheDocument();
    expect(screen.getByText(/Direct Defense Internship Pipeline/i)).toBeInTheDocument();

    // Switch to Workshops & Talks tab
    const workshopsTab = screen.getByRole("tab", { name: /Workshops & Talks/i });
    fireEvent.click(workshopsTab);

    expect(screen.getByText(/Lockheed Martin Defense Electronics & Radar Systems Tech Talk/i)).toBeInTheDocument();

    // Switch to Student Interactions tab
    const interactionsTab = screen.getByRole("tab", { name: /Interactions/i });
    fireEvent.click(interactionsTab);

    expect(screen.getByText("Engaged Members & Candidate Interactions")).toBeInTheDocument();
    expect(screen.getByText(/Students who attended technical workshops/i)).toBeInTheDocument();

    // Check for students who interacted with Lockheed Martin
    expect(screen.getByText("Ethan Wright")).toBeInTheDocument();

    // Test back button
    const backBtn = screen.getByRole("button", { name: /Back to All Chapter Sponsors/i });
    fireEvent.click(backBtn);

    // Verify returned to catalog list
    expect(screen.getByText("Texas Instruments")).toBeInTheDocument();
  });
});
