"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

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
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{sidebarTitle || title}</h3>
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
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all select-none shadow-2xs cursor-pointer ${
          isActive
            ? "bg-black border-black text-white font-bold"
            : "bg-white border-neutral-300 text-black hover:bg-neutral-100"
        }`}
      >
        <span>{title}</span>
        <ChevronDown size={11} className={`transition-transform text-slate-400 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className={`absolute left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-2 rounded-xl border border-slate-200 bg-white shadow-xl p-4 flex flex-col gap-2.5 z-40 animate-scale-in ${widthClass}`}>
          {children}
        </div>
      )}
    </div>
  );
}
