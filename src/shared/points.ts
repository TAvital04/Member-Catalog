/**
 * @file points.ts — @ieee/shared
 * @description IEEE UCF Chapter Contribution & Point System
 *
 * Rules:
 *  - Board Member of IEEE: 10 points
 *  - Leading a Project: 15 points each
 *  - Being a part of a university project (excludes personal projects): 5 points each
 *  - Going to a workshop or other event (social, service): 3 points each
 *  - Being a committee member: 5 points each
 *
 * Purpose:
 *  Puts the members who contribute the most first as part of the core mission.
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

export function isUniversityProject(projectName: string, description?: string): boolean {
  const text = `${projectName} ${description || ""}`.toLowerCase();

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

  const universityKeywords = [
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

    if (clubName.includes("ieee")) {
      if (boardRoles.some((br) => roleTitle.includes(br))) {
        return { isBoard: true, role: club.roleTitle || club.title };
      }
    }
  }

  return { isBoard: false };
}

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

  // 1. Board member of IEEE: 10 points
  const boardCheck = isIeeeBoardMember(clubsList);
  if (boardCheck.isBoard) {
    boardPoints = 10;
    total += 10;
    details.push(`IEEE Board Member (${boardCheck.role}): +10 pts`);
  }

  // 2. Leading a project: 15 points each
  // 3. Being a part of a university project: 5 points each (excludes personal projects)
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

  // Handle mainProjectName if not listed in projectsList
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

  // 4. Going to a workshop or other event (social, service): 3 points each
  if (eventsList.length > 0) {
    const ePoints = eventsList.length * 3;
    eventPoints += ePoints;
    total += ePoints;
    details.push(`${eventsList.length} Workshops & Events: +${ePoints} pts`);
  }

  // 5. Being a committee member: 5 points each
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
