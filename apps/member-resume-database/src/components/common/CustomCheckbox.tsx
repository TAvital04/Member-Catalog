"use client";

import React from "react";

interface CustomCheckboxProps {
  checked: boolean;
  color?: "amber" | "red";
}

export default function CustomCheckbox({ checked, color = "amber" }: CustomCheckboxProps) {
  const activeBg =
    color === "red"
      ? "bg-gradient-to-br from-red-400 to-red-500 border-red-500 text-zinc-950 shadow-[0_2px_8px_rgba(239,68,68,0.3)] scale-[1.04]"
      : "bg-gradient-to-br from-amber-400 to-amber-500 border-amber-500 text-zinc-955 shadow-[0_2px_8px_rgba(245,158,11,0.3)] scale-[1.04]";

  const hoverStyles =
    color === "red"
      ? "border-zinc-700 bg-zinc-950/60 group-hover:border-red-500/55 group-hover:bg-red-500/5 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.1)]"
      : "border-zinc-700 bg-zinc-950/60 group-hover:border-amber-500/55 group-hover:bg-amber-500/5 group-hover:shadow-[0_0_8px_rgba(245,158,11,0.1)]";

  return (
    <div
      className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center transition-all duration-200 ease-out shrink-0 ${
        checked ? activeBg : hoverStyles
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`w-3 h-3 transition-all duration-200 ease-out ${
          checked ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 -rotate-12"
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
