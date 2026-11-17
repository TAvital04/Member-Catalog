/**
 * @file skills.ts
 * Centralized Single Source of Truth for Member Skill Attribution & Verification.
 *
 * Rule: A member should ONLY have their skill updated if they attend a workshop for it.
 * Not from a project, manual entry, or anything else. Just workshops.
 */

export const WORKSHOP_CATEGORY = "Technical Workshop";

/**
 * Returns true if an event or category represents a technical workshop capable of granting skills.
 */
export function isWorkshopEvent(category?: string | null): boolean {
  if (!category) return false;
  const clean = category.toLowerCase().trim();
  return clean.includes("workshop") || clean === "technical workshop";
}

/**
 * Determines whether skills can be awarded to a member based on event category.
 */
export function canAwardSkills(category?: string | null): boolean {
  return isWorkshopEvent(category);
}

/**
 * Pure function to extract and aggregate skills exclusively from workshops attended.
 */
export function getWorkshopVerifiedSkills(
  attendedEvents: Array<{ category?: string; tags?: string[]; skills?: string[] }>
): string[] {
  const skillSet = new Set<string>();

  attendedEvents.forEach((event) => {
    if (canAwardSkills(event.category)) {
      (event.tags || []).forEach((t) => skillSet.add(t.trim()));
      (event.skills || []).forEach((s) => skillSet.add(s.trim()));
    }
  });

  return Array.from(skillSet).filter(Boolean);
}
