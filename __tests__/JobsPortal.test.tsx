import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JobsPage from "@/app/jobs/page";
import { SAMPLE_JOB_POSTINGS, SAMPLE_JOB_APPLICATIONS } from "@/data/jobs";

// Mock global fetch
global.fetch = jest.fn((url: string | URL | Request) => {
  const urlStr = url.toString();
  if (urlStr.includes("/api/jobs/applications")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, data: SAMPLE_JOB_APPLICATIONS }),
    });
  }
  if (urlStr.includes("/api/jobs")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, data: SAMPLE_JOB_POSTINGS }),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: [] }),
  });
}) as jest.Mock;

describe("Jobs Portal Page & Features", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders page header and portal view switchers", async () => {
    render(<JobsPage />);

    expect(screen.getByText("Engineering Opportunities Hub")).toBeInTheDocument();
    expect(screen.getByText(/Member Portal \(Browse & Apply\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Employer Portal \(Manage & Post\)/i)).toBeInTheDocument();
  });

  it("renders jobs list in Member view with filtering", async () => {
    render(<JobsPage />);

    // Wait for jobs to render
    await waitFor(() => {
      expect(screen.getByText(/Embedded Flight Software Engineering Intern/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Analog & Mixed-Signal IC Applications Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Lockheed Martin/i)).toBeInTheDocument();
    expect(screen.getByText(/Texas Instruments/i)).toBeInTheDocument();

    // Search filter
    const searchInput = screen.getByPlaceholderText(/Search by job title, company, skills/i);
    fireEvent.change(searchInput, { target: { value: "Flight" } });

    expect(screen.getByText(/Embedded Flight Software Engineering Intern/i)).toBeInTheDocument();
    expect(screen.queryByText(/Analog & Mixed-Signal IC Applications Engineer/i)).not.toBeInTheDocument();
  });

  it("switches to Employer view and allows managing postings", async () => {
    render(<JobsPage />);

    const employerBtn = screen.getByText(/Employer Portal \(Manage & Post\)/i);
    fireEvent.click(employerBtn);

    expect(screen.getByText("Employer Hiring Dashboard")).toBeInTheDocument();
    expect(screen.getByText("+ Post New Job Opportunity")).toBeInTheDocument();

    // Check applicant buttons
    await waitFor(() => {
      const applicantButtons = screen.getAllByText(/Review Applicants/i);
      expect(applicantButtons.length).toBeGreaterThan(0);
    });
  });

  it("opens Quick Job Post Modal with 1-click templates for employers", async () => {
    render(<JobsPage />);

    // Switch to employer mode
    fireEvent.click(screen.getByText(/Employer Portal \(Manage & Post\)/i));

    // Open post job modal
    fireEvent.click(screen.getByText("+ Post New Job Opportunity"));

    expect(screen.getByText("Post an Engineering Opportunity")).toBeInTheDocument();
    expect(screen.getByText(/1-Click Role Presets/i)).toBeInTheDocument();
    expect(screen.getByText(/Embedded Systems Intern/i)).toBeInTheDocument();
    expect(screen.getByText(/Hardware \/ PCB Design Engineer/i)).toBeInTheDocument();

    // Click template to autofill
    fireEvent.click(screen.getByText(/Hardware \/ PCB Design Engineer/i));

    expect(screen.getByDisplayValue(/Hardware Design & PCB Layout Engineer/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Engineering Partner/i)).toBeInTheDocument();
  });

  it("renders applicant pool analytics with metrics, skills, and funnel stages", async () => {
    render(<JobsPage />);

    // Switch to employer mode
    fireEvent.click(screen.getByText(/Employer Portal \(Manage & Post\)/i));

    // Wait for applications data to load
    await waitFor(() => {
      expect(screen.getByText(/Applicant Pool Analytics/i)).toBeInTheDocument();
    });

    // Switch to Analytics sub-tab
    fireEvent.click(screen.getByText(/Applicant Pool Analytics/i));

    // Verify aggregate analytics dashboard rendered
    expect(screen.getByText("Applicant Pool Analytics & Demographics")).toBeInTheDocument();
    expect(screen.getByText("Total Applications")).toBeInTheDocument();
    expect(screen.getByText(/unique candidates/i)).toBeInTheDocument();
    expect(screen.getByText("Interview/Offer Rate")).toBeInTheDocument();
    expect(screen.getByText("Top Degree")).toBeInTheDocument();
    expect(screen.getByText("Leading Cohort")).toBeInTheDocument();
    expect(screen.getByText(/Top Technical Skills/i)).toBeInTheDocument();
    expect(screen.getByText(/Academic Major Breakdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Recruitment Funnel/i)).toBeInTheDocument();

    // Verify per-job filtering in analytics
    const postingSelector = screen.getByRole("combobox", { name: "" }) || screen.getByDisplayValue(/All Active Postings/i);
    expect(postingSelector).toBeInTheDocument();
  });
});
