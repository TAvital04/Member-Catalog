"use client";

import React from "react";

interface CustomCheckboxProps {
  checked: boolean;
  color?: "amber" | "red";
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
}

export default function CustomCheckbox({ checked, onChange, ariaLabel }: CustomCheckboxProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === " " || e.key === "Enter") && onChange) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      tabIndex={onChange ? 0 : undefined}
      onKeyDown={handleKeyDown}
      className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-all duration-150 ease-out shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black cursor-pointer ${
        checked
          ? "bg-black border-black text-white"
          : "border-neutral-400 bg-white text-transparent"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`w-3 h-3 transition-all duration-150 ease-out ${
          checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}
