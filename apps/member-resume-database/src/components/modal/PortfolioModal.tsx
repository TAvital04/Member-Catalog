"use client";

import React, { useState, useEffect } from "react";
import { Student } from "../../data/students";
import { useFocusTrap } from "../common/useFocusTrap";
import Tooltip from "../common/Tooltip";
import StudentUpperInfo from "./StudentUpperInfo";
import StudentLowerInfo from "./StudentLowerInfo";
import ModalTabNavigation, { TabType } from "./tabs/ModalTabNavigation";
import ProjectsTab from "./tabs/ProjectsTab";
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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-modal-overlay backdrop-blur-md cursor-pointer"
    >
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${student.name} - Engineering Portfolio`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-full md:h-[80vh] rounded-none md:rounded-3xl bg-white border-0 md:border border-slate-200 shadow-2xl flex flex-col max-h-screen md:max-h-[85vh] animate-scale-in cursor-default overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close candidate portfolio modal"
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all shadow-xs active:scale-90 group/tooltip focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none cursor-pointer"
        >
          <X size={18} />
          <Tooltip content="Close Modal" position="bottom-right" groupClass="group-hover/tooltip:opacity-100" />
        </button>

        {/* Scrollable Container Wrapper */}
        <div className="w-full flex flex-col md:flex-row overflow-hidden h-full">
          {/* Left Side Panel: Profile Hero & Desktop Metadata */}
          <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col md:overflow-y-auto overflow-x-hidden relative z-10 bg-slate-50/70 hidden md:flex">
            <div className="pb-6 border-b border-slate-200 shrink-0">
              <StudentUpperInfo student={student} adminMode={adminMode} />
            </div>
            <div className="my-auto py-6 w-full">
              <StudentLowerInfo student={student} adminMode={adminMode} onResolve={onResolve} />
            </div>
          </div>

          {/* Right Side Panel: Interactive Tabs */}
          <div className="w-full md:w-3/5 p-5 md:p-6 pt-12 md:pt-6 flex flex-col h-full relative z-10 bg-white overflow-hidden">
            {/* Tab Navigation Header */}
            <ModalTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} role={role} eventCount={student.events?.length} />

            {/* Tab Content Display */}
            <div className={`grow pr-1 ${activeTab === "about" ? "overflow-hidden" : "overflow-y-auto"} md:overflow-y-auto`}>
              {/* About / Info Panel (Mobile Only) */}
              {activeTab === "about" && (
                <div className="flex flex-col h-full md:hidden relative overflow-hidden animate-fade-in">
                  <div className="grow overflow-y-auto pb-8 pr-1 flex flex-col min-h-full">
                    <div className="pb-6 border-b border-slate-200 shrink-0">
                      <StudentUpperInfo student={student} adminMode={adminMode} />
                    </div>
                    <div className="my-auto py-6 w-full">
                      <StudentLowerInfo student={student} adminMode={adminMode} onResolve={onResolve} />
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Panel */}
              {activeTab === "projects" && (
                <ProjectsTab projects={student.projects} formatDateStr={formatDateStr} student={student} />
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
