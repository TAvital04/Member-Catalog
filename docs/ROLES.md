# RSO USF Member Catalog — Role-Based Access & Permissions Matrix (`ROLES.md`)

## 1. Architecture: Standard PostgreSQL (`node-postgres` & Drizzle ORM)

The platform standardizes on classic **PostgreSQL** connected via the standard `node-postgres` (`pg.Pool`) driver and Drizzle ORM.

### Key Architectural Strengths:
- **Battle-Tested Relational Integrity**: Enforces foreign keys (`ON DELETE CASCADE`), `UNIQUE` constraints (`event_attendees`, `project_participants`, `recruiter_shortlists`), and atomic transactions.
- **Structured JSONB Metadata**: Stores flexible arrays (project milestones, workshop tools, sponsor initiatives, and candidate links) alongside relational keys.
- **Deterministic Data Fallback**: When running offline or during testing, handlers seamlessly fall back to deterministic seed data without crashing.

---

## 2. Portal Roles & Permission Matrix

The Member Catalog supports three authenticated roles via [`/login`](../src/app/login/page.tsx), along with an unauthenticated public guest tier:

| Role Identifier | Display Name | Who Uses It | Permissions & Platform Capabilities |
| :--- | :--- | :--- | :--- |
| `rso_leadership`<br>*(maps to `admin`)* | **RSO Leadership** | Executive Board Officers, Project Leads, Workshop Directors | • **Form 1**: Onboard Chapter Sponsors (including Local Partners) & provision logins<br>• **Form 2**: Create Events & Workshops with verified skill tagging & attendance rosters<br>• **Form 3**: Create Chapter Build Projects & assign project teams / leads<br>• Full candidate directory access, list view, and profile management<br>• Generate and export chapter Resume Books |
| `sponsor` | **Corporate Sponsor & Local Partner** | Official Corporate Partners, Local Engineering Firms, & Technical Recruiters | • **Form 4**: Configure and export batch **Resume Books** (PDF/Print/Data)<br>• **Form 5**: Propose & manage Chapter Initiatives / Equipment Grants<br>• Save candidates to **Recruiter Shortlists** with private evaluation notes<br>• Multi-parametric filtering (Major, Skills, Graduation Date, Projects, Local Co-Op)<br>• Direct candidate contact via hosted resume PDF, LinkedIn, GitHub, and email<br>• View FERPA-consented GPAs for candidate evaluation |
| `student` | **Student Member** | Enrolled Engineering Candidates | • Verified candidate profile with automated workshop and project affiliations<br>• "Only My Profile" directory quick-filter<br>• Verified skill credentials linked to official chapter workshop check-ins |
| `standard` | **Public Guest (No Account)** | Prospective Students, Faculty, Community Visitors | • **Unauthenticated Public Browsing**: Browse engineering builds and workshops<br>• **Public Sponsorship Prospectus**: On `/sponsors`, views the interactive **Chapter Impact Report & Sponsorship Prospectus** (placement rates, equipment grants, tier guidelines) rather than a dead blocker wall<br>• **Attendee Privacy**: Regular attendee rosters and participant contact details are shielded<br>• **Candidate Search & Filter Protection**: Directory filters and search are locked to prevent automated web scraping and candidate enumeration<br>• **Backend Data Sanitization**: `/api/members` redacts personal emails, external links, and resume links for standard callers<br>• **Crawler Directives (`robots.txt`)**: Disallows search engine bots, query scrapers, and AI crawlers from harvesting candidate catalogs |

---

## 3. Database Schema Overview (`src/db/schema.ts`)

### 1. Authenticated Portal Users (`portal_users`)
Stores credentials for RSO officers, corporate partners, and local engineering firms:

```sql
CREATE TABLE portal_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('rso_leadership', 'sponsor')),
  display_name VARCHAR(150) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  sponsor_id VARCHAR(64),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2. Chapter Sponsors (`chapter_sponsors`)
Stores corporate partners and local engineering firms across 4 tiers:

```sql
CREATE TABLE chapter_sponsors (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  short_name VARCHAR(100) NOT NULL,
  tier VARCHAR(50) NOT NULL DEFAULT 'Gold', -- 'Platinum' | 'Gold' | 'Silver' | 'Local Partner'
  logo_text VARCHAR(16) NOT NULL,
  tagline VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  website VARCHAR(500) NOT NULL,
  careers_url VARCHAR(500) NOT NULL,
  partner_since VARCHAR(16) NOT NULL,
  location VARCHAR(255) NOT NULL,
  primary_focus JSONB NOT NULL DEFAULT '[]'::jsonb,
  initiatives JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. Recruiter Shortlists (`recruiter_shortlists`)
Stores recruiter candidate bookmarks, private evaluation notes, and talent tags:

```sql
CREATE TABLE recruiter_shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id VARCHAR(255) NOT NULL,
  candidate_id VARCHAR(255) NOT NULL,
  notes TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT recruiter_candidate_unique UNIQUE (recruiter_id, candidate_id)
);
```

---

## 4. Sequential Form Order & Data Dependencies

The administrative and sponsor workflows follow a strict dependency sequence:

```
[Form 1: Sponsor Onboarding]
       │  (creates partner organizations across Platinum, Gold, Silver & Local Partner tiers)
       ▼
[Form 2: Event & Workshop Creation]
       │  (records verified workshop attendances & automatically issues skill badges)
       ▼
[Form 3: Project & Team Roster Creation]
       │  (creates official chapter engineering builds & assigns participant rosters)
       ▼
[Form 4: Resume Book Compilation & Export]
       │  (assembles branded candidate resume books for corporate partners)
       ▼
[Form 5: Sponsor Initiative Proposals]
          (funds project hardware equipment, workshop micro-grants, & competition sponsorships)
```

---

## 5. Privacy, Anti-Scraping & Direct Contact Policy

1. **FERPA Protection**: Academic data (GPA) is strictly gated. GPAs are never exposed publicly or to standard callers; they are disclosed only to authenticated corporate partners when the student has signed FERPA authorization.
2. **Anti-Scraping Defenses**: The candidate directory rejects automated fuzzing and mass scraping. Standard unauthenticated sessions receive sanitized payloads with redacted contact details.
3. **No In-App Messaging Walls**: Hiring teams reach candidates directly using verified links on student profiles (`mailto:`, LinkedIn, GitHub, hosted resume PDF). There are no proprietary chat systems or job boards requiring recurring maintenance.
