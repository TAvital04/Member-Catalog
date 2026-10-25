/**
 * @file jobs.ts
 * @description IEEE UCF Corporate Partner & Member Job Postings & Applications Dataset
 */

export interface JobPosting {
  id: string;
  title: string;
  slug: string;
  companyName: string;
  companyLogo?: string;
  department?: string;
  location: string;
  locationType: "On-site" | "Hybrid" | "Remote";
  employmentType: "Full-time" | "Internship" | "Co-op" | "Part-time";
  experienceLevel: "Internship / Student" | "Entry Level" | "Mid Level";
  salaryRange?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  skillsRequired: string[];
  employerEmail: string;
  employerWebsite?: string;
  status: "Active" | "Paused" | "Closed";
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  memberId: string;
  status: "Submitted" | "Under Review" | "Interviewing" | "Offered" | "Declined";
  coverNote?: string;
  customResumeUrl?: string;
  portfolioSnapshot: {
    name: string;
    email: string;
    major: string;
    gradDate: string;
    skills: string[];
    mainProjectName?: string;
    resumePdfUrl?: string;
    bio?: string;
  };
  appliedAt: string;
  updatedAt: string;
}

export interface JobTemplate {
  name: string;
  title: string;
  department: string;
  employmentType: "Full-time" | "Internship" | "Co-op" | "Part-time";
  locationType: "On-site" | "Hybrid" | "Remote";
  experienceLevel: "Internship / Student" | "Entry Level" | "Mid Level";
  salaryRange: string;
  skillsRequired: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

export const JOB_TEMPLATES: JobTemplate[] = [
  {
    name: "Embedded Systems Intern",
    title: "Embedded Systems & Firmware Engineering Intern",
    department: "Avionics & Embedded Computing",
    employmentType: "Internship",
    locationType: "Hybrid",
    experienceLevel: "Internship / Student",
    salaryRange: "$30 - $36 / hr",
    skillsRequired: ["C++", "RTOS", "Embedded Systems", "Linux", "Git", "Microcontrollers"],
    description: "Join our firmware development team to design, benchmark, and deploy mission-critical embedded software for next-generation aerospace telemetry systems.",
    responsibilities: [
      "Develop low-level C/C++ device drivers for ARM Cortex-M microcontrollers and RTOS environments.",
      "Interface with hardware diagnostics using oscilloscopes, logic analyzers, and I2C/SPI protocols.",
      "Collaborate with electrical engineers to validate custom PCB prototype boards and bring-up routines.",
      "Write automated unit tests and integration suites using GoogleTest and CI/CD pipelines."
    ],
    requirements: [
      "Pursuing a B.S. or M.S. in Computer Engineering, Electrical Engineering, or Computer Science.",
      "Demonstrated experience with C/C++ in microcontrollers (STM32, ESP32, TI MSP430, or Arduino).",
      "Familiarity with hardware communication protocols (SPI, I2C, UART, CAN).",
      "Active participant in IEEE, robotics clubs, or collegiate technical projects."
    ],
    benefits: [
      "Competitive hourly wage with housing stipend support for relocation.",
      "Direct 1-on-1 mentorship with Principal Aerospace Firmware Architects.",
      "Fast-track conversion eligibility for permanent post-graduation engineering roles."
    ]
  },
  {
    name: "Hardware / PCB Design Engineer",
    title: "Hardware Design & PCB Layout Engineer",
    department: "Hardware Engineering",
    employmentType: "Full-time",
    locationType: "On-site",
    experienceLevel: "Entry Level",
    salaryRange: "$85,000 - $102,000 / yr",
    skillsRequired: ["PCB Layout", "Altium Designer", "Circuit Design", "Soldering", "Power Electronics"],
    description: "Seeking a passionate electrical engineer to spearhead mixed-signal schematic capture, multi-layer high-speed PCB layouts, and prototype assembly for advanced power distribution units.",
    responsibilities: [
      "Design multi-layer schematics and high-speed PCB layouts in Altium Designer conforming to DFM/DFA rules.",
      "Conduct signal integrity, power integrity, and thermal modeling simulations.",
      "Assemble, hand-solder, and bring up complex surface-mount component prototypes (0402, QFN, BGA).",
      "Perform board-level debugging using spectrum analyzers, high-bandwidth DSOs, and electronic loads."
    ],
    requirements: [
      "B.S. in Electrical Engineering with graduation by Spring 2026 or Spring 2027.",
      "Demonstrated proficiency in Altium Designer, KiCAD, or Cadence OrCAD.",
      "Solid understanding of power supply topologies (Buck, Boost, Flyback, LDO).",
      "Hands-on soldering and benchtop test equipment verification skills."
    ],
    benefits: [
      "Comprehensive medical, dental, and vision health coverage from day one.",
      "401(k) with 6% immediate dollar-for-dollar employer matching.",
      "$10,000 annual continuing education & graduate degree tuition assistance."
    ]
  },
  {
    name: "RF & Wireless Systems Associate",
    title: "RF & Antenna Systems Associate Engineer",
    department: "Space & Airborne Communications",
    employmentType: "Full-time",
    locationType: "On-site",
    experienceLevel: "Entry Level",
    salaryRange: "$88,000 - $106,000 / yr",
    skillsRequired: ["RF Engineering", "Wireless Communications", "Antennas", "MATLAB", "Signal Processing"],
    description: "Contribute to satellite communications and radar front-end design, performing electromagnetic modeling, link budget analyses, and microwave circuit integration.",
    responsibilities: [
      "Model planar and phased-array antenna designs using HFSS, CST Studio, or ADS.",
      "Formulate link budgets and cascade noise figure analyses for Ka/Ku-band transceivers.",
      "Characterize S-parameters, gain, and return loss in anechoic chambers with Vector Network Analyzers.",
      "Develop MATLAB/Python automated data collection scripts for RF performance compliance."
    ],
    requirements: [
      "B.S. in Electrical Engineering with RF/Electromagnetics coursework emphasis.",
      "Experience with RF test equipment (VNAs, Spectrum Analyzers, Signal Generators).",
      "Familiarity with impedance matching techniques (Smith charts, microstrip matching networks).",
      "U.S. Citizenship required for facility security clearance eligibility."
    ],
    benefits: [
      "9/80 flexible work schedule (every other Friday off).",
      "Relocation package and corporate temporary housing stipend.",
      "Generous PTO plus 12 paid corporate and national holidays."
    ]
  },
  {
    name: "Robotics & Autonomous Systems Co-op",
    title: "Robotics & Perception Algorithms Co-op",
    department: "Autonomous Systems Lab",
    employmentType: "Co-op",
    locationType: "Hybrid",
    experienceLevel: "Internship / Student",
    salaryRange: "$32 - $38 / hr",
    skillsRequired: ["ROS", "Robotics", "Computer Vision", "Python", "C++", "Linux"],
    description: "Join our autonomous mobility team to build perception, state estimation, and sensor fusion algorithms for unmanned ground and aerial vehicles.",
    responsibilities: [
      "Implement ROS2 nodes for LiDAR, stereo-camera, and IMU sensor fusion pipelines.",
      "Develop object detection and spatial tracking algorithms using OpenCV and PyTorch.",
      "Conduct field tests in outdoor testing grounds and analyze telemetry bag files.",
      "Optimize perception algorithms for deployment on NVIDIA Jetson embedded GPUs."
    ],
    requirements: [
      "Student enrolled in Computer Engineering, Electrical Engineering, or Mechanical Engineering.",
      "Proven project experience with ROS or ROS2 in Linux environments.",
      "Proficient in Python and modern C++ (C++17/20).",
      "Enthusiasm for autonomous navigation, SLAM, or robotic manipulation."
    ],
    benefits: [
      "Direct hands-on access to autonomous vehicle test fleets and hardware labs.",
      "Paid attendance at leading robotics conferences and IEEE workshops.",
      "Housing subsidy and commuter reimbursement."
    ]
  }
];

export const SAMPLE_JOB_POSTINGS: JobPosting[] = [
  {
    id: "job-1",
    title: "Embedded Flight Software Engineering Intern",
    slug: "lockheed-martin-embedded-flight-software-intern",
    companyName: "Lockheed Martin",
    companyLogo: "LM",
    department: "Missiles & Fire Control (MFC)",
    location: "Orlando, FL",
    locationType: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship / Student",
    salaryRange: "$32 - $38 / hr",
    description: "Lockheed Martin Missiles and Fire Control in Orlando, FL is seeking high-achieving IEEE UCF student engineers for a premier Summer 2027 Embedded Software Engineering internship. Work alongside top defense industry aerospace architects building deterministic real-time software.",
    responsibilities: [
      "Design and test hard real-time C++ algorithms for guidance, navigation, and control modules.",
      "Integrate hardware-in-the-loop (HIL) simulators and conduct deterministic latency profiling.",
      "Implement secure communications over MIL-STD-1553, Ethernet, and serial telemetry links.",
      "Participate in Agile sprint planning, daily stand-ups, and peer architecture reviews."
    ],
    requirements: [
      "Active pursuit of B.S. in Computer Engineering or Electrical Engineering at UCF.",
      "Proficiency in C++ and understanding of Real-Time Operating Systems (RTOS / VxWorks / FreeRTOS).",
      "Demonstrated collegiate project involvement (IEEE, Robotics, Senior Design).",
      "Ability to obtain a U.S. DoD Secret security clearance."
    ],
    benefits: [
      "401(k) retirement savings with immediate company match.",
      "Competitive hourly wage + $3,000 relocation/housing lump sum stipend.",
      "Guaranteed early consideration for full-time post-graduate rotational programs."
    ],
    skillsRequired: ["C++", "RTOS", "Embedded Systems", "Linux", "Git", "Python"],
    employerEmail: "recruiting.mfc@lockheedmartin.com",
    employerWebsite: "https://www.lockheedmartin.com/careers",
    status: "Active",
    featured: true,
    createdAt: "2026-10-15T12:00:00Z",
    updatedAt: "2026-10-20T15:30:00Z",
  },
  {
    id: "job-2",
    title: "Analog & Mixed-Signal IC Applications Engineer",
    slug: "texas-instruments-analog-ic-applications-engineer",
    companyName: "Texas Instruments",
    companyLogo: "TI",
    department: "High Voltage Power Solutions",
    location: "Orlando, FL",
    locationType: "On-site",
    employmentType: "Full-time",
    experienceLevel: "Entry Level",
    salaryRange: "$88,000 - $105,000 / yr",
    description: "Texas Instruments is hiring upcoming and recent electrical engineering graduates to join our Orlando Applications Engineering Center. You will develop evaluation modules (EVMs), author technical application reports, and partner with tier-1 automotive and industrial clients.",
    responsibilities: [
      "Design reference circuit schematics and multi-layer PCB evaluation modules for TI PMICs and GaN/SiC drivers.",
      "Debug circuit performance in laboratory benches: switching efficiency, EMI emissions, and thermal dissipation.",
      "Author engineering application notes, calculator design tools, and customer technical collateral.",
      "Collaborate with silicon design teams to validate first-silicon silicon revisions and errata workarounds."
    ],
    requirements: [
      "B.S. in Electrical Engineering (Graduating May 2026, Dec 2026, or May 2027).",
      "Coursework or project expertise in Power Electronics, Analog Circuits, and PCB design.",
      "Familiarity with CAD tools such as Altium Designer, Cadence, or LTspice.",
      "Strong technical communication and presentation abilities."
    ],
    benefits: [
      "Annual profit-sharing bonus pool eligibility.",
      "Health, dental, vision, plus on-site health & fitness wellness subsidies.",
      "3 weeks paid vacation in addition to 12 corporate holidays."
    ],
    skillsRequired: ["PCB Layout", "Circuit Design", "Altium Designer", "Soldering", "Power Electronics"],
    employerEmail: "university_recruiting@ti.com",
    employerWebsite: "https://careers.ti.com",
    status: "Active",
    featured: true,
    createdAt: "2026-10-18T09:00:00Z",
    updatedAt: "2026-10-22T11:00:00Z",
  },
  {
    id: "job-3",
    title: "RF & Space Communications Associate Engineer",
    slug: "l3harris-rf-space-communications-engineer",
    companyName: "L3Harris Technologies",
    companyLogo: "L3H",
    department: "Space & Airborne Systems",
    location: "Melbourne, FL",
    locationType: "On-site",
    employmentType: "Full-time",
    experienceLevel: "Entry Level",
    salaryRange: "$86,000 - $99,000 / yr",
    description: "L3Harris Technologies has immediate openings in Melbourne, FL for entry-level RF and Antenna Engineers. Contribute to spaceborne phased arrays, satellite cross-links, and avionics communication systems supporting commercial space and NASA missions.",
    responsibilities: [
      "Perform electromagnetic modeling and antenna pattern simulations using Ansys HFSS and MATLAB.",
      "Design active RF front-end modules including low-noise amplifiers (LNAs), filters, and mixers.",
      "Conduct S-parameter, noise figure, and intermodulation measurements in RF anechoic chambers.",
      "Troubleshoot production RF assemblies alongside senior system architects and test technicians."
    ],
    requirements: [
      "B.S. in Electrical Engineering with focus on RF/Microwave and Electromagnetics.",
      "Familiarity with RF test equipment: Network Analyzers, Spectrum Analyzers, Power Meters.",
      "Experience with MATLAB for signal processing, modulation analysis, and test automation.",
      "U.S. Citizenship required due to ITAR and export-controlled technology requirements."
    ],
    benefits: [
      "9/80 work schedule (enjoy every second Friday off).",
      "$5,000 relocation assistance + 30 days corporate temporary lodging.",
      "Tuition assistance for graduate master's degree programs at UCF or FIT."
    ],
    skillsRequired: ["RF Engineering", "Wireless Communications", "Antennas", "MATLAB", "Signal Processing"],
    employerEmail: "careers.space@l3harris.com",
    employerWebsite: "https://careers.l3harris.com",
    status: "Active",
    featured: false,
    createdAt: "2026-10-12T14:00:00Z",
    updatedAt: "2026-10-19T10:00:00Z",
  },
  {
    id: "job-4",
    title: "Power Grid & Automation Systems Co-op",
    slug: "siemens-energy-power-grid-automation-coop",
    companyName: "Siemens Energy",
    companyLogo: "SE",
    department: "Grid Technologies & Digitalization",
    location: "Orlando, FL",
    locationType: "Hybrid",
    employmentType: "Co-op",
    experienceLevel: "Internship / Student",
    salaryRange: "$28 - $34 / hr",
    description: "Siemens Energy Orlando Innovation Center is seeking motivated UCF engineering students for a dynamic 6-month Co-op rotation. You will develop supervisory control algorithms, protective relay settings, and IoT condition-monitoring telemetry for renewable energy sub-stations.",
    responsibilities: [
      "Configure and test digital substation protection relays (SIPROTEC) using IEC 61850 protocols.",
      "Develop Python automation scripts to simulate grid load flow under fluctuating solar/wind generation.",
      "Assist with cyber-physical hardening of industrial IoT gateways and SCADA systems.",
      "Document test procedures, safety compliance checks, and commissioning guidelines."
    ],
    requirements: [
      "Pursuing a degree in Electrical Engineering, Computer Engineering, or Energy Systems.",
      "Knowledge of AC power systems, three-phase power, transformers, and circuit protection.",
      "Basic programming skills in Python or C/C++.",
      "Strong organizational skills and ability to commit to alternating school/work semesters."
    ],
    benefits: [
      "Paid co-op with academic credit sponsorship.",
      "Flexible hybrid telework arrangement (2 days on-site in Orlando).",
      "Opportunity for international rotational assignment upon graduation."
    ],
    skillsRequired: ["Power Electronics", "Control Systems", "Python", "PLC Programming"],
    employerEmail: "campus.recruiting@siemens-energy.com",
    employerWebsite: "https://www.siemens-energy.com/careers",
    status: "Active",
    featured: false,
    createdAt: "2026-10-16T11:00:00Z",
    updatedAt: "2026-10-21T08:00:00Z",
  },
  {
    id: "job-5",
    title: "Digital Signal Processing & FPGA Developer",
    slug: "northrop-grumman-dsp-fpga-developer",
    companyName: "Northrop Grumman",
    companyLogo: "NG",
    department: "Mission Systems - Airborne Sensors",
    location: "Melbourne, FL",
    locationType: "On-site",
    employmentType: "Full-time",
    experienceLevel: "Entry Level",
    salaryRange: "$92,000 - $112,000 / yr",
    description: "Northrop Grumman Mission Systems is seeking a Digital Signal Processing (DSP) & FPGA Engineer in Melbourne, FL. You will architect high-throughput VHDL/Verilog pipelines for synthetic aperture radar (SAR) and airborne electronic warfare payloads.",
    responsibilities: [
      "Design, synthesize, and place-and-route complex FPGA architectures in Xilinx Vivado and Intel Quartus.",
      "Implement DSP algorithms: FFTs, FIR filters, polyphase channelizers, and matrix operations.",
      "Construct cycle-accurate simulation testbenches in ModelSim / QuestaSim.",
      "Debug system timing violations and hardware-in-the-loop validation with PCIe interfaces."
    ],
    requirements: [
      "B.S. in Computer Engineering or Electrical Engineering.",
      "Experience writing synthesizable Verilog or VHDL.",
      "Understanding of fixed-point arithmetic, clock domain crossing, and pipelining.",
      "Eligible to obtain and maintain a DoD Secret or Top Secret security clearance."
    ],
    benefits: [
      "Full 9/80 schedule with every other Friday off.",
      "Annual incentive merit bonuses and stock awards.",
      "Comprehensive 401(k) matching up to 6% with immediate 100% vesting."
    ],
    skillsRequired: ["Verilog", "FPGA", "C++", "Signal Processing"],
    employerEmail: "ngc.recruiting.fl@ngc.com",
    employerWebsite: "https://www.northropgrumman.com/careers",
    status: "Active",
    featured: false,
    createdAt: "2026-10-14T10:00:00Z",
    updatedAt: "2026-10-20T16:00:00Z",
  },
  {
    id: "job-6",
    title: "Robotics & Autonomous Vehicle Software Intern",
    slug: "knighttech-robotics-autonomous-vehicle-intern",
    companyName: "KnightTech Robotics",
    companyLogo: "KTR",
    department: "Autonomy Core",
    location: "Orlando, FL",
    locationType: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Internship / Student",
    salaryRange: "$26 - $32 / hr",
    description: "KnightTech Robotics is a venture-backed autonomous delivery robotics startup located right in the UCF Central Florida Research Park. We are recruiting IEEE UCF student roboticists to build ROS2 perception and trajectory planning algorithms.",
    responsibilities: [
      "Develop ROS2 navigation and behavior tree packages for autonomous ground robots.",
      "Train edge computer vision models (YOLO / TensorRT) on embedded NVIDIA Jetson platforms.",
      "Perform hardware sensor calibration: LiDAR, RGB-D cameras, and RTK-GPS modules.",
      "Participate in live outdoor operational testing across UCF main campus."
    ],
    requirements: [
      "Current UCF engineering student with at least 1 semester remaining.",
      "Hands-on experience with ROS or ROS2 and Linux environments.",
      "Proficient in Python and modern C++.",
      "Eager to test robotic prototypes in real-world environments."
    ],
    benefits: [
      "Flexible part-time during Fall/Spring semesters (15-20 hrs/week), full-time in Summer.",
      "Catered lunches and weekly tech talks with venture partners.",
      "Equity grant participation options upon successful internship completion."
    ],
    skillsRequired: ["ROS", "Robotics", "Computer Vision", "Python", "C++"],
    employerEmail: "careers@knighttechrobotics.com",
    employerWebsite: "https://knighttechrobotics.com",
    status: "Active",
    featured: true,
    createdAt: "2026-10-17T13:00:00Z",
    updatedAt: "2026-10-23T14:00:00Z",
  }
];

export const SAMPLE_JOB_APPLICATIONS: JobApplication[] = [
  // --- JOB 1: Lockheed Martin (Embedded Flight Software Intern) ---
  {
    id: "app-1",
    jobId: "job-1",
    memberId: "student-1",
    status: "Interviewing",
    coverNote: "I've spent the last year developing embedded motor control algorithms for the UCF IEEE Autonomous Rover and have hands-on experience with FreeRTOS and STM32.",
    portfolioSnapshot: {
      name: "Marcus Vance",
      email: "marcus.vance@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2026",
      skills: ["Robotics", "C++", "ROS", "Embedded Systems", "Linux", "RTOS"],
      mainProjectName: "Autonomous Rover",
      resumePdfUrl: "https://drive.google.com/file/d/marcus-vance-resume/view",
      bio: "Computer Engineering senior passionate about robotics, embedded systems, and real-time firmware."
    },
    appliedAt: "2026-10-18T16:00:00Z",
    updatedAt: "2026-10-22T09:30:00Z"
  },
  {
    id: "app-2",
    jobId: "job-1",
    memberId: "student-3",
    status: "Offered",
    coverNote: "Junior specializing in low-level flight firmware and Linux kernel drivers. Completed a previous co-op with HIL simulation tools and would love to return to MFC.",
    portfolioSnapshot: {
      name: "Alex Rivera",
      email: "arivera@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2026",
      skills: ["C++", "FreeRTOS", "Embedded Linux", "Verilog", "STM32", "Git"],
      mainProjectName: "RSO Micromouse Autonomous Maze Solver",
      resumePdfUrl: "https://drive.google.com/file/d/alex-rivera-resume/view",
      bio: "Computer Engineering junior specializing in embedded Linux systems, real-time operating systems, and FPGA hardware accelerators."
    },
    appliedAt: "2026-10-16T10:15:00Z",
    updatedAt: "2026-10-24T14:00:00Z"
  },
  {
    id: "app-3",
    jobId: "job-1",
    memberId: "student-4",
    status: "Under Review",
    coverNote: "Experienced in real-time operating systems and C++ automated testing frameworks. Actively building flight telemetry parsers for the AIAA rocketry team.",
    portfolioSnapshot: {
      name: "Sarah Lin",
      email: "slin@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2027",
      skills: ["C++", "Python", "Linux", "Git", "Embedded Systems", "RTOS"],
      mainProjectName: "High-Altitude Avionics Data Logger",
      resumePdfUrl: "https://drive.google.com/file/d/sarah-lin-resume/view",
      bio: "Computer Engineering sophomore focused on deterministic software architectures, telemetry streaming, and embedded test automation."
    },
    appliedAt: "2026-10-19T14:30:00Z",
    updatedAt: "2026-10-21T11:00:00Z"
  },
  {
    id: "app-4",
    jobId: "job-1",
    memberId: "student-5",
    status: "Submitted",
    coverNote: "Computer Science major with extensive systems-level C/C++ experience and strong interest in aerospace defense software and secure telemetry links.",
    portfolioSnapshot: {
      name: "Liam O'Connor",
      email: "loconnor@knights.ucf.edu",
      major: "Computer Science",
      gradDate: "May 2026",
      skills: ["C++", "Linux", "Git", "Python", "Embedded Systems", "Cybersecurity"],
      mainProjectName: "Cryptographic Telemetry Gateway",
      resumePdfUrl: "https://drive.google.com/file/d/liam-oconnor-resume/view",
      bio: "Computer Science senior passionate about secure firmware development, operating system internals, and low-latency network protocols."
    },
    appliedAt: "2026-10-23T09:45:00Z",
    updatedAt: "2026-10-23T09:45:00Z"
  },

  // --- JOB 2: Texas Instruments (Analog & Mixed-Signal IC Applications Engineer) ---
  {
    id: "app-5",
    jobId: "job-2",
    memberId: "student-2",
    status: "Interviewing",
    coverNote: "I lead the UCF IEEE PCB Design Workshop and have routed high-speed 4-layer boards in Altium Designer. I would love to contribute to TI's evaluation module reference team.",
    portfolioSnapshot: {
      name: "Ethan Wright",
      email: "ewright@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2027",
      skills: ["PCB Layout", "Altium Designer", "Circuit Design", "Soldering", "Power Electronics"],
      mainProjectName: "RSO PCB Design & Surface Mount Workshop",
      resumePdfUrl: "https://drive.google.com/file/d/ethan-wright-resume/view",
      bio: "Sophomore EE student focused on PCB schematic layout, surface-mount soldering, and analog sensor interfacing."
    },
    appliedAt: "2026-10-20T11:20:00Z",
    updatedAt: "2026-10-23T16:00:00Z"
  },
  {
    id: "app-6",
    jobId: "job-2",
    memberId: "student-6",
    status: "Offered",
    coverNote: "Senior Electrical Engineer specializing in switched-mode power supplies (SMPS) and GaN FET gate drivers. Winner of the 2025 IEEE SoutheastCon Hardware Competition.",
    portfolioSnapshot: {
      name: "Maya Patel",
      email: "mpatel@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2026",
      skills: ["Circuit Design", "Power Electronics", "Altium Designer", "Soldering", "Oscilloscopes"],
      mainProjectName: "High-Efficiency 48V-to-12V GaN Synchronous Buck Converter",
      resumePdfUrl: "https://drive.google.com/file/d/maya-patel-resume/view",
      bio: "Electrical Engineering senior passionate about power conversion topologies, magnetics modeling, and high-frequency analog design."
    },
    appliedAt: "2026-10-18T13:10:00Z",
    updatedAt: "2026-10-24T10:00:00Z"
  },
  {
    id: "app-7",
    jobId: "job-2",
    memberId: "student-7",
    status: "Under Review",
    coverNote: "Hands-on experience soldering 0402 surface-mount components, laying out multi-layer power distribution networks, and benchtop testing with high-bandwidth DSOs.",
    portfolioSnapshot: {
      name: "David Zhao",
      email: "dzhao@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2026",
      skills: ["Circuit Design", "Altium Designer", "Soldering", "Analog Design", "PCB Layout"],
      mainProjectName: "Precision Biopotential Analog Front-End (AFE)",
      resumePdfUrl: "https://drive.google.com/file/d/david-zhao-resume/view",
      bio: "Senior EE student passionate about mixed-signal instrumentation, low-noise analog signal conditioning, and PCB fabrication."
    },
    appliedAt: "2026-10-21T15:00:00Z",
    updatedAt: "2026-10-21T15:00:00Z"
  },
  {
    id: "app-8",
    jobId: "job-2",
    memberId: "student-8",
    status: "Submitted",
    coverNote: "Experienced with SPICE circuit simulations and Altium Designer component library management. Excited about TI's Orlando design center operations.",
    portfolioSnapshot: {
      name: "Elena Rostova",
      email: "erostova@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2027",
      skills: ["PCB Layout", "Circuit Design", "Altium Designer", "Soldering", "LTspice"],
      mainProjectName: "Battery Management System with Active Balancing",
      resumePdfUrl: "https://drive.google.com/file/d/elena-rostova-resume/view",
      bio: "Electrical Engineering student focusing on battery management systems, thermal management, and power semiconductor reliability."
    },
    appliedAt: "2026-10-23T11:30:00Z",
    updatedAt: "2026-10-23T11:30:00Z"
  },

  // --- JOB 3: L3Harris Technologies (RF & Space Communications Associate) ---
  {
    id: "app-9",
    jobId: "job-3",
    memberId: "student-9",
    status: "Interviewing",
    coverNote: "Conducted RF anechoic chamber testing for UCF IEEE CubeSat communications subsystem. Proficient in MATLAB antenna modeling and network analyzer calibration.",
    portfolioSnapshot: {
      name: "Jordan Hayes",
      email: "jhayes@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2026",
      skills: ["RF Engineering", "Wireless Communications", "Antennas", "MATLAB", "Signal Processing"],
      mainProjectName: "CubeSat S-Band Patch Antenna Array",
      resumePdfUrl: "https://drive.google.com/file/d/jordan-hayes-resume/view",
      bio: "Electrical Engineering senior specializing in microwave circuit design, planar patch antennas, and electromagnetic link budget simulations."
    },
    appliedAt: "2026-10-15T14:20:00Z",
    updatedAt: "2026-10-22T16:45:00Z"
  },
  {
    id: "app-10",
    jobId: "job-3",
    memberId: "student-10",
    status: "Offered",
    coverNote: "Completed undergraduate research in phased-array beamforming and cascaded noise figure optimization. U.S. citizen eligible for defense security clearance.",
    portfolioSnapshot: {
      name: "Chloe Bennett",
      email: "cbennett@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2026",
      skills: ["RF Engineering", "Wireless Communications", "Signal Processing", "MATLAB", "Antennas"],
      mainProjectName: "Digital Beamforming Receiver Front-End",
      resumePdfUrl: "https://drive.google.com/file/d/chloe-bennett-resume/view",
      bio: "Burnett Honors College scholar focused on airborne radar front-ends, high-frequency S-parameter characterization, and satellite communications."
    },
    appliedAt: "2026-10-14T09:15:00Z",
    updatedAt: "2026-10-24T12:00:00Z"
  },
  {
    id: "app-11",
    jobId: "job-3",
    memberId: "student-2",
    status: "Under Review",
    coverNote: "Experienced in RF microstrip routing, high-frequency PCB substrate selection (Rogers RO4350B), and impedance matching networks using Smith charts.",
    portfolioSnapshot: {
      name: "Ethan Wright",
      email: "ewright@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2027",
      skills: ["RF Engineering", "Antennas", "Wireless Communications", "PCB Layout", "Altium Designer"],
      mainProjectName: "2.4 GHz Microstrip Diplexer & Low-Noise Amplifier",
      resumePdfUrl: "https://drive.google.com/file/d/ethan-wright-resume/view",
      bio: "Sophomore EE student focused on PCB schematic layout, surface-mount soldering, and analog sensor interfacing."
    },
    appliedAt: "2026-10-19T16:10:00Z",
    updatedAt: "2026-10-21T10:00:00Z"
  },
  {
    id: "app-12",
    jobId: "job-3",
    memberId: "student-3",
    status: "Submitted",
    coverNote: "Software-defined radio (SDR) enthusiast with experience implementing QPSK and OFDM modulation pipelines in GNU Radio and MATLAB.",
    portfolioSnapshot: {
      name: "Alex Rivera",
      email: "arivera@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2026",
      skills: ["Signal Processing", "MATLAB", "C++", "Wireless Communications", "Linux"],
      mainProjectName: "SDR Satellite Ground Station Demodulator",
      resumePdfUrl: "https://drive.google.com/file/d/alex-rivera-resume/view",
      bio: "Computer Engineering junior specializing in embedded Linux systems, real-time operating systems, and FPGA hardware accelerators."
    },
    appliedAt: "2026-10-22T17:30:00Z",
    updatedAt: "2026-10-22T17:30:00Z"
  },

  // --- JOB 4: Siemens Energy (Power Grid & Automation Systems Co-op) ---
  {
    id: "app-13",
    jobId: "job-4",
    memberId: "student-6",
    status: "Interviewing",
    coverNote: "Passionate about renewable energy grid integration. Completed IEEE coursework in transmission line modeling, power flow analysis, and protective relaying.",
    portfolioSnapshot: {
      name: "Maya Patel",
      email: "mpatel@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2026",
      skills: ["Power Electronics", "Control Systems", "Python", "Circuit Design"],
      mainProjectName: "Grid-Tied Solar Inverter with MPPT Control",
      resumePdfUrl: "https://drive.google.com/file/d/maya-patel-resume/view",
      bio: "Electrical Engineering senior passionate about power conversion topologies, magnetics modeling, and high-frequency analog design."
    },
    appliedAt: "2026-10-17T11:00:00Z",
    updatedAt: "2026-10-23T15:30:00Z"
  },
  {
    id: "app-14",
    jobId: "job-4",
    memberId: "student-11",
    status: "Under Review",
    coverNote: "Experience programming industrial PLCs (Structured Text, Ladder Logic) and building SCADA dashboards using Python and Modbus protocols.",
    portfolioSnapshot: {
      name: "Lucas Silva",
      email: "lsilva@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2027",
      skills: ["Control Systems", "PLC Programming", "Python", "Power Electronics"],
      mainProjectName: "Automated Substation Monitoring Gateway",
      resumePdfUrl: "https://drive.google.com/file/d/lucas-silva-resume/view",
      bio: "Junior electrical engineering student passionate about industrial automation, renewable microgrids, and digital substation protocols."
    },
    appliedAt: "2026-10-20T14:40:00Z",
    updatedAt: "2026-10-20T14:40:00Z"
  },
  {
    id: "app-15",
    jobId: "job-4",
    memberId: "student-1",
    status: "Submitted",
    coverNote: "Experienced in real-time embedded monitoring systems and sensor data acquisition. Looking forward to applying IoT firmware skills to smart grid telemetry.",
    portfolioSnapshot: {
      name: "Marcus Vance",
      email: "marcus.vance@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2026",
      skills: ["Embedded Systems", "Python", "Control Systems", "C++"],
      mainProjectName: "Industrial IoT Edge Telemetry Node",
      resumePdfUrl: "https://drive.google.com/file/d/marcus-vance-resume/view",
      bio: "Computer Engineering senior passionate about robotics, embedded systems, and real-time firmware."
    },
    appliedAt: "2026-10-22T13:15:00Z",
    updatedAt: "2026-10-22T13:15:00Z"
  },
  {
    id: "app-16",
    jobId: "job-4",
    memberId: "student-8",
    status: "Declined",
    coverNote: "Interested in high-voltage circuit breakers and power distribution substations across central Florida.",
    portfolioSnapshot: {
      name: "Elena Rostova",
      email: "erostova@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2027",
      skills: ["Power Electronics", "Control Systems", "Circuit Design"],
      mainProjectName: "Substation Protective Relay Sandbox",
      resumePdfUrl: "https://drive.google.com/file/d/elena-rostova-resume/view",
      bio: "Electrical Engineering student focusing on battery management systems, thermal management, and power semiconductor reliability."
    },
    appliedAt: "2026-10-18T10:00:00Z",
    updatedAt: "2026-10-21T09:00:00Z"
  },

  // --- JOB 5: Northrop Grumman (Digital Signal Processing & FPGA Developer) ---
  {
    id: "app-17",
    jobId: "job-5",
    memberId: "student-3",
    status: "Interviewing",
    coverNote: "Designed a pipelined FFT coprocessor in SystemVerilog for airborne radar signals on Xilinx Artix-7. Comfortable with timing closure and AXI4 stream interfaces.",
    portfolioSnapshot: {
      name: "Alex Rivera",
      email: "arivera@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2026",
      skills: ["Verilog", "FPGA", "C++", "Signal Processing", "Linux"],
      mainProjectName: "FPGA 1024-Point Real-Time FFT Pipeline",
      resumePdfUrl: "https://drive.google.com/file/d/alex-rivera-resume/view",
      bio: "Computer Engineering junior specializing in embedded Linux systems, real-time operating systems, and FPGA hardware accelerators."
    },
    appliedAt: "2026-10-15T15:30:00Z",
    updatedAt: "2026-10-23T11:20:00Z"
  },
  {
    id: "app-18",
    jobId: "job-5",
    memberId: "student-7",
    status: "Offered",
    coverNote: "Extensive coursework in VLSI design, digital signal processing, and high-speed hardware accelerators. Winner of the Dean's Undergraduate Engineering Showcase.",
    portfolioSnapshot: {
      name: "David Zhao",
      email: "dzhao@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2026",
      skills: ["Verilog", "FPGA", "C++", "Signal Processing"],
      mainProjectName: "Systolic Array Matrix Multiplier for Edge Neural Networks",
      resumePdfUrl: "https://drive.google.com/file/d/david-zhao-resume/view",
      bio: "Senior EE/CpE student passionate about digital design, hardware accelerators, and high-throughput FPGA arithmetic pipelines."
    },
    appliedAt: "2026-10-16T12:00:00Z",
    updatedAt: "2026-10-24T15:00:00Z"
  },
  {
    id: "app-19",
    jobId: "job-5",
    memberId: "student-4",
    status: "Under Review",
    coverNote: "Experienced writing synthesizable Verilog modules and testbenches using Icarus Verilog and GTKWave. Currently implementing an FIR filter core on Intel Cyclone IV.",
    portfolioSnapshot: {
      name: "Sarah Lin",
      email: "slin@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2027",
      skills: ["Verilog", "C++", "Signal Processing", "Git"],
      mainProjectName: "Digital Polyphase Decimation Filter",
      resumePdfUrl: "https://drive.google.com/file/d/sarah-lin-resume/view",
      bio: "Computer Engineering sophomore focused on deterministic software architectures, telemetry streaming, and embedded test automation."
    },
    appliedAt: "2026-10-20T16:15:00Z",
    updatedAt: "2026-10-21T10:30:00Z"
  },
  {
    id: "app-20",
    jobId: "job-5",
    memberId: "student-9",
    status: "Submitted",
    coverNote: "Strong theoretical and practical background in digital filter design, adaptive beamforming, and MATLAB fixed-point modeling for FPGA deployment.",
    portfolioSnapshot: {
      name: "Jordan Hayes",
      email: "jhayes@knights.ucf.edu",
      major: "Electrical Engineering",
      gradDate: "May 2026",
      skills: ["Signal Processing", "MATLAB", "C++", "Wireless Communications"],
      mainProjectName: "Chirp Radar Pulse Compression Simulator",
      resumePdfUrl: "https://drive.google.com/file/d/jordan-hayes-resume/view",
      bio: "Electrical Engineering senior specializing in microwave circuit design, planar patch antennas, and electromagnetic link budget simulations."
    },
    appliedAt: "2026-10-23T14:10:00Z",
    updatedAt: "2026-10-23T14:10:00Z"
  },

  // --- JOB 6: KnightTech Robotics (Autonomous Vehicle Software Intern) ---
  {
    id: "app-21",
    jobId: "job-6",
    memberId: "student-1",
    status: "Interviewing",
    coverNote: "Excited by KnightTech's campus delivery missions. I have already configured ROS2 Navigation2 packages for our student club robot.",
    portfolioSnapshot: {
      name: "Marcus Vance",
      email: "marcus.vance@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2026",
      skills: ["ROS", "Robotics", "Computer Vision", "Python", "C++"],
      mainProjectName: "Autonomous Rover",
      resumePdfUrl: "https://drive.google.com/file/d/marcus-vance-resume/view",
      bio: "Computer Engineering senior passionate about robotics, embedded systems, and real-time firmware."
    },
    appliedAt: "2026-10-21T14:45:00Z",
    updatedAt: "2026-10-23T16:20:00Z"
  },
  {
    id: "app-22",
    jobId: "job-6",
    memberId: "student-3",
    status: "Under Review",
    coverNote: "Built computer vision obstacle avoidance algorithms with OpenCV and deployed on Jetson Orin Nano. Familiar with CAN bus motor driver integration.",
    portfolioSnapshot: {
      name: "Alex Rivera",
      email: "arivera@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2026",
      skills: ["Robotics", "Computer Vision", "C++", "Python", "Linux"],
      mainProjectName: "RSO Micromouse Autonomous Maze Solver",
      resumePdfUrl: "https://drive.google.com/file/d/alex-rivera-resume/view",
      bio: "Computer Engineering junior specializing in embedded Linux systems, real-time operating systems, and FPGA hardware accelerators."
    },
    appliedAt: "2026-10-19T10:30:00Z",
    updatedAt: "2026-10-20T12:00:00Z"
  },
  {
    id: "app-23",
    jobId: "job-6",
    memberId: "student-11",
    status: "Submitted",
    coverNote: "Passionate about autonomous ground robotics. Experience writing ROS publisher/subscriber nodes in C++ and Python for sensor telemetry.",
    portfolioSnapshot: {
      name: "Lucas Silva",
      email: "lsilva@knights.ucf.edu",
      major: "Computer Engineering",
      gradDate: "May 2027",
      skills: ["ROS", "Robotics", "Python", "C++", "Computer Vision"],
      mainProjectName: "Autonomous Delivery Platform Path Planner",
      resumePdfUrl: "https://drive.google.com/file/d/lucas-silva-resume/view",
      bio: "Junior computer engineering student passionate about industrial automation, mobile robotics, and path planning algorithms."
    },
    appliedAt: "2026-10-23T16:00:00Z",
    updatedAt: "2026-10-23T16:00:00Z"
  },
  {
    id: "app-24",
    jobId: "job-6",
    memberId: "student-5",
    status: "Under Review",
    coverNote: "Machine learning and computer vision student. Trained YOLOv8 object detection models for pedestrian and obstacle avoidance in real-time video streams.",
    portfolioSnapshot: {
      name: "Liam O'Connor",
      email: "loconnor@knights.ucf.edu",
      major: "Computer Science",
      gradDate: "May 2026",
      skills: ["Computer Vision", "Python", "C++", "Robotics", "Linux"],
      mainProjectName: "Real-Time Embedded Visual Odometry",
      resumePdfUrl: "https://drive.google.com/file/d/liam-oconnor-resume/view",
      bio: "Computer Science senior passionate about computer vision, edge AI inference, and autonomous navigation pipelines."
    },
    appliedAt: "2026-10-22T11:45:00Z",
    updatedAt: "2026-10-22T11:45:00Z"
  }
];

