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
      { platformName: "Portfolio", profileUrl: "https://arivera.dev" },
      { platformName: "Devpost", profileUrl: "https://devpost.com/arivera" }
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
        description: "Burnett Honors College Scholar. Relevant Coursework: Computer Architecture, Embedded Systems, Real-Time Operating Systems, VLSI Design, Digital Signal Processing."
      },
      {
        schoolName: "University of Central Florida",
        degreeType: "Minor",
        major: "Mathematics",
        gpa: 4.0,
        gpaScale: 4.0,
        startDate: "2023-01-10",
        endDate: "2026-05-02",
        isCurrent: true,
        description: "Focus on Linear Algebra, Matrix Analytics, and Discrete Mathematics."
      }
    ],
    skills: [
      "C++", "C", "FreeRTOS", "Embedded Linux", "Verilog", "ARM Cortex-M", "Python", "Rust", "FPGA", "Altium Designer", "Linux Kernel", "STM32", "Git", "CMake", "GDB", "DSP", "I2C/SPI/UART", "CAN Bus"
    ],
    workExperience: [
      {
        companyName: "Lockheed Martin",
        jobTitle: "Flight Software Engineering Co-Op",
        startDate: "2024-05-15",
        endDate: "2024-12-20",
        isCurrentJob: false,
        description: "Developed C++ real-time flight simulation software module for missile defense telemetry. Automated hardware-in-the-loop (HIL) test suites with Python and PyTest, reducing regression testing time by 45%."
      },
      {
        companyName: "UCF Department of ECE",
        jobTitle: "Undergraduate Embedded Systems Research Assistant",
        startDate: "2023-08-20",
        endDate: "2024-05-01",
        isCurrentJob: false,
        description: "Designed custom 4-layer PCB in Altium Designer for ultra-low-power wireless sensor nodes running FreeRTOS on STM32 microcontrollers."
      }
    ],
    projects: [
      {
        projectName: "KnightRover Autonomous LiDAR Navigation",
        description: "Built custom autonomous rover platform using ROS2, C++, and 2D LiDAR SLAM navigation on an NVIDIA Jetson Orin Nano.",
        startDate: "2024-01-15",
        endDate: "2024-11-30",
        isOngoing: false,
        projectLinks: ["https://github.com/arivera-ucf/knight-rover", "https://arivera.dev/projects/rover"]
      },
      {
        projectName: "FPGA Neural Network Matrix Multiplier",
        description: "Synthesized 8-bit quantized matrix multiplication accelerator on Xilinx Artix-7 FPGA achieving 4.2 GOPS with 1.2W power envelope.",
        startDate: "2024-09-01",
        endDate: "2024-12-15",
        isOngoing: false,
        projectLinks: ["https://github.com/arivera-ucf/fpga-nn-accel"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "Hardware Committee Chair",
        startDate: "2022-09-01",
        endDate: "2025-05-01",
        isActive: true,
        description: "Led weekly hands-on PCB design and soldering workshops for 60+ engineering members. Managed lab equipment budget."
      },
      {
        clubName: "Knights Racing FSAE Formula Electric",
        roleTitle: "Battery Management System (BMS) Lead",
        startDate: "2023-08-25",
        endDate: "2025-05-01",
        isActive: true,
        description: "Designed 400V accumulator monitoring board and CAN communication firmware for UCF Formula Electric race car."
      }
    ],
    certifications: [
      {
        certificationName: "CompTIA Security+ CE",
        issuer: "CompTIA",
        issueDate: "2023-06-12",
        expirationDate: "2026-06-12",
        credentialId: "COMP001029384",
        credentialUrl: "https://www.credly.com/badges/comptia-secplus-alex-rivera"
      },
      {
        certificationName: "FE Electrical and Computer Exam (Passed)",
        issuer: "NCEES",
        issueDate: "2024-10-05",
        credentialId: "NCEES-FE-983021"
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
      { platformName: "GitHub", profileUrl: "https://github.com/slin-code" },
      { platformName: "Portfolio", profileUrl: "https://samanthalin.io" }
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
        description: "Dean's List 7 Consecutive Semesters. Coursework: Operating Systems, Database Systems, Algorithm Analysis, Distributed Systems, Web Engineering."
      }
    ],
    skills: [
      "TypeScript", "Go", "Python", "Java", "Next.js", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS (EC2, S3, Lambda, DynamoDB)", "GraphQL", "gRPC", "Tailwind CSS", "React", "Kafka", "CI/CD (GitHub Actions)", "Terraform"
    ],
    workExperience: [
      {
        companyName: "Amazon Web Services (AWS)",
        jobTitle: "Software Development Engineer Intern",
        startDate: "2024-05-20",
        endDate: "2024-08-16",
        isCurrentJob: false,
        description: "Architected distributed metric ingestion pipeline in Go and AWS DynamoDB processing 15,000 requests/sec with p99 latency under 25ms. Integrated automated Canary monitoring alarms."
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
        projectName: "Distributed Key-Value Store with Raft Consensus",
        description: "Implemented fault-tolerant distributed key-value database in Go implementing Raft consensus protocol with log compaction and snapshots.",
        startDate: "2024-02-01",
        endDate: "2024-05-01",
        isOngoing: false,
        projectLinks: ["https://github.com/slin-code/raft-kv-go"]
      },
      {
        projectName: "IEEE UCF Member Catalog & Event Hub",
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
      },
      {
        clubName: "Hack@UCF (Cyber Security Club)",
        roleTitle: "Active CTF Competitor",
        startDate: "2021-09-01",
        endDate: "2025-05-01",
        isActive: true,
        description: "Competed in national Capture-the-Flag competitions focusing on web exploitation and cryptography."
      }
    ],
    certifications: [
      {
        certificationName: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        issueDate: "2023-09-15",
        expirationDate: "2026-09-15",
        credentialId: "AWS-ASA-9940129",
        credentialUrl: "https://www.credly.com/badges/aws-solutions-architect-samantha-lin"
      },
      {
        certificationName: "Certified Kubernetes Administrator (CKA)",
        issuer: "The Linux Foundation",
        issueDate: "2024-02-10",
        expirationDate: "2027-02-10",
        credentialId: "LF-CKA-88301"
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
      { platformName: "LinkedIn", profileUrl: "https://linkedin.com/in/marcus-vance-ee" },
      { platformName: "GitHub", profileUrl: "https://github.com/mvance-ee" }
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
        description: "Coursework: Linear Circuits II, Microcontrollers, Semiconductor Devices, Power Electronics, RF & Microwave Circuits, Electromagnetics."
      }
    ],
    skills: [
      "Altium Designer", "SPICE Simulation (LTspice)", "MATLAB/Simulink", "C", "Power Electronics", "PCB Layout & Fabrication", "Oscilloscopes & Spectrum Analyzers", "RF Circuit Design", "Buck/Boost Converter Design", "Eagle CAD", "LabVIEW", "Python"
    ],
    workExperience: [
      {
        companyName: "Siemens Energy",
        jobTitle: "Power Systems Engineering Intern",
        startDate: "2024-05-13",
        endDate: "2024-08-23",
        isCurrentJob: false,
        description: "Analyzed 3-phase grid transformer harmonic distortion using MATLAB/Simulink models. Conducted high-voltage surge testing on power converter prototype modules."
      }
    ],
    projects: [
      {
        projectName: "High-Efficiency 100W Synchronous Buck-Boost Converter",
        description: "Designed and populated 4-layer custom PCB buck-boost power converter delivering 96.4% peak efficiency at 24V input in Altium Designer.",
        startDate: "2024-08-25",
        endDate: "2024-12-10",
        isOngoing: false,
        projectLinks: ["https://github.com/mvance-ee/buck-boost-converter"]
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
    certifications: [
      {
        certificationName: "IPC-J-STD-001 Soldering Certification",
        issuer: "IPC",
        issueDate: "2023-03-10",
        expirationDate: "2025-03-10"
      }
    ]
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
      { platformName: "GitHub", profileUrl: "https://github.com/erostova-ml" },
      { platformName: "Portfolio", profileUrl: "https://elenarostova.ai" }
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
      "PyTorch", "Python", "OpenCV", "TensorFlow", "CUDA", "TensorRT", "C++", "Scikit-Learn", "FastAPI", "Docker", "ONNX", "Hugging Face Transformers", "Git", "NumPy/Pandas", "Weights & Biases"
    ],
    workExperience: [
      {
        companyName: "UCF CRCV (Center for Research in Computer Vision)",
        jobTitle: "Lead Computer Vision Research Assistant",
        startDate: "2023-01-15",
        endDate: "2025-05-01",
        isCurrentJob: true,
        description: "Trained zero-shot object detection Vision-Language Models (VLM) for autonomous aerial drone surveillance datasets with PyTorch and CUDA multi-GPU clusters."
      },
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
        projectName: "Edge-AI Thermal Camera Anomaly Detection",
        description: "Deployed lightweight MobileNet-V3 thermal anomaly detection model to Raspberry Pi 4 with Coral Edge TPU achieving 45 FPS inference speed.",
        startDate: "2024-01-10",
        endDate: "2024-05-01",
        isOngoing: false,
        projectLinks: ["https://github.com/erostova-ml/edge-thermal-ai"]
      }
    ],
    clubMemberships: [
      {
        clubName: "IEEE UCF Student Chapter",
        roleTitle: "AI & Machine Learning Special Interest Group Lead",
        startDate: "2022-09-01",
        endDate: "2025-05-01",
        isActive: true,
        description: "Hosted 8-week PyTorch & Deep Learning bootcamps for 120+ student participants."
      }
    ],
    certifications: [
      {
        certificationName: "NVIDIA Certified Associate – AI in Data Center",
        issuer: "NVIDIA",
        issueDate: "2023-11-20",
        credentialId: "NVIDIA-AI-883012"
      }
    ]
  }
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
    `);

    console.log('Clearing existing records...');
    await pool.query('TRUNCATE TABLE event_attendees, events, member_resumes, members CASCADE;');

    console.log(`Seeding ${DENSE_CANDIDATES.length} dense candidate profiles...`);
    const createdMemberIds: string[] = [];

    for (const candidate of DENSE_CANDIDATES) {
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
          club_memberships, certifications, flagged, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, false, NOW(), NOW()
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
      ]);

      console.log(`  ✓ Successfully seeded candidate: ${candidate.name} (${candidate.email}) [ID: ${memberId}]`);
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

