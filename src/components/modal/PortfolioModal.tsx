"use client";

import React, { useState, useEffect } from "react";
import { Student, EventEntry } from "@/data/students";
import { useFocusTrap } from "../common/useFocusTrap";
import Tooltip from "../common/Tooltip";
import StudentUpperInfo from "./StudentUpperInfo";
import StudentLowerInfo from "./StudentLowerInfo";
import ModalTabNavigation, { TabType } from "./tabs/ModalTabNavigation";
import ProjectsTab from "./tabs/ProjectsTab";
import SkillsTab from "./tabs/SkillsTab";
import EventsTab from "./tabs/EventsTab";
import ContactTab from "./tabs/ContactTab";
import EventModal from "./event/EventModal";
import { IEEEEvent } from "@/data/events";
import { findMatchingIeeeEvent } from "@/lib/rsoAffiliation";
import { UserRole } from "@/hooks/useRoleManager";
import { X, Share2, Check } from "lucide-react";
import { getStudentSlug } from "@/lib/studentSlug";

interface PortfolioModalProps {
  student: Student;
  onClose: () => void;
  onToggleFlag?: (id: string) => void;
  onResolve?: (student: Student) => void;
  adminMode?: boolean;
  role?: UserRole;
  onSelectProject?: (projectSlugOrId: string) => void;
  onSelectEvent?: (event: EventEntry | IEEEEvent) => void;
  allStudents?: Student[];
}

export default function PortfolioModal({
  student,
  onClose,
  adminMode,
  role = "admin",
  onSelectProject,
  onSelectEvent,
  allStudents,
}: PortfolioModalProps) {
  const [currentStudent, setCurrentStudent] = useState<Student>(student);
  const [activeTab, setActiveTab] = useState<TabType>("about");
  const [activeEventModal, setActiveEventModal] = useState<IEEEEvent | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const focusTrapRef = useFocusTrap(true, onClose);

  const handleShareProfile = async () => {
    const slug = getStudentSlug(currentStudent);
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/u/${slug}` : `/u/${slug}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedShareLink(true);
        setTimeout(() => setCopiedShareLink(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    setCurrentStudent(student);
  }, [student]);

  const handleSelectEvent = (evt: EventEntry) => {
    if (onSelectEvent) {
      onSelectEvent(evt);
      return;
    }
    const matched = findMatchingIeeeEvent(evt);
    if (matched) {
      setActiveEventModal(matched);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setActiveTab((prev) => (prev === "about" ? "projects" : prev));
      }
    };

    const timer = setTimeout(handleResize, 0);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-modal-overlay backdrop-blur-md cursor-pointer"
      >
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${currentStudent.name} - Engineering Portfolio`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-full md:h-[80vh] rounded-none md:rounded-3xl bg-white border-0 md:border border-neutral-300 shadow-2xl flex flex-col max-h-screen md:max-h-[85vh] animate-scale-in cursor-default overflow-hidden"
      >
        {/* Action Header Controls (Share & Close) */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={handleShareProfile}
            type="button"
            aria-label="Copy shareable member portfolio link"
            title="Copy shareable link to this member's portfolio"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-300 text-black text-xs font-bold shadow-2xs hover:bg-neutral-50 cursor-pointer transition-colors"
          >
            {copiedShareLink ? (
              <>
                <Check size={14} className="text-black stroke-[2.5]" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 size={13} className="text-black" />
                <span className="hidden sm:inline">Share Profile</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            type="button"
            aria-label="Close candidate portfolio modal"
            className="p-2 rounded-full bg-neutral-100 border border-neutral-300 text-black focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none cursor-pointer hover:bg-neutral-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Container Wrapper */}
        <div className="w-full flex flex-col md:flex-row overflow-hidden h-full">
          {/* Left Side Panel: Profile Hero & Desktop Metadata */}
          <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col h-full overflow-hidden relative z-10 bg-neutral-50 hidden md:flex">
            <div className="pb-5 border-b border-neutral-200 shrink-0">
              <StudentUpperInfo student={currentStudent} adminMode={adminMode} />
            </div>
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden pt-5 pb-1 pr-1 w-full">
              <StudentLowerInfo
                student={currentStudent}
                adminMode={adminMode}
                onSelectProject={onSelectProject}
                onClose={onClose}
                onSelectTab={setActiveTab}
                role={role}
              />
            </div>
          </div>

          {/* Right Side Panel: Interactive Tabs */}
          <div className="w-full md:w-3/5 p-5 md:p-6 pt-12 md:pt-6 flex flex-col h-full relative z-10 bg-slate-50/70 overflow-hidden">
            {/* Tab Navigation Header */}
            <ModalTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} role={role} />

            {/* Tab Content Display */}
            <div className={`grow pr-1 ${activeTab === "about" ? "overflow-hidden" : "overflow-y-auto"} md:overflow-y-auto`}>
              {/* About / Info Panel (Mobile Only) */}
              {activeTab === "about" && (
                <div className="flex flex-col h-full md:hidden relative overflow-hidden animate-fade-in">
                  <div className="grow overflow-y-auto pb-8 pr-1 flex flex-col min-h-full">
                    <div className="pb-5 border-b border-slate-200 shrink-0">
                      <StudentUpperInfo student={currentStudent} adminMode={adminMode} />
                    </div>
                    <div className="flex-1 flex flex-col min-h-0 pt-5 w-full">
                      <StudentLowerInfo
                        student={currentStudent}
                        adminMode={adminMode}
                        onSelectProject={onSelectProject}
                        onClose={onClose}
                        onSelectTab={setActiveTab}
                        role={role}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Panel */}
              {activeTab === "projects" && (
                <ProjectsTab
                  projects={currentStudent.projects}
                  formatDateStr={formatDateStr}
                  student={currentStudent}
                  onSelectProject={onSelectProject}
                  onCloseModal={onClose}
                />
              )}

              {/* Skills Panel */}
              {activeTab === "skills" && (
                <SkillsTab
                  student={currentStudent}
                  formatDateStr={formatDateStr}
                  role={role}
                  onClose={onClose}
                />
              )}

              {/* Events Panel */}
              {activeTab === "events" && (
                <EventsTab
                  events={currentStudent.events}
                  formatDateStr={formatDateStr}
                  role={role}
                  onClose={onClose}
                  onSelectEvent={handleSelectEvent}
                />
              )}

              {/* Recruiter Contact Panel (Private to Premium Recruiters & Sponsors) */}
              {activeTab === "contact" && role !== "standard" && (
                <ContactTab student={currentStudent} role={role} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {activeEventModal && (
      <EventModal
        event={activeEventModal}
        role={role}
        onClose={() => setActiveEventModal(null)}
        students={allStudents}
        onSelectMember={(memberId) => {
          if (allStudents && allStudents.length > 0) {
            const found = allStudents.find(
              (s) => s.id === memberId || s.name.toLowerCase() === memberId.toLowerCase()
            );
            if (found) {
              setCurrentStudent(found);
              setActiveEventModal(null);
            }
          }
        }}
      />
    )}
  </>
);
}
