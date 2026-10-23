import { POST } from "@/app/api/send-email/route";

describe("POST /api/send-email Route Handler", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("returns 400 when required fields are missing", async () => {
    const mockReq = {
      json: async () => ({ to: "test@ucf.edu" }),
    } as any;

    const response = await POST(mockReq);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Missing required fields/);
  });

  test("returns 200 simulation response when RESEND_API_KEY is not set", async () => {
    delete process.env.RESEND_API_KEY;

    const mockReq = {
      json: async () => ({
        to: "candidate@ucf.edu",
        recipientType: "student",
        subject: "Test Subject",
        message: "Hello world message body",
        senderName: "Recruiter Bob",
        senderEmail: "bob@company.com",
      }),
    } as any;

    const response = await POST(mockReq);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.source).toBe("simulation");
  });
});
