"use client";

import React from "react";
import Tooltip from "./Tooltip";

interface SkillTagProps {
  skill: string;
  maxCharLength?: number;
  maxWidthClass?: string;
  variant?: "card" | "row" | "modal";
}

// Calculates font-aware glyph width for proportional typography
function getWeightedSkillLength(text: string): number {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if ("ilt1 .-+/:;,'()[]".includes(char)) {
      width += 0.55; // Narrow glyphs
    } else if ("WMQ@#".includes(char)) {
      width += 1.35; // Extra wide glyphs
    } else if (char >= "A" && char <= "Z") {
      width += 1.1; // Capital letters
    } else {
      width += 0.85; // Standard lowercase
    }
  }
  return width;
}

export default function SkillTag({
  skill,
  maxWidthClass,
  variant = "card",
}: SkillTagProps) {
  const effectiveMaxWidthClass =
    maxWidthClass ?? (variant === "card" ? "max-w-[70px]" : variant === "row" ? "max-w-[85px]" : "max-w-[160px]");

  // Weighted glyph length threshold: card pills fit up to 7.8 weighted units, row pills fit up to 10.2
  const weightedLength = getWeightedSkillLength(skill);
  const isTruncated =
    variant === "card"
      ? weightedLength > 7.8
      : variant === "row"
      ? weightedLength > 10.2
      : false;

  const variantClasses = {
    card: "text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md hover:border-amber-500/50 hover:text-amber-300 transition-colors",
    row: "text-[10px] bg-zinc-955 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md hover:border-amber-500/50 hover:text-amber-300 transition-colors",
    modal: "text-xs bg-zinc-950 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md font-medium hover:border-amber-500/50 hover:text-amber-300 transition-colors",
  }[variant];

  return (
    <div className={`relative inline-block shrink-0 ${isTruncated ? "group/tooltip hover:z-50 cursor-help" : ""}`}>
      <span className={`${variantClasses} block ${effectiveMaxWidthClass} truncate`}>
        {skill}
      </span>
      {isTruncated && <Tooltip content={skill} position="top" />}
    </div>
  );
}
