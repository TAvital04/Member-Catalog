import { NextResponse } from "next/server";
import { db, jobPostings } from "@/db";
import { SAMPLE_JOB_POSTINGS, JobPosting } from "@/data/jobs";
import { desc, eq } from "drizzle-orm";

// In-memory cache for dynamic operations when local database is unconfigured
let dynamicJobs: JobPosting[] = [...SAMPLE_JOB_POSTINGS];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get("company");
    const status = searchParams.get("status");

    // Try Postgres DB first
    try {
      let query = db.select().from(jobPostings).orderBy(desc(jobPostings.createdAt));
      const dbRows = await query;

      if (dbRows && dbRows.length > 0) {
        let results = dbRows.map((row) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          companyName: row.companyName,
          companyLogo: row.companyLogo || undefined,
          department: row.department || undefined,
          location: row.location,
          locationType: row.locationType as any,
          employmentType: row.employmentType as any,
          experienceLevel: (row.experienceLevel || "Entry Level") as any,
          salaryRange: row.salaryRange || undefined,
          description: row.description,
          responsibilities: (row.responsibilities as string[]) || [],
          requirements: (row.requirements as string[]) || [],
          benefits: (row.benefits as string[]) || [],
          skillsRequired: (row.skillsRequired as string[]) || [],
          employerEmail: row.employerEmail,
          employerWebsite: row.employerWebsite || undefined,
          status: row.status as any,
          featured: row.featured,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        }));

        if (company) {
          results = results.filter((j) => j.companyName.toLowerCase() === company.toLowerCase());
        }
        if (status) {
          results = results.filter((j) => j.status.toLowerCase() === status.toLowerCase());
        }

        return NextResponse.json({
          success: true,
          source: "database",
          data: results,
        });
      }
    } catch (dbError) {
      console.warn("[API Warning] Database query for job postings encountered error, falling back to mock dataset:", dbError);
    }

    // Fallback to in-memory dynamic jobs
    let filtered = [...dynamicJobs];
    if (company) {
      filtered = filtered.filter((j) => j.companyName.toLowerCase() === company.toLowerCase());
    }
    if (status) {
      filtered = filtered.filter((j) => j.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      source: "fallback",
      data: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch job postings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.companyName || !body.description || !body.employerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, companyName, description, and employerEmail are required" },
        { status: 400 }
      );
    }

    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      title: body.title,
      slug: body.slug || `${body.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`,
      companyName: body.companyName,
      companyLogo: body.companyLogo || body.companyName.slice(0, 3).toUpperCase(),
      department: body.department || "Engineering",
      location: body.location || "Orlando, FL",
      locationType: body.locationType || "On-site",
      employmentType: body.employmentType || "Full-time",
      experienceLevel: body.experienceLevel || "Entry Level",
      salaryRange: body.salaryRange || "$80,000 - $95,000 / yr",
      description: body.description,
      responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : [],
      requirements: Array.isArray(body.requirements) ? body.requirements : [],
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      skillsRequired: Array.isArray(body.skillsRequired) ? body.skillsRequired : [],
      employerEmail: body.employerEmail,
      employerWebsite: body.employerWebsite || "",
      status: body.status || "Active",
      featured: Boolean(body.featured),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try Postgres DB insert
    try {
      await db.insert(jobPostings).values({
        id: crypto.randomUUID(),
        title: newJob.title,
        slug: newJob.slug,
        companyName: newJob.companyName,
        companyLogo: newJob.companyLogo,
        department: newJob.department,
        location: newJob.location,
        locationType: newJob.locationType,
        employmentType: newJob.employmentType,
        experienceLevel: newJob.experienceLevel,
        salaryRange: newJob.salaryRange,
        description: newJob.description,
        responsibilities: newJob.responsibilities,
        requirements: newJob.requirements,
        benefits: newJob.benefits,
        skillsRequired: newJob.skillsRequired,
        employerEmail: newJob.employerEmail,
        employerWebsite: newJob.employerWebsite,
        status: newJob.status,
        featured: newJob.featured,
        active: true,
      });
    } catch (dbError) {
      console.warn("[API Warning] Could not persist job to Postgres, saving in fallback cache:", dbError);
    }

    // Keep in-memory cache synchronized
    dynamicJobs.unshift(newJob);

    return NextResponse.json({
      success: true,
      data: newJob,
      message: "Job posting created successfully",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create job posting" },
      { status: 500 }
    );
  }
}
