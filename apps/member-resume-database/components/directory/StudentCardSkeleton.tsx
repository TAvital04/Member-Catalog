"use client";

import React from "react";

export default function StudentCardSkeleton() {
  return (
    <div className="relative rounded-2xl glass-panel p-4 md:p-5 flex flex-col justify-between h-[185px] md:h-[295px] border border-[var(--border-subtle)]">
      {/* Top Section */}
      <div className="flex flex-col gap-2 md:gap-3">
        <div className="flex items-start justify-between min-w-0">
          <div className="flex items-center gap-2.5 md:gap-3 min-w-0 grow">
            {/* Avatar Skeleton */}
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-full animate-shimmer shrink-0" />
            <div className="min-w-0 grow space-y-1.5">
              {/* Name Skeleton */}
              <div className="h-4 w-3/5 rounded-md animate-shimmer" />
              {/* Major Skeleton */}
              <div className="h-3 w-2/5 rounded-md animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Bio lines - Desktop */}
        <div className="hidden md:flex flex-col gap-1.5 mt-2">
          <div className="h-3 w-full rounded-md animate-shimmer" />
          <div className="h-3 w-4/5 rounded-md animate-shimmer" />
        </div>
      </div>

      {/* Middle Section (Status Badge) */}
      <div className="flex items-center">
        <div className="h-6 w-28 rounded-full animate-shimmer" />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2 md:gap-3 pt-2.5 md:pt-3 border-t border-[var(--border-subtle)] w-full">
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 rounded-md animate-shimmer" />
          <div className="h-3 w-16 rounded-md animate-shimmer" />
        </div>
        {/* Skills Tag Skeleton */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          <div className="h-5 w-14 rounded-md animate-shimmer shrink-0" />
          <div className="h-5 w-16 rounded-md animate-shimmer shrink-0" />
          <div className="h-5 w-12 rounded-md animate-shimmer shrink-0" />
        </div>
      </div>
    </div>
  );
}
