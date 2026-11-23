/**
 * @file route.ts — GET /api/members
 * @description API route handler delivering enriched candidate profile records from PostgreSQL via Drizzle ORM.
 * Joins memberResumes, members, and eventAttendees to aggregate student details, education history,
 * technical skills, project portfolios, work experiences, leadership titles, and verified workshop attendances.
 */

import { db, memberResumes } from "@/db";
import { getEnrichedMemberList, getDynamicMembers } from "@/lib/candidates";
import { eq } from "drizzle-orm";

export { getDynamicMembers };

export async function GET(request?: Request) {
  try {
    const url = request ? new URL(request.url) : null;
    const role = request?.headers.get("x-user-role") || url?.searchParams.get("role") || "standard";

    const students = await getEnrichedMemberList(role);

    return Response.json({
      success: true,
      source: "database",
      count: students.length,
      data: students,
    });
  } catch (error: any) {
    console.error("[API Error] Failed to query database member records:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to retrieve database member records.",
        message: error?.message || "Internal Server Error",
        data: [],
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/members — Permanently removes candidate profile from database
 * Enforces strict admin authorization.
 */
export async function DELETE(request: Request) {
  try {
    const role = request.headers.get("x-user-role") || "standard";
    if (role !== "admin") {
      return Response.json(
        { success: false, error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || typeof id !== "string") {
      return Response.json({ success: false, error: "Valid member resume ID is required" }, { status: 400 });
    }

    await db.delete(memberResumes).where(eq(memberResumes.id, id));
    return Response.json({ success: true, message: "Member record deleted successfully" });
  } catch (error: any) {
    console.error("[API Error] Failed to delete member record:", error);
    return Response.json({ success: false, error: error?.message || "Failed to delete member record" }, { status: 500 });
  }
}
