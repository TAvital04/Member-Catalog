"use client";

/**
 * @file page.tsx — Shareable Student Member Profile Page (/u/[slug])
 * @description Dedicated, standalone verified candidate showcase for resumes, LinkedIn, and external sharing.
 * Renders member credentials, verified chapter projects, technical competencies, and workshop attendance.
 * Website recruiter contact forms and email messaging are strictly omitted to protect candidate privacy.
 */

import React, { useState, useMemo, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStudentData } from "@/hooks/useStudentData";
import { findStudentBySlugOrId, getStudentSlug } from "@/lib/studentSlug";
import { useRoleManager } from "@/hooks/useRoleManager";
import { useThemeManager } from "@/hooks/useThemeManager";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import StudentUpperInfo from "@/components/modal/StudentUpperInfo";
import StudentLowerInfo from "@/components/modal/StudentLowerInfo";
import ModalTabNavigation, { TabType } from "@/components/modal/tabs/ModalTabNavigation";
import ProjectsTab from "@/components/modal/tabs/ProjectsTab";
import SkillsTab from "@/components/modal/tabs/SkillsTab";
import EventsTab from "@/components/modal/tabs/EventsTab";
import { EventEntry, Student } from "@/data/students";
import { findMatchingIeeeEvent } from "@/lib/rsoAffiliation";
import {
  ShieldCheck,
  Share2,
  Check,
  ArrowLeft,
  UserX,
  ExternalLink,
  Award,
} from "lucide-react";

function SharedMemberProfileContent() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
  const slug = decodeURIComponent(rawSlug || "");

  const { theme, toggleTheme } = useThemeManager();
  const { role, setRole, session, isAdmin, isSponsor } = useRoleManager();
  const { students, isLoading } = useStudentData(role);

  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const [copiedLink, setCopiedLink] = useState(false);

  // Find candidate by slug, identifier, or name
  const student = useMemo(() => {
    return findStudentBySlugOrId(students, slug);
  }, [students, slug]);

  const handleShare = async () => {
    if (!student) return;
    const studentSlug = getStudentSlug(student);
    const url = typeof window !== "undefined" ? `${window.location.origin}/u/${studentSlug}` : `/u/${studentSlug}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const formatDateStr = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) {
      try {
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      } catch {
        return dateStr;
      }
    }
    return dateStr;
  };

  const handleSelectEvent = (evt: EventEntry) => {
    const matched = findMatchingIeeeEvent(evt);
    if (matched) {
      router.push(`/events?event=${matched.slug}`);
    } else {
      router.push(`/events?q=${encodeURIComponent(evt.title)}`);
    }
  };

  const handleSelectProject = (projectSlugOrId: string) => {
    router.push(`/projects?project=${encodeURIComponent(projectSlugOrId)}`);
  };

  // Loading State
  if (isLoading && !student) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <DirectoryNavbar
          theme={theme}
          toggleTheme={toggleTheme}
          role={role}
          onRoleChange={setRole}
          session={session}
        />
        <div className="grow flex items-center justify-center p-4">
          <div className="p-8 rounded-2xl bg-white border border-neutral-300 shadow-2xs max-w-sm w-full text-center">
            <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-sm font-bold text-black mb-1">Loading Candidate Portfolio...</h2>
            <p className="text-xs text-neutral-500">Resolving verified chapter credentials</p>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <DirectoryNavbar
          theme={theme}
          toggleTheme={toggleTheme}
          role={role}
          onRoleChange={setRole}
          session={session}
        />
        <main className="grow flex items-center justify-center p-4">
          <div className="p-8 sm:p-10 rounded-2xl border border-neutral-300 bg-white flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xs max-w-md w-full">
            <div className="w-14 h-14 rounded-full bg-neutral-100 text-black border border-neutral-300 flex items-center justify-center shrink-0 mb-4">
              <UserX size={24} className="text-black" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-100 text-black border border-neutral-300 mb-2">
              Portfolio Not Found
            </span>

            <h1 className="text-base sm:text-lg font-black text-black mb-2">
              Candidate Profile Unavailable
            </h1>

            <p className="text-xs text-neutral-600 leading-relaxed mb-6 font-sans">
              We could not locate an active engineering member portfolio matching &ldquo;{slug}&rdquo;. The member may have updated their profile slug or changed visibility settings.
            </p>

            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-black text-white font-bold rounded-xl text-xs cursor-pointer text-center inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Browse Chapter Directory</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <DirectoryNavbar
        theme={theme}
        toggleTheme={toggleTheme}
        role={role}
        onRoleChange={setRole}
        session={session}
      />

      {/* Profile Verification Banner & Breadcrumb */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Directory</span>
            </Link>
            <span className="text-neutral-300 select-none">|</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-[10px] font-bold text-black uppercase tracking-wider">
              <ShieldCheck size={13} className="text-black" />
              <span>IEEE USF Verified Student Member</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold shadow-2xs cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check size={14} className="text-white stroke-[2.5]" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 size={13} className="text-white" />
                <span>Share Profile</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Main Candidate Portfolio View */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 grow flex flex-col gap-6">
        {/* Anti-Scraping / No-Contact Policy Advisory Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-neutral-300 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-300 flex items-center justify-center text-black shrink-0">
              <Award size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block leading-none">
                Verified Candidate Profile
              </span>
              <span className="text-xs font-bold text-black truncate block mt-0.5">
                Official RSO USF engineering portfolio showcase • Website contact forms disabled for privacy
              </span>
            </div>
          </div>

          <div className="text-[11px] font-semibold text-neutral-500">
            Profile URL: <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-black">/u/{getStudentSlug(student)}</code>
          </div>
        </div>

        {/* Portfolio Showcase Card (Monochrome 2-column layout) */}
        <div className="w-full bg-white border border-neutral-300 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[640px]">
          {/* Left Metadata Panel */}
          <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-neutral-200 bg-neutral-50 flex flex-col">
            <div className="pb-5 border-b border-neutral-200 shrink-0">
              <StudentUpperInfo student={student} adminMode={isAdmin} />
            </div>
            <div className="flex-1 flex flex-col pt-5 w-full">
              <StudentLowerInfo
                student={student}
                adminMode={isAdmin}
                onSelectProject={handleSelectProject}
                onSelectTab={setActiveTab}
                role={role}
              />
            </div>
          </div>

          {/* Right Detailed Showcase Panel */}
          <div className="w-full md:w-3/5 p-6 flex flex-col bg-slate-50/70 overflow-hidden">
            {/* ModalTabNavigation with hideContact=true and hasActionButtons=false */}
            <ModalTabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              role={role}
              hideContact={true}
              hasActionButtons={false}
            />

            {/* Tab Views */}
            <div className="grow overflow-y-auto pr-1">
              {activeTab === "projects" && (
                <ProjectsTab
                  projects={student.projects}
                  formatDateStr={formatDateStr}
                  student={student}
                  onSelectProject={handleSelectProject}
                />
              )}

              {activeTab === "skills" && (
                <SkillsTab
                  student={student}
                  formatDateStr={formatDateStr}
                  role={role}
                />
              )}

              {activeTab === "events" && (
                <EventsTab
                  events={student.events}
                  formatDateStr={formatDateStr}
                  role={role}
                  onSelectEvent={handleSelectEvent}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SharedMemberProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading Candidate Portfolio...
        </div>
      }
    >
      <SharedMemberProfileContent />
    </Suspense>
  );
}
