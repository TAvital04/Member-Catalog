# Member Catalog Monorepo

Welcome to the **Member Catalog** monorepo repository. This workspace consolidates our web applications and services into a unified structure.

---

## 📁 Repository Structure

```
Member-Catalog/
├── apps/
│   ├── ieee-website/            # Next.js web application for IEEE Website
│   └── member-resume-database/  # Next.js web application for Member Resume Database (MRD)
├── packages/                    # Shared libraries, utilities, and components
├── pnpm-workspace.yaml          # Workspace configuration for pnpm
├── package.json                 # Root monorepo scripts & configuration
└── README.md                    # Workspace overview
```

---

## 🚀 Workspace Applications

### 1. IEEE Website (`apps/ieee-website`)
- **Tech Stack**: Next.js 15, React 19, Tailwind CSS, Drizzle ORM, PostgreSQL (Neon), tRPC
- **Dev Command**: `pnpm dev:ieee`

### 2. Member Resume Database (`apps/member-resume-database`)
- **Tech Stack**: Next.js 16, React 19, Tailwind CSS, Drizzle ORM, PostgreSQL (Neon), Jest
- **Documentation**: See `apps/member-resume-database/docs/`
- **Dev Command**: `pnpm dev:resume`

---

## 🛠️ Quick Start

### Prerequisites
- Node.js >= 18
- `pnpm` (recommended) or `npm` / `yarn`

### Setup

```bash
# Install dependencies across all workspace packages
pnpm install
```

### Running Applications

```bash
# Run IEEE Website locally
pnpm dev:ieee

# Run Member Resume Database locally
pnpm dev:resume

# Build all applications
pnpm build
```