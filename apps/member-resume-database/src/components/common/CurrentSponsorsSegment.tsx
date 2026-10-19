"use client";

import React from "react";
import { Building2, ExternalLink, Award } from "lucide-react";
import { CURRENT_CHAPTER_SPONSORS, ChapterSponsor } from "@/data/sponsors";
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
  const getTierBadgeClass = (tier: ChapterSponsor["tier"]) => {
    switch (tier) {
      case "Platinum":
        return "bg-amber-50 text-amber-900 border-amber-300/80";
      case "Gold":
        return "bg-amber-50/60 text-amber-800 border-amber-200/60";
      case "Silver":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (variant === "panel") {
    return (
      <div className={`flex flex-col gap-2.5 pt-3 border-t border-slate-200 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <Building2 size={12} className="text-amber-500" />
            <span>{title}</span>
          </div>
          <span className="text-[9.5px] font-semibold text-slate-400">IEEE UCF</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {CURRENT_CHAPTER_SPONSORS.slice(0, 4).map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between text-left group ${CARD_HOVER_EFFECT}`}
              title={`Visit ${sponsor.name} (${sponsor.tier} Sponsor)`}
            >
              <div className="min-w-0 pr-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors truncate">
                    {sponsor.name}
                  </span>
                  <span
                    className={`text-[8.5px] font-extrabold uppercase px-1.5 py-0.2 rounded-md border shrink-0 ${getTierBadgeClass(
                      sponsor.tier
                    )}`}
                  >
                    {sponsor.tier}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                  {sponsor.tagline}
                </span>
              </div>
              <ExternalLink
                size={11}
                className="text-slate-300 group-hover:text-amber-600 transition-colors shrink-0"
              />
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
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Building2 size={14} className="text-amber-500" />
          <span>{title}</span>
        </h4>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Official Industry Partners
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {CURRENT_CHAPTER_SPONSORS.map((sponsor) => (
          <a
            key={sponsor.id}
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between gap-2 text-left group ${CARD_HOVER_EFFECT}`}
            title={`Visit ${sponsor.name}`}
          >
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                {sponsor.name}
              </span>
              <span
                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border shrink-0 ${getTierBadgeClass(
                  sponsor.tier
                )}`}
              >
                {sponsor.tier}
              </span>
            </div>
            <p className="text-[10.5px] text-slate-500 leading-snug">
              {sponsor.tagline}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400 group-hover:text-amber-600 transition-colors">
              <span>Official Partner</span>
              <ExternalLink size={11} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
