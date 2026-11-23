# RSO USF Chapter Contribution & Activity Sorting Specification (`POINTS.md`)

## 1. Executive Summary & Design Philosophy

The **RSO USF Contribution Algorithm** is a backend merit-ranking engine that automatically measures student engagement across engineering projects, chapter workshops, and leadership roles.

### Primary Purpose: Silent Merit-Based Sorting
The point system is not a game or competitive public leaderboard. As stated by chapter leadership:

> *"The points really is just a sorting algorithm and the goal is for people to barely know about it except for the brief insight that something is sorting them by activity."*

In traditional student directories and static PDF books, members appear in arbitrary or alphabetical order. An officer who puts in 200 hours fabricating an autonomous micromouse robot receives identical placement to someone who signed a roster once.

**The Contribution Algorithm quietly solves this by ensuring members who contribute the most to the chapter naturally appear first in directory listings and corporate Resume Books.**

1. **No UI Gamification**: Student cards and modal profiles do not display numeric badges, level progress bars, or point tallies. The interface remains clean, professional, and candidate-centric.
2. **"Most Active" Catalog Default**: The catalog exposes this ranking simply as the **"Most Active"** sort option, which is enabled by default. Recruiters immediately see candidates with demonstrated hands-on initiative and teamwork.
3. **Zero Manual Overhead**: Points are tallied automatically from verified attendance rosters and project participant tables. Officers and students never manually assign or request points.

---

## 2. Activity Weighting Weights

The algorithm evaluates verified contributions using objective chapter milestones:

| Category | Valuation | Verification & Eligibility Scope |
| :--- | :---: | :--- |
| **Executive Board Officer** | **10 pts** | Holds an Executive Board seat (e.g., Chair, Vice Chair, Treasurer, Secretary, Webmaster). |
| **Leading a Chapter Project** | **15 pts each** | Serves as Project Director, Hardware Lead, Firmware Lead, or Chief Architect on an official engineering build. |
| **Chapter Project Contributor** | **5 pts each** | Actively contributes to an official university build team (e.g., *Micromouse*, *Solar Quadcopter*, *Smart Campus IoT*, *Senior Design Capstone*). Excludes trivial personal hobby projects. |
| **Workshops & Chapter Events** | **3–15 pts each** | Verified attendance at technical workshops (PCB Design, Embedded Linux, Edge AI), tech talks, or hackathons logged via `event_attendees`. |
| **Committee Member** | **5 pts each** | Active service on an RSO standing committee (Hardware, Software, Robotics, Technical Activities). |

---

## 3. What Qualifies as a Chapter Project vs. Personal Project?

To maintain data integrity and prevent resume book inflation, the system maintains a strict division:

### ✅ Eligible Chapter & Collegiate Engineering Projects
- **RSO Chapter Build Projects**: Official engineering teams organized under the chapter (*Micromouse Autonomous Maze Solver*, *Solar-Assisted Campus Rover*, *High-Speed Quadcopter Swarm*, *Smart Grid Power Monitor*).
- **Collegiate Competition Teams**: University-sanctioned teams (*Formula SAE*, *Baja SAE*, *RoboBoat*, *CubeSat Ground Station*).
- **University Research & Capstone**: Verified Senior Design capstone teams and faculty-sponsored undergraduate laboratory research.

### ❌ Excluded Personal Hobby Projects (0 algorithm points)
- Independent weekend coding projects (e.g., *Personal Portfolio*, *Todo App*, *Calculator*, *Discord Bot*).
- While personal projects remain visible in candidate portfolio modals for technical recruiters to review, they do not boost the chapter contribution score.

---

## 4. Technical Workshop Skills Pipeline

In addition to activity points, **Technical Workshops** provide the exclusive pipeline for verified candidate technical skills:

1. **Automated Skill Issuance**: When RSO Leadership creates a workshop in [`src/components/forms/LeadershipEventForm.tsx`](../src/components/forms/LeadershipEventForm.tsx) and tags competencies (e.g., *Altium Designer*, *Surface-Mount Soldering*, *ROS2*, *FreeRTOS*), any student marked present automatically receives those verified skills on their profile.
2. **Integrity Rule**: Skills are never populated from personal self-attestation or non-technical events (general body meetings, socials). Only verified attendance at an official chapter workshop grants skill badges.
3. **Faceted Recruiter Filtering**: Corporate recruiters searching for specific hardware or embedded competencies can filter by these verified skills with complete confidence.

---

## 5. Architectural Implementation

### 5.1 Point Breakdown Calculation (`src/lib/points.ts`)
The calculation function evaluates a student's joined database records:

$$\text{Total Points} = (10 \times B) + (15 \times L) + (5 \times U) + (E_{\text{points}}) + (5 \times C)$$

Where:
- $B \in \{0, 1\}$: Executive Board Member status.
- $L \ge 0$: Count of official chapter build projects led.
- $U \ge 0$: Count of chapter build projects contributed to.
- $E_{\text{points}}$: Cumulative points from verified workshop and chapter event attendances.
- $C \ge 0$: Count of standing committees served on.

### 5.2 Recency Weighting (`calculateRecentPoints`)
To ensure graduating seniors and inactive alumni don't indefinitely crowd out active underclassmen, the algorithm incorporates a recency decay:
- Events and project milestones within the past 180 days carry full weighting.
- Historical milestones remain recorded for the candidate's portfolio history while allowing current active builders to rise in the default directory view.
