# RSO USF Member Catalog — Developer Documentation (`README_DEVELOPERS.md`)

Welcome to the **RSO USF Member Catalog** developer guide. This document provides complete technical documentation for system architecture, database integrations, component organization, state management, and resume book compilation workflows.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) | Server-side rendering, API route handlers, and URL query state sync |
| **UI Library** | [React 19](https://react.dev/) | Component architecture and streaming hydration |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict end-to-end typing across candidate models, forms, and APIs |
| **Styling & Design System** | Tailwind CSS v4 & Monochromatic Design Tokens | Clean black-and-white aesthetic (`#000000`, `#ffffff`, neutral borders) |
| **Database & ORM** | [Drizzle ORM](https://orm.drizzle.team/) & PostgreSQL | Neon Serverless / local `pg.Pool` connection with automatic seed fallback |
| **Icons** | [Lucide React](https://lucide.dev/) | Vector iconography without emoji clutter |
| **Resume Book Compilation** | `@/lib/resumeBook.ts` & Print CSS | Dynamic multi-candidate Resume Book generation with print formatting |

---

## 📁 Repository & Architecture Structure

```
Member-Catalog/
├── src/
│   ├── app/                         # Next.js App Router routes & API endpoints
│   │   ├── api/
│   │   │   ├── auth/login/          # Session authentication handler
│   │   │   ├── events/              # Event & workshop management
│   │   │   ├── members/             # Enriched candidate directory endpoint
│   │   │   ├── projects/            # Chapter build projects & rosters
│   │   │   ├── resume-book/         # Batch Resume Book compilation API
│   │   │   ├── shortlists/          # Recruiter bookmarks & private notes API
│   │   │   └── sponsors/            # Chapter sponsor catalog & initiative proposals
│   │   ├── events/                  # /events directory & deep-dive modals
│   │   ├── login/                   # /login multi-role authentication page
│   │   ├── projects/                # /projects showcase & milestone tracker
│   │   ├── sponsors/                # /sponsors dual hub (Prospectus + Partners Catalog)
│   │   ├── u/[slug]/                # Shareable public member vanity portfolio
│   │   ├── globals.css              # Global styling tokens & print CSS rules
│   │   └── page.tsx                 # Main candidate directory page
│   ├── components/
│   │   ├── common/                  # Reusable controls (CustomDropdown, Tooltip, Avatar)
│   │   ├── directory/               # Directory controls (FilterSidebar, StudentCard, List views)
│   │   ├── forms/                   # Administrative and sponsor forms (Forms 1–5)
│   │   ├── modal/                   # PortfolioModal, StudentUpperInfo, StudentLowerInfo
│   │   ├── resumebook/              # ResumeBookViewer & PDF print view
│   │   └── sponsors/                # SponsorshipProspectus, SponsorDetailView, Roster
│   ├── data/                        # Fallback datasets (sponsors, events, projects, students)
│   ├── db/                          # Drizzle ORM client, schemas (`schema.ts`), and seed script
│   ├── hooks/                       # Custom hooks (filters, theme, roles, shortlists)
│   ├── lib/                         # Utilities (candidates, points, skills, resumeBook, studentSlug)
│   ├── shared/                      # Shared domain types and interfaces
│   └── types/                       # Resume book & recruiter shortlist types
├── docs/                            # Architecture and project specifications
├── package.json
└── tsconfig.json
```

---

## ⚡ Quick Start & Development Setup

### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `pnpm` (recommended) or `npm`

### 2. Installation & Running

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Production Build

```bash
pnpm build
pnpm start
```

---

## 📊 Core Data Schema & Models

The data model is defined in `src/db/schema.ts` and `src/shared/types.ts`:

### Key Student Entity (`Student`)
- `id`: Unique candidate identifier.
- `name`: Candidate's full name.
- `email`: Contact email (protected by anti-scraping and privacy filters).
- `status`: Career search status (`"Seeking Internship"` | `"Seeking Full-time"` | `"Employed"` | `"Seeking Co-op / Part-Time"`).
- `locationPreference`: Regional preference (e.g., `"Tampa Bay / Local FL"`, `"Open to Relocation"`).
- `bio`: Concise self-introduction.
- `resumeLink`: Direct link to candidate's hosted PDF resume.
- `links`: Array of verified social/portfolio links (`GitHub`, `LinkedIn`, personal website).
- `education`: Degree, major, institution, and FERPA-consented GPA.
- `skills`: Technical skill strings, **awarded exclusively through verified Technical Workshop attendances**.
- `projects`: Verified chapter engineering builds with milestone timelines.
- `clubs`: Campus engineering leadership roles.
- `events`: Verified chapter event attendances with dates and categories.
- `points`: Calculated activity score powering the default **"Most Active"** directory sort.

---

## 🎯 Key Architectural Pillars

### 1. Automated Candidate Profile Enrichment (`src/lib/candidates.ts`)
Rather than requiring students to manually keep profiles updated, candidate records are compiled by joining:
1. Student base records and resume PDF links.
2. Verified event attendance records (`event_attendees` joined to `events`).
3. Verified project participant records (`project_participants` joined to `ieee_projects`).
4. Automated activity points calculation (`src/lib/points.ts`).

### 2. Batch "Resume Book" Engine (`src/lib/resumeBook.ts`)
Corporate sponsors can filter candidates and export customized resume compilations:
- **Scope Options**: All candidates, current directory search results, or recruiter private shortlists.
- **Custom Branding**: Output header displays the sponsor company name and chapter designation.
- **Export Options**: Interactive print-ready Resume Book (`ResumeBookViewer`), JSON payload, and printable single-page candidate summaries with direct resume PDF links.

### 3. Recruiter Shortlist & Talent Bookmarks (`recruiter_shortlists`)
Sponsors with active accounts can bookmark top talent directly from the candidate directory:
- Saved candidates are synced to PostgreSQL (`recruiter_shortlists`).
- Recruiters can attach private internal evaluation notes and tags (e.g., *"Interviewed at Fall Tech Talk — strong embedded C++ skills"*).
- One-click export allows sponsors to download a Resume Book composed exclusively of their shortlisted talent.

### 4. Sponsorship Dual-View Hub (`/sponsors`)
The `/sponsors` route features a dual-mode interface:
1. **Prospectus & Chapter Impact View**: Displays chapter placement rates, workshop equipment micro-grants, ROI proof, and tiered partnership guides (including the **Local Partner** tier at \$300–\$1,000).
2. **Partners Catalog View**: Displays active sponsor profiles, company bios, funded chapter initiatives, and associated candidate rosters.

### 5. Direct, Frictionless Candidate Contact
All legacy job boards and gated in-app messaging forms have been retired. Corporate recruiters reach candidates directly via:
- Hosted resume PDF link.
- One-click `mailto:` link with pre-populated candidate subject lines.
- Verified LinkedIn and GitHub profiles.
