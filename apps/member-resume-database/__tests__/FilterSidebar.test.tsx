import React from "react";
import { render, screen } from "@testing-library/react";
import FilterSidebar from "../components/directory/FilterSidebar";

describe("FilterSidebar Role Access & Locks", () => {
  const mockProps = {
    selectedMajors: [],
    setSelectedMajors: jest.fn(),
    selectedSkills: [],
    setSelectedSkills: jest.fn(),
    selectedGradDates: [],
    setSelectedGradDates: jest.fn(),
    skillFilterMode: "OR" as const,
    setSkillFilterMode: jest.fn(),
    adminMode: false,
    adminFilterFlagged: null,
    setAdminFilterFlagged: jest.fn(),
    availableMajors: ["Computer Science", "Information Technology"],
    availableSkills: ["React", "TypeScript", "Node.js"],
    availableGradDates: ["May 2026", "Dec 2027"],
    layout: "side" as const,
    role: "admin" as const,
  };

  test("renders normal active filters for admins", () => {
    render(<FilterSidebar {...mockProps} />);
    
    // Admins should see the Degree & Major filter section header
    expect(screen.getByText("Degree & Major")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
  });

  test("renders locked sponsor filter panel for standard role", () => {
    render(<FilterSidebar {...mockProps} role="standard" />);
    
    // Standard role should display lockout banners
    expect(screen.getByText("Advanced Filtering Locked")).toBeInTheDocument();
    expect(screen.getByText("Advanced Filters Locked")).toBeInTheDocument();
    expect(screen.getAllByText("Learn More About Sponsoring").length).toBe(2);
  });
});
