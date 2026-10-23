# IEEE UCF Chapter Contribution & Point System Specification

## 1. Executive Summary & Purpose

The **IEEE UCF Contribution Point System** is a merit-based engagement engine that quantifies and recognizes verified student involvement across chapter leadership, engineering build projects, committee service, and technical workshops.

### The Main Idea: Surfacing Top Contributors First
In traditional resume books and job boards, candidates are presented in arbitrary order or purely alphabetized, giving equal visibility to inactive members as to the students who spend hundreds of hours leading robotics build sprints, organizing soldering bootcamps, and representing UCF at national engineering competitions.

**The primary purpose of the Contribution Point System is to put members who contribute the most first.**

1. **Reward Active Chapter Leaders & Builders**: Students who dedicate their time to leading projects, serving on committees, holding executive board seats, and mentoring peers are automatically promoted to the top of recruiter searches.
2. **Signal Grit & Hands-on Commitment to Recruiters**: Corporate sponsors (Lockheed Martin, L3Harris, Texas Instruments, Northrop Grumman) immediately see which candidates possess demonstrated initiative, teamwork, and technical leadership beyond classroom exams.
3. **Incentivize Meaningful Student Participation**: Freshmen and sophomores have a clear, transparent roadmap: by attending workshops (+3 pts), joining committee teams (+5 pts), contributing to official chapter build projects (+5 pts), and stepping up into project leadership (+15 pts), they directly boost their professional visibility to hiring managers.

---

## 2. Point Valuation Rules

The point system enforces five unambiguous, objective rules:

| Category | Point Value | Scope & Verification Criteria |
| :--- | :---: | :--- |
| **IEEE Board Member** | **10 pts** | Holds an Executive Board officer role in the IEEE UCF Student Chapter (e.g., Chair, Vice Chair, Treasurer, Secretary, Webmaster, Executive Officer). |
| **Leading a Project** | **15 pts each** | Serves as Project Director, Lead Engineer, Firmware Lead, Hardware Lead, or Chief Architect on an official chapter build project or university competition team. |
| **University Project Member** | **5 pts each** | Actively contributes to an official university or IEEE engineering project team (e.g., *Micromouse*, *Solar Knight Racing*, *Quadcopter Swarm*, *Smart Campus IoT*, *CubeSat Ground Station*, *AUV Thruster*, *Senior Design*). **Does not include personal hobby projects.** |
| **Workshops & Chapter Events** | **3 pts each** | Verified attendance at technical workshops (PCB Design, Embedded Linux, Edge AI), hackathons, industry tech talks, general body meetings, or community service sessions tracked via `event_attendees`. |
| **Committee Member** | **5 pts each** | Active service on an IEEE UCF standing committee (Hardware Committee, Software Committee, Workshops Committee, Robotics SIG, Technical Activities). |

---

## 3. What Qualifies as a University Project vs. Personal Project?

To maintain data integrity and prevent point inflation from trivial personal repositories, the system draws a strict boundary:

### ✅ Eligible University Projects (+5 pts member / +15 pts lead)
- **IEEE UCF Chapter Build Projects**: Official engineering teams organized under the chapter (*Micromouse*, *Solar Knight Racing ESC*, *Quadcopter Swarm*, *Smart Campus IoT*, *PCB Workshop Badges*, *AUV Thrusters*, *GaN Solar MPPT*).
- **Collegiate Engineering Teams**: University-sanctioned teams such as *Formula SAE*, *Baja SAE*, *AIAA CubeSat*, *SEDS Space Hardware*, *RoboBoat*, *KnightHacks*.
- **University Capstone / Research**: Verified Senior Design capstone teams, CREOL optics labs, and faculty-sponsored undergraduate research laboratories.

### ❌ Excluded Personal Projects (0 contribution points)
- Independent weekend coding experiments (e.g., *Personal Portfolio Website*, *Todo App*, *Calculator*, *Weather App*, *Discord Bot*, *Markdown Editor*, *LeetCode practice solutions*).
- While personal projects remain fully visible on the candidate's portfolio modal for recruiters to inspect, they **do not contribute** to the chapter contribution score.

---

## 4. Architectural & Database Integration

### 4.1 Database Schema (`packages/db/src/schema.ts`)
The `member_resumes` table stores the aggregate point score and detailed breakdown JSON:

```typescript
export const memberResumes = pgTable('member_resumes', {
  // ... core resume fields ...
  points: integer('points').default(0).notNull(),
  pointBreakdown: jsonb('point_breakdown').$type<{
    total: number;
    boardPoints: number;
    projectLeadPoints: number;
    universityProjectPoints: number;
    eventPoints: number;
    committeePoints: number;
    details: string[];
  }>(),
});
```

### 4.2 API Endpoint (`GET /api/members`)
1. Calculates or retrieves the exact point breakdown for each candidate.
2. Default sorting: Candidates are automatically ordered by `points DESC` so that the highest contributors appear at the very top of the response payload.

### 4.3 Frontend Directory Integration
1. **Backend-Only Scoring**: Points and point breakdowns are calculated and maintained in the backend and database to determine candidate ordering without visually cluttering student cards with raw numerical scores.
2. **Activity Filter ("Most Active")**: The catalog sorting control exposes this merit-based ranking as the **"Most Active"** filter option (`sortBy = "activity"`), automatically activated by default so the most engaged members are surfaced first.
3. **Clean Visual Aesthetic**: Candidate cards and portfolio modals remain clean and professional, focusing on verified project affiliations, leadership roles, and technical skills while letting backend activity ranking do the work of elevating top contributors.

---

## 5. Calculation Formula

$$\text{Total Points} = (10 \times B) + (15 \times L) + (5 \times U) + (3 \times E) + (5 \times C)$$

Where:
- $B \in \{0, 1\}$: IEEE Board Member status (1 if active/past officer, 0 otherwise).
- $L \ge 0$: Count of university/chapter engineering projects led.
- $U \ge 0$: Count of university/chapter engineering projects participated in as a team member.
- $E \ge 0$: Count of verified workshops, general body meetings, and chapter events attended.
- $C \ge 0$: Count of IEEE standing committees served on.
