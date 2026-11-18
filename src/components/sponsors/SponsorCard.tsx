"use client";

import React from "react";
import { FolderGit2, Award } from "lucide-react";
import { ChapterSponsor } from "@/data/sponsors";
import { CatalogCard, Badge } from "@/components/ui";

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
 * Built with the unified CatalogCard primitive.
 */
export default function SponsorCard({
  sponsor,
  projectCount,
  eventCount,
  isSelected = false,
  onSelect,
}: SponsorCardProps) {
  return (
    <CatalogCard
      avatar={
        <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-300 text-black font-black text-xs flex items-center justify-center shrink-0">
          {sponsor.logoText || sponsor.name.slice(0, 2).toUpperCase()}
        </div>
      }
      badgeRight={
        <Badge
          variant="outline"
          size="sm"
          icon={<Award size={11} className="shrink-0 text-black" />}
          className="shrink-0 whitespace-nowrap text-[10px] font-bold"
        >
          {sponsor.tier} Partner
        </Badge>
      }
      title={sponsor.name}
      subtitle={`${sponsor.location} • Partner since ${sponsor.partnerSince}`}
      description={sponsor.tagline || sponsor.description}
      footerIcon={<FolderGit2 size={13} className="text-neutral-400" />}
      footerText={`${projectCount} project${projectCount === 1 ? "" : "s"} • ${eventCount} workshop${eventCount === 1 ? "" : "s"}`}
      isSelected={isSelected}
      onClick={() => onSelect(sponsor)}
      ariaLabel={`View initiatives and interactions for ${sponsor.name}`}
    />
  );
}
