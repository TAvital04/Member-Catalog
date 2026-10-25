/**
 * @file sponsors.ts — Current IEEE UCF Corporate Sponsors & Industry Partners
 * @description Comprehensive domain models and data for corporate partners supporting
 * IEEE UCF build projects, workshops, job recruiting pipelines, and student equipment grants.
 */

import { IEEEProject, SAMPLE_IEEE_PROJECTS } from "./projects";
import { IEEEEvent, SAMPLE_IEEE_EVENTS } from "./events";
import { JobPosting, JobApplication, SAMPLE_JOB_POSTINGS, SAMPLE_JOB_APPLICATIONS } from "./jobs";
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
  tier: "Platinum" | "Gold" | "Silver" | "Partner";
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
      "Global security and aerospace leader headquartered with major Missiles and Fire Control operations in Orlando, FL. Lockheed Martin actively partners with IEEE UCF to mentor hardware teams, host defense electronics tech talks, and recruit top embedded systems talent.",
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
        description: "Senior radar architects host deep dives on AESA beamforming, RF signal chains, and real-time DSP pipelines for UCF engineering students.",
        category: "Technical Workshops",
        metrics: "120+ attendees annually",
      },
      {
        title: "Autonomous Systems & Robotics Sponsorship",
        description: "Equips the IEEE UCF autonomous robotics teams with flight hardware, telemetry testbeds, and FPGA development kits.",
        category: "Lab & Hardware Grants",
        metrics: "$15,000 in hardware grants",
      },
      {
        title: "Direct Defense Internship Pipeline",
        description: "Priority resume reviews and fast-track interviews for UCF IEEE students targeting Summer Embedded Software and RF engineering internships.",
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
      "Pioneer in analog IC design, power management semiconductors, and low-power embedded processors. TI supports the IEEE UCF hardware labs with precision bench instrumentation, reference silicon, and hands-on power electronics workshops.",
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
        metrics: "Top hiring partner for UCF EE",
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
        description: "Underwrites low-power LoRa mesh sensor development across the UCF campus for distributed environmental monitoring.",
        category: "Lab & Hardware Grants",
        metrics: "$8,000 grant funding",
      },
      {
        title: "Space Coast Avionics Co-Op Program",
        description: "Fast-track interview pipelines for UCF electrical and computer engineers for multi-term aerospace engineering co-ops in Melbourne.",
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
      "Premier aerospace and defense systems provider advancing autonomous aircraft, orbital spacecraft, and cyber defense. Northrop Grumman mentors UCF competition teams and delivers hands-on embedded security seminars.",
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
];

export interface StudentInteraction {
  student: Student;
  interactionType: "Event Attendee" | "Job Applicant" | "Project Contributor";
  context: string;
  date?: string;
}

export interface SponsorDetailedRelations {
  sponsor: ChapterSponsor;
  projects: IEEEProject[];
  events: IEEEEvent[];
  jobs: JobPosting[];
  skills: string[];
  interactions: StudentInteraction[];
}

/**
 * Computes all related projects, workshops, jobs, skills, and student interactions for a given sponsor.
 */
export function getSponsorRelatedData(
  sponsor: ChapterSponsor,
  allProjects: IEEEProject[] = SAMPLE_IEEE_PROJECTS,
  allEvents: IEEEEvent[] = SAMPLE_IEEE_EVENTS,
  allJobs: JobPosting[] = SAMPLE_JOB_POSTINGS,
  allApps: JobApplication[] = SAMPLE_JOB_APPLICATIONS,
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

  // 3. Related Jobs
  const jobs = allJobs.filter((j) => {
    return (
      sponsor.jobCompanyNames.some((c) => j.companyName.toLowerCase().includes(c.toLowerCase())) ||
      j.companyName.toLowerCase().includes(sponsor.name.toLowerCase())
    );
  });

  // 4. Key Skills
  const skillsSet = new Set<string>(sponsor.keySkills);
  projects.forEach((p) => {
    (p.tools || []).forEach((t) => skillsSet.add(t.name));
    (p.skillsTaught || []).forEach((s) => skillsSet.add(s));
  });
  events.forEach((e) => {
    (e.skills || []).forEach((s) => skillsSet.add(s));
  });
  jobs.forEach((j) => {
    (j.skillsRequired || []).forEach((s) => skillsSet.add(s));
  });

  // Helper to create fallback student object from attendee/applicant metadata
  const makeFallbackStudent = (id: string, name: string, email: string, major?: string): Student => ({
    id: id || `cand-${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    email,
    major: major || "Engineering",
    degree: "B.S.",
    gradDate: "2026",
    status: "Seeking Internship",
    flagged: false,
    bio: "IEEE UCF student engineer.",
    skills: [],
    links: [],
    education: [],
    projects: [],
    workExperiences: [],
    clubs: [],
    certifications: [],
  });

  // 5. Interacting Students
  const interactionsMap = new Map<string, StudentInteraction>();

  // A. Event Attendees
  events.forEach((evt) => {
    (evt.attendees || []).forEach((att) => {
      const match = allStudents.find(
        (s) =>
          s.id.toLowerCase() === att.memberId.toLowerCase() ||
          s.name.toLowerCase() === att.name.toLowerCase() ||
          s.email.toLowerCase() === att.email.toLowerCase()
      );
      const student = match || makeFallbackStudent(att.memberId, att.name, att.email, att.major);
      if (!interactionsMap.has(student.id)) {
        interactionsMap.set(student.id, {
          student,
          interactionType: "Event Attendee",
          context: `Attended ${evt.title}`,
          date: evt.startTime,
        });
      }
    });
  });

  // B. Job Applicants
  jobs.forEach((job) => {
    const jobApps = allApps.filter((a) => a.jobId === job.id);
    jobApps.forEach((app) => {
      const match = allStudents.find((s) => s.id === app.memberId);
      const student =
        match ||
        makeFallbackStudent(
          app.memberId,
          app.portfolioSnapshot?.name || "Candidate",
          app.portfolioSnapshot?.email || "candidate@knights.ucf.edu",
          app.portfolioSnapshot?.major || "Engineering"
        );
      if (!interactionsMap.has(student.id)) {
        interactionsMap.set(student.id, {
          student,
          interactionType: "Job Applicant",
          context: `Applied for ${job.title} (${app.status})`,
          date: app.appliedAt,
        });
      }
    });
  });

  // C. Project Leads & Contributors
  projects.forEach((prj) => {
    (prj.participants || []).forEach((part) => {
      const match = allStudents.find(
        (s) =>
          s.id.toLowerCase() === part.memberId.toLowerCase() ||
          s.name.toLowerCase() === part.name.toLowerCase() ||
          s.email.toLowerCase() === part.email.toLowerCase()
      );
      const student = match || makeFallbackStudent(part.memberId, part.name, part.email, part.major);
      if (!interactionsMap.has(student.id)) {
        interactionsMap.set(student.id, {
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
    jobs,
    skills: Array.from(skillsSet),
    interactions: Array.from(interactionsMap.values()),
  };
}
