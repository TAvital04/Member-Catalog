/**
 * @file sponsors.ts — Current RSO USF Corporate Sponsors & Industry Partners
 * @description Comprehensive domain models and data for corporate partners supporting
 * RSO USF build projects, workshops, job recruiting pipelines, and student equipment grants.
 */

import { IEEEProject, SAMPLE_IEEE_PROJECTS } from "./projects";
import { IEEEEvent, SAMPLE_IEEE_EVENTS } from "./events";
import { Student, INITIAL_STUDENTS } from "./students";

export interface SponsorInitiative {
  title: string;
  description: string;
  category: "Lab & Hardware Grants" | "Technical Workshops" | "Recruiting & Careers" | "Capstone Mentorship";
  metrics?: string;
}

export interface ChapterSponsor {
  id: string;
  name: string;
  tier: "Platinum" | "Gold" | "Silver" | "Local Partner" | "Partner";
  tagline: string;
  description: string;
  logoText: string;
  website: string;
  careersUrl: string;
  contactEmail: string;
  location: string;
  partnerSince: string;
  primaryFocus: string[];
  initiatives: SponsorInitiative[];
  sponsoredProjectSlugs: string[];
  sponsoredEventSlugs: string[];
  jobCompanyNames: string[];
  keySkills: string[];
}

export const CURRENT_CHAPTER_SPONSORS: ChapterSponsor[] = [
  {
    id: "lockheed-martin",
    name: "Lockheed Martin",
    tier: "Platinum",
    tagline: "Aerospace, Defense & Radar Engineering",
    description:
      "Global security and aerospace leader headquartered with major Missiles and Fire Control operations in Orlando, FL. Lockheed Martin actively partners with RSO USF to mentor hardware teams, host defense electronics tech talks, and recruit top embedded systems talent.",
    logoText: "LM",
    website: "https://www.lockheedmartin.com",
    careersUrl: "https://www.lockheedmartinjobs.com",
    contactEmail: "university.relations@lmco.com",
    location: "Orlando, FL",
    partnerSince: "2018",
    primaryFocus: ["Embedded Flight Software", "Phased-Array Radar", "FPGA DSP", "Guidance & Navigation"],
    initiatives: [
      {
        title: "Defense Electronics & Radar Tech Talks",
        description: "Senior radar architects host deep dives on AESA beamforming, RF signal chains, and real-time DSP pipelines for USF engineering students.",
        category: "Technical Workshops",
        metrics: "120+ attendees annually",
      },
      {
        title: "Autonomous Systems & Robotics Sponsorship",
        description: "Equips the RSO USF autonomous robotics teams with flight hardware, telemetry testbeds, and FPGA development kits.",
        category: "Lab & Hardware Grants",
        metrics: "$15,000 in hardware grants",
      },
      {
        title: "Direct Defense Internship Pipeline",
        description: "Priority resume reviews and fast-track interviews for USF RSO students targeting Summer Embedded Software and RF engineering internships.",
        category: "Recruiting & Careers",
        metrics: "18 interns hired in last 2 years",
      },
    ],
    sponsoredProjectSlugs: ["ieee-autonomous-drone-swarm-precision-mesh", "ieee-micromouse-autonomous-maze-solver"],
    sponsoredEventSlugs: ["lockheed-martin-radar-tech-talk", "resume-recruiter-showcase-2024"],
    jobCompanyNames: ["Lockheed Martin"],
    keySkills: ["C++", "RTOS", "FPGA", "DSP", "Radar Systems", "Linux", "Git", "STM32F4", "RF Engineering"],
  },
  {
    id: "texas-instruments",
    name: "Texas Instruments",
    tier: "Platinum",
    tagline: "Semiconductors & Embedded Processing",
    description:
      "Pioneer in analog IC design, power management semiconductors, and low-power embedded processors. TI supports the RSO USF hardware labs with precision bench instrumentation, reference silicon, and hands-on power electronics workshops.",
    logoText: "TI",
    website: "https://www.ti.com",
    careersUrl: "https://careers.ti.com",
    contactEmail: "campusrelations@ti.com",
    location: "Dallas, TX / Orlando, FL",
    partnerSince: "2019",
    primaryFocus: ["Analog IC Design", "Power Electronics", "Mixed-Signal SPICE", "Microcontrollers"],
    initiatives: [
      {
        title: "Analog Power Management Hands-On Lab",
        description: "Interactive laboratory workshops covering buck/boost converter topology optimization, EMI suppression, and battery charge telemetry.",
        category: "Technical Workshops",
        metrics: "85+ student participants",
      },
      {
        title: "RSO Silicon & Component Donation Program",
        description: "Supplies C2000 digital power microcontrollers, GaN gate drivers, and operational amplifiers for student build projects.",
        category: "Lab & Hardware Grants",
        metrics: "500+ IC components supplied",
      },
      {
        title: "Analog & Power Applications Co-Op Pipeline",
        description: "Recruits student co-ops and full-time applications engineers for high-voltage power conversion and signal chain design.",
        category: "Recruiting & Careers",
        metrics: "Top hiring partner for USF EE",
      },
    ],
    sponsoredProjectSlugs: ["ieee-sic-high-efficiency-power-inverter", "ieee-micromouse-autonomous-maze-solver"],
    sponsoredEventSlugs: ["ti-analog-power-management"],
    jobCompanyNames: ["Texas Instruments"],
    keySkills: ["Power Electronics", "Analog Design", "LTspice", "PCB Layout", "Microcontrollers", "SiC / GaN", "C2000"],
  },
  {
    id: "l3harris",
    name: "L3Harris Technologies",
    tier: "Gold",
    tagline: "Tactical Communications & Avionics",
    description:
      "Trusted defense technology disruptor specializing in tactical radios, space payloads, and secure wireless networks on Florida's Space Coast. L3Harris sponsors student communication networks and senior design showcases.",
    logoText: "L3H",
    website: "https://www.l3harris.com",
    careersUrl: "https://careers.l3harris.com",
    contactEmail: "university@l3harris.com",
    location: "Melbourne, FL",
    partnerSince: "2020",
    primaryFocus: ["Avionics", "Tactical Communications", "RF Hardware", "Wireless Mesh"],
    initiatives: [
      {
        title: "Tactical Communications & RF Engineering Seminar",
        description: "Technical sessions analyzing spread-spectrum modulation, software-defined radios (SDR), and space vehicle telemetry systems.",
        category: "Technical Workshops",
        metrics: "Annual Space Coast Tech Talk",
      },
      {
        title: "IoT Environmental Sensor Mesh Sponsorship",
        description: "Underwrites low-power LoRa mesh sensor development across the USF campus for distributed environmental monitoring.",
        category: "Lab & Hardware Grants",
        metrics: "$8,000 grant funding",
      },
      {
        title: "Space Coast Avionics Co-Op Program",
        description: "Fast-track interview pipelines for USF electrical and computer engineers for multi-term aerospace engineering co-ops in Melbourne.",
        category: "Recruiting & Careers",
        metrics: "12 co-ops placed annually",
      },
    ],
    sponsoredProjectSlugs: ["ieee-lora-mesh-environmental-sensor-network"],
    sponsoredEventSlugs: ["resume-recruiter-showcase-2024"],
    jobCompanyNames: ["L3Harris Technologies", "L3Harris"],
    keySkills: ["RF Engineering", "Wireless Mesh", "LoRaWAN", "Embedded Systems", "Antenna Design", "MATLAB"],
  },
  {
    id: "northrop-grumman",
    name: "Northrop Grumman",
    tier: "Gold",
    tagline: "Autonomous Systems & Space Payloads",
    description:
      "Premier aerospace and defense systems provider advancing autonomous aircraft, orbital spacecraft, and cyber defense. Northrop Grumman mentors USF competition teams and delivers hands-on embedded security seminars.",
    logoText: "NG",
    website: "https://www.northropgrumman.com",
    careersUrl: "https://www.northropgrumman.com/careers",
    contactEmail: "college.recruiting@ngc.com",
    location: "Melbourne, FL / St. Augustine, FL",
    partnerSince: "2021",
    primaryFocus: ["Autonomous Flight", "Embedded Cyber Security", "Space Systems", "Mission Software"],
    initiatives: [
      {
        title: "Embedded Security & Hardware Hacking Workshop",
        description: "Hands-on vulnerability analysis covering JTAG memory dumping, side-channel attacks, and cryptographic hardware root-of-trust.",
        category: "Technical Workshops",
        metrics: "Sold-out lab session (45 cap)",
      },
      {
        title: "Autonomous Drone Swarm R&D Grant",
        description: "Funds multi-agent flight controller prototyping and collision avoidance algorithms for the student drone research team.",
        category: "Lab & Hardware Grants",
        metrics: "$10,000 equipment sponsorship",
      },
      {
        title: "Systems Engineering Career Showcase",
        description: "Direct networking with Northrop Grumman flight test directors and systems engineering managers for graduating seniors.",
        category: "Recruiting & Careers",
        metrics: "Fall & Spring hiring rounds",
      },
    ],
    sponsoredProjectSlugs: ["ieee-autonomous-drone-swarm-precision-mesh"],
    sponsoredEventSlugs: ["northrop-grumman-cyber-embedded-security"],
    jobCompanyNames: ["Northrop Grumman"],
    keySkills: ["Cybersecurity", "Embedded Security", "Python", "Autonomous Flight", "ROS2", "Reverse Engineering", "C"],
  },
  {
    id: "siemens-eda",
    name: "Siemens EDA",
    tier: "Silver",
    tagline: "Electronic Design Automation & IC Verification",
    description:
      "World leader in printed circuit board design, semiconductor verification, and signal integrity simulation tools. Siemens EDA provides free student tooling licenses and sponsors the chapter's IPC soldering and PCB design certifications.",
    logoText: "SIEM",
    website: "https://eda.sw.siemens.com",
    careersUrl: "https://www.siemens.com/careers",
    contactEmail: "academic.eda@siemens.com",
    location: "Orlando, FL / Wilsonville, OR",
    partnerSince: "2022",
    primaryFocus: ["PCB Design", "Signal Integrity", "HyperLynx Simulation", "EDA Tooling"],
    initiatives: [
      {
        title: "IPC Soldering & PCB Certification Program",
        description: "Underwrites student certification costs and surface-mount soldering kits for IPC-A-610 standards compliance.",
        category: "Lab & Hardware Grants",
        metrics: "60+ certified student members",
      },
      {
        title: "EDA Simulation & Signal Integrity Masterclass",
        description: "Industry training on high-speed DDR routing, differential impedance matching, and electromagnetic interference (EMI) mitigation.",
        category: "Technical Workshops",
        metrics: "Semester workshop series",
      },
    ],
    sponsoredProjectSlugs: ["ieee-micromouse-autonomous-maze-solver", "ieee-sic-high-efficiency-power-inverter"],
    sponsoredEventSlugs: ["ipc-soldering-certification-bootcamp"],
    jobCompanyNames: ["Siemens EDA", "Siemens"],
    keySkills: ["Altium Designer", "PCB Layout", "Signal Integrity", "Soldering", "SMD Soldering", "Hardware Testing"],
  },
  {
    id: "tampa-bay-embedded-labs",
    name: "Tampa Bay Embedded Labs",
    tier: "Local Partner",
    tagline: "IoT Firmware & Rapid Hardware Prototyping",
    description:
      "Boutique engineering consultancy based in Tampa specializing in low-power wireless sensor nodes, firmware architecture, and rapid SMD prototype assembly. Partners directly with USF student builders for semester co-ops and bench testing.",
    logoText: "TBEL",
    website: "https://tampabayembedded.com",
    careersUrl: "https://tampabayembedded.com/careers",
    contactEmail: "recruiting@tampabayembedded.com",
    location: "Tampa, FL",
    partnerSince: "2023",
    primaryFocus: ["Low-Power IoT", "ESP32 Firmware", "FreeRTOS", "PCB Rapid Prototyping"],
    initiatives: [
      {
        title: "Rapid Prototype Component Micro-Grant",
        description: "Funds quick-turn PCB fabrication runs, test breakout boards, and passives kits for chapter sensor projects.",
        category: "Lab & Hardware Grants",
        metrics: "$500 hardware micro-grant",
      },
      {
        title: "Hands-on ESP32 & FreeRTOS Firmware Teardown",
        description: "Boutique senior firmware engineers lead code teardowns on power-saving sleep modes, task queues, and SPI bus debugging.",
        category: "Technical Workshops",
        metrics: "Semester workshop demo",
      },
      {
        title: "Tampa Bay Semester Co-Op Fast-Track",
        description: "Flexible 15-20 hr/week engineering co-ops during the academic semester for students living in the Tampa Bay area.",
        category: "Recruiting & Careers",
        metrics: "3 co-ops placed annually",
      },
    ],
    sponsoredProjectSlugs: ["ieee-lora-mesh-environmental-sensor-network"],
    sponsoredEventSlugs: ["ieee-hands-on-pcb-design-cadence"],
    jobCompanyNames: ["Tampa Bay Embedded Labs"],
    keySkills: ["ESP32", "FreeRTOS", "C", "Altium Designer", "PCB Layout", "IoT", "KiCad", "Hardware Testing"],
  },
  {
    id: "circuitcraft-prototyping",
    name: "CircuitCraft Prototyping",
    tier: "Local Partner",
    tagline: "Custom PCB Fabrication & Precision Assembly",
    description:
      "Regional electronics assembly, inspection, and rework facility in St. Petersburg, FL. CircuitCraft underwrites student soldering supplies, stencil printers, and provides direct Design for Manufacturing (DFM) reviews for student competition boards.",
    logoText: "CC",
    website: "https://circuitcraftproto.com",
    careersUrl: "https://circuitcraftproto.com/careers",
    contactEmail: "careers@circuitcraftproto.com",
    location: "St. Petersburg, FL",
    partnerSince: "2024",
    primaryFocus: ["Surface Mount Technology (SMT)", "DFM Analysis", "Quick-Turn Assembly", "PCB Prototyping"],
    initiatives: [
      {
        title: "Precision SMD Soldering Lab Micro-Grant",
        description: "Provides solder paste, high-precision tweezers, hot air stations, and lead-free alloy consumables for student lab benches.",
        category: "Lab & Hardware Grants",
        metrics: "$400 consumable grant",
      },
      {
        title: "Design for Manufacturing (DFM) Clinic",
        description: "Pre-fabrication design reviews analyzing trace clearances, via aspect ratios, and thermal relief for student hardware.",
        category: "Technical Workshops",
        metrics: "Pre-competition board reviews",
      },
    ],
    sponsoredProjectSlugs: ["ieee-sic-high-efficiency-power-inverter", "ieee-micromouse-autonomous-maze-solver"],
    sponsoredEventSlugs: ["ipc-soldering-certification-bootcamp"],
    jobCompanyNames: ["CircuitCraft Prototyping"],
    keySkills: ["Soldering", "SMD Soldering", "Hardware Testing", "PCB Design", "Altium Designer", "DFM", "Assembly"],
  },
];

export interface SponsorshipTierDefinition {
  tier: "Platinum" | "Gold" | "Silver" | "Local Partner";
  annualInvestment: string;
  targetAudience: string;
  tagline: string;
  highlights: string[];
  deliverables: string[];
  resumeBookAccess: string;
  badgeVariant?: string;
}

export const CHAPTER_IMPACT_METRICS = {
  activeBuilders: 142,
  hardwareGrantsFunded: "$38,500",
  technicalWorkshopsHeld: 18,
  verifiedStudentAttendees: 450,
  averagePlacementRate: "94%",
  projectsActive: 6,
};

export const SPONSORSHIP_TIERS_GUIDE: SponsorshipTierDefinition[] = [
  {
    tier: "Platinum",
    annualInvestment: "$10,000+",
    targetAudience: "Enterprise Aerospace, Defense & Tech Leaders",
    tagline: "Premier Chapter Naming Rights & Direct Talent Pipeline",
    highlights: [
      "Full unrestricted Candidate Directory & 1-Click Resume Book Export (ATS / CSV / PDF)",
      "Premier Lab Naming Rights & Hardware Project Title Sponsorship",
      "2 Dedicated Hands-on Technical Workshops & Tech Talks",
      "Pre-Career Fair Priority Shortlist & Private Interview Suites",
    ],
    deliverables: [
      "Custom Filtered Candidate Books tailored to your tech stack",
      "Executive Impact Report with Attendance & Placement Metrics",
      "Logo on All Chapter Project Hardware & Competition Banners",
      "Direct Email Outreach to Top-Ranked Student Builders",
    ],
    resumeBookAccess: "Full ATS/CSV + High-Res Letter PDF Dossiers (Unlimited Downloads)",
  },
  {
    tier: "Gold",
    annualInvestment: "$5,000",
    targetAudience: "Regional Engineering & Systems Employers",
    tagline: "Hardware Build Underwriting & Technical Showcase",
    highlights: [
      "Full Chapter Candidate Directory & Resume Book Access",
      "1 Dedicated Technical Seminar or Career Panel",
      "Sponsorship of 1 Major Hardware Build (e.g. Micromouse, Drone Swarm)",
      "Direct Outreach to Project Contributor Rosters",
    ],
    deliverables: [
      "Pre-Fair Chapter Resume Book",
      "Project Showcase Placement & Workshop Analytics",
      "Direct Contact with Verified Workshop Attendees",
    ],
    resumeBookAccess: "Full Candidate Directory + Pre-Fair Resume Book Download",
  },
  {
    tier: "Silver",
    annualInvestment: "$2,500",
    targetAudience: "Industry Partners & Corporate Recruiters",
    tagline: "Annual Talent Roster Access & Chapter Branding",
    highlights: [
      "Full Candidate Directory Access & Shortlisting Tools",
      "Official Corporate Partner Badge on Chapter Website",
      "Resume Book Export with Filterable Major & Grad Cohort Batches",
    ],
    deliverables: [
      "Semi-Annual Resume Book Exports",
      "Direct Student Portfolio Links (GitHub, LinkedIn, PDF Resumes)",
    ],
    resumeBookAccess: "Standard Filtered Resume Book & CSV Roster Export",
  },
  {
    tier: "Local Partner",
    annualInvestment: "$300 – $1,000",
    targetAudience: "Local Startups, Boutiques & Regional Consultancies",
    tagline: "Niche Skill Discovery, Micro-Grants & Local Co-Ops",
    highlights: [
      "10-Second Niche Skill & Tool Search (Find the 3 students who know Altium or STM32)",
      "Targeted Micro-Grant Recognition (Underwrite a specific sensor, PCB run, or tool)",
      "Access to Local Candidates seeking Tampa Bay / Florida part-time co-ops",
      "15-Minute Technical Teardown or Demo at a Chapter Meeting",
    ],
    deliverables: [
      "Direct Contact with Students Building Aligned Hardware",
      "Named Micro-Grant Placement on Sponsored Hardware Project",
      "1-Click Filtered Roster Export for Local Hiring",
    ],
    resumeBookAccess: "Targeted Candidate Roster & Direct Email Outreach",
  },
];

export interface StudentInteraction {
  student: Student;
  interactionType: "Event Attendee" | "Project Contributor";
  context: string;
  date?: string;
}

export interface SponsorDetailedRelations {
  sponsor: ChapterSponsor;
  projects: IEEEProject[];
  events: IEEEEvent[];
  jobs: any[];
  skills: string[];
  interactions: StudentInteraction[];
}

/**
 * Computes all related projects, workshops, skills, and student interactions for a given sponsor.
 */
export function getSponsorRelatedData(
  sponsor: ChapterSponsor,
  allProjects: IEEEProject[] = SAMPLE_IEEE_PROJECTS,
  allEvents: IEEEEvent[] = SAMPLE_IEEE_EVENTS,
  _unusedJobs?: any[],
  _unusedApps?: any[],
  allStudents: Student[] = INITIAL_STUDENTS
): SponsorDetailedRelations {
  // 1. Related Projects
  const projects = allProjects.filter(
    (p) =>
      sponsor.sponsoredProjectSlugs.includes(p.slug) ||
      sponsor.sponsoredProjectSlugs.includes(p.id) ||
      (p.description && p.description.toLowerCase().includes(sponsor.name.toLowerCase()))
  );

  // 2. Related Events & Workshops
  const events = allEvents.filter((e) => {
    if (sponsor.sponsoredEventSlugs.includes(e.slug) || sponsor.sponsoredEventSlugs.includes(e.id)) {
      return true;
    }
    if (e.partner && e.partner.toLowerCase().includes(sponsor.name.toLowerCase())) {
      return true;
    }
    if (e.title.toLowerCase().includes(sponsor.name.toLowerCase())) {
      return true;
    }
    return false;
  });

  // 3. Key Skills
  const skillsSet = new Set<string>(sponsor.keySkills);
  projects.forEach((p) => {
    (p.tools || []).forEach((t) => skillsSet.add(t.name));
    (p.skillsTaught || []).forEach((s) => skillsSet.add(s));
  });
  events.forEach((e) => {
    (e.skills || []).forEach((s) => skillsSet.add(s));
  });

  // Precompute workshop-earned skills per student from SAMPLE_IEEE_EVENTS (Technical Workshops only)
  // A member only has their skills updated if they attend a workshop for it — never from projects or manual entry.
  const workshopSkillsByStudent = new Map<string, Set<string>>();
  const addWorkshopSkillsForKey = (key: string, skillsToAdd: string[]) => {
    const cleanKey = (key || "").toLowerCase().trim();
    if (!cleanKey) return;
    const set = workshopSkillsByStudent.get(cleanKey) || new Set<string>();
    skillsToAdd.forEach((sk) => {
      if (sk) set.add(sk);
    });
    workshopSkillsByStudent.set(cleanKey, set);
  };

  allEvents
    .filter((evt) => evt.category === "Technical Workshop")
    .forEach((evt) => {
      const wSkills = evt.skills || [];
      (evt.attendees || []).forEach((att) => {
        if (att.memberId) addWorkshopSkillsForKey(att.memberId, wSkills);
        if (att.name) addWorkshopSkillsForKey(att.name, wSkills);
        if (att.email) addWorkshopSkillsForKey(att.email, wSkills);
      });
    });

  // Helper to resolve or create a rich student object from attendee/applicant/participant metadata.
  // Skills are populated strictly from workshop attendance (never from projects, job applications, or manual entry).
  const resolveStudent = (
    id: string,
    name: string,
    email: string,
    major?: string,
    workshopSkills: string[] = []
  ): Student => {
    const cleanId = (id || "").toLowerCase().trim();
    const cleanName = (name || "").toLowerCase().trim();
    const cleanEmail = (email || "").toLowerCase().trim();

    const match = allStudents.find(
      (s) =>
        (cleanId && s.id.toLowerCase() === cleanId) ||
        (cleanName && s.name.toLowerCase() === cleanName) ||
        (cleanEmail && s.email.toLowerCase() === cleanEmail)
    );

    const attendedWorkshopSkills = [
      ...(workshopSkillsByStudent.get(cleanId) || []),
      ...(workshopSkillsByStudent.get(cleanName) || []),
      ...(workshopSkillsByStudent.get(cleanEmail) || []),
      ...workshopSkills,
    ];

    const mergedSkills = Array.from(
      new Set([
        ...(match?.skills || []),
        ...attendedWorkshopSkills,
      ])
    );

    if (match) {
      return {
        ...match,
        major: match.major || major || "Engineering",
        skills: mergedSkills,
      };
    }

    return {
      id: id || `cand-${cleanName.replace(/\s+/g, "-")}`,
      name,
      email,
      major: major || "Engineering",
      degree: "B.S.",
      gradDate: "May 2026",
      status: "Seeking Internship",
      flagged: false,
      bio: "RSO USF student engineer.",
      skills: mergedSkills,
      links: [],
      education: [],
      projects: [],
      workExperiences: [],
      clubs: [],
      certifications: [],
    };
  };

  // 5. Interacting Students (keyed by normalized student name to avoid duplicate entries across touchpoints)
  const interactionsMap = new Map<string, StudentInteraction>();
  const getStudentKey = (s: Student) => s.name.toLowerCase().trim() || s.id.toLowerCase().trim();

  // A. Event Attendees (Only Technical Workshops grant skills to attendees)
  events.forEach((evt) => {
    const workshopSkills = evt.category === "Technical Workshop" ? evt.skills || [] : [];
    (evt.attendees || []).forEach((att) => {
      const student = resolveStudent(att.memberId, att.name, att.email, att.major, workshopSkills);
      const key = getStudentKey(student);
      if (!interactionsMap.has(key)) {
        interactionsMap.set(key, {
          student,
          interactionType: "Event Attendee",
          context: `Attended ${evt.title}`,
          date: evt.startTime,
        });
      }
    });
  });

  // B. Project Leads & Contributors (Projects do NOT update a member's skills; pass [] for workshopSkills)
  projects.forEach((prj) => {
    (prj.participants || []).forEach((part) => {
      const student = resolveStudent(part.memberId, part.name, part.email, part.major, []);
      const key = getStudentKey(student);
      if (!interactionsMap.has(key)) {
        interactionsMap.set(key, {
          student,
          interactionType: "Project Contributor",
          context: `${part.roleTitle} on ${prj.title}`,
        });
      }
    });
  });

  return {
    sponsor,
    projects,
    events,
    jobs: [],
    skills: Array.from(skillsSet),
    interactions: Array.from(interactionsMap.values()),
  };
}
