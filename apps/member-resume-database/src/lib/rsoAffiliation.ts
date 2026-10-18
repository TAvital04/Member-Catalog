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
