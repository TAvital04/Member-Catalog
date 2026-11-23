# RSO USF Member Catalog — Project Overview & Architecture Guide (`MEMBER_CATALOG_OVERVIEW.md`)

Welcome to the **RSO USF Member Catalog** project documentation.

The Member Catalog is an automated, verified engineering student portfolio directory and corporate partner engagement platform built for university student organizations (such as IEEE, ACM, ASME, and collegiate robotics chapters).

---

## 🎯 Executive Mission & Core Objectives

University student organizations face two critical bottlenecks every academic year:
1. **Officer Rotation & Administrative Fatigue**: Student leadership turns over annually. Traditional websites requiring manual content updates, job boards, or student moderation become broken within one or two semesters.
2. **Sponsor Value & ROI Proof**: Corporate sponsors and local engineering firms invest annual dues but rarely receive measurable returns from static logos on t-shirts or chaotic career fair tables.

### How the Member Catalog Solves These Challenges:
- **Zero-Friction Student Portfolios**: Students provide only essential inputs (major, graduation date, hosted resume PDF, and a short bio). Everything else—technical skills, project contributions, workshop attendances, and committee roles—is **automatically compiled and verified** from chapter attendance records and project rosters.
- **Silent Merit-Based Ranking ("Most Active")**: Active builders and committee leads naturally float to the top of talent searches based on verified contributions, eliminating arbitrary alphabetization or manual curation.
- **Batch "Resume Book" Compilation & Export**: Sponsors can filter candidates by discipline, graduation year, or workshop skills and export curated, branded Resume Books (in PDF preview, structured print books, and candidate rosters) in seconds.
- **Dual-View Sponsorship Hub**: The `/sponsors` directory provides corporate partners with both an active **Chapter Partners Catalog** and an interactive **Sponsorship Prospectus & Impact Report**, highlighting student placement rates, equipment micro-grants, and workshop ROI metrics.
- **Local Industry & Micro-Grant Inclusion**: Offers accessible **Local Partner** tiers (\$300–\$1,000) specifically designed for local engineering consultancies, PCB fabrication houses, and embedded firms seeking local co-ops and part-time interns in the Tampa Bay / Florida region.
- **Direct, Frictionless Candidate Outreach**: Decommissions clunky in-app job boards and login-walled applicant messaging in favor of direct, verified professional links (hosted resume PDF, LinkedIn, GitHub, and corporate mailto links).

---

## 📚 Documentation Index

1. **🛠️ [Developer Guide](README_DEVELOPERS.md) (`README_DEVELOPERS.md`)**  
   Technical documentation covering Next.js 16 App Router architecture, React 19 component hierarchy, TypeScript schemas, Drizzle ORM PostgreSQL integration, and verified candidate compilation engines.

2. **🔐 [Roles, Permissions & Security Matrix](ROLES.md) (`ROLES.md`)**  
   Details the 4 portal roles (`rso_leadership`/`admin`, `sponsor`, `student`, and public `standard` guest), anti-scraping safeguards, FERPA privacy rules, and direct recruiter contact models.

3. **📝 [Master Form Directory](FORMS.md) (`FORMS.md`)**  
   Specification of all administrative and partner forms (Sponsor Onboarding, Workshop Creation, Project Rostering, Resume Book Generation, and Sponsor Initiative Proposals).

4. **📊 [Database Schemas & Data Model](Data.md) (`Data.md`)**  
   PostgreSQL table schemas, entity relationships, JSONB structures, recruiter shortlists, and student candidate domain models.

5. **🏆 [Contribution & Ranking System](POINTS.md) (`POINTS.md`)**  
   Under-the-hood activity weighting algorithm powering the "Most Active" catalog sorting engine without gamified UI clutter.

---

## 🚀 Quick Launch

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

To run the Next.js production build:

```bash
pnpm build
```
