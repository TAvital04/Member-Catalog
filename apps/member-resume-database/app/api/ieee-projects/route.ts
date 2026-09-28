import { db, ieeeProjects, projectParticipants, members, memberResumes } from "@ieee/db";
import { eq, inArray } from "drizzle-orm";

export async function GET() {
  try {
    const projectRows = await db
      .select({
        id: ieeeProjects.id,
        title: ieeeProjects.title,
        slug: ieeeProjects.slug,
        description: ieeeProjects.description,
        category: ieeeProjects.category,
        status: ieeeProjects.status,
        repositoryUrl: ieeeProjects.repositoryUrl,
        demoUrl: ieeeProjects.demoUrl,
        active: ieeeProjects.active,
      })
      .from(ieeeProjects);

    if (!projectRows || projectRows.length === 0) {
      return Response.json({ success: true, count: 0, data: [] });
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

    const data = projectRows.map((p) => ({
      ...p,
      participants: participantsMap.get(p.id) || [],
    }));

    return Response.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error: any) {
    console.error("[API Error] Failed to fetch IEEE projects:", error);
    return Response.json({ success: false, error: error?.message || "Internal Server Error", data: [] }, { status: 500 });
  }
}
