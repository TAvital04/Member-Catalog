"use client";

import React from "react";
import { EventEntry } from "../../../data/students";
import { Calendar, MapPin, Clock } from "lucide-react";

interface EventsTabProps {
  events?: EventEntry[];
  formatDateStr: (dateStr: string) => string;
}

export default function EventsTab({ events = [], formatDateStr }: EventsTabProps) {
  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal">
          <Calendar size={14} className="text-amber-500 shrink-0" />
          <span>IEEE Events Attended</span>
        </div>
        <span className="text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
          {events.length} Events
        </span>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="rounded-2xl border border-zinc-800 bg-zinc-850/80 p-4 backdrop-blur-sm shadow-sm hover:border-amber-500/30 transition-all flex flex-col gap-2 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-zinc-800/60 pb-2">
                <h4 className="text-sm font-extrabold text-zinc-100 group-hover:text-amber-400 transition-colors">
                  {evt.title}
                </h4>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 w-fit">
                  <Clock size={10} />
                  {formatDateStr(evt.startTime.split("T")[0])}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <MapPin size={12} className="text-amber-500 shrink-0" />
                <span>{evt.location}</span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans mt-0.5">
                {evt.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-xs">No IEEE event attendance recorded for this member yet.</p>
        </div>
      )}
    </div>
  );
}
