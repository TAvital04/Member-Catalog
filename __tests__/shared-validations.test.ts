import {
  EMAIL_REGEX,
  URL_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
  validateEmail,
  validateUrl,
  validateName,
  validatePhone,
  validateGraduationYear,
  validateGpa,
  validateMemberResume,
  getSafeUrl,
} from "@/shared";

describe("Shared Validation Utilities", () => {
  describe("EMAIL_REGEX & validateEmail", () => {
    it("accepts valid email formats", () => {
      expect(validateEmail("student@knights.ucf.edu")).toBe(true);
      expect(validateEmail("officer@ucf.edu")).toBe(true);
      expect(validateEmail("recruiter@google.com")).toBe(true);
    });

    it("rejects invalid emails", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("@ucf.edu")).toBe(false);
      expect(validateEmail("student@")).toBe(false);
    });
  });

  describe("URL_REGEX ReDoS Protection & validateUrl", () => {
    it("validates standard HTTPS URLs without catastrophic backtracking", () => {
      expect(validateUrl("https://github.com/TAvital04")).toBe(true);
      expect(validateUrl("https://linkedin.com/in/student")).toBe(true);
    });

    it("evaluates maliciously crafted long inputs in linear time", () => {
      const maliciousPayload = "http://" + "a".repeat(50) + "@" + "b".repeat(50);
      const start = Date.now();
      validateUrl(maliciousPayload);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(100);
    });
  });

  describe("getSafeUrl Sanitization & Protocol Protection", () => {
    it("preserves valid web URLs", () => {
      expect(getSafeUrl("https://github.com/test")).toBe("https://github.com/test");
      expect(getSafeUrl("http://example.com/resume.pdf")).toBe("http://example.com/resume.pdf");
      expect(getSafeUrl("github.com/profile")).toBe("https://github.com/profile");
    });

    it("blocks malicious script and data schemes", () => {
      expect(getSafeUrl("javascript:alert(1)")).toBeNull();
      expect(getSafeUrl("JAVASCRIPT:document.cookie")).toBeNull();
      expect(getSafeUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
      expect(getSafeUrl("vbscript:MsgBox(1)")).toBeNull();
    });

    it("handles null and undefined gracefully", () => {
      expect(getSafeUrl(null)).toBeNull();
      expect(getSafeUrl(undefined)).toBeNull();
      expect(getSafeUrl("")).toBeNull();
    });
  });

  describe("NAME_REGEX & validateName", () => {
    it("accepts international and accented names", () => {
      expect(validateName("René Descartes")).toBe(true);
      expect(validateName("Mary-Jane Watson")).toBe(true);
      expect(validateName("O'Connor")).toBe(true);
    });

    it("rejects empty names or script tags", () => {
      expect(validateName("")).toBe(false);
      expect(validateName("<script>alert(1)</script>")).toBe(false);
    });
  });

  describe("validateGraduationYear", () => {
    it("validates standard undergraduate matriculation years", () => {
      expect(validateGraduationYear(2025)).toBe(true);
      expect(validateGraduationYear(2030)).toBe(true);
      expect(validateGraduationYear(1990)).toBe(false);
      expect(validateGraduationYear(2050)).toBe(false);
    });
  });

  describe("validateGpa", () => {
    it("validates GPA range 0.0 to 4.0", () => {
      expect(validateGpa(3.85)).toBe(true);
      expect(validateGpa(4.0)).toBe(true);
      expect(validateGpa(0.0)).toBe(true);
      expect(validateGpa(4.5)).toBe(false);
      expect(validateGpa(-0.5)).toBe(false);
    });
  });

  describe("validateMemberResume (Full Entity Validation)", () => {
    const validResume = {
      fullName: "Jane Knight",
      email: "jknight@knights.ucf.edu",
      status: "Seeking Full-time" as const,
      bio: "Computer Science student specializing in distributed systems.",
      resumePdfUrl: "https://ieee.ucf.edu/resumes/jknight.pdf",
      skills: ["TypeScript", "Next.js", "PostgreSQL"],
      education: [
        {
          schoolName: "University of Central Florida",
          degreeType: "Bachelor of Science",
          major: "Computer Science",
          startDate: "2022-08-20",
          endDate: "2026-05-05",
          isCurrent: true,
          gpa: 3.92,
        },
      ],
      workExperience: [],
      projects: [],
      clubMemberships: [],
      certifications: [],
      ferpaConsentSigned: true,
    };

    it("passes validation on compliant resume with FERPA consent", () => {
      const result = validateMemberResume(validResume);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("fails validation when required fields are missing", () => {
      const invalid = { ...validResume, email: "not-an-email", fullName: "" };
      const result = validateMemberResume(invalid);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
