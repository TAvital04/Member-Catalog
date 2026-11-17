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
      className={`inline-flex items-center p-1 bg-white border border-neutral-300 rounded-2xl gap-1 shadow-2xs ${className}`}
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
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer select-none ${
              isActive
                ? "bg-black text-white font-bold border border-black shadow-xs"
                : "bg-transparent text-neutral-700 border border-transparent"
            }`}
          >
            {opt.icon && <span className="inline-flex shrink-0">{opt.icon}</span>}
            <span>{opt.label}</span>
            {opt.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-neutral-800 text-white"
                    : "bg-neutral-100 text-neutral-600 border border-neutral-200"
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
