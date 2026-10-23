# Sponsor ROI & Talent Scout Analytics — Concept & Specification

> **Document Status**: Archived / Future Roadmap Specification  
> **Location**: Root repository reference (`ROI_PAGE.md`)  
> **Source Origin**: `src/app/sponsor-roi/`  
> **Context**: This document captures all architectural concepts, user stories, analytical metrics, recruiting telemetry funnels, and data model prerequisites for the **Sponsor Recruitment & Talent ROI Dashboard**. The page was deferred from active production because the underlying tracking events (impressions, modal clicks, direct recruiter inquiries, resume bundle downloads) are not yet wired to a live backend analytics store.

---

## 1. Executive Summary & Purpose

The **Sponsor ROI Dashboard** is conceived as a high-value portal for corporate sponsors (e.g., defense primes like Lockheed Martin, L3Harris, Northrop Grumman, and tech innovators like Texas Instruments, AWS, NVIDIA) and chapter leadership.

### Primary Goals
1. **Demonstrate Measurable Sponsorship Value**: Give corporate partners quantitative proof of their sponsorship investment by showing how many UCF engineering candidates they reached, evaluated, and engaged.
2. **Talent Pipeline Telemetry**: Provide real-time conversion metrics from raw catalog impressions down to direct recruiter contact and resume packet exports.
3. **Skill & Workforce Intelligence**: Expose real-time technical skill density across the student member pool to help sponsors plan hiring targets and identify niche competencies (e.g., *FreeRTOS*, *FPGA / Verilog*, *Altium Designer*, *ROS2*).
4. **Project Sponsorship Attribution**: Connect corporate sponsorship tiers directly to active IEEE engineering teams (*Autonomous Micromouse*, *Solar Knight Racing ESC*, *Swarm Robotics*, *Smart Campus IoT*), demonstrating direct educational impact.

---

## 2. Key Metrics & KPI Architecture

The dashboard design incorporates four primary KPI cards, updated on a per-term or academic-year cadence:

| KPI Card | Metric Description | Value Calculation / Source | Target Audience Value |
| :--- | :--- | :--- | :--- |
| **Candidate Pool Size** | Total active candidates and College of Engineering & Computer Science (CECS) count | Calculated from active students with approved FERPA consent in `@ieee/db` | Gives corporate recruiters visibility into the scale of available UCF talent |
| **Scouting Impressions** | Total candidate profile impressions and search result views | Incremented when a candidate card appears in viewport during search/filter queries | Measures platform engagement and visibility for sponsors evaluating reach |
| **Direct Recruiter Inquiries** | Number of recruiter-to-candidate outreach emails sent through the platform | Logged whenever a sponsor sends an email inquiry via `/api/send-email` | Proves actionable recruiter conversion and response rates (e.g. 91% response rate) |
| **Sponsored Project Teams** | Count of active engineering projects funded by corporate tiers | Linked to IEEE chapter project teams (`SAMPLE_IEEE_PROJECTS` / DB project table) | Connects corporate philanthropy directly to hands-on engineering student rosters |

---

## 3. Talent Scout Conversion Funnel

The dashboard visualizes a 4-stage recruitment conversion funnel that tracks recruiter actions through the hiring journey:

```
[ Stage 1: Directory Impressions & Filter Searches ]
  │  └─ Example: 1,280 views (100% baseline)
  │     Logged when recruiters filter by major, graduation year, or hardware/software skills.
  ▼
[ Stage 2: Portfolio Modal Detailed Inspections ]
  │  └─ Example: 412 candidates (32.2% drop-off)
  │     Triggered when a recruiter clicks into a student's card to review GitHub links, project roles, & coursework.
  ▼
[ Stage 3: Direct Resume & GitHub Code Audits ]
  │  └─ Example: 188 verifications (14.7% drop-off)
  │     Triggered when a recruiter clicks external links (student GitHub repo, personal site, PDF resume preview).
  ▼
[ Stage 4: Interview Inquiries & Recruiter Outreach ]
     └─ Example: 47 connections (3.7% conversion)
        Final conversion: direct recruiter contact dispatches, interview invites, or resume packet batch exports.
```

### Funnel Requirements for Future Implementation
To render this funnel dynamically without hardcoded values, the system must log tracking events to an analytics table or event queue:
- `CATALOG_SEARCH_QUERY`: Logged on debounce of search/filter actions.
- `STUDENT_MODAL_VIEWED`: Logged when `PortfolioModal` opens.
- `STUDENT_EXTERNAL_LINK_CLICKED`: Logged when GitHub, LinkedIn, or Resume URL is clicked.
- `RECRUITER_INQUIRY_SENT`: Logged on successful POST to `/api/send-email`.

---

## 4. Technical Skill Density & Market Alignment

The dashboard includes a **High-Demand Technical Skill Density** module:
- Aggregates the top technical skills tagged on student profiles (e.g., C++, Embedded Systems, FreeRTOS, Python, Altium Designer, ROS2, Verilog / FPGA, KiCAD).
- Displays the absolute count and percentage of candidates possessing each skill.
- Highlights intersections between embedded hardware design and firmware/software programming, catering to local Central Florida defense and robotics industries.

---

## 5. Chapter Engineering Project ROI

Connecting recruitment to student projects is the central differentiator of the IEEE UCF catalog:
- Displays cards for top chapter build teams (*Autonomous Micromouse*, *Solar Knight Racing ESC*, *Quadcopter Swarm*).
- Shows:
  - Technical category (*Autonomous Systems*, *Power Electronics*, *Robotics*).
  - Count of active student engineers contributing to the build.
  - Corporate sponsor attribution tier (e.g., *Tier 1 Gold Partner*, *Lab Equipment Grantor*).
  - Direct deep link to `/projects` for deep-dive technical review.

---

## 6. Corporate Recruiter Action Items & Features

The dashboard wireframe included key recruiter utilities:
1. **Resume Packet Export (PDF Bundle)**:
   - A single-click button: `Export Resume Packet`.
   - Intended to generate a merged, formatted PDF compilation containing all active candidate resumes matching the sponsor's criteria (or the entire active member catalog).
2. **Sponsor Tier Segmentation**:
   - Tier switcher tabs (*Silver*, *Gold*, *Platinum*).
   - Allows chapter officers to demonstrate differentiated access (e.g., Platinum gets direct phone/email batch exports, Silver gets search directory access).
3. **Quick Navigation**:
   - Instant toggle back to the main candidate directory with pre-filtered sponsor views.

---

## 7. Data Gathering Gaps & Implementation Roadmap

The reason this page was archived is that the data was mocked or partially estimated rather than backed by real tracking pipelines. To reinstate the Sponsor ROI page in the future, the following backend infrastructure must be built:

### Required Database Tables (`packages/db/src/schema.ts`)

```typescript
// Proposed schema for recruiter telemetry and analytics

export const recruiterTelemetryEvents = pgTable('recruiter_telemetry_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  sponsorId: uuid('sponsor_id'), // Linked to verified sponsor account
  eventType: text('event_type').notNull(), // 'impression' | 'modal_view' | 'resume_download' | 'github_click' | 'inquiry_sent'
  candidateId: text('candidate_id'), // Optional target student ID
  metadata: jsonb('metadata'), // Filter criteria, search tags, timestamp
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const corporateSponsors = pgTable('corporate_sponsors', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: text('company_name').notNull(),
  tier: text('tier').notNull(), // 'bronze' | 'silver' | 'gold' | 'platinum'
  logoUrl: text('logo_url'),
  contactEmail: text('contact_email').notNull(),
  allowedExportsPerTerm: integer('allowed_exports_per_term').default(10),
  activeStatus: boolean('active_status').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const resumePacketExports = pgTable('resume_packet_exports', {
  id: uuid('id').defaultRandom().primaryKey(),
  sponsorId: uuid('sponsor_id').references(() => corporateSponsors.id),
  filterSnapshot: jsonb('filter_snapshot').notNull(),
  candidateCount: integer('candidate_count').notNull(),
  downloadUrl: text('download_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Required API Endpoints
1. `POST /api/telemetry/track`: Light-weight beacon endpoint to record impressions and clicks.
2. `GET /api/analytics/sponsor-roi`: Aggregated endpoint computing the 4 KPI cards, funnel drop-off percentages, and skill distributions.
3. `POST /api/export/resume-packet`: Background worker generating combined candidate PDF booklets for verified sponsors.

---

## 8. Summary Checklist for Reviving This Feature

When IEEE UCF is ready to reactivate the Sponsor ROI page:
- [ ] Implement `recruiter_telemetry_events` table in PostgreSQL / Drizzle.
- [ ] Add event firing hooks to `DirectoryTable`, `StudentCard`, `PortfolioModal`, and external link components.
- [ ] Implement sponsor authentication and verify corporate domains.
- [ ] Wire the PDF packet generator using `@react-pdf/renderer` or `pdf-lib`.
- [ ] Re-create `src/app/sponsor-roi/page.tsx` connected to live telemetry APIs.
