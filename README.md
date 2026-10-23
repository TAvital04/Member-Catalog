# Member Catalog

Welcome to the **Member Catalog** web application for the **IEEE Student Chapter at the University of Central Florida (UCF)**.

The Member Catalog is an interactive engineering talent directory and chapter portfolio portal featuring verified candidate profiles, project showcases, event attendance histories, and leadership engagement.

---

## 📁 Repository Structure

```
Member-Catalog/
├── src/                         # Application source code
│   ├── app/                     # Next.js App Router pages and API routes
│   │   ├── api/                 # API handlers (members, events, projects, send-email)
│   │   ├── events/              # Chapter events showcase page
│   │   └── projects/            # Chapter build projects showcase page
│   ├── components/              # UI components (directory, modals, dialogs, timeline)
│   ├── data/                    # Domain datasets (students, events, projects, sponsors)
│   ├── db/                      # Drizzle ORM schema, client connection, and seed data
│   ├── hooks/                   # Custom React hooks (filters, theme, roles, dialogs)
│   ├── lib/                     # Utilities (styles, matching, scoring, email)
│   └── shared/                  # Shared domain types, point formulas, and validations
├── public/                      # Static assets and SVG icons
├── docs/                        # Technical guides, architecture docs, and data schemas
├── __tests__/                   # Jest test suites (directory, filtering, dialogs, FERPA)
├── package.json                 # Project dependencies & scripts
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project overview
```

---

## 🛠️ Quick Start

### Prerequisites
- Node.js >= 18
- `pnpm` (recommended), `npm`, or `yarn`

### Setup

```bash
# Install dependencies
pnpm install
```

### Development & Commands

```bash
# Start local development server (port 3001)
pnpm dev

# Build the production bundle
pnpm build

# Run all test suites
pnpm test

# Seed database with sample candidate records
pnpm db:seed
```

---

## 🛡️ Architecture & Key Features

- **Next.js 16 + React 19**: Modern React Server & Client Components.
- **Tailwind CSS 4**: Modern fluid design system.
- **PostgreSQL & Drizzle ORM**: Integrated data models with Neon serverless and local Postgres support.
- **FERPA Compliance**: 34 CFR Part 99 privacy shielding for student academic records.
- **Multi-Role Experience**: Seamless switching between Standard Member, Sponsor Recruiter, and Administrator views.