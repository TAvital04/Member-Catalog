"use client";

import React from "react";
import { Building2, Users } from "lucide-react";
import { IEEEEvent } from "@/data/events";
import { Card, Badge } from "@/components/ui";

export interface EventCardProps {
  event: IEEEEvent;
  onClick: (event: IEEEEvent) => void;
  formatDate?: (iso: string) => string;
  formatTime?: (iso?: string) => string;
}

/**
 * EventCard — Reusable Standardized Event Catalog Card
 * Built with the single-source Card & Badge primitives.
 */
export default function EventCard({
  event,
  onClick,
}: EventCardProps) {
  const attendees = event.attendees || [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(event);
    }
  };

  return (
    <Card
      as="div"
      role="button"
      tabIndex={0}
      variant="interactive"
      padding="none"
      onClick={() => onClick(event)}
      onKeyDown={handleKeyDown}
      className="text-left p-6 flex flex-col justify-between group gap-5 w-full cursor-pointer"
    >
      <div className="space-y-3.5">
        {/* Category & Partner Badge Header */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="neutral">{event.category}</Badge>
          {event.partner && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Building2 size={12} />
              <span className="truncate max-w-[130px]">{event.partner}</span>
            </Badge>
          )}
        </div>

        {/* Event Title */}
        <h3 className="text-base font-bold text-black leading-snug line-clamp-2">
          {event.title}
        </h3>

        {/* Description preview */}
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Card Footer: Attendees */}
      <div className="pt-3.5 border-t border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
          <Users size={14} className="text-neutral-500" />
          <span>
            {attendees.length > 0
              ? `${attendees.length} member${attendees.length === 1 ? "" : "s"}`
              : "Open attendance"}
          </span>
        </div>
      </div>
    </Card>
  );
}
