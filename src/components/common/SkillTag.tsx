"use client";

import React from "react";
import Link from "next/link";
import Tooltip from "./Tooltip";

interface SkillTagProps {
  skill: string;
  maxCharLength?: number;
  maxWidthClass?: string;
  variant?: "card" | "row" | "modal";
  clickable?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

function getWeightedSkillLength(text: string): number {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if ("ilt1 .-+/:;,'()[]".includes(char)) {
      width += 0.55;
    } else if ("WMQ@#".includes(char)) {
      width += 1.35;
    } else if (char >= "A" && char <= "Z") {
      width += 1.1;
    } else {
      width += 0.85;
    }
  }
  return width;
}

export default function SkillTag({
  skill,
  maxWidthClass,
  variant = "card",
  clickable = true,
  onClick,
}: SkillTagProps) {
  const effectiveMaxWidthClass =
    maxWidthClass ?? (variant === "card" ? "max-w-[70px]" : variant === "row" ? "max-w-[85px]" : "max-w-[160px]");

  const weightedLength = getWeightedSkillLength(skill);
  const isTruncated =
    variant === "card"
      ? weightedLength > 7.8
      : variant === "row"
      ? weightedLength > 10.2
      : false;

  const variantClasses = {
    card: "text-[10px] font-medium bg-neutral-100 border border-neutral-300 text-black px-2 py-0.5 rounded hover:border-black hover:bg-neutral-200 transition-colors",
    row: "text-[10px] font-medium bg-neutral-100 border border-neutral-300 text-black px-2 py-0.5 rounded hover:border-black hover:bg-neutral-200 transition-colors",
    modal: "text-xs font-medium bg-neutral-100 border border-neutral-300 text-black px-2.5 py-1 rounded hover:border-black hover:bg-neutral-200 transition-colors",
  }[variant];

  const pillContent = (
    <span className={`${variantClasses} block ${effectiveMaxWidthClass} truncate`}>
      {skill}
    </span>
  );

  return (
    <div className={`relative inline-block shrink-0 ${isTruncated ? "group/tooltip hover:z-50" : ""}`}>
      {clickable ? (
        <Link
          href={`/?skills=${encodeURIComponent(skill)}`}
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
          }}
          className="block cursor-pointer focus:outline-none focus:ring-1 focus:ring-black rounded"
          title={`Filter candidates with skill: ${skill}`}
        >
          {pillContent}
        </Link>
      ) : (
        pillContent
      )}
      {isTruncated && <Tooltip content={skill} position="top" />}
    </div>
  );
}
