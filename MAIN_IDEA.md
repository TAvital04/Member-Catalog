# IEEE UCF Member Resume Database & Catalog — Main Idea & System Architecture

## Executive Summary

The **IEEE UCF Member Resume Database** is an enterprise-grade, monorepo platform designed for the **Institute of Electrical and Electronics Engineers (IEEE) Student Chapter at the University of Central Florida (UCF)**. 

The primary mission of the platform is to **bridge the gap between UCF engineering talent and top tech/defense recruiters**, replacing static, single-page paper resumes with an interactive, verified digital portfolio catalog. It empowers recruiters and corporate sponsors to discover, evaluate, and recruit candidates based on concrete engineering evidence: hardware projects, open-source code repositories, corporate internship experience, IEEE chapter leadership, and event participation.

---

## 💡 The Core Problem & Solution

### The Challenge
- Traditional university career fairs rely on printed paper resumes that fail to demonstrate real-time project progress, hands-on hardware builds, or student leadership.
- Recruiters at defense primes (Lockheed Martin, L3Harris, Northrop Grumman) and semiconductor/cloud leaders (Texas Instruments, AWS, NVIDIA) struggle to efficiently filter hundreds of candidates by specialized technical skill combinations (e.g., *FreeRTOS + SystemVerilog + Altium Designer*).
- Student organizations lack a central source of truth linking member profiles with official chapter project build teams and event attendance histories.

### The Solution
The IEEE UCF Member Catalog provides a **unified, multi-faceted platform** with:
1. **Interactive Candidate Directory**: Instant multi-parameter filtering across majors, graduation years, skills, employers, and event attendance.
2. **IEEE Projects Hub (`/projects`)**: Official showcase for chapter engineering projects (*Autonomous Micromouse*, *Solar Knight Racing ESC*, *Quadcopter Swarm*, *Smart Campus IoT*, *PCB Workshop*) with live student rosters.
3. **Where Knights Work (`/where-knights-work`)**: Corporate placement analytics and employer filtering highlighting top defense, aerospace, and software organizations hiring UCF Knights.
4. **Officers & Staff Showcase (`/staff`)**: Dedicated leadership directory highlighting chapter executive board members, committee leads, and workshop directors.
5. **Alumni Showcase (`/alumni`)**: Career tracking for graduated IEEE Knights leading industry engineering teams.
6. **Live Profile Management & Sync**: Seamless submission form on the main website (`@ieee/website`) updating the candidate database in real-time.

---

## ⚡ Why This Is Far Superior to a Simple Array/Folder of PDF Resumes

Many student organizations simply share a Google Drive folder or static JSON array of 100+ PDF resumes with corporate sponsors. The **IEEE UCF Member Catalog** completely transforms this experience into a high-octane engineering recruitment engine:

| Capability | Static PDF Folder / Simple Array | IEEE UCF Member Catalog Platform |
| :--- | :--- | :--- |
| **Search & Discovery** | Manual opening and 1-by-1 document skimming. | **Sub-second multi-parameter filtering** (Combine Major + GPA + Skills + Employers + Events). |
| **Skill Intersection Engine** | Impossible to find candidates who possess *both* Hardware & Software skills. | **AND / OR Skill Logic**: Filter instantly for candidates with *C++ AND FreeRTOS AND Altium Designer*. |
| **Proof of Work & Verifiability** | Unverified text bullet points on paper. | **Direct IEEE Project & GitHub Linking**: Verified team rosters (*Micromouse*, *Solar Racing ESC*, *Quadcopter Swarm*). |
| **Event & Workshop Verification** | Candidate claims attendance verbally. | **Database Event Tracking**: Linked attendance logs (`event_attendees`) verifying hands-on lab participation. |
| **Data Freshness** | Static snapshot out of date the moment it's saved. | **Live Real-Time Sync**: Candidates update skills, GPA, and projects anytime via `@ieee/website` settings. |
| **Contextual Categorization** | Flat file list with zero organization. | **Dedicated Specialized Hubs**: Automatic indexing into `/projects`, `/where-knights-work`, `/staff`, and `/alumni`. |
| **Access Control & Moderation** | No permissions; anyone can edit/delete files. | **Role-Based Access (RBAC)**: Distinct Standard, Sponsor (flagging & shortlist), and Admin (duplicate resolution) modes. |
| **Recruiter Actionability** | Copy-pasting emails into separate mail apps. | **In-Platform Recruiter Outreach**: Direct email dispatch simulation, candidate flagging, and portfolio modal viewer. |

### 1. Eliminating "Resume Parsing Fatigue"
Opening 200 PDF files to find 5 candidates with embedded firmware and FPGA skills takes hours. In the Member Catalog, a recruiter clicks 3 filter chips (*Computer Engineering*, *FreeRTOS*, *Lockheed Martin*) and instantly narrows 250+ candidates down to the exact 4 candidates qualified for the role in under 2 seconds.

### 2. Verified Proof of Work Over Unverified Text Claims
Anyone can type "experienced in ROS2 and LiDAR" on a PDF. The Member Catalog connects candidate profiles directly to official chapter projects, git repositories, and workshop logs. Recruiters don't just read what a student *says* they can do — they inspect the actual code, hardware schematics, and team role (*Project Lead*, *PCB Layout Engineer*).

### 3. Contextual Intelligence Through Dedicated Hubs
Instead of forcing recruiters to scroll through a raw list, the platform automatically synthesizes data into actionable views:
- **Where Knights Work (`/where-knights-work`)**: Instantly see which candidates interning at NASA, L3Harris, or Texas Instruments are available for full-time conversion.
- **Officers & Staff (`/staff`)**: Isolate student leaders who possess proven organizational, communication, and project management skills.
- **Alumni Showcase (`/alumni`)**: Connect with past graduates leading engineering teams across industry.
- **Projects Hub (`/projects`)**: Discover candidates grouped by the exact hardware/software systems they built.

---

## 🏛️ Monorepo Architecture & Package Structure

The repository is structured as a pnpm workspace monorepo:

```
Member-Catalog/
├── apps/
│   ├── member-resume-database/  # Next.js 15 App — Main Recruiter Directory & Navigation Hubs
│   │   ├── app/                 # Routes: /, /projects, /where-knights-work, /staff, /alumni, /api/members
│   │   ├── components/          # Directory, Modal, Filter, and Layout components
│   │   ├── hooks/               # State hooks (useDirectoryFilters, useFilteredStudents, useStudentData)
│   │   └── __tests__/           # Jest unit test suite (10 test suites, 18 tests)
│   │
│   └── ieee-website/            # Next.js 15 App — Official Chapter Website & Resume Form
│       ├── src/app/             # Student dashboard, event calendar, settings (/settings)
│       ├── src/components/      # MemberResumeForm.tsx submission form
│       └── src/app/api/member/  # /api/member/resume submission handler
│
└── packages/
    ├── db/                      # Drizzle ORM Schema, PostgreSQL Client, & Seed Scripts
    │   └── src/                 # schema.ts, seed.ts, client.ts
    └── shared/                  # Shared TypeScript Types & Zod-style Form Validations
        └── src/                 # types.ts, validations.ts
```

---

## 🎯 Key Platform Features & Modules

### 1. Advanced Multi-Parametric Filter Engine
Recruiters can combine multiple filter dimensions with instant visual updates:
- **Major Filtering**: Computer Engineering, Computer Science, Electrical Engineering, Mechanical Engineering, Aerospace Engineering, Industrial Engineering, Physics, IT, Data Science.
- **Skill Tag Filter**: Over 50 technical tags (e.g., *C++, PyTorch, Altium Designer, Verilog, ROS2, AWS, Docker*). Supports both **ANY** (union) and **ALL** (intersection) matching modes.
- **Graduation Date Filter**: Filter by upcoming graduation semesters (e.g., *May 2025, May 2026*).
- **Event Attendance Filter**: Filter candidates by the technical workshops or general body meetings they attended (e.g., *Hands-On PCB Design & Altium Workshop*, *Embedded Linux & FreeRTOS Night*).
- **Corporate Employer Filter**: Filter candidates by past internship or co-op experience (e.g., *Lockheed Martin, NASA, L3Harris, Texas Instruments, Siemens, Electronic Arts*).

### 2. Verified IEEE Leadership & Project Badges
- **IEEE Leadership Badges**: Candidates holding chapter leadership positions display glowing leadership badges (`ShieldCheck` / `Award`) directly on their card and portfolio modal.
- **Primary IEEE Project Badges**: Members affiliated with official chapter build projects display cyan project tags (`FolderGit2`), linking their profile directly to the project team roster in the **Projects Hub**.

### 3. Role-Based Access & Moderation Control
The catalog adapts seamlessly across 3 access levels:
- 🟢 **Standard Role**: Read-only candidate exploration for general visitors.
- 🟡 **Sponsor Role**: Full filtering and corporate candidate flagging capabilities for corporate sponsors.
- 🔴 **Admin Role**: Complete administrative CRUD tools, candidate flagging, duplicate profile detection & merging, and moderation resolution dialogs.

### 4. Interactive Portfolio Modals
Clicking any candidate card opens a rich glassmorphic portfolio modal featuring:
- High-level academic overview (Degree, Major, GPA, Scale, Graduation Date).
- Full bio and elevator pitch.
- Interactive tabbed sections: **Work Experience**, **Key Projects**, **Education**, **Clubs & IEEE Roles**, **Certifications**, and **Events Attended**.
- PDF Resume viewer modal with direct Google Drive / PDF links.
- Recruiter contact form simulating direct message outreach.

---

## 🗄️ Database Schema & Data Flow

The backend relies on **PostgreSQL** managed via **Drizzle ORM** with 6 primary tables:

1. `members`: Core chapter member record (`id`, `email`, `name`, `major`, `graduation_year`).
2. `member_resumes`: Rich candidate resume profile (`member_id`, `status`, `bio`, `resume_pdf_url`, `social_links`, `education`, `skills`, `work_experience`, `projects`, `club_memberships`, `certifications`, `main_project_name`, `flagged`).
3. `ieee_projects`: Official IEEE project catalog (`id`, `title`, `slug`, `category`, `status`, `repository_url`).
4. `project_participants`: Link table connecting members to project teams (`project_id`, `member_id`, `role_title`).
5. `events`: IEEE chapter events and workshops (`id`, `title`, `location`, `slug`, `start_time`).
6. `event_attendees`: Link table tracking member event participation (`event_id`, `member_id`).

---

## 🚀 Quality Assurance & Engineering Standards

- **Strict Type Safety**: 100% clean compilation via `tsc --noEmit` across all apps and packages.
- **Automated Test Coverage**: 10 Jest unit test suites covering API routes, filtering logic, moderation flows, privacy controls, and component rendering.
- **Clean UI Aesthetic**: Industrial dark-mode styling utilizing zinc-955 surfaces, amber and cyan technical accents, and responsive layout math.
