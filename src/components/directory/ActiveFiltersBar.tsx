"use client";

import React from "react";
import Tooltip from "../common/Tooltip";

interface ActiveFiltersBarProps {
  selectedMajors: string[];
  removeMajorFilter: (major: string) => void;
  selectedGradDates: string[];
  removeGradFilter: (date: string) => void;
  selectedSkills: string[];
  removeSkillFilter: (skill: string) => void;
  selectedEvents?: string[];
  removeEventFilter?: (eventTitle: string) => void;
  selectedProjects?: string[];
  removeProjectFilter?: (projectName: string) => void;
  selectedCompanies?: string[];
  removeCompanyFilter?: (company: string) => void;
  onClearAll?: () => void;
  filterByMyself?: boolean;
  removeSelfFilter?: () => void;
  selfStudentName?: string;
}

export default function ActiveFiltersBar({
  selectedMajors,
  removeMajorFilter,
  selectedGradDates,
  removeGradFilter,
  selectedSkills,
  removeSkillFilter,
  selectedEvents = [],
  removeEventFilter,
  selectedProjects = [],
  removeProjectFilter,
  selectedCompanies = [],
  removeCompanyFilter,
  onClearAll,
  filterByMyself = false,
  removeSelfFilter,
  selfStudentName,
}: ActiveFiltersBarProps) {
  const hasActiveFilters =
    Boolean(filterByMyself) ||
    selectedMajors.length > 0 ||
    selectedGradDates.length > 0 ||
    selectedSkills.length > 0 ||
    selectedEvents.length > 0 ||
    selectedProjects.length > 0 ||
    selectedCompanies.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-200/80 text-xs">
      <span className="text-slate-500 pr-1 select-none font-bold uppercase tracking-wider text-[11px]">
        Active Filters:
      </span>

      {filterByMyself && (
        <span className="flex items-center gap-1 bg-black text-white px-2.5 py-0.5 rounded-lg shadow-2xs font-semibold animate-fade-in">
          <span>Only My Profile ({selfStudentName || "Myself"})</span>
          {removeSelfFilter && (
            <button
              onClick={removeSelfFilter}
              className="text-white/80 hover:text-white font-bold text-xs cursor-pointer ml-1"
              aria-label="Remove self filter"
            >
              ×
            </button>
          )}
        </span>
      )}
      
      {selectedMajors.map((major) => (
        <span
          key={major}
          className="flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-2.5 py-0.5 rounded-lg shadow-2xs font-medium animate-fade-in"
        >
          <span>{major}</span>
          <button
            onClick={() => removeMajorFilter(major)}
            className="text-slate-400 hover:text-red-600 font-bold text-xs cursor-pointer ml-1"
          >
            ×
          </button>
        </span>
      ))}

      {selectedGradDates.map((date) => (
        <span
          key={date}
          className="flex items-center gap-1 bg-white border border-slate-200 text-slate-800 px-2.5 py-0.5 rounded-lg shadow-2xs font-medium animate-fade-in"
        >
          <span>{date}</span>
          <button
            onClick={() => removeGradFilter(date)}
            className="text-slate-400 hover:text-red-600 font-bold text-xs cursor-pointer ml-1"
          >
            ×
          </button>
        </span>
      ))}

      {selectedSkills.map((skill) => (
        <span
          key={skill}
          className="flex items-center gap-1 bg-neutral-100 border border-neutral-300 text-black font-semibold px-2.5 py-0.5 rounded-lg shadow-2xs animate-fade-in"
        >
          <span>{skill}</span>
          <button
            onClick={() => removeSkillFilter(skill)}
            className="text-neutral-500 hover:text-black font-bold text-xs cursor-pointer ml-1"
          >
            ×
          </button>
        </span>
      ))}

      {selectedEvents.map((evtTitle) => (
        <span
          key={evtTitle}
          className="flex items-center gap-1 bg-neutral-100 border border-neutral-300 text-black font-semibold px-2.5 py-0.5 rounded-lg shadow-2xs animate-fade-in"
        >
          <span>{evtTitle}</span>
          <button
            onClick={() => removeEventFilter?.(evtTitle)}
            className="text-neutral-500 hover:text-black font-bold text-xs cursor-pointer ml-1"
          >
            ×
          </button>
        </span>
      ))}

      {selectedProjects.map((projectName) => (
        <span
          key={projectName}
          className="flex items-center gap-1 bg-neutral-100 border border-neutral-300 text-black font-semibold px-2.5 py-0.5 rounded-lg shadow-2xs animate-fade-in"
        >
          <span>{projectName}</span>
          <button
            onClick={() => removeProjectFilter?.(projectName)}
            className="text-neutral-500 hover:text-black font-bold text-xs cursor-pointer ml-1"
          >
            ×
          </button>
        </span>
      ))}

      {selectedCompanies.map((comp) => (
        <span
          key={comp}
          className="flex items-center gap-1 bg-neutral-100 border border-neutral-300 text-black font-semibold px-2.5 py-0.5 rounded-lg shadow-2xs animate-fade-in"
        >
          <span>{comp}</span>
          <button
            onClick={() => removeCompanyFilter?.(comp)}
            className="text-neutral-500 hover:text-black font-bold text-xs cursor-pointer ml-1"
          >
            ×
          </button>
        </span>
      ))}

      {onClearAll && (
        <button
          onClick={onClearAll}
          className="text-black hover:underline font-bold text-xs underline cursor-pointer ml-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
