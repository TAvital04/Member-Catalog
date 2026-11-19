"use client";

/**
 * @file page.tsx — RSO USF Corporate Sponsors & Industry Initiatives Page
 * @description Dedicated partner catalog showcasing corporate sponsors, sponsored build projects,
 * technical workshops, corporate job postings, engineering skills, and interacting student members.
 */

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, Plus, Shield, Users } from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import DirectoryStatsHeader from "@/components/directory/DirectoryStatsHeader";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useRoleManager } from "@/hooks/useRoleManager";
import { useStudentData } from "@/hooks/useStudentData";
import {
  ChapterSponsor,
  CURRENT_CHAPTER_SPONSORS,
  getSponsorRelatedData,
} from "@/data/sponsors";
import { IEEEProject, SAMPLE_IEEE_PROJECTS } from "@/data/projects";
import { IEEEEvent, SAMPLE_IEEE_EVENTS } from "@/data/events";
import { JobPosting, SAMPLE_JOB_POSTINGS } from "@/data/jobs";
import { Student } from "@/data/students";
import SponsorCard from "@/components/sponsors/SponsorCard";
import SponsorDetailView from "@/components/sponsors/SponsorDetailView";
import SponsorEngagementStats from "@/components/sponsors/SponsorEngagementStats";
import LeadershipSponsorForm from "@/components/forms/LeadershipSponsorForm";
import SponsorInitiativeForm from "@/components/forms/SponsorInitiativeForm";
import SponsorInitiativesBanner from "@/components/sponsors/SponsorInitiativesBanner";
import SearchInput from "@/components/common/SearchInput";
import FilterPills from "@/components/common/FilterPills";
import EmptyState from "@/components/common/EmptyState";
import ToastNotification from "@/components/dialogs/ToastNotification";
import PortfolioModal from "@/components/modal/PortfolioModal";
import ProjectModal from "@/components/modal/project/ProjectModal";
import EventModal from "@/components/modal/event/EventModal";
import JobDetailModal from "@/components/modal/job/JobDetailModal";
import { ProjectTabType } from "@/components/modal/project/ProjectTabNavigation";
import { getStudentSlug, findStudentBySlugOrId } from "@/lib/studentSlug";

function SponsorsPageContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { role, session, handleRoleChange, isAdmin, isStudent, isSponsor } = useRoleManager();
  const { students } = useStudentData();

  const searchParams = useSearchParams();
  const sponsorParam = searchParams.get("sponsor") || searchParams.get("company");
  const memberParam = searchParams.get("member") || searchParams.get("student");
  const viewParam = searchParams.get("view");
  const tierParam = searchParams.get("tier");
  const qParam = searchParams.get("q") || searchParams.get("search");
  const myParam = searchParams.get("my");

  const [sponsorsList, setSponsorsList] = useState<ChapterSponsor[]>(CURRENT_CHAPTER_SPONSORS);
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(sponsorParam);
  const [hasExplicitlyChosenAll, setHasExplicitlyChosenAll] = useState<boolean>(viewParam === "all");
  const [selectedTier, setSelectedTier] = useState<string>(() => tierParam || "All");
  const [searchQuery, setSearchQuery] = useState<string>(() => qParam || "");
  const [isSponsorFormOpen, setIsSponsorFormOpen] = useState(false);
  const [isInitiativeFormOpen, setIsInitiativeFormOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [onlyMySponsors, setOnlyMySponsors] = useState(() => myParam === "true");

  const updateSponsorUrl = (updates: Record<string, string | null | undefined>) => {
    const url = new URL(window.location.href);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === "") {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, val);
      }
    });
    window.history.pushState(null, "", url.pathname + (url.search ? url.search : ""));
  };

  const handleTierChange = (t: string) => {
    setSelectedTier(t);
    updateSponsorUrl({ tier: t !== "All" ? t : null });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    updateSponsorUrl({ q: q.trim() ? q : null, search: null });
  };

  const handleToggleMySponsors = (val: boolean) => {
    setOnlyMySponsors(val);
    updateSponsorUrl({ my: val ? "true" : null });
  };

  // Match active student profile from authenticated session
  const loggedInStudent = useMemo(() => {
    if (!isStudent || students.length === 0) return null;
    const targetId = session?.studentId?.toLowerCase();
    const targetEmail = session?.email?.toLowerCase();
    const targetName = session?.displayName?.toLowerCase();

    return (
      students.find((s) => {
        if (targetId && s.id.toLowerCase() === targetId) return true;
        if (targetEmail && s.email.toLowerCase() === targetEmail) return true;
        if (targetName && s.name.toLowerCase() === targetName) return true;
        return false;
      }) || students[0]
    );
  }, [isStudent, session, students]);

  const studentSponsorIds = useMemo(() => {
    if (!isStudent || !loggedInStudent) return new Set<string>();
    const ids = new Set<string>();
    const studentProjs = (loggedInStudent.projects || []).map((p) => (p.title || "").toLowerCase());
    const studentEvents = (loggedInStudent.events || []).map((e) => (e.title || "").toLowerCase());

    sponsorsList.forEach((sp) => {
      const hasProj = sp.sponsoredProjectSlugs.some((slug) =>
        studentProjs.some((tp) => tp.includes("micromouse") || tp.includes("rover") || tp.includes("drone") || slug.includes(tp))
      );
      const hasEvt = sp.sponsoredEventSlugs.some((slug) =>
        studentEvents.some((te) => te.includes("radar") || te.includes("power") || slug.includes(te))
      );
      if (hasProj || hasEvt || sp.id === "lockheed-martin") {
        ids.add(sp.id);
      }
    });
    return ids;
  }, [isStudent, loggedInStudent, sponsorsList]);

  // Modals inspection state
  const [inspectedStudent, setInspectedStudent] = useState<Student | null>(null);
  const [inspectedProject, setInspectedProject] = useState<IEEEProject | null>(null);
  const [projectTab, setProjectTab] = useState<ProjectTabType>("overview");
  const [inspectedEvent, setInspectedEvent] = useState<IEEEEvent | null>(null);
  const [inspectedJob, setInspectedJob] = useState<JobPosting | null>(null);

  // Identify the logged-in sponsor entity if authenticated as sponsor
  const userSponsor = useMemo(() => {
    if (role !== "sponsor") return null;

    const sponsorId = session?.sponsorId?.toLowerCase();
    const org = session?.organization?.toLowerCase().trim();
    const email = session?.email?.toLowerCase().trim();

    return (
      sponsorsList.find((s) => {
        if (sponsorId && s.id.toLowerCase() === sponsorId) return true;
        if (org && (s.name.toLowerCase() === org || s.id.toLowerCase() === org)) return true;
        if (org && (s.name.toLowerCase().includes(org) || org.includes(s.name.toLowerCase()))) return true;
        if (email) {
          const domain = email.split("@")[1];
          if (domain && s.website.toLowerCase().includes(domain.split(".")[0])) return true;
        }
        return false;
      }) || sponsorsList[0] || null
    );
  }, [role, session, sponsorsList]);

  // Fetch sponsors from /api/sponsors on mount
  useEffect(() => {
    async function loadSponsors() {
      try {
        const res = await fetch("/api/sponsors");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSponsorsList(json.data);
        }
      } catch {
        // Keep CURRENT_CHAPTER_SPONSORS fallback
      }
    }
    loadSponsors();
  }, []);

  // Sync URL search param with selected sponsor
  useEffect(() => {
    if (viewParam === "all") {
      setHasExplicitlyChosenAll(true);
      setSelectedSponsorId(null);
    } else if (sponsorParam) {
      setSelectedSponsorId(sponsorParam);
      setHasExplicitlyChosenAll(false);
    }
  }, [sponsorParam, viewParam]);

  // Sync member profile with URL search param
  useEffect(() => {
    if (students.length === 0 || !memberParam) {
      if (!memberParam) setInspectedStudent(null);
      return;
    }
    const match = findStudentBySlugOrId(students, memberParam);
    if (match) {
      setInspectedStudent(match);
    }
  }, [students, memberParam]);

  // When role === "sponsor", default to userSponsor's page unless user explicitly chose to see all sponsors
  const effectiveSponsorId = useMemo(() => {
    if (hasExplicitlyChosenAll) return null;
    if (selectedSponsorId) return selectedSponsorId;
    if (role === "sponsor" && userSponsor) {
      return userSponsor.id;
    }
    return null;
  }, [hasExplicitlyChosenAll, selectedSponsorId, role, userSponsor]);

  const tiers = ["All", "Platinum", "Gold", "Silver"];

  // Filter sponsors by search, tier, and member interaction
  const filteredSponsors = useMemo(() => {
    return sponsorsList.filter((s) => {
      if (isStudent && onlyMySponsors) {
        if (!studentSponsorIds.has(s.id)) {
          return false;
        }
      }
      if (selectedTier !== "All" && s.tier !== selectedTier) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesTagline = s.tagline.toLowerCase().includes(q);
        const matchesDesc = s.description.toLowerCase().includes(q);
        const matchesFocus = s.primaryFocus.some((f) => f.toLowerCase().includes(q));
        const matchesSkills = s.keySkills.some((sk) => sk.toLowerCase().includes(q));
        if (!matchesName && !matchesTagline && !matchesDesc && !matchesFocus && !matchesSkills) {
          return false;
        }
      }
      return true;
    });
  }, [sponsorsList, selectedTier, searchQuery, isStudent, onlyMySponsors, studentSponsorIds]);

  const activeSponsor = useMemo(() => {
    if (!effectiveSponsorId) return null;
    return (
      sponsorsList.find(
        (s) =>
          s.id.toLowerCase() === effectiveSponsorId.toLowerCase() ||
          s.name.toLowerCase() === effectiveSponsorId.toLowerCase()
      ) || null
    );
  }, [sponsorsList, effectiveSponsorId]);

  const activeSponsorRelations = useMemo(() => {
    if (!activeSponsor) return null;
    return getSponsorRelatedData(
      activeSponsor,
      SAMPLE_IEEE_PROJECTS,
      SAMPLE_IEEE_EVENTS,
      SAMPLE_JOB_POSTINGS,
      undefined,
      students
    );
  }, [activeSponsor, students]);

  const aggregateInteractions = useMemo(() => {
    return filteredSponsors.flatMap((sponsor) => {
      const details = getSponsorRelatedData(
        sponsor,
        SAMPLE_IEEE_PROJECTS,
        SAMPLE_IEEE_EVENTS,
        SAMPLE_JOB_POSTINGS,
        undefined,
        students
      );
      return details.interactions;
    });
  }, [filteredSponsors, students]);

  const handleSelectSponsor = (sponsor: ChapterSponsor) => {
    setSelectedSponsorId(sponsor.id);
    setHasExplicitlyChosenAll(false);
    const url = new URL(window.location.href);
    url.searchParams.set("sponsor", sponsor.id);
    url.searchParams.delete("view");
    url.searchParams.delete("company");
    window.history.pushState(null, "", url.pathname + url.search);
  };

  const handleBackToAll = () => {
    setSelectedSponsorId(null);
    setHasExplicitlyChosenAll(true);
    const url = new URL(window.location.href);
    url.searchParams.delete("sponsor");
    url.searchParams.delete("company");
    url.searchParams.set("view", "all");
    window.history.pushState(null, "", url.pathname + url.search);
  };

  const handleGoToMyHub = () => {
    if (!userSponsor) return;
    setSelectedSponsorId(userSponsor.id);
    setHasExplicitlyChosenAll(false);
    const url = new URL(window.location.href);
    url.searchParams.set("sponsor", userSponsor.id);
    url.searchParams.delete("view");
    url.searchParams.delete("company");
    window.history.pushState(null, "", url.pathname + url.search);
  };

  const handleSponsorCreated = (newSponsor: ChapterSponsor) => {
    setSponsorsList((prev) => {
      const filtered = prev.filter((s) => s.id !== newSponsor.id);
      return [newSponsor, ...filtered];
    });
    setToastMessage(`Onboarded ${newSponsor.name} and provisioned Sponsor login (${newSponsor.contactEmail})`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="page-wrapper font-sans transition-colors duration-200">
      {/* Primary Top Navigation */}
      <DirectoryNavbar
        role={role}
        theme={theme}
        toggleTheme={toggleTheme}
        handleRoleChange={handleRoleChange}
      />

      {/* Directory Page Header */}
      <DirectoryStatsHeader
        title={
          role === "sponsor" && activeSponsor && activeSponsor.id === userSponsor?.id
            ? `${activeSponsor.name} Partner Portal`
            : "Corporate Sponsors & Industry Initiatives"
        }
        description={
          role === "sponsor" && activeSponsor && activeSponsor.id === userSponsor?.id
            ? `Welcome, ${session?.displayName || activeSponsor.name}. Review your sponsored build projects, technical workshops, active job postings, and student interactions.`
            : "Explore active corporate partners supporting RSO USF build projects, technical workshops, equipment grants, recruiting pipelines, and member engagement."
        }
      >
        <div className="flex items-center gap-2 flex-wrap">
          {role === "sponsor" && userSponsor && (
            <div className="inline-flex p-0.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={handleBackToAll}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !effectiveSponsorId
                    ? "bg-white text-black shadow-2xs font-black"
                    : "text-neutral-500 hover:text-black font-semibold"
                }`}
              >
                All Sponsors
              </button>
              <button
                type="button"
                onClick={handleGoToMyHub}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  effectiveSponsorId === userSponsor.id
                    ? "bg-black text-white shadow-2xs font-black"
                    : "text-neutral-500 hover:text-black font-semibold"
                }`}
              >
                My Company Hub
              </button>
            </div>
          )}

          {isStudent && loggedInStudent && (
            <div className="inline-flex p-0.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => handleToggleMySponsors(false)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !onlyMySponsors
                    ? "bg-white text-black shadow-2xs font-black"
                    : "text-neutral-500 hover:text-black font-semibold"
                }`}
              >
                All Sponsors
              </button>
              <button
                type="button"
                onClick={() => handleToggleMySponsors(true)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  onlyMySponsors
                    ? "bg-black text-white shadow-2xs font-black"
                    : "text-neutral-500 hover:text-black font-semibold"
                }`}
              >
                My Project Sponsors
              </button>
            </div>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsSponsorFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white font-bold text-xs cursor-pointer shrink-0"
            >
              <Plus size={14} />
              <span>Onboard Chapter Sponsor</span>
            </button>
          )}
        </div>
      </DirectoryStatsHeader>

      <main className="max-w-7xl w-full mx-auto px-4 pb-8 flex flex-col gap-6">
        {/* If a sponsor is selected, display their comprehensive Hub */}
        {activeSponsor && activeSponsorRelations ? (
          <SponsorDetailView
            relations={activeSponsorRelations}
            onBack={handleBackToAll}
            onSelectStudent={(student) => setInspectedStudent(student)}
            onSelectProject={(project, tab) => {
              setInspectedProject(project);
              setProjectTab(tab || "overview");
            }}
            onSelectEvent={(event) => setInspectedEvent(event)}
            onSelectJob={(job) => setInspectedJob(job)}
            role={role}
            onRequestInitiative={role === "sponsor" ? () => setIsInitiativeFormOpen(true) : undefined}
          />
        ) : (
          /* Catalog View: Search, Filter Pills & Sponsor Cards */
          <div className="flex flex-col gap-6">
            {/* Wide Open Banner Introducing Initiative Creation & Services (Only visible to Sponsors) */}
            {role === "sponsor" && (
              <SponsorInitiativesBanner
                onRequestInitiative={() => setIsInitiativeFormOpen(true)}
                sponsorName={userSponsor?.name}
                isLoggedInSponsor={true}
              />
            )}

            {/* Fast-return to My Hub alert when viewing All Sponsors */}
            {role === "sponsor" && userSponsor && (
              <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <Building2 size={16} className="text-black shrink-0" />
                  <span className="text-neutral-800">
                    Browsing the directory as <strong className="text-black font-bold">{userSponsor.name}</strong>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleGoToMyHub}
                  className="px-3.5 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer self-start sm:self-auto transition-all shadow-2xs"
                >
                  Return to My Partner Hub &rarr;
                </button>
              </div>
            )}

            {/* Controls Bar */}
            <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <SearchInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search sponsors by name, technology, or focus..."
                className="w-full sm:max-w-md"
                ariaLabel="Search corporate sponsors"
              />

              <FilterPills
                options={tiers}
                selected={selectedTier}
                onSelect={handleTierChange}
                ariaLabel="Filter sponsors by tier"
              />
            </section>

            {/* Aggregate Interacting Student & Talent Statistics */}
            <SponsorEngagementStats interactions={aggregateInteractions} />

            {/* Results Grid */}
            {filteredSponsors.length === 0 ? (
              <EmptyState
                icon={<Building2 size={32} />}
                headline="No corporate sponsors found"
                subtext="No partners matched your search query or tier filters. Try adjusting your search criteria."
                actionLabel="Reset Filters"
                onAction={() => {
                  setSearchQuery("");
                  setSelectedTier("All");
                  updateSponsorUrl({ q: null, search: null, tier: null });
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSponsors.map((sponsor) => {
                  const details = getSponsorRelatedData(
                    sponsor,
                    SAMPLE_IEEE_PROJECTS,
                    SAMPLE_IEEE_EVENTS,
                    SAMPLE_JOB_POSTINGS,
                    undefined,
                    students
                  );
                  return (
                    <SponsorCard
                      key={sponsor.id}
                      sponsor={sponsor}
                      projectCount={details.projects.length}
                      eventCount={details.events.length}
                      jobCount={details.jobs.length}
                      interactionCount={details.interactions.length}
                      onSelect={handleSelectSponsor}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* RSO Leadership Form 1: Onboard Chapter Sponsor Modal */}
      {isSponsorFormOpen && (
        <LeadershipSponsorForm
          role={role}
          onClose={() => setIsSponsorFormOpen(false)}
          onSponsorCreated={handleSponsorCreated}
        />
      )}

      {/* Sponsor Form 5: Request Chapter Initiative Modal */}
      {isInitiativeFormOpen && (
        <SponsorInitiativeForm
          sponsor={activeSponsor || userSponsor || sponsorsList[0]}
          role={role}
          defaultEmail={session?.email}
          onClose={() => setIsInitiativeFormOpen(false)}
          onInitiativeRequested={(inquiryTitle) => {
            setToastMessage(`Initiative proposal "${inquiryTitle}" sent to RSO Leadership (leadership@rsousf.org)`);
            setTimeout(() => setToastMessage(null), 5000);
          }}
        />
      )}

      {/* Student Portfolio Modal */}
      {inspectedStudent && (
        <PortfolioModal
          student={inspectedStudent}
          onClose={() => {
            setInspectedStudent(null);
            updateSponsorUrl({ member: null, student: null });
          }}
          adminMode={isAdmin}
          role={role}
          allStudents={students}
        />
      )}

      {/* Project Modal */}
      {inspectedProject && (
        <ProjectModal
          project={inspectedProject}
          students={students}
          role={role}
          initialTab={projectTab}
          onClose={() => setInspectedProject(null)}
        />
      )}

      {/* Event Modal */}
      {inspectedEvent && (
        <EventModal
          event={inspectedEvent}
          role={role}
          onClose={() => setInspectedEvent(null)}
          students={students}
          onSelectMember={(memberId) => {
            const match = findStudentBySlugOrId(students, memberId);
            if (match) {
              setInspectedStudent(match);
              updateSponsorUrl({ member: getStudentSlug(match) });
            }
          }}
        />
      )}

      {/* Job Detail Modal */}
      {inspectedJob && students.length > 0 && (
        <JobDetailModal
          job={inspectedJob}
          activeStudent={students[0]}
          onClose={() => setInspectedJob(null)}
          onApplySuccess={() => {}}
        />
      )}

      {/* Toast Feedback */}
      <ToastNotification toastMessage={toastMessage} />
    </div>
  );
}

export default function SponsorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading RSO USF Corporate Sponsors Hub...
        </div>
      }
    >
      <SponsorsPageContent />
    </Suspense>
  );
}
