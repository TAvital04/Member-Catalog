"use client";

import React from "react";

interface CustomRadioProps {
  checked: boolean;
  color?: "amber" | "red";
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
}

export default function CustomRadio({ checked, onChange, ariaLabel }: CustomRadioProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === " " || e.key === "Enter") && onChange) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      role="radio"
      aria-checked={checked}
      aria-label={ariaLabel}
      tabIndex={onChange ? 0 : undefined}
      onKeyDown={handleKeyDown}
      className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all duration-150 ease-out shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black cursor-pointer ${
        checked
          ? "border-black bg-white"
          : "border-neutral-400 bg-white hover:border-black"
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full bg-black transition-all duration-150 ease-out ${
          checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
    </div>
  );
}
