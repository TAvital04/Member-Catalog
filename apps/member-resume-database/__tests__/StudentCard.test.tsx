import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StudentCard from "../components/directory/StudentCard";
import { Student } from "../data/students";

describe("StudentCard Rendering & Actions", () => {
  const mockStudent: Student = {
    id: "test-student-1",
    name: "Alex Rivera",
    major: "Computer Science",
    degree: "Bachelor of Science",
    gradDate: "May 2026",
    bio: "Passionate CS student.",
    skills: ["React", "TypeScript"],
    status: "Seeking Internship",
    links: [],
    education: [],
    workExperiences: [],
    clubs: [],
    projects: [],
    certifications: [],
    flagged: true,
    flagReason: "Incomplete details",
    email: "alex@Rivera.com",
  };

  const mockOnClick = jest.fn();
  const mockOnToggleFlag = jest.fn();

  test("renders standard student card with info", () => {
    render(
      <StudentCard
        student={mockStudent}
        onClick={mockOnClick}
        adminMode={false}
        onToggleFlag={mockOnToggleFlag}
      />
    );

    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Grad: May 2026")).toBeInTheDocument();
  });

  test("triggers click events when card is selected", () => {
    render(
      <StudentCard
        student={mockStudent}
        onClick={mockOnClick}
        adminMode={false}
        onToggleFlag={mockOnToggleFlag}
      />
    );

    // Click on the student name element which is part of the card
    fireEvent.click(screen.getByText("Alex Rivera"));
    expect(mockOnClick).toHaveBeenCalledWith(mockStudent);
  });
});
