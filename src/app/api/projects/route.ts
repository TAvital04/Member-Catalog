/**
 * @file route.ts — GET & POST /api/projects
 * @description Standard REST API endpoint for chapter projects matching the /projects page nomenclature.
 * Seamlessly delivers RSO USF projects with team rosters and tooling specifications, and allows RSO Leadership
 * to publish new chapter build projects and assign team members.
 */

import { NextRequest, NextResponse } from "next/server";
import { db, ieeeProjects, projectParticipants, members, memberResumes } from "@/db";
import { eq, inArray } from "drizzle-orm";
import { SAMPLE_IEEE_PROJECTS, IEEEProject, ProjectParticipant, ProjectTool, ProjectMilestone } from "@/data/projects";

// In-memory dynamic additions to support local/offline development parity
const dynamicProjectsList: IEEEProject[] = [];

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
        count: dynamicProjectsList.length + SAMPLE_IEEE_PROJECTS.length,
        data: [...dynamicProjectsList, ...SAMPLE_IEEE_PROJECTS],
      });
    }

    if (!projectRows || projectRows.length === 0) {
      return Response.json({
        success: true,
        source: "fallback",
        count: dynamicProjectsList.length + SAMPLE_IEEE_PROJECTS.length,
        data: [...dynamicProjectsList, ...SAMPLE_IEEE_PROJECTS],
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
        status: p.status === "Completed" ? "Completed" : "Active",
        tools: Array.isArray(p.tools) ? (p.tools as ProjectTool[]) : [],
        timeline: Array.isArray(p.timeline) ? (p.timeline as ProjectMilestone[]) : [],
        skillsTaught: Array.isArray(p.skillsTaught) ? (p.skillsTaught as string[]) : [],
        sponsorshipInfo: p.sponsorshipInfo || undefined,
        participants,
      };
    });

    const dbSlugs = new Set(data.map((p) => p.slug));
    const dynamicAdditions = dynamicProjectsList.filter((p) => !dbSlugs.has(p.slug));
    const finalProjects = [...dynamicAdditions, ...data];

    return Response.json({
      success: true,
      source: "database",
      count: finalProjects.length,
      data: finalProjects,
    });
  } catch (error) {
    console.error("[API Error] Failed to process GET /api/projects:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to retrieve chapter projects",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects — RSO Leadership Chapter Project Creation
 * Enforces admin authorization.
 */
export async function POST(request: Request) {
  try {
    const role = request.headers.get("x-user-role") || "standard";
    if (role !== "admin") {
      return Response.json(
        {
          success: false,
          error: "Unauthorized. RSO Leadership privileges are required to create projects.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      category = "Hardware & Silicon",
      status = "Active",
      tagline,
      description,
      repositoryUrl,
      demoUrl,
      tools = [],
      timeline = [],
      participants = [],
    } = body || {};

    if (!title || !description) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields: Project Title and Description are required.",
        },
        { status: 400 }
      );
    }

    const cleanTitle = String(title).trim();
    if (cleanTitle.length < 5) {
      return Response.json(
        {
          success: false,
          error: "Project Title must be at least 5 characters long.",
        },
        { status: 400 }
      );
    }

    const cleanDescription = String(description).trim();
    if (cleanDescription.length < 30) {
      return Response.json(
        {
          success: false,
          error: "Project Description must be at least 30 characters long.",
        },
        { status: 400 }
      );
    }

    const cleanTagline = tagline ? String(tagline).trim() : `${cleanTitle} — RSO USF Engineering Build Initiative`;
    const cleanSlug = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newProjectId = `proj-${Date.now()}`;
    const cleanTools: ProjectTool[] = Array.isArray(tools)
      ? tools.map((t: any) => ({
          name: typeof t === "string" ? t.trim() : String(t.name || "").trim(),
          category: t.category ? String(t.category).trim() : undefined,
        })).filter((t) => Boolean(t.name))
      : [];

    const cleanTimeline: ProjectMilestone[] = Array.isArray(timeline) && timeline.length > 0
      ? timeline.map((m: any) => ({
          date: String(m.date || "Current").trim(),
          title: String(m.title || "Project Milestone").trim(),
          description: String(m.description || "Active development phase").trim(),
          status: (m.status || "in_progress") as ProjectMilestone["status"],
        }))
      : [
          {
            date: "Kickoff",
            title: "Project Architecture & Requirements",
            description: "Established core engineering requirements and component selections.",
            status: "completed",
          },
        ];

    const cleanParticipants: ProjectParticipant[] = Array.isArray(participants)
      ? participants.map((p: any) => ({
          memberId: String(p.memberId || `mem-${Date.now()}`),
          name: String(p.name || "Chapter Member").trim(),
          email: String(p.email || "").trim(),
          major: String(p.major || "Computer Engineering").trim(),
          roleTitle: String(p.roleTitle || "Member").trim(),
        }))
      : [];

    const newProject: IEEEProject = {
      id: newProjectId,
      title: cleanTitle,
      slug: cleanSlug || newProjectId,
      tagline: cleanTagline,
      description: cleanDescription,
      category: category ? String(category).trim() : undefined,
      status: status === "Completed" ? "Completed" : "Active",
      repositoryUrl: repositoryUrl ? String(repositoryUrl).trim() : undefined,
      demoUrl: demoUrl ? String(demoUrl).trim() : undefined,
      active: true,
      tools: cleanTools,
      timeline: cleanTimeline,
      skillsTaught: [],
      participants: cleanParticipants,
    };

    // Attempt PostgreSQL database write if connected
    try {
      await db.insert(ieeeProjects).values({
        id: newProject.id,
        title: newProject.title,
        slug: newProject.slug,
        tagline: newProject.tagline,
        description: newProject.description,
        category: newProject.category || null,
        status: newProject.status,
        repositoryUrl: newProject.repositoryUrl,
        demoUrl: newProject.demoUrl,
        tools: newProject.tools,
        timeline: newProject.timeline,
        active: true,
      });

      if (cleanParticipants.length > 0) {
        for (const part of cleanParticipants) {
          try {
            await db.insert(projectParticipants).values({
              projectId: newProject.id,
              memberId: part.memberId,
              roleTitle: part.roleTitle,
            });
          } catch {
            // Ignore duplicate/foreign key error on participants in local dev
          }
        }
      }
    } catch (dbError) {
      console.warn("[API Warning] Database insertion for project encountered error (using dynamic fallback):", dbError);
    }

    // Persist in dynamic list for immediate retrieval
    dynamicProjectsList.unshift(newProject);

    return Response.json(
      {
        success: true,
        message: `Successfully created chapter project: ${cleanTitle}`,
        data: newProject,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API Error] Failed to process POST /api/projects:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error occurred while creating project.",
      },
      { status: 500 }
    );
  }
}
