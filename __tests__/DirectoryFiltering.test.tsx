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

  test("renders DirectoryNavbar with Sign In link for standard users and role badge + Sign Out when authenticated", () => {
    const handleRoleChange = jest.fn();

    const { getAllByText, rerender } = render(
      <DirectoryNavbar
        role="standard"
        handleRoleChange={handleRoleChange}
      />
    );

    // Unauthenticated standard view shows Sign In link to /login
    const signInLinks = getAllByText("Sign In");
    expect(signInLinks.length).toBeGreaterThan(0);

    // Authenticated Sponsor view shows Sponsor badge and Sign Out button
    rerender(
      <DirectoryNavbar
        role="sponsor"
        handleRoleChange={handleRoleChange}
      />
    );
    expect(getAllByText("Sponsor").length).toBeGreaterThan(0);

    // Authenticated RSO Leadership (admin) view shows RSO Leadership badge and Sign Out
    rerender(
      <DirectoryNavbar
        role="admin"
        handleRoleChange={handleRoleChange}
      />
    );
    expect(getAllByText("RSO Leadership").length).toBeGreaterThan(0);

    const signOutButtons = screen.getAllByRole("button", { name: /Sign out/i });
    fireEvent.click(signOutButtons[0]);
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

  test("only filters names when searching in standard view, but matches skills and bio in sponsor view", () => {
    const studentAlice: Student = {
      ...sampleStudent,
      id: "std-alice",
      name: "Alice Knight",
      major: "Computer Engineering",
      bio: "Embedded systems specialist",
      skills: ["Rust", "Verilog"],
    };
    const studentBob: Student = {
      ...sampleStudent,
      id: "std-bob",
      name: "Bob Builder",
      major: "Electrical Engineering",
      bio: "Analog circuitry and RF enthusiast",
      skills: ["Python", "KiCad"],
    };

    // 1. In standard view, searching for "Python" (a skill) should NOT match Bob because the search bar only filters names
    const { result: standardSearchSkill } = renderHook(() =>
      useFilteredStudents({
        students: [studentAlice, studentBob],
        searchQuery: "Python",
        selectedMajors: [],
        selectedSkills: [],
        selectedGradDates: [],
        skillFilterMode: "OR",
        adminMode: false,
        adminFilterFlagged: null,
        sortBy: "points",
        hasFilterPermission: false,
        role: "standard",
      })
    );
    expect(standardSearchSkill.current.filteredStudents).toHaveLength(0);

    // 2. In standard view, searching for "Alice" (a name) DOES match Alice
    const { result: standardSearchName } = renderHook(() =>
      useFilteredStudents({
        students: [studentAlice, studentBob],
        searchQuery: "Alice",
        selectedMajors: [],
        selectedSkills: [],
        selectedGradDates: [],
        skillFilterMode: "OR",
        adminMode: false,
        adminFilterFlagged: null,
        sortBy: "points",
        hasFilterPermission: false,
        role: "standard",
      })
    );
    expect(standardSearchName.current.filteredStudents).toHaveLength(1);
    expect(standardSearchName.current.filteredStudents[0].id).toBe("std-alice");

    // 3. In sponsor view, searching for "Python" (a skill) DOES match Bob
    const { result: sponsorSearchSkill } = renderHook(() =>
      useFilteredStudents({
        students: [studentAlice, studentBob],
        searchQuery: "Python",
        selectedMajors: [],
        selectedSkills: [],
        selectedGradDates: [],
        skillFilterMode: "OR",
        adminMode: false,
        adminFilterFlagged: null,
        sortBy: "points",
        hasFilterPermission: true,
        role: "sponsor",
      })
    );
    expect(sponsorSearchSkill.current.filteredStudents).toHaveLength(1);
    expect(sponsorSearchSkill.current.filteredStudents[0].id).toBe("std-bob");
  });

  test("renders role-tailored search placeholder in DirectoryControlBar", () => {
    const { getByPlaceholderText, rerender } = render(
      <DirectoryControlBar
        searchQuery=""
        setSearchQuery={jest.fn()}
        sortBy="updated"
        setSortBy={jest.fn()}
        viewMode="grid"
        setViewMode={jest.fn()}
        role="standard"
        searchInputRef={{ current: null }}
      />
    );

    expect(getByPlaceholderText("Search by candidate name (Ctrl+K)...")).toBeInTheDocument();

    rerender(
      <DirectoryControlBar
        searchQuery=""
        setSearchQuery={jest.fn()}
        sortBy="updated"
        setSortBy={jest.fn()}
        viewMode="grid"
        setViewMode={jest.fn()}
        role="sponsor"
        searchInputRef={{ current: null }}
      />
    );

    expect(getByPlaceholderText("Search by candidate name, skill, coursework, bio (Ctrl+K)...")).toBeInTheDocument();
  });
});


