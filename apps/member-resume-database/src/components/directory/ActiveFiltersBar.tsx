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
  selectedCompanies?: string[];
  removeCompanyFilter?: (company: string) => void;
  onClearAll?: () => void;
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
  selectedCompanies = [],
  removeCompanyFilter,
  onClearAll,
}: ActiveFiltersBarProps) {
  const hasActiveFilters =
    selectedMajors.length > 0 ||
    selectedGradDates.length > 0 ||
    selectedSkills.length > 0 ||
    selectedEvents.length > 0 ||
    selectedCompanies.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-200/80 text-xs">
      <span className="text-slate-500 pr-1 select-none font-bold uppercase tracking-wider text-[11px]">
        Active Filters:
      </span>
      
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
          className="relative group/tooltip hover:z-50 flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 font-semibold px-2.5 py-0.5 rounded-lg shadow-2xs animate-fade-in cursor-help"
        >
          <span>{skill}</span>
          <button
            onClick={() => removeSkillFilter(skill)}
            className="text-amber-600 hover:text-red-600 font-bold text-xs cursor-pointer ml-1"
          >
            ×
          </button>
          <Tooltip content={`Skill: ${skill}`} position="top" />
        </span>
      ))}

      {selectedEvents.map((evtTitle) => (
        <span
          key={evtTitle}
          className="relative group/tooltip hover:z-50 flex items-center gap-1 bg-sky-50 border border-sky-200 text-sky-900 font-medium px-2.5 py-0.5 rounded-lg shadow-2xs animate-fade-in cursor-help"
        >
          <span>{evtTitle}</span>
          <button
            onClick={() => removeEventFilter?.(evtTitle)}
            className="text-sky-500 hover:text-red-600 font-bold text-xs cursor-pointer ml-1"
          >
            ×
          </button>
          <Tooltip content={`Event: ${evtTitle}`} position="top" />
        </span>
      ))}

      {selectedCompanies.map((comp) => (
        <span
          key={comp}
          className="relative group/tooltip hover:z-50 flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium px-2.5 py-0.5 rounded-lg shadow-2xs animate-fade-in cursor-help"
        >
          <span>{comp}</span>
          <button
            onClick={() => removeCompanyFilter?.(comp)}
            className="text-emerald-500 hover:text-red-600 font-bold text-xs cursor-pointer ml-1"
          >
            ×
          </button>
          <Tooltip content={`Employer: ${comp}`} position="top" />
        </span>
      ))}

      {onClearAll && (
        <button
          onClick={onClearAll}
          className="text-amber-700 hover:text-amber-800 font-bold text-xs underline cursor-pointer ml-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
