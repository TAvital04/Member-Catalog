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
  ArrowLeft,
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
import SegmentedControl from "@/components/common/SegmentedControl";
import EmptyState from "@/components/common/EmptyState";
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

  const tierColor =
    sponsor.tier === "Platinum"
      ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30"
      : sponsor.tier === "Gold"
      ? "bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30"
      : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

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

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="btn-base btn-sm btn-ghost-surface self-start text-xs font-bold"
      >
        <ArrowLeft size={14} />
        <span>Back to All Chapter Sponsors</span>
      </button>

      {/* Hero Overview Panel */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-black text-xl flex items-center justify-center shrink-0 shadow-2xs">
              {sponsor.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {sponsor.name}
                </h2>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs flex items-center gap-1 ${tierColor}`}>
                  <Award size={11} />
                  <span>{sponsor.tier} Partner</span>
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
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
              <ExternalLink size={12} />
            </a>
            <a
              href={sponsor.careersUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-md btn-primary-amber flex-1 sm:flex-none"
            >
              <span>Explore Careers</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-4xl">
          {sponsor.description}
        </p>

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

      {/* Sub-Navigation Tabs */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <SegmentedControl
          options={subTabOptions}
          value={activeTab}
          onChange={setActiveTab}
          ariaLabel="Sponsor details section"
        />
      </div>

      {/* Tab Panels */}
      <div className="min-h-[300px]">
        {/* 1. Initiatives & Grants */}
        {activeTab === "initiatives" && (
          <SponsorInitiativesList
            initiatives={sponsor.initiatives}
            sponsorName={sponsor.name}
          />
        )}

        {/* 2. Sponsored Projects */}
        {activeTab === "projects" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="section-title">
                <FolderGit2 size={16} className="text-amber-500" />
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
          </div>
        )}

        {/* 3. Workshops & Tech Talks */}
        {activeTab === "events" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="section-title">
                <Calendar size={16} className="text-amber-500" />
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
          </div>
        )}

        {/* 4. Career Opportunities */}
        {activeTab === "jobs" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="section-title">
                <Briefcase size={16} className="text-amber-500" />
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
                subtext="This partner currently does not have active postings on the IEEE UCF jobs board."
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
          </div>
        )}

        {/* 5. Key Skills & Tools */}
        {activeTab === "skills" && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
            <div>
              <h3 className="section-title">
                <Wrench size={16} className="text-amber-500" />
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
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-500/15 border border-slate-200 hover:border-amber-500/40 text-xs font-mono font-medium text-slate-800 hover:text-amber-900 transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                  title={`Filter candidates with skill: ${skill}`}
                >
                  <span>{skill}</span>
                  <span className="text-[10px] text-slate-400">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 6. Student Interactions & Engaged Members */}
        {activeTab === "interactions" && (
          <SponsorMemberRoster
            interactions={interactions}
            sponsorName={sponsor.name}
            onSelectStudent={onSelectStudent}
          />
        )}
      </div>
    </div>
  );
}
