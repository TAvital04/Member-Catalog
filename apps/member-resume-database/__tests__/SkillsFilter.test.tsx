import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SkillsFilter from "../components/directory/filters/SkillsFilter";

describe("SkillsFilter Flat Tag Rendering", () => {
  const availableSkills = ["React", "Python", "TypeScript", "C++"];
  const selectedSkills = ["React"];
  const onSkillToggle = jest.fn();

  test("renders flat skill tags without categories", () => {
    render(
      <SkillsFilter
        availableSkills={availableSkills}
        selectedSkills={selectedSkills}
        onSkillToggle={onSkillToggle}
      />
    );

    // All available skills should be rendered as flat skill options
    availableSkills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });

    // Ensure no category headers are present
    expect(screen.queryByText("Software & Web")).not.toBeInTheDocument();
    expect(screen.queryByText("Hardware")).not.toBeInTheDocument();
  });

  test("calls onSkillToggle when a skill tag chip is clicked", () => {
    render(
      <SkillsFilter
        availableSkills={availableSkills}
        selectedSkills={selectedSkills}
        onSkillToggle={onSkillToggle}
      />
    );

    const pythonButton = screen.getByText("Python").closest("button");
    expect(pythonButton).toBeInTheDocument();

    fireEvent.click(pythonButton!);
    expect(onSkillToggle).toHaveBeenCalledWith("Python");
  });

  test("filters skills when typing in the search box", () => {
    render(
      <SkillsFilter
        availableSkills={availableSkills}
        selectedSkills={selectedSkills}
        onSkillToggle={onSkillToggle}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search skills...");
    fireEvent.change(searchInput, { target: { value: "Type" } });

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });
});
