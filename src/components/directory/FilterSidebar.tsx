"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter, RotateCcw } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import MajorsFilter from "./filters/MajorsFilter";
import SkillsFilter, { SkillModeSelector } from "./filters/SkillsFilter";
import GradDatesFilter from "./filters/GradDatesFilter";
import EventsFilter from "./filters/EventsFilter";
import ProjectsFilter from "./filters/ProjectsFilter";
import SponsorLockPanel from "./filters/SponsorLockPanel";
import { isSkillMatch } from "@/lib/skillMatching";
import { UserRole } from "@/hooks/useRoleManager";

interface FilterSidebarProps {
  selectedMajors: string[];
  setSelectedMajors: (majors: string[]) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  selectedGradDates: string[];
  setSelectedGradDates: (dates: string[]) => void;
  selectedEvents: string[];
  setSelectedEvents: (events: string[]) => void;
  selectedProjects?: string[];
  setSelectedProjects?: (projects: string[]) => void;
  selectedCompanies?: string[];
  setSelectedCompanies?: (companies: string[]) => void;
  skillFilterMode: "AND" | "OR";
  setSkillFilterMode: (mode: "AND" | "OR") => void;
  adminMode?: boolean;

  // Available metadata
  availableMajors: string[];
  availableSkills: string[];
  availableGradDates: string[];
  availableEvents: string[];
  availableProjects?: string[];
  availableCompanies?: string[];

  // Layout choice
  layout?: "side" | "top";
  role?: UserRole;
  onResetAll?: () => void;
}

export default function FilterSidebar({
  selectedMajors,
  setSelectedMajors,
  selectedSkills,
  setSelectedSkills,
  selectedGradDates,
  setSelectedGradDates,
  selectedEvents,
  setSelectedEvents,
  selectedProjects = [],
  setSelectedProjects = () => { },
  skillFilterMode,
  setSkillFilterMode,
  availableMajors,
  availableSkills,
  availableGradDates,
  availableEvents,
  availableProjects = [],
  layout = "side",
  role = "admin",
  onResetAll,
}: FilterSidebarProps) {
  const [activeDropdown, setActiveDropdown] = useState<"major" | "skill" | "grad" | "event" | "project" | "company" | null>(null);
  const asideRef = useRef<HTMLElement>(null);

  // Guarantee the outer panel never retains any scroll offset
  useEffect(() => {
    if (asideRef.current) {
      asideRef.current.scrollTop = 0;
    }
  });

  const activeFiltersCount =
    selectedMajors.length +
    selectedSkills.length +
    selectedGradDates.length +
    selectedEvents.length +
    selectedProjects.length;

  const handleMajorToggle = (major: string) => {
    if (selectedMajors.includes(major)) {
      setSelectedMajors(selectedMajors.filter((m) => m !== major));
    } else {
      setSelectedMajors([...selectedMajors, major]);
    }
  };

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.some((s) => s.toLowerCase() === skill.toLowerCase() || isSkillMatch(skill, s))) {
      setSelectedSkills(
        selectedSkills.filter((s) => s.toLowerCase() !== skill.toLowerCase() && !isSkillMatch(skill, s))
      );
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleGradToggle = (date: string) => {
    if (selectedGradDates.includes(date)) {
      setSelectedGradDates(selectedGradDates.filter((d) => d !== date));
    } else {
      setSelectedGradDates([...selectedGradDates, date]);
    }
  };

  const handleEventToggle = (evtTitle: string) => {
    if (selectedEvents.includes(evtTitle)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== evtTitle));
    } else {
      setSelectedEvents([...selectedEvents, evtTitle]);
    }
  };

  const handleProjectToggle = (projectName: string) => {
    if (selectedProjects.includes(projectName)) {
      setSelectedProjects(selectedProjects.filter((p) => p !== projectName));
    } else {
      setSelectedProjects([...selectedProjects, projectName]);
    }
  };

  const resetAllFilters = () => {
    if (onResetAll) {
      onResetAll();
    } else {
      setSelectedMajors([]);
      setSelectedSkills([]);
      setSelectedGradDates([]);
      setSelectedEvents([]);
      setSelectedProjects([]);
      setSkillFilterMode("OR");
    }
    setActiveDropdown(null);
  };

  // If Standard user, render locked placeholders
  if (role === "standard") {
    return <SponsorLockPanel layout={layout} />;
  }

  return (
    <>
      {/* Mobile/Tablet Horizontal Filters (<1056px) */}
      <div className="w-full flex min-[1056px]:hidden flex-col gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs relative z-30">
        {activeDropdown && (
          <div
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setActiveDropdown(null)}
          />
        )}

        <div className="flex flex-wrap items-center gap-2 grow relative z-30">
          <div className="flex items-center gap-1.5 text-black text-xs pr-1 font-bold">
            <Filter size={14} className="text-black" />
            <span>Filters:</span>
          </div>

          <FilterDropdown
            title={`Majors ${selectedMajors.length > 0 ? `(${selectedMajors.length})` : ""}`}
            isOpen={activeDropdown === "major"}
            onToggle={() => setActiveDropdown(activeDropdown === "major" ? null : "major")}
            isActive={selectedMajors.length > 0}
            layout="top"
          >
            <MajorsFilter
              availableMajors={availableMajors}
              selectedMajors={selectedMajors}
              onMajorToggle={handleMajorToggle}
            />
          </FilterDropdown>

          <FilterDropdown
            title={`Skills ${selectedSkills.length > 0 ? `(${selectedSkills.length})` : ""}`}
            isOpen={activeDropdown === "skill"}
            onToggle={() => setActiveDropdown(activeDropdown === "skill" ? null : "skill")}
            isActive={selectedSkills.length > 0}
            layout="top"
            widthClass="w-[calc(100vw-2.5rem)] max-w-[280px] md:w-60"
            headerAction={
              <div className="flex justify-between items-center text-[10px] w-full mb-1">
                <span className="text-slate-500 font-semibold">Matching:</span>
                <SkillModeSelector
                  skillFilterMode={skillFilterMode}
                  setSkillFilterMode={setSkillFilterMode}
                />
              </div>
            }
          >
            <SkillsFilter
              availableSkills={availableSkills}
              selectedSkills={selectedSkills}
              onSkillToggle={handleSkillToggle}
            />
          </FilterDropdown>

          <FilterDropdown
            title={`Graduation ${selectedGradDates.length > 0 ? `(${selectedGradDates.length})` : ""}`}
            isOpen={activeDropdown === "grad"}
            onToggle={() => setActiveDropdown(activeDropdown === "grad" ? null : "grad")}
            isActive={selectedGradDates.length > 0}
            layout="top"
          >
            <GradDatesFilter
              availableGradDates={availableGradDates}
              selectedGradDates={selectedGradDates}
              onGradToggle={handleGradToggle}
            />
          </FilterDropdown>

          <FilterDropdown
            title={`Events ${selectedEvents.length > 0 ? `(${selectedEvents.length})` : ""}`}
            isOpen={activeDropdown === "event"}
            onToggle={() => setActiveDropdown(activeDropdown === "event" ? null : "event")}
            isActive={selectedEvents.length > 0}
            layout="top"
            widthClass="w-[calc(100vw-2.5rem)] max-w-[280px] md:w-64"
          >
            <EventsFilter
              availableEvents={availableEvents}
              selectedEvents={selectedEvents}
              onEventToggle={handleEventToggle}
              layout="top"
            />
          </FilterDropdown>

          <FilterDropdown
            title={`Projects ${selectedProjects.length > 0 ? `(${selectedProjects.length})` : ""}`}
            isOpen={activeDropdown === "project"}
            onToggle={() => setActiveDropdown(activeDropdown === "project" ? null : "project")}
            isActive={selectedProjects.length > 0}
            layout="top"
            widthClass="w-[calc(100vw-2.5rem)] max-w-[280px] md:w-64"
          >
            <ProjectsFilter
              availableProjects={availableProjects}
              selectedProjects={selectedProjects}
              onProjectToggle={handleProjectToggle}
              layout="top"
            />
          </FilterDropdown>
        </div>

        <button
          type="button"
          onClick={resetAllFilters}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors py-1.5 px-3 rounded-xl justify-center shrink-0 cursor-pointer font-semibold"
        >
          <RotateCcw size={12} className="text-slate-400" />
          <span>Reset</span>
        </button>
      </div>

      {/* Desktop Vertical Sidebar Panel (>=1056px) */}
      <aside
        key="filter-sidebar-side-panel"
        ref={asideRef}
        className="w-full min-[1056px]:w-64 shrink-0 hidden min-[1056px]:flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xs min-[1056px]:sticky min-[1056px]:top-20 min-[1056px]:self-start min-[1056px]:max-h-[calc(100vh-6rem)] overflow-hidden"
      >
          {/* Active Sidebar Filters Header - Fixed at the top of the panel */}
          <div className="flex items-center justify-between p-4 pb-3 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Filter size={16} className="text-slate-400" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-neutral-100 text-black border border-neutral-300 text-[10px] px-2 py-0.2 rounded-full font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </div>

            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-medium"
            >
              <RotateCcw size={12} className="text-slate-400" />
              <span>Reset All</span>
            </button>
          </div>

          {/* Scrollable Filters Body */}
            <div className="flex flex-col gap-5 p-4 pr-3 pt-3 overflow-y-auto overscroll-contain min-h-0 grow">
              <div className="border-b border-slate-100 pb-4">
                <FilterDropdown
                  title="Degree & Major"
                  isOpen={true}
                  onToggle={() => { }}
                  isActive={selectedMajors.length > 0}
                  layout="side"
                >
                  <MajorsFilter
                    availableMajors={availableMajors}
                    selectedMajors={selectedMajors}
                    onMajorToggle={handleMajorToggle}
                  />
                </FilterDropdown>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <FilterDropdown
                  title="Technical Skills"
                  isOpen={true}
                  onToggle={() => { }}
                  isActive={selectedSkills.length > 0}
                  layout="side"
                  headerAction={
                    <SkillModeSelector
                      skillFilterMode={skillFilterMode}
                      setSkillFilterMode={setSkillFilterMode}
                    />
                  }
                >
                  <SkillsFilter
                    availableSkills={availableSkills}
                    selectedSkills={selectedSkills}
                    onSkillToggle={handleSkillToggle}
                  />
                </FilterDropdown>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <FilterDropdown
                  title="Graduation Date"
                  isOpen={true}
                  onToggle={() => { }}
                  isActive={selectedGradDates.length > 0}
                  layout="side"
                >
                  <GradDatesFilter
                    availableGradDates={availableGradDates}
                    selectedGradDates={selectedGradDates}
                    onGradToggle={handleGradToggle}
                  />
                </FilterDropdown>
              </div>

              <div className="border-b border-slate-100 pb-4">
                <FilterDropdown
                  title="Events Attended"
                  isOpen={true}
                  onToggle={() => { }}
                  isActive={selectedEvents.length > 0}
                  layout="side"
                >
                  <EventsFilter
                    availableEvents={availableEvents}
                    selectedEvents={selectedEvents}
                    onEventToggle={handleEventToggle}
                    layout="side"
                  />
                </FilterDropdown>
              </div>

              <div>
                <FilterDropdown
                  title="Projects Participated In"
                  isOpen={true}
                  onToggle={() => { }}
                  isActive={selectedProjects.length > 0}
                  layout="side"
                >
                  <ProjectsFilter
                    availableProjects={availableProjects}
                    selectedProjects={selectedProjects}
                    onProjectToggle={handleProjectToggle}
                    layout="side"
                  />
                </FilterDropdown>
              </div>
            </div>
        </aside>
      </>
      );
}
