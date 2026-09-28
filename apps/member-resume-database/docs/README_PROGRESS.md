# 📈 UCF Member Resume Database (MRD) — Version Progress & Roadmap

This document outlines the evolutionary progress of the **UCF Member Resume Database (MRD)** project, tracking features, architectural decisions, and capabilities delivered across **Version 1** and **Version 2**.

-------------------

## 📊 Version 1 vs. Version 2 Feature Comparison

| Feature Dimension | Version 1 (Initial Build) | Version 2 (Current Production Release) |
| :--- | :--- | :--- |
| **Design System & Theme** | Default CSS styling without uniform design tokens. | **Pegasus Gold Theme** (`colors.css`, `globals.css`) with dark mode support and shimmer skeletons (`StudentCardSkeleton`, `FilterSidebarSkeleton`). |
| **Search & Filtering** | Static in-memory text search without URL retention. | **URL Parameter Sync** (`useDirectoryFilters`), 200ms debounced search, and deep-linkable shareable filter URLs (`?q=`, `?status=`, `?skills=`). |
| **Skill Filtering** | Complex multi-nested category groupings. | **Flat Skill Tag Cloud** for clean, 1-click filtering across tools and technologies. |
| **Portfolio Modal & Resumes** | Prototype modal requiring heavy embedded assets. | **Lightweight External Links** (`target="_blank"`), direct PDF links, text-based experience timelines, zero PDF embed overhead or external logo image calls. |
| **Student Privacy** | Candidate email addresses exposed in public views. | **Privacy Shielding**: Candidate emails and mailto actions redacted/disabled for standard directory users. |
| **Content Moderation** | Simple binary toggle for profile flags. | **Structured Moderation**: Granular flag reason reporting (`FlagDialog`, `ResolveDialog`) and flag status filtering while keeping student schema untouched. |
| **Performance & Caching** | O(N) recalculations on card render. | **Badge Caching System** (`badgeCache`) for O(1) candidate metrics lookup and zero UI lag. |
| **Testing & Quality Assurance** | Manual visual inspection only. | **Automated Test Suite** (Jest + React Testing Library) covering filtering, privacy controls, modal links, and flag flows. |

---

## 📝 Detailed Version Breakdown

### 🔹 Version 1 — Foundation & Core Prototype
Version 1 established the initial baseline for managing candidate profiles for UCF engineering students.

#### Core Deliverables in Version 1:
- Defined the initial student profile schema (`Data.md`) detailing contact info, degrees, skills, work experience, projects, clubs, and certifications.
- Implemented basic React UI layout with card and list view toggles for browsing student seed data.
- Built initial search input for simple string matching against candidate names and majors.
- Created basic modal drawer for viewing student details.

---

### 🔹 Version 2 — Production Directory, Privacy & Moderation
Version 2 incorporates all system polish, architectural optimizations, privacy controls, and moderation capabilities into a unified production release.

#### Core Deliverables in Version 2:

#### 🎨 1. Pegasus Gold Visual System & Shimmer Loading States
- Streamlined `app/colors.css` and `globals.css` with signature Pegasus Gold design tokens (`--gold-primary`, `--gold-hover`).
- Added shimmer skeleton components (`StudentCardSkeleton`, `FilterSidebarSkeleton`) for smooth visual feedback during data queries.
- Refined responsive mobile filter drawers and active filter chips.

#### 🔄 2. URL Search Parameter Sync & Debounced Filtering
- Custom hook `useDirectoryFilters` synchronizes state directly with Next.js `useSearchParams`.
- Enables recruiters to bookmark or share exact search queries via URL parameters (`?q=`, `?status=`, `?major=`, `?skills=`).
- 200ms search query debounce eliminates UI re-render jank.
- Flattened skill tag filtering removes unnecessary categorization overhead, allowing users to toggle tags cleanly from a flat cloud.

#### ⚡ 3. Lightweight External Portfolio Modal
- Refined `PortfolioModal.tsx`, `StudentUpperInfo.tsx`, and `StudentLowerInfo.tsx` to render resume links and project links as direct external URL buttons (`target="_blank" rel="noopener noreferrer"`).
- Displays text-based work experience and education timelines without image logo assets or binary PDF embed overhead, ensuring low memory usage and high security.

#### 🛡️ 4. Candidate Privacy Shield
- Enforced privacy controls in `StudentCard.tsx`, `StudentRow.tsx`, and `PortfolioModal.tsx`.
- Standard directory users see candidate contact email addresses redacted or omitted, preventing web scraping and unsolicited email spam.

#### ⚖️ 5. Granular Moderation Workflows
- Refined `FlagDialog.tsx` and `ResolveDialog.tsx` to support structured flag reasons (*Broken Link*, *Outdated Info*, *Inappropriate Content*).
- Allows administrators to toggle profile visibility in search views while strictly maintaining schema immutability on `Data.md`.

#### 🧪 6. Automated Verification & Jest Suite
- Integrated Jest and React Testing Library tests under `__tests__/`.
- Validates filtering accuracy, privacy email hiding, modal link rendering, and flag dialog interactions.

---

### 🔹 Version 3 — IEEE Website Integration & Data Plumbing (In Progress)
Version 3 focuses on creating the basic technical plumbing to access and display form data from the main **IEEE Website database**.

#### Core Deliverables & Roadmap for Version 3:

#### 🔌 1. Primitive On-Demand Data Fetching
- Basic database connection allowing MRD to view records stored in the IEEE Website database via a primitive action (e.g., a manual fetch / refresh button).
- Full continuous updates and automated synchronization routines are deferred to **Version 4**.

#### 📐 2. Exact Schema Alignment
- Direct mapping based on exact data schema parity between the IEEE Website database and Member Resume Database.

#### ⚖️ 3. Unified Database Moderation & Member Dashboard Feedback
- Moderation fields (flags, flag reasons, visibility status) are stored directly in the shared database.
- Results from moderation actions performed in MRD are updated in the database and reflected directly in the student's **Member Dashboard** on the IEEE Website.

#### 🛡️ 4. Candidate Privacy Shield
- Enforces Privacy Shield protections so candidate contact details remain secured when viewed within the MRD recruiter directory.
