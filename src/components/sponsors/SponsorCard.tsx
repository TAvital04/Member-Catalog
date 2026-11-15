"use client";

import React from "react";
import {
  Building2,
  ExternalLink,
  MapPin,
  Calendar,
  FolderGit2,
  Briefcase,
  Users,
  Award,
} from "lucide-react";
import { ChapterSponsor } from "@/data/sponsors";
import { CARD_INTERACTIVE, CARD_TITLE_HOVER } from "@/lib/cardStyles";
import Tooltip from "@/components/common/Tooltip";

export interface SponsorCardProps {
  sponsor: ChapterSponsor;
  projectCount: number;
  eventCount: number;
  jobCount: number;
  interactionCount: number;
  isSelected?: boolean;
  onSelect: (sponsor: ChapterSponsor) => void;
}

/**
 * SponsorCard — Matchy-Matchy Corporate Sponsor Showcase Card
 */
export default function SponsorCard({
  sponsor,
  projectCount,
  eventCount,
  jobCount,
  interactionCount,
  isSelected = false,
  onSelect,
}: SponsorCardProps) {
  const tierColor =
    sponsor.tier === "Platinum"
      ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30"
      : sponsor.tier === "Gold"
      ? "bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30"
      : "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View initiatives and interactions for ${sponsor.name}`}
      onClick={() => onSelect(sponsor)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(sponsor);
        }
      }}
      className={`${CARD_INTERACTIVE} p-6 flex flex-col justify-between gap-5 group ${
        isSelected ? "ring-2 ring-amber-500 border-amber-500" : ""
      }`}
    >
      <div className="flex flex-col gap-3.5">
        {/* Top Header: Logo Initial & Tier Badge */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
              {sponsor.logoText || sponsor.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className={`font-black text-lg leading-tight ${CARD_TITLE_HOVER}`}>
                {sponsor.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <MapPin size={11} className="text-slate-400" />
                <span>{sponsor.location}</span>
                <span>•</span>
                <span>Partner since {sponsor.partnerSince}</span>
              </div>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs flex items-center gap-1 ${tierColor}`}
          >
            <Award size={11} />
            <span>{sponsor.tier} Partner</span>
          </span>
        </div>

        {/* Tagline & Description */}
        <div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {sponsor.tagline}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {sponsor.description}
          </p>
        </div>

        {/* Primary Focus Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {sponsor.primaryFocus.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg text-[10.5px] bg-slate-100 border border-slate-200 text-slate-700 font-medium"
            >
              {tag}
            </span>
          ))}
          {sponsor.primaryFocus.length > 3 && (
            <span className="text-[10.5px] text-slate-400 font-medium px-1">
              +{sponsor.primaryFocus.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer: Stat Badges & View Action */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium">
          {projectCount > 0 && (
            <span className="flex items-center gap-1">
              <FolderGit2 size={13} className="text-slate-400" />
              <span>{projectCount} projects</span>
            </span>
          )}
          {eventCount > 0 && (
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-slate-400" />
              <span>{eventCount} workshops</span>
            </span>
          )}
          {jobCount > 0 && (
            <span className="flex items-center gap-1">
              <Briefcase size={13} className="text-slate-400" />
              <span>{jobCount} jobs</span>
            </span>
          )}
          {interactionCount > 0 && (
            <span className="flex items-center gap-1">
              <Users size={13} className="text-slate-400" />
              <span>{interactionCount} members</span>
            </span>
          )}
        </div>

        <span className="text-xs font-bold text-slate-800 group-hover:text-amber-800 transition-colors">
          View Hub
        </span>
      </div>
    </div>
  );
}
