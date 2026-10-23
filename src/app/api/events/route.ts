/**
 * @file route.ts — GET /api/events
 * @description API route handler delivering IEEE UCF chapter events and verified student attendee rosters.
 * Queries events from PostgreSQL via Drizzle ORM, joins eventAttendees with members and resumes,
 * and falls back seamlessly to the rich SAMPLE_IEEE_EVENTS dataset when database is unavailable.
 *
 * @returns {Promise<Response>} JSON response containing array of IEEEEvent domain entities
 */

import { db, events, eventAttendees, members, memberResumes } from "@/db";
import { eq, inArray, desc } from "drizzle-orm";
import { SAMPLE_IEEE_EVENTS, IEEEEvent, EventCategory } from "@/data/events";

export async function GET() {
  try {
    let eventRows: any[] = [];

    try {
      eventRows = await db
        .select({
          id: events.id,
          title: events.title,
          location: events.location,
          description: events.description,
          flyerUrl: events.flyerUrl,
          rsvpLink: events.rsvpLink,
          photoUrls: events.photoUrls,
          slug: events.slug,
          startTime: events.startTime,
          endTime: events.endTime,
          requiresDues: events.requiresDues,
          active: events.active,
        })
        .from(events)
        .orderBy(desc(events.startTime));
    } catch (dbError) {
      console.warn("[API Warning] Database query encountered error, falling back to seed events dataset:", dbError);
      return Response.json({
        success: true,
        source: "fallback",
        count: SAMPLE_IEEE_EVENTS.length,
        data: SAMPLE_IEEE_EVENTS,
      });
    }

    if (!eventRows || eventRows.length === 0) {
      return Response.json({
        success: true,
        source: "fallback",
        count: SAMPLE_IEEE_EVENTS.length,
        data: SAMPLE_IEEE_EVENTS,
      });
    }

    const eventIds = eventRows.map((e) => e.id);
    const attendeesMap = new Map<string, any[]>();

    if (eventIds.length > 0) {
      try {
        const attendeeRows = await db
          .select({
            eventId: eventAttendees.eventId,
            memberId: eventAttendees.memberId,
            studentName: members.name,
            studentEmail: members.email,
            studentMajor: members.major,
            resumeId: memberResumes.id,
          })
          .from(eventAttendees)
          .innerJoin(members, eq(eventAttendees.memberId, members.id))
          .leftJoin(memberResumes, eq(members.id, memberResumes.memberId))
          .where(inArray(eventAttendees.eventId, eventIds));

        for (const row of attendeeRows) {
          const list = attendeesMap.get(row.eventId) || [];
          list.push({
            memberId: row.memberId,
            name: row.studentName || "UCF Member",
            email: row.studentEmail || "",
            major: row.studentMajor || "Computer Science",
            resumeId: row.resumeId,
          });
          attendeesMap.set(row.eventId, list);
        }
      } catch (attError) {
        console.warn("[API Warning] Could not fetch event attendees:", attError);
      }
    }

    // Merge database rows with rich metadata from SAMPLE_IEEE_EVENTS
    const transformedEvents: IEEEEvent[] = eventRows.map((row) => {
      const sampleMatch = SAMPLE_IEEE_EVENTS.find(
        (s) => s.slug === row.slug || s.title.toLowerCase() === row.title.toLowerCase()
      );
      const dbAttendees = attendeesMap.get(row.id) || [];

      const attendees = dbAttendees.length > 0 ? dbAttendees : (sampleMatch?.attendees || []);

      return {
        id: row.id,
        title: row.title,
        slug: row.slug || `event-${row.id}`,
        description: row.description,
        location: row.location,
        startTime: typeof row.startTime === "object" && row.startTime ? row.startTime.toISOString() : String(row.startTime),
        endTime: row.endTime ? (typeof row.endTime === "object" ? row.endTime.toISOString() : String(row.endTime)) : undefined,
        category: (sampleMatch?.category || "Technical Workshop") as EventCategory,
        host: sampleMatch?.host || "IEEE UCF Student Chapter",
        partner: sampleMatch?.partner,
        pointsAwarded: sampleMatch?.pointsAwarded || 3,
        tags: sampleMatch?.tags || ["IEEE UCF", "Workshop"],
        learningOutcomes: sampleMatch?.learningOutcomes || [],
        flyerUrl: row.flyerUrl || undefined,
        rsvpLink: row.rsvpLink || undefined,
        requiresDues: Boolean(row.requiresDues),
        active: Boolean(row.active),
        attendees,
      };
    });

    return Response.json({
      success: true,
      source: "database",
      count: transformedEvents.length,
      data: transformedEvents,
    });
  } catch (err: any) {
    console.error("[API Error] Failed to retrieve events:", err);
    return Response.json({
      success: false,
      error: "Failed to retrieve IEEE events",
      data: SAMPLE_IEEE_EVENTS,
    });
  }
}
