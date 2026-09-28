import { GET } from "../app/api/members/route";

describe("GET /api/members Route Handler", () => {
  test("returns HTTP 200 response with student array payload", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);

    // Verify first candidate item matches Student structure
    const firstStudent = json.data[0];
    expect(firstStudent).toHaveProperty("id");
    expect(firstStudent).toHaveProperty("name");
    expect(firstStudent).toHaveProperty("email");
    expect(firstStudent).toHaveProperty("major");
    expect(firstStudent).toHaveProperty("gradDate");
    expect(firstStudent).toHaveProperty("status");
    expect(Array.isArray(firstStudent.skills)).toBe(true);
    expect(Array.isArray(firstStudent.links)).toBe(true);
  });
});
