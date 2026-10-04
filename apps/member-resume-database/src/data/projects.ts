/**
 * @file projects.ts
 * @description Domain models, interfaces, and sample datasets for IEEE UCF Chapter Projects.
 * Includes tooling definitions, milestone timelines, participant rosters, skills taught,
 * and sponsorship benefits for corporate and individual partners.
 */

export interface ProjectParticipant {
  memberId: string;
  name: string;
  email: string;
  major: string;
  roleTitle: string;
  resumeId?: string;
}

export interface ProjectTool {
  name: string;
  category: "Embedded & Firmware" | "Hardware & PCB" | "Software & AI" | "CAD & Fabrication" | "Lab & Test Equipment" | "Other";
  icon?: string;
}

export interface ProjectMilestone {
  date: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "upcoming";
}

export interface SponsorshipBenefit {
  title: string;
  description: string;
  category?: "Brand Placement" | "Recruiting & Talent" | "Event & Community";
  highlight?: boolean;
}

export interface ProjectSponsorship {
  overview?: string;
  benefits: SponsorshipBenefit[];
}

export interface IEEEProject {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  category: string;
  status: "Active" | "Completed" | "In Development";
  repositoryUrl?: string;
  demoUrl?: string;
  bannerUrl?: string;
  active: boolean;
  tools: ProjectTool[];
  timeline: ProjectMilestone[];
  skillsTaught: string[];
  sponsorshipInfo?: ProjectSponsorship;
  participants: ProjectParticipant[];
}

export const SAMPLE_IEEE_PROJECTS: IEEEProject[] = [
  {
    id: "proj-micromouse-001",
    title: "IEEE Micromouse Autonomous Maze Solver",
    slug: "ieee-micromouse-autonomous-maze-solver",
    tagline: "High-speed autonomous robotics solving 16x16 maze grids using custom flood-fill algorithms and sub-millimeter motor control.",
    description: "The IEEE Micromouse is an autonomous, battery-powered robotics competition platform. The robot navigates and maps an unknown 16x16 maze, computes the optimal shortest path using flood-fill and A* graph traversal, and executes high-speed runs with active yaw stabilization and PID motor velocity control.",
    category: "Robotics",
    status: "Active",
    repositoryUrl: "https://github.com/ieee-ucf/micromouse-maze-solver",
    demoUrl: "https://ieee.ucf.edu/projects/micromouse",
    active: true,
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
      overview: "Sponsoring the IEEE Micromouse team directly equips students with high-precision components, fabrication materials, and competition travel funding.",
      benefits: [
        {
          title: "Branding on Robot Carbon-Fiber Chassis",
          description: "Your company logo permanently displayed on the physical robot chassis competing in front of hundreds at IEEE SoutheastCon.",
          category: "Brand Placement",
          highlight: true,
        },
        {
          title: "Silkscreen Logo on Custom Motherboard PCB",
          description: "Permanent company logo etched directly onto the PCB silkscreen of every revision manufactured for the robot.",
          category: "Brand Placement",
        },
        {
          title: "Direct Access to Student Engineering Resumes",
          description: "Direct talent pipeline to all electrical, computer, and mechanical engineers designing firmware and robotics hardware.",
          category: "Recruiting & Talent",
          highlight: true,
        },
        {
          title: "Dedicated Technical Tech-Talk & Recruiting Session",
          description: "Host an exclusive 1-hour presentation with IEEE UCF members on campus or virtually during the academic semester.",
          category: "Recruiting & Talent",
        },
        {
          title: "Recognition on Project GitHub & Showcase Posters",
          description: "Prominent acknowledgment across all open-source repositories, project documentation, and IEEE showcase display banners.",
          category: "Event & Community",
        },
      ],
    },
    participants: [
      {
        memberId: "mem-alex-rivera",
        name: "Alex Rivera",
        email: "arivera@knights.ucf.edu",
        major: "Computer Engineering",
        roleTitle: "Project Director & Firmware Lead",
      },
      {
        memberId: "mem-marcus-vance",
        name: "Marcus Vance",
        email: "mvance@knights.ucf.edu",
        major: "Mechanical Engineering",
        roleTitle: "Chassis & Aerodynamics Lead",
      },
      {
        memberId: "mem-elena-rostova",
        name: "Elena Rostova",
        email: "erostova@knights.ucf.edu",
        major: "Electrical Engineering",
        roleTitle: "Power Electronics & PCB Designer",
      },
      {
        memberId: "mem-jason-park",
        name: "Jason Park",
        email: "jpark@knights.ucf.edu",
        major: "Computer Science",
        roleTitle: "Navigation & Algorithms Engineer",
      },
    ],
  },
  {
    id: "proj-solar-esc-002",
    title: "IEEE Solar Knight Racing ESC",
    slug: "ieee-solar-knight-racing-esc",
    tagline: "400V high-efficiency silicon-carbide (SiC) motor inverter engineered for maximum efficiency solar endurance racing.",
    description: "The Solar Knight Electronic Speed Controller (ESC) is a custom three-phase inverter switching up to 400V DC bus voltages at 100A peak current with >98.5% electrical efficiency. Designed in collaboration with UCF Solar Car, it uses Silicon Carbide (SiC) MOSFETs, isolated gate drivers, and CAN bus telemetry.",
    category: "Power",
    status: "Active",
    repositoryUrl: "https://github.com/ieee-ucf/solar-knight-esc",
    demoUrl: "https://ieee.ucf.edu/projects/solar-esc",
    active: true,
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
      overview: "Support high-voltage power electronics research and race-ready student engineering at UCF.",
      benefits: [
        {
          title: "Branding on Solar Vehicle Exterior Body & Inverter Enclosure",
          description: "High-visibility company decal placed on the race vehicle side pod alongside the IEEE crest during the Formula Sun Grand Prix.",
          category: "Brand Placement",
          highlight: true,
        },
        {
          title: "Exclusive Recruiting Access to Power & Hardware Leads",
          description: "Fast-track your internships and full-time hiring with the students designing high-power electrical vehicle inverters.",
          category: "Recruiting & Talent",
          highlight: true,
        },
        {
          title: "Technical Case Study & Whitepaper Acknowledgment",
          description: "Named co-sponsor on published engineering reports and hardware design documentation.",
          category: "Event & Community",
        },
        {
          title: "Private Vehicle Demo Day & Track Testing Invitation",
          description: "VIP access to witness dynamometer testing and track days at the UCF engineering testing grounds.",
          category: "Event & Community",
        },
      ],
    },
    participants: [
      {
        memberId: "mem-elena-rostova",
        name: "Elena Rostova",
        email: "erostova@knights.ucf.edu",
        major: "Electrical Engineering",
        roleTitle: "Power Electronics Director",
      },
      {
        memberId: "mem-david-kim",
        name: "David Kim",
        email: "dkim@knights.ucf.edu",
        major: "Electrical Engineering",
        roleTitle: "DSP Firmware & Motor Control Specialist",
      },
      {
        memberId: "mem-alex-rivera",
        name: "Alex Rivera",
        email: "arivera@knights.ucf.edu",
        major: "Computer Engineering",
        roleTitle: "CAN Bus Telemetry Contributor",
      },
    ],
  },
  {
    id: "proj-quad-swarm-003",
    title: "IEEE Quadcopter Swarm",
    slug: "ieee-quadcopter-swarm",
    tagline: "Decentralized mesh-networking micro-UAVs coordinating autonomous formation flight and distributed SLAM mapping.",
    description: "The IEEE Quadcopter Swarm project develops low-cost autonomous micro aerial vehicles that communicate peer-to-peer over an ad-hoc 802.11s mesh network. The drones perform collaborative spatial exploration, vision-based obstacle avoidance using Google Coral Edge TPUs, and decentralized target tracking.",
    category: "Autonomous Systems",
    status: "Active",
    repositoryUrl: "https://github.com/ieee-ucf/quadcopter-swarm",
    active: true,
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
      overview: "Partner with autonomous aerial robotics researchers building cutting-edge decentralized vision algorithms.",
      benefits: [
        {
          title: "Branding on Swarm Drone Carbon Top Plates",
          description: "Company logo custom vinyl on all quadcopters in the autonomous swarm during public flight trials.",
          category: "Brand Placement",
          highlight: true,
        },
        {
          title: "Featured in IEEE Flight Demonstration Videos",
          description: "Logo watermark and closing sponsor acknowledgment in all video demonstrations shared on social media.",
          category: "Brand Placement",
        },
        {
          title: "Resume Book & Direct Interviews with Autonomy Team",
          description: "Curated portfolio and resume bundle of all computer vision and robotics students on the team.",
          category: "Recruiting & Talent",
          highlight: true,
        },
        {
          title: "Private Flight Demonstration for Your Company",
          description: "Exclusive live flight demonstration and engineering presentation hosted for your technical team.",
          category: "Event & Community",
        },
      ],
    },
    participants: [
      {
        memberId: "mem-samantha-lin",
        name: "Samantha Lin",
        email: "slin@knights.ucf.edu",
        major: "Computer Science",
        roleTitle: "Swarm Algorithms & Distributed Systems Lead",
      },
      {
        memberId: "mem-jason-park",
        name: "Jason Park",
        email: "jpark@knights.ucf.edu",
        major: "Computer Science",
        roleTitle: "Edge TPU Vision Engineer",
      },
      {
        memberId: "mem-alex-rivera",
        name: "Alex Rivera",
        email: "arivera@knights.ucf.edu",
        major: "Computer Engineering",
        roleTitle: "PX4 Firmware & Hardware Integrator",
      },
    ],
  },
  {
    id: "proj-iot-beacon-004",
    title: "IEEE Smart Campus IoT Beacon Network",
    slug: "ieee-smart-campus-iot-beacon-network",
    tagline: "Low-power Bluetooth 5.4 telemetry nodes with AES-256 encryption providing campus spatial analytics and event tracking.",
    description: "The Smart Campus IoT Beacon Network is a multi-node sensor mesh deployed across UCF engineering buildings. Featuring solar energy harvesting and coin-cell operation, each beacon broadcasts encrypted indoor environmental metrics, ambient noise levels, and room occupancy heatmaps to a central Next.js dashboard.",
    category: "IoT & Networking",
    status: "Active",
    repositoryUrl: "https://github.com/ieee-ucf/smart-campus-iot",
    active: true,
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
      overview: "Enable campus-wide environmental and spatial analytics deployed throughout UCF engineering facilities.",
      benefits: [
        {
          title: "Branding on Campus Beacon Enclosures",
          description: "Company logo engraved on all physical beacon enclosures mounted throughout UCF engineering corridors.",
          category: "Brand Placement",
          highlight: true,
        },
        {
          title: "Featured on Live Public Campus Web Dashboard",
          description: "Permanent corporate banner and hyperlink on the live sensor telemetry dashboard used by campus students and faculty.",
          category: "Brand Placement",
        },
        {
          title: "IoT & Cloud Engineering Talent Pipeline",
          description: "Access to student candidates specializing in ultra-low power firmware, Bluetooth protocol, and cloud timeseries data.",
          category: "Recruiting & Talent",
          highlight: true,
        },
      ],
    },
    participants: [
      {
        memberId: "mem-marcus-vance",
        name: "Marcus Vance",
        email: "mvance@knights.ucf.edu",
        major: "Mechanical Engineering",
        roleTitle: "IoT Enclosure & Deployment Lead",
      },
      {
        memberId: "mem-samantha-lin",
        name: "Samantha Lin",
        email: "slin@knights.ucf.edu",
        major: "Computer Science",
        roleTitle: "Cloud Telemetry & Database Architect",
      },
    ],
  },
  {
    id: "proj-pcb-badge-005",
    title: "IEEE PCB Design & Surface Mount Workshop Series",
    slug: "ieee-pcb-design-surface-mount-workshop",
    tagline: "Interactive electronic badges designed for semester workshops teaching 200+ students CAD layout and SMD soldering.",
    description: "This initiative designs and produces interactive, programmable electronic conference badges given to UCF engineering students. Each participant learns schematic design in KiCAD, trace routing, component selection, hands-on hot air/reflow soldering, and flashes their first custom firmware via USB-C.",
    category: "Hardware",
    status: "Active",
    repositoryUrl: "https://github.com/ieee-ucf/pcb-workshop-badge",
    active: true,
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
      overview: "Directly sponsor hands-on hardware engineering education for over 200 UCF engineering undergraduates each semester.",
      benefits: [
        {
          title: "Copper / Silkscreen Logo on 200+ Student Badges",
          description: "Your company logo permanently etched into copper or silkscreen on every student badge taken home by participants.",
          category: "Brand Placement",
          highlight: true,
        },
        {
          title: "In-Person Keynote & Opening Remarks at Workshops",
          description: "Send engineering representatives or recruiters to introduce your company at the beginning of soldering lab sessions.",
          category: "Recruiting & Talent",
          highlight: true,
        },
        {
          title: "Resume Packet of All Workshop Attendees",
          description: "Receive a compiled package of resumes from all attending students interested in hardware engineering.",
          category: "Recruiting & Talent",
        },
        {
          title: "Permanent Banner Placement in the IEEE Innovation Lab",
          description: "Company display banner stationed in the IEEE Innovation Lab (ENG2 135) for the entire academic year.",
          category: "Event & Community",
        },
      ],
    },
    participants: [
      {
        memberId: "mem-alex-rivera",
        name: "Alex Rivera",
        email: "arivera@knights.ucf.edu",
        major: "Computer Engineering",
        roleTitle: "Lead Badge Designer & Workshop Instructor",
      },
      {
        memberId: "mem-elena-rostova",
        name: "Elena Rostova",
        email: "erostova@knights.ucf.edu",
        major: "Electrical Engineering",
        roleTitle: "Lab Equipment & Safety Coordinator",
      },
    ],
  },
];
