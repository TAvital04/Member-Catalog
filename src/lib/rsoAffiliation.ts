import { ProjectEntry, Student, EventEntry } from "@/data/students";
import { SAMPLE_IEEE_PROJECTS } from "@/data/projects";
import { SAMPLE_IEEE_EVENTS, IEEEEvent } from "@/data/events";
import { canAwardSkills } from "./skills";

/**
 * Pre-computed lowercased lookup sets for official RSO chapter projects and workshop skills.
 * Member skills are updated exclusively from attending workshops (not from projects or manual entry).
 */
const RSO_TOOLS_AND_SKILLS = new Set<string>();
const RSO_PROJECT_TITLES = new Set<string>();

// 1. Ingest official RSO chapter build project titles (for project affiliation matching only)
SAMPLE_IEEE_PROJECTS.forEach((proj) => {
  RSO_PROJECT_TITLES.add(proj.title.toLowerCase().trim());
});

// 2. Ingest all skills taught in RSO chapter Technical Workshops
SAMPLE_IEEE_EVENTS.forEach((evt: IEEEEvent) => {
  if (canAwardSkills(evt.category) && Array.isArray(evt.skills)) {
    evt.skills.forEach((skill: string) => {
      if (skill) {
        RSO_TOOLS_AND_SKILLS.add(skill.toLowerCase().trim());
      }
    });
  }
});

// 3. Foundational technical skill terms taught by RSO build teams
const FOUNDATIONAL_RSO_SKILLS = [
  "c++",
  "c",
  "freertos",
  "embedded linux",
  "embedded systems",
  "verilog",
  "vhdl",
  "systemverilog",
  "arm cortex-m",
  "python",
  "rust",
  "fpga",
  "altium designer",
  "altium",
  "kicad",
  "stm32",
  "linux",
  "ros",
  "ros2",
  "pytorch",
  "solidworks",
  "soldering",
  "smd soldering",
  "pcb layout",
  "pcb design",
  "can bus",
  "i2c",
  "spi",
  "uart",
  "firmware",
  "dsp",
  "iot",
  "coral tpu",
  "edge ai",
  "computer vision",
  "opencv",
  "robotics",
  "hardware testing",
  "oscilloscope",
  "logic analyzer",
  "mesh networking",
  "ble",
  "bluetooth low energy",
  "esp32",
  "power electronics",
  "inverters",
  "rf circuit design",
  "antenna design",
  "microwave",
  "microcontrollers",
  "sensors",
  "sensor fusion",
  "autonomous systems",
  "pid control",
  "path planning",
  "simulink",
  "matlab",
  "cad",
  "3d printing",
];

FOUNDATIONAL_RSO_SKILLS.forEach((s) => RSO_TOOLS_AND_SKILLS.add(s));

function matchesSkill(skill: string, targetSkill: string): boolean {
  if (!skill || !targetSkill) return false;
  const s = skill.toLowerCase().trim();
  const t = targetSkill.toLowerCase().trim();
  if (s === t) return true;

  // For very short tokens like "c" or "r", require exact match to avoid false positives
  if (s.length <= 2 || t.length <= 2) {
    return s === t;
  }

  // Boundary regex match
  const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(^|[^a-z0-9+#])${escaped}($|[^a-z0-9+#])`, "i");
  return regex.test(s);
}

/**
 * Determines whether a candidate's project is affiliated with an RSO.
 */
export function isRsoProject(project: ProjectEntry, student?: Student): boolean {
  if (!project || !project.name) return false;
  const nameLower = project.name.toLowerCase().trim();
  const descLower = (project.description || "").toLowerCase();

  // Explicit RSO or IEEE prefix / tag in title
  if (/\b(rso|ieee)\b/i.test(nameLower)) return true;

  // Matches student's primary RSO project affiliation
  if (student?.mainProjectName) {
    const mainLower = student.mainProjectName.toLowerCase().trim();
    if (nameLower.includes(mainLower) || mainLower.includes(nameLower)) {
      return true;
    }
  }

  // Matches any chapter project title from database
  for (const title of RSO_PROJECT_TITLES) {
    if (nameLower.includes(title) || title.includes(nameLower)) {
      return true;
    }
  }

  // Description references RSO chapter or technical committee build
  if (
    /\b(rso ucf|ieee ucf|rso chapter|chapter project|rso competition|rso innovation lab|southeastcon)\b/i.test(
      descLower
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Determines whether a skill is affiliated with an RSO (taught in RSO workshops or used in RSO projects).
 */
export function isRsoSkill(skill: string, student?: Student): boolean {
  if (!skill) return false;
  const sLower = skill.toLowerCase().trim();

  // 1. Direct match with official RSO project tools or workshop skills
  if (RSO_TOOLS_AND_SKILLS.has(sLower)) return true;

  // 2. Token / word boundary match against official RSO skills
  for (const rsoSkill of RSO_TOOLS_AND_SKILLS) {
    if (matchesSkill(sLower, rsoSkill) || matchesSkill(rsoSkill, sLower)) {
      return true;
    }
  }

  // 3. Verification from student's attended RSO workshops
  if (student?.events && Array.isArray(student.events)) {
    for (const evt of student.events) {
      const evtTitle = (evt.title || "").toLowerCase();
      const evtDesc = (evt.description || "").toLowerCase();
      if (matchesSkill(evtTitle, sLower) || matchesSkill(evtDesc, sLower)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks whether a candidate gained or demonstrated a skill specifically as a
 * workshop lead (e.g. Workshop Coordinator, Technical Committee Chair),
 * as opposed to attending solely as a general workshop participant.
 * Skills are awarded exclusively from workshops (never from projects or manual entry).
 */
export function isLeadSkill(skill: string, student?: Student): boolean {
  if (!skill || !student) return false;
  const sLower = skill.toLowerCase().trim();

  // Check if student is a workshop lead, workshop coordinator, or technical committee chair
  const leadWorkshopSkills = new Set<string>();
  const clubs = student.clubs || [];
  const isWorkshopOrCommitteeLead = clubs.some((c) => {
    const text = `${c.name || ""} ${c.title || ""} ${c.description || ""}`.toLowerCase();
    return (
      text.includes("workshop") ||
      text.includes("committee chair") ||
      text.includes("committee lead") ||
      text.includes("coordinator") ||
      text.includes("instructor") ||
      text.includes("director") ||
      text.includes("vice chair") ||
      text.includes("president") ||
      text.includes("chair")
    );
  });

  if (isWorkshopOrCommitteeLead) {
    clubs.forEach((c) => {
      const text = `${c.title || ""} ${c.description || ""}`.toLowerCase();
      if (text.includes("hardware") || text.includes("pcb")) {
        ["altium designer", "pcb layout", "soldering", "smd soldering", "hardware testing", "kicad", "circuit design"].forEach(
          (s) => leadWorkshopSkills.add(s)
        );
      }
      if (text.includes("robotics") || text.includes("embedded") || text.includes("firmware")) {
        ["freertos", "embedded linux", "c++", "c", "stm32", "arm cortex-m", "ros2", "robotics"].forEach((s) =>
          leadWorkshopSkills.add(s)
        );
      }
      if (text.includes("software") || text.includes("ai") || text.includes("data")) {
        ["python", "pytorch", "edge ai", "computer vision", "opencv"].forEach((s) => leadWorkshopSkills.add(s));
      }
      if (text.includes("cyber") || text.includes("security")) {
        ["cybersecurity", "linux security", "embedded security", "reverse engineering"].forEach((s) =>
          leadWorkshopSkills.add(s)
        );
      }
    });

    // Also include skills from workshops the student attended while serving as a workshop/committee lead
    if (Array.isArray(student.events)) {
      student.events
        .filter((evt) => canAwardSkills(evt.category))
        .forEach((evt) => {
          (evt.skills || []).forEach((sk) => {
            if (sk) leadWorkshopSkills.add(sk.toLowerCase().trim());
          });
        });
    }
  }

  if (leadWorkshopSkills.has(sLower)) {
    return true;
  }

  for (const lSkill of Array.from(leadWorkshopSkills)) {
    if (matchesSkill(sLower, lSkill) || matchesSkill(lSkill, sLower)) {
      return true;
    }
  }

  return false;
}

/**
 * Finds the matching official chapter project on this site.
 */
export function findMatchingIeeeProject(
  project: ProjectEntry,
  student?: Student,
  link?: string
): import("@/data/projects").IEEEProject | undefined {
  if (!project) return undefined;
  const cleanName = (project.name || "")
    .replace(/^(Project Name|Project Title|Project)\s*/i, "")
    .trim()
    .toLowerCase();

  // 1. Match by repositoryUrl if link is provided
  if (link && link.includes("github.com")) {
    const cleanLink = link.toLowerCase().replace(/\/+$/, "").trim();
    const matchByRepo = SAMPLE_IEEE_PROJECTS.find(
      (p) => p.repositoryUrl && p.repositoryUrl.toLowerCase().replace(/\/+$/, "").trim() === cleanLink
    );
    if (matchByRepo) return matchByRepo;
  }

  // Also check all projectLinks of project
  if (Array.isArray(project.projectLinks)) {
    for (const pLink of project.projectLinks) {
      if (pLink && pLink.includes("github.com")) {
        const cleanLink = pLink.toLowerCase().replace(/\/+$/, "").trim();
        const matchByRepo = SAMPLE_IEEE_PROJECTS.find(
          (p) => p.repositoryUrl && p.repositoryUrl.toLowerCase().replace(/\/+$/, "").trim() === cleanLink
        );
        if (matchByRepo) return matchByRepo;
      }
    }
  }

  // 2. Direct exact or substring match by title
  const matchByTitle = SAMPLE_IEEE_PROJECTS.find((p) => {
    const titleLower = p.title.toLowerCase().trim();
    return titleLower === cleanName || titleLower.includes(cleanName) || cleanName.includes(titleLower);
  });
  if (matchByTitle) return matchByTitle;

  // 3. Match by student mainProjectName if present
  if (student?.mainProjectName) {
    const mainLower = student.mainProjectName.toLowerCase().trim();
    const matchByMain = SAMPLE_IEEE_PROJECTS.find((p) => {
      const titleLower = p.title.toLowerCase().trim();
      return titleLower === mainLower || titleLower.includes(mainLower) || mainLower.includes(titleLower);
    });
    if (matchByMain) return matchByMain;
  }

  // 4. Match by slug keywords
  const matchBySlug = SAMPLE_IEEE_PROJECTS.find((p) => {
    const slugClean = p.slug.replace(/^(ieee-|rso-)/, "").replace(/-/g, " ");
    return cleanName.includes(slugClean) || slugClean.includes(cleanName);
  });
  if (matchBySlug) return matchBySlug;

  // 5. Keyword token overlap matching
  const stopWords = new Set(["rso", "ieee", "ucf", "the", "and", "project", "chapter", "autonomous", "system", "systems", "platform"]);
  const cleanTokens = cleanName
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (cleanTokens.length > 0) {
    const matchByTokens = SAMPLE_IEEE_PROJECTS.find((p) => {
      const pTitleTokens = p.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stopWords.has(w));
      const pSlugTokens = p.slug
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stopWords.has(w));

      const allTargetTokens = new Set([...pTitleTokens, ...pSlugTokens]);
      const matchingCount = cleanTokens.filter((t) => allTargetTokens.has(t)).length;

      const hasDistinctiveToken = cleanTokens.some(
        (t) => (t === "micromouse" || t === "quadcopter" || t === "swarm" || t === "inverter" || t === "esc" || t === "beacon" || t === "exoskeleton") && allTargetTokens.has(t)
      );

      return hasDistinctiveToken || matchingCount >= 2;
    });

    if (matchByTokens) return matchByTokens;
  }

  return undefined;
}

/**
 * Finds the matching official chapter event on this site.
 */
export function findMatchingIeeeEvent(
  eventOrTitleOrSlugOrId: EventEntry | string,
  eventsList: IEEEEvent[] = SAMPLE_IEEE_EVENTS
): IEEEEvent | undefined {
  if (!eventOrTitleOrSlugOrId) return undefined;

  const rawTitle =
    typeof eventOrTitleOrSlugOrId === "string"
      ? eventOrTitleOrSlugOrId
      : eventOrTitleOrSlugOrId.title || eventOrTitleOrSlugOrId.id || "";
  const rawId = typeof eventOrTitleOrSlugOrId === "object" ? eventOrTitleOrSlugOrId.id : "";
  const rawSlug = typeof eventOrTitleOrSlugOrId === "object" ? eventOrTitleOrSlugOrId.slug : "";

  const cleanTitle = rawTitle.toLowerCase().trim();
  const cleanId = (rawId || "").toLowerCase().trim();
  const cleanSlug = (rawSlug || "").toLowerCase().trim();

  // 1. Match by exact ID or slug
  const matchById = eventsList.find((e) => {
    const eId = (e.id || "").toLowerCase();
    const eSlug = (e.slug || "").toLowerCase();
    return (
      (cleanId && eId === cleanId) ||
      (cleanSlug && eSlug === cleanSlug) ||
      (cleanTitle && (eId === cleanTitle || eSlug === cleanTitle))
    );
  });
  if (matchById) return matchById;

  // 2. Direct exact match by title
  const matchByExactTitle = eventsList.find((e) => e.title.toLowerCase().trim() === cleanTitle);
  if (matchByExactTitle) return matchByExactTitle;

  // 3. Substring match
  const matchBySubstring = eventsList.find((e) => {
    const eTitle = e.title.toLowerCase().trim();
    return eTitle.includes(cleanTitle) || cleanTitle.includes(eTitle);
  });
  if (matchBySubstring) return matchBySubstring;

  // 4. Normalized match (stripping RSO, IEEE, UCF, chapter, etc.)
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/\b(rso|ieee|ucf|chapter|event|workshop)\b/g, "")
      .replace(/[^a-z0-9]/g, " ")
      .trim();

  const normTarget = normalize(cleanTitle);
  if (normTarget.length > 3) {
    const matchByNorm = eventsList.find((e) => {
      const normE = normalize(e.title);
      return normE.includes(normTarget) || normTarget.includes(normE);
    });
    if (matchByNorm) return matchByNorm;
  }

  // 5. Fallback synthesize if EventEntry object was passed
  if (typeof eventOrTitleOrSlugOrId === "object") {
    const entry = eventOrTitleOrSlugOrId;
    return {
      id: entry.id || `evt-${cleanTitle.replace(/[^a-z0-9]+/g, "-")}`,
      title: entry.title,
      slug: entry.slug || cleanTitle.replace(/[^a-z0-9]+/g, "-"),
      description: entry.description || "IEEE UCF Chapter Event & Workshop",
      category: (entry.category as any) || "Special Event & Tour",
      location: entry.location || "Harris Engineering Center (HEC)",
      startTime: entry.startTime || new Date().toISOString(),
      endTime: entry.endTime,
      host: "IEEE UCF Student Chapter",
      pointsAwarded: entry.pointsAwarded ?? 3,
      tags: entry.skills || [],
      skills: entry.skills || [],
      attendees: [],
    };
  }

  return undefined;
}
