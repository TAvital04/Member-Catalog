"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isOpen?: boolean;
  className?: string;
}

export function DropdownTrigger({
  children,
  isOpen = false,
  className = "",
  ...props
}: DropdownTriggerProps) {
  return (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={isOpen}
      className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-semibold text-black transition-all cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-black ${className}`.trim()}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        size={13}
        className={`shrink-0 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}

export default DropdownTrigger;
