"use client";

import React from "react";
import { Check } from "lucide-react";

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isSelected?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function DropdownItem({
  children,
  isSelected = false,
  icon,
  className = "",
  ...props
}: DropdownItemProps) {
  return (
    <button
      type="button"
      className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors text-left select-none ${
        isSelected
          ? "bg-black text-white font-bold"
          : "text-neutral-800 hover:bg-neutral-100 hover:text-black"
      } ${className}`.trim()}
      {...props}
    >
      <div className="flex items-center gap-2 truncate">
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{children}</span>
      </div>
      {isSelected && <Check size={12} className="shrink-0" />}
    </button>
  );
}

export default DropdownItem;
