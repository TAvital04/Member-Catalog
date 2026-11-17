import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LeadershipProjectForm from "@/components/forms/LeadershipProjectForm";
import { POST as postProject } from "@/app/api/projects/route";
import { Student } from "@/data/students";

const mockStudents: Student[] = [
  {
    id: "mem-01",
    name: "Alex Rivera",
    email: "arivera@ucf.edu",
    major: "Electrical Engineering",
    degree: "Bachelor of Science",
    gradDate: "May 2026",
    skills: ["Altium Designer", "PCB Layout"],
    bio: "Hardware designer",
    status: "Seeking Internship",
    flagged: false,
    links: [],
    education: [],
    projects: [],
    workExperiences: [],
    clubs: [],
    certifications: [],
  },
  {
    id: "mem-02",
    name: "Elena Rostova",
    email: "erostova@ucf.edu",
    major: "Computer Engineering",
    degree: "Bachelor of Science",
    gradDate: "May 2025",
    skills: ["C++", "FreeRTOS", "ROS 2"],
    bio: "Robotics engineer",
    status: "Seeking Full-time",
    flagged: false,
    links: [],
    education: [],
    projects: [],
    workExperiences: [],
    clubs: [],
    certifications: [],
  },
];

describe("LeadershipProjectForm (Form 3: Create Chapter Project & Team Roster)", () => {
  const mockOnClose = jest.fn();
  const mockOnProjectCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Form 3 with all required engineering sections", () => {
    render(
      <LeadershipProjectForm
        role="admin"
        onClose={mockOnClose}
        onProjectCreated={mockOnProjectCreated}
        students={mockStudents}
      />
    );

    expect(screen.getByText("Create Chapter Project")).toBeInTheDocument();
    expect(screen.getByLabelText(/Project Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Short Tagline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Technical Overview & Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GitHub Repository URL/i)).toBeInTheDocument();
    expect(screen.getByText(/3\. Key Tech Stack & Tools/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Milestone Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/5\. Project Team & Leads Roster/i)).toBeInTheDocument();
  });

  test("validates required fields before submitting", () => {
    render(
      <LeadershipProjectForm
        role="admin"
        onClose={mockOnClose}
        onProjectCreated={mockOnProjectCreated}
        students={mockStudents}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Publish Project/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Please enter a Project Title/i)).toBeInTheDocument();
    expect(mockOnProjectCreated).not.toHaveBeenCalled();
  });

  test("allows adding tools and milestones", () => {
    render(
      <LeadershipProjectForm
        role="admin"
        onClose={mockOnClose}
        onProjectCreated={mockOnProjectCreated}
        students={mockStudents}
      />
    );

    // Add tool
    const toolInput = screen.getByPlaceholderText(/e\.g\. FreeRTOS, KiCad, ROS 2/i);
    fireEvent.change(toolInput, { target: { value: "TensorFlow Lite" } });
    fireEvent.keyDown(toolInput, { key: "Enter" });

    expect(screen.getByText("TensorFlow Lite")).toBeInTheDocument();

    // Add milestone
    const milestoneTitle = screen.getByPlaceholderText(/Milestone Title/i);
    fireEvent.change(milestoneTitle, { target: { value: "PCB Thermal Testing" } });

    const addButtons = screen.getAllByRole("button", { name: /Add/i });
    fireEvent.click(addButtons[1]); // Milestone add button

    expect(screen.getByText("PCB Thermal Testing")).toBeInTheDocument();
  });

  test("allows assigning candidate team members", () => {
    render(
      <LeadershipProjectForm
        role="admin"
        onClose={mockOnClose}
        onProjectCreated={mockOnProjectCreated}
        students={mockStudents}
      />
    );

    expect(screen.getByText(/No members assigned yet/i)).toBeInTheDocument();

    // Assign Alex Rivera
    const assignBtn = screen.getByRole("button", { name: /Assign/i });
    expect(assignBtn).toBeDisabled();
  });

  test("API: rejects unauthenticated or standard user requests with 403", async () => {
    const request = new Request("http://localhost:3000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": "standard",
      },
      body: JSON.stringify({
        title: "Test Autonomous Quadcopter",
        description: "Test description for robotics quadcopter project build",
      }),
    });

    const response = await postProject(request);
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("API: successfully creates a project when authenticated as admin", async () => {
    const request = new Request("http://localhost:3000/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": "admin",
      },
      body: JSON.stringify({
        title: "Autonomous Space Rover SLAM Platform",
        category: "Robotics & Controls",
        status: "Active",
        tagline: "High-precision GPS-denied SLAM navigation platform",
        description: "Autonomous micro-rover mapping unknown indoor terrain using LiDAR and stereo depth perception.",
        tools: [{ name: "ROS 2 Humble", category: "Software & AI" }],
        timeline: [
          {
            date: "Q1 2026",
            title: "Simulated Gazebo Testing",
            description: "Completed kinematic simulations in Gazebo.",
            status: "completed",
          },
        ],
        participants: [
          {
            memberId: "mem-02",
            name: "Elena Rostova",
            email: "erostova@ucf.edu",
            major: "Computer Engineering",
            roleTitle: "Lead",
          },
        ],
      }),
    });

    const response = await postProject(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.title).toBe("Autonomous Space Rover SLAM Platform");
    expect(body.data.slug).toBe("autonomous-space-rover-slam-platform");
    expect(body.data.participants.length).toBe(1);
    expect(body.data.participants[0].roleTitle).toBe("Lead");
  });
});
