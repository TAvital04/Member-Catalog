"use client";

import React from "react";

interface TimelineCategoryProps {
  title: string;
  icon: React.ReactNode;
  headerTextColorClass: string;
  children: React.ReactNode;
  hasItems: boolean;
  emptyMessage: string;
}

export default function TimelineCategory({
  title,
  icon,
  headerTextColorClass,
  children,
  hasItems,
  emptyMessage
}: TimelineCategoryProps) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className={`text-[11px] ${headerTextColorClass} font-bold uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5`}>
        {icon}
        <span>{title}</span>
      </h4>

      {hasItems ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 max-[1055px]:md:grid-cols-1 gap-4">
          {children}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-555 text-[10px]">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
