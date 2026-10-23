# 📋 Member Catalog — Architecture & Migration History

This document serves as the historical record and architecture notes for the **Member Catalog**. It details the evolution from an isolated project, through temporary monorepo integration with the central IEEE UCF website, to its current detached standalone architecture as the root application of this repository.

---

## 🎯 Executive Overview & Standalone Scope

- **Goal**: Maintain the Member Catalog as an independent, standalone web application at the root of the repository.
- **Scope**: Candidate directory, IEEE chapter projects hub, events showcase, portfolio modals, and integrated Drizzle ORM database layer (`src/db/`).
- **Detached Architecture**: The application is fully decoupled from the external IEEE website and operates as a standalone Next.js 16 application.

---

## 🛠️ Evolution History

### 1️⃣ Phase 1: Isolated Development
- Built as an independent candidate directory.
- Local data mocking and test suites.

### 2️⃣ Phase 2: Monorepo Transition
- Temporarily hosted within a monorepo workspace alongside `ieee-website`.
- Shared database schemas collated in `@ieee/db` and shared utilities in `@ieee/shared`.

### 3️⃣ Phase 3: Decoupling & Root Application (Current Architecture ✅)
- **Detached from IEEE Website**: Complete separation from `apps/ieee-website`.
- **Standalone Root**: The Member Catalog application was moved to the repository root (`/src`, `/public`, `/package.json`).
- **Internalized Database & Shared Modules**: Schema definitions, Drizzle ORM client, seed scripts, and shared types/validations were unified directly inside `src/db/` and `src/shared/`.
- **Direct Workspace Execution**: Standard `pnpm dev`, `pnpm build`, `pnpm test`, and `pnpm db:seed` run directly at the repository root without workspace flags.
