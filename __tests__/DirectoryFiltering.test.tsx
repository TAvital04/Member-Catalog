import React from "react";
import { render, screen, fireEvent, renderHook } from "@testing-library/react";
import StudentCard from "@/components/directory/StudentCard";
import DirectoryControlBar from "@/components/directory/DirectoryControlBar";
import { Student } from "@/data/students";
import { useFilteredStudents } from "@/hooks/useFilteredStudents";

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

import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import { studentHasSkill } from "@/lib/skillMatching";

describe("Directory Filtering & Component Rendering", () => {
  test("renders StudentCard correctly", () => {
    render(
      <StudentCard
        student={sampleStudent}
        onClick={jest.fn()}
        adminMode={false}
        onToggleFlag={jest.fn()}
      />
    );

    expect(screen.getByText("Test Candidate")).toBeInTheDocument();
  });

  test("renders DirectoryNavbar with permission levels switch and handles role changes", () => {
    const handleRoleChange = jest.fn();

    const { getAllByText } = render(
      <DirectoryNavbar
        role="standard"
        handleRoleChange={handleRoleChange}
      />
    );

    // Verify switch contains Standard, Sponsor, and Admin
    const standardButtons = getAllByText("Standard");
    const sponsorButtons = getAllByText("Sponsor");
    const adminButtons = getAllByText("Admin");
    expect(standardButtons.length).toBeGreaterThan(0);
    expect(sponsorButtons.length).toBeGreaterThan(0);
    expect(adminButtons.length).toBeGreaterThan(0);

    // Click Sponsor switch button
    fireEvent.click(sponsorButtons[0]);
    expect(handleRoleChange).toHaveBeenCalledWith("sponsor");

    // Click Admin switch button
    fireEvent.click(adminButtons[0]);
    expect(handleRoleChange).toHaveBeenCalledWith("admin");

    // Click Standard switch button
    fireEvent.click(standardButtons[0]);
    expect(handleRoleChange).toHaveBeenCalledWith("standard");
  });

  test("renders DirectoryControlBar with custom dropdown and interacts with sort options", () => {
    const handleSetSort = jest.fn();
    const handleSetSearch = jest.fn();

    const { getByRole, getByText, getByLabelText } = render(
      <DirectoryControlBar
        searchQuery=""
        setSearchQuery={handleSetSearch}
        sortBy="updated"
        setSortBy={handleSetSort}
        viewMode="grid"
        setViewMode={jest.fn()}
        role="standard"
        searchInputRef={{ current: null }}
      />
    );

    // Verify trigger shows "Recently Updated"
    expect(getByText("Recently Updated")).toBeInTheDocument();

    // Click sort button to open popover
    const sortButton = screen.getByRole("button", { name: /Sort: Recently Updated/i });
    fireEvent.click(sortButton);

    // Popover options are visible (primary options only, no manual reverse clutter)
    expect(getByText("Activity")).toBeInTheDocument();
    expect(getByText("Most Active Ever")).toBeInTheDocument();
    expect(getByText("Most Active in the Last 2 Weeks")).toBeInTheDocument();
    expect(getByText("Recently Created")).toBeInTheDocument();
    expect(getByText("GPA")).toBeInTheDocument();
    expect(screen.queryByText("Highest GPA")).not.toBeInTheDocument();
    expect(screen.queryByText("Name (A to Z)")).not.toBeInTheDocument();
    expect(screen.queryByText("Oldest Updated")).not.toBeInTheDocument();

    // Click "Recently Created"
    fireEvent.click(getByText("Recently Created"));
    expect(handleSetSort).toHaveBeenCalledWith("created");

    // Click reverse toggle button
    const reverseButton = getByLabelText("Reverse sort order");
    fireEvent.click(reverseButton);
    expect(handleSetSort).toHaveBeenCalledWith("updated-asc");
  });

  test("resiliently matches candidate skills against event and filter queries", () => {
    const studentSkills = [
      "C++",
      "C",
      "FreeRTOS",
      "Embedded Linux",
      "Altium Designer",
      "Soldering (SMD 0805/0603)",
    ];

    expect(studentHasSkill(studentSkills, "Altium Designer")).toBe(true);
    expect(studentHasSkill(studentSkills, "altium designer")).toBe(true);
    expect(studentHasSkill(studentSkills, "Altium")).toBe(true);
    expect(studentHasSkill(studentSkills, "Altium Designer 24")).toBe(true);
    expect(studentHasSkill(studentSkills, "Soldering")).toBe(true);
    expect(studentHasSkill(studentSkills, "SMD Soldering")).toBe(true);
    expect(studentHasSkill(studentSkills, "Surface Mount SMD Soldering (0603 & QFN Packages)")).toBe(true);
    expect(studentHasSkill(studentSkills, "FreeRTOS")).toBe(true);
    expect(studentHasSkill(studentSkills, "freertos")).toBe(true);
    expect(studentHasSkill(studentSkills, "Embedded C")).toBe(true);
    expect(studentHasSkill(studentSkills, "C")).toBe(true);
    expect(studentHasSkill(studentSkills, "C++ / C")).toBe(true);
    expect(studentHasSkill(studentSkills, "Bare-metal C++ on ARM Cortex-M Microcontrollers")).toBe(true);
    expect(studentHasSkill(studentSkills, "Rust")).toBe(false);
  });

  test("disables faceted filter evaluation when hasFilterPermission is false", () => {
    const studentA: Student = {
      ...sampleStudent,
      id: "std-a",
      skills: ["Python"],
    };
    const studentB: Student = {
      ...sampleStudent,
      id: "std-b",
      skills: ["Rust"],
    };

    // When hasFilterPermission is false (standard access), filters are ignored
    const { result: standardResult } = renderHook(() =>
      useFilteredStudents({
        students: [studentA, studentB],
        searchQuery: "",
        selectedMajors: [],
        selectedSkills: ["Python"],
        selectedGradDates: [],
        skillFilterMode: "OR",
        adminMode: false,
        adminFilterFlagged: null,
        sortBy: "points",
        hasFilterPermission: false,
      })
    );

    expect(standardResult.current.filteredStudents).toHaveLength(2);

    // When hasFilterPermission is true (elevated access), filters are evaluated
    const { result: elevatedResult } = renderHook(() =>
      useFilteredStudents({
        students: [studentA, studentB],
        searchQuery: "",
        selectedMajors: [],
        selectedSkills: ["Python"],
        selectedGradDates: [],
        skillFilterMode: "OR",
        adminMode: false,
        adminFilterFlagged: null,
        sortBy: "points",
        hasFilterPermission: true,
      })
    );

    expect(elevatedResult.current.filteredStudents).toHaveLength(1);
    expect(elevatedResult.current.filteredStudents[0].id).toBe("std-a");
  });

  test("filters candidates based on participated projects", () => {
    const studentWithProject: Student = {
      ...sampleStudent,
      id: "std-project",
      projects: [
        {
          name: "RSO Smart Campus IoT Beacon",
          description: "IoT beacon project",
          startDate: "2023-08-20",
          current: true,
          projectLinks: [],
        },
      ],
    };
    const studentWithoutProject: Student = {
      ...sampleStudent,
      id: "std-no-project",
      projects: [],
    };

    const { result } = renderHook(() =>
      useFilteredStudents({
        students: [studentWithProject, studentWithoutProject],
        searchQuery: "",
        selectedMajors: [],
        selectedSkills: [],
        selectedGradDates: [],
        selectedProjects: ["RSO Smart Campus IoT Beacon"],
        skillFilterMode: "OR",
        adminMode: false,
        adminFilterFlagged: null,
        sortBy: "points",
        hasFilterPermission: true,
      })
    );

    expect(result.current.filteredStudents).toHaveLength(1);
    expect(result.current.filteredStudents[0].id).toBe("std-project");
    expect(result.current.availableProjects).toContain("RSO Smart Campus IoT Beacon");
  });
});


