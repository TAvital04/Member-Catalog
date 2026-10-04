"use client";

/**
 * @file ProjectModal.tsx
 * @description Comprehensive project inspection modal mirroring PortfolioModal architecture.
 * Features dedicated panels and tabs for:
 * 1. Main Project Description & Vision
 * 2. Hardware & Software Tools Stack
 * 3. Chronological Sprint Milestones & Timeline
 * 4. People & Active Student Team Roster
 * 5. Skills Taught & Engineering Competencies
 * 6. Sponsorship & Partner Benefits Hub
 */

import React, { useState, useEffect } from "react";
import { IEEEProject } from "@/data/projects";
import { useFocusTrap } from "@/components/common/useFocusTrap";
import Tooltip from "@/components/common/Tooltip";
import ProjectUpperInfo from "./ProjectUpperInfo";
import ProjectTabNavigation, { ProjectTabType } from "./ProjectTabNavigation";
import ProjectOverviewTab from "./tabs/ProjectOverviewTab";
import ProjectToolsTab from "./tabs/ProjectToolsTab";
import ProjectTimelineTab from "./tabs/ProjectTimelineTab";
import ProjectPeopleTab from "./tabs/ProjectPeopleTab";
import ProjectSkillsTab from "./tabs/ProjectSkillsTab";
import ProjectSponsorTab from "./tabs/ProjectSponsorTab";
import { X } from "lucide-react";

interface ProjectModalProps {
  project: IEEEProject;
  onClose: () => void;
  onSelectMember?: (memberId: string) => void;
  initialTab?: ProjectTabType;
}

export default function ProjectModal({
  project,
  onClose,
  onSelectMember,
  initialTab = "overview",
}: ProjectModalProps) {
  const [activeTab, setActiveTab] = useState<ProjectTabType>(initialTab);
  const focusTrapRef = useFocusTrap(true, onClose);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setActiveTab((prev) => (prev === "info" ? "overview" : prev));
      }
    };

    const timer = setTimeout(handleResize, 0);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-modal-overlay backdrop-blur-md cursor-pointer"
    >
      <div
        ref={focusTrapRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-full md:h-[82vh] rounded-none md:rounded-3xl glass-panel border-0 md:border border-zinc-800 shadow-2xl flex flex-col max-h-screen md:max-h-[85vh] animate-scale-in cursor-default overflow-hidden"
      >
        {/* Decorative Tech Circuit Overlay Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="circuit-overlay"></div>
        </div>

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-zinc-850/90 border border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-zinc-100 transition-all shadow-lg active:scale-90 group/tooltip cursor-pointer"
        >
          <X size={18} />
          <Tooltip content="Close Project Modal" position="bottom-right" groupClass="group-hover/tooltip:opacity-100" />
        </button>

        {/* Scrollable Container Wrapper */}
        <div className="w-full flex flex-col md:flex-row overflow-hidden h-full">
          {/* Left Side Panel: Hero & Quick Project Stats (Desktop) */}
          <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-zinc-800/80 flex flex-col justify-between md:overflow-y-auto overflow-x-hidden relative z-10 bg-modal-left hidden md:flex">
            <ProjectUpperInfo project={project} />
          </div>

          {/* Right Side Panel: Interactive Tabs */}
          <div className="w-full md:w-3/5 p-5 md:p-6 pt-14 md:pt-6 flex flex-col h-full relative z-10 bg-modal-right overflow-hidden">
            {/* Tab Navigation Header */}
            <ProjectTabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Tab Content Display */}
            <div className={`grow pr-1 ${activeTab === "info" ? "overflow-hidden" : "overflow-y-auto"} md:overflow-y-auto`}>
              {/* Info Panel (Mobile Only) */}
              {activeTab === "info" && (
                <div className="flex flex-col h-full md:hidden relative overflow-y-auto pb-10 pr-1 animate-fade-in">
                  <ProjectUpperInfo project={project} />
                </div>
              )}

              {/* Overview Tab */}
              {activeTab === "overview" && (
                <ProjectOverviewTab
                  project={project}
                  onNavigateTab={(tab: ProjectTabType) => setActiveTab(tab)}
                />
              )}

              {/* Tools & Tech Stack Tab */}
              {activeTab === "tools" && (
                <ProjectToolsTab tools={project.tools} />
              )}

              {/* Timeline & Roadmap Tab */}
              {activeTab === "timeline" && (
                <ProjectTimelineTab timeline={project.timeline} />
              )}

              {/* People & Team Roster Tab */}
              {activeTab === "people" && (
                <ProjectPeopleTab
                  participants={project.participants}
                  onSelectMember={onSelectMember}
                />
              )}

              {/* Skills Taught Tab */}
              {activeTab === "skills" && (
                <ProjectSkillsTab skillsTaught={project.skillsTaught} />
              )}

              {/* Sponsor & Partner Benefits Tab */}
              {activeTab === "sponsor" && (
                <ProjectSponsorTab project={project} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
