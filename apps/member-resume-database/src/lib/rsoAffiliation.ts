import { ProjectEntry, Student } from "@/data/students";
import { SAMPLE_IEEE_PROJECTS } from "@/data/projects";
import { SAMPLE_IEEE_EVENTS, IEEEEvent } from "@/data/events";

/**
 * Pre-computed lowercased lookup sets for official RSO chapter projects, tools, and skills.
 */
const RSO_TOOLS_AND_SKILLS = new Set<string>();
const RSO_PROJECT_TITLES = new Set<string>();

// 1. Ingest all official tools and skills taught across all RSO chapter build projects
SAMPLE_IEEE_PROJECTS.forEach((proj) => {
  RSO_PROJECT_TITLES.add(proj.title.toLowerCase().trim());
  if (Array.isArray(proj.tools)) {
    proj.tools.forEach((tool) => {
      if (tool && tool.name) {
        RSO_TOOLS_AND_SKILLS.add(tool.name.toLowerCase().trim());
      }
    });
  }
  if (Array.isArray(proj.skillsTaught)) {
    proj.skillsTaught.forEach((skill) => {
      if (skill) {
        RSO_TOOLS_AND_SKILLS.add(skill.toLowerCase().trim());
      }
    });
  }
});

// 2. Ingest all skills taught in RSO chapter workshops and technical events
SAMPLE_IEEE_EVENTS.forEach((evt: IEEEEvent) => {
  if (Array.isArray(evt.skills)) {
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
 * workshop or project lead (e.g. Project Director, Firmware Lead, Workshop Coordinator),
 * as opposed to attending solely as a general participant/member.
 */
export function isLeadSkill(skill: string, student?: Student): boolean {
  if (!skill || !student) return false;
  const sLower = skill.toLowerCase().trim();

  // 1. Check if student is a lead on any official chapter project
  const leadProjectSkills = new Set<string>();

  // A. Check SAMPLE_IEEE_PROJECTS participants
  SAMPLE_IEEE_PROJECTS.forEach((proj) => {
    const isLeadInProject = proj.participants?.some((part) => {
      const match =
        part.memberId?.toLowerCase() === student.id?.toLowerCase() ||
        part.email?.toLowerCase() === student.email?.toLowerCase() ||
        part.name?.toLowerCase() === student.name?.toLowerCase();
      if (!match) return false;

      const role = (part.roleTitle || "").toLowerCase();
      return (
        role.includes("lead") ||
        role.includes("director") ||
        role.includes("chair") ||
        role.includes("head") ||
        role.includes("coordinator") ||
        role.includes("principal") ||
        role.includes("architect")
      );
    });

    if (isLeadInProject) {
      if (Array.isArray(proj.tools)) {
        proj.tools.forEach((t) => t?.name && leadProjectSkills.add(t.name.toLowerCase().trim()));
      }
      if (Array.isArray(proj.skillsTaught)) {
        proj.skillsTaught.forEach((st) => st && leadProjectSkills.add(st.toLowerCase().trim()));
      }
    }
  });

  // B. Check student's resume project entries
  if (Array.isArray(student.projects)) {
    student.projects.forEach((p) => {
      const text = `${p.name || ""} ${p.description || ""}`.toLowerCase();
      const isLead =
        text.includes("director") ||
        text.includes("project lead") ||
        text.includes("team lead") ||
        text.includes("lead engineer") ||
        text.includes("firmware lead") ||
        text.includes("hardware lead") ||
        text.includes("software lead") ||
        text.includes("led ") ||
        text.includes("leading ");

      if (isLead) {
        const matched = findMatchingIeeeProject(p, student);
        if (matched) {
          if (Array.isArray(matched.tools)) {
            matched.tools.forEach((t) => t?.name && leadProjectSkills.add(t.name.toLowerCase().trim()));
          }
          if (Array.isArray(matched.skillsTaught)) {
            matched.skillsTaught.forEach((st) => st && leadProjectSkills.add(st.toLowerCase().trim()));
          }
        }
      }
    });
  }

  // 2. Check if student is a workshop lead, workshop coordinator, or technical committee chair
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

  if (isWorkshopOrCommitteeLead || leadProjectSkills.size > 0) {
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

    // Universal project / workshop leadership competencies
    ["project management", "leadership", "technical communication", "system architecture"].forEach((s) =>
      leadWorkshopSkills.add(s)
    );
  }

  // 3. Match against collected lead project & workshop skills
  if (leadProjectSkills.has(sLower) || leadWorkshopSkills.has(sLower)) {
    return true;
  }

  for (const lSkill of Array.from(leadProjectSkills).concat(Array.from(leadWorkshopSkills))) {
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
