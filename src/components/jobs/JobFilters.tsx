"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";
import FilterPills from "@/components/common/FilterPills";

export interface JobFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedEmploymentType: string;
  setSelectedEmploymentType: (t: string) => void;
  selectedLocationType: string;
  setSelectedLocationType: (l: string) => void;
  allJobSkills: string[];
  selectedSkill: string | null;
  setSelectedSkill: (s: string | null) => void;
}

/**
 * JobFilters — Reusable Matchy-Matchy Filter Controls for Jobs Portal
 * Unifies search, employment type pills, workplace toggles, and skills quick-chips.
 */
export default function JobFilters({
  searchQuery,
  setSearchQuery,
  selectedEmploymentType,
  setSelectedEmploymentType,
  selectedLocationType,
  setSelectedLocationType,
  allJobSkills,
  selectedSkill,
  setSelectedSkill,
}: JobFiltersProps) {
  const employmentTypes = ["All", "Full-time", "Internship", "Co-op"];
  const locationTypes = ["All", "On-site", "Hybrid", "Remote"];

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3">
      {/* Search & Employment Type Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by job title, company, skills (e.g. C++, RTOS, Altium)..."
          className="grow"
          ariaLabel="Search by job title, company, skills"
        />

        {/* Employment Type Selector */}
        <FilterPills
          options={employmentTypes}
          selected={selectedEmploymentType}
          onSelect={setSelectedEmploymentType}
          ariaLabel="Filter jobs by employment type"
        />
      </div>

      {/* Location Type & Skills Quick Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Workplace:
          </span>
          <div className="flex items-center gap-1.5">
            {locationTypes.map((loc) => {
              const isSelected = selectedLocationType === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setSelectedLocationType(loc)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? "bg-black text-white border-black font-bold"
                      : "bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700"
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Skill Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Filter by Skill:
          </span>
          {allJobSkills.map((skill) => {
            const isSelected = selectedSkill === skill;
            return (
              <button
                key={skill}
                type="button"
                onClick={() => setSelectedSkill(isSelected ? null : skill)}
                className={`px-2 py-0.5 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? "bg-black text-white border-black font-bold"
                    : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
                }`}
              >
                {skill}
              </button>
            );
          })}
          {selectedSkill && (
            <button
              type="button"
              onClick={() => setSelectedSkill(null)}
              className="text-[11px] font-bold text-black hover:underline ml-1 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
