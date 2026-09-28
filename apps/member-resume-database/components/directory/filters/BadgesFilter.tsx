"use client";

import React from "react";
import { ALL_BADGES } from "../../../data/students";
import CustomCheckbox from "../../common/CustomCheckbox";
import Tooltip from "../../common/Tooltip";

interface BadgesFilterProps {
  selectedBadges: string[];
  onBadgeToggle: (badge: string) => void;
  layout: "top" | "side";
}

export default function BadgesFilter({
  selectedBadges,
  onBadgeToggle,
  layout,
}: BadgesFilterProps) {
  return (
    <>
      {ALL_BADGES.map((badge) => (
        <label
          key={badge.label}
          className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors group/tooltip hover:z-50 relative select-none"
        >
          <input
            type="checkbox"
            checked={selectedBadges.includes(badge.label)}
            onChange={() => onBadgeToggle(badge.label)}
            className="sr-only"
          />
          <CustomCheckbox checked={selectedBadges.includes(badge.label)} />
          <span>{badge.label}</span>
          <Tooltip content={badge.desc} position={layout === "top" ? "top-wide" : "top-right"} />
        </label>
      ))}
    </>
  );
}
