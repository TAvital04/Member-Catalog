"use client";

import React, { useState } from "react";
import { Filter, RotateCcw, ShieldAlert } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import MajorsFilter from "./filters/MajorsFilter";
import SkillsFilter, { SkillModeSelector } from "./filters/SkillsFilter";
import GradDatesFilter from "./filters/GradDatesFilter";
import AdminFilters from "./filters/AdminFilters";
import SponsorLockPanel from "./filters/SponsorLockPanel";

interface FilterSidebarProps {
  selectedMajors: string[];
  setSelectedMajors: (majors: string[]) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  selectedGradDates: string[];
  setSelectedGradDates: (dates: string[]) => void;
  skillFilterMode: "AND" | "OR";
  setSkillFilterMode: (mode: "AND" | "OR") => void;
  
  // Admin filters
  adminMode: boolean;
  adminFilterFlagged: boolean | null;
  setAdminFilterFlagged: (flagged: boolean | null) => void;

  // Available metadata
  availableMajors: string[];
  availableSkills: string[];
  availableGradDates: string[];

  // Layout choice
  layout?: "side" | "top";
  role?: "standard" | "sponsor" | "admin";
  onResetAll?: () => void;
}

export default function FilterSidebar({
  selectedMajors,
  setSelectedMajors,
  selectedSkills,
  setSelectedSkills,
  selectedGradDates,
  setSelectedGradDates,
  skillFilterMode,
  setSkillFilterMode,
  adminMode,
  adminFilterFlagged,
  setAdminFilterFlagged,
  availableMajors,
  availableSkills,
  availableGradDates,
  layout = "side",
  role = "admin",
  onResetAll,
}: FilterSidebarProps) {
  const [activeDropdown, setActiveDropdown] = useState<"major" | "skill" | "grad" | "admin" | null>(null);
  
  const activeFiltersCount =
    selectedMajors.length +
    selectedSkills.length +
    selectedGradDates.length +
    (adminFilterFlagged !== null ? 1 : 0);

  const handleMajorToggle = (major: string) => {
    if (selectedMajors.includes(major)) {
      setSelectedMajors(selectedMajors.filter((m) => m !== major));
    } else {
      setSelectedMajors([...selectedMajors, major]);
    }
  };

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
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

  const resetAllFilters = () => {
    if (onResetAll) {
      onResetAll();
    } else {
      setSelectedMajors([]);
      setSelectedSkills([]);
      setSelectedGradDates([]);
      setSkillFilterMode("OR");
      setAdminFilterFlagged(null);
    }
    setActiveDropdown(null);
  };

  // If Standard user, render locked placeholders
  if (role === "standard") {
    return <SponsorLockPanel layout={layout} />;
  }

  return (
    <>
      {/* Horizontal Top-bar Dropdowns Layout */}
      <div className={`w-full flex-col min-[1056px]:flex-row items-stretch min-[1056px]:items-center gap-3 bg-zinc-900/40 p-3 rounded-2xl border border-zinc-800 relative z-30 ${
        layout === "side" ? "flex min-[1056px]:hidden" : "flex"
      }`}>
        {activeDropdown && (
          <div
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setActiveDropdown(null)}
          />
        )}

        <div className="flex flex-wrap items-center gap-2 grow relative z-30">
          <div className="flex items-center gap-1.5 text-zinc-500 text-xs pr-1 font-bold">
            <Filter size={14} className="text-amber-500" />
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
                <span className="text-zinc-555">Skills matching:</span>
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

          {adminMode && (
            <FilterDropdown
              title="Admin Controls"
              isOpen={activeDropdown === "admin"}
              onToggle={() => setActiveDropdown(activeDropdown === "admin" ? null : "admin")}
              isActive={adminFilterFlagged !== null}
              layout="top"
              themeColor="red"
              widthClass="w-[calc(100vw-2.5rem)] max-w-[280px] md:w-64"
            >
              <div className="flex flex-col gap-1.5 w-full">
                <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider mb-0.5">Flagged Status</span>
                <AdminFilters
                  adminFilterFlagged={adminFilterFlagged}
                  setAdminFilterFlagged={setAdminFilterFlagged}
                  layout="top"
                />
              </div>
            </FilterDropdown>
          )}
        </div>

        <button
          type="button"
          onClick={resetAllFilters}
          className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-500 transition-colors py-1.5 px-3 rounded-xl hover:bg-zinc-900/40 justify-center shrink-0 cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Side Layout (Vertical list on larger viewports) */}
      <aside className={`w-full min-[1056px]:w-64 shrink-0 flex-col gap-6 ${
        layout === "side" ? "hidden min-[1056px]:flex" : "hidden"
      }`}>
        {/* Active Sidebar Filters Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 font-semibold text-zinc-100">
            <Filter size={18} className="text-amber-500" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold animate-fade-in">
                {activeFiltersCount}
              </span>
            )}
          </div>
          
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset All</span>
          </button>
        </div>

        {adminMode && (
          <div className="border-b border-zinc-850/40 pb-5">
            <FilterDropdown
              title="Flagged Status"
              isOpen={true}
              onToggle={() => {}}
              isActive={adminFilterFlagged !== null}
              layout="side"
              headerAction={<ShieldAlert size={16} className="text-red-400 animate-pulse" />}
            >
              <AdminFilters
                adminFilterFlagged={adminFilterFlagged}
                setAdminFilterFlagged={setAdminFilterFlagged}
                layout="side"
              />
            </FilterDropdown>
          </div>
        )}

        <div className="border-b border-zinc-850/40 pb-5">
          <FilterDropdown
            title="Degree & Major"
            isOpen={true}
            onToggle={() => {}}
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

        <div className="border-b border-zinc-850/40 pb-5">
          <FilterDropdown
            title="Technical Skills"
            isOpen={true}
            onToggle={() => {}}
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

        <div>
          <FilterDropdown
            title="Graduation Date"
            isOpen={true}
            onToggle={() => {}}
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
      </aside>
    </>
  );
}

