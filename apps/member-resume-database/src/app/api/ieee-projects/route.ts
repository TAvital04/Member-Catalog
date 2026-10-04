/**
 * @file route.ts — GET /api/ieee-projects
 * @description API route handler delivering IEEE UCF chapter projects and active student team rosters.
 * Queries ieeeProjects from PostgreSQL via Drizzle ORM, joins projectParticipants with members and resumes,
 * and aggregates tooling, milestone timelines, skills taught, and sponsorship configurations.
 *
 * @returns {Promise<Response>} JSON response containing IEEE project entities with participant details
 */

import { db, ieeeProjects, projectParticipants, members, memberResumes } from "@ieee/db";
import { eq, inArray } from "drizzle-orm";
import { SAMPLE_IEEE_PROJECTS, IEEEProject } from "@/data/projects";

export async function GET() {
  try {
    let projectRows: any[] = [];

    try {
      projectRows = await db
        .select({
          id: ieeeProjects.id,
          title: ieeeProjects.title,
          slug: ieeeProjects.slug,
          tagline: ieeeProjects.tagline,
          description: ieeeProjects.description,
          category: ieeeProjects.category,
          status: ieeeProjects.status,
          repositoryUrl: ieeeProjects.repositoryUrl,
          demoUrl: ieeeProjects.demoUrl,
          bannerUrl: ieeeProjects.bannerUrl,
          tools: ieeeProjects.tools,
          timeline: ieeeProjects.timeline,
          skillsTaught: ieeeProjects.skillsTaught,
          sponsorshipInfo: ieeeProjects.sponsorshipInfo,
          active: ieeeProjects.active,
        })
        .from(ieeeProjects);
    } catch (dbError) {
      console.warn("[API Warning] Could not connect to Postgres database for ieeeProjects, using rich sample dataset:", dbError);
      return Response.json({
        success: true,
        source: "fallback",
        count: SAMPLE_IEEE_PROJECTS.length,
        data: SAMPLE_IEEE_PROJECTS,
      });
    }

    if (!projectRows || projectRows.length === 0) {
      return Response.json({
        success: true,
        source: "fallback",
        count: SAMPLE_IEEE_PROJECTS.length,
        data: SAMPLE_IEEE_PROJECTS,
      });
    }

    const projectIds = projectRows.map((p) => p.id);
    const participantsMap = new Map<string, any[]>();

    if (projectIds.length > 0) {
      try {
        const participantRows = await db
          .select({
            projectId: projectParticipants.projectId,
            memberId: projectParticipants.memberId,
            roleTitle: projectParticipants.roleTitle,
            studentName: members.name,
            studentEmail: members.email,
            studentMajor: members.major,
            resumeId: memberResumes.id,
          })
          .from(projectParticipants)
          .innerJoin(members, eq(projectParticipants.memberId, members.id))
          .leftJoin(memberResumes, eq(members.id, memberResumes.memberId))
          .where(inArray(projectParticipants.projectId, projectIds));

        for (const row of participantRows) {
          const list = participantsMap.get(row.projectId) || [];
          list.push({
            memberId: row.memberId,
            name: row.studentName || "UCF Member",
            email: row.studentEmail || "",
            major: row.studentMajor || "Computer Science",
            roleTitle: row.roleTitle,
            resumeId: row.resumeId,
          });
          participantsMap.set(row.projectId, list);
        }
      } catch (partError) {
        console.warn("[API Warning] Could not fetch project participants:", partError);
      }
    }

    const data: IEEEProject[] = projectRows.map((p) => {
      const participants = participantsMap.get(p.id) || [];
      return {
        ...p,
        tools: Array.isArray(p.tools) ? p.tools : [],
        timeline: Array.isArray(p.timeline) ? p.timeline : [],
        skillsTaught: Array.isArray(p.skillsTaught) ? p.skillsTaught : [],
        sponsorshipInfo: p.sponsorshipInfo || undefined,
        participants: participants.length > 0 ? participants : (SAMPLE_IEEE_PROJECTS.find(sp => sp.slug === p.slug)?.participants || []),
      };
    });

    return Response.json({
      success: true,
      source: "database",
      count: data.length,
      data,
    });
  } catch (error: any) {
    console.error("[API Error] Failed to fetch IEEE projects:", error);
    return Response.json({
      success: true,
      source: "fallback",
      count: SAMPLE_IEEE_PROJECTS.length,
      data: SAMPLE_IEEE_PROJECTS,
    });
  }
}
