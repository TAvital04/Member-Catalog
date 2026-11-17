import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LeadershipEventForm from "@/components/forms/LeadershipEventForm";
import { POST as postEvent } from "@/app/api/events/route";

describe("LeadershipEventForm (Form 2: Event & Workshop Creation)", () => {
  const mockOnClose = jest.fn();
  const mockOnEventCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Form 2 with header, classification, and workshop skills without points, rsvp, or manual attendance", () => {
    render(
      <LeadershipEventForm
        role="admin"
        onClose={mockOnClose}
        onEventCreated={mockOnEventCreated}
      />
    );

    expect(screen.getByText("RSO Leadership • Form 2")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Create Chapter Event / Workshop" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Title/i)).toBeInTheDocument();
    expect(screen.getByText("Category *")).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Description & Syllabus/i)).toBeInTheDocument();
    expect(screen.getByText("2. Skills Awarded to Attendees")).toBeInTheDocument();

    // Verify removed fields
    expect(screen.queryByLabelText(/Chapter Points/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/RSVP/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Member Attendance Check-In Roster/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Suggestions:/i)).not.toBeInTheDocument();
  });

  test("validates required fields before submitting", async () => {
    render(
      <LeadershipEventForm
        role="admin"
        onClose={mockOnClose}
        onEventCreated={mockOnEventCreated}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /^Create Event$/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Please enter an Event Title/i)).toBeInTheDocument();
    expect(mockOnEventCreated).not.toHaveBeenCalled();
  });

  test("allows adding and removing workshop skill tags", () => {
    render(
      <LeadershipEventForm
        role="admin"
        onClose={mockOnClose}
        onEventCreated={mockOnEventCreated}
      />
    );

    // Initial skills should be empty
    expect(screen.getByText(/No skills added yet/i)).toBeInTheDocument();

    // Add PCB Layout via input
    const input = screen.getByPlaceholderText(/Type a skill tag/i);
    fireEvent.change(input, { target: { value: "PCB Layout" } });
    const addBtn = screen.getByRole("button", { name: /Add Tag/i });
    fireEvent.click(addBtn);

    expect(screen.getByText("PCB Layout")).toBeInTheDocument();

    // Remove PCB Layout
    const removeBtn = screen.getByLabelText("Remove PCB Layout");
    fireEvent.click(removeBtn);
    expect(screen.queryByText("PCB Layout")).not.toBeInTheDocument();

    // Add FreeRTOS via input
    fireEvent.change(input, { target: { value: "FreeRTOS" } });
    fireEvent.click(addBtn);

    expect(screen.getByText("FreeRTOS")).toBeInTheDocument();
  });

  test("informs that member attendance is automatic and does not render manual check-in roster", () => {
    render(
      <LeadershipEventForm
        role="admin"
        onClose={mockOnClose}
        onEventCreated={mockOnEventCreated}
      />
    );

    expect(
      screen.getAllByText(/Member attendance is logged automatically/i)[0]
    ).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/Search members/i)).not.toBeInTheDocument();
  });

  test("submits successfully and calls onEventCreated callback", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              id: "evt-test-123",
              title: "Advanced STM32 Embedded Systems Lab",
              category: "Technical Workshop",
              description: "Deep dive into real-time RTOS firmware programming and hardware timers.",
              attendees: [],
            },
          }),
      })
    ) as jest.Mock;

    render(
      <LeadershipEventForm
        role="admin"
        onClose={mockOnClose}
        onEventCreated={mockOnEventCreated}
      />
    );

    fireEvent.change(screen.getByLabelText(/Event Title/i), {
      target: { value: "Advanced STM32 Embedded Systems Lab" },
    });
    fireEvent.change(screen.getByLabelText(/Event Description & Syllabus/i), {
      target: { value: "Deep dive into real-time RTOS firmware programming and hardware timers." },
    });

    const submitBtn = screen.getByRole("button", { name: /^Create Event$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockOnEventCreated).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  test("renders Event Leads & Instructors section and handles candidate assignment", () => {
    const mockStudents = [
      {
        id: "mem-01",
        name: "Alex Rivera",
        email: "arivera@ucf.edu",
        major: "Electrical Engineering",
        degree: "BS",
        gradDate: "May 2026",
        skills: ["PCB Layout"],
        bio: "",
        status: "Active",
        flagged: false,
        links: [],
        education: [],
        projects: [],
        workExperiences: [],
        clubs: [],
        certifications: [],
      },
    ];

    render(
      <LeadershipEventForm
        role="admin"
        onClose={mockOnClose}
        onEventCreated={mockOnEventCreated}
        students={mockStudents as any}
      />
    );

    expect(screen.getByText(/3\. Event Leads/i)).toBeInTheDocument();
    expect(screen.getByText(/No event leads assigned yet/i)).toBeInTheDocument();
  });
});

describe("POST /api/events API Route Handler Security & Creation", () => {
  test("rejects unauthorized POST requests without admin role with 403", async () => {
    const req = new Request("http://localhost:3001/api/events", {
      method: "POST",
      headers: { "x-user-role": "standard" },
      body: JSON.stringify({ title: "Hackathon 2026", description: "Collegiate hackathon" }),
    });

    const response = await postEvent(req);
    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.success).toBe(false);
  });

  test("rejects requests missing required title or description with 400", async () => {
    const req = new Request("http://localhost:3001/api/events", {
      method: "POST",
      headers: { "x-user-role": "admin" },
      body: JSON.stringify({ title: "", description: "" }),
    });

    const response = await postEvent(req);
    expect(response.status).toBe(400);
  });

  test("creates event successfully and returns HTTP 201 with domain entity", async () => {
    const req = new Request("http://localhost:3001/api/events", {
      method: "POST",
      headers: { "x-user-role": "admin" },
      body: JSON.stringify({
        title: "Introduction to ROS2 Robotics Simulation",
        category: "Technical Workshop",
        description: "Hands-on robotics workshop covering nodes, topics, services, and URDF kinematics.",
        skills: ["ROS2", "Robotics", "Python"],
      }),
    });

    const response = await postEvent(req);
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.title).toBe("Introduction to ROS2 Robotics Simulation");
    expect(json.data.category).toBe("Technical Workshop");
    expect(json.data.skills).toContain("ROS2");
    expect(json.data.pointsAwarded).toBe(15);
  });
});
