/**
 * @file route.ts — GET /api/members
 * @description API route handler delivering enriched candidate profile records from PostgreSQL via Drizzle ORM.
 * Joins memberResumes, members, and eventAttendees to aggregate student details, education history,
 * technical skills, project portfolios, work experiences, leadership titles, and verified workshop attendances.
 *
 * @returns {Promise<Response>} JSON response containing array of transformed Student domain entities
 */

import { db, members, memberResumes, events, eventAttendees } from "@ieee/db";
import { Student } from "@/data/students";
import { eq, inArray } from "drizzle-orm";

export async function GET() {
  try {
    let candidateRows: any[] = [];

    try {
      // Query 1-to-1 joined member resumes from the shared Drizzle database
      candidateRows = await db
        .select({
          id: memberResumes.id,
          memberId: memberResumes.memberId,
          fullName: memberResumes.fullName,
          email: memberResumes.email,
          status: memberResumes.status,
          bio: memberResumes.bio,
          resumePdfUrl: memberResumes.resumePdfUrl,
          socialLinks: memberResumes.socialLinks,
          education: memberResumes.education,
          skills: memberResumes.skills,
          workExperience: memberResumes.workExperience,
          projects: memberResumes.projects,
          clubMemberships: memberResumes.clubMemberships,
          certifications: memberResumes.certifications,
          flagged: memberResumes.flagged,
          flagReason: memberResumes.flagReason,
          mainProjectName: memberResumes.mainProjectName,
          memberMajor: members.major,
          memberGradYear: members.graduationYear,
        })
        .from(memberResumes)
        .leftJoin(members, eq(memberResumes.memberId, members.id));
    } catch (dbError) {
      console.warn("[API Warning] Database query encountered error, returning empty list:", dbError);
      return Response.json({
        success: true,
        source: "database",
        count: 0,
        data: [],
      });
    }

    if (!candidateRows || candidateRows.length === 0) {
      return Response.json({
        success: true,
        source: "database",
        count: 0,
        data: [],
      });
    }

    // Fetch attended IEEE events for all candidates
    const memberIds = candidateRows.map((r) => r.memberId).filter(Boolean);
    const attendedEventsMap = new Map<string, any[]>();

    if (memberIds.length > 0) {
      try {
        const attendedRows = await db
          .select({
            memberId: eventAttendees.memberId,
            id: events.id,
            title: events.title,
            location: events.location,
            description: events.description,
            startTime: events.startTime,
            endTime: events.endTime,
            slug: events.slug,
          })
          .from(eventAttendees)
          .innerJoin(events, eq(eventAttendees.eventId, events.id))
          .where(inArray(eventAttendees.memberId, memberIds));

        for (const row of attendedRows) {
          const list = attendedEventsMap.get(row.memberId) || [];
          list.push({
            id: row.id,
            title: row.title,
            location: row.location,
            description: row.description,
            startTime: typeof row.startTime === "object" && row.startTime ? row.startTime.toISOString() : String(row.startTime),
            endTime: row.endTime ? (typeof row.endTime === "object" ? row.endTime.toISOString() : String(row.endTime)) : undefined,
            slug: row.slug || undefined,
          });
          attendedEventsMap.set(row.memberId, list);
        }
      } catch (evtError) {
        console.warn("[API Warning] Could not fetch attended events:", evtError);
      }
    }

    // Safely transform Drizzle database rows into Student domain models
    const transformedStudents: Student[] = candidateRows.map((row: any) => {
      const socialLinks = Array.isArray(row.socialLinks)
        ? row.socialLinks.map((l: any) => ({ name: l.platformName || "Link", text: l.profileUrl || "" }))
        : [];

      const education = Array.isArray(row.education)
        ? row.education.map((e: any) => ({
            schoolName: e.schoolName || "University of Central Florida",
            degreeType: e.degreeType || "Bachelor of Science",
            major: e.major || "Computer Science",
            gpa: e.gpa,
            gpaScale: e.gpaScale,
            startDate: e.startDate || "2022-08-20",
            endDate: e.endDate,
            current: Boolean(e.isCurrent),
            description: e.description,
          }))
        : [];

      const primaryEdu = education[0] || {};

      return {
        id: row.id,
        name: row.fullName || "UCF Member",
        email: row.email || "student@knights.ucf.edu",
        bio: row.bio || "",
        skills: Array.isArray(row.skills) ? row.skills : [],
        links: socialLinks,
        education: education,
        projects: Array.isArray(row.projects)
          ? row.projects.map((p: any) => ({
              name: p.projectName || "",
              description: p.description || "",
              startDate: p.startDate || "",
              endDate: p.endDate,
              current: Boolean(p.isOngoing),
              projectLinks: p.projectLinks || [],
            }))
          : [],
        workExperiences: Array.isArray(row.workExperience)
          ? row.workExperience.map((w: any) => ({
              name: w.companyName || "",
              title: w.jobTitle || "",
              description: w.description || "",
              startDate: w.startDate || "",
              endDate: w.endDate,
              currentJob: Boolean(w.isCurrentJob),
            }))
          : [],
        clubs: Array.isArray(row.clubMemberships)
          ? row.clubMemberships.map((c: any) => ({
              name: c.clubName || "",
              title: c.roleTitle || "",
              description: c.description || "",
              startDate: c.startDate || "",
              endDate: c.endDate,
              current: Boolean(c.isActive),
            }))
          : [],
        certifications: Array.isArray(row.certifications)
          ? row.certifications.map((cert: any) => ({
              name: cert.certificationName || "",
              issuer: cert.issuer || "",
              issueDate: cert.issueDate || "",
              expirationDate: cert.expirationDate,
              credentialId: cert.credentialId,
              credentialUrl: cert.credentialUrl,
            }))
          : [],
        events: attendedEventsMap.get(row.memberId) || [],
        resumeLink: row.resumePdfUrl || undefined,
        major: primaryEdu.major || row.memberMajor || "Computer Science",
        degree: primaryEdu.degreeType || "Bachelor of Science",
        gradDate: primaryEdu.endDate ? primaryEdu.endDate : (row.memberGradYear ? `May ${row.memberGradYear}` : "May 2026"),
        status: (row.status as any) || "Seeking Internship",
        flagged: Boolean(row.flagged),
        flagReason: row.flagReason || undefined,
        mainProjectName: row.mainProjectName || undefined,
      };
    });


    return Response.json({
      success: true,
      source: "database",
      count: transformedStudents.length,
      data: transformedStudents,
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
