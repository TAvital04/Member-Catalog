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
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
          <Calendar size={14} className="text-amber-500 shrink-0" />
          <span>RSO Events Attended</span>
        </div>
        <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
          {events.length} Events
        </span>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col gap-2 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {evt.title}
                </h4>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1 w-fit">
                  <Clock size={10} />
                  {formatDateStr(evt.startTime.split("T")[0])}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                <span>{evt.location}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans mt-0.5">
                {evt.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
          <p className="text-slate-400 text-xs">No RSO event attendance recorded for this member yet.</p>
        </div>
      )}
    </div>
  );
}
