"use client";

import React from "react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * SegmentedControl — Unified Matchy-Matchy Segmented Tab Control
 * Clean, tactile switcher for views, subtabs, and modes with zero bright-white leaks.
 */
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
  ariaLabel = "View switcher",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`segmented-group ${className}`}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={`segmented-tab ${
              isActive ? "segmented-tab-active" : "segmented-tab-inactive"
            }`}
          >
            {opt.icon && <span className="inline-flex shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-amber-500/20 text-amber-800 dark:text-amber-400"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
