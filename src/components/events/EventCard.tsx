"use client";

import React from "react";
import { Building2, Users } from "lucide-react";
import { IEEEEvent } from "@/data/events";
import { CARD_INTERACTIVE, CARD_TITLE_HOVER } from "@/lib/cardStyles";

export interface EventCardProps {
  event: IEEEEvent;
  onClick: (event: IEEEEvent) => void;
  formatDate?: (iso: string) => string;
  formatTime?: (iso?: string) => string;
}

/**
 * EventCard — Reusable Matchy-Matchy Event Catalog Card
 * Extracts presentation logic for chapter events, corporate talks, and workshops.
 */
export default function EventCard({
  event,
  onClick,
}: EventCardProps) {
  const attendees = event.attendees || [];

  return (
    <div
      onClick={() => onClick(event)}
      className={`${CARD_INTERACTIVE} p-6 flex flex-col justify-between group gap-5`}
    >
      <div className="space-y-3.5">
        {/* Category & Partner Badge Header */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {event.category}
          </span>
          {event.partner && (
            <span className="text-[10px] font-semibold text-black bg-neutral-100 px-3.5 py-1.5 rounded-full border border-neutral-300 flex items-center gap-1.5">
              <Building2 size={12} />
              <span className="truncate max-w-[130px]">{event.partner}</span>
            </span>
          )}
        </div>

        {/* Event Title */}
        <h3 className={`text-base font-bold leading-snug line-clamp-2 ${CARD_TITLE_HOVER}`}>
          {event.title}
        </h3>

        {/* Description preview */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Card Footer: Attendees */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Users size={14} className="text-slate-400" />
          <span>
            {attendees.length > 0
              ? `${attendees.length} member${attendees.length === 1 ? "" : "s"}`
              : "Open attendance"}
          </span>
        </div>
      </div>
    </div>
  );
}
