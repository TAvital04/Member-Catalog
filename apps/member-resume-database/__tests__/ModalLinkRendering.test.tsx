import React from "react";
import { render, screen } from "@testing-library/react";
import StudentLowerInfo from "../components/modal/StudentLowerInfo";
import { INITIAL_STUDENTS } from "../data/students";

describe("Direct External Link Rendering", () => {
  const sampleStudent = INITIAL_STUDENTS[0];

  test("renders official resume link with target=_blank and rel=noopener noreferrer", () => {
    render(
      <StudentLowerInfo
        student={sampleStudent}
        adminMode={false}
      />
    );

    if (sampleStudent.resumeLink) {
      const resumeLinkElement = screen.getByRole("link", { name: /view official resume/i });
      expect(resumeLinkElement).toBeInTheDocument();
      expect(resumeLinkElement).toHaveAttribute("target", "_blank");
      expect(resumeLinkElement).toHaveAttribute("rel", "noopener noreferrer");
      expect(resumeLinkElement).toHaveAttribute("href", sampleStudent.resumeLink);
    }
  });

  test("renders external portfolio/profile links with target=_blank", () => {
    render(
      <StudentLowerInfo
        student={sampleStudent}
        adminMode={false}
      />
    );

    sampleStudent.links.forEach((linkItem) => {
      const externalLink = screen.getByRole("link", { name: linkItem.name });
      expect(externalLink).toBeInTheDocument();
      expect(externalLink).toHaveAttribute("target", "_blank");
      expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(externalLink).toHaveAttribute("href", linkItem.text);
    });
  });
});
