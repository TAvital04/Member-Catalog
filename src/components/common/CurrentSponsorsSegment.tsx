"use client";

import React from "react";
import { CURRENT_CHAPTER_SPONSORS } from "@/data/sponsors";
import { CARD_HOVER_EFFECT } from "@/lib/cardStyles";

interface CurrentSponsorsSegmentProps {
  variant?: "panel" | "full";
  className?: string;
  title?: string;
}

export default function CurrentSponsorsSegment({
  variant = "panel",
  className = "",
  title = "Current Sponsors",
}: CurrentSponsorsSegmentProps) {
  if (variant === "panel") {
    return (
      <div className={`flex flex-col gap-2.5 pt-3 border-t border-slate-200 ${className}`}>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <span>{title}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {CURRENT_CHAPTER_SPONSORS.slice(0, 4).map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between text-left group ${CARD_HOVER_EFFECT}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 transition-colors truncate">
                    {sponsor.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                  {sponsor.tagline}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // Full-width grid layout for tabs / pages
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          <span>{title}</span>
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {CURRENT_CHAPTER_SPONSORS.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between gap-2 text-left group ${CARD_HOVER_EFFECT}`}
          >
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 transition-colors block truncate">
                {sponsor.name}
              </span>
              <p className="text-[10.5px] text-slate-500 leading-snug mt-0.5">
                {sponsor.tagline}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
