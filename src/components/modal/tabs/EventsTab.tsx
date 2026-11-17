"use client";

import React from "react";
import Link from "next/link";
import { EventEntry } from "@/data/students";
import { Tag } from "lucide-react";
import { CARD_INTERACTIVE, CARD_TITLE_HOVER } from "@/lib/cardStyles";

interface EventsTabProps {
  events?: EventEntry[];
  formatDateStr?: (dateStr: string) => string;
  role?: "standard" | "sponsor" | "admin";
  onClose?: () => void;
  onSelectEvent?: (event: EventEntry) => void;
}

export default function EventsTab({
  events = [],
  role = "standard",
  onClose,
  onSelectEvent,
}: EventsTabProps) {
  const canFilter = role === "sponsor" || role === "admin";

  const handleCardClick = (e: React.MouseEvent, evt: EventEntry) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }
    onSelectEvent?.(evt);
  };

  const handleKeyDown = (e: React.KeyboardEvent, evt: EventEntry) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectEvent?.(evt);
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
          <span>IEEE UCF Chapter Events & Workshops</span>
          {events.length > 0 && (
            <span className="bg-neutral-100 text-black border border-neutral-300 text-[10px] px-2 py-0.2 rounded-full font-bold">
              {events.length}
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-500 font-medium">Attendance & Lab Sessions</span>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5">
          {events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              role="button"
              tabIndex={0}
              onClick={(e) => handleCardClick(e, evt)}
              onKeyDown={(e) => handleKeyDown(e, evt)}
              aria-label={`Open event details for ${evt.title}`}
              className={`${CARD_INTERACTIVE} p-4 md:p-5 flex flex-col justify-between gap-3 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-none`}
            >
              <div className="flex flex-col gap-2">
                {evt.category && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {evt.category}
                    </span>
                  </div>
                )}

                <h4 className={`font-bold text-sm md:text-base leading-tight ${CARD_TITLE_HOVER} transition-colors`}>
                  {evt.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              {evt.skills && evt.skills.length > 0 && (
                <div className="pt-2.5 md:pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                    <Tag size={10} />
                    Skills Covered:
                  </span>
                  {evt.skills.map((skill, sIdx) => {
                    return canFilter ? (
                      <Link
                        key={sIdx}
                        href={`/?skills=${encodeURIComponent(skill)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose?.();
                        }}
                        className="text-[10.5px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer shadow-2xs"
                      >
                        <span>{skill}</span>
                      </Link>
                    ) : (
                      <span
                        key={sIdx}
                        className="text-[10.5px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 select-none shadow-2xs"
                      >
                        {skill}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-6 shadow-2xs">
          <p className="text-slate-500 text-xs">No IEEE UCF event attendance recorded for this member yet.</p>
        </div>
      )}
    </div>
  );
}
