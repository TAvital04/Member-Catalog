import { GET as getProjects } from "@/app/api/projects/route";
import { GET as getIeeeProjects } from "@/app/api/ieee-projects/route";

describe("Projects API Route Nomenclature & Handler", () => {
  test("GET /api/projects returns HTTP 200 with chapter project entities", async () => {
    const response = await getProjects();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);

    const firstProject = json.data[0];
    expect(firstProject.id).toBeDefined();
    expect(firstProject.title).toBeDefined();
    expect(firstProject.slug).toBeDefined();
    expect(Array.isArray(firstProject.tools)).toBe(true);
  });

  test("GET /api/ieee-projects returns matching response structure for backward compatibility", async () => {
    const response = await getIeeeProjects();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });
});
