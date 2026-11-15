# IEEE UCF Member Catalog — Role-Based Access & Sequential Form Implementation Plan (`ROLES.md`)

## 1. Classic Database Architecture: Standard PostgreSQL (`node-postgres`)

To support role authentication, candidate directory filtering, and structured creation forms across the platform, this project standardizes on **classic PostgreSQL** connected via the traditional **`node-postgres` (`pg.Pool`)** TCP driver and Drizzle ORM—without serverless HTTP wrappers or proprietary edge extensions.

### Why Classic PostgreSQL Fits Best
- **Battle-Tested & Universally Supported**: Originating in 1986 (and SQL-standardized in 1996), PostgreSQL is the gold standard of open-source relational databases, supported by every Linux server, Docker container, VM host, and classic SQL client (`psql`, `pgAdmin`, `DBeaver`).
- **Strict Relational Integrity**: Enforces foreign keys (`ON DELETE CASCADE`), `UNIQUE` join constraints (`event_attendees`, `project_participants`, `job_applications`), and ACID transactions.
- **Modern Ergonomics Without feeling Dated**: Native `JSONB` columns cleanly store structured form arrays (project milestone timelines, hardware tools, sponsorship initiatives, and job requirement bullet lists) alongside traditional `VARCHAR`, `TEXT`, `BOOLEAN`, and `TIMESTAMPTZ` columns.

---

## 2. Portal Roles & Permission Matrix

The Member Catalog defines two authenticated roles accessible via [`/login`](../src/app/login/page.tsx), plus an unauthenticated guest browsing tier:

| Role Identifier | Display Name | Who Uses It | Form & Management Permissions |
| :--- | :--- | :--- | :--- |
| `rso_leadership` *(maps to `admin`)* | **RSO Leadership** | IEEE UCF Executive Board, Project Leads, Workshop Directors | • **Form 1**: Onboard Chapter Sponsors & provision Sponsor logins<br>• **Form 2**: Create Events / Workshops & record Member Attendance<br>• **Form 3**: Create Chapter Projects & assign Project Team / Leads<br>• Full candidate directory access, list view, and profile deletion |
| `sponsor` | **Corporate Sponsor** | Official Corporate Partners & University Recruiters | • **Form 4**: Create & manage Corporate Job Postings<br>• **Form 5**: Manage Company Sponsorship Initiatives & Partner Profile<br>• Multi-parametric candidate filtering (Major, Skills, Graduation, Projects, Events)<br>• View FERPA-consented GPA & applicant analytics |
| `standard` *(unauthenticated)* | **Guest / Member** | UCF Students & General Visitors | • Browse candidate directory by name<br>• Browse chapter projects, workshops, and sponsors<br>• Apply to open jobs via the existing 1-Click Portfolio Application form |

### Supporting PostgreSQL Schema Additions (`src/db/schema.ts`)

```sql
-- 1. Authenticated Portal Users (RSO Leadership & Corporate Sponsors)
CREATE TABLE portal_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('rso_leadership', 'sponsor')),
  display_name VARCHAR(150) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  sponsor_id VARCHAR(64), -- Links Sponsor users directly to their chapter_sponsors record
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Chapter Sponsors Table (Persisting /sponsors tab data in PostgreSQL)
CREATE TABLE chapter_sponsors (
  id VARCHAR(64) PRIMARY KEY, -- e.g. 'lockheed-martin', 'texas-instruments'
  name VARCHAR(255) NOT NULL UNIQUE,
  short_name VARCHAR(100) NOT NULL,
  tier VARCHAR(50) NOT NULL DEFAULT 'Gold', -- 'Platinum' | 'Gold' | 'Silver'
  logo_text VARCHAR(16) NOT NULL,
  tagline VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  website VARCHAR(500) NOT NULL,
  careers_url VARCHAR(500) NOT NULL,
  partner_since VARCHAR(16) NOT NULL,
  location VARCHAR(255) NOT NULL,
  primary_focus JSONB NOT NULL DEFAULT '[]'::jsonb, -- string[]
  initiatives JSONB NOT NULL DEFAULT '[]'::jsonb,   -- SponsorInitiative[]
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 3. Recommended Form Implementation Order (One by One)

> **UI Standard for All Forms**: Every dropdown/select field across Forms 1–5 MUST use the themed [`CustomDropdown`](../src/components/common/CustomDropdown.tsx) component (`@/components/common/CustomDropdown`) instead of native browser `<select>` elements.

The five forms below are ordered by **data dependency**—so each form creates the foundational records and lookup options needed by the next form in the sequence:

```
[Form 1: Sponsor Onboarding]
       │  (creates partner organizations & sponsor accounts)
       ▼
[Form 2: Event + Attendance Roster]
       │  (awards verified skills & points to student profiles; links to sponsors)
       ▼
[Form 3: Project + Team Roster]
       │  (assigns project leads/members & links sponsored hardware builds)
       ▼
[Form 4: Sponsor Job Posting]
       │  (matches against student skills & projects populated in Forms 2 & 3)
       ▼
[Form 5: Sponsor Initiatives & Profile]
          (self-service partner showcase & grant metrics on /sponsors)
```

---

### Form 1 (Implement First): RSO Leadership — Onboard Chapter Sponsor Form
**Role**: `rso_leadership` (`role === "admin"`)  
**Where It Lives**: [`/sponsors`](../src/app/sponsors/page.tsx) (**"+ Add Chapter Sponsor"** button visible to RSO Leadership)  
**Component Target**: `src/components/forms/LeadershipSponsorForm.tsx`

#### Why Implement This First
Every other part of the catalog references corporate partners: **Events** have a `partner` host, **Projects** have `Current Sponsors`, and **Job Postings** belong to a Sponsor company. Onboarding Sponsors first establishes the canonical list of partner organizations in PostgreSQL and provisions their `sponsor` login credentials.

#### Fields & Mapping (`chapter_sponsors` + `portal_users`)
| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Company Name** | Text input | `chapter_sponsors.name` | Required, unique (e.g., *Raytheon Technologies*) |
| **Partnership Tier** | Select (`Platinum`, `Gold`, `Silver`) | `tier` | Required |
| **Short Engineering Tagline** | Text input | `tagline` | Required, 10–160 chars |
| **Corporate Website URL** | URL input | `website` | Required, valid `https://` URL |
| **Careers Portal URL** | URL input | `careers_url` | Required, valid `https://` URL |
| **Sponsor Login Email & Temp Password** | Email + Password inputs | `portal_users.email`, `password_hash` | Creates linked `sponsor` login account |

- **API Route**: `POST /api/sponsors` (requires `x-user-role: admin`). Runs a PostgreSQL transaction inserting into `chapter_sponsors` and `portal_users`.

---

### Form 2 (Implement Second): RSO Leadership — Create Event & Attendance Roster Form
**Role**: `rso_leadership` (`role === "admin"`)  
**Where It Lives**: [`/events`](../src/app/events/page.tsx) (**"+ Create Event / Workshop"** button + **"Manage Attendance"** inside `EventModal`)  
**Component Target**: `src/components/forms/LeadershipEventForm.tsx`

#### Why Implement This Second
Because manual student profile input is deprecated, **Events are the primary source of candidate skills and chapter activity points** (see [`src/app/api/members/route.ts`](../src/app/api/members/route.ts)). Implementing Event creation alongside an **Attendance Roster selector** immediately allows RSO Leadership to credit members with workshop skills and points, while linking industry tech talks to the Sponsors created in Form 1.

#### Fields & Mapping (`events` + `event_attendees`)
| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Event Title** | Text input | `events.title` | Required, 5–150 chars |
| **Category** | Select (`Technical Workshop`, `Industry Tech Talk`, `General Body Meeting`, `Competition & Hackathon`, `Career & Networking`, `Special Event & Tour`) | `events.category` | Required |
| **Location / Lab Room** | Text input | `events.location` | Required (e.g., *HEC 101* or *TI Innovation Lab*) |
| **Start & End Date/Time** | Datetime pickers | `start_time`, `end_time` | Required; `end_time > start_time` |
| **Description & Abstract** | Textarea | `events.description` | Required, min 25 chars |
| **Corporate Partner Host** | Select dropdown (populated from `chapter_sponsors`) | `events.partner` | Optional |
| **Skills Awarded to Attendees** | Multi-tag skill input | `events.skills` (`jsonb`) | Automatically added to every attending student's portfolio |
| **Chapter Points Awarded** | Number input | `events.points_awarded` | Defaults to `15` points |
| **RSVP Link & Requires Dues** | URL input + Checkbox | `rsvp_link`, `requires_dues` | Optional |
| **Attending Members Roster** | Searchable multi-select of `members` (or CSV email paste) | `event_attendees (event_id, member_id)` | Inserts join rows into `event_attendees` |

- **API Route**: `POST /api/events` & `PUT /api/events/[id]/attendees` (requires `x-user-role: admin`). Inserts the event and bulk-upserts `event_attendees` rows in a single PostgreSQL transaction.

---

### Form 3 (Implement Third): RSO Leadership — Create Project & Team Roster Form
**Role**: `rso_leadership` (`role === "admin"`)  
**Where It Lives**: [`/projects`](../src/app/projects/page.tsx) (**"+ New Chapter Project"** button)  
**Component Target**: `src/components/forms/LeadershipProjectForm.tsx`

#### Why Implement This Third
Projects are the second major pillar of candidate portfolios and point calculations (`projectLeadPoints` and `universityProjectPoints`). Implementing this right after Form 2 lets you reuse the **Member Roster Selector** component (to assign `Project Lead` vs `Team Member` in `project_participants`) and the **Sponsor Selector** (from Form 1), while introducing structured `JSONB` list builders for project milestones and tools.

#### Fields & Mapping (`ieee_projects` + `project_participants`)
| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Project Title & Slug** | Text inputs (slug auto-generated) | `title`, `slug` | Required, unique slug |
| **Category** | Select (`Robotics & Controls`, `Hardware & Silicon`, `Aerospace & Embedded`, `IoT & Infrastructure`) | `category` | Required |
| **Status** | Select (`Active`, `In Development`, `Completed`) | `status` | Required, defaults to `Active` |
| **Short Tagline** | Text input | `tagline` | Required, 10–200 chars |
| **Technical Overview** | Textarea | `description` | Required, min 40 chars |
| **GitHub Repo & Project Website** | URL inputs | `repository_url`, `demo_url` | Optional, valid `https://` URLs |
| **Skills Taught** | Multi-tag skill input | `skills_taught` (`jsonb`) | At least 1 engineering skill |
| **Hardware & Software Tools** | Dynamic row builder (`name`, `category`) | `tools` (`jsonb`) | Optional array of tool objects |
| **Milestone Timeline** | Dynamic row builder (`date`, `title`, `description`, `status`) | `timeline` (`jsonb`) | At least 1 milestone entry |
| **Sponsorship Funding & Needs** | Number + text inputs (`fundingGoal`, `currentFunding`, `needsDescription`) | `sponsorship_info` (`jsonb`) | Optional |
| **Project Team & Leads Roster** | Searchable member selector with role (`Project Lead` or `Team Member`) | `project_participants (project_id, member_id, role_title)` | Inserts team roster rows into `project_participants` |

- **API Route**: `POST /api/projects` (requires `x-user-role: admin`). Inserts the project into `ieee_projects` and links selected students in `project_participants`.

---

### Form 4 (Implement Fourth): Sponsor — Create Job Posting Form
**Role**: `sponsor` (`role === "sponsor"`, also accessible to `rso_leadership`)  
**Where It Lives**: [`/jobs`](../src/app/jobs/page.tsx) (Employer Portal **"+ Post New Opportunity"** button, upgrading [`QuickJobPostModal.tsx`](../src/components/modal/job/QuickJobPostModal.tsx))  
**Component Target**: `src/components/forms/SponsorJobPostingForm.tsx`

#### Why Implement This Fourth
Once Sponsors are onboarded (Form 1) and Students have verified skills and project portfolios from Events (Form 2) and Projects (Form 3), Sponsors log in to post internships and full-time roles that match against those student skills. Because `QuickJobPostModal.tsx` and `POST /api/jobs` already exist as a foundation, upgrading this form is fast: we lock it to authenticated `sponsor` sessions, auto-fill the Sponsor's company name and recruiter email from `session`, and add clean bullet-list builders for `responsibilities`, `requirements`, and `benefits`.

#### Fields & Mapping (`job_postings`)
| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Job Title** | Text input | `title` | Required, 5–120 chars |
| **Company Name** | Read-only / Pre-filled from Sponsor `session.organization` | `company_name` | Required |
| **Department / Division** | Text input | `department` | Optional (e.g., *High Voltage Power Solutions*) |
| **Location & Work Arrangement** | Text input + Select (`On-site`, `Hybrid`, `Remote`) | `location`, `location_type` | Required |
| **Employment & Experience Level** | Selects (`Internship`, `Full-time`, `Co-op` / `Entry Level`, etc.) | `employment_type`, `experience_level` | Required |
| **Compensation / Salary Range** | Text input | `salary_range` | Optional (e.g., *\$28 - \$34 / hr* or *\$88,000 - \$105,000 / yr*) |
| **Role Overview** | Textarea | `description` | Required, min 30 chars |
| **Key Responsibilities** | Dynamic bullet list builder | `responsibilities` (`jsonb`) | At least 1 bullet item |
| **Qualifications & Requirements** | Dynamic bullet list builder | `requirements` (`jsonb`) | At least 1 bullet item |
| **Benefits & Perks** | Dynamic bullet list builder | `benefits` (`jsonb`) | Optional bullet items |
| **Required Technical Skills** | Multi-tag skill selector | `skills_required` (`jsonb`) | At least 1 skill tag (powers candidate skill-match scoring) |
| **Recruiter Contact Email & Website** | Pre-filled email + URL input | `employer_email`, `employer_website` | Required valid email |

- **API Route**: `POST /api/jobs` (requires `x-user-role: sponsor` or `admin`). Inserts the job into `job_postings` and links it to the Sponsor's company profile on `/sponsors`.

---

### Form 5 (Implement Fifth): Sponsor — Manage Sponsorship Initiatives & Profile Form
**Role**: `sponsor` (`role === "sponsor"`, also editable by `rso_leadership`)  
**Where It Lives**: [`/sponsors`](../src/app/sponsors/page.tsx) inside [`SponsorDetailView.tsx`](../src/components/sponsors/SponsorDetailView.tsx) (**"Edit Partner Profile / Add Initiative"** button when signed in as that Sponsor or RSO Leadership)  
**Component Target**: `src/components/forms/SponsorInitiativeForm.tsx`

#### Why Implement This Fifth
With Sponsors, Events, Projects, and Jobs all flowing through PostgreSQL, this final self-service form lets a logged-in Sponsor manage their own showcase cards under **"Active Sponsorship Initiatives & Chapter Programs"** (such as *Lab & Hardware Grants*, *Technical Workshops*, *Capstone Mentorship*, and *Recruiting & Careers*) and keep their tagline, careers URL, and focus disciplines up to date without needing an RSO officer to edit them manually.

#### Fields & Mapping (`chapter_sponsors.initiatives`)
| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Initiative Title** | Text input | `initiatives[].title` | Required (e.g., *Autonomous Systems & Robotics Sponsorship*) |
| **Program Category** | Select (`Technical Workshops`, `Lab & Hardware Grants`, `Recruiting & Careers`, `Capstone Mentorship`) | `initiatives[].category` | Required |
| **Impact Metric Badge** | Text input | `initiatives[].metrics` | Optional (e.g., *\$15,000 in hardware grants* or *120+ attendees annually*) |
| **Program Description** | Textarea | `initiatives[].description` | Required, 20–300 chars |
| **Company Tagline / Careers URL** | Optional profile fields | `tagline`, `careers_url`, `primary_focus` | Optional updates to sponsor header |

- **API Route**: `PATCH /api/sponsors/[id]` (requires `x-user-role: sponsor` matching the sponsor's organization, or `admin`). Updates the `initiatives` `JSONB` array and profile fields in `chapter_sponsors`.

---

## 4. Sequential Implementation Checklist

- [x] **Step 0: Role Login & Session Foundation (Completed)**
  - [x] `/login` page with **RSO Leadership** and **Sponsor** role selection ([`src/app/login/page.tsx`](../src/app/login/page.tsx)).
  - [x] `POST /api/auth/login` credential validation route ([`src/app/api/auth/login/route.ts`](../src/app/api/auth/login/route.ts)).
  - [x] Persistent `AuthSession` in [`src/hooks/useRoleManager.ts`](../src/hooks/useRoleManager.ts) and `Sign In` / `Sign Out` controls in [`src/components/directory/DirectoryNavbar.tsx`](../src/components/directory/DirectoryNavbar.tsx).
- [ ] **Step 1: Database Schema Migration (`src/db/schema.ts`)**
  - [ ] Add `portal_users` and `chapter_sponsors` tables; add `category`, `partner`, `skills`, and `points_awarded` columns to `events`.
- [x] **Step 2: Form 1 — RSO Leadership Sponsor Onboarding Form (`/sponsors`) (Completed)**
  - [x] Build [`LeadershipSponsorForm.tsx`](../src/components/forms/LeadershipSponsorForm.tsx) and `POST /api/sponsors` ([`src/app/api/sponsors/route.ts`](../src/app/api/sponsors/route.ts)).
- [ ] **Step 3: Form 2 — RSO Leadership Event & Attendance Roster Form (`/events`)**
  - [ ] Build `LeadershipEventForm.tsx` with member attendance multi-select and `POST /api/events`.
- [ ] **Step 4: Form 3 — RSO Leadership Project & Team Roster Form (`/projects`)**
  - [ ] Build `LeadershipProjectForm.tsx` with tool/milestone builders, team roster selector, and `POST /api/projects`.
- [ ] **Step 5: Form 4 — Sponsor Job Posting Form (`/jobs`)**
  - [ ] Upgrade `QuickJobPostModal.tsx` into `SponsorJobPostingForm.tsx` with Sponsor session auto-fill and role guard on `POST /api/jobs`.
- [ ] **Step 6: Form 5 — Sponsor Initiatives & Profile Form (`/sponsors`)**
  - [ ] Build `SponsorInitiativeForm.tsx` and `PATCH /api/sponsors/[id]`.
