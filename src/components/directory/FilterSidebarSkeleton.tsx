"use client";

import React from "react";

export default function FilterSidebarSkeleton() {
  return (
    <div className="w-full glass-panel rounded-2xl p-4 md:p-5 flex flex-col gap-4 border border-[var(--border-subtle)]">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md animate-shimmer" />
          <div className="h-4 w-24 rounded-md animate-shimmer" />
        </div>
        <div className="h-4 w-12 rounded-md animate-shimmer" />
      </div>

      {/* Dropdown Filters Skeleton list */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-3.5 w-20 rounded-md animate-shimmer" />
            <div className="h-10 w-full rounded-xl animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
