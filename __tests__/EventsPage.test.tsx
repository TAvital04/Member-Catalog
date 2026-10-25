import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IEEEEventsPage from "@/app/events/page";
import EventModal from "@/components/modal/event/EventModal";
import { SAMPLE_IEEE_EVENTS } from "@/data/events";

// Mock fetch for /api/events
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          success: true,
          data: SAMPLE_IEEE_EVENTS,
        }),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("IEEE UCF Events Catalog & EventModal", () => {
  test("renders Events catalog page with header and event cards", async () => {
    render(<IEEEEventsPage />);

    expect(screen.getByText("IEEE UCF Events & Workshops")).toBeInTheDocument();
    expect(
      screen.getByText(/Explore upcoming and semester technical workshops/i)
    ).toBeInTheDocument();

    // Wait for events to load
    await waitFor(() => {
      expect(
        screen.getByText("Hands-On PCB Design & Altium Workshop")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Lockheed Martin Defense Electronics & Radar Systems Tech Talk")
      ).toBeInTheDocument();
    });
  });

  test("filters events by category pills", async () => {
    render(<IEEEEventsPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Hands-On PCB Design & Altium Workshop")
      ).toBeInTheDocument();
    });

    // Click 'Industry Tech Talk' category pill
    const industryPill = screen.getByRole("button", { name: "Industry Tech Talk" });
    fireEvent.click(industryPill);

    // Verify Industry talks are visible and PCB workshop is filtered out
    expect(
      screen.getByText("Lockheed Martin Defense Electronics & Radar Systems Tech Talk")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Hands-On PCB Design & Altium Workshop")
    ).not.toBeInTheDocument();
  });

  test("renders EventModal with technical outcomes and attending members roster", () => {
    const sampleEvent = SAMPLE_IEEE_EVENTS[1]; // PCB Design & Altium Workshop
    const handleClose = jest.fn();
    const handleSelectMember = jest.fn();

    render(
      <EventModal
        event={sampleEvent}
        onClose={handleClose}
        onSelectMember={handleSelectMember}
        students={[]}
      />
    );

    // Verify modal header and overview
    expect(
      screen.getByText("Hands-On PCB Design & Altium Workshop")
    ).toBeInTheDocument();
    expect(screen.getByText("RSO Innovation Lab (ENG2 135)")).toBeInTheDocument();
    expect(screen.getByText("Skills & Key Topics Covered")).toBeInTheDocument();

    // Switch to Attending Members tab
    const attendeesTab = screen.getByRole("button", { name: /Attending Members/i });
    fireEvent.click(attendeesTab);

    // Verify attending members are displayed
    expect(screen.getByText("Alex Rivera")).toBeInTheDocument();
    expect(screen.getByText("Ethan Wright")).toBeInTheDocument();

    // Click attendee to trigger profile view
    fireEvent.click(screen.getByText("Alex Rivera"));
    expect(handleSelectMember).toHaveBeenCalledWith("candidate-1");
  });
});
