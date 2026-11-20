import {
  compileResumeBookCandidates,
  formatResumeUrl,
  exportResumeBookCsv,
  exportResumeBookJson,
} from "@/lib/resumeBook";
import { GET, POST } from "@/app/api/resume-book/route";
import { Student } from "@/data/students";
import { ResumeBookOptions } from "@/types/resumeBook";

describe("Resume Book Compilation & Transformation Utilities", () => {
  const mockStudents: Student[] = [
    {
      id: "candidate-1",
      name: "Alex Rivera",
      bio: "Passionate embedded systems engineer.",
      skills: ["C++", "Verilog", "FPGA", "RTOS"],
      links: [],
      education: [
        {
          schoolName: "University of South Florida",
          degreeType: "Bachelor of Science",
          major: "Computer Engineering",
          gpa: 3.88,
          gpaScale: 4.0,
          startDate: "2022",
          endDate: "2026",
          current: true,
        },
      ],
      projects: [
        {
          name: "Solar Bull Racing ESC",
          description: "Designed a 48V motor controller",
          startDate: "2024",
          current: true,
          projectLinks: [],
        },
      ],
      workExperiences: [
        {
          name: "Siemens Energy",
          title: "Hardware Engineering Intern",
          description: "Worked on circuit diagnostics",
          startDate: "May 2024",
          currentJob: false,
        },
      ],
      clubs: [],
      events: [
        {
          id: "evt-1",
          title: "FPGA Acceleration Workshop",
          location: "ENB 109",
          startTime: "2024-10-10",
          description: "Hands-on workshop",
        },
      ],
      resumeLink: "https://example.com/resumes/alex-rivera.pdf",
      major: "Computer Engineering",
      degree: "Bachelor of Science",
      gradDate: "May 2026",
      status: "Seeking Full-time",
      mainProjectName: "Solar Bull Racing ESC",
      email: "arivera@usf.edu",
    },
    {
      id: "candidate-2",
      name: "Marcus Vance",
      bio: "Power electronics researcher.",
      skills: ["Power Electronics", "MATLAB", "PCB Design"],
      links: [],
      education: [
        {
          schoolName: "University of South Florida",
          degreeType: "Master of Science",
          major: "Electrical Engineering",
          gpa: 3.92,
          gpaScale: 4.0,
          startDate: "2023",
          endDate: "2025",
          current: true,
        },
      ],
      projects: [],
      workExperiences: [],
      clubs: [],
      events: [],
      major: "Electrical Engineering",
      degree: "Master of Science",
      gradDate: "Dec 2025",
      status: "Seeking Full-time",
      email: "mvance@usf.edu",
    },
  ];

  test("formats candidate uploaded resume URL with fallback", () => {
    const url1 = formatResumeUrl(mockStudents[0]);
    expect(url1).toBe("https://example.com/resumes/alex-rivera.pdf");

    const url2 = formatResumeUrl(mockStudents[1]);
    expect(url2).toContain("marcus-vance-resume");
  });

  test("compiles candidates with full options", () => {
    const options: ResumeBookOptions = {
      title: "Test Resume Book",
      sponsorName: "Lockheed Martin",
      includeGpa: true,
      includeProjects: true,
      includeEvents: true,
      includeRecruiterNotes: true,
    };

    const notesMap = {
      "candidate-1": {
        notes: "Top pick for embedded team",
        tags: ["FPGA", "Hardware"],
      },
    };

    const compiled = compileResumeBookCandidates(mockStudents, options, notesMap);
    expect(compiled.length).toBe(2);

    const alex = compiled[0];
    expect(alex.name).toBe("Alex Rivera");
    expect(alex.major).toBe("Computer Engineering");
    expect(alex.gpa).toBe(3.88);
    expect(alex.recruiterNotes).toBe("Top pick for embedded team");
    expect(alex.tags).toEqual(["FPGA", "Hardware"]);
    expect(alex.projects.length).toBe(1);
    expect(alex.events.length).toBe(1);
  });

  test("filters candidates by major in Resume Book compilation", () => {
    const options: ResumeBookOptions = {
      selectedMajor: "Electrical Engineering",
    };

    const compiled = compileResumeBookCandidates(mockStudents, options);
    expect(compiled.length).toBe(1);
    expect(compiled[0].name).toBe("Marcus Vance");
  });

  test("filters candidates by graduation cohort year in compilation", () => {
    const options: ResumeBookOptions = {
      selectedGradYear: "2026",
    };

    const compiled = compileResumeBookCandidates(mockStudents, options);
    expect(compiled.length).toBe(1);
    expect(compiled[0].name).toBe("Alex Rivera");
  });
});

describe("API /api/resume-book Route Handlers", () => {
  test("GET /api/resume-book returns HTTP 200 with compiled candidate payload", async () => {
    const req = new Request("http://localhost:3001/api/resume-book?sponsor=Texas+Instruments");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.meta.sponsor).toBe("Texas Instruments");
    expect(Array.isArray(json.candidates)).toBe(true);
    expect(json.candidates.length).toBeGreaterThan(0);
  });

  test("POST /api/resume-book compiles candidates with custom options", async () => {
    const req = new Request("http://localhost:3001/api/resume-book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        options: {
          title: "Custom Sponsor Book",
          sponsorName: "Lockheed Martin",
        },
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.meta.sponsor).toBe("Lockheed Martin");
    expect(Array.isArray(json.candidates)).toBe(true);
  });
});
