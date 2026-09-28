import React from "react";
import { render, screen } from "@testing-library/react";
import StudentCard from "../components/directory/StudentCard";
import ActiveFiltersBar from "../components/directory/ActiveFiltersBar";
import { INITIAL_STUDENTS } from "../data/students";

describe("Directory Candidate Cards & Active Filter Chips", () => {
  const sampleStudent = INITIAL_STUDENTS[0];

  test("renders candidate card with name, major, and graduation date", () => {
    render(
      <StudentCard
        student={sampleStudent}
        onClick={jest.fn()}
        adminMode={false}
      />
    );

    expect(screen.getByText(sampleStudent.name)).toBeInTheDocument();
    expect(screen.getByText(sampleStudent.major)).toBeInTheDocument();
    expect(screen.getByText(`Grad: ${sampleStudent.gradDate}`)).toBeInTheDocument();
  });

  test("renders active filter chips and clear all button", () => {
    const removeMajorFilter = jest.fn();
    const onClearAll = jest.fn();

    render(
      <ActiveFiltersBar
        selectedMajors={["Computer Science"]}
        removeMajorFilter={removeMajorFilter}
        selectedGradDates={["May 2026"]}
        removeGradFilter={jest.fn()}
        selectedSkills={["React"]}
        removeSkillFilter={jest.fn()}
        selectedBadges={[]}
        removeBadgeFilter={jest.fn()}
        onClearAll={onClearAll}
      />
    );

    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("May 2026")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();

    const clearAllButton = screen.getByRole("button", { name: /clear all/i });
    expect(clearAllButton).toBeInTheDocument();
  });
});
