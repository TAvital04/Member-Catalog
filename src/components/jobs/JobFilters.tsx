"use client";

import React, { useState, useMemo } from "react";
import { Filter, RotateCcw, Search, ChevronDown } from "lucide-react";
import CustomCheckbox from "@/components/common/CustomCheckbox";
import FilterDropdown from "@/components/directory/FilterDropdown";

export interface JobFiltersProps {
  // Multi-select state
  selectedEmploymentTypes: string[];
  setSelectedEmploymentTypes: (types: string[]) => void;
  selectedLocationTypes: string[];
  setSelectedLocationTypes: (types: string[]) => void;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[]) => void;
  selectedCompanies?: string[];
  setSelectedCompanies?: (companies: string[]) => void;

  // Available options
  availableSkills: string[];
  availableCompanies: string[];

  // Actions & Layout
  onResetAll: () => void;
  layout?: "side" | "top";

  // Optional legacy props for backwards-compatibility
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  selectedEmploymentType?: string;
  setSelectedEmploymentType?: (t: string) => void;
  selectedLocationType?: string;
  setSelectedLocationType?: (l: string) => void;
  selectedSkill?: string | null;
  setSelectedSkill?: (s: string | null) => void;
  allJobSkills?: string[];
}

export default function JobFilters({
  selectedEmploymentTypes,
  setSelectedEmploymentTypes,
  selectedLocationTypes,
  setSelectedLocationTypes,
  selectedSkills,
  setSelectedSkills,
  selectedCompanies = [],
  setSelectedCompanies = () => {},
  availableSkills,
  availableCompanies,
  onResetAll,
  layout = "side",
}: JobFiltersProps) {
  const [skillSearch, setSkillSearch] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<
    "employment" | "workplace" | "skill" | "company" | null
  >(null);

  const employmentOptions = useMemo(
    () => ["Full-time", "Internship", "Co-op", "Part-time"],
    []
  );

  const locationOptions = useMemo(
    () => ["On-site", "Hybrid", "Remote"],
    []
  );

  const filteredSkills = useMemo(() => {
    if (!skillSearch.trim()) return availableSkills;
    return availableSkills.filter((s) =>
      s.toLowerCase().includes(skillSearch.toLowerCase())
    );
  }, [availableSkills, skillSearch]);

  const activeFiltersCount =
    selectedEmploymentTypes.length +
    selectedLocationTypes.length +
    selectedSkills.length +
    selectedCompanies.length;

  const handleEmploymentTypeToggle = (type: string) => {
    if (selectedEmploymentTypes.includes(type)) {
      setSelectedEmploymentTypes(selectedEmploymentTypes.filter((t) => t !== type));
    } else {
      setSelectedEmploymentTypes([...selectedEmploymentTypes, type]);
    }
  };

  const handleLocationTypeToggle = (loc: string) => {
    if (selectedLocationTypes.includes(loc)) {
      setSelectedLocationTypes(selectedLocationTypes.filter((l) => l !== loc));
    } else {
      setSelectedLocationTypes([...selectedLocationTypes, loc]);
    }
  };

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleCompanyToggle = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  return (
    <>
      {/* Horizontal Top-bar Dropdowns Layout (Mobile / Tablet < 1056px) */}
      <div
        className={`w-full flex-col min-[1056px]:flex-row items-stretch min-[1056px]:items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs relative z-30 ${
          layout === "side" ? "flex min-[1056px]:hidden" : "flex"
        }`}
      >
        {activeDropdown && (
          <div
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setActiveDropdown(null)}
          />
        )}

        <div className="flex flex-wrap items-center gap-2 grow">
          {/* Employment Type Dropdown */}
          <FilterDropdown
            title={`Employment${selectedEmploymentTypes.length > 0 ? ` (${selectedEmploymentTypes.length})` : ""}`}
            isOpen={activeDropdown === "employment"}
            onToggle={() =>
              setActiveDropdown(activeDropdown === "employment" ? null : "employment")
            }
            isActive={selectedEmploymentTypes.length > 0}
            layout="top"
            widthClass="w-[calc(100vw-2.5rem)] max-w-[280px] md:w-56"
          >
            <div className="flex flex-col gap-2">
              {employmentOptions.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedEmploymentTypes.includes(type)}
                    onChange={() => handleEmploymentTypeToggle(type)}
                    className="sr-only"
                  />
                  <CustomCheckbox checked={selectedEmploymentTypes.includes(type)} />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </FilterDropdown>

          {/* Workplace Dropdown */}
          <FilterDropdown
            title={`Workplace${selectedLocationTypes.length > 0 ? ` (${selectedLocationTypes.length})` : ""}`}
            isOpen={activeDropdown === "workplace"}
            onToggle={() =>
              setActiveDropdown(activeDropdown === "workplace" ? null : "workplace")
            }
            isActive={selectedLocationTypes.length > 0}
            layout="top"
            widthClass="w-[calc(100vw-2.5rem)] max-w-[280px] md:w-56"
          >
            <div className="flex flex-col gap-2">
              {locationOptions.map((loc) => (
                <label
                  key={loc}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={selectedLocationTypes.includes(loc)}
                    onChange={() => handleLocationTypeToggle(loc)}
                    className="sr-only"
                  />
                  <CustomCheckbox checked={selectedLocationTypes.includes(loc)} />
                  <span>{loc}</span>
                </label>
              ))}
            </div>
          </FilterDropdown>

          {/* Technical Skills Dropdown */}
          <FilterDropdown
            title={`Skills${selectedSkills.length > 0 ? ` (${selectedSkills.length})` : ""}`}
            isOpen={activeDropdown === "skill"}
            onToggle={() =>
              setActiveDropdown(activeDropdown === "skill" ? null : "skill")
            }
            isActive={selectedSkills.length > 0}
            layout="top"
            widthClass="w-[calc(100vw-2.5rem)] max-w-[320px] md:w-64"
          >
            <div className="flex flex-col gap-2.5">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-2 py-1 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-black shadow-inner"
                />
              </div>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredSkills.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="sr-only"
                    />
                    <CustomCheckbox checked={selectedSkills.includes(skill)} />
                    <span className="truncate">{skill}</span>
                  </label>
                ))}
                {filteredSkills.length === 0 && (
                  <span className="text-xs text-slate-400 py-1 italic">No skills found</span>
                )}
              </div>
            </div>
          </FilterDropdown>

          {/* Companies Dropdown */}
          {availableCompanies.length > 0 && (
            <FilterDropdown
              title={`Company${selectedCompanies.length > 0 ? ` (${selectedCompanies.length})` : ""}`}
              isOpen={activeDropdown === "company"}
              onToggle={() =>
                setActiveDropdown(activeDropdown === "company" ? null : "company")
              }
              isActive={selectedCompanies.length > 0}
              layout="top"
              widthClass="w-[calc(100vw-2.5rem)] max-w-[280px] md:w-60"
            >
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {availableCompanies.map((company) => (
                  <label
                    key={company}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company)}
                      onChange={() => handleCompanyToggle(company)}
                      className="sr-only"
                    />
                    <CustomCheckbox checked={selectedCompanies.includes(company)} />
                    <span className="truncate">{company}</span>
                  </label>
                ))}
              </div>
            </FilterDropdown>
          )}
        </div>

        <button
          type="button"
          onClick={onResetAll}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors py-1.5 px-3 rounded-xl justify-center shrink-0 cursor-pointer font-semibold"
        >
          <RotateCcw size={12} className="text-slate-400" />
          <span>Reset</span>
        </button>
      </div>

      {/* Side Layout (Vertical list on >= 1056px viewports matching Candidates FilterSidebar) */}
      <aside
        className={`w-full min-[1056px]:w-64 shrink-0 flex-col gap-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs ${
          layout === "side" ? "hidden min-[1056px]:flex" : "hidden"
        }`}
      >
        {/* Active Sidebar Filters Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
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
            type="button"
            onClick={onResetAll}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer font-medium"
          >
            <RotateCcw size={12} className="text-slate-400" />
            <span>Reset All</span>
          </button>
        </div>

        {/* Section 1: Employment Type */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Employment Type
            </h3>
            <div className="flex flex-col gap-2">
              {employmentOptions.map((type) => {
                const isChecked = selectedEmploymentTypes.includes(type);
                return (
                  <label
                    key={type}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleEmploymentTypeToggle(type)}
                      className="sr-only"
                    />
                    <CustomCheckbox checked={isChecked} />
                    <span>{type}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Workplace */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Workplace
            </h3>
            <div className="flex flex-col gap-2">
              {locationOptions.map((loc) => {
                const isChecked = selectedLocationTypes.includes(loc);
                return (
                  <label
                    key={loc}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleLocationTypeToggle(loc)}
                      className="sr-only"
                    />
                    <CustomCheckbox checked={isChecked} />
                    <span>{loc}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Technical Skills */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Technical Skills
            </h3>
            <div className="flex flex-col gap-2.5 w-full">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-7 pr-2 py-1 text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-black shadow-inner"
                />
              </div>

              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredSkills.map((skill) => {
                  const isChecked = selectedSkills.includes(skill);
                  return (
                    <label
                      key={skill}
                      className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSkillToggle(skill)}
                        className="sr-only"
                      />
                      <CustomCheckbox checked={isChecked} />
                      <span className="truncate">{skill}</span>
                    </label>
                  );
                })}
                {filteredSkills.length === 0 && (
                  <span className="text-xs text-slate-400 py-1 italic">No skills found</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Hiring Companies */}
        {availableCompanies.length > 0 && (
          <div>
            <div className="flex flex-col gap-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Hiring Companies
              </h3>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                {availableCompanies.map((company) => {
                  const isChecked = selectedCompanies.includes(company);
                  return (
                    <label
                      key={company}
                      className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCompanyToggle(company)}
                        className="sr-only"
                      />
                      <CustomCheckbox checked={isChecked} />
                      <span className="truncate">{company}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
