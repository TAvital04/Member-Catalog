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
  selectedBadges: string[];
  removeBadgeFilter: (badge: string) => void;
  onClearAll?: () => void;
}

export default function ActiveFiltersBar({
  selectedMajors,
  removeMajorFilter,
  selectedGradDates,
  removeGradFilter,
  selectedSkills,
  removeSkillFilter,
  selectedBadges,
  removeBadgeFilter,
  onClearAll,
}: ActiveFiltersBarProps) {
  const hasActiveFilters =
    selectedMajors.length > 0 ||
    selectedGradDates.length > 0 ||
    selectedSkills.length > 0 ||
    selectedBadges.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-zinc-800 text-xs">
      <span className="text-zinc-555 pr-1 select-none font-bold uppercase tracking-wider">Active Filters:</span>
      
      {selectedMajors.map((major) => (
        <span
          key={major}
          className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md animate-fade-in"
        >
          <span>{major}</span>
          <button
            onClick={() => removeMajorFilter(major)}
            className="text-zinc-555 hover:text-red-400 font-bold text-[10px] cursor-pointer ml-1"
          >
            ×
          </button>
        </span>
      ))}

      {selectedGradDates.map((date) => (
        <span
          key={date}
          className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md animate-fade-in"
        >
          <span>{date}</span>
          <button
            onClick={() => removeGradFilter(date)}
            className="text-zinc-555 hover:text-red-400 font-bold text-[10px] cursor-pointer ml-1"
          >
            ×
          </button>
        </span>
      ))}

      {selectedSkills.map((skill) => (
        <span
          key={skill}
          className="relative group/tooltip hover:z-50 flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-amber-400/90 font-medium px-2 py-0.5 rounded-md animate-fade-in cursor-help"
        >
          <span>{skill}</span>
          <button
            onClick={() => removeSkillFilter(skill)}
            className="text-zinc-555 hover:text-red-400 font-bold text-[10px] cursor-pointer ml-1"
          >
            ×
          </button>
          <Tooltip content={`Skill: ${skill}`} position="top" />
        </span>
      ))}

      {selectedBadges.map((badge) => (
        <span
          key={badge}
          className="relative group/tooltip hover:z-50 flex items-center gap-1 bg-zinc-900 border border-zinc-800 text-purple-400/90 font-medium px-2 py-0.5 rounded-md animate-fade-in cursor-help"
        >
          <span>{badge}</span>
          <button
            onClick={() => removeBadgeFilter(badge)}
            className="text-zinc-555 hover:text-red-400 font-bold text-[10px] cursor-pointer ml-1"
          >
            ×
          </button>
          <Tooltip content={`Badge: ${badge}`} position="top" />
        </span>
      ))}

      {onClearAll && (
        <button
          onClick={onClearAll}
          className="text-amber-400 hover:text-amber-300 font-bold text-[11px] underline cursor-pointer ml-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
