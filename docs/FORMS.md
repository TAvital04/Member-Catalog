# IEEE UCF Member Catalog — Master Form Directory & Specification (`FORMS.md`)

This document is the authoritative master specification for all data-capture forms across the **IEEE UCF Member Catalog**. It covers completed forms, active forms, and planned forms across all portal roles (**RSO Leadership**, **Corporate Sponsors**, and **Student Members**).

---

## Form Index & Roadmap

| Form # | Form Name | Primary Role | Target Location | Component Path | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | [Onboard Chapter Sponsor](#form-1-rso-leadership--onboard-chapter-sponsor) | `rso_leadership` | `/sponsors` | `src/components/forms/LeadershipSponsorForm.tsx` | **Completed** |
| **2** | [Create Event & Workshop](#form-2-rso-leadership--create-event--workshop) | `rso_leadership` | `/events` | `src/components/forms/LeadershipEventForm.tsx` | **Completed** |
| **3** | [Create Project & Team Roster](#form-3-rso-leadership--create-chapter-project--team-roster) | `rso_leadership` | `/projects` | [`src/components/forms/LeadershipProjectForm.tsx`](../src/components/forms/LeadershipProjectForm.tsx) | **Completed** |
| **4** | [Sponsor Job Posting](#form-4-sponsor--create--manage-job-postings) | `sponsor` / `admin` | `/jobs` | `src/components/forms/SponsorJobPostingForm.tsx` | **Planned** |
| **5** | [Sponsor Initiatives & Profile](#form-5-sponsor--manage-sponsorship-initiatives--partner-profile) | `sponsor` / `admin` | `/sponsors` | `src/components/forms/SponsorInitiativeForm.tsx` | **Planned** |
| **6** | [Member Portfolio & Resume Form](#form-6-member--portfolio--resume-data-integration-form) | `standard` (Member) | `/settings` | `src/components/settings/MemberResumeForm.tsx` | **Specified** |
| **7** | [1-Click Job Application](#form-7-member--1-click-portfolio-job-application-form) | `standard` (Member) | `/jobs` | `src/components/modal/job/JobDetailModal.tsx` | **Completed** |
| **8** | [Profile Moderation & Flagging](#form-8-rso-leadership--candidate-profile-flagging--moderation) | `rso_leadership` | `/` | `src/components/dialogs/FlagDialog.tsx` | **Completed** |

---

## Form 1: RSO Leadership — Onboard Chapter Sponsor

* **Role**: `rso_leadership` (`role === "admin"`)
* **Where It Lives**: [`/sponsors`](../src/app/sponsors/page.tsx) (**"+ Add Chapter Sponsor"** header button)
* **Component Path**: [`src/components/forms/LeadershipSponsorForm.tsx`](../src/components/forms/LeadershipSponsorForm.tsx)
* **API Route**: `POST /api/sponsors` (requires `x-user-role: admin`)
* **Target Tables**: `chapter_sponsors` + `portal_users`

### Purpose
Onboards corporate partners into the catalog, provisioning their company showcase page on `/sponsors` and creating credentials for their recruiters to log in as `sponsor`.

### Form Fields & Validation Rules

| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Company Name** | Text input | `chapter_sponsors.name` | Required, unique, 2–100 chars (e.g. *Lockheed Martin*) |
| **Short Display Name** | Text input | `chapter_sponsors.short_name` | Required, 2–30 chars (e.g. *Lockheed*) |
| **Partnership Tier** | Dropdown | `chapter_sponsors.tier` | Required: `Platinum` \| `Gold` \| `Silver` |
| **Logo Text / Abbr** | Text input | `chapter_sponsors.logo_text` | Required, 2–4 capital letters (e.g. *LM*, *TI*) |
| **Engineering Tagline** | Text input | `chapter_sponsors.tagline` | Required, 10–160 chars |
| **Company Overview** | Textarea | `chapter_sponsors.description` | Required, min 30 chars |
| **Corporate Website URL** | URL input | `chapter_sponsors.website` | Required, valid `https://` URL |
| **Careers Portal URL** | URL input | `chapter_sponsors.careers_url` | Required, valid `https://` URL |
| **Partner Since (Year)** | Text input | `chapter_sponsors.partner_since` | Required, 4-digit year (e.g. *2021*) |
| **Office Location** | Text input | `chapter_sponsors.location` | Required (e.g. *Orlando, FL*) |
| **Primary Disciplines** | Tag chips | `chapter_sponsors.primary_focus` (JSONB) | Required, at least 1 focus tag (e.g. *Embedded Systems*) |
| **Recruiter Login Email** | Email input | `portal_users.email` | Required, valid email format |
| **Temporary Password** | Password input | `portal_users.password_hash` | Required, min 8 characters |

---

## Form 2: RSO Leadership — Create Event & Workshop

* **Role**: `rso_leadership` (`role === "admin"`)
* **Where It Lives**: [`/events`](../src/app/events/page.tsx) (**"+ Create Event / Workshop"** header button)
* **Component Path**: [`src/components/forms/LeadershipEventForm.tsx`](../src/components/forms/LeadershipEventForm.tsx)
* **API Route**: `POST /api/events` (requires `x-user-role: admin`)
* **Target Table**: `events` (with automatic attendance linking)

### Purpose
Publishes technical workshops, general body meetings, and corporate tech talks. Implements the chapter policy: **only Technical Workshops award technical skills to attending members**.

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

### System Invariants
- **Uniform Chapter Points**: All chapter events automatically award standard flat chapter points (`15 points`). There is no manual point input.
- **Automatic Attendance**: Member check-in is logged automatically via attendance rosters; there is no manual registration link input.
- **Time/Location Display**: Workshop schedules are coordinated through chapter calendar feeds and omitted from card clutter.

---

## Form 3: RSO Leadership — Create Chapter Project & Team Roster

* **Role**: `rso_leadership` (`role === "admin"`)
* **Where It Lives**: [`/projects`](../src/app/projects/page.tsx) (**"+ New Chapter Project"** header button)
* **Target Component Path**: `src/components/forms/LeadershipProjectForm.tsx`
* **API Route**: `POST /api/projects` (requires `x-user-role: admin`)
* **Target Tables**: `ieee_projects` + `project_participants`

### Purpose
Publishes official IEEE UCF engineering build projects (Robotics, Micro-UAVs, CubeSat, Smart Grid, Hardware Badge), defines milestone timelines, and assigns project leads and team members.

### Form Fields & Validation Rules

| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Project Title** | Text input | `ieee_projects.title` | Required, 5–120 chars |
| **Project Slug** | Text input (auto-slugged) | `ieee_projects.slug` | Required, URL-friendly unique identifier |
| **Status** | Dropdown | `ieee_projects.status` | Required: `Active`, `In Development`, `Completed` |
| **Short Tagline** | Text input | `ieee_projects.tagline` | Required, 10–200 chars |
| **Technical Overview** | Textarea | `ieee_projects.description` | Required, min 40 chars |
| **GitHub Repo URL** | URL input | `ieee_projects.repository_url` | Optional, valid `https://` repository link |
| **Key Tech Stack & Tools** | Tag input builder (`name`) | `ieee_projects.tools` (JSONB) | Optional array of tool chips (e.g. *Altium Designer*, *FreeRTOS*, *ROS 2*) |
| **Milestone Timeline** | Dynamic table builder (`date`, `title`, `description`, `status`) | `ieee_projects.timeline` (JSONB) | At least 1 milestone entry required |
| **Sponsorship & Funding** | Number + text inputs | `ieee_projects.sponsorship_info` (JSONB) | Optional (`fundingGoal`, `currentFunding`, `needsDescription`) |
| **Team & Leads Roster** | Searchable member multi-select with role dropdown | `project_participants` | Assigns members with role: `Lead` \| `Member` |

### System Invariants
- **Projects Do NOT Grant Skills**: Projects showcase student engineering builds and team leadership, but in accordance with chapter policy, skills are only verified and attributed through Technical Workshops.

---

## Form 4: Sponsor — Create & Manage Job Postings

* **Role**: `sponsor` (`role === "sponsor"`, also accessible to `rso_leadership`)
* **Where It Lives**: [`/jobs`](../src/app/jobs/page.tsx) (Employer Portal **"+ Post New Opportunity"** button)
* **Component Path**: `src/components/forms/SponsorJobPostingForm.tsx` (upgrading [`QuickJobPostModal.tsx`](../src/components/modal/job/QuickJobPostModal.tsx))
* **API Route**: `POST /api/jobs` (requires `x-user-role: sponsor` or `admin`)
* **Target Table**: `job_postings`

### Purpose
Allows corporate partners to post internships, co-ops, and full-time entry engineering positions that match against student workshop-verified skills.

### Form Fields & Validation Rules

| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Job Title** | Text input | `job_postings.title` | Required, 5–120 chars |
| **Company Name** | Read-only / auto-filled | `job_postings.company_name` | Locked to authenticated sponsor's organization |
| **Department / Division** | Text input | `job_postings.department` | Optional (e.g. *Defense Electronics & Radar Systems*) |
| **Location** | Text input | `job_postings.location` | Required (e.g. *Orlando, FL*, *Dallas, TX*) |
| **Work Arrangement** | Dropdown | `job_postings.location_type` | Required: `On-site` \| `Hybrid` \| `Remote` |
| **Employment Type** | Dropdown | `job_postings.employment_type` | Required: `Internship` \| `Full-time` \| `Co-op` |
| **Experience Level** | Dropdown | `job_postings.experience_level` | Required: `Entry Level` \| `Junior` \| `Mid-Level` |
| **Compensation Range** | Text input | `job_postings.salary_range` | Optional (e.g. *$32 - $38 / hr* or *$88,000 - $105,000 / yr*) |
| **Role Overview** | Textarea | `job_postings.description` | Required, min 30 chars |
| **Key Responsibilities** | Bullet list builder | `job_postings.responsibilities` (JSONB) | At least 1 item required |
| **Qualifications** | Bullet list builder | `job_postings.requirements` (JSONB) | At least 1 item required |
| **Benefits & Perks** | Bullet list builder | `job_postings.benefits` (JSONB) | Optional bullet items |
| **Required Skills** | Skill tags selector | `job_postings.skills_required` (JSONB) | At least 1 skill tag (powers candidate match scoring) |
| **Recruiter Email** | Email input (pre-filled) | `job_postings.employer_email` | Required valid email |
| **Application Link / Portal** | URL input | `job_postings.employer_website` | Optional direct external careers link |

---

## Form 5: Sponsor — Manage Sponsorship Initiatives & Partner Profile

* **Role**: `sponsor` (`role === "sponsor"`, also editable by `rso_leadership`)
* **Where It Lives**: [`/sponsors`](../src/app/sponsors/page.tsx) inside `SponsorDetailView.tsx` (**"Edit Partner Profile / Add Initiative"** button)
* **Target Component Path**: `src/components/forms/SponsorInitiativeForm.tsx`
* **API Route**: `PATCH /api/sponsors/[id]`
* **Target Table**: `chapter_sponsors.initiatives` (JSONB)

### Purpose
Enables corporate partners to maintain their company profile showcase cards and document grants, bootcamps, and sponsored lab spaces.

### Form Fields & Validation Rules

| Field Label | Input Type | Target Column | Validation Rules |
| :--- | :--- | :--- | :--- |
| **Initiative Title** | Text input | `initiatives[].title` | Required, 5–120 chars (e.g. *Autonomous Systems & Radar Lab*) |
| **Program Category** | Dropdown | `initiatives[].category` | Required: `Technical Workshops`, `Lab & Hardware Grants`, `Recruiting & Careers`, `Capstone Mentorship` |
| **Impact Metric Badge** | Text input | `initiatives[].metrics` | Optional (e.g. *$15,000 in hardware grants*, *120+ attendees annually*) |
| **Program Description** | Textarea | `initiatives[].description` | Required, 20–300 chars |
| **Tagline / Careers URL** | Text + URL inputs | `chapter_sponsors.tagline`, `careers_url` | Optional updates to sponsor header |

---

## Form 6: Member — Portfolio & Resume Data Integration Form

* **Role**: `standard` (Authenticated Student Member)
* **Where It Lives**: Member Settings / Dashboard (`/settings` or `/member/portfolio`)
* **Component Path**: `src/components/settings/MemberResumeForm.tsx` (reference: `references/Form.md`)
* **API / Mutation**: tRPC `member.updateMyResumeProfile` / PostgreSQL `member_resumes` table
* **Schema Validation**: [`src/shared/validations.ts`](../src/shared/validations.ts) (`MemberResumeFormData`)

### Purpose
The comprehensive self-service portfolio form where students maintain their bio, education history, work experiences, independent projects, and resume PDF.

### Form Sections & Repeater Fields

1. **Career Status**:
   - Selector: `Seeking Internship` \| `Seeking Full-time` \| `Employed`
2. **Resume PDF Storage**:
   - Integrated PDF file upload, URL storage, and filename display.
3. **Education History (Repeater)**:
   - Institution (defaults to *University of Central Florida*)
   - Degree Type (`BS`, `MS`, `Minor`)
   - Major / Field of Study
   - GPA & GPA Scale (0.00 – 4.00)
   - Start Date & Expected Graduation Date
4. **Work Experience (Repeater)**:
   - Company Name & Job Title
   - Location (City, State / Remote)
   - Start Date, End Date, and *Currently Working Here* checkbox
   - Bullet point accomplishment statements
5. **Independent Projects (Repeater)**:
   - Project Name & Dates
   - Ongoing status toggle
   - Technical Description
   - Project Repository & Live Demo URLs
6. **Student Clubs & Organizations (Repeater)**:
   - Club Name, Leadership / Member Role, and Active Dates
7. **Certifications & Industry Credentials (Repeater)**:
   - Certification Name, Issuing Organization
   - Issue Date & Expiration Date
   - Credential ID & Credential URL
8. **FERPA Privacy & GPA Sharing**:
   - Checkbox granting consent to share academic GPA with verified corporate recruiters.

### Critical Invariant
- **No Manual Skill Input**: The resume form deliberately omits a manual skills input box. Member skills are populated exclusively when members attend chapter Technical Workshops.

---

## Form 7: Member — 1-Click Portfolio Job Application Form

* **Role**: `standard` (Authenticated Student Member)
* **Where It Lives**: [`/jobs`](../src/app/jobs/page.tsx) inside `JobDetailModal.tsx` (**"Apply with 1-Click Portfolio"**)
* **Component Path**: [`src/components/modal/job/JobDetailModal.tsx`](../src/components/modal/job/JobDetailModal.tsx)
* **API Route**: `POST /api/jobs/applications`
* **Target Table**: `job_applications`

### Purpose
Allows student candidates to apply directly to corporate sponsor postings using their verified chapter portfolio in one click.

### Form Fields & Invariants

| Field Label | Input Type | Target Column | Behavior |
| :--- | :--- | :--- | :--- |
| **Candidate Identity** | Read-only | `job_applications.member_id` | Auto-populated from logged-in student session |
| **Portfolio Snapshot** | Read-only preview | `job_applications.portfolio_snapshot` (JSONB) | Automatically captures candidate name, major, grad date, resume PDF link, and workshop-earned skills |
| **Cover Note to Recruiter** | Textarea | `job_applications.cover_note` | Optional message (20–500 chars) |
| **Submission** | Button | `job_applications.status` | Submits application with initial status `"Submitted"` |

---

## Form 8: RSO Leadership — Candidate Profile Flagging & Moderation

* **Role**: `rso_leadership` (`role === "admin"`)
* **Where It Lives**: [`/`](../src/app/page.tsx) (Candidate Directory card moderation controls)
* **Component Paths**: [`src/components/dialogs/FlagDialog.tsx`](../src/components/dialogs/FlagDialog.tsx) & [`src/components/dialogs/ResolveDialog.tsx`](../src/components/dialogs/ResolveDialog.tsx)
* **API Route**: `POST /api/moderation/flag` & `POST /api/moderation/resolve`
* **Target Table**: `member_resumes` (`flagged`, `flag_reason`)

### Purpose
Allows RSO Leadership to moderate candidate profiles for unverified claims, FERPA compliance concerns, or inappropriate content.

### Form Fields & Invariants

| Field Label | Input Type | Target Column | Behavior |
| :--- | :--- | :--- | :--- |
| **Flag Reason Preset** | Radio / Selection | `member_resumes.flag_reason` | `Portfolio contains unverified claims under review`, `FERPA privacy disclosure review`, or custom reason |
| **Custom Reason Text** | Textarea | `member_resumes.flag_reason` | Required if custom reason chosen |
| **Notify Candidate** | Checkbox | — | Dispatches automated notification email to candidate explaining moderation status |
| **Resolution Action** | Dialog buttons | `flagged = false` | Unflags profile or purges rejected entry upon review |

---

## UI Standards Required Across All Forms
1. **Monochrome Aesthetic**: Strict 2-color styling: white `#ffffff` backgrounds, black `#000000` text/accents, and neutral-300 borders. No arbitrary colors.
2. **Standard Dropdowns**: All `<select>` elements use the standardized [`Select.tsx`](../src/components/ui/Select.tsx) or [`CustomDropdown.tsx`](../src/components/common/CustomDropdown.tsx).
3. **Unified Geometry**: Standard `rounded-xl` corners and uniform focus rings (`focus:ring-1 focus:ring-black`).
4. **Accessible Validation**: All form roots include `noValidate` to suppress ugly browser tooltips and provide inline error summaries.
