"use client";

import React, { useState, useEffect } from "react";
import { Student } from "../../data/students";
import { useFocusTrap } from "../common/useFocusTrap";
import Tooltip from "../common/Tooltip";
import StudentUpperInfo from "./StudentUpperInfo";
import StudentLowerInfo from "./StudentLowerInfo";
import TimelineSection from "../timeline/TimelineSection";
import ModalTabNavigation, { TabType } from "./tabs/ModalTabNavigation";
import ProjectsTab from "./tabs/ProjectsTab";
import SkillsTab from "./tabs/SkillsTab";
import EventsTab from "./tabs/EventsTab";
import ContactTab from "./tabs/ContactTab";
import { X, Flag, FlagOff } from "lucide-react";

interface PortfolioModalProps {
  student: Student;
  onClose: () => void;
  onToggleFlag?: (id: string) => void;
  onResolve?: (student: Student) => void;
  adminMode?: boolean;
  role?: "standard" | "sponsor" | "admin";
}

export default function PortfolioModal({
  student,
  onClose,
  onToggleFlag,
  onResolve,
  adminMode,
  role = "admin",
}: PortfolioModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("about");
  const focusTrapRef = useFocusTrap(true, onClose);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setActiveTab((prev) => (prev === "about" ? "experience" : prev));
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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-modal-overlay backdrop-blur-md cursor-pointer"
    >
      <div
        ref={focusTrapRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-full md:h-[80vh] rounded-none md:rounded-3xl glass-panel border-0 md:border border-zinc-800 shadow-2xl flex flex-col max-h-screen md:max-h-[85vh] animate-scale-in cursor-default overflow-hidden"
      >
        {/* Decorative Tech Overlay Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="circuit-overlay"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-zinc-850/90 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-zinc-155 transition-all shadow-lg active:scale-90 group/tooltip"
        >
          <X size={18} />
          <Tooltip content="Close Modal" position="bottom-right" groupClass="group-hover/tooltip:opacity-100" />
        </button>

        {/* Scrollable Container Wrapper */}
        <div className="w-full flex flex-col md:flex-row overflow-hidden h-full">
          {/* Left Side Panel: Profile Hero & Desktop Metadata */}
          <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-zinc-800/80 flex flex-col justify-between md:overflow-y-auto overflow-x-hidden relative z-10 bg-modal-left hidden md:flex">
            <div className="flex flex-col gap-6">
              <StudentUpperInfo student={student} adminMode={adminMode} />
            </div>
            <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-zinc-800/80">
              <StudentLowerInfo student={student} adminMode={adminMode} onResolve={onResolve} />
            </div>
          </div>

          {/* Right Side Panel: Interactive Tabs */}
          <div className="w-full md:w-3/5 p-5 md:p-6 pt-12 md:pt-6 flex flex-col h-full relative z-10 bg-modal-right overflow-hidden">
            {/* Tab Navigation Header */}
            <ModalTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} role={role} />

            {/* Tab Content Display */}
            <div className={`grow pr-1 ${activeTab === "about" ? "overflow-hidden" : "overflow-y-auto"} md:overflow-y-auto`}>
              {/* About / Info Panel (Mobile Only) */}
              {activeTab === "about" && (
                <div className="flex flex-col h-full md:hidden relative overflow-hidden animate-fade-in">
                  <div className="grow overflow-y-auto pb-36 pr-1">
                    <StudentUpperInfo student={student} adminMode={adminMode} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-modal-right border-t border-zinc-800/80 z-30">
                    <StudentLowerInfo student={student} adminMode={adminMode} onResolve={onResolve} />
                  </div>
                </div>
              )}

              {/* Experience Timeline Panel */}
              {activeTab === "experience" && (
                <TimelineSection student={student} formatDateStr={formatDateStr} />
              )}

              {/* Projects Panel */}
              {activeTab === "projects" && (
                <ProjectsTab projects={student.projects} formatDateStr={formatDateStr} />
              )}

              {/* Skills Panel */}
              {activeTab === "skills" && (
                <SkillsTab student={student} formatDateStr={formatDateStr} />
              )}

              {/* Events Panel */}
              {activeTab === "events" && (
                <EventsTab events={student.events} formatDateStr={formatDateStr} />
              )}

              {/* Recruiter Contact Panel */}
              {activeTab === "contact" && (
                <ContactTab student={student} role={role} />
              )}

            </div>
          </div>
        </div>

        {/* Floating Action Flag Button in Bottom Right */}
        {onToggleFlag && !student.flagged && (
          <button
            type="button"
            onClick={() => onToggleFlag(student.id)}
            className={`absolute bottom-6 right-6 z-40 p-3.5 rounded-full shadow-xl transition-all active:scale-90 border cursor-pointer flex items-center justify-center bg-zinc-900/90 border-zinc-800 backdrop-blur-sm group/tooltip ${
              student.flagged
                ? "bg-red-500/90 hover:bg-red-600 border-red-500 text-white"
                : "text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-zinc-850"
            }`}
          >
            {student.flagged ? <FlagOff size={18} /> : <Flag size={18} />}
            <Tooltip content={student.flagged ? "Unflag Profile" : "Flag / Report Profile"} position="top-right" groupClass="group-hover/tooltip:opacity-100" />
          </button>
        )}
      </div>
    </div>
  );
}
