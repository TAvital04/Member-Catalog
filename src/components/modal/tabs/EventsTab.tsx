"use client";

import React from "react";
import Link from "next/link";
import { EventEntry } from "@/data/students";
import { Calendar, Clock, Tag } from "lucide-react";
import { CARD_INTERACTIVE, CARD_TITLE_HOVER } from "@/lib/cardStyles";

interface EventsTabProps {
  events?: EventEntry[];
  formatDateStr?: (dateStr: string) => string;
  role?: "standard" | "sponsor" | "admin";
  onClose?: () => void;
}

export default function EventsTab({
  events = [],
  formatDateStr,
  role = "standard",
  onClose,
}: EventsTabProps) {
  const canFilter = role === "sponsor" || role === "admin";

  const formatEventDate = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const datePart = isoString.includes("T") ? isoString.split("T")[0] : isoString;
      const parts = datePart.split("-").map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        const [year, month, day] = parts;
        const d = new Date(year, month - 1, day);
        return d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return formatDateStr ? formatDateStr(isoString) : isoString;
    }
  };

  const btnHoverClass =
    "transition-all duration-200 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white shadow-sm hover:shadow active:scale-95 cursor-pointer";

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
          <Calendar size={14} className="text-amber-600 dark:text-amber-500 shrink-0" />
          <span>IEEE UCF Chapter Events & Workshops</span>
          {events.length > 0 && (
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-2 py-0.2 rounded-full font-bold">
              {events.length}
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-500 font-medium">Verified Attendance & Lab Sessions</span>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5">
          {events.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className={`${CARD_INTERACTIVE} p-4 md:p-5 flex flex-col justify-between gap-3`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  {evt.category && (
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {evt.category}
                    </span>
                  )}
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5 ml-auto">
                    <Clock size={11} className="text-slate-400" />
                    {formatEventDate(evt.startTime)}
                  </span>
                </div>

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
                        onClick={() => onClose?.()}
                        className="text-[10.5px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-2xs cursor-pointer active:scale-95"
                        title={`Filter candidates with skill: ${skill}`}
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
