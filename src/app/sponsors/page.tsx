"use client";

/**
 * @file page.tsx — IEEE UCF Corporate Sponsors & Industry Initiatives Page
 * @description Dedicated partner catalog showcasing corporate sponsors, sponsored build projects,
 * technical workshops, corporate job postings, engineering skills, and interacting student members.
 */

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Award, Building2, Search, Users, Sparkles, FolderGit2 } from "lucide-react";
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
import SearchInput from "@/components/common/SearchInput";
import FilterPills from "@/components/common/FilterPills";
import EmptyState from "@/components/common/EmptyState";
import PortfolioModal from "@/components/modal/PortfolioModal";
import ProjectModal from "@/components/modal/project/ProjectModal";
import EventModal from "@/components/modal/event/EventModal";
import JobDetailModal from "@/components/modal/job/JobDetailModal";
import { ProjectTabType } from "@/components/modal/project/ProjectTabNavigation";

function SponsorsPageContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { role, handleRoleChange, isAdmin } = useRoleManager();
  const { students } = useStudentData();

  const searchParams = useSearchParams();
  const sponsorParam = searchParams.get("sponsor") || searchParams.get("company");

  const [sponsorsList, setSponsorsList] = useState<ChapterSponsor[]>(CURRENT_CHAPTER_SPONSORS);
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(sponsorParam);
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals inspection state
  const [inspectedStudent, setInspectedStudent] = useState<Student | null>(null);
  const [inspectedProject, setInspectedProject] = useState<IEEEProject | null>(null);
  const [projectTab, setProjectTab] = useState<ProjectTabType>("overview");
  const [inspectedEvent, setInspectedEvent] = useState<IEEEEvent | null>(null);
  const [inspectedJob, setInspectedJob] = useState<JobPosting | null>(null);

  // Sync URL search param with selected sponsor
  useEffect(() => {
    if (sponsorParam) {
      setSelectedSponsorId(sponsorParam);
    }
  }, [sponsorParam]);

  const tiers = ["All", "Platinum", "Gold", "Silver"];

  // Filter sponsors by search and tier
  const filteredSponsors = useMemo(() => {
    return sponsorsList.filter((s) => {
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
  }, [sponsorsList, selectedTier, searchQuery]);

  const activeSponsor = useMemo(() => {
    if (!selectedSponsorId) return null;
    return (
      sponsorsList.find(
        (s) =>
          s.id.toLowerCase() === selectedSponsorId.toLowerCase() ||
          s.name.toLowerCase() === selectedSponsorId.toLowerCase()
      ) || null
    );
  }, [sponsorsList, selectedSponsorId]);

  const activeSponsorRelations = useMemo(() => {
    if (!activeSponsor) return null;
    return getSponsorRelatedData(activeSponsor, SAMPLE_IEEE_PROJECTS, SAMPLE_IEEE_EVENTS, SAMPLE_JOB_POSTINGS, undefined, students);
  }, [activeSponsor, students]);

  const handleSelectSponsor = (sponsor: ChapterSponsor) => {
    setSelectedSponsorId(sponsor.id);
    const url = new URL(window.location.href);
    url.searchParams.set("sponsor", sponsor.id);
    window.history.pushState(null, "", url.pathname + url.search);
  };

  const handleBackToAll = () => {
    setSelectedSponsorId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("sponsor");
    url.searchParams.delete("company");
    window.history.pushState(null, "", url.pathname + (url.search ? url.search : ""));
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
        title="Corporate Sponsors & Industry Initiatives"
        description="Explore active corporate partners supporting IEEE UCF build projects, technical workshops, equipment grants, recruiting pipelines, and member engagement."
      />

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
          />
        ) : (
          /* Catalog View: Search, Filter Pills & Sponsor Cards */
          <div className="flex flex-col gap-6">
            {/* Controls Bar */}
            <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search sponsors by name, technology, or focus..."
                className="w-full sm:max-w-md"
                ariaLabel="Search corporate sponsors"
              />

              <FilterPills
                options={tiers}
                selected={selectedTier}
                onSelect={setSelectedTier}
                ariaLabel="Filter sponsors by tier"
              />
            </section>

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
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSponsors.map((sponsor) => {
                  const details = getSponsorRelatedData(sponsor, SAMPLE_IEEE_PROJECTS, SAMPLE_IEEE_EVENTS, SAMPLE_JOB_POSTINGS, undefined, students);
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
      {/* Student Portfolio Modal */}
      {inspectedStudent && (
        <PortfolioModal
          student={inspectedStudent}
          onClose={() => setInspectedStudent(null)}
          adminMode={isAdmin}
          role={role}
          onToggleFlag={() => {}}
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
            const match = students.find((s) => s.id === memberId);
            if (match) setInspectedStudent(match);
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
    </div>
  );
}

export default function SponsorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading IEEE UCF Corporate Sponsors Hub...
        </div>
      }
    >
      <SponsorsPageContent />
    </Suspense>
  );
}
