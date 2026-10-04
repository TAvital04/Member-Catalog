"use client";

import React from "react";
import CustomCheckbox from "../../common/CustomCheckbox";

interface MajorsFilterProps {
  availableMajors: string[];
  selectedMajors: string[];
  onMajorToggle: (major: string) => void;
}

export default function MajorsFilter({
  availableMajors,
  selectedMajors,
  onMajorToggle,
}: MajorsFilterProps) {
  return (
    <>
      {availableMajors.map((major) => (
        <label
          key={major}
          className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors group"
        >
          <input
            type="checkbox"
            checked={selectedMajors.includes(major)}
            onChange={() => onMajorToggle(major)}
            className="sr-only"
          />
          <CustomCheckbox checked={selectedMajors.includes(major)} />
          <span>{major}</span>
        </label>
      ))}
    </>
  );
}
