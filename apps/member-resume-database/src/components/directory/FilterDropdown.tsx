"use client";

import React from "react";

interface FilterDropdownProps {
  title: string;
  sidebarTitle?: string;
  isOpen: boolean;
  onToggle: () => void;
  isActive: boolean;
  layout: "side" | "top";
  children: React.ReactNode;
  themeColor?: "amber" | "red";
  widthClass?: string;
  headerAction?: React.ReactNode;
}

export default function FilterDropdown({
  title,
  sidebarTitle,
  isOpen,
  onToggle,
  isActive,
  layout,
  children,
  themeColor = "amber",
  widthClass = "w-[calc(100vw-2.5rem)] max-w-[280px] md:w-56",
  headerAction,
}: FilterDropdownProps) {
  if (layout === "side") {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-350">{sidebarTitle || title}</h3>
          {headerAction}
        </div>
        <div className="flex flex-col gap-2">
          {children}
        </div>
      </div>
    );
  }

  // Top Layout (Dropdown popup menu)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all select-none ${
          isActive
            ? themeColor === "red"
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <span>{title}</span>
        <span className="text-[9px] text-zinc-550">▼</span>
      </button>

      {isOpen && (
        <div className={`absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-2 rounded-xl border border-zinc-800 bg-zinc-955 shadow-2xl p-4 flex flex-col gap-2.5 z-40 animate-scale-in ${widthClass}`}>
          {children}
        </div>
      )}
    </div>
  );
}
