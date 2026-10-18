import { EventEntry } from "@/data/students";
import { SAMPLE_IEEE_EVENTS, IEEEEvent } from "@/data/events";

/**
 * Pre-indexes events by attendee memberId, email, and name.
 */
const eventsByMemberId = new Map<string, IEEEEvent[]>();
const eventsByEmail = new Map<string, IEEEEvent[]>();
const eventsByName = new Map<string, IEEEEvent[]>();

SAMPLE_IEEE_EVENTS.forEach((evt) => {
  if (Array.isArray(evt.attendees)) {
    evt.attendees.forEach((att) => {
      if (att.memberId) {
        const idLower = att.memberId.toLowerCase().trim();
        const list = eventsByMemberId.get(idLower) || [];
        if (!list.includes(evt)) list.push(evt);
        eventsByMemberId.set(idLower, list);
      }
      if (att.email) {
        const emailLower = att.email.toLowerCase().trim();
        const list = eventsByEmail.get(emailLower) || [];
        if (!list.includes(evt)) list.push(evt);
        eventsByEmail.set(emailLower, list);
      }
      if (att.name) {
        const nameLower = att.name.toLowerCase().trim();
        const list = eventsByName.get(nameLower) || [];
        if (!list.includes(evt)) list.push(evt);
        eventsByName.set(nameLower, list);
      }
    });
  }
});

function formatEventToEntry(evt: IEEEEvent): EventEntry {
  const roomSuffix = evt.room && !evt.location.includes(evt.room) ? ` (${evt.room})` : "";
  return {
    id: evt.id,
    title: evt.title,
    location: `${evt.location}${roomSuffix}`,
    description: evt.description,
    startTime: typeof evt.startTime === "object" && evt.startTime ? (evt.startTime as any).toISOString() : String(evt.startTime),
    endTime: evt.endTime ? (typeof evt.endTime === "object" ? (evt.endTime as any).toISOString() : String(evt.endTime)) : undefined,
    slug: evt.slug,
    category: evt.category,
    skills: evt.skills,
    pointsAwarded: evt.pointsAwarded,
  };
}

/**
 * Returns seeded attended events for a candidate, guaranteeing that every candidate
 * has 3 to 6 verified RSO chapter events they participated in.
 */
export function getSeededEventsForCandidate(candidate: any, index: number): EventEntry[] {
  const matchedEvents: IEEEEvent[] = [];
  const candidateId = String(candidate.id || "").toLowerCase().trim();
  const memberId = String(candidate.memberId || "").toLowerCase().trim();
  const email = String(candidate.email || "").toLowerCase().trim();
  const name = String(candidate.fullName || candidate.name || "").toLowerCase().trim();

  const addUnique = (evt: IEEEEvent) => {
    if (!matchedEvents.some((e) => e.id === evt.id)) {
      matchedEvents.push(evt);
    }
  };

  // 1. Look up explicit attendees in SAMPLE_IEEE_EVENTS
  (eventsByMemberId.get(candidateId) || []).forEach(addUnique);
  (eventsByMemberId.get(memberId) || []).forEach(addUnique);
  (eventsByEmail.get(email) || []).forEach(addUnique);
  (eventsByName.get(name) || []).forEach(addUnique);

  // 2. If candidate has fewer than 3 events, supplement deterministically so every candidate has rich participation
  if (matchedEvents.length < 3) {
    const majorLower = String(candidate.major || candidate.memberMajor || "").toLowerCase();

    // Prioritize events matching their major
    SAMPLE_IEEE_EVENTS.forEach((evt, eIdx) => {
      // General body meetings and showcases attended by everyone
      if (evt.category === "General Body Meeting" && (index + eIdx) % 2 === 0) {
        addUnique(evt);
      }
      // Software / CS workshops
      else if (majorLower.includes("computer science") && (evt.skills?.some((s) => ["Python", "PyTorch", "ROS2", "Computer Vision"].includes(s)) || evt.title.includes("Bootcamp") || evt.title.includes("Resume"))) {
        if ((index + eIdx) % 2 === 0) addUnique(evt);
      }
      // Hardware / EE / CpE workshops
      else if ((majorLower.includes("electrical") || majorLower.includes("computer eng")) && (evt.skills?.some((s) => ["Altium Designer", "PCB Layout", "FreeRTOS", "STM32", "Soldering"].includes(s)) || evt.title.includes("PCB") || evt.title.includes("Hardware"))) {
        if ((index + eIdx) % 2 === 0) addUnique(evt);
      }
      // Competitions and Banquets
      else if ((index * 3 + eIdx) % 4 === 0) {
        addUnique(evt);
      }
    });

    // Ensure at least 3 events minimum for any profile
    if (matchedEvents.length < 3) {
      SAMPLE_IEEE_EVENTS.forEach((evt, eIdx) => {
        if (matchedEvents.length < 4 && (index + eIdx) % 2 === 0) {
          addUnique(evt);
        }
      });
    }
  }

  // Sort events chronologically (newest first)
  matchedEvents.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return matchedEvents.map(formatEventToEntry);
}
