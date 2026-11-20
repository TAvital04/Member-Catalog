import { GET, DELETE } from "@/app/api/members/route";

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

describe("DELETE /api/members Authorization & Security", () => {
  test("rejects unauthorized DELETE requests from guest or non-admin roles", async () => {
    const req = new Request("http://localhost:3001/api/members?id=candidate-1", {
      method: "DELETE",
      headers: { "x-user-role": "standard" },
    });

    const response = await DELETE(req);
    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.success).toBe(false);
  });

  test("rejects unauthorized DELETE requests without admin role", async () => {
    const req = new Request("http://localhost:3001/api/members?id=candidate-1", {
      method: "DELETE",
      headers: { "x-user-role": "sponsor" },
    });

    const response = await DELETE(req);
    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.success).toBe(false);
  });

  test("rejects DELETE requests missing member ID with 400", async () => {
    const req = new Request("http://localhost:3001/api/members", {
      method: "DELETE",
      headers: { "x-user-role": "admin" },
    });

    const response = await DELETE(req);
    expect(response.status).toBe(400);
  });
});
