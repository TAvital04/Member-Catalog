# RSO USF Member Catalog — Master Form Directory & Specification (`FORMS.md`)

This document is the authoritative master specification for all data-capture forms across the **RSO USF Member Catalog**. It covers active forms, administrative workflows, and retired legacy forms across all portal roles (**RSO Leadership**, **Corporate Sponsors**, and **Student Members**).

---

## Form Index & Roadmap

| Form # | Form Name | Primary Role | Location | Component Path | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | [Onboard Chapter Sponsor](#form-1-rso-leadership--onboard-chapter-sponsor) | `rso_leadership` | `/sponsors` | [`src/components/forms/LeadershipSponsorForm.tsx`](../src/components/forms/LeadershipSponsorForm.tsx) | **Active** |
| **2** | [Create Event & Workshop](#form-2-rso-leadership--create-event--workshop) | `rso_leadership` | `/events` | [`src/components/forms/LeadershipEventForm.tsx`](../src/components/forms/LeadershipEventForm.tsx) | **Active** |
| **3** | [Create Project & Team Roster](#form-3-rso-leadership--create-chapter-project--team-roster) | `rso_leadership` | `/projects` | [`src/components/forms/LeadershipProjectForm.tsx`](../src/components/forms/LeadershipProjectForm.tsx) | **Active** |
| **4** | [Resume Book Batch Export](#form-4-sponsor--resume-book-batch-export-dialog) | `sponsor` / `admin` | `/sponsors` & `/` | [`src/components/modal/ResumeBookModal.tsx`](../src/components/modal/ResumeBookModal.tsx) | **Active** |
| **5** | [Sponsor Chapter Initiatives](#form-5-sponsor--propose-chapter-initiatives--grants) | `sponsor` / `admin` | `/sponsors` | [`src/components/modal/SponsorInitiativeModal.tsx`](../src/components/modal/SponsorInitiativeModal.tsx) | **Active** |
| **6** | [Recruiter Shortlist & Candidate Notes](#form-6-sponsor--recruiter-shortlist-bookmark--notes) | `sponsor` / `admin` | Candidate Modal | [`src/components/modal/tabs/ShortlistTab.tsx`](../src/components/modal/tabs/ShortlistTab.tsx) | **Active** |
| **—** | *Corporate Job Posting Form* | *Legacy* | */jobs* | *Retired* | **Decommissioned** |
| **—** | *Member In-App Job Application Form* | *Legacy* | */jobs* | *Retired* | **Decommissioned** |
| **—** | *Candidate Moderation & Flagging Dialog* | *Legacy* | */* | *Retired* | **Decommissioned** |

---

## Form 1: RSO Leadership — Onboard Chapter Sponsor

* **Role**: `rso_leadership` (`role === "admin"`)
* **Where It Lives**: [`/sponsors`](../src/app/sponsors/page.tsx) (**"+ Add Chapter Sponsor"** header button)
* **Component Path**: [`src/components/forms/LeadershipSponsorForm.tsx`](../src/components/forms/LeadershipSponsorForm.tsx)
* **API Route**: `POST /api/sponsors` (requires `x-user-role: admin`)
* **Target Tables**: `chapter_sponsors` + `portal_users`

### Purpose
Onboards corporate partners and local engineering firms into the catalog, provisioning their showcase on `/sponsors` and creating credentials for recruiters to sign in. Supports both corporate leaders (\$2,500–\$10,000) and **Local Partners** (\$300–\$1,000).

### Form Fields & Validation Rules

| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Company Name** | Text input | `chapter_sponsors.name` | Required, unique, 2–100 chars (e.g. *Tampa Bay Embedded Labs*) |
| **Short Display Name** | Text input | `chapter_sponsors.short_name` | Required, 2–30 chars |
| **Partnership Tier** | Dropdown | `chapter_sponsors.tier` | Required: `Platinum` \| `Gold` \| `Silver` \| `Local Partner` |
| **Logo Text / Abbr** | Text input | `chapter_sponsors.logo_text` | Required, 2–4 capital letters (e.g. *TBEL*, *LM*) |
| **Engineering Tagline** | Text input | `chapter_sponsors.tagline` | Required, 10–160 chars |
| **Company Overview** | Textarea | `chapter_sponsors.description` | Required, min 30 chars |
| **Corporate Website URL** | URL input | `chapter_sponsors.website` | Required, valid `https://` URL |
| **Careers Portal URL** | URL input | `chapter_sponsors.careers_url` | Required, valid `https://` URL |
| **Partner Since (Year)** | Text input | `chapter_sponsors.partner_since` | Required, 4-digit year (e.g. *2025*) |
| **Office Location** | Text input | `chapter_sponsors.location` | Required (e.g. *Tampa, FL*) |
| **Primary Disciplines** | Tag chips | `chapter_sponsors.primary_focus` (JSONB) | Required, at least 1 focus tag |
| **Recruiter Login Email** | Email input | `portal_users.email` | Required, valid corporate email |
| **Temporary Password** | Password input | `portal_users.password_hash` | Required, min 8 characters |

---

## Form 2: RSO Leadership — Create Event & Workshop

* **Role**: `rso_leadership` (`role === "admin"`)
* **Where It Lives**: [`/events`](../src/app/events/page.tsx) (**"+ Create Event / Workshop"** header button)
* **Component Path**: [`src/components/forms/LeadershipEventForm.tsx`](../src/components/forms/LeadershipEventForm.tsx)
* **API Route**: `POST /api/events` (requires `x-user-role: admin`)
* **Target Table**: `events` (with automatic attendance linking)

### Purpose
Publishes technical workshops, general body meetings, and corporate tech talks. Enforces the chapter policy: **only Technical Workshops award technical skills to attending members**.

### Form Fields & Validation Rules

| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Event Title** | Text input | `events.title` | Required, 5–150 chars |
| **Category** | Dropdown | `events.category` | Required: `Technical Workshop`, `Industry Tech Talk`, `General Body Meeting`, `Competition & Hackathon`, `Career & Networking`, `Special Event & Tour` |
| **Corporate Partner Host** | Dropdown | `events.partner` | Optional, selectable from active chapter sponsors or *None / Chapter Hosted* |
| **Description & Abstract** | Textarea | `events.description` | Required, min 25 chars |
| **Workshop Skills Awarded** | Tag chip builder | `events.skills` (JSONB) | **Enabled only if Category is `Technical Workshop`**. Awarded automatically to attendees. Disabled for non-workshop categories. |
| **Event Leads** | Searchable member multi-select | `event_attendees` | Assigns chapter leads with role: `Lead` |
| **Requires Chapter Dues** | Checkbox | `events.requires_dues` | Optional boolean toggle |

---

## Form 3: RSO Leadership — Create Chapter Project & Team Roster

* **Role**: `rso_leadership` (`role === "admin"`)
* **Where It Lives**: [`/projects`](../src/app/projects/page.tsx) (**"+ New Chapter Project"** header button)
* **Component Path**: [`src/components/forms/LeadershipProjectForm.tsx`](../src/components/forms/LeadershipProjectForm.tsx)
* **API Route**: `POST /api/projects` (requires `x-user-role: admin`)
* **Target Tables**: `ieee_projects` + `project_participants`

### Purpose
Publishes official engineering build projects (Robotics, Micro-UAVs, CubeSat, Smart Grid, Hardware Badge), defines milestone timelines, and assigns project leads and team members.

---

## Form 4: Sponsor — Resume Book Batch Export Dialog

* **Role**: `sponsor` / `admin`
* **Where It Lives**: [`/sponsors`](../src/app/sponsors/page.tsx) and `/` (**"Export Resume Book"** button)
* **Component Path**: [`src/components/modal/ResumeBookModal.tsx`](../src/components/modal/ResumeBookModal.tsx)
* **API Route**: `POST /api/resume-book`
* **Export Utilities**: [`src/lib/resumeBook.ts`](../src/lib/resumeBook.ts)

### Purpose
Allows corporate recruiters to customize, filter, and batch export student candidate profiles and hosted resume PDF links.

### Configuration Options:
- **Title**: Custom cover page title (e.g., *"Lockheed Martin Fall 2026 Embedded Talent Book"*).
- **Candidate Scope**: All Candidates, Current Directory Filter Results, or Recruiter Shortlist.
- **Discipline Filter**: Computer Science, Computer Engineering, Electrical Engineering, etc.
- **Graduation Year Filter**: 2025, 2026, 2027, 2028.
- **Content Toggles**: Include/exclude verified GPA, project history, workshop attendances, and direct resume PDF URLs.

---

## Form 5: Sponsor — Propose Chapter Initiatives & Grants

* **Role**: `sponsor` / `admin`
* **Where It Lives**: [`/sponsors`](../src/app/sponsors/page.tsx) (**"+ Propose New Initiative"** button in partner view)
* **Component Path**: [`src/components/modal/SponsorInitiativeModal.tsx`](../src/components/modal/SponsorInitiativeModal.tsx)
* **API Route**: `POST /api/sponsors/[id]/request-initiative`

### Purpose
Allows sponsors to directly submit and fund project hardware grants, workshop component sponsorships, or competition travel stipends.
