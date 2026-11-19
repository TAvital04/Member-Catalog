import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventBackerForm from "@/components/forms/EventBackerForm";
import { IEEEEvent } from "@/data/events";

describe("EventBackerForm Component & Category Presets", () => {
  const workshopEvent: IEEEEvent = {
    id: "evt-workshop-1",
    title: "Hands-On PCB Design & Altium Workshop",
    slug: "pcb-design-altium-workshop",
    description: "Learn 4-layer PCB design, component placement, and surface-mount soldering.",
    category: "Technical Workshop",
    location: "Innovation Lab",
    host: "Hardware Committee",
    pointsAwarded: 5,
    startTime: "2027-02-15T18:00:00Z",
    endTime: "2027-02-15T21:00:00Z",
    tags: ["PCB", "Hardware", "Altium"],
    attendees: [],
    active: true,
  };

  const hackathonEvent: IEEEEvent = {
    id: "evt-hack-2",
    title: "IEEE 24-Hour Autonomous Hardware Hackathon",
    slug: "ieee-24hr-hardware-hackathon",
    description: "Annual hardware sprint competing for autonomous robotics and embedded prizes.",
    category: "Competition & Hackathon",
    location: "Engineering Atrium",
    host: "Competition Committee",
    pointsAwarded: 10,
    startTime: "2027-03-20T09:00:00Z",
    endTime: "2027-03-21T09:00:00Z",
    tags: ["Hackathon", "Robotics"],
    attendees: [],
    active: true,
  };

  const gbmEvent: IEEEEvent = {
    id: "evt-gbm-3",
    title: "Spring Kickoff General Body Meeting (GBM 1)",
    slug: "spring-kickoff-gbm-1",
    description: "Welcome new and returning engineers with free pizza and project demos.",
    category: "General Body Meeting",
    location: "HEC 101",
    host: "Executive Board",
    pointsAwarded: 3,
    startTime: "2027-01-10T18:00:00Z",
    endTime: "2027-01-10T20:00:00Z",
    tags: ["GBM", "Networking"],
    attendees: [],
    active: true,
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders dynamic workshop preset heading, scope, and options", () => {
    render(<EventBackerForm event={workshopEvent} />);

    // Heading and scope summary
    expect(screen.getByText("Workshop Materials & Student Lab Backing")).toBeInTheDocument();
    expect(screen.getByText(/direct support for hands-on technical training/i)).toBeInTheDocument();

    // Fields
    expect(screen.getByLabelText(/Full Name \/ Handle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Email/i)).toBeInTheDocument();
    expect(screen.getByText("Your Affiliation")).toBeInTheDocument();
    expect(screen.getByLabelText(/Keep my backing anonymous/i)).toBeInTheDocument();
    expect(screen.getByText("Backing Focus")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Spare lab equipment, soldering rework tools, or testing gear/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Additional Notes \(Optional\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Back This Event/i })).toBeInTheDocument();
  });

  test("renders dynamic hackathon preset heading and placeholder for Competition category", () => {
    render(<EventBackerForm event={hackathonEvent} />);

    expect(screen.getByText("Competition Hardware & Student Prize Backing")).toBeInTheDocument();
    expect(screen.getByText(/direct fuel for student engineering competitions/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contribution toward hackathon prizes, sensor packs/i)).toBeInTheDocument();
  });

  test("renders dynamic general body meeting preset for General Body Meeting category", () => {
    render(<EventBackerForm event={gbmEvent} />);

    expect(screen.getByText("General Body Meeting & Member Welcome Backing")).toBeInTheDocument();
    expect(screen.getByText(/meeting catering, refreshments, and hospitality/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Sponsoring meeting catering, pizza, drinks, snacks, or general support/i)).toBeInTheDocument();
  });

  test("pre-fills backer credentials from active session", () => {
    render(
      <EventBackerForm
        event={workshopEvent}
        session={{
          email: "sarah.mentor@industry.com",
          displayName: "Sarah Mentor",
          accountType: "standard",
        }}
      />
    );

    expect(screen.getByDisplayValue("Sarah Mentor")).toBeInTheDocument();
    expect(screen.getByDisplayValue("sarah.mentor@industry.com")).toBeInTheDocument();
  });

  test("submits backing pledge and renders confirmation card", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const onSuccess = jest.fn();
    render(<EventBackerForm event={workshopEvent} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/Full Name \/ Handle/i), {
      target: { value: "David Alum" },
    });
    fireEvent.change(screen.getByLabelText(/Contact Email/i), {
      target: { value: "david@alum.usf.edu" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Spare lab equipment, soldering rework tools/i), {
      target: { value: "Digital oscilloscope probe set" },
    });

    const submitBtn = screen.getByRole("button", { name: /Back This Event/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Event Backing Received!")).toBeInTheDocument();
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/send-email",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("Hands-On PCB Design & Altium Workshop"),
      })
    );
  });
});
