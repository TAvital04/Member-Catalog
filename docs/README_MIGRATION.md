# 📋 Member Resume Database (MRD) Lead — Monorepo Action Plan

This document serves as the operational guide for the **Member Resume Database (MRD) Lead**. It details what **you** need to do before, during, and after the migration of this codebase into the central IEEE UCF monorepo.

> **Context**: You are responsible specifically for the `member-resume-database` project. You are **not** required to manage `database_container`, `IEEE-Website`, or global monorepo infrastructure (handled by `Deoxon`).

---

## 🎯 Executive Overview & Your Role

- **Goal**: Move `member-resume-database` into a shared monorepo alongside other IEEE projects (`IEEE-Website`, `database_container`).
- **Your Primary Scope**: Maintain, build, and deploy the Member Resume Database inside its isolated folder (`project.ieeeucf.com` / `resumes.ieeeucf.com`).
- **Key Takeaway from Infrastructure Lead (`Deoxon`)**: You don't need complex pre-migration setup. All projects will first be moved into subdirectories of a single repository, after which shared libraries (database connections, schemas, utilities) will be collated.

---

## 🛠️ Phase-by-Phase Responsibilities for MRD Lead

### 1️⃣ Phase 1: Pre-Migration Preparation (Completed ✅)

**What you need to do in this repo before the move:**

- [x] **Keep the Codebase Self-Contained**: Ensure all code, API routes, and components live strictly inside the `member-resume-database/` directory.
- [x] **Clean Dependency & Environment Management**:
  - Keep `.env.local` decoupled. Rely on standard `DATABASE_URL` environment variables so it seamlessly points to the shared PostgreSQL database (local Docker or Neon) post-migration.
  - Avoid hardcoded absolute file paths or custom build steps that assume this repository is the root directory.
- [x] **Ensure Clean Build & Tests**:
  - Verify `npm run build` and `npm run test` run without errors so the codebase is ready to be dropped into the monorepo workspace (`pnpm` / Turborepo).

---

## 🚚 Phase 2: The Migration Move (Day of Transfer)

**What happens during the transition:**

- [ ] **Directory Relocation**:
  - `Deoxon` (or Lead Architect) will create the monorepo root and move this entire project into a dedicated folder (e.g., `apps/member-resume-database/` or `projects/member-resume-database/`).
- [ ] **Workspace Integration**:
  - Update `package.json` `name` if required (e.g., `"@ieee/member-resume-database"`).
  - Verify local dev scripts (`pnpm dev`) launch your app properly from the monorepo root.

---

## 🔄 Phase 3: Post-Migration Workflow (Day-to-Day Operations)

**How you and your team will work in the monorepo:**

### A. Folder Isolation & Team Boundaries
- **Your Workspace**: You and your team work almost exclusively within your assigned project folder (`apps/member-resume-database/`).
- **Cross-Folder Governance**:
  - If a feature requires editing files **outside** your group's folder (e.g., shared schema definitions, database configs, or another team's folder), **you MUST involve Deoxon**.
  - This prevents accidental breaking updates across teams.

### B. Consuming Shared Libraries
- **Database Connection & Schemas**:
  - Instead of maintaining isolated DB connections in `lib/db.ts`, you will import shared database models and Drizzle ORM instances provided by the monorepo (e.g., `@ieee/db`).
  - Example future import:
    ```typescript
    import { db, members } from "@ieee/db";
    ```
- **Shared Utils & UI**:
  - Consume shared utility libraries for database queries, badge definitions, or member form schemas as they are collated into shared packages.

### C. Database Testing & Seeding
- **Local Testing**:
  - Spin up the shared local database container (`tools/database-container`) via Docker.
  - Run database seed scripts (`pnpm db:seed`) to populate candidate/member data for local development.

---

## 📝 Quick Checklist Summary for MRD Lead

| Timeline | Action Item | Status |
| :--- | :--- | :--- |
| **Before Migration (Phase 1)** | Ensure `member-resume-database` builds cleanly & uses standard `DATABASE_URL`. | ✅ Completed |
| **During Migration** | Support moving folder into monorepo (`apps/member-resume-database`). | ⏳ Pending Infrastructure Setup |
| **After Migration** | Operate strictly within team folder; consult `Deoxon` for out-of-folder modifications. | ⏳ Future Workflow |
