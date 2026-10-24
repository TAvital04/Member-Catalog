import { getTableConfig } from "drizzle-orm/pg-core";
import { eventAttendees, projectParticipants, memberResumes } from "@/db/schema";
import nextConfig from "../next.config";
import { GET as getMembers, PATCH as patchMember, DELETE as deleteMember } from "@/app/api/members/route";
import { POST as postSendEmail } from "@/app/api/send-email/route";
import { getSafeUrl } from "@/shared/validations";

interface EducationItem {
  gpa?: number | string;
}

interface StudentItem {
  education?: EducationItem[];
}

describe("Security Verification Suite", () => {
  describe("1. Database Schema Integrity & Anti-Tamper Constraints", () => {
    it("enforces composite unique constraint on event_attendees to prevent point inflation", () => {
      const config = getTableConfig(eventAttendees);
      expect(config.uniqueConstraints).toBeDefined();

      const uniqueConstraint = config.uniqueConstraints.find(
        (c) => c.name === "event_attendees_event_member_unique"
      );
      expect(uniqueConstraint).toBeDefined();

      const columns = uniqueConstraint!.columns.map((c) => c.name);
      expect(columns).toContain("event_id");
      expect(columns).toContain("member_id");
    });

    it("enforces composite unique constraint on project_participants to prevent duplicate roles", () => {
      const config = getTableConfig(projectParticipants);
      expect(config.uniqueConstraints).toBeDefined();

      const uniqueConstraint = config.uniqueConstraints.find(
        (c) => c.name === "project_participants_project_member_unique"
      );
      expect(uniqueConstraint).toBeDefined();

      const columns = uniqueConstraint!.columns.map((c) => c.name);
      expect(columns).toContain("project_id");
      expect(columns).toContain("member_id");
    });

    it("enforces 1-to-1 unique relationship on member_resumes.member_id", () => {
      expect(memberResumes.memberId.isUnique).toBe(true);
    });
  });

  describe("2. FERPA (34 CFR Part 99) Privacy & GPA Redaction Protocol", () => {
    it("strictly redacts GPA for unauthenticated and standard public requests", async () => {
      const req = new Request("http://localhost:3001/api/members", {
        headers: { "x-user-role": "standard" },
      });

      const res = await getMembers(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);

      for (const student of json.data as StudentItem[]) {
        if (student.education && Array.isArray(student.education)) {
          for (const edu of student.education) {
            expect(edu.gpa).toBeUndefined();
          }
        }
      }
    });

    it("discloses GPA only when caller has recruiter role AND candidate has opted in", async () => {
      const req = new Request("http://localhost:3001/api/members", {
        headers: { "x-user-role": "sponsor" },
      });

      const res = await getMembers(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);

      // In the seed dataset, candidate rows have shareGpaWithRecruiters: true
      const hasAnyGpa = (json.data as StudentItem[]).some((s) =>
        s.education?.some((e) => typeof e.gpa === "number" || typeof e.gpa === "string")
      );
      expect(hasAnyGpa).toBe(true);
    });

    it("rejects unauthorized PATCH modification of moderation flags", async () => {
      const req = new Request("http://localhost:3001/api/members", {
        method: "PATCH",
        headers: { "x-user-role": "standard" },
        body: JSON.stringify({ id: "candidate-1", flagged: true }),
      });

      const res = await patchMember(req);
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it("rejects non-admin DELETE operations", async () => {
      const req = new Request("http://localhost:3001/api/members?id=candidate-1", {
        method: "DELETE",
        headers: { "x-user-role": "sponsor" },
      });

      const res = await deleteMember(req);
      expect(res.status).toBe(403);
    });
  });

  describe("3. HTTP Security Headers (Next.js Config)", () => {
    it("configures defense-in-depth headers matching production security standards", async () => {
      expect(nextConfig.headers).toBeDefined();
      const headerRoutes = await nextConfig.headers!();
      expect(Array.isArray(headerRoutes)).toBe(true);

      const catchAllRoute = headerRoutes.find((r) => r.source === "/:path*");
      expect(catchAllRoute).toBeDefined();

      const headers = catchAllRoute!.headers;
      const getHeaderValue = (key: string) => headers.find((h) => h.key.toLowerCase() === key.toLowerCase())?.value;

      expect(getHeaderValue("X-Frame-Options")).toBe("SAMEORIGIN");
      expect(getHeaderValue("X-Content-Type-Options")).toBe("nosniff");
      expect(getHeaderValue("Strict-Transport-Security")).toContain("max-age=63072000");
      expect(getHeaderValue("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
      expect(getHeaderValue("Permissions-Policy")).toContain("camera=()");
    });
  });

  describe("4. Email Relay Defense & CRLF Injection Prevention", () => {
    it("rejects email dispatch to unauthorized external domains (anti-relay policy)", async () => {
      const req = new Request("http://localhost:3001/api/send-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          to: "attacker@external-domain.com",
          subject: "Spam message",
          message: "Malicious payload",
        }),
      });

      const res = await postSendEmail(req);
      expect(res.status).toBe(403);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toMatch(/relay policy/i);
    });

    it("allows email dispatch to valid UCF student and institutional addresses", async () => {
      const req = new Request("http://localhost:3001/api/send-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          to: "student@knights.ucf.edu",
          subject: "Interview Invitation",
          message: "We would like to interview you.",
          senderName: "Recruiter Bob",
          senderEmail: "bob@company.com",
        }),
      });

      const res = await postSendEmail(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });
  });

  describe("5. URL Sanitization & Protocol Protection (XSS Defenses)", () => {
    it("sanitizes dangerous protocol schemes", () => {
      expect(getSafeUrl("javascript:alert(1)")).toBeNull();
      expect(getSafeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
      expect(getSafeUrl("vbscript:MsgBox(1)")).toBeNull();
    });

    it("allows valid HTTPS and safe URLs", () => {
      expect(getSafeUrl("https://github.com/TAvital04")).toBe("https://github.com/TAvital04");
      expect(getSafeUrl("https://linkedin.com/in/student")).toBe("https://linkedin.com/in/student");
    });
  });
});
