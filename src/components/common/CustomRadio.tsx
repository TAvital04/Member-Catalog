"use client";

import React from "react";

interface CustomRadioProps {
  checked: boolean;
  color?: "amber" | "red";
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
}

export default function CustomRadio({ checked, color = "amber", onChange, ariaLabel }: CustomRadioProps) {
  const activeBg =
    color === "red"
      ? "bg-gradient-to-br from-red-400 to-red-500 border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.3)] scale-[1.04]"
      : "bg-gradient-to-br from-amber-400 to-amber-500 border-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.3)] scale-[1.04]";

  const hoverStyles =
    color === "red"
      ? "border-zinc-700 bg-zinc-955/60 group-hover:border-red-500/50 group-hover:bg-red-500/5 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.1)]"
      : "border-zinc-700 bg-zinc-955/60 group-hover:border-amber-500/50 group-hover:bg-amber-500/5 group-hover:shadow-[0_0_8px_rgba(245,158,11,0.1)]";

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
      className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all duration-200 ease-out shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
        checked ? activeBg : hoverStyles
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full bg-zinc-955 transition-all duration-200 ease-out ${
          checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
    </div>
  );
}
