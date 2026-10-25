import { NextResponse } from "next/server";
import { db, jobApplications } from "@/db";
import { SAMPLE_JOB_APPLICATIONS, JobApplication } from "@/data/jobs";
import { desc, eq } from "drizzle-orm";

let dynamicApplications: JobApplication[] = [...SAMPLE_JOB_APPLICATIONS];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    const memberId = searchParams.get("memberId");

    try {
      let query = db.select().from(jobApplications).orderBy(desc(jobApplications.appliedAt));
      const dbRows = await query;

      if (dbRows && dbRows.length > 0) {
        let results = dbRows.map((row) => ({
          id: row.id,
          jobId: row.jobId,
          memberId: row.memberId,
          status: row.status as any,
          coverNote: row.coverNote || undefined,
          customResumeUrl: row.customResumeUrl || undefined,
          portfolioSnapshot: row.portfolioSnapshot as any,
          appliedAt: row.appliedAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        }));

        if (jobId) {
          results = results.filter((a) => a.jobId === jobId);
        }
        if (memberId) {
          results = results.filter((a) => a.memberId === memberId);
        }

        return NextResponse.json({
          success: true,
          source: "database",
          data: results,
        });
      }
    } catch (dbError) {
      console.warn("[API Warning] Could not load applications from Postgres, using mock cache:", dbError);
    }

    let filtered = [...dynamicApplications];
    if (jobId) {
      filtered = filtered.filter((a) => a.jobId === jobId);
    }
    if (memberId) {
      filtered = filtered.filter((a) => a.memberId === memberId);
    }

    return NextResponse.json({
      success: true,
      source: "fallback",
      data: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch job applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.jobId || !body.memberId || !body.portfolioSnapshot) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: jobId, memberId, and portfolioSnapshot are required" },
        { status: 400 }
      );
    }

    // Check for duplicate application
    const existing = dynamicApplications.find(
      (a) => a.jobId === body.jobId && a.memberId === body.memberId
    );
    if (existing) {
      return NextResponse.json(
        { success: false, error: "You have already applied to this role with your portfolio." },
        { status: 409 }
      );
    }

    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: body.jobId,
      memberId: body.memberId,
      status: "Submitted",
      coverNote: body.coverNote || "",
      customResumeUrl: body.customResumeUrl || "",
      portfolioSnapshot: body.portfolioSnapshot,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await db.insert(jobApplications).values({
        id: crypto.randomUUID(),
        jobId: newApplication.jobId,
        memberId: newApplication.memberId,
        status: newApplication.status,
        coverNote: newApplication.coverNote,
        customResumeUrl: newApplication.customResumeUrl,
        portfolioSnapshot: newApplication.portfolioSnapshot,
      });
    } catch (dbError) {
      console.warn("[API Warning] Could not persist application to Postgres, saving in fallback cache:", dbError);
    }

    dynamicApplications.unshift(newApplication);

    return NextResponse.json({
      success: true,
      data: newApplication,
      message: "Application submitted successfully with your portfolio!",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit job application" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required for updating an application" },
        { status: 400 }
      );
    }

    const appIndex = dynamicApplications.findIndex((a) => a.id === id);
    if (appIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    dynamicApplications[appIndex] = {
      ...dynamicApplications[appIndex],
      status,
      updatedAt: new Date().toISOString(),
    };

    try {
      await db.update(jobApplications)
        .set({ status, updatedAt: new Date() })
        .where(eq(jobApplications.id, id));
    } catch (dbError) {
      console.warn("[API Warning] Could not update application in Postgres:", dbError);
    }

    return NextResponse.json({
      success: true,
      data: dynamicApplications[appIndex],
      message: "Application status updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}
