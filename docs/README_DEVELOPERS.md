# UCF Member Catalog — Developer Documentation

Welcome to the **UCF Member Catalog** developer guide. This document provides complete technical documentation for setup, architecture, data schemas, design tokens, component organization, state management, and testing workflows.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Server-side rendering, routing, and search parameter synchronization |
| **UI Library** | [React 19](https://react.dev/) | Modular UI component architecture |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type definitions across student profiles, filters, and moderation workflows |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Tokens | Responsive layout grid and dark mode support |
| **Database & ORM** | [Drizzle ORM](https://orm.drizzle.team/) & PostgreSQL | Neon Serverless / local PostgreSQL candidate profiles and event schemas |
| **Icons** | [Lucide React](https://lucide.dev/) | Vector UI iconography |
| **Testing** | [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/) | Automated unit and component integration testing |

---

## 📁 Repository & Project Structure

```
Member-Catalog/
├── src/                         # Next.js App Router application
│   ├── app/                     # Routes: /, /projects, /events, /api/*
│   │   ├── colors.css           # Theme design tokens
│   │   ├── globals.css          # Global styling, utility classes & animations
│   │   ├── layout.tsx           # Root application layout wrapper
│   │   └── page.tsx             # Primary directory entry point & controller
│   ├── components/              # Modular UI components
│   │   ├── common/              # Common UI controls (Role switcher, badge components)
│   │   ├── dialogs/             # Moderation dialogs (FlagDialog, ResolveDialog)
│   │   ├── directory/           # Directory controls (Control bar, FilterSidebar, Card/Row views)
│   │   ├── modal/               # Student detail modal (PortfolioModal, StudentUpperInfo, StudentLowerInfo)
│   │   └── timeline/            # Resume timeline renderers (Work experience, education, projects)
│   ├── data/                    # Candidate profiles, events, projects, and sponsors datasets
│   ├── db/                      # Drizzle ORM client, schemas, and database seed scripts
│   ├── hooks/                   # Custom React hooks (filters, theme, roles, dialogs)
│   ├── lib/                     # Utilities (styles, matching, scoring, email)
│   └── shared/                  # Domain types, point scoring, and form validations
├── public/                      # Static assets and SVG icons
├── docs/                        # Architecture and developer documentation
├── __tests__/                   # Jest unit test suite
├── jest.config.ts               # Jest test runner configuration
├── next.config.ts               # Next.js environment configuration
├── package.json                 # Project dependencies & script runners
└── tsconfig.json                # TypeScript configuration
```

---

## ⚡ Quick Start & Development Setup

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `pnpm` (recommended), `npm`, or `yarn`

### 2. Installation

```bash
pnpm install
```

### 3. NPM Scripts

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts the Next.js local development server at `http://localhost:3001` |
| `pnpm test` | Executes the Jest unit and integration test suite |
| `pnpm build` | Compiles the production build |
| `pnpm start` | Boots the optimized production server |
| `pnpm db:seed` | Seeds database with candidate records |

---

## 📊 Core Data Schema & Models

The data model powering candidate profiles is defined in `src/db/schema.ts` and `src/shared/types.ts`:

### Key Properties (`StudentCandidate`)
- `id`: Unique identifier.
- `name`: Student full name.
- `email`: Contact email (hidden/redacted for standard directory views).
- `status`: Career search status (`"Seeking Internship"` \| `"Seeking Full-time"` \| `"Employed"`).
- `bio`: Brief summary / elevator pitch.
- `resumeLink`: Direct link to hosted resume PDF.
- `links`: List of platform links (`GitHub`, `LinkedIn`, `Portfolio`, etc.).
- `education`: Array of degree entries.
- `skills`: Flat array of technical skill strings (`React`, `Python`, `Altium Designer`, etc.).
- `workExperiences`: Work experience timeline objects.
- `projects`: Project entries with external repository/demo links.
- `clubs`: Campus student organization participation.
- `certifications`: Industry credentials and certificates.
- `flagged`: Boolean flag for moderation filtering.
- `flagReason`: Structured reason string if flagged for administrative review.

---

## ⚙️ Architecture & Technical Standards

### 1. State & URL Synchronization (`useDirectoryFilters`)
Directory state (search query, major, graduation year, career status, and skill tags) is synchronized bidirectionally with browser URL search parameters (`useSearchParams`).
- Enables deep-linking: Recruiters can bookmark or share specific search result URLs (`?q=React&status=Seeking+Full-time`).
- Search queries feature a debounce buffer to eliminate re-render latency during typing.

### 2. Visual Design System
Theme colors and modern aesthetics are styled via Tailwind CSS v4 and CSS tokens:
- Dark mode compatibility: Tailored background and border contrast variables.
- Shimmer skeletons: `StudentCardSkeleton` and `FilterSidebarSkeleton` components render during async loading phases.

### 3. Lightweight External Portfolio Modal (`PortfolioModal`)
- Displays detailed student profiles without embedding heavy PDF binaries or making external company logo API requests.
- All resume and project links render as safe external links (`target="_blank" rel="noopener noreferrer"`).
- Displays clean, text-based experience and education timelines.

### 4. Privacy & Email Access Control
- Email addresses and direct mail actions are hidden/redacted when viewed under the `"standard"` user role.
- Prevents unauthorized web scraping and candidate spam.

### 5. Moderation Workflow (`FlagDialog`, `ResolveDialog`)
- Administrative users can flag profiles with structured reason options (*Broken Link*, *Outdated Info*, *Inappropriate Content*, *AI Slop*).
- Toggling flag status updates visibility filters while strictly preserving student schema integrity.

---

## 🧪 Testing & Code Quality

Automated tests are located in `__tests__/`.

### Running Tests
```bash
pnpm test
```

### Test Coverage Highlights
- **Directory Filtering**: Validates text query searching, skill tag toggles, and status filters.
- **Privacy Controls**: Verifies email address hiding in `StudentCard`, `StudentRow`, and `PortfolioModal`.
- **Link Integrity**: Verifies that external resume and project links include safe `target="_blank"` attributes.
- **Moderation Flow**: Tests flagging and resolving candidate profiles.