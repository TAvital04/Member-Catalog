"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import CustomCheckbox from "../../common/CustomCheckbox";
import Tooltip from "../../common/Tooltip";

interface SkillsFilterProps {
  availableSkills: string[];
  selectedSkills: string[];
  onSkillToggle: (skill: string) => void;
}

export default function SkillsFilter({
  availableSkills,
  selectedSkills,
  onSkillToggle,
}: SkillsFilterProps) {
  const [skillSearch, setSkillSearch] = useState("");

  const filteredSkills = availableSkills.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3 w-full overflow-x-hidden">
      <div className="relative">
        <Search size={12} className="absolute left-2.5 top-2.5 text-zinc-550" />
        <input
          type="text"
          placeholder="Search skills..."
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-amber-500 shadow-inner"
        />
      </div>

      {/* Flat Skill Tag Chips View - Vertical Scrolling Only */}
      <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto overflow-x-hidden pr-1 py-1 w-full">
        {filteredSkills.map((skill) => {
          const isSelected = selectedSkills.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              title={skill}
              onClick={() => onSkillToggle(skill)}
              className={`relative group/tooltip hover:z-50 px-2 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 select-none cursor-pointer max-w-full ${
                isSelected
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <div className="shrink-0">
                <CustomCheckbox checked={isSelected} />
              </div>
              <span className="truncate max-w-full">{skill}</span>
              <Tooltip content={`Filter: ${skill}`} position="top" />
            </button>
          );
        })}
        {filteredSkills.length === 0 && (
          <span className="text-[11px] text-zinc-550 italic py-2">No matching skills found</span>
        )}
      </div>
    </div>
  );
}

interface SkillModeSelectorProps {
  skillFilterMode: "AND" | "OR";
  setSkillFilterMode: (mode: "AND" | "OR") => void;
}

export function SkillModeSelector({
  skillFilterMode,
  setSkillFilterMode,
}: SkillModeSelectorProps) {
  return (
    <div className="flex items-center bg-zinc-955 p-0.5 rounded-md border border-zinc-800 text-[10px]">
      <button
        type="button"
        onClick={() => setSkillFilterMode("OR")}
        className={`px-1.5 py-0.5 rounded transition-all relative group ${
          skillFilterMode === "OR"
            ? "bg-zinc-800 text-amber-400 font-bold"
            : "text-zinc-550 hover:text-zinc-300"
        }`}
      >
        OR
        <Tooltip content="Match ANY selected skill" />
      </button>
      <button
        type="button"
        onClick={() => setSkillFilterMode("AND")}
        className={`px-1.5 py-0.5 rounded transition-all relative group ${
          skillFilterMode === "AND"
            ? "bg-zinc-800 text-amber-400 font-bold"
            : "text-zinc-550 hover:text-zinc-300"
        }`}
      >
        AND
        <Tooltip content="Match ALL selected skills" />
      </button>
    </div>
  );
}
