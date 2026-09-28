# UCF Member Resume Database (MRD) — Developer Documentation

Welcome to the **UCF Member Resume Database (MRD)** developer guide. This document provides complete technical documentation for setup, architecture, data schemas, design tokens, component organization, state management, and testing workflows.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Server-side rendering, routing, and search parameter synchronization |
| **UI Library** | [React 19](https://react.dev/) | Modular UI component architecture |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type definitions across student profiles, filters, and moderation workflows |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Tokens | Responsive layout grid, Pegasus Gold theme tokens, and dark mode support |
| **Icons** | [Lucide React](https://lucide.dev/) | Vector UI iconography |
| **Testing** | [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/) | Automated unit and component integration testing |

---

## 📁 Repository & Project Structure

```
Member-Resume-Database/
├── Data.md                      # Student profile data schema & field specifications
├── README_DEVELOPERS.md         # Technical documentation for developers (This file)
├── README_USERS.md              # User showcase & recruiter promotional guide
├── README_PROGRESS.md           # Progress tracking for Version 1 and Version 2
└── member-resume-database/      # Main Next.js application workspace
    ├── __tests__/               # Jest test suite (components, hooks, directory filters)
    ├── app/                     # Next.js App Router root
    │   ├── colors.css           # Pegasus Gold & theme design tokens
    │   ├── globals.css          # Global styling, utility classes & animations
    │   ├── layout.tsx           # Root application layout wrapper
    │   └── page.tsx             # Primary directory entry point & controller
    ├── components/              # Modular UI components
    │   ├── common/              # Common UI controls (Role switcher, badge components)
    │   ├── dialogs/             # Moderation dialogs (FlagDialog, ResolveDialog)
    │   ├── directory/           # Directory controls (Control bar, FilterSidebar, Card/Row views)
    │   ├── modal/               # Student detail modal (PortfolioModal, StudentUpperInfo, StudentLowerInfo)
    │   └── timeline/            # Resume timeline renderers (Work experience, education, projects)
    ├── data/                    # Seed student profile data & badge caching utilities
    │   └── students.ts          # Candidate profile interfaces & static dataset
    ├── hooks/                   # Custom React hooks
    │   └── useDirectoryFilters.ts # Search, filter, and URL search parameter sync hook
    ├── jest.config.ts           # Jest test runner configuration
    ├── next.config.ts           # Next.js environment configuration
    ├── package.json             # NPM dependencies & script runners
    └── tsconfig.json            # TypeScript configuration
```

---

## ⚡ Quick Start & Development Setup

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm` / `bun`

### 2. Installation
Clone the repository and install dependencies in the `member-resume-database` subfolder:

```bash
cd member-resume-database
npm install
```

### 3. NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server at `http://localhost:3000` |
| `npm test` | Executes the Jest unit and integration test suite |
| `npm run build` | Compiles the production build |
| `npm run start` | Boots the optimized production server |
| `npm run lint` | Runs ESLint validation across all TypeScript files |

---

## 📊 Core Data Schema & Models

The data model powering candidate profiles is strictly defined according to `Data.md`. All profile types are typed in TypeScript:

### Key Interfaces (`data/students.ts`)
- **`Student`**: The core profile object representing UCF candidates.
  - `id`: Unique string identifier.
  - `name`: Student full name.
  - `email`: Contact email (hidden/redacted for standard directory views).
  - `status`: Career search status (`"Seeking Internship"` \| `"Seeking Full-time"` \| `"Employed"`).
  - `bio`: Brief summary / elevator pitch.
  - `resumeUrl`: Direct link to hosted resume PDF.
  - `socialLinks`: List of platform links (`GitHub`, `LinkedIn`, `Portfolio`, etc.).
  - `education`: Array of degree entries (primary entry prioritizes UCF).
  - `skills`: Flat array of technical skill strings (`React`, `Python`, `Altium Designer`, etc.).
  - `experience`: Work experience timeline objects.
  - `projects`: Project entries with external repository/demo links.
  - `clubs`: Campus student organization participation (e.g. IEEE, ACM, Hack@UCF).
  - `certifications`: Industry credentials and certificates.
  - `flagged`: Boolean flag for moderation filtering.
  - `flagReason`: Structured reason string if flagged for administrative review.

---

## ⚙️ Architecture & Technical Standards

### 1. State & URL Synchronization (`useDirectoryFilters`)
Directory state (search query, major, graduation year, career status, and skill tags) is synchronized bidirectionally with browser URL search parameters (`useSearchParams`).
- Enables deep-linking: Recruiters can bookmark or share specific search result URLs (`?q=React&status=Seeking+Full-time`).
- Search queries feature a 200ms debounce buffer to eliminate re-render latency during typing.

### 2. Visual Design System (Pegasus Gold Tokens)
Theme colors are configured in `app/colors.css` using CSS custom properties:
- `--gold-primary`: Pegasus Gold signature accent color.
- `--gold-hover`: Dynamic interaction hover states.
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
- Administrative users can flag profiles with structured reason options (*Broken Link*, *Outdated Info*, *Inappropriate Content*).
- Toggling flag status updates visibility filters while strictly preserving student schema integrity.

---

## 🧪 Testing & Code Quality

Automated tests are located in `member-resume-database/__tests__/`.

### Running Tests
```bash
npm test
```

### Test Coverage Highlights
- **Directory Filtering**: Validates text query searching, skill tag toggles, and status filters.
- **Privacy Controls**: Verifies email address hiding in `StudentCard`, `StudentRow`, and `PortfolioModal`.
- **Link Integrity**: Verifies that external resume and project links include safe `target="_blank"` attributes.
- **Moderation Flow**: Tests flagging and resolving candidate profiles.