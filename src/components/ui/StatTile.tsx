"use client";

import React, { HTMLAttributes } from "react";

export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  subtext?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export function StatTile({
  label,
  value,
  subtext,
  icon,
  badge,
  className = "",
  ...props
}: StatTileProps) {
  return (
    <div
      className={`p-4 rounded-xl bg-white border border-neutral-300 flex flex-col justify-between gap-1 shadow-2xs ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5 truncate">
          {icon && <span className="text-black shrink-0">{icon}</span>}
          <span>{label}</span>
        </span>
        {badge}
      </div>

      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-black text-black tracking-tight">{value}</span>
        {subtext && <span className="text-[11px] font-medium text-neutral-500">{subtext}</span>}
      </div>
    </div>
  );
}

export default StatTile;
