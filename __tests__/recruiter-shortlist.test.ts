import {
  getShortlistStorageKey,
  loadShortlistFromStorage,
  saveShortlistToStorage,
  formatShortlistEmails,
} from "@/lib/shortlistStorage";
import { GET, POST, DELETE } from "@/app/api/shortlists/route";
import { ShortlistedCandidate } from "@/types/shortlist";

describe("Recruiter Shortlist Storage & Helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("generates scoped storage keys per recruiter organization", () => {
    expect(getShortlistStorageKey("lockheed-martin")).toBe("rso-shortlist-lockheed-martin");
    expect(getShortlistStorageKey("Siemens Energy")).toBe("rso-shortlist-siemens_energy");
    expect(getShortlistStorageKey()).toBe("rso-shortlist-default");
  });

  test("loads empty array when no candidates have been saved", () => {
    const list = loadShortlistFromStorage("lockheed-martin");
    expect(list).toEqual([]);
  });

  test("persists and retrieves shortlisted candidates in localStorage", () => {
    const sample: ShortlistedCandidate[] = [
      {
        candidateId: "candidate-1",
        candidateName: "Alex Rivera",
        candidateEmail: "arivera@usf.edu",
        candidateMajor: "Computer Engineering",
        gradDate: "May 2026",
        savedAt: new Date().toISOString(),
        listName: "Hardware Leads",
        notes: "Strong FPGA and Verilog background",
        tags: ["FPGA", "Top Candidate"],
      },
    ];

    saveShortlistToStorage(sample, "lockheed-martin");
    const retrieved = loadShortlistFromStorage("lockheed-martin");

    expect(retrieved.length).toBe(1);
    expect(retrieved[0].candidateId).toBe("candidate-1");
    expect(retrieved[0].candidateName).toBe("Alex Rivera");
    expect(retrieved[0].notes).toBe("Strong FPGA and Verilog background");
    expect(retrieved[0].tags).toEqual(["FPGA", "Top Candidate"]);
  });

  test("formats candidate emails for batch outreach correctly", () => {
    const sample: ShortlistedCandidate[] = [
      {
        candidateId: "1",
        candidateName: "Alex Rivera",
        candidateEmail: "arivera@usf.edu",
        candidateMajor: "CE",
        gradDate: "2026",
        savedAt: "",
      },
      {
        candidateId: "2",
        candidateName: "Jordan Lee",
        candidateEmail: "jlee@usf.edu",
        candidateMajor: "CS",
        gradDate: "2026",
        savedAt: "",
      },
      {
        candidateId: "3",
        candidateName: "Duplicate Alex",
        candidateEmail: "arivera@usf.edu",
        candidateMajor: "CE",
        gradDate: "2026",
        savedAt: "",
      },
    ];

    const emails = formatShortlistEmails(sample);
    expect(emails).toBe("arivera@usf.edu, jlee@usf.edu");
  });
});

describe("API /api/shortlists Route Handlers", () => {
  test("POST saves a candidate to the shortlist and returns HTTP 200", async () => {
    const req = new Request("http://localhost:3001/api/shortlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateId: "candidate-10",
        candidateName: "Elena Rostova",
        candidateEmail: "elena@usf.edu",
        candidateMajor: "Electrical Engineering",
        gradDate: "Dec 2025",
        listName: "Robotics Core",
        notes: "Excellent motor driver experience",
        tags: ["Robotics", "PCB Design"],
        recruiterId: "bulltech",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.candidateId).toBe("candidate-10");
  });

  test("POST rejects request missing candidateId with 400", async () => {
    const req = new Request("http://localhost:3001/api/shortlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: "Missing candidate",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  test("GET retrieves shortlisted candidates for a recruiter", async () => {
    const req = new Request("http://localhost:3001/api/shortlists?recruiterId=bulltech");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });

  test("DELETE removes a candidate from the shortlist", async () => {
    const req = new Request(
      "http://localhost:3001/api/shortlists?candidateId=candidate-10&recruiterId=bulltech",
      { method: "DELETE" }
    );
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  test("DELETE rejects request missing candidateId with 400", async () => {
    const req = new Request("http://localhost:3001/api/shortlists", {
      method: "DELETE",
    });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});
