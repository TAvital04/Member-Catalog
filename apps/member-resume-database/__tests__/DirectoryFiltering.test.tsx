import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StudentCard from "@/components/directory/StudentCard";
import DirectoryControlBar from "@/components/directory/DirectoryControlBar";
import { Student } from "@/data/students";

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
});

