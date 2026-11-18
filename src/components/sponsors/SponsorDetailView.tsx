"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ExternalLink,
  MapPin,
  Calendar,
  FolderGit2,
  Briefcase,
  Users,
  Award,
  Sparkles,
  Wrench,
  Mail,
} from "lucide-react";
import { ChapterSponsor, SponsorDetailedRelations } from "@/data/sponsors";
import { Student } from "@/data/students";
import { IEEEProject } from "@/data/projects";
import { IEEEEvent } from "@/data/events";
import { JobPosting } from "@/data/jobs";
import ProjectCard from "@/components/projects/ProjectCard";
import EventCard from "@/components/events/EventCard";
import JobCard from "@/components/jobs/JobCard";
import SponsorInitiativesList from "./SponsorInitiativesList";
import SponsorMemberRoster from "./SponsorMemberRoster";
import SponsorEngagementStats from "./SponsorEngagementStats";
import SegmentedControl from "@/components/common/SegmentedControl";
import EmptyState from "@/components/common/EmptyState";
import Tooltip from "@/components/common/Tooltip";
import { ProjectTabType } from "@/components/modal/project/ProjectTabNavigation";

export interface SponsorDetailViewProps {
  relations: SponsorDetailedRelations;
  onBack: () => void;
  onSelectStudent: (student: Student) => void;
  onSelectProject: (project: IEEEProject, tab?: ProjectTabType) => void;
  onSelectEvent: (event: IEEEEvent) => void;
  onSelectJob: (job: JobPosting) => void;
}

export type SponsorSubTab = "initiatives" | "projects" | "events" | "jobs" | "skills" | "interactions";

/**
 * SponsorDetailView — Full-featured initiative & engagement hub for an individual sponsor
 */
export default function SponsorDetailView({
  relations,
  onBack,
  onSelectStudent,
  onSelectProject,
  onSelectEvent,
  onSelectJob,
}: SponsorDetailViewProps) {
  const { sponsor, projects, events, jobs, skills, interactions } = relations;
  const [activeTab, setActiveTab] = useState<SponsorSubTab>("initiatives");

  const tierColor = "bg-white text-black border-neutral-300 font-bold";

  const subTabOptions = [
    { value: "initiatives" as const, label: `Initiatives (${sponsor.initiatives.length})`, icon: <Sparkles size={13} /> },
    { value: "projects" as const, label: `Projects (${projects.length})`, icon: <FolderGit2 size={13} /> },
    { value: "events" as const, label: `Workshops & Talks (${events.length})`, icon: <Calendar size={13} /> },
    { value: "jobs" as const, label: `Careers (${jobs.length})`, icon: <Briefcase size={13} /> },
    { value: "skills" as const, label: `Skills & Tools (${skills.length})`, icon: <Wrench size={13} /> },
    { value: "interactions" as const, label: `Interactions (${interactions.length})`, icon: <Users size={13} /> },
  ];

  // Helper date formatting for EventCard
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return iso;
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // Scroll to section when tab is clicked
  const handleTabChange = (tab: SponsorSubTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const target = document.getElementById(`sponsor-section-${tab}`);
      if (target) {
        const yOffset = -120; // offset for directory navbar + sticky tabs bar
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        if (process.env.NODE_ENV !== "test" && typeof window.scrollTo === "function") {
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
      }
    }
  };

  // Track active section on scroll to keep sticky tab highlighted
  React.useEffect(() => {
    const sectionIds: SponsorSubTab[] = ["initiatives", "projects", "events", "jobs", "skills", "interactions"];
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 140;
          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const id = sectionIds[i];
            const el = document.getElementById(`sponsor-section-${id}`);
            if (el && el.offsetTop <= scrollPosition) {
              setActiveTab(id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg bg-white border border-neutral-300 text-xs font-bold text-black cursor-pointer self-start select-none"
      >
        <span>Back to All Chapter Sponsors</span>
      </button>

      {/* Hero Overview Panel */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-300 text-black font-black text-xl flex items-center justify-center shrink-0 shadow-2xs">
              {sponsor.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {sponsor.name}
                </h2>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${tierColor}`}>
                  <Award size={11} className="shrink-0 text-black" />
                  <span>{sponsor.tier} Partner</span>
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-0.5">
                {sponsor.tagline}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400" />
                  {sponsor.location}
                </span>
                <span>•</span>
                <span>Official Partner Since {sponsor.partnerSince}</span>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-md btn-secondary-surface flex-1 sm:flex-none"
            >
              <span>Corporate Website</span>
            </a>
            <a
              href={sponsor.careersUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-md btn-primary-amber flex-1 sm:flex-none"
            >
              <span>Explore Careers</span>
            </a>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          {sponsor.description}
        </p>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleTabChange("initiatives")}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center cursor-pointer group"
          >
            <span className="block text-base font-black text-slate-900 group-hover:text-black transition-colors">
              {sponsor.initiatives.length}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
              Initiatives
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("projects")}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center cursor-pointer group"
          >
            <span className="block text-base font-black text-slate-900 group-hover:text-black transition-colors">
              {projects.length}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
              Projects
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("events")}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center cursor-pointer group"
          >
            <span className="block text-base font-black text-slate-900 group-hover:text-black transition-colors">
              {events.length}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
              Workshops
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("jobs")}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center cursor-pointer group"
          >
            <span className="block text-base font-black text-slate-900 group-hover:text-black transition-colors">
              {jobs.length}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
              Open Roles
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("skills")}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center cursor-pointer group"
          >
            <span className="block text-base font-black text-slate-900 group-hover:text-black transition-colors">
              {skills.length}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
              Key Skills
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("interactions")}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center cursor-pointer group"
          >
            <span className="block text-base font-black text-slate-900 group-hover:text-black transition-colors">
              {interactions.length}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
              Interactions
            </span>
          </button>
        </div>

        {/* Primary Focus Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Focus Disciplines:
          </span>
          {sponsor.primaryFocus.map((focus, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg text-[10.5px] bg-slate-100 border border-slate-200 text-slate-700 font-medium"
            >
              {focus}
            </span>
          ))}
        </div>
      </div>

      {/* Interacting Student Demographics & Skill Statistics */}
      <SponsorEngagementStats
        interactions={interactions}
        sponsorName={sponsor.name}
      />

      {/* Sticky Quick-Jump Navigation Tabs */}
      <div className="sticky top-14 md:top-16 z-20 py-2.5 bg-white/95 backdrop-blur-md border-b border-neutral-200 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <SegmentedControl
          options={subTabOptions}
          value={activeTab}
          onChange={handleTabChange}
          ariaLabel="Sponsor details section"
        />
      </div>

      {/* Unified All-in-One Scrollable Content Flow */}
      <div className="flex flex-col gap-10">
        {/* 1. Initiatives & Grants */}
        <section id="sponsor-section-initiatives" className="scroll-mt-32 flex flex-col gap-4">
          <SponsorInitiativesList
            initiatives={sponsor.initiatives}
            sponsorName={sponsor.name}
          />
        </section>

        {/* 2. Sponsored Projects */}
        <section id="sponsor-section-projects" className="scroll-mt-32 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
            <h3 className="section-title">
              <span>Sponsored Hardware Builds & Chapter Projects</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {projects.length}
              </span>
            </h3>
          </div>

          {projects.length === 0 ? (
            <EmptyState
              icon={<FolderGit2 size={32} />}
              headline="No active sponsored projects"
              subtext="Currently no active hardware build teams are tagged with this sponsor."
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {projects.map((prj) => (
                <ProjectCard
                  key={prj.id}
                  project={prj}
                  onOpenModal={(p, tab) => onSelectProject(p, tab)}
                  onSelectMember={(_, name, email) => {
                    // find student
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. Workshops & Tech Talks */}
        <section id="sponsor-section-events" className="scroll-mt-32 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
            <h3 className="section-title">
              <span>Partner Tech Talks & Hands-On Workshops</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {events.length}
              </span>
            </h3>
          </div>

          {events.length === 0 ? (
            <EmptyState
              icon={<Calendar size={32} />}
              headline="No workshops listed"
              subtext="No previous or upcoming chapter workshops are linked to this corporate sponsor."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onClick={onSelectEvent}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. Career Opportunities */}
        <section id="sponsor-section-jobs" className="scroll-mt-32 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
            <h3 className="section-title">
              <span>Corporate Job Opportunities & Internships</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {jobs.length} Positions
              </span>
            </h3>
          </div>

          {jobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={32} />}
              headline="No active positions listed"
              subtext="This partner currently does not have active postings on the RSO USF jobs board."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  hasApplied={false}
                  onSelectJob={onSelectJob}
                />
              ))}
            </div>
          )}
        </section>

        {/* 5. Key Skills & Tools */}
        <section id="sponsor-section-skills" className="scroll-mt-32 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
            <div>
              <h3 className="section-title">
                <span>Associated Technical Skills, Hardware & Tools</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {skills.length} Competencies
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Technologies taught in {sponsor.name} workshops, used in sponsored projects, or required for corporate engineering roles.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill, idx) => (
                <Link
                  key={idx}
                  href={`/?skills=${encodeURIComponent(skill)}`}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-xs font-semibold text-black cursor-pointer shadow-2xs inline-flex items-center"
                >
                  <span>{skill}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Student Interactions & Engaged Members */}
        <section id="sponsor-section-interactions" className="scroll-mt-32 flex flex-col gap-4">
          <SponsorMemberRoster
            interactions={interactions}
            sponsorName={sponsor.name}
            onSelectStudent={onSelectStudent}
          />
        </section>
      </div>
    </div>
  );
}
