"use client";

import React from "react";
import { Building2, Users } from "lucide-react";
import { IEEEEvent } from "@/data/events";
import { CatalogCard, Badge } from "@/components/ui";

export interface EventCardProps {
  event: IEEEEvent;
  onClick: (event: IEEEEvent) => void;
  formatDate?: (iso: string) => string;
  formatTime?: (iso?: string) => string;
}

/**
 * EventCard — Reusable Standardized Event Catalog Card
 * Built with the unified CatalogCard primitive.
 */
export default function EventCard({
  event,
  onClick,
}: EventCardProps) {
  const attendees = event.attendees || [];

  return (
    <CatalogCard
      badge={<Badge variant="neutral">{event.category}</Badge>}
      badgeRight={
        event.partner ? (
          <Badge
            variant="outline"
            size="sm"
            icon={<Building2 size={11} className="shrink-0" />}
            className="shrink-0 whitespace-nowrap text-[10px]"
          >
            <span className="truncate max-w-[120px]">{event.partner}</span>
          </Badge>
        ) : null
      }
      title={event.title}
      description={event.description}
      footerIcon={<Users size={13} className="text-neutral-400" />}
      footerText={
        attendees.length > 0
          ? `${attendees.length} member${attendees.length === 1 ? "" : "s"}`
          : "Open attendance"
      }
      onClick={() => onClick(event)}
      ariaLabel={`View workshop details for ${event.title}`}
    />
  );
}
