import React from "react";
import { render, screen } from "@testing-library/react";
import ProjectSponsorTab from "@/components/modal/project/tabs/ProjectSponsorTab";
import EventSponsorTab from "@/components/modal/event/tabs/EventSponsorTab";
import { IEEEProject } from "@/data/projects";
import { IEEEEvent } from "@/data/events";

describe("Sponsor Tab Concluded State Tests", () => {
  const activeProject: IEEEProject = {
    id: "proj-active-1",
    title: "Active Robotics Project",
    slug: "active-robotics-project",
    description: "An ongoing active student engineering project.",
    category: "Robotics",
    status: "Active",
    active: true,
    tools: [],
    timeline: [],
    skillsTaught: [],
    participants: [],
    sponsorshipInfo: {
      overview: "Support active student engineering.",
      benefits: [],
    },
  };

  const completedProject: IEEEProject = {
    id: "proj-completed-1",
    title: "Completed Mars Rover",
    slug: "completed-mars-rover",
    description: "A finished student engineering project.",
    category: "Robotics",
    status: "Completed",
    active: true,
    tools: [],
    timeline: [],
    skillsTaught: [],
    participants: [],
    sponsorshipInfo: {
      overview: "Sponsorship for this past project.",
      benefits: [],
    },
  };

  const upcomingEvent: IEEEEvent = {
    id: "evt-upcoming-1",
    title: "Upcoming PCB Workshop",
    slug: "upcoming-pcb-workshop",
    description: "A future workshop happening next year.",
    category: "Technical Workshop",
    location: "Innovation Lab",
    host: "Hardware Committee",
    pointsAwarded: 3,
    startTime: "2027-05-01T18:00:00Z",
    endTime: "2027-05-01T20:00:00Z",
    tags: ["PCB", "Soldering"],
    attendees: [],
    active: true,
  };

  const pastEvent: IEEEEvent = {
    id: "evt-past-1",
    title: "Past Altium Seminar",
    slug: "past-altium-seminar",
    description: "A completed past workshop from 2024.",
    category: "Technical Workshop",
    location: "Innovation Lab",
    host: "Hardware Committee",
    pointsAwarded: 3,
    startTime: "2024-05-01T18:00:00Z",
    endTime: "2024-05-01T20:00:00Z",
    tags: ["Altium"],
    attendees: [],
    active: true,
  };

  test("active project renders only ProjectBackerForm when not logged in as corporate sponsor", () => {
    render(<ProjectSponsorTab project={activeProject} role="standard" />);

    // Renders Project Backer tier
    expect(screen.getByRole("button", { name: /Back This Project/i })).toBeInTheDocument();
    expect(screen.getByText(/Project Target & Community Backing/i)).toBeInTheDocument();
    expect(screen.queryByText(/Has Concluded/i)).not.toBeInTheDocument();

    // Does NOT render corporate pledge button or corporate partner tier
    expect(screen.queryByRole("button", { name: /Submit Sponsorship Pledge/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Why Partner With This Project\?/i)).not.toBeInTheDocument();
  });

  test("active project renders only Corporate Sponsorship Partner Tier when logged in as corporate sponsor", () => {
    render(<ProjectSponsorTab project={activeProject} role="sponsor" />);

    // Renders Corporate Sponsorship tier
    expect(screen.getByRole("button", { name: /Submit Sponsorship Pledge/i })).toBeInTheDocument();
    expect(screen.getByText(/Why Partner With This Project\?/i)).toBeInTheDocument();
    expect(screen.queryByText(/Has Concluded/i)).not.toBeInTheDocument();

    // Does NOT render backer tier
    expect(screen.queryByRole("button", { name: /Back This Project/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Project Target & Community Backing/i)).not.toBeInTheDocument();
  });

  test("completed project disables sponsoring and displays clean unspecific concluded notice", () => {
    const onClose = jest.fn();
    render(<ProjectSponsorTab project={completedProject} onClose={onClose} />);

    // Does not show pledge button
    expect(screen.queryByRole("button", { name: /Submit Sponsorship Pledge/i })).not.toBeInTheDocument();

    // Displays unspecific concluded notice and redirect to active projects
    expect(screen.getByText("This Has Concluded")).toBeInTheDocument();
    expect(screen.getByText("Sponsorship Closed")).toBeInTheDocument();
    const seeMoreBtn = screen.getByText("See More Projects");
    expect(seeMoreBtn).toBeInTheDocument();
    expect(screen.queryByText(/Completed Mars Rover/i)).not.toBeInTheDocument();

    // Clicking See More Projects triggers modal close
    fireEvent.click(seeMoreBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("upcoming event renders EventBackerForm when not logged in as corporate sponsor", () => {
    render(<EventSponsorTab event={upcomingEvent} role="standard" />);

    expect(screen.getByRole("button", { name: /Back This Event/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Submit Event Sponsorship Inquiry/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Has Concluded/i)).not.toBeInTheDocument();
  });

  test("upcoming event renders corporate inquiry form when logged in as corporate sponsor", () => {
    render(<EventSponsorTab event={upcomingEvent} role="sponsor" />);

    expect(screen.getByRole("button", { name: /Submit Event Sponsorship Inquiry/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Back This Event/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Has Concluded/i)).not.toBeInTheDocument();
  });

  test("past/concluded event disables sponsoring and displays clean unspecific concluded notice", () => {
    const onClose = jest.fn();
    render(<EventSponsorTab event={pastEvent} onClose={onClose} />);

    // Does not show inquiry button
    expect(screen.queryByRole("button", { name: /Submit Event Sponsorship Inquiry/i })).not.toBeInTheDocument();

    // Displays unspecific concluded notice and redirect to events
    expect(screen.getByText("This Has Concluded")).toBeInTheDocument();
    expect(screen.getByText("Sponsorship Closed")).toBeInTheDocument();
    const seeMoreBtn = screen.getByText("See More Events");
    expect(seeMoreBtn).toBeInTheDocument();
    expect(screen.queryByText(/Past Altium Seminar/i)).not.toBeInTheDocument();

    // Clicking See More Events triggers modal close
    fireEvent.click(seeMoreBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
