import { GET } from "@/app/api/members/route";

describe("GET /api/members Route Handler", () => {
  test("returns HTTP 200 response with student array payload directly from database", async () => {
    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.source).toBe("database");
    expect(Array.isArray(json.data)).toBe(true);
  });
});
