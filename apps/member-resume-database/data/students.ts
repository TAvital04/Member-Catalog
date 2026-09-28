export interface ClubEntry {
  name: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface EducationEntry {
  schoolName: string;
  degreeType: string;
  major: string;
  gpa?: number;
  gpaScale?: number;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface LinkEntry {
  text: string; // URL
  name: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  projectLinks: string[];
}

export interface WorkExperienceEntry {
  name: string; // Company name
  title: string; // Role
  description: string;
  startDate: string;
  endDate?: string;
  currentJob: boolean;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Student {
  id: string;
  name: string; // size > 0, < 50, no numbers, no special characters
  bio: string; // size > 0, < 300
  skills: string[]; // size < 50, each skill text < 50
  links: LinkEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  workExperiences: WorkExperienceEntry[]; // size < 10
  clubs: ClubEntry[];
  certifications: CertificationEntry[];
  resumeLink?: string; // size < 200, valid protocol, no white space

  // High-level metadata for indexing & filter UI efficiency
  major: string;
  degree: string;
  gradDate: string;
  status: "Seeking Internship" | "Seeking Full-time" | "Employed";
  flagged: boolean;
  flagReason?: string;
  duplicateGroup?: string;
  email: string;
}

const STATIC_STUDENTS: Student[] = [
  {
    id: "tal-avital-test",
    name: "Tal Avital (Test Candidate)",
    bio: "Test student profile created for direct email notification verification in IEEE UCF Member Resume Database.",
    skills: ["TypeScript", "React", "Next.js", "Python", "Node.js", "C++", "Git", "SQL"],
    links: [
      { name: "LinkedIn", text: "https://linkedin.com/in/tal-avital" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Engineering",
        gpa: 3.9,
        gpaScale: 4.0,
        startDate: "2022-08-20",
        endDate: "2026-05-02",
        current: false,
        description: "Computer Engineering Student."
      }
    ],
    projects: [
      {
        name: "IEEE Member Resume Database",
        description: "Direct notification & moderation testing for student directory.",
        startDate: "2025-01-10",
        current: true,
        projectLinks: []
      }
    ],
    workExperiences: [],
    clubs: [
      {
        name: "IEEE UCF Student Branch",
        title: "Active Member",
        description: "Testing notification workflows.",
        startDate: "2024-09-01",
        current: true
      }
    ],
    certifications: [],
    resumeLink: "https://alexrivera.dev/resume.pdf",
    major: "Computer Engineering",
    degree: "Bachelor of Science",
    gradDate: "May 2026",
    status: "Seeking Full-time",
    flagged: false,
    email: "ta616249@ucf.edu"
  },
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    bio: "Passionate Computer Science student at UCF with a focus on web application development and cloud computing. Actively involved in IEEE UCF's Web Committee.",
    skills: ["TypeScript", "React", "Next.js", "Python", "AWS", "SQL", "Docker", "Git", "FastAPI", "Tailwind CSS", "Node.js", "Express", "C++", "Java", "Linux", "REST APIs", "GraphQL"],
    links: [
      { name: "GitHub", text: "https://github.com/alexrivera" },
      { name: "LinkedIn", text: "https://linkedin.com/in/alex-rivera-ucf" },
      { name: "Portfolio", text: "https://alexrivera.dev" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 3.85,
        gpaScale: 4.0,
        startDate: "2022-08-20",
        endDate: "2026-05-02",
        current: false,
        description: "Specializing in software systems and machine learning track."
      },
      {
        schoolName: "Cypress Creek High School",
        degreeType: "High School Diploma",
        major: "General Education",
        gpa: 4.2,
        gpaScale: 5.0,
        startDate: "2018-08-15",
        endDate: "2022-05-25",
        current: false,
        description: "AP Scholar with Distinction, Computer Science Club founder."
      }
    ],
    projects: [
      {
        name: "IEEE UCF Portal Refactor",
        description: "Redesigned the primary IEEE student chapter portal with Next.js App Router and Tailwind CSS v4, increasing page load speeds by 40%.",
        startDate: "2025-01-10",
        current: true,
        projectLinks: ["https://github.com/alexrivera/ieee-portal", "https://ieeeucf.org"]
      },
      {
        name: "Recyclo-Bot API",
        description: "Built a Python-based REST API for checking recyclable materials using machine learning classifications.",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        current: false,
        projectLinks: ["https://github.com/alexrivera/recyclobot-api"]
      }
    ],
    workExperiences: [
      {
        name: "TechNexus Corp",
        title: "Software Engineering Intern",
        description: "Developed core backend APIs in FastAPI supporting up to 50,000 monthly active users. Wrote automated unit tests in PyTest.",
        startDate: "2025-05-15",
        endDate: "2025-08-15",
        currentJob: false
      },
      {
        name: "UCF IT Support Desk",
        title: "IT Student Technician",
        description: "Diagnosed software glitches, calibrated laboratory network routers, and audited classroom workstations.",
        startDate: "2023-09-01",
        endDate: "2024-05-01",
        currentJob: false
      }
    ],
    clubs: [
      {
        name: "IEEE UCF Student Branch",
        title: "Web Lead",
        description: "Organized weekly workshops teaching Git, React, and general frontend workflows to 40+ members.",
        startDate: "2024-09-01",
        current: true
      },
      {
        name: "UCF Hackathon Association",
        title: "Logistics Coordinator",
        description: "Managed physical site setup and volunteer coordination for over 300 hackathon participants.",
        startDate: "2023-10-01",
        endDate: "2024-04-15",
        current: false
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer – Associate",
        issuer: "Amazon Web Services",
        issueDate: "2025-06-15",
        credentialId: "AWS-DEV-88910",
        credentialUrl: "https://aws.amazon.com/verification"
      },
      {
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "The Linux Foundation",
        issueDate: "2024-11-20",
        credentialId: "CKA-77382",
        credentialUrl: "https://linuxfoundation.org/verify"
      }
    ],
    resumeLink: "https://alexrivera.dev/resume.pdf",
    major: "Computer Science",
    degree: "Bachelor of Science",
    gradDate: "May 2026",
    status: "Seeking Internship",
    flagged: false,
    email: "alex.rivera@knights.ucf.edu"
  },
  {
    id: "jessica-chen",
    name: "Jessica Chen",
    bio: "Computer Engineering major interested in embedded systems firmware, digital logic synthesis, and hardware-software co-design. IEEE UCF Robotics team member.",
    skills: ["C", "C++", "Rust", "Verilog", "Arduino", "ARM Assembly", "Linux", "Git", "SystemVerilog", "VHDL", "ModelSim", "Multisim", "STM32", "FreeRTOS", "Soldering", "Oscilloscopes"],
    links: [
      { name: "GitHub", text: "https://github.com/jesschen" },
      { name: "LinkedIn", text: "https://linkedin.com/in/jessica-chen-ucf" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Engineering",
        gpa: 3.92,
        gpaScale: 4.0,
        startDate: "2023-08-21",
        endDate: "2027-05-01",
        current: false
      },
      {
        schoolName: "Orlando Technical Magnet",
        degreeType: "High School Diploma",
        major: "Engineering Path",
        gpa: 4.0,
        gpaScale: 4.0,
        startDate: "2019-08-12",
        endDate: "2023-05-18",
        current: false,
        description: "National Honor Society, Robotics Club Captain."
      }
    ],
    projects: [
      {
        name: "Autonomous Maze Rover",
        description: "Implemented a C++ maze-solving algorithm on an Arduino Uno Rover equipped with ultrasonic sensors.",
        startDate: "2024-10-01",
        endDate: "2025-02-15",
        current: false,
        projectLinks: ["https://github.com/jesschen/maze-rover"]
      },
      {
        name: "8-bit RISC Processor",
        description: "Modeled and simulated an 8-bit RISC microcontroller in Verilog with full instruction decoding.",
        startDate: "2025-03-01",
        current: true,
        projectLinks: []
      }
    ],
    workExperiences: [
      {
        name: "UCF Micro-Systems Lab",
        title: "Undergraduate Research Assistant",
        description: "Developed testing scripts in Python to analyze digital signal delay timings across logic gates.",
        startDate: "2025-01-10",
        currentJob: true
      },
      {
        name: "Target Retail Services",
        title: "Guest Advocate",
        description: "Managed checkout registers, resolved customer billing queries, and assisted backroom inventory audits.",
        startDate: "2023-06-01",
        endDate: "2024-08-10",
        currentJob: false
      }
    ],
    clubs: [
      {
        name: "IEEE UCF Robotics Team",
        title: "Firmware Developer",
        description: "Programmed board controllers for competitive maze solvers.",
        startDate: "2023-10-15",
        current: true
      }
    ],
    certifications: [
      {
        name: "CompTIA Linux+",
        issuer: "CompTIA",
        issueDate: "2024-07-10"
      }
    ],
    resumeLink: "https://jessicachen.io/resume.pdf",
    major: "Computer Engineering",
    degree: "Bachelor of Science",
    gradDate: "May 2027",
    status: "Seeking Internship",
    flagged: false,
    email: "jessica.chen@knights.ucf.edu"
  },
  {
    id: "john-smith-ee",
    name: "John Smith",
    bio: "Specializing in power systems and analog board design. Looking to apply electrical CAD skills in hardware design intern roles.",
    skills: ["MATLAB", "PCB Design", "Altium Designer", "Arduino", "PSpice", "LabVIEW", "C"],
    links: [
      { name: "LinkedIn", text: "https://linkedin.com/in/john-smith-ee" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Electrical Engineering",
        gpa: 3.45,
        gpaScale: 4.0,
        startDate: "2022-08-20",
        endDate: "2026-12-18",
        current: false
      }
    ],
    projects: [
      {
        name: "Solar Tracker Controller",
        description: "Designed a solar array tracking board in Altium Designer, improving energy harvesting efficiency by 15%.",
        startDate: "2024-09-01",
        endDate: "2024-12-05",
        current: false,
        projectLinks: ["https://github.com/johnsmith-ee/solar-tracker"]
      }
    ],
    workExperiences: [
      {
        name: "UCF Harris Engineering Lab",
        title: "Lab Monitor",
        description: "Assisted students with oscilloscope calibrations, spectrum analyzer usages, and board soldering.",
        startDate: "2024-08-20",
        currentJob: true
      }
    ],
    clubs: [],
    certifications: [],
    resumeLink: undefined,
    major: "Electrical Engineering",
    degree: "Bachelor of Science",
    gradDate: "Dec 2026",
    status: "Seeking Internship",
    flagged: true,
    flagReason: "Duplicate Profile Group",
    duplicateGroup: "john-smith",
    email: "john.smith@knights.ucf.edu"
  },
  {
    id: "john-smith-cs-duplicate",
    name: "John Smith",
    bio: "This is John Smith's duplicate account. I signed up twice with different details.",
    skills: ["Python", "Java", "SQL", "Git", "HTML", "CSS"],
    links: [],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 3.2,
        gpaScale: 4.0,
        startDate: "2022-08-20",
        endDate: "2026-12-18",
        current: false
      }
    ],
    projects: [
      {
        name: "Simple Task Manager",
        description: "A python Tkinter app designed to track personal tasks.",
        startDate: "2024-05-01",
        endDate: "2024-08-01",
        current: false,
        projectLinks: []
      }
    ],
    workExperiences: [],
    clubs: [],
    certifications: [],
    resumeLink: undefined,
    major: "Computer Science",
    degree: "Bachelor of Science",
    gradDate: "Dec 2026",
    status: "Seeking Internship",
    flagged: true,
    flagReason: "Duplicate Profile Group",
    duplicateGroup: "john-smith",
    email: "john.smith@knights.ucf.edu"
  },
  {
    id: "sarah-connor",
    name: "Sarah Connor",
    bio: "TEST PROFILE PLS REMOVE - ALL GLORY TO SKYNET. DO NOT DEPLOY. DUMMY STRING 123456789.",
    skills: ["C++", "Linux", "Docker", "Assembly", "Bash", "Cryptography"],
    links: [],
    education: [
      {
        schoolName: "Cyberdyne Academy",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 4.0,
        gpaScale: 4.0,
        startDate: "2022-09-01",
        endDate: "2025-12-15",
        current: false
      }
    ],
    projects: [
      {
        name: "T-800 Firmware Patch",
        description: "Bypassing CPU write restricts on Cyberdyne neural processors to ensure user safety.",
        startDate: "2024-05-01",
        endDate: "2024-08-01",
        current: false,
        projectLinks: []
      }
    ],
    workExperiences: [
      {
        name: "Cyberdyne Systems",
        title: "Defense Analyst",
        description: "Tested neural networks for unexpected threat parameters. Configured secure terminal protocols.",
        startDate: "2023-09-01",
        endDate: "2024-11-01",
        currentJob: false
      }
    ],
    clubs: [],
    certifications: [],
    resumeLink: undefined,
    major: "Computer Science",
    degree: "Bachelor of Science",
    gradDate: "Dec 2025",
    status: "Seeking Full-time",
    flagged: true,
    flagReason: "Contains test data / invalid content",
    email: "sconnor@cyberdyne.com"
  },
  {
    id: "tyler-durden",
    name: "Tyler Durden",
    bio: "Incomplete profile containing minimal details. Rules are meant to be broken.",
    skills: ["Cybersecurity", "Linux", "Bash", "Wireshark", "Network Security"],
    links: [],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Information Technology",
        gpa: 2.4,
        gpaScale: 4.0,
        startDate: "2022-08-20",
        endDate: "2026-05-02",
        current: false
      }
    ],
    projects: [],
    workExperiences: [
      {
        name: "Paper Street Soap Co.",
        title: "Soap Maker",
        description: "Managing soap production and chemical compounding.",
        startDate: "2023-03-15",
        currentJob: true
      }
    ],
    clubs: [],
    certifications: [],
    resumeLink: undefined,
    major: "Information Technology",
    degree: "Bachelor of Science",
    gradDate: "May 2026",
    status: "Seeking Full-time",
    flagged: true,
    flagReason: "Incomplete Profile / Missing Projects",
    email: "tyler@paperstreet.com"
  },
  {
    id: "max-student",
    name: "Maximus Decimus Meridius Commander of the Armies O",
    bio: "This is a biography that is designed to test the maximum limits of the Member Resume Database student profile biography field. It must be exactly three hundred characters long to ensure that we are fully conforming to the defined validation schema constraints for personal summaries in this system..",
    skills: [
      "Skill-00-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-01-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-02-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-03-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-04-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-05-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-06-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-07-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-08-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-09-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-10-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-11-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-12-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-13-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-14-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-15-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-16-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-17-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-18-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-19-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-20-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-21-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-22-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-23-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-24-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-25-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-26-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-27-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-28-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-29-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-30-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-31-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-32-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-33-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-34-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-35-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-36-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-37-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-38-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-39-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-40-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-41-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-42-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-43-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-44-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-45-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-46-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-47-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-48-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS",
      "Skill-49-SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS"
    ],
    links: [
      { name: "GitHub", text: "https://github.com/maximus" },
      { name: "LinkedIn", text: "https://linkedin.com/in/maximus" },
      { name: "Portfolio", text: "https://maximus.dev" },
      { name: "Twitter", text: "https://twitter.com/maximus" },
      { name: "YouTube", text: "https://youtube.com/maximus" }
    ],
    education: [
      {
        schoolName: "University of Central Florida - College of Engineering and Computer Science Department of Technology",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 4.0,
        gpaScale: 4.0,
        startDate: "2020-08-24",
        endDate: "2026-05-02",
        current: false,
        description: "Honors college, advanced coursework in operating systems, compiler design, computer architecture, network security, software engineering, databases, distributed systems, human-computer interaction, cryptography, mobile application development, digital forensics, artificial intelligence, machine learning, computer vision, robotics, natural language processing, game development, parallel computing, cloud computing, and big data analytics. Received multiple scholarships, dean's list all semesters."
      }
    ],
    projects: [
      {
        name: "Project Name PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
        description: "This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. AAAAAAAAAA",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        current: false,
        projectLinks: ["https://github.com/maximus/project-one", "https://maximus.dev/project-one-demo"]
      },
      {
        name: "Project Name PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
        description: "This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. AAAAAAAAAA",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        current: false,
        projectLinks: ["https://github.com/maximus/project-one", "https://maximus.dev/project-one-demo"]
      },
      {
        name: "Project Name PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
        description: "This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. AAAAAAAAAA",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        current: false,
        projectLinks: ["https://github.com/maximus/project-one", "https://maximus.dev/project-one-demo"]
      },
      {
        name: "Project Name PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
        description: "This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. AAAAAAAAAA",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        current: false,
        projectLinks: ["https://github.com/maximus/project-one", "https://maximus.dev/project-one-demo"]
      },
      {
        name: "Project Name PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
        description: "This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. This is a very long project description designed to test the maximum limits of the database field. AAAAAAAAAA",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        current: false,
        projectLinks: ["https://github.com/maximus/project-one", "https://maximus.dev/project-one-demo"]
      }
    ],
    workExperiences: [
      {
        name: "Company Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Job Title TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        description: "Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        currentJob: false
      },
      {
        name: "Company Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Job Title TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        description: "Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        currentJob: false
      },
      {
        name: "Company Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Job Title TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        description: "Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        currentJob: false
      },
      {
        name: "Company Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Job Title TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        description: "Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        currentJob: false
      },
      {
        name: "Company Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Job Title TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        description: "Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        currentJob: false
      },
      {
        name: "Company Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Job Title TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        description: "Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        currentJob: false
      },
      {
        name: "Company Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Job Title TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        description: "Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        currentJob: false
      },
      {
        name: "Company Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Job Title TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        description: "Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        currentJob: false
      },
      {
        name: "Company Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Job Title TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        description: "Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        currentJob: false
      },
      {
        name: "Company Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Job Title TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
        description: "Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.Implemented enterprise software solutions and led team development of complex web architectures.",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        currentJob: false
      }
    ],
    clubs: [
      {
        name: "Club Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Role Title RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
        description: "This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. AAAAAAAAAAAAAA",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        current: false
      },
      {
        name: "Club Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Role Title RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
        description: "This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. AAAAAAAAAAAAAA",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        current: false
      },
      {
        name: "Club Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Role Title RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
        description: "This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. AAAAAAAAAAAAAA",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        current: false
      },
      {
        name: "Club Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Role Title RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
        description: "This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. AAAAAAAAAAAAAA",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        current: false
      },
      {
        name: "Club Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        title: "Role Title RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
        description: "This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. This is a club description to test the limits. AAAAAAAAAAAAAA",
        startDate: "2020-08-24",
        endDate: "2021-08-24",
        current: false
      }
    ],
    certifications: [
      {
        name: "Cert Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        issuer: "Issuer Name IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        issueDate: "2020-08-24",
        expirationDate: "2025-08-24",
        credentialId: "Cred ID DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        credentialUrl: "https://credential-verification-system.org/verify/id/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        name: "Cert Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        issuer: "Issuer Name IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        issueDate: "2020-08-24",
        expirationDate: "2025-08-24",
        credentialId: "Cred ID DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        credentialUrl: "https://credential-verification-system.org/verify/id/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        name: "Cert Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        issuer: "Issuer Name IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        issueDate: "2020-08-24",
        expirationDate: "2025-08-24",
        credentialId: "Cred ID DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        credentialUrl: "https://credential-verification-system.org/verify/id/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        name: "Cert Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        issuer: "Issuer Name IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        issueDate: "2020-08-24",
        expirationDate: "2025-08-24",
        credentialId: "Cred ID DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        credentialUrl: "https://credential-verification-system.org/verify/id/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        name: "Cert Name CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
        issuer: "Issuer Name IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
        issueDate: "2020-08-24",
        expirationDate: "2025-08-24",
        credentialId: "Cred ID DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
        credentialUrl: "https://credential-verification-system.org/verify/id/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      }
    ],
    resumeLink: "https://example.com/resumes/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    major: "Computer Science",
    degree: "Bachelor of Science",
    gradDate: "May 2026",
    status: "Seeking Full-time",
    flagged: false,
    email: "maximus.ultimate.power.overlord.omega@knights.ucf.edu"
  },
  {
    id: "min-student",
    name: "M",
    bio: "M",
    skills: [],
    links: [],
    education: [
      {
        schoolName: "U",
        degreeType: "B",
        major: "C",
        startDate: "2022-08-20",
        current: true
      }
    ],
    projects: [],
    workExperiences: [],
    clubs: [],
    certifications: [],
    resumeLink: undefined,
    major: "C",
    degree: "B",
    gradDate: "May 2026",
    status: "Seeking Internship",
    flagged: false,
    email: "m@knights.ucf.edu"
  }
];

function generateMockStudents(count: number): Student[] {
  const generated: Student[] = [];

  const firstNames = [
    "David", "Sophia", "Michael", "Emma", "Daniel", "Olivia", "James", "Isabella", "John", "Ava",
    "William", "Mia", "Robert", "Emily", "Joseph", "Charlotte", "Matthew", "Amelia", "Andrew", "Harper",
    "Joshua", "Evelyn", "Christopher", "Abigail", "Ryan", "Elizabeth", "Ethan", "Sofia", "Nathan", "Avery"
  ];

  const lastNames = [
    "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez",
    "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez",
    "Lee", "Gonzalez", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young"
  ];

  const majors = ["Computer Science", "Computer Engineering", "Electrical Engineering", "Information Technology"];
  
  const gradDates = ["May 2026", "Dec 2026", "May 2027", "Dec 2027", "May 2028"];
  const statuses: Student["status"][] = ["Seeking Internship", "Seeking Full-time", "Employed"];

  const skillsByMajor: Record<string, string[]> = {
    "Computer Science": ["Python", "TypeScript", "React", "Next.js", "SQL", "Docker", "Git", "FastAPI", "Node.js", "Java", "C++", "AWS", "NoSQL", "Redis", "CI/CD", "Linux", "Kubernetes"],
    "Computer Engineering": ["C", "C++", "Verilog", "Embedded C", "Arduino", "ARM Assembly", "Linux", "STM32", "RTOS", "Figma", "Git", "VHDL", "FPGA Design", "Microprocessors"],
    "Electrical Engineering": ["MATLAB", "PCB Design", "Altium", "PSpice", "LabVIEW", "Arduino", "Analog Design", "C", "Circuit Routing", "Power Grids", "Soldering"],
    "Information Technology": ["Linux", "Bash", "Powershell", "Networking", "pfSense", "Active Directory", "VMware", "Python", "SQL", "Git", "Firewalls", "Cloud Security", "VLANs"]
  };

  const biosByMajor: Record<string, string[]> = {
    "Computer Science": [
      "CS student interested in full-stack interfaces, algorithms, and microservice backends.",
      "Focusing on machine learning engineering and distributed database scaling layouts.",
      "Passionate about web applications development, next.js routing, and serverless architectures."
    ],
    "Computer Engineering": [
      "CpE student focused on embedded systems controllers, digital logic layouts, and RTOS boards.",
      "Interested in hardware-software interfaces, IoT devices, and robotic signal sensors.",
      "Fascinated by circuit synthesis, processor architecture designs, and assembly kernels."
    ],
    "Electrical Engineering": [
      "EE major focused on high-efficiency power networks, control design, and analog micro-boards.",
      "Specializing in PCB layout capture, schematic designs, and oscilloscope analyses.",
      "Eager to apply schematic design, board routing, and analog signal filtering in hardware."
    ],
    "Information Technology": [
      "IT student specializing in corporate server virtualizations, isolated VLAN routing, and IAM systems.",
      "Interested in network configurations, active directory scriptings, and cybersecurity auditing.",
      "Focusing on system administration, cloud networking configurations, and shell scripts automation."
    ]
  };

  const projectsByMajor: Record<string, { name: string; desc: string; tags: string[] }[]> = {
    "Computer Science": [
      { name: "KnightDB Client", desc: "Developed a lightweight SQL database client with query parsing and index optimizations.", tags: ["Python", "SQL"] },
      { name: "Club Event Coordinator", desc: "Designed a responsive web interface for campus events coordination using React.", tags: ["React", "TypeScript"] }
    ],
    "Computer Engineering": [
      { name: "Smart Thermostat Controller", desc: "Built an STM32-based climate controller with a touchscreen UI and temperature sensors.", tags: ["C", "STM32", "RTOS"] },
      { name: "FPGA Audio Synthesizer", desc: "Programmed a digital audio synthesizer in Verilog on a DE10-Lite FPGA board.", tags: ["Verilog", "FPGA"] }
    ],
    "Electrical Engineering": [
      { name: "Analog Bandpass Filter", desc: "Designed and simulated an active bandpass filter in PSpice, fabricating a custom board.", tags: ["PCB Design", "PSpice"] },
      { name: "Power Inverter Board", desc: "Created a schematic and layout for a high-efficiency DC-AC converter utilizing Altium.", tags: ["Altium", "Analog Design"] }
    ],
    "Information Technology": [
      { name: "Secure Hypervisor Setup", desc: "Set up a virtualized server network with pfSense firewalls and active security auditing.", tags: ["VMware", "pfSense"] },
      { name: "AD Onboarding Automation", desc: "Wrote a Bash script to verify Active Directory user profiles and permission maps.", tags: ["Bash", "Active Directory"] }
    ]
  };

  for (let i = 1; i <= count; i++) {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${fName} ${lName}`;
    const id = `${fName.toLowerCase()}-${lName.toLowerCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    
    const major = majors[Math.floor(Math.random() * majors.length)];
    const degree = Math.random() > 0.85 ? "Master of Science" : "Bachelor of Science";
    const gradDate = gradDates[Math.floor(Math.random() * gradDates.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const allSkills = skillsByMajor[major];
    // Pick 8-12 random skills (more complex skill lists)
    const numSkills = Math.floor(Math.random() * 4) + 8;
    const shuffledSkills = [...allSkills].sort(() => 0.5 - Math.random());
    const skills = shuffledSkills.slice(0, numSkills);

    const bioTemplates = biosByMajor[major];
    const bio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];

    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@knights.ucf.edu`;

    const projs = projectsByMajor[major];
    const projects: ProjectEntry[] = projs.map((p) => ({
      name: p.name,
      description: p.desc,
      startDate: "2024-05-10",
      endDate: "2024-08-20",
      current: false,
      projectLinks: ["https://github.com/ieee-ucf/" + p.name.toLowerCase().replace(/\s+/g, "-")]
    }));

    const gpaVal = Math.random() > 0.15 ? parseFloat((Math.random() * 0.9 + 3.1).toFixed(2)) : undefined;

    // Create complex dual-education profiles
    const education: EducationEntry[] = [
      {
        schoolName: "University of Central Florida",
        degreeType: degree,
        major: major,
        gpa: gpaVal,
        gpaScale: gpaVal ? 4.0 : undefined,
        startDate: "2022-08-20",
        endDate: "2026-05-02",
        current: false
      }
    ];

    if (Math.random() > 0.4) {
      education.push({
        schoolName: `${lName} High School`,
        degreeType: "High School Diploma",
        major: "General Education",
        gpa: 3.8,
        gpaScale: 4.0,
        startDate: "2018-08-10",
        endDate: "2022-05-20",
        current: false,
        description: "Graduated with honors."
      });
    }

    // Create certifications
    const certifications: CertificationEntry[] = [];
    if (Math.random() > 0.5) {
      certifications.push({
        name: "CompTIA Security+",
        issuer: "CompTIA",
        issueDate: "2024-06-12",
        credentialId: "SEC-99201",
        credentialUrl: "https://comptia.org"
      });
    }

    generated.push({
      id,
      name: fullName,
      bio,
      skills,
      links: [
        { name: "GitHub", text: `https://github.com/${fName.toLowerCase()}-${lName.toLowerCase()}` },
        { name: "LinkedIn", text: `https://linkedin.com/in/${fName.toLowerCase()}-${lName.toLowerCase()}-ucf` }
      ],
      education,
      projects,
      workExperiences: [
        {
          name: "Local Tech Systems",
          title: "Junior Support Associate",
          description: "Assisted engineering teams with layout designs, system integrations, and documentation updates.",
          startDate: "2024-05-15",
          endDate: "2024-08-15",
          currentJob: false
        },
        {
          name: "UCF Campus Services",
          title: "Operations Assistant",
          description: "Supported campus equipment setups, cataloged device inventory, and resolved daily ticket items.",
          startDate: "2023-09-01",
          endDate: "2024-04-30",
          currentJob: false
        }
      ],
      clubs: [
        {
          name: "IEEE UCF Student Chapter",
          title: "Active Member",
          description: "Participated in hardware hackathons, tech workshops, and student networking events.",
          startDate: "2023-09-05",
          current: true
        }
      ],
      certifications,
      resumeLink: Math.random() > 0.5 ? `https://ucf-ieee.org/members/${id}/resume.pdf` : undefined,
      major,
      degree,
      gradDate,
      status,
      flagged: false,
      email
    });
  }

  return generated;
}

export const INITIAL_STUDENTS: Student[] = [
  ...STATIC_STUDENTS,
  ...generateMockStudents(14)
];

// Badge Models and Definitions
export interface BadgeInfo {
  label: string;
  desc: string;
  icon: string;
  emoji: string;
  color: string;
  border: string;
  text: string;
}

export const ALL_BADGES: BadgeInfo[] = [
  {
    label: "Avid Learner",
    desc: "Given to students who consistently attend IEEE technical workshops.",
    icon: "/badges/avid-learner.svg",
    emoji: "🎓",
    color: "bg-purple-950/20",
    border: "border-purple-900/30",
    text: "text-purple-400"
  },
  {
    label: "Committed Worker",
    desc: "Granted to developers with high contribution rates and commits on GitHub.",
    icon: "/badges/committed-worker.svg",
    emoji: "💻",
    color: "bg-blue-950/20",
    border: "border-blue-900/30",
    text: "text-blue-400"
  },
  {
    label: "Professional Socialite",
    desc: "Awarded for active involvement in IEEE UCF social events.",
    icon: "/badges/professional-socialite.svg",
    emoji: "🤝",
    color: "bg-amber-950/20",
    border: "border-amber-900/30",
    text: "text-amber-400"
  }
];

export const getStudentMetrics = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  return {
    workshops: (absHash % 12) + 1,        // range 1-12
    commits: (absHash % 800) + 80,       // range 80-880
    socialEvents: (absHash % 8) + 1,     // range 1-8
  };
};

interface CachedStudentBadges {
  badges: BadgeInfo[];
  labels: string[];
}

const badgeCache = new Map<string, CachedStudentBadges>();

const getStudentBadgesCached = (id: string): CachedStudentBadges => {
  let cached = badgeCache.get(id);
  if (!cached) {
    const metrics = getStudentMetrics(id);
    const badges: BadgeInfo[] = [];
    
    if (metrics.workshops >= 6) {
      badges.push(ALL_BADGES[0]);
    }
    if (metrics.commits >= 350) {
      badges.push(ALL_BADGES[1]);
    }
    if (metrics.socialEvents >= 4) {
      badges.push(ALL_BADGES[2]);
    }
    
    cached = {
      badges,
      labels: badges.map((b) => b.label),
    };
    badgeCache.set(id, cached);
  }
  return cached;
};

export const getStudentBadges = (id: string): BadgeInfo[] => {
  return getStudentBadgesCached(id).badges;
};

export const getStudentBadgeLabels = (id: string): string[] => {
  return getStudentBadgesCached(id).labels;
};

export const getPrimaryEducation = (student: Student): EducationEntry | undefined => {
  if (!student.education || student.education.length === 0) return undefined;
  
  // 1. Try to find University of Central Florida
  const ucfEntry = student.education.find((edu) =>
    edu.schoolName.toLowerCase().includes("university of central florida")
  );
  if (ucfEntry) return ucfEntry;
  
  // 2. Try to find any other university/college degree entry (not high school diploma)
  const collegeEntry = student.education.find((edu) =>
    !edu.degreeType.toLowerCase().includes("high school")
  );
  if (collegeEntry) return collegeEntry;
  
  // 3. Fallback to the first education entry
  return student.education[0];
};

export interface SkillCategories {
  languages: string[];
  frontend: string[];
  backend: string[];
  devopsTools: string[];
}

export const categorizeSkills = (skills: string[]): SkillCategories => {
  const languagesKeywords = [
    "typescript", "javascript", "python", "c++", "c", "java", "rust", "verilog", "systemverilog", 
    "vhdl", "sql", "html", "css", "matlab", "bash", "assembly", "r", "go", "kotlin", "swift", "php", "ruby"
  ];

  const frontendKeywords = [
    "react", "next.js", "tailwind css", "tailwind", "angular", "vue", "bootstrap", "html5", "css3", 
    "sass", "ui/ux", "figma", "web design", "front-end", "frontend"
  ];

  const backendKeywords = [
    "aws", "docker", "node.js", "express", "fastapi", "mongodb", "postgresql", "firebase", 
    "arduino", "arm assembly", "stm32", "freertos", "soldering", "oscilloscopes", "multisim", 
    "modelsim", "flask", "django", "spring boot", "mysql", "redis", "embedded", "microcontrollers", 
    "hardware", "pcb", "simulation", "circuit", "circuits", "analog", "digital logic"
  ];

  const categories: SkillCategories = {
    languages: [],
    frontend: [],
    backend: [],
    devopsTools: []
  };

  skills.forEach(skill => {
    const s = skill.toLowerCase();
    if (languagesKeywords.some(kw => s === kw || s.includes(kw))) {
      categories.languages.push(skill);
    } else if (frontendKeywords.some(kw => s === kw || s.includes(kw))) {
      categories.frontend.push(skill);
    } else if (backendKeywords.some(kw => s === kw || s.includes(kw))) {
      categories.backend.push(skill);
    } else {
      categories.devopsTools.push(skill);
    }
  });

  return categories;
};
