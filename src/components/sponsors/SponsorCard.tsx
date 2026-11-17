"use client";

import React from "react";
import {
  MapPin,
  Calendar,
  FolderGit2,
  Briefcase,
  Users,
  Award,
} from "lucide-react";
import { ChapterSponsor } from "@/data/sponsors";
import { Card, Badge } from "@/components/ui";

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
 * SponsorCard — Standardized Corporate Sponsor Showcase Card
 * Built with the Card & Badge primitive suite.
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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(sponsor);
    }
  };

  return (
    <Card
      as="div"
      role="button"
      tabIndex={0}
      variant="interactive"
      padding="none"
      onClick={() => onSelect(sponsor)}
      onKeyDown={handleKeyDown}
      className={`text-left p-6 flex flex-col justify-between gap-5 group w-full cursor-pointer ${
        isSelected ? "ring-2 ring-black border-black" : ""
      }`}
      aria-label={`View initiatives and interactions for ${sponsor.name}`}
    >
      <div className="flex flex-col gap-3.5">
        {/* Top Header: Logo Initial & Tier Badge */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-300 text-black font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
              {sponsor.logoText || sponsor.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-black text-lg text-black leading-tight">
                {sponsor.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5">
                <MapPin size={11} className="text-neutral-400" />
                <span>{sponsor.location}</span>
                <span>•</span>
                <span>Partner since {sponsor.partnerSince}</span>
              </div>
            </div>
          </div>

          <Badge variant="outline" className="flex items-center gap-1 font-bold">
            <Award size={11} />
            <span>{sponsor.tier} Partner</span>
          </Badge>
        </div>

        {/* Tagline & Description */}
        <div>
          <p className="text-xs font-semibold text-black">
            {sponsor.tagline}
          </p>
          <p className="text-xs text-neutral-600 line-clamp-2 mt-1 leading-relaxed">
            {sponsor.description}
          </p>
        </div>

        {/* Primary Focus Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {sponsor.primaryFocus.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg text-[10.5px] bg-neutral-100 border border-neutral-200 text-black font-medium"
            >
              {tag}
            </span>
          ))}
          {sponsor.primaryFocus.length > 3 && (
            <span className="text-[10.5px] text-neutral-400 font-medium px-1">
              +{sponsor.primaryFocus.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer: Stat Badges & View Action */}
      <div className="pt-3.5 border-t border-neutral-200 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-neutral-500 text-[11px] font-medium">
          {projectCount > 0 && (
            <span className="flex items-center gap-1">
              <FolderGit2 size={13} className="text-neutral-400" />
              <span>{projectCount} projects</span>
            </span>
          )}
          {eventCount > 0 && (
            <span className="flex items-center gap-1">
              <Calendar size={13} className="text-neutral-400" />
              <span>{eventCount} workshops</span>
            </span>
          )}
          {jobCount > 0 && (
            <span className="flex items-center gap-1">
              <Briefcase size={13} className="text-neutral-400" />
              <span>{jobCount} jobs</span>
            </span>
          )}
          {interactionCount > 0 && (
            <span className="flex items-center gap-1">
              <Users size={13} className="text-neutral-400" />
              <span>{interactionCount} members</span>
            </span>
          )}
        </div>

        <span className="text-xs font-bold text-black transition-colors">
          View Hub
        </span>
      </div>
    </Card>
  );
}
