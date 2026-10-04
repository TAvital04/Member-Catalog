"use client";

import React from "react";
import CustomCheckbox from "../../common/CustomCheckbox";

interface GradDatesFilterProps {
  availableGradDates: string[];
  selectedGradDates: string[];
  onGradToggle: (date: string) => void;
}

export default function GradDatesFilter({
  availableGradDates,
  selectedGradDates,
  onGradToggle,
}: GradDatesFilterProps) {
  return (
    <>
      {availableGradDates.map((date) => (
        <label
          key={date}
          className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors group"
        >
          <input
            type="checkbox"
            checked={selectedGradDates.includes(date)}
            onChange={() => onGradToggle(date)}
            className="sr-only"
          />
          <CustomCheckbox checked={selectedGradDates.includes(date)} />
          <span>{date}</span>
        </label>
      ))}
    </>
  );
}
