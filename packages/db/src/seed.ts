import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { members, memberResumes } from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/ieee-website';

const DENSE_CANDIDATES = [
  {
    name: "Alex Rivera",
    email: "arivera@knights.ucf.edu",
    major: "Computer Engineering",
    graduationYear: "2026",
    status: "Seeking Internship",
    bio: "Computer Engineering junior specializing in embedded Linux systems, real-time operating systems (FreeRTOS), and FPGA hardware accelerators. Passionate about robotics and low-level firmware optimization.",
    resumePdfUrl: "https://drive.google.com/file/d/alex-rivera-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/alex-rivera-ucf" },
      { platformName: "GitHub", profileUrl: "https://github.com/arivera-ucf" },
      { platformName: "Portfolio", profileUrl: "https://arivera.dev" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Engineering",
        gpa: 3.92,
        gpaScale: 4.0,
        startDate: "2022-08-22",
        endDate: "2026-05-02",
        isCurrent: true,
        description: "Burnett Honors College Scholar. Coursework: Computer Architecture, Embedded Systems, Real-Time Operating Systems, VLSI Design."
      }
    ],
    skills: [
      "C++", "C", "FreeRTOS", "Embedded Linux", "Verilog", "ARM Cortex-M", "Python", "Rust", "FPGA", "Altium Designer", "Linux Kernel", "STM32", "Git"
    ],
    workExperience: [
      {
        companyName: "Lockheed Martin",
        jobTitle: "Flight Software Engineering Co-Op",
        startDate: "2024-05-15",
        endDate: "2024-12-20",
        isCurrentJob: false,
        description: "Developed C++ real-time flight simulation software module for telemetry. Automated hardware-in-the-loop (HIL) test suites with Python."
      }
    ],
    projects: [
      {
        projectName: "IEEE Micromouse Autonomous Maze Solver",
        description: "Built high-speed maze-solving mobile robot using ROS2, C++, infrared distance sensors, and custom PID motor controllers.",
        startDate: "2024-01-15",
        endDate: "2024-11-30",
        isOngoing: false,
        projectLinks: ["https://github.com/arivera-ucf/micromouse"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Hardware Committee Chair",
        startDate: "2022-09-01",
        endDate: "2025-05-01",
        isActive: true,
        description: "Led weekly hands-on PCB design and soldering workshops for 60+ engineering members."
      }
    ],
    certifications: [
      {
        certificationName: "CompTIA Security+ CE",
        issuer: "CompTIA",
        issueDate: "2023-06-12",
        expirationDate: "2026-06-12"
      }
    ]
  },
  {
    name: "Samantha Lin",
    email: "slin@knights.ucf.edu",
    major: "Computer Science",
    graduationYear: "2025",
    status: "Seeking Full-time",
    bio: "Senior CS major with extensive experience building high-throughput microservices, distributed systems, and modern full-stack web applications. Incoming software engineer seeking full-time backend or cloud engineering roles.",
    resumePdfUrl: "https://drive.google.com/file/d/samantha-lin-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/samantha-lin-ucf" },
      { platformName: "GitHub", profileUrl: "https://github.com/slin-code" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 3.88,
        gpaScale: 4.0,
        startDate: "2021-08-23",
        endDate: "2025-05-03",
        isCurrent: true,
        description: "Dean's List 7 Consecutive Semesters. Coursework: Operating Systems, Database Systems, Algorithm Analysis, Distributed Systems."
      }
    ],
    skills: [
      "TypeScript", "Go", "Python", "Java", "Next.js", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "GraphQL", "React", "Kafka"
    ],
    workExperience: [
      {
        companyName: "Amazon Web Services (AWS)",
        jobTitle: "Software Development Engineer Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Architected distributed metric ingestion pipeline in Go and AWS DynamoDB processing 15,000 requests/sec with p99 latency under 25ms."
      },
      {
        companyName: "L3Harris Technologies",
        jobTitle: "Software Engineering Intern",
        startDate: "2023-05-15",
        endDate: "2023-08-11",
        isCurrentJob: false,
        description: "Built RESTful microservice API in Java Spring Boot and PostgreSQL for internal satellite telemetry data indexing."
      }
    ],
    projects: [
      {
        projectName: "IEEE UCF Member Catalog & Resume Hub",
        description: "Full-stack Next.js 15 web application with tRPC, Tailwind CSS v4, Drizzle ORM, and Neon PostgreSQL serverless database.",
        startDate: "2024-08-01",
        endDate: "2025-04-15",
        isOngoing: true,
        projectLinks: ["https://github.com/slin-code/member-catalog"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Webmaster / Lead Software Engineer",
        startDate: "2022-08-25",
        endDate: "2025-05-01",
        isActive: true,
        description: "Maintained chapter digital infrastructure, managed member authentication database, and mentored junior developers."
      }
    ],
    certifications: [
      {
        certificationName: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        issueDate: "2023-09-15"
      }
    ]
  },
  {
    name: "Marcus Vance",
    email: "mvance@knights.ucf.edu",
    major: "Electrical Engineering",
    graduationYear: "2026",
    status: "Seeking Internship",
    bio: "Electrical Engineering junior passionate about power electronics, RF circuit design, battery management systems, and analog signal conditioning for aerospace applications.",
    resumePdfUrl: "https://drive.google.com/file/d/marcus-vance-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/marcus-vance-ee" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Electrical Engineering",
        gpa: 3.76,
        gpaScale: 4.0,
        startDate: "2022-08-22",
        endDate: "2026-05-02",
        isCurrent: true,
        description: "Coursework: Linear Circuits II, Microcontrollers, Semiconductor Devices, Power Electronics, RF & Microwave Circuits."
      }
    ],
    skills: [
      "Altium Designer", "LTspice", "MATLAB/Simulink", "C", "Power Electronics", "PCB Layout & Fabrication", "RF Circuit Design", "LabVIEW"
    ],
    workExperience: [
      {
        companyName: "Siemens Energy",
        jobTitle: "Power Systems Engineering Intern",
        startDate: "2024-05-13",
        endDate: "2024-08-23",
        isCurrentJob: false,
        description: "Analyzed 3-phase grid transformer harmonic distortion using MATLAB/Simulink models."
      }
    ],
    projects: [
      {
        projectName: "IEEE Solar Knight Racing ESC",
        description: "High-efficiency motor speed controller PCB designed in Altium for solar racing vehicle telemetry.",
        startDate: "2024-08-25",
        endDate: "2024-12-10",
        isOngoing: false,
        projectLinks: ["https://github.com/mvance-ee/solar-esc"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Power & Energy Chapter Lead",
        startDate: "2023-01-15",
        endDate: "2025-05-01",
        isActive: true,
        description: "Organized technical seminars on power grid stability and renewable energy integration."
      }
    ],
    certifications: []
  },
  {
    name: "Elena Rostova",
    email: "erostova@knights.ucf.edu",
    major: "Computer Science",
    graduationYear: "2025",
    status: "Employed",
    bio: "Senior CS student & Machine Learning Researcher at UCF Center for Research in Computer Vision (CRCV). Specializing in PyTorch, computer vision, vision-language models, and edge AI deployment.",
    resumePdfUrl: "https://drive.google.com/file/d/elena-rostova-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/elena-rostova-ai" },
      { platformName: "GitHub", profileUrl: "https://github.com/erostova-ml" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 3.96,
        gpaScale: 4.0,
        startDate: "2021-08-23",
        endDate: "2025-05-03",
        isCurrent: true,
        description: "Summa Cum Laude candidate. Published author at CVPR 2024 workshop."
      }
    ],
    skills: [
      "PyTorch", "Python", "OpenCV", "TensorFlow", "CUDA", "TensorRT", "C++", "FastAPI", "Docker", "ONNX"
    ],
    workExperience: [
      {
        companyName: "NVIDIA",
        jobTitle: "Deep Learning Software Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Optimized Transformer inference latencies by 2.3x using TensorRT quantization and custom CUDA C++ kernels."
      }
    ],
    projects: [
      {
        projectName: "IEEE Quadcopter Swarm Vision Pipeline",
        description: "Real-time thermal anomaly detection pipeline using PyTorch MobileNet-V3 quantized on Coral Edge TPU.",
        startDate: "2024-01-10",
        endDate: "2024-05-01",
        isOngoing: false,
        projectLinks: ["https://github.com/erostova-ml/quadcopter-vision"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "AI & Machine Learning Lead",
        startDate: "2022-09-01",
        endDate: "2025-05-01",
        isActive: true,
        description: "Hosted 8-week PyTorch & Deep Learning bootcamps for 120+ student participants."
      }
    ],
    certifications: []
  },
  {
    name: "Jordan Taylor",
    email: "jtaylor@knights.ucf.edu",
    major: "Mechanical Engineering",
    graduationYear: "2026",
    status: "Seeking Internship",
    bio: "Mechanical Engineering junior focused on thermal management, finite element analysis (FEA), computational fluid dynamics (CFD), and solar racing chassis design.",
    resumePdfUrl: "https://drive.google.com/file/d/jordan-taylor-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/jordan-taylor-me" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Mechanical Engineering",
        gpa: 3.82,
        gpaScale: 4.0,
        startDate: "2022-08-22",
        endDate: "2026-05-02",
        isCurrent: true,
        description: "Relevant Coursework: Thermodynamics, Heat Transfer, Fluid Mechanics, SolidWorks FEA, Materials Science."
      }
    ],
    skills: [
      "SolidWorks", "ANSYS Workbench", "CAD", "FEA", "CFD", "MATLAB", "3D Printing", "Machining", "CNC Milling", "Python"
    ],
    workExperience: [
      {
        companyName: "NASA Kennedy Space Center",
        jobTitle: "Thermal Systems Engineering Intern",
        startDate: "2024-05-15",
        endDate: "2024-08-15",
        isCurrentJob: false,
        description: "Conducted CFD airflow analysis for launch pad payload umbilical insulation modules using ANSYS Fluent."
      },
      {
        companyName: "SpaceX",
        jobTitle: "Structures Intern",
        startDate: "2023-05-15",
        endDate: "2023-08-15",
        isCurrentJob: false,
        description: "Assisted in stress analysis and composite carbon-fiber layup optimization for payload fairings."
      }
    ],
    projects: [
      {
        projectName: "IEEE Solar Knight Racing ESC",
        description: "Designed ultra-lightweight carbon-fiber aerodynamic shell and solar panel mounting structure.",
        startDate: "2024-01-10",
        endDate: "2024-11-20",
        isOngoing: true,
        projectLinks: ["https://github.com/ieee-ucf/solar-knight-esc"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Solar Racing Lead",
        startDate: "2023-01-10",
        endDate: "2026-05-01",
        isActive: true,
        description: "Directing 15-member multi-disciplinary engineering team building solar vehicle ESC."
      }
    ],
    certifications: []
  },
  {
    name: "David Chen",
    email: "dchen@knights.ucf.edu",
    major: "Computer Engineering",
    graduationYear: "2025",
    status: "Seeking Full-time",
    bio: "IEEE UCF Student Chapter Executive Chair. Senior Computer Engineering student specializing in computer architecture, semiconductor validation, and SoC design.",
    resumePdfUrl: "https://drive.google.com/file/d/david-chen-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/david-chen-ucf" },
      { platformName: "GitHub", profileUrl: "https://github.com/dchen-ece" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Engineering",
        gpa: 3.95,
        gpaScale: 4.0,
        startDate: "2021-08-23",
        endDate: "2025-05-03",
        isCurrent: true,
        description: "Burnett Honors College. Executive Chair of IEEE UCF Chapter."
      }
    ],
    skills: [
      "SystemVerilog", "Verilog", "C++", "Python", "UVM", "ASIC/SoC Design", "Xilinx Vivado", "RISC-V", "Chisel", "Synopsys Design Compiler", "Git"
    ],
    workExperience: [
      {
        companyName: "Texas Instruments",
        jobTitle: "Silicon Design & Validation Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Wrote SystemVerilog UVM testbenches for automotive microcontroller CAN-FD bus controller IP cores."
      },
      {
        companyName: "Intel Corporation",
        jobTitle: "Logic Design Intern",
        startDate: "2023-05-15",
        endDate: "2023-08-11",
        isCurrentJob: false,
        description: "Synthesized 32-bit RISC-V CPU core variant with custom vector instructions on 7nm process technology."
      }
    ],
    projects: [
      {
        projectName: "IEEE Micromouse Autonomous Maze Solver",
        description: "Custom RISC-V microcontroller core for real-time maze solver flood-fill pathfinding algorithm.",
        startDate: "2023-09-01",
        endDate: "2024-05-01",
        isOngoing: false,
        projectLinks: ["https://github.com/dchen-ece/micromouse-riscv"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Executive Chair",
        startDate: "2022-08-25",
        endDate: "2025-05-01",
        isActive: true,
        description: "Presiding over 450+ member student organization, overseeing $40k annual budget, and liaising with IEEE Florida Section."
      }
    ],
    certifications: []
  },
  {
    name: "Brianna Morales",
    email: "bmorales@knights.ucf.edu",
    major: "Computer Science",
    graduationYear: "2025",
    status: "Seeking Full-time",
    bio: "IEEE UCF Vice Chair & Cyber Security specialist. Dual-focus in cloud security architecture, zero-trust network design, and secure software development.",
    resumePdfUrl: "https://drive.google.com/file/d/brianna-morales-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/brianna-morales-sec" },
      { platformName: "GitHub", profileUrl: "https://github.com/bmorales-sec" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 3.89,
        gpaScale: 4.0,
        startDate: "2021-08-23",
        endDate: "2025-05-03",
        isCurrent: true,
        description: "Minor in Secure Computing & Cyber Security."
      }
    ],
    skills: [
      "Python", "C", "Wireshark", "Linux Security", "Network Penetration Testing", "AWS Security", "Kubernetes", "Cryptography", "Bash", "Docker"
    ],
    workExperience: [
      {
        companyName: "Northrop Grumman",
        jobTitle: "Cyber Security Engineering Intern",
        startDate: "2024-05-15",
        endDate: "2024-08-15",
        isCurrentJob: false,
        description: "Performed vulnerability scans and static code analysis on mission avionics firmware repositories."
      }
    ],
    projects: [
      {
        projectName: "IEEE Smart Campus IoT Beacon Network",
        description: "Implemented encrypted AES-256 BLE telemetry beacon network for real-time UCF campus event tracking.",
        startDate: "2024-01-15",
        endDate: "2024-11-30",
        isOngoing: true,
        projectLinks: ["https://github.com/bmorales-sec/smart-campus-iot"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Vice Chair",
        startDate: "2022-09-01",
        endDate: "2025-05-01",
        isActive: true,
        description: "Co-managing committee operations, scheduling industry guest speakers, and leading general body meetings."
      }
    ],
    certifications: [
      {
        certificationName: "CompTIA Security+ CE",
        issuer: "CompTIA",
        issueDate: "2023-04-10"
      }
    ]
  },
  {
    name: "Ethan Wright",
    email: "ewright@knights.ucf.edu",
    major: "Electrical Engineering",
    graduationYear: "2027",
    status: "Seeking Internship",
    bio: "Sophomore EE student focused on PCB schematic layout, surface-mount soldering, power distribution networks, and analog sensor interfacing.",
    resumePdfUrl: "https://drive.google.com/file/d/ethan-wright-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/ethan-wright-ee" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Electrical Engineering",
        gpa: 3.70,
        gpaScale: 4.0,
        startDate: "2023-08-21",
        endDate: "2027-05-01",
        isCurrent: true,
        description: "Coursework: Linear Circuits I, Physics II with Calculus, Differential Equations."
      }
    ],
    skills: [
      "Altium Designer", "KiCAD", "Soldering (SMD 0805/0603)", "C", "Arduino", "LTspice", "Multimeter & Oscilloscope"
    ],
    workExperience: [
      {
        companyName: "Duke Energy",
        jobTitle: "Distribution Engineering Intern",
        startDate: "2024-05-13",
        endDate: "2024-08-09",
        isCurrentJob: false,
        description: "Assisted power grid engineers with feeder reliability analysis and substation schematic reviews."
      }
    ],
    projects: [
      {
        projectName: "IEEE PCB Design & Surface Mount Workshop Series",
        description: "Designed custom 2-layer USB-C rechargeable LED badge PCB in KiCAD for workshop attendees.",
        startDate: "2024-09-01",
        endDate: "2024-11-15",
        isOngoing: false,
        projectLinks: ["https://github.com/ewright-ee/pcb-workshop-badge"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Workshops Lead",
        startDate: "2023-09-01",
        endDate: "2027-05-01",
        isActive: true,
        description: "Organizing bi-weekly soldering and microcontroller hands-on lab sessions for freshmen and sophomores."
      }
    ],
    certifications: []
  },
  {
    name: "Maya Patel",
    email: "mpatel@alumni.ucf.edu",
    major: "Computer Science",
    graduationYear: "2024",
    status: "Employed",
    bio: "UCF CS Alumna ('24) & Full-Stack Software Engineer at Google. Former IEEE UCF Software Director passionate about cloud infrastructure, React, and scalable backend services.",
    resumePdfUrl: "https://drive.google.com/file/d/maya-patel-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/maya-patel-swe" },
      { platformName: "GitHub", profileUrl: "https://github.com/mpatel-swe" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 3.97,
        gpaScale: 4.0,
        startDate: "2020-08-24",
        endDate: "2024-05-04",
        isCurrent: false,
        description: "Summa Cum Laude. Founder of IEEE Software SIG."
      }
    ],
    skills: [
      "Java", "TypeScript", "Python", "Go", "React", "Node.js", "Google Cloud Platform (GCP)", "Kubernetes", "gRPC", "Spanner", "Docker"
    ],
    workExperience: [
      {
        companyName: "Google",
        jobTitle: "Software Engineer",
        startDate: "2024-07-15",
        endDate: "2026-09-28",
        isCurrentJob: true,
        description: "Building cloud billing infrastructure microservices processing multi-million dollar transaction logs with 99.999% availability."
      },
      {
        companyName: "Microsoft",
        jobTitle: "Software Engineering Intern",
        startDate: "2023-05-22",
        endDate: "2023-08-18",
        isCurrentJob: false,
        description: "Developed Azure Cosmos DB telemetry dashboard in React and C# .NET Core."
      }
    ],
    projects: [
      {
        projectName: "IEEE UCF Member Catalog & Resume Hub",
        description: "Architected initial SQL schema and API endpoints for student catalog.",
        startDate: "2023-08-15",
        endDate: "2024-04-30",
        isOngoing: false,
        projectLinks: ["https://github.com/mpatel-swe/ieee-catalog-v1"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Software Director (Alumni)",
        startDate: "2021-08-25",
        endDate: "2024-05-04",
        isActive: false,
        description: "Led software workshops and managed IEEE UCF chapter web platform."
      }
    ],
    certifications: []
  },
  {
    name: "Lucas Rossi",
    email: "lrossi@knights.ucf.edu",
    major: "Aerospace Engineering",
    graduationYear: "2026",
    status: "Seeking Internship",
    bio: "Aerospace Engineering junior specializing in flight dynamics, unmanned aerial systems (UAS), autopilot control systems (PX4/ArduPilot), and aerodynamic modeling.",
    resumePdfUrl: "https://drive.google.com/file/d/lucas-rossi-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/lucas-rossi-aero" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Aerospace Engineering",
        gpa: 3.79,
        gpaScale: 4.0,
        startDate: "2022-08-22",
        endDate: "2026-05-02",
        isCurrent: true,
        description: "Coursework: Aerodynamics I & II, Flight Mechanics, Orbital Mechanics, Control Systems."
      }
    ],
    skills: [
      "MATLAB/Simulink", "C++", "PX4 Autopilot", "ArduPilot", "ROS2", "SolidWorks", "Ansys Fluent", "Python", "MAVLink"
    ],
    workExperience: [
      {
        companyName: "Blue Origin",
        jobTitle: "Avionics & Flight Controls Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Developed Simulink control algorithms for rocket booster thrust vector control actuators."
      },
      {
        companyName: "Boeing",
        jobTitle: "Aerodynamics Intern",
        startDate: "2023-05-15",
        endDate: "2023-08-11",
        isCurrentJob: false,
        description: "Conducted wind tunnel data reduction for commercial aircraft winglet modifications."
      }
    ],
    projects: [
      {
        projectName: "IEEE Quadcopter Swarm",
        description: "Autonomous multi-drone mesh network flight controller utilizing MAVLink protocol and PX4 autopilot.",
        startDate: "2024-01-15",
        endDate: "2024-12-01",
        isOngoing: true,
        projectLinks: ["https://github.com/lrossi-aero/quadcopter-swarm"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Robotics Lead",
        startDate: "2023-01-10",
        endDate: "2026-05-01",
        isActive: true,
        description: "Leading 12 student engineers building quadcopter swarm for SoutheastCon competition."
      }
    ],
    certifications: []
  },
  {
    name: "Chloe Bennett",
    email: "cbennett@knights.ucf.edu",
    major: "Computer Engineering",
    graduationYear: "2027",
    status: "Seeking Internship",
    bio: "Computer Engineering sophomore focused on GPU acceleration, graphics programming, metal APIs, and interactive hardware input devices.",
    resumePdfUrl: "https://drive.google.com/file/d/chloe-bennett-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/chloe-bennett-dev" },
      { platformName: "GitHub", profileUrl: "https://github.com/cbennett-dev" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Engineering",
        gpa: 3.85,
        gpaScale: 4.0,
        startDate: "2023-08-21",
        endDate: "2027-05-01",
        isCurrent: true,
        description: "Coursework: Digital Systems, Physics II, Computer Organization, Discrete Structures."
      }
    ],
    skills: [
      "C++", "C#", "OpenGL", "Vulkan", "GLSL", "Python", "Verilog", "Unity", "Unreal Engine 5", "Git"
    ],
    workExperience: [
      {
        companyName: "Electronic Arts (EA)",
        jobTitle: "Software Engineering Intern (Frostbite Engine)",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Optimized GPU particle system shader pipelines for internal game engine rendering tools."
      }
    ],
    projects: [
      {
        projectName: "IEEE Micromouse Autonomous Maze Solver",
        description: "Implemented 3D OpenGL simulation of maze solver environment with real-time sensor visualization.",
        startDate: "2024-02-01",
        endDate: "2024-06-01",
        isOngoing: false,
        projectLinks: ["https://github.com/cbennett-dev/micromouse-sim"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Gaming & Graphics SIG Lead",
        startDate: "2023-09-01",
        endDate: "2027-05-01",
        isActive: true,
        description: "Hosting shader programming workshops and game hardware dev nights."
      }
    ],
    certifications: []
  },
  {
    name: "Gabriel Silva",
    email: "gsilva@alumni.ucf.edu",
    major: "Electrical Engineering",
    graduationYear: "2024",
    status: "Employed",
    bio: "UCF EE Alumnus ('24) & Hardware Test Engineer at L3Harris Technologies. Specialized in RF circuit layout, microwave amplifiers, and automated spectral analysis.",
    resumePdfUrl: "https://drive.google.com/file/d/gabriel-silva-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/gabriel-silva-rf" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Electrical Engineering",
        gpa: 3.81,
        gpaScale: 4.0,
        startDate: "2020-08-24",
        endDate: "2024-05-04",
        isCurrent: false,
        description: "Magna Cum Laude. RF & Microwave Track."
      }
    ],
    skills: [
      "RF Design", "Keysight ADS", "Spectrum Analyzers", "Network Analyzers (VNA)", "Altium", "Python", "LabVIEW", "MATLAB"
    ],
    workExperience: [
      {
        companyName: "L3Harris Technologies",
        jobTitle: "RF Hardware Test Engineer",
        startDate: "2024-06-10",
        endDate: "2026-09-28",
        isCurrentJob: true,
        description: "Testing S-band and X-band satellite communication transceivers using automated Python-GPIB test routines."
      }
    ],
    projects: [
      {
        projectName: "400V FSAE Accumulator Battery Management System",
        description: "RF telemetry transmitter board for race car battery data streaming.",
        startDate: "2023-09-01",
        endDate: "2024-04-15",
        isOngoing: false,
        projectLinks: ["https://github.com/gsilva-rf/bms-telemetry"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "RF & Wireless Lead (Alumni)",
        startDate: "2021-09-01",
        endDate: "2024-05-04",
        isActive: false,
        description: "Led antenna design workshops for undergraduate members."
      }
    ],
    certifications: []
  },
  {
    name: "Sophia Martinez",
    email: "smartinez@knights.ucf.edu",
    major: "Industrial Engineering",
    graduationYear: "2026",
    status: "Seeking Internship",
    bio: "IEEE UCF Treasurer & Industrial Engineering junior. Focused on supply chain optimization, operations research, project management, and data analytics.",
    resumePdfUrl: "https://drive.google.com/file/d/sophia-martinez-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/sophia-martinez-ie" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Industrial Engineering",
        gpa: 3.88,
        gpaScale: 4.0,
        startDate: "2022-08-22",
        endDate: "2026-05-02",
        isCurrent: true,
        description: "Coursework: Operations Research, Supply Chain Engineering, Engineering Economics, Quality Engineering."
      }
    ],
    skills: [
      "SQL", "Python", "Tableau", "Power BI", "Arena Simulation", "Simio", "Lean Six Sigma", "Excel (VBA)", "Project Management"
    ],
    workExperience: [
      {
        companyName: "Walt Disney World Imagineering",
        jobTitle: "Industrial Engineering Professional Intern",
        startDate: "2024-05-15",
        endDate: "2024-12-15",
        isCurrentJob: false,
        description: "Modeled theme park attraction queue throughput using Arena Simulation software, reducing average guest wait times by 12%."
      },
      {
        companyName: "Lockheed Martin",
        jobTitle: "Operations Engineering Intern",
        startDate: "2023-05-15",
        endDate: "2023-08-11",
        isCurrentJob: false,
        description: "Optimized missile assembly line component inventory flow using Lean Six Sigma methodologies."
      }
    ],
    projects: [
      {
        projectName: "IEEE Smart Campus IoT Beacon Network",
        description: "Conducted spatial foot-traffic analytics using SQL and Tableau from IoT beacon sensor logs.",
        startDate: "2024-02-01",
        endDate: "2024-11-15",
        isOngoing: true,
        projectLinks: ["https://github.com/smartinez-ie/iot-analytics"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Treasurer",
        startDate: "2022-09-01",
        endDate: "2026-05-01",
        isActive: true,
        description: "Managing $40,000 annual budget, processing student travel reimbursements, and coordinating corporate sponsorship funding."
      }
    ],
    certifications: [
      {
        certificationName: "Lean Six Sigma Green Belt",
        issuer: "IISE",
        issueDate: "2023-11-10"
      }
    ]
  },
  {
    name: "Noah Kim",
    email: "nkim@knights.ucf.edu",
    major: "Computer Science",
    graduationYear: "2028",
    status: "Seeking Internship",
    bio: "Freshman CS major passionate about competitive programming, data structures, algorithm optimization, and open-source software contribution.",
    resumePdfUrl: "https://drive.google.com/file/d/noah-kim-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/noah-kim-cs" },
      { platformName: "GitHub", profileUrl: "https://github.com/noahkim-code" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 4.0,
        gpaScale: 4.0,
        startDate: "2024-08-19",
        endDate: "2028-05-05",
        isCurrent: true,
        description: "National Merit Scholar. Pegasus Gold Scholarship recipient."
      }
    ],
    skills: [
      "Python", "C++", "Java", "Data Structures", "Algorithms", "Git", "Linux", "HTML/CSS", "JavaScript"
    ],
    workExperience: [],
    projects: [
      {
        projectName: "IEEE PCB Design & Surface Mount Workshop Series",
        description: "Built automated registration bot in Python for workshop signups.",
        startDate: "2024-09-10",
        endDate: "2024-10-15",
        isOngoing: false,
        projectLinks: ["https://github.com/noahkim-code/reg-bot"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Freshman Representative",
        startDate: "2024-08-25",
        endDate: "2028-05-01",
        isActive: true,
        description: "Assisting committee leads with general body meeting setups and freshman orientation outreach."
      }
    ],
    certifications: []
  },
  {
    name: "Hannah Al-Mansoor",
    email: "halmansoor@knights.ucf.edu",
    major: "Computer Engineering",
    graduationYear: "2025",
    status: "Seeking Full-time",
    bio: "Senior Computer Engineering major & IEEE SoutheastCon Competition Chair. Expert in autonomous vehicle controls, CAN bus, ROS2, and embedded hardware integration.",
    resumePdfUrl: "https://drive.google.com/file/d/hannah-al-mansoor-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/hannah-al-mansoor" },
      { platformName: "GitHub", profileUrl: "https://github.com/halmansoor" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Engineering",
        gpa: 3.91,
        gpaScale: 4.0,
        startDate: "2021-08-23",
        endDate: "2025-05-03",
        isCurrent: true,
        description: "Burnett Honors College. SoutheastCon Hardware Lead."
      }
    ],
    skills: [
      "C++", "Python", "ROS2", "Linux", "CAN Bus", "STM32", "Altium", "Eagle", "Git", "PID Control", "Embedded Systems"
    ],
    workExperience: [
      {
        companyName: "Apple",
        jobTitle: "Hardware Systems Engineering Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Developed automated test script fixtures for Mac hardware battery management interconnects."
      },
      {
        companyName: "Tesla",
        jobTitle: "Autopilot Firmware Intern",
        startDate: "2023-05-15",
        endDate: "2023-08-11",
        isCurrentJob: false,
        description: "Optimized CAN bus message parsing latency for vehicle sensor suites in C++."
      }
    ],
    projects: [
      {
        projectName: "IEEE Micromouse Autonomous Maze Solver",
        description: "Designed custom 4-layer PCB mainboard incorporating STM32 microcontroller and dual encoder drivers.",
        startDate: "2023-09-01",
        endDate: "2024-04-30",
        isOngoing: false,
        projectLinks: ["https://github.com/halmansoor/micromouse-mainboard"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "SoutheastCon Chair",
        startDate: "2022-09-01",
        endDate: "2025-05-01",
        isActive: true,
        description: "Directing 25 student engineers competing in IEEE Region 3 annual hardware competition."
      }
    ],
    certifications: []
  },
  {
    name: "Caleb Jackson",
    email: "cjackson@knights.ucf.edu",
    major: "Physics",
    graduationYear: "2026",
    status: "Seeking Internship",
    bio: "Physics & EE double major passionate about quantum computing, photonics, optical sensor design, and semiconductor physics.",
    resumePdfUrl: "https://drive.google.com/file/d/caleb-jackson-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/caleb-jackson-physics" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Physics",
        gpa: 3.86,
        gpaScale: 4.0,
        startDate: "2022-08-22",
        endDate: "2026-05-02",
        isCurrent: true,
        description: "Double Major in Electrical Engineering. Undergraduate Research Fellow at CREOL (College of Optics and Photonics)."
      }
    ],
    skills: [
      "Python", "Qiskit", "MATLAB", "COMSOL Multiphysics", "Optics", "Laser Physics", "C++", "LabVIEW", "LaTeX"
    ],
    workExperience: [
      {
        companyName: "National High Magnetic Field Lab",
        jobTitle: "Quantum Physics Research Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-09",
        isCurrentJob: false,
        description: "Measured low-temperature magnetoresistance in topological insulator thin films using cryogenic probes."
      }
    ],
    projects: [
      {
        projectName: "IEEE Quadcopter Swarm",
        description: "Developed optical LiDAR rangefinding sensor interface module for airborne collision avoidance.",
        startDate: "2024-02-01",
        endDate: "2024-11-15",
        isOngoing: true,
        projectLinks: ["https://github.com/cjackson-physics/lidar-optics"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Quantum & Optics SIG Lead",
        startDate: "2023-01-15",
        endDate: "2026-05-01",
        isActive: true,
        description: "Leading quantum computing Qiskit workshops in collaboration with CREOL."
      }
    ],
    certifications: []
  },
  {
    name: "Isabella Rossi",
    email: "irossi@alumni.ucf.edu",
    major: "Computer Science",
    graduationYear: "2024",
    status: "Employed",
    bio: "UCF CS Alumna ('24) & Cloud Systems Engineer at Microsoft. Former IEEE UCF Corporate Liaison specializing in Azure infrastructure and distributed systems.",
    resumePdfUrl: "https://drive.google.com/file/d/isabella-rossi-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/isabella-rossi-cloud" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 3.93,
        gpaScale: 4.0,
        startDate: "2020-08-24",
        endDate: "2024-05-04",
        isCurrent: false,
        description: "Summa Cum Laude."
      }
    ],
    skills: [
      "C#", ".NET Core", "Azure", "Terraform", "Docker", "Kubernetes", "TypeScript", "SQL", "CI/CD"
    ],
    workExperience: [
      {
        companyName: "Microsoft",
        jobTitle: "Cloud Systems Engineer",
        startDate: "2024-07-08",
        endDate: "2026-09-28",
        isCurrentJob: true,
        description: "Managing Azure Kubernetes Service (AKS) deployment automation pipelines."
      },
      {
        companyName: "Amazon",
        jobTitle: "AWS Cloud Intern",
        startDate: "2023-05-15",
        endDate: "2023-08-11",
        isCurrentJob: false,
        description: "Implemented EC2 automated snapshot retention policy lambda functions in Python."
      }
    ],
    projects: [
      {
        projectName: "IEEE UCF Member Catalog & Resume Hub",
        description: "Built initial authentication and role-based access control (RBAC) middleware.",
        startDate: "2023-10-01",
        endDate: "2024-04-15",
        isOngoing: false,
        projectLinks: ["https://github.com/irossi-cloud/rbac-next"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Corporate Liaison (Alumni)",
        startDate: "2021-09-01",
        endDate: "2024-05-04",
        isActive: false,
        description: "Secured over $25,000 in corporate sponsorship funding for student chapter."
      }
    ],
    certifications: []
  },
  {
    name: "Tyler Brooks",
    email: "tbrooks@knights.ucf.edu",
    major: "Electrical Engineering",
    graduationYear: "2025",
    status: "Seeking Full-time",
    bio: "IEEE UCF Secretary & Senior Electrical Engineering major. Focused on embedded firmware, digital signal processing (DSP), audio electronics, and microcontrollers.",
    resumePdfUrl: "https://drive.google.com/file/d/tyler-brooks-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/tyler-brooks-ee" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Electrical Engineering",
        gpa: 3.78,
        gpaScale: 4.0,
        startDate: "2021-08-23",
        endDate: "2025-05-03",
        isCurrent: true,
        description: "Coursework: Digital Signal Processing, Embedded Systems, Microprocessors, Signals & Systems."
      }
    ],
    skills: [
      "C", "C++", "DSP", "MATLAB", "ARM Cortex-M", "STM32", "Altium", "I2S/I2C/SPI", "Audio DSP", "Git"
    ],
    workExperience: [
      {
        companyName: "Collins Aerospace",
        jobTitle: "Avionics Hardware Engineering Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Designed digital audio filtering module for cockpit communication transceivers."
      },
      {
        companyName: "Lockheed Martin",
        jobTitle: "Systems Engineering Co-Op",
        startDate: "2023-08-20",
        endDate: "2023-12-15",
        isCurrentJob: false,
        description: "Modeled RF signal degradation in radar receiver hardware modules."
      }
    ],
    projects: [
      {
        projectName: "IEEE Solar Knight Racing ESC",
        description: "Implemented digital filter firmware for battery voltage telemetry conditioning.",
        startDate: "2024-01-15",
        endDate: "2024-11-20",
        isOngoing: true,
        projectLinks: ["https://github.com/tbrooks-ee/solar-dsp"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Secretary",
        startDate: "2022-09-01",
        endDate: "2025-05-01",
        isActive: true,
        description: "Managing executive meeting documentation, member communications newsletter, and room reservations."
      }
    ],
    certifications: []
  },
  {
    name: "Victoria Zhang",
    email: "vzhang@knights.ucf.edu",
    major: "Computer Science",
    graduationYear: "2026",
    status: "Seeking Internship",
    bio: "Data Science & CS junior specializing in big data analytics, machine learning pipelines, natural language processing (NLP), and cloud data warehouses.",
    resumePdfUrl: "https://drive.google.com/file/d/victoria-zhang-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/victoria-zhang-ds" },
      { platformName: "GitHub", profileUrl: "https://github.com/vzhang-ds" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 3.94,
        gpaScale: 4.0,
        startDate: "2022-08-22",
        endDate: "2026-05-02",
        isCurrent: true,
        description: "Data Science Track. President of UCF Data Science Club."
      }
    ],
    skills: [
      "Python", "SQL", "PyTorch", "Spark", "Pandas", "Scikit-Learn", "Snowflake", "Databricks", "Tableau", "AWS S3/Athena", "Git"
    ],
    workExperience: [
      {
        companyName: "Meta",
        jobTitle: "Data Engineering Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Built PySpark data pipelines aggregating over 500M daily engagement events into internal data warehouses."
      }
    ],
    projects: [
      {
        projectName: "IEEE Quadcopter Swarm Vision Pipeline",
        description: "Trained object classification pipeline on 50k annotated aerial images.",
        startDate: "2024-02-01",
        endDate: "2024-11-01",
        isOngoing: true,
        projectLinks: ["https://github.com/vzhang-ds/aerial-dataset-ml"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Data Analytics Lead",
        startDate: "2023-01-15",
        endDate: "2026-05-01",
        isActive: true,
        description: "Analyzing member engagement trends and workshop attendance data to optimize event scheduling."
      }
    ],
    certifications: []
  },
  {
    name: "Xavier Torres",
    email: "xtorres@knights.ucf.edu",
    major: "Computer Engineering",
    graduationYear: "2025",
    status: "Seeking Full-time",
    bio: "Senior Computer Engineering student passionate about low-level kernel development, device drivers, PCI Express, and hardware security.",
    resumePdfUrl: "https://drive.google.com/file/d/xavier-torres-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/xavier-torres-ce" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Engineering",
        gpa: 3.84,
        gpaScale: 4.0,
        startDate: "2021-08-23",
        endDate: "2025-05-03",
        isCurrent: true,
        description: "Coursework: Operating System Design, Linux Kernel Internals, Computer Architecture, Hardware Security."
      }
    ],
    skills: [
      "C", "C++", "Rust", "Linux Kernel", "Assembly (x86_64/ARM)", "PCIe", "GDB", "QEMU", "Git", "Verilog"
    ],
    workExperience: [
      {
        companyName: "AMD",
        jobTitle: "Linux Kernel Engineering Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Contributed C patches to open-source AMDGPU DRM kernel driver for power state management."
      },
      {
        companyName: "Qualcomm",
        jobTitle: "Snapdragon Firmware Intern",
        startDate: "2023-05-15",
        endDate: "2023-08-11",
        isCurrentJob: false,
        description: "Wrote bare-metal C driver for I2C bus controller on Snapdragon automotive platform."
      }
    ],
    projects: [
      {
        projectName: "IEEE Micromouse Autonomous Maze Solver",
        description: "Wrote custom RTOS kernel for ARM Cortex-M4 microcontroller with deterministic thread scheduling.",
        startDate: "2023-09-01",
        endDate: "2024-04-30",
        isOngoing: false,
        projectLinks: ["https://github.com/xtorres-ce/tiny-rtos"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Embedded Systems Lead",
        startDate: "2022-09-01",
        endDate: "2025-05-01",
        isActive: true,
        description: "Teaching bare-metal C firmware and kernel debugging lab sessions."
      }
    ],
    certifications: []
  },
  {
    name: "Zoe Jenkins",
    email: "zjenkins@alumni.ucf.edu",
    major: "Mechanical Engineering",
    graduationYear: "2024",
    status: "Employed",
    bio: "UCF ME Alumna ('24) & Propulsion Structures Engineer at SpaceX. Former IEEE Solar Racing Mechanical Lead.",
    resumePdfUrl: "https://drive.google.com/file/d/zoe-jenkins-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/zoe-jenkins-propulsion" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Mechanical Engineering",
        gpa: 3.90,
        gpaScale: 4.0,
        startDate: "2020-08-24",
        endDate: "2024-05-04",
        isCurrent: false,
        description: "Magna Cum Laude. Aerospace Track."
      }
    ],
    skills: [
      "SolidWorks", "Siemens NX", "ANSYS FEA", "Composite Materials", "Fluid Dynamics", "GD&T", "Python"
    ],
    workExperience: [
      {
        companyName: "SpaceX",
        jobTitle: "Propulsion Structures Engineer",
        startDate: "2024-06-17",
        endDate: "2026-09-28",
        isCurrentJob: true,
        description: "Designing cryogenic propellant feed line mounting brackets for Starship raptor engines."
      }
    ],
    projects: [
      {
        projectName: "IEEE Solar Knight Racing ESC",
        description: "Designed structural roll cage and carbon composite suspension mounts.",
        startDate: "2023-08-15",
        endDate: "2024-04-30",
        isOngoing: false,
        projectLinks: ["https://github.com/zjenkins-propulsion/solar-chassis"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Solar Racing Mechanical Lead (Alumni)",
        startDate: "2021-09-01",
        endDate: "2024-05-04",
        isActive: false,
        description: "Managed mechanical design for 2024 solar racing vehicle."
      }
    ],
    certifications: []
  },
  {
    name: "Liam O'Connor",
    email: "loconnor@knights.ucf.edu",
    major: "Information Technology",
    graduationYear: "2027",
    status: "Seeking Internship",
    bio: "IT sophomore specializing in cloud network engineering, Linux sysadmin, infrastructure as code (Terraform), and enterprise IT support.",
    resumePdfUrl: "https://drive.google.com/file/d/liam-oconnor-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/liam-oconnor-it" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Information Technology",
        gpa: 3.75,
        gpaScale: 4.0,
        startDate: "2023-08-21",
        endDate: "2027-05-01",
        isCurrent: true,
        description: "Coursework: Network Concepts, Linux Administration, Database Concepts, IT Infrastructure."
      }
    ],
    skills: [
      "Linux SysAdmin", "Bash", "Python", "Cisco CCNA", "Terraform", "AWS", "Docker", "Wireshark", "Active Directory"
    ],
    workExperience: [
      {
        companyName: "UCF Information Technology",
        jobTitle: "Student Systems Administrator",
        startDate: "2023-10-01",
        endDate: "2026-09-28",
        isCurrentJob: true,
        description: "Managing Active Directory accounts, VMware virtual machines, and network troubleshooting for campus labs."
      }
    ],
    projects: [
      {
        projectName: "IEEE Smart Campus IoT Beacon Network",
        description: "Configured Wi-Fi gateway routers and MQTT broker server on Raspberry Pi cluster.",
        startDate: "2024-03-01",
        endDate: "2024-11-01",
        isOngoing: true,
        projectLinks: ["https://github.com/loconnor-it/mqtt-gateway"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Infrastructure Lead",
        startDate: "2023-09-01",
        endDate: "2027-05-01",
        isActive: true,
        description: "Managing IEEE Innovation Lab network routers, server rack, and printer infrastructure."
      }
    ],
    certifications: [
      {
        certificationName: "Cisco Certified Network Associate (CCNA)",
        issuer: "Cisco",
        issueDate: "2024-01-15"
      }
    ]
  },
  {
    name: "Amara Okafor",
    email: "aokafor@knights.ucf.edu",
    major: "Computer Science",
    graduationYear: "2026",
    status: "Seeking Internship",
    bio: "IEEE UCF Corporate Liaison & CS junior. Passionate about software engineering, corporate relations, technical event coordination, and web development.",
    resumePdfUrl: "https://drive.google.com/file/d/amara-okafor-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/amara-okafor-cs" },
      { platformName: "GitHub", profileUrl: "https://github.com/aokafor-dev" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Computer Science",
        gpa: 3.87,
        gpaScale: 4.0,
        startDate: "2022-08-22",
        endDate: "2026-05-02",
        isCurrent: true,
        description: "Coursework: Data Structures, Computer Organization, Web Development, Object-Oriented Software Design."
      }
    ],
    skills: [
      "JavaScript", "TypeScript", "React", "Python", "Node.js", "Express", "HTML/CSS", "Git", "SQL", "Figma"
    ],
    workExperience: [
      {
        companyName: "Cisco Systems",
        jobTitle: "Software Engineering Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Developed React web dashboard component for Cisco Webex admin user management analytics."
      }
    ],
    projects: [
      {
        projectName: "IEEE PCB Design & Surface Mount Workshop Series",
        description: "Built interactive web portal for scheduling workshop equipment and tracking attendance.",
        startDate: "2024-01-15",
        endDate: "2024-05-01",
        isOngoing: false,
        projectLinks: ["https://github.com/aokafor-dev/workshop-portal"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Corporate Liaison",
        startDate: "2023-01-10",
        endDate: "2026-05-01",
        isActive: true,
        description: "Managing relations with 15+ corporate sponsors, organizing tech talks, and coordinating industry career showcases."
      }
    ],
    certifications: []
  },
  {
    name: "Benjamin Foster",
    email: "bfoster@alumni.ucf.edu",
    major: "Electrical Engineering",
    graduationYear: "2024",
    status: "Employed",
    bio: "UCF EE Alumnus ('24) & Senior RF Test Engineer at Lockheed Martin. Former IEEE UCF Vice Chair specialized in radar signal processing and microwave systems.",
    resumePdfUrl: "https://drive.google.com/file/d/benjamin-foster-resume/view",
    socialLinks: [
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/benjamin-foster-rf" }
    ],
    education: [
      {
        schoolName: "University of Central Florida",
        degreeType: "Bachelor of Science",
        major: "Electrical Engineering",
        gpa: 3.94,
        gpaScale: 4.0,
        startDate: "2020-08-24",
        endDate: "2024-05-04",
        isCurrent: false,
        description: "Summa Cum Laude. Senior Design Outstanding Project Award winner."
      }
    ],
    skills: [
      "RF Test Engineering", "Keysight Spectrum Analyzers", "Python", "MATLAB", "Radar Signal Processing", "C++", "LabVIEW"
    ],
    workExperience: [
      {
        companyName: "Lockheed Martin",
        jobTitle: "Senior RF Test Engineer",
        startDate: "2024-06-03",
        endDate: "2026-09-28",
        isCurrentJob: true,
        description: "Testing radar receiver front-end modules in anechoic chambers."
      }
    ],
    projects: [
      {
        projectName: "IEEE Micromouse Autonomous Maze Solver",
        description: "Designed high-speed IR proximity sensor array sub-board.",
        startDate: "2023-09-01",
        endDate: "2024-04-30",
        isOngoing: false,
        projectLinks: ["https://github.com/bfoster-rf/ir-sensor-board"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Vice Chair (Alumni)",
        startDate: "2021-09-01",
        endDate: "2024-05-04",
        isActive: false,
        description: "Co-managed student chapter logistics and mentored junior hardware teams."
      }
    ],
    certifications: [
      {
        certificationName: "FE Electrical and Computer Exam",
        issuer: "NCEES",
        issueDate: "2024-04-10"
      }
    ]
  }
];

const SEED_IEEE_PROJECTS = [
  {
    title: "IEEE Micromouse Autonomous Maze Solver",
    slug: "ieee-micromouse-autonomous-maze-solver",
    tagline: "High-speed autonomous robotics solving 16x16 maze grids using custom flood-fill algorithms and sub-millimeter motor control.",
    category: "Robotics",
    status: "Active",
    description: "The IEEE Micromouse is an autonomous, battery-powered robotics competition platform. The robot must navigate and map an unknown 16x16 maze, compute the optimal shortest path using flood-fill and A* graph traversal, and execute high-speed speed runs with active yaw stabilization and PID motor velocity control.",
    repositoryUrl: "https://github.com/ieee-ucf/micromouse-maze-solver",
    demoUrl: "https://ieee.ucf.edu/projects/micromouse",
    tools: [
      { name: "STM32F4 Cortex-M4", category: "Embedded & Firmware" },
      { name: "FreeRTOS", category: "Embedded & Firmware" },
      { name: "C++ / C", category: "Software & AI" },
      { name: "KiCAD 8.0", category: "Hardware & PCB" },
      { name: "VL53L1X Time-of-Flight Sensors", category: "Hardware & PCB" },
      { name: "SolidWorks CAD", category: "CAD & Fabrication" },
      { name: "Rigol Oscilloscope & Logic Analyzer", category: "Lab & Test Equipment" },
      { name: "Bambu Lab X1 Carbon 3D Printer", category: "CAD & Fabrication" },
    ],
    timeline: [
      {
        date: "Oct 2024",
        title: "Hardware Architecture & Custom PCB Revision 1",
        description: "Schematic capture and 4-layer PCB layout completed for power distribution, H-bridges, and motor encoders.",
        status: "completed",
      },
      {
        date: "Dec 2024",
        title: "Chassis Fabrication & Sensor Integration",
        description: "Assembled lightweight carbon-fiber chassis with custom magnetic wheel encoders and front ToF sensor array.",
        status: "completed",
      },
      {
        date: "Feb 2025",
        title: "Flood-Fill Algorithm & Maze Mapping Simulation",
        description: "Implemented real-time grid exploration state machine and dynamic path recalculation routines.",
        status: "in_progress",
      },
      {
        date: "Apr 2025",
        title: "SoutheastCon 2025 Competition Run",
        description: "Deploy finalized robot at IEEE SoutheastCon regional competition in Charlotte, NC.",
        status: "upcoming",
      },
    ],
    skillsTaught: [
      "Custom 4-Layer PCB Design in KiCAD",
      "Bare-metal C++ on ARM Cortex-M Microcontrollers",
      "Closed-loop PID Velocity & Angular Gyro Control",
      "Flood-fill & Dijkstra Graph Search Algorithms",
      "Surface Mount SMD Soldering (0603 & QFN Packages)",
      "High-speed Hardware Debugging with Logic Analyzers",
    ],
    sponsorshipInfo: {
      fundingGoal: 2500,
      currentFunding: 1800,
      needsDescription: "Funding directly covers custom JLCPCB multi-layer prototype fabrication, high-torque Faulhaber coreless DC motors, and team travel to the IEEE SoutheastCon robotics arena.",
      budgetBreakdown: [
        { item: "Faulhaber Coreless Micro-Motors (x4)", cost: 680 },
        { item: "Custom 4-Layer PCB Prototyping & Stencils", cost: 350 },
        { item: "STMicroelectronics Dev Boards & ST-Link V3", cost: 220 },
        { item: "High-Discharge LiPo Batteries & Chargers", cost: 180 },
        { item: "SoutheastCon Registration & Maze Travel Logistics", cost: 1070 },
      ],
      tiers: [
        {
          name: "Component Sponsor",
          amount: 250,
          description: "Fund our sensor arrays and prototype PCB fabrication batches.",
          perks: [
            "Company logo on project GitHub repository and open-source documentation",
            "Special mention in IEEE UCF general body meetings",
          ],
        },
        {
          name: "Subsystem Sponsor",
          amount: 750,
          description: "Sponsor our motor drivetrain, chassis carbon composites, and telemetry systems.",
          perks: [
            "Medium logo placement on competition poster and team shirts",
            "Direct access to team candidate resumes and portfolio walkthroughs",
            "Invitation to judge internal design reviews",
          ],
        },
        {
          name: "Title Robotics Sponsor",
          amount: 1500,
          description: "Full title partner powering the IEEE SoutheastCon championship run.",
          perks: [
            "Prominent physical logo placement on the robot chassis and lab test banner",
            "Exclusive 1-hour private recruiting/tech talk with IEEE UCF members",
            "VIP invitation to competition demo and final showcase dinner",
          ],
        },
      ],
    },
  },
  {
    title: "IEEE Solar Knight Racing ESC",
    slug: "ieee-solar-knight-racing-esc",
    tagline: "400V high-efficiency silicon-carbide (SiC) motor inverter engineered for maximum efficiency solar endurance racing.",
    category: "Power",
    status: "Active",
    description: "The Solar Knight Electronic Speed Controller (ESC) is a custom three-phase inverter capable of switching up to 400V DC bus voltages at 100A peak current with >98.5% electrical efficiency. Designed in collaboration with UCF Solar Car, it uses Silicon Carbide (SiC) MOSFETs, isolated gate drivers, and CAN bus telemetry.",
    repositoryUrl: "https://github.com/ieee-ucf/solar-knight-esc",
    demoUrl: "https://ieee.ucf.edu/projects/solar-esc",
    tools: [
      { name: "Altium Designer 24", category: "Hardware & PCB" },
      { name: "Wolfspeed SiC MOSFETs", category: "Hardware & PCB" },
      { name: "TI C2000 Delfino DSP", category: "Embedded & Firmware" },
      { name: "Field Oriented Control (FOC)", category: "Software & AI" },
      { name: "Keysight High-Voltage Differential Probes", category: "Lab & Test Equipment" },
      { name: "CANalyzer / CAN Bus", category: "Embedded & Firmware" },
      { name: "Thermal FEA Simulation", category: "CAD & Fabrication" },
    ],
    timeline: [
      {
        date: "Nov 2024",
        title: "Power Stage Schematic & Thermal Modeling",
        description: "Simulated switching losses and thermal dissipation using double-sided aluminum heatsinks.",
        status: "completed",
      },
      {
        date: "Jan 2025",
        title: "Gate Driver Isolation & Desaturation Protection",
        description: "Built galvanic isolation circuitry with 5kV RMS dielectric protection and under-1us desat fault shutdown.",
        status: "completed",
      },
      {
        date: "Mar 2025",
        title: "Dynamometer Full-Load Motor Bench Testing",
        description: "Bench testing under 20kW simulated road load to validate Field-Oriented Control (FOC) torque ripples.",
        status: "in_progress",
      },
      {
        date: "May 2025",
        title: "Vehicle Integration & Road Endurance Trials",
        description: "Mounting the inverter in the Solar Knight vehicle chassis for 500-mile endurance track trials.",
        status: "upcoming",
      },
    ],
    skillsTaught: [
      "High-Voltage Power Electronics Safety (Up to 400V DC)",
      "Silicon Carbide (SiC) Wide Bandgap Gate Driver Layout",
      "Field-Oriented Control (FOC) Vector Motor Control Theory",
      "CAN 2.0B Protocol Telemetry & Fault Logging",
      "High-frequency Switching Noise Isolation & EMC Filtering",
      "Thermal Resistance Calculations & Heatsink Sizing",
    ],
    sponsorshipInfo: {
      fundingGoal: 4200,
      currentFunding: 3100,
      needsDescription: "High-voltage Silicon Carbide transistors, heavy copper 4oz PCB manufacturing, and precision high-current test instrumentation.",
      budgetBreakdown: [
        { item: "Wolfspeed 1200V SiC Power Modules (x6)", cost: 1450 },
        { item: "Heavy Copper 4oz PCB Fabrication & Assembly", cost: 950 },
        { item: "LEM High-Bandwidth Current Transducers", cost: 500 },
        { item: "Custom Aluminum CNC Milled Cold-Plate Heatsink", cost: 650 },
        { item: "Safety Contactor Relays & DC Disconnect Switches", cost: 650 },
      ],
      tiers: [
        {
          name: "Power Supporter",
          amount: 500,
          description: "Fund our discrete MOSFETs and gate driver passives.",
          perks: [
            "Logo on project technical whitepaper and web page",
            "Acknowledgment in Formula Sun Grand Prix engineering brief",
          ],
        },
        {
          name: "High-Voltage Partner",
          amount: 1200,
          description: "Cover our heavy copper printed circuit board fabrication runs.",
          perks: [
            "Company logo printed in silkscreen on the outer enclosure of the inverter",
            "Resume book of all electrical and power engineering student leads",
          ],
        },
        {
          name: "Championship Inverter Sponsor",
          amount: 2500,
          description: "Premier power electronics patron powering our solar vehicle racing team.",
          perks: [
            "Large company logo on vehicle exterior side pod alongside IEEE crest",
            "Exclusive on-campus demo day and private student recruiting event",
            "Featured video case study shared across UCF Engineering channels",
          ],
        },
      ],
    },
  },
  {
    title: "IEEE Quadcopter Swarm",
    slug: "ieee-quadcopter-swarm",
    tagline: "Decentralized mesh-networking micro-UAVs coordinating autonomous formation flight and distributed SLAM mapping.",
    category: "Autonomous Systems",
    status: "Active",
    description: "The IEEE Quadcopter Swarm project develops low-cost autonomous micro aerial vehicles that communicate peer-to-peer over an ad-hoc 802.11s mesh network. The drones perform collaborative spatial exploration, vision-based obstacle avoidance using Google Coral Edge TPUs, and decentralized target tracking without a centralized ground station.",
    repositoryUrl: "https://github.com/ieee-ucf/quadcopter-swarm",
    tools: [
      { name: "PX4 Autopilot & MAVLink", category: "Embedded & Firmware" },
      { name: "ROS 2 Humble", category: "Software & AI" },
      { name: "Google Coral Edge TPU", category: "Software & AI" },
      { name: "Raspberry Pi CM4", category: "Embedded & Firmware" },
      { name: "OpenCV & TensorRT", category: "Software & AI" },
      { name: "Carbon Fiber Drone Frames", category: "CAD & Fabrication" },
      { name: "Wi-Fi 6 Mesh Network Transceivers", category: "Hardware & PCB" },
    ],
    timeline: [
      {
        date: "Sep 2024",
        title: "Single UAV Flight Controller Benchmarking",
        description: "Tuned PID gains for hover stability and attitude hold using PX4 telemetry logs.",
        status: "completed",
      },
      {
        date: "Dec 2024",
        title: "Edge TPU Onboard Vision Pipeline",
        description: "Optimized MobileNet SSD object detection running at 45 FPS on edge TPU hardware.",
        status: "completed",
      },
      {
        date: "Feb 2025",
        title: "Decentralized Formation Flying Algorithms",
        description: "Simulating consensus-based rendezvous and collision avoidance in Gazebo simulation.",
        status: "in_progress",
      },
      {
        date: "May 2025",
        title: "Physical Outdoor 4-Drone Swarm Flight",
        description: "Conduct outdoor flight demonstrations coordinating simultaneous waypoint exploration.",
        status: "upcoming",
      },
    ],
    skillsTaught: [
      "PX4 Flight Controller Firmware Customization",
      "ROS 2 Distributed Node Architecture & Pub/Sub Topics",
      "Computer Vision Optimization on Edge AI Hardware",
      "Ad-hoc Mesh Networking & Packet Synchronization",
      "Brushless Motor Electronic Speed Control & Dynamics",
      "Outdoor Drone Flight Safety Procedures & FAA Part 107",
    ],
    sponsorshipInfo: {
      fundingGoal: 3800,
      currentFunding: 2200,
      needsDescription: "Funds purchase identical flight airframes, Edge TPU compute boards, optical flow sensors, and replacement carbon-fiber propellers for member flight test sessions.",
      budgetBreakdown: [
        { item: "4x Holybro Micro Drone Airframes & Motors", cost: 1400 },
        { item: "4x Raspberry Pi CM4 + Carrier Boards", cost: 600 },
        { item: "4x Google Coral Edge TPU USB Accelerators", cost: 380 },
        { item: "High-capacity LiPo Flight Packs & Safety Bags", cost: 420 },
        { item: "Outdoor Safety Net Enclosure & Field Spares", cost: 1000 },
      ],
      tiers: [
        {
          name: "Flight Supporter",
          amount: 300,
          description: "Provides flight batteries, propellers, and field maintenance tools.",
          perks: ["Company acknowledged in demo flight videos and repo documentation"],
        },
        {
          name: "Swarm Node Sponsor",
          amount: 800,
          description: "Completely funds an entire quadcopter vehicle node for a student.",
          perks: [
            "Company insignia on the drone top plate and battery wrap",
            "Quarterly technical progress updates and student resume packages",
          ],
        },
        {
          name: "Airborne Autonomy Partner",
          amount: 1800,
          description: "Major partner powering our computer vision and mesh communications research.",
          perks: [
            "Featured sponsor banner at all live drone field demonstrations",
            "Dedicated student recruitment networking evening",
            "Co-branded open-source release announcement on LinkedIn & GitHub",
          ],
        },
      ],
    },
  },
  {
    title: "IEEE Smart Campus IoT Beacon Network",
    slug: "ieee-smart-campus-iot-beacon-network",
    tagline: "Low-power Bluetooth 5.4 telemetry nodes with AES-256 encryption providing campus spatial analytics and event tracking.",
    category: "IoT & Networking",
    status: "Active",
    description: "The Smart Campus IoT Beacon Network is a multi-node sensor mesh deployed across UCF engineering buildings. Featuring solar energy harvesting and coin-cell operation, each beacon broadcasts encrypted indoor environmental metrics, ambient noise levels, and room occupancy heatmaps to a central Next.js dashboard.",
    repositoryUrl: "https://github.com/ieee-ucf/smart-campus-iot",
    tools: [
      { name: "Nordic nRF52840 SoC", category: "Embedded & Firmware" },
      { name: "Zephyr RTOS", category: "Embedded & Firmware" },
      { name: "Bluetooth Low Energy 5.4", category: "Hardware & PCB" },
      { name: "BME688 Gas & Climate Sensors", category: "Hardware & PCB" },
      { name: "Next.js & TypeScript", category: "Software & AI" },
      { name: "TimescaleDB & PostgreSQL", category: "Software & AI" },
      { name: "Solar Energy Harvester ICs", category: "Hardware & PCB" },
    ],
    timeline: [
      {
        date: "Oct 2024",
        title: "Ultra-Low-Power Sensor Node Architecture",
        description: "Designed power budget consuming sub-15uA average sleep current with solar harvesting.",
        status: "completed",
      },
      {
        date: "Dec 2024",
        title: "Zephyr RTOS BLE Mesh Firmware",
        description: "Implemented multi-hop packet routing and ECDSA cryptographic authentication.",
        status: "completed",
      },
      {
        date: "Feb 2025",
        title: "Campus Pilot Deployment in HEC & ENG1",
        description: "Installed 15 test beacons collecting real-time humidity, temperature, and indoor air quality.",
        status: "in_progress",
      },
      {
        date: "Apr 2025",
        title: "Campus Web Dashboard & Public API Launch",
        description: "Publish live open data portal for UCF student researchers and building facilities.",
        status: "upcoming",
      },
    ],
    skillsTaught: [
      "Nordic Semiconductor nRF52 SDK & Zephyr RTOS Development",
      "Ultra-Low-Power Design & Energy Harvesting Circuitry",
      "Bluetooth Low Energy (BLE) Advertising & Mesh Networking",
      "Cryptographic AES/ECDSA Security Implementation",
      "Full-Stack Real-Time Sensor Telemetry Dashboards",
      "Rapid Prototyping & Enclosure 3D Printing for Deployments",
    ],
    sponsorshipInfo: {
      fundingGoal: 1800,
      currentFunding: 1400,
      needsDescription: "Supports manufacturing 50 beacon hardware units, precision gas sensors, and gateway micro-servers for campus-wide expansion.",
      budgetBreakdown: [
        { item: "Nordic nRF52840 Modules (x50)", cost: 450 },
        { item: "Bosch BME688 AI Gas Sensors", cost: 380 },
        { item: "Mini Solar Harvester Cells & Supercapacitors", cost: 270 },
        { item: "Custom Injection Molded Enclosures", cost: 350 },
        { item: "Raspberry Pi 5 Gateway Base Stations (x3)", cost: 350 },
      ],
      tiers: [
        {
          name: "Sensor Sponsor",
          amount: 200,
          description: "Covers ambient sensor modules for 10 campus beacons.",
          perks: ["Logo and recognition on the public campus sensor telemetry dashboard"],
        },
        {
          name: "Gateway Partner",
          amount: 500,
          description: "Funds wireless gateway hardware and cloud timeseries infrastructure.",
          perks: [
            "Company branding on live dashboard and sensor API documentation",
            "Access to student team resumes and IoT recruitment channel",
          ],
        },
      ],
    },
  },
  {
    title: "IEEE PCB Design & Surface Mount Workshop Series",
    slug: "ieee-pcb-design-surface-mount-workshop",
    tagline: "Interactive electronic badges designed for semester workshops teaching 200+ students CAD layout and SMD soldering.",
    category: "Hardware",
    status: "Active",
    description: "This initiative designs and produces interactive, programmable electronic conference badges given to UCF engineering students. Each participant learns schematic design in KiCAD, trace routing, component selection, hands-on hot air/reflow soldering, and flashes their first custom firmware via USB-C.",
    repositoryUrl: "https://github.com/ieee-ucf/pcb-workshop-badge",
    tools: [
      { name: "KiCAD 8.0 EDA", category: "Hardware & PCB" },
      { name: "USB-C Power Delivery", category: "Hardware & PCB" },
      { name: "CH32V003 RISC-V Microcontroller", category: "Embedded & Firmware" },
      { name: "Addressable WS2812B RGB LEDs", category: "Hardware & PCB" },
      { name: "Hot Air Rework Stations", category: "Lab & Test Equipment" },
      { name: "Solder Paste Stencils & Squeegees", category: "Lab & Test Equipment" },
      { name: "Digital Microscopes", category: "Lab & Test Equipment" },
    ],
    timeline: [
      {
        date: "Aug 2024",
        title: "Badge Concept & RISC-V MCU Selection",
        description: "Selected 10-cent WCH RISC-V microcontrollers to maximize workshop affordability.",
        status: "completed",
      },
      {
        date: "Nov 2024",
        title: "100-Badge Fabrication Batch & Stencil QA",
        description: "Fabricated batch of matte-black and gold ENIG badges with custom UCF Pegasus art.",
        status: "completed",
      },
      {
        date: "Jan 2025",
        title: "Spring Soldering Workshop Series Kickoff",
        description: "Hosted 4 consecutive weekend lab sessions training 160+ students in hands-on SMD assembly.",
        status: "completed",
      },
      {
        date: "Apr 2025",
        title: "Advanced 4-Layer Wireless Badge Iteration",
        description: "Next-generation badge integrating ESP32-C6 for wireless multiplayer games between badge wearers.",
        status: "in_progress",
      },
    ],
    skillsTaught: [
      "Schematic Entry & Footprint Creation in KiCAD",
      "Design For Manufacturability (DFM) Guidelines",
      "Manual Surface Mount Solder Stencil Application",
      "Hot Air Reflow & Fine-Pitch SMD Rework Techniques",
      "Flashing RISC-V Firmware over Single-Wire WCH-Link",
      "Hardware Debugging with Digital Multimeters",
    ],
    sponsorshipInfo: {
      fundingGoal: 2000,
      currentFunding: 1650,
      needsDescription: "Subsidizes workshop materials so that every UCF student can design, assemble, and take home their own custom electronic hardware for free.",
      budgetBreakdown: [
        { item: "200x Custom ENIG PCB Badges & Stainless Stencils", cost: 700 },
        { item: "SMD Component Reels (LEDs, MCUs, Passives)", cost: 450 },
        { item: "Solder Paste, Flux Pens, and Desoldering Braid", cost: 250 },
        { item: "2x Quick 861DW Hot Air Rework Stations for Lab", cost: 600 },
      ],
      tiers: [
        {
          name: "Workshop Patron",
          amount: 250,
          description: "Sponsors component kits for 25 beginner students.",
          perks: ["Company recognized during workshop slides and handouts"],
        },
        {
          name: "Hardware Lab Sponsor",
          amount: 600,
          description: "Purchases a permanent hot air rework station for the IEEE innovation lab.",
          perks: [
            "Company logo etched into copper on the back of all 200 workshop badge PCBs",
            "Direct recruiting pitch opportunity during workshop opening remarks",
          ],
        },
        {
          name: "Annual Education Partner",
          amount: 1200,
          description: "Full semester workshop title patron educating hundreds of future engineers.",
          perks: [
            "Prominent silkscreen logo on the front face of all student badges",
            "Dedicated table and recruiter presence at every workshop session",
            "Comprehensive resume compilation of all attending students",
          ],
        },
      ],
    },
  },
];

const SEED_EVENTS = [
  {
    title: "IEEE Fall Kickoff General Body Meeting (GBM 1)",
    location: "Harris Engineering Center (HEC 101)",
    description: "Overview of semester technical build projects, committee workshops, free pizza, and networking with IEEE student officers.",
    startTime: "2024-09-04T18:00:00Z",
    endTime: "2024-09-04T20:00:00Z",
    slug: "fall-kickoff-gbm-1",
  },
  {
    title: "Hands-On PCB Design & Altium Workshop",
    location: "IEEE Innovation Lab (ENG2 135)",
    description: "Practical workshop covering schematic entry, PCB layout guidelines, trace routing, component selection, and surface-mount soldering techniques.",
    startTime: "2024-09-18T17:30:00Z",
    endTime: "2024-09-18T19:30:00Z",
    slug: "pcb-design-altium-workshop",
  },
  {
    title: "Embedded Linux & FreeRTOS Microcontroller Night",
    location: "Harris Engineering Center (HEC 118)",
    description: "Deep dive into real-time kernel task scheduling, IPC queues, hardware interrupts, and flashing custom C firmware on STM32 microcontrollers.",
    startTime: "2024-10-09T18:00:00Z",
    endTime: "2024-10-09T20:30:00Z",
    slug: "embedded-linux-freertos-night",
  },
  {
    title: "IEEE UCF Technical Resume & Recruiter Showcase",
    location: "Student Union Pegasus Ballroom",
    description: "Exclusive member networking session with defense, cloud, and semiconductor industry recruiters ahead of UCF STEM Career Fair.",
    startTime: "2024-10-23T16:00:00Z",
    endTime: "2024-10-23T19:00:00Z",
    slug: "resume-recruiter-showcase-2024",
  },
  {
    title: "Region 3 SoutheastCon Hardware Competition Build Sprint",
    location: "IEEE Innovation Lab (ENG2 135)",
    description: "Collaborative hackathon & build session programming autonomous rovers and testing sensor arrays for IEEE Region 3 competition.",
    startTime: "2024-11-06T17:00:00Z",
    endTime: "2024-11-06T21:00:00Z",
    slug: "southeastcon-hardware-build-sprint",
  },
  {
    title: "PyTorch & Edge AI Computer Vision Bootcamp",
    location: "Harris Engineering Center (HEC 101)",
    description: "Hands-on workshop building zero-shot object detection models and deploying quantization pipelines on Raspberry Pi and Edge TPU devices.",
    startTime: "2024-11-20T18:00:00Z",
    endTime: "2024-11-20T20:00:00Z",
    slug: "pytorch-edge-ai-bootcamp",
  },
  {
    title: "IEEE Spring General Body Meeting & Project Showcase",
    location: "Harris Engineering Center (HEC 101)",
    description: "Unveiling 2025 student projects, announcing officer elections, and connecting with corporate sponsors.",
    startTime: "2025-01-22T18:00:00Z",
    endTime: "2025-01-22T20:00:00Z",
    slug: "spring-gbm-project-showcase-2025",
  },
  {
    title: "IEEE UCF Industry Dinner & End-of-Year Banquet",
    location: "UCF Alumni Center",
    description: "Annual celebration honoring graduating seniors, outstanding committee chairs, and student competition winners.",
    startTime: "2025-04-18T18:30:00Z",
    endTime: "2025-04-18T21:30:00Z",
    slug: "industry-dinner-banquet-2025",
  },
];

export async function seedDatabase() {
  console.log(`Connecting to database at ${connectionString}...`);
  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  try {
    console.log('Ensuring schema tables exist...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS members (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(100),
        major VARCHAR(100),
        graduation_year VARCHAR(10),
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS member_resumes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id UUID NOT NULL UNIQUE REFERENCES members(id) ON DELETE CASCADE,
        full_name VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        bio TEXT NOT NULL,
        resume_pdf_url VARCHAR(200) NOT NULL,
        social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
        education JSONB NOT NULL,
        skills JSONB NOT NULL DEFAULT '[]'::jsonb,
        work_experience JSONB NOT NULL DEFAULT '[]'::jsonb,
        projects JSONB NOT NULL DEFAULT '[]'::jsonb,
        club_memberships JSONB NOT NULL DEFAULT '[]'::jsonb,
        certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
        flagged BOOLEAN NOT NULL DEFAULT false,
        flag_reason VARCHAR(300),
        main_project_name VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        slug VARCHAR(64) UNIQUE,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS event_attendees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT event_attendee_unique UNIQUE (event_id, member_id)
      );

      CREATE TABLE IF NOT EXISTS ieee_projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(64) NOT NULL UNIQUE,
        tagline VARCHAR(300),
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        repository_url VARCHAR(500),
        demo_url VARCHAR(500),
        banner_url VARCHAR(500),
        tools JSONB NOT NULL DEFAULT '[]'::jsonb,
        timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
        skills_taught JSONB NOT NULL DEFAULT '[]'::jsonb,
        sponsorship_info JSONB,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      ALTER TABLE ieee_projects ADD COLUMN IF NOT EXISTS tagline VARCHAR(300);
      ALTER TABLE ieee_projects ADD COLUMN IF NOT EXISTS banner_url VARCHAR(500);
      ALTER TABLE ieee_projects ADD COLUMN IF NOT EXISTS tools JSONB NOT NULL DEFAULT '[]'::jsonb;
      ALTER TABLE ieee_projects ADD COLUMN IF NOT EXISTS timeline JSONB NOT NULL DEFAULT '[]'::jsonb;
      ALTER TABLE ieee_projects ADD COLUMN IF NOT EXISTS skills_taught JSONB NOT NULL DEFAULT '[]'::jsonb;
      ALTER TABLE ieee_projects ADD COLUMN IF NOT EXISTS sponsorship_info JSONB;

      CREATE TABLE IF NOT EXISTS project_participants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID NOT NULL REFERENCES ieee_projects(id) ON DELETE CASCADE,
        member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
        role_title VARCHAR(100) NOT NULL DEFAULT 'Team Member',
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT project_participant_unique UNIQUE (project_id, member_id)
      );

      ALTER TABLE member_resumes ADD COLUMN IF NOT EXISTS main_project_name VARCHAR(255);
    `);

    console.log('Clearing existing records...');
    await pool.query('TRUNCATE TABLE project_participants, ieee_projects, event_attendees, events, member_resumes, members CASCADE;');

    console.log(`Seeding ${DENSE_CANDIDATES.length} dense candidate profiles...`);
    const createdMemberIds: string[] = [];

    const projectAssigments: string[] = [
      "IEEE Micromouse Autonomous Maze Solver",
      "IEEE UCF Member Catalog & Resume Hub",
      "IEEE Solar Knight Racing ESC",
      "IEEE Quadcopter Swarm",
      "IEEE Solar Knight Racing ESC",
      "IEEE Micromouse Autonomous Maze Solver",
      "IEEE Smart Campus IoT Beacon Network",
      "IEEE PCB Design & Surface Mount Workshop Series",
      "IEEE UCF Member Catalog & Resume Hub",
      "IEEE Quadcopter Swarm",
      "IEEE Micromouse Autonomous Maze Solver",
      "IEEE Solar Knight Racing ESC",
      "IEEE Smart Campus IoT Beacon Network",
      "IEEE PCB Design & Surface Mount Workshop Series",
      "IEEE Micromouse Autonomous Maze Solver",
      "IEEE Quadcopter Swarm",
      "IEEE UCF Member Catalog & Resume Hub",
      "IEEE Solar Knight Racing ESC",
      "IEEE Quadcopter Swarm",
      "IEEE Micromouse Autonomous Maze Solver",
      "IEEE Solar Knight Racing ESC",
      "IEEE Smart Campus IoT Beacon Network",
      "IEEE PCB Design & Surface Mount Workshop Series",
      "IEEE Micromouse Autonomous Maze Solver"
    ];

    for (let i = 0; i < DENSE_CANDIDATES.length; i++) {
      const candidate = DENSE_CANDIDATES[i];
      const mainProj = projectAssigments[i % projectAssigments.length];

      // 1. Insert into core members table
      const memberInsertQuery = `
        INSERT INTO members (name, email, major, graduation_year, active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, true, NOW(), NOW())
        RETURNING id;
      `;
      const memberRes = await pool.query(memberInsertQuery, [
        candidate.name,
        candidate.email,
        candidate.major,
        candidate.graduationYear,
      ]);
      const memberId = memberRes.rows[0].id;
      createdMemberIds.push(memberId);

      // 2. Insert into member_resumes table (1-to-1 relationship with member_id)
      const resumeInsertQuery = `
        INSERT INTO member_resumes (
          member_id, full_name, email, status, bio, resume_pdf_url,
          social_links, education, skills, work_experience, projects,
          club_memberships, certifications, flagged, main_project_name, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, false, $14, NOW(), NOW()
        );
      `;

      await pool.query(resumeInsertQuery, [
        memberId,
        candidate.name,
        candidate.email,
        candidate.status,
        candidate.bio,
        candidate.resumePdfUrl,
        JSON.stringify(candidate.socialLinks),
        JSON.stringify(candidate.education),
        JSON.stringify(candidate.skills),
        JSON.stringify(candidate.workExperience),
        JSON.stringify(candidate.projects),
        JSON.stringify(candidate.clubMemberships),
        JSON.stringify(candidate.certifications),
        mainProj,
      ]);

      console.log(`  ✓ Successfully seeded candidate: ${candidate.name} (${candidate.email}) [ID: ${memberId}]`);
    }

    console.log(`Seeding ${SEED_IEEE_PROJECTS.length} IEEE UCF Projects...`);
    const createdProjectIds: string[] = [];

    for (const prj of SEED_IEEE_PROJECTS) {
      const prjInsertQuery = `
        INSERT INTO ieee_projects (
          title, slug, tagline, description, category, status, repository_url, demo_url,
          tools, timeline, skills_taught, sponsorship_info, active, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, NOW(), NOW())
        RETURNING id;
      `;
      const prjRes = await pool.query(prjInsertQuery, [
        prj.title,
        prj.slug,
        prj.tagline || null,
        prj.description,
        prj.category,
        prj.status,
        prj.repositoryUrl,
        prj.demoUrl || null,
        JSON.stringify(prj.tools || []),
        JSON.stringify(prj.timeline || []),
        JSON.stringify(prj.skillsTaught || []),
        prj.sponsorshipInfo ? JSON.stringify(prj.sponsorshipInfo) : null,
      ]);
      const prjId = prjRes.rows[0].id;
      createdProjectIds.push(prjId);
      console.log(`  ✓ Seeded IEEE project: ${prj.title} [ID: ${prjId}]`);
    }

    // Link members to IEEE projects via project_participants
    for (let pIdx = 0; pIdx < createdProjectIds.length; pIdx++) {
      const prjId = createdProjectIds[pIdx];
      // Select 4-5 members per project
      for (let mOffset = 0; mOffset < 5; mOffset++) {
        const assignedMemberId = createdMemberIds[(pIdx * 5 + mOffset) % createdMemberIds.length];
        const roleTitle = mOffset === 0 ? "Project Director" : mOffset === 1 ? "Lead Engineer" : "Technical Contributor";

        await pool.query(`
          INSERT INTO project_participants (project_id, member_id, role_title, timestamp)
          VALUES ($1, $2, $3, NOW())
          ON CONFLICT (project_id, member_id) DO NOTHING;
        `, [prjId, assignedMemberId, roleTitle]);
      }

      console.log(`  ✓ Linked member roster to IEEE project ID ${prjId}`);
    }

    console.log(`Seeding ${SEED_EVENTS.length} IEEE UCF events...`);
    const createdEventIds: string[] = [];

    for (const evt of SEED_EVENTS) {
      const eventInsertQuery = `
        INSERT INTO events (title, location, description, slug, start_time, end_time, active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
        RETURNING id;
      `;
      const evtRes = await pool.query(eventInsertQuery, [
        evt.title,
        evt.location,
        evt.description,
        evt.slug,
        evt.startTime,
        evt.endTime,
      ]);
      const eventId = evtRes.rows[0].id;
      createdEventIds.push(eventId);
      console.log(`  ✓ Seeded event: ${evt.title} [ID: ${eventId}]`);
    }

    console.log('Connecting members to events via event_attendees...');
    // Link each member to a subset of events
    for (let mIdx = 0; mIdx < createdMemberIds.length; mIdx++) {
      const memberId = createdMemberIds[mIdx];
      // Select 3 to 6 events for each member
      const eventsForMember = createdEventIds.filter((_, eIdx) => (mIdx + eIdx) % 2 === 0 || (mIdx * 2 + eIdx) % 3 === 0);

      for (const eventId of eventsForMember) {
        await pool.query(`
          INSERT INTO event_attendees (event_id, member_id, timestamp)
          VALUES ($1, $2, NOW())
          ON CONFLICT (event_id, member_id) DO NOTHING;
        `, [eventId, memberId]);
      }
      console.log(`  ✓ Linked member ID ${memberId} to ${eventsForMember.length} events`);
    }

    console.log('\n🎉 Monorepo Database & Event Seeding complete!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}
