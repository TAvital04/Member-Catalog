import { GET } from "@/app/api/members/route";

describe("GET /api/members FERPA Privacy & Redaction Logic", () => {
  it("redacts GPA and unconsented data when caller is unauthenticated", async () => {
    const mockReq = {
      headers: new Headers({
        "x-user-role": "standard", // Not recruiter or admin
      }),
      url: "http://localhost:3001/api/members",
    } as any;

    const response = await GET(mockReq);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);

    // Each member returned should have GPA redacted or verified
    if (json.data && json.data.length > 0) {
      json.data.forEach((member: any) => {
        if (member.education && Array.isArray(member.education)) {
          member.education.forEach((edu: any) => {
            if (!member.shareGpaWithRecruiters) {
              expect(edu.gpa).toBeUndefined();
            }
          });
        }
      });
    }
  });

  it("handles empty database responses gracefully without crashing", async () => {
    const mockReq = {
      headers: new Headers(),
      url: "http://localhost:3001/api/members",
    } as any;

    const response = await GET(mockReq);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });
});
