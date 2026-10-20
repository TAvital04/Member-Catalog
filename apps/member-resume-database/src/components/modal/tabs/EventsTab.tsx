"use client";

import React from "react";
import { EventEntry } from "../../../data/students";
import { Calendar, MapPin, Clock, Tag } from "lucide-react";

interface EventsTabProps {
  events?: EventEntry[];
  formatDateStr: (dateStr: string) => string;
}

export default function EventsTab({ events = [], formatDateStr }: EventsTabProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-zinc-200 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
          <Calendar size={14} className="text-zinc-400 shrink-0" />
          <span>RSO Chapter Events & Workshops</span>
        </div>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5">
          {events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="p-5 rounded-2xl bg-zinc-850 border border-zinc-800 hover:border-zinc-750 transition-all flex flex-col gap-3 shadow-sm"
            >
              <div className="flex justify-between items-center gap-2 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {evt.category && (
                    <span className="text-[9.5px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-750 text-zinc-300 px-2.5 py-1 rounded-full shadow-2xs leading-none">
                      {evt.category}
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5 leading-none">
                  <Clock size={11} className="text-zinc-500" />
                  {formatDateStr(evt.startTime.split("T")[0])}
                </span>
              </div>

              <h4 className="text-sm font-bold text-zinc-100 leading-snug">
                {evt.title}
              </h4>

              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <MapPin size={12} className="text-zinc-400 shrink-0" />
                <span>{evt.location}</span>
              </div>

              <p className="text-xs text-zinc-350 leading-relaxed font-sans">
                {evt.description}
              </p>

              {evt.skills && evt.skills.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-zinc-800/80">
                  <span className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1 mr-1">
                    <Tag size={10} />
                    Skills Covered:
                  </span>
                  {evt.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-zinc-900/40">
          <p className="text-slate-400 dark:text-zinc-500 text-xs">No RSO event attendance recorded for this member yet.</p>
        </div>
      )}
    </div>
  );
}
