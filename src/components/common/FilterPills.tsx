"use client";

import React from "react";

export interface FilterPillOption {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface FilterPillsProps {
  options: (string | FilterPillOption)[];
  selected: string;
  onSelect: (id: string) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * FilterPills — Reusable, Matchy-Matchy Pill Filter Group
 * Used across Events, Projects, Jobs, and Candidate directory for instant category filtering.
 */
export default function FilterPills({
  options,
  selected,
  onSelect,
  className = "",
  ariaLabel = "Filter options",
}: FilterPillsProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex flex-wrap items-center gap-1.5 ${className}`}
    >
      {options.map((opt) => {
        const id = typeof opt === "string" ? opt : opt.id;
        const label = typeof opt === "string" ? opt : opt.label;
        const count = typeof opt === "object" ? opt.count : undefined;
        const icon = typeof opt === "object" ? opt.icon : undefined;
        const isSelected = selected.toLowerCase() === id.toLowerCase();

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-pressed={isSelected}
            className={`filter-pill ${
              isSelected ? "filter-pill-active" : "filter-pill-inactive"
            }`}
          >
            {icon && <span className="inline-flex shrink-0">{icon}</span>}
            <span>{label}</span>
            {typeof count === "number" && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? "bg-amber-950/20 text-slate-950"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
