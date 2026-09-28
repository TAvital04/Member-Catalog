import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PortfolioModal from "../components/modal/PortfolioModal";
import { INITIAL_STUDENTS } from "../data/students";

describe("Student Privacy Controls & Sponsor Lock Paywall", () => {
  const sampleStudent = INITIAL_STUDENTS[0];

  test("renders contact tab with sponsor lock paywall for standard role users", () => {
    render(
      <PortfolioModal
        student={sampleStudent}
        onClose={jest.fn()}
        adminMode={false}
        role="standard"
      />
    );

    const contactButton = screen.getByRole("button", { name: /contact/i });
    expect(contactButton).toBeInTheDocument();

    fireEvent.click(contactButton);

    // Standard role users should see the locked messaging banner and sponsorship link
    expect(screen.getByText("Direct Candidate Messaging Locked")).toBeInTheDocument();
    expect(screen.getByText("Learn More About Sponsoring")).toBeInTheDocument();
    expect(screen.queryByText("Send Direct Message")).not.toBeInTheDocument();
  });

  test("renders active contact form for admin users", () => {
    render(
      <PortfolioModal
        student={sampleStudent}
        onClose={jest.fn()}
        adminMode={true}
        role="admin"
      />
    );

    const contactButton = screen.getByRole("button", { name: /contact/i });
    fireEvent.click(contactButton);

    // Admin role users should see the active message form
    expect(screen.getByText("Send Direct Message")).toBeInTheDocument();
  });
});
