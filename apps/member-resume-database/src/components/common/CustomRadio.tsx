"use client";

import React from "react";

interface CustomRadioProps {
  checked: boolean;
  color?: "amber" | "red";
}

export default function CustomRadio({ checked, color = "amber" }: CustomRadioProps) {
  const activeBg =
    color === "red"
      ? "bg-gradient-to-br from-red-400 to-red-500 border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.3)] scale-[1.04]"
      : "bg-gradient-to-br from-amber-400 to-amber-500 border-amber-500 shadow-[0_2px_8px_rgba(245,158,11,0.3)] scale-[1.04]";

  const hoverStyles =
    color === "red"
      ? "border-zinc-700 bg-zinc-955/60 group-hover:border-red-500/50 group-hover:bg-red-500/5 group-hover:shadow-[0_0_8px_rgba(239,68,68,0.1)]"
      : "border-zinc-700 bg-zinc-955/60 group-hover:border-amber-500/50 group-hover:bg-amber-500/5 group-hover:shadow-[0_0_8px_rgba(245,158,11,0.1)]";

  return (
    <div
      className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all duration-200 ease-out shrink-0 ${
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
