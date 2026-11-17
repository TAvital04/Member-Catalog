"use client";

import React from "react";
import { X, Check } from "lucide-react";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isSelected?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function Chip({
  children,
  isSelected = false,
  onRemove,
  icon,
  className = "",
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none active:scale-95 shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black ${
        isSelected
          ? "bg-black text-white border border-black font-bold"
          : "bg-white hover:bg-neutral-100 text-black border border-neutral-300 hover:border-black"
      } ${className}`.trim()}
      {...props}
    >
      {isSelected && !onRemove && <Check size={12} className="shrink-0" />}
      {!isSelected && icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          aria-label="Remove item"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-75 p-0.5 rounded cursor-pointer shrink-0"
        >
          <X size={12} />
        </span>
      )}
    </button>
  );
}

export default Chip;
