/**
 * @file points.ts
 * @description IEEE UCF Chapter Contribution & Engagement Point System
 *
 * Point Rules:
 *  - Board Member of IEEE: 10 points
 *  - Leading a Project: 15 points each
 *  - Being a part of a university project (excludes personal projects): 5 points each
 *  - Going to a workshop or other event (social, service): 3 points each
 *  - Being a committee member: 5 points each
 *
 * Core Purpose:
 *  Puts the members who contribute the most to the IEEE chapter and university build
 *  teams first in recruiter discovery, elevating verified engagement over passive resumes.
 */

export interface PointBreakdown {
  total: number;
  boardPoints: number;
  projectLeadPoints: number;
  universityProjectPoints: number;
  eventPoints: number;
  committeePoints: number;
  details: string[];
}

/**
 * Determines if a project is an official university / collegiate / chapter project
 * rather than a solo/personal project.
 */
export function isUniversityProject(projectName: string, description?: string): boolean {
  const text = `${projectName} ${description || ""}`.toLowerCase();

  // Explicit personal project keywords that should be excluded
  const personalKeywords = [
    "personal portfolio",
    "personal website",
    "portfolio site",
    "todo app",
    "weather app",
    "expense tracker",
    "recipe finder",
    "discord bot",
    "notes app",
    "clone app",
  ];

  if (personalKeywords.some((kw) => text.includes(kw))) {
    return false;
  }

  // University / Collegiate / IEEE chapter keywords
  const universityKeywords = [
    "rso",
    "ieee",
    "ucf",
    "micromouse",
    "solar knight",
    "quadcopter",
    "cubesat",
    "auv",
    "knighthacks",
    "senior design",
    "creol",
    "formula sae",
    "baja",
    "seds",
    "spie",
    "acm",
    "rover",
    "laboratory",
    "research lab",
    "smart campus",
    "spectrometer",
    "fpga packet filter",
    "thruster controller",
    "mppt charge controller",
    "bio-impedance",
    "workshop series",
    "badge",
    "satellite",
    "drone",
    "embedded linux & freertos",
    "altium workshop",
  ];

  return universityKeywords.some((kw) => text.includes(kw));
}

/**
 * Checks if a member role indicates IEEE UCF board leadership.
 */
export function isIeeeBoardMember(
  clubs: Array<{ name?: string; clubName?: string; title?: string; roleTitle?: string; description?: string }>
): { isBoard: boolean; role?: string } {
  const boardRoles = [
    "chair",
    "vice chair",
    "president",
    "vice president",
    "treasurer",
    "secretary",
    "webmaster",
    "director",
    "executive",
    "officer",
  ];

  for (const club of clubs) {
    const clubName = (club.clubName || club.name || "").toLowerCase();
    const roleTitle = (club.roleTitle || club.title || "").toLowerCase();

    if (clubName.includes("ieee") || clubName.includes("rso")) {
      if (boardRoles.some((br) => roleTitle.includes(br))) {
        return { isBoard: true, role: club.roleTitle || club.title };
      }
    }
  }

  return { isBoard: false };
}

/**
 * Checks if a role or title indicates project leadership.
 */
export function isProjectLead(roleTitle?: string, description?: string): boolean {
  const text = `${roleTitle || ""} ${description || ""}`.toLowerCase();
  return (
    text.includes("project director") ||
    text.includes("lead engineer") ||
    text.includes("lead designer") ||
    text.includes("lead architect") ||
    text.includes("firmware lead") ||
    text.includes("hardware lead") ||
    text.includes("software lead") ||
    text.includes("director") ||
    text.includes("project lead") ||
    text.includes("team lead") ||
    text.includes("principal") ||
    text.includes("founder") ||
    text.includes("led ") ||
    text.includes("leading ")
  );
}

/**
 * Checks if a club role indicates committee membership.
 */
export function isCommitteeMember(
  club: { name?: string; clubName?: string; title?: string; roleTitle?: string; description?: string }
): boolean {
  const text = `${club.clubName || club.name || ""} ${club.roleTitle || club.title || ""} ${club.description || ""}`.toLowerCase();
  return (
    text.includes("committee") ||
    text.includes("sig") ||
    text.includes("workshops lead") ||
    text.includes("lab coordinator")
  );
}

/**
 * Calculates a member's total contribution points and detailed point audit breakdown.
 */
export function calculateCandidatePoints(candidate: {
  clubs?: any[];
  clubMemberships?: any[];
  projects?: any[];
  events?: any[];
  mainProjectName?: string;
  projectRole?: string;
}): { points: number; pointBreakdown: PointBreakdown } {
  let total = 0;
  let boardPoints = 0;
  let projectLeadPoints = 0;
  let universityProjectPoints = 0;
  let eventPoints = 0;
  let committeePoints = 0;
  const details: string[] = [];

  const clubsList = candidate.clubs || candidate.clubMemberships || [];
  const projectsList = candidate.projects || [];
  const eventsList = candidate.events || [];

  // 1. Board member of IEEE gives 10 points
  const boardCheck = isIeeeBoardMember(clubsList);
  if (boardCheck.isBoard) {
    boardPoints = 10;
    total += 10;
    details.push(`RSO Board Member (${boardCheck.role}): +10 pts`);
  }

  // 2. Leading a project is 15 points each
  // 3. Being a part of a university project is 5 points each (excludes personal projects)
  for (const proj of projectsList) {
    const pName = proj.projectName || proj.name || "";
    const pDesc = proj.description || "";
    const pRole = proj.roleTitle || proj.role || "";

    if (isUniversityProject(pName, pDesc)) {
      if (isProjectLead(pRole, pDesc) || isProjectLead(pName, pDesc)) {
        projectLeadPoints += 15;
        total += 15;
        details.push(`Project Leadership (${pName}): +15 pts`);
      } else {
        universityProjectPoints += 5;
        total += 5;
        details.push(`University Project Member (${pName}): +5 pts`);
      }
    }
  }

  // Account for mainProjectName if not listed in projectsList
  if (
    candidate.mainProjectName &&
    !projectsList.some((p) => (p.projectName || p.name) === candidate.mainProjectName)
  ) {
    if (isProjectLead(candidate.projectRole)) {
      projectLeadPoints += 15;
      total += 15;
      details.push(`Project Leadership (${candidate.mainProjectName}): +15 pts`);
    } else {
      universityProjectPoints += 5;
      total += 5;
      details.push(`University Project Member (${candidate.mainProjectName}): +5 pts`);
    }
  }

  // 4. Going to a workshop or other event (social, service) is 3 points each
  if (eventsList.length > 0) {
    const ePoints = eventsList.length * 3;
    eventPoints += ePoints;
    total += ePoints;
    details.push(`${eventsList.length} Workshops & Events: +${ePoints} pts`);
  }

  // 5. Being a committee member is also 5 points each
  for (const club of clubsList) {
    if (isCommitteeMember(club)) {
      committeePoints += 5;
      total += 5;
      const roleName = club.roleTitle || club.title || club.clubName || "Committee Member";
      details.push(`Committee Member (${roleName}): +5 pts`);
    }
  }

  return {
    points: total,
    pointBreakdown: {
      total,
      boardPoints,
      projectLeadPoints,
      universityProjectPoints,
      eventPoints,
      committeePoints,
      details,
    },
  };
}

/**
 * Calculates a member's recent contribution points within the last 14 days (2 weeks).
 * Factors in verified recent event attendances, ongoing project milestones, and recent profile updates.
 */
export function calculateRecentPoints(candidate: {
  points?: number;
  updatedAt?: string;
  createdAt?: string;
  events?: Array<{ startTime?: string }>;
  projects?: Array<{ current?: boolean; isOngoing?: boolean }>;
  clubs?: Array<{ current?: boolean; isActive?: boolean; title?: string; roleTitle?: string; name?: string; clubName?: string }>;
}): number {
  const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  let score = 0;

  // 1. Profile updated within the last 14 days
  if (candidate.updatedAt) {
    const updatedTime = new Date(candidate.updatedAt).getTime();
    if (!isNaN(updatedTime) && (now - updatedTime) <= twoWeeksMs && (now - updatedTime) >= 0) {
      score += 10;
    }
  }

  // 2. Profile created within the last 14 days
  if (candidate.createdAt) {
    const createdTime = new Date(candidate.createdAt).getTime();
    if (!isNaN(createdTime) && (now - createdTime) <= twoWeeksMs && (now - createdTime) >= 0) {
      score += 5;
    }
  }

  // 3. Events attended within the last 14 days
  if (Array.isArray(candidate.events)) {
    for (const evt of candidate.events) {
      if (evt.startTime) {
        const evtTime = new Date(evt.startTime).getTime();
        if (!isNaN(evtTime) && (now - evtTime) <= twoWeeksMs && (now - evtTime) >= 0) {
          score += 5;
        }
      }
    }
  }

  // 4. If updated recently, credit ongoing engagement
  if (candidate.points && candidate.updatedAt) {
    const updatedTime = new Date(candidate.updatedAt).getTime();
    if (!isNaN(updatedTime) && (now - updatedTime) <= twoWeeksMs && (now - updatedTime) >= 0) {
      score += Math.round(candidate.points * 0.6);
    }
  }

  return score;
}

