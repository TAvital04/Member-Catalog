import { db } from "@/lib/db";
import { Student, INITIAL_STUDENTS } from "@/data/students";

export async function GET() {
  try {
    // Attempt to query live member records from PostgreSQL database
    let memberRows: any[] = [];
    
    try {
      // Execute query using Drizzle or raw SQL fallback
      const result = await db.execute("SELECT * FROM members WHERE active = true LIMIT 100");
      memberRows = Array.isArray(result) ? result : (result?.rows || []);
    } catch (dbError) {
      console.warn("[API Warning] Database query failed or database offline. Falling back to local seed data:", dbError);
      return Response.json({
        success: true,
        source: "seed_fallback",
        count: INITIAL_STUDENTS.length,
        data: INITIAL_STUDENTS,
      });
    }

    if (!memberRows || memberRows.length === 0) {
      return Response.json({
        success: true,
        source: "seed_fallback",
        count: INITIAL_STUDENTS.length,
        data: INITIAL_STUDENTS,
      });
    }

    // Safely transform database rows to Student interface
    const transformedStudents: Student[] = memberRows.map((row: any) => {
      const fullName = [row.first_name || row.firstName, row.middle_name || row.middleName, row.last_name || row.lastName]
        .filter(Boolean)
        .join(" ");

      const links = [];
      const linkedin = row.linkedin_url || row.linkedinURL;
      const github = row.github_url || row.githubURL;
      const website = row.website_url || row.websiteURL;
      const resume = row.resume_url || row.resumeURL;

      if (linkedin) links.push({ name: "LinkedIn", text: linkedin });
      if (github) links.push({ name: "GitHub", text: github });
      if (website) links.push({ name: "Portfolio", text: website });
      if (resume) links.push({ name: "Resume", text: resume });

      const gradYear = row.graduation_year || row.graduationYear || 2026;

      return {
        id: row.id || `student-${Math.random().toString(36).substr(2, 9)}`,
        name: fullName || "UCF Engineering Student",
        email: row.ucf_email || row.ucfEmail || row.personal_email || row.personalEmail || "student@ucf.edu",
        bio: row.biography || "UCF Engineering member.",
        skills: ["React", "TypeScript", "Python"], // Default skill tags
        links,
        education: [
          {
            schoolName: "University of Central Florida",
            degreeType: "Bachelor of Science",
            major: row.major || "Computer Science",
            startDate: "August 2022",
            endDate: `May ${gradYear}`,
            current: true,
          },
        ],
        projects: [],
        workExperiences: [],
        clubs: [],
        certifications: [],
        resumeLink: resume || undefined,
        major: row.major || "Computer Science",
        degree: "Bachelor of Science",
        gradDate: `May ${gradYear}`,
        status: "Seeking Internship",
        flagged: false,
      };
    });

    return Response.json({
      success: true,
      source: "database",
      count: transformedStudents.length,
      data: transformedStudents,
    });
  } catch (error: any) {
    console.error("[API Error] Failed to fetch member records:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to retrieve database member records.",
        message: error?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
