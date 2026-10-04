"use client";

import React from "react";

interface TimelineCardProps {
  startDate: string;
  endDate?: string;
  current: boolean;
  title: string;
  subtitle1: string;
  subtitle2?: string;
  gpa?: number;
  gpaScale?: number;
  description?: string;
  themeColor: "purple" | "blue" | "amber";
  formatDateStr: (date: string) => string;
}

export default function TimelineCard({
  startDate,
  endDate = "",
  current,
  title,
  subtitle1,
  subtitle2,
  gpa,
  gpaScale = 4.0,
  description,
  themeColor,
  formatDateStr,
}: TimelineCardProps) {
  const themeClasses = {
    purple: {
      hoverBorder: "hover:border-purple-500/30",
      textBadge: "text-purple-400",
      textGpa: "text-purple-400/90",
    },
    blue: {
      hoverBorder: "hover:border-blue-500/30",
      textBadge: "text-blue-400",
      textGpa: "text-blue-400/90",
    },
    amber: {
      hoverBorder: "hover:border-amber-500/30",
      textBadge: "text-amber-400",
      textGpa: "text-amber-400/90",
    },
  }[themeColor];

  const displayDate = `${formatDateStr(startDate)} - ${current ? "Present" : formatDateStr(endDate)}`;

  return (
    <div className={`p-4 rounded-xl bg-zinc-850 border border-zinc-800 ${themeClasses.hoverBorder} transition-all flex flex-col gap-2 shadow-sm min-w-0 overflow-hidden`}>
      <div className="flex justify-between items-start gap-2 border-b border-zinc-800/60 pb-1.5">
        <span className={`text-[9px] font-extrabold uppercase tracking-wider ${themeClasses.textBadge}`}>
          {themeColor === "purple" ? "ROLE / POSITION" : "INSTITUTION"}
        </span>
        <span className="text-[9.5px] text-zinc-500 font-semibold bg-zinc-950/80 border border-zinc-800 px-2 py-0.5 rounded-md">
          {displayDate}
        </span>
      </div>

      <h5 className="font-extrabold text-zinc-100 text-xs whitespace-normal break-all [overflow-wrap:anywhere] leading-snug">
        {title}
      </h5>

      <div className="flex flex-col gap-0.5">
        <p className="text-[11px] font-semibold text-zinc-300 whitespace-normal break-all [overflow-wrap:anywhere]">
          {subtitle1}
        </p>
        {subtitle2 && (
          <p className="text-[10px] text-zinc-500 whitespace-normal break-all [overflow-wrap:anywhere]">
            {subtitle2}
          </p>
        )}
      </div>

      {gpa !== undefined && (
        <div className="mt-1 pt-1.5 border-t border-zinc-800/60 flex items-center gap-1">
          <span className="text-[9px] font-extrabold text-zinc-550 uppercase tracking-wider">GPA:</span>
          <span className={`text-[10.5px] font-bold ${themeClasses.textGpa}`}>
            {gpa} / {gpaScale}
          </span>
        </div>
      )}

      {description && (
        <p className="text-[10.5px] text-zinc-400 italic mt-1 leading-relaxed border-t border-zinc-800/60 pt-1.5 whitespace-pre-wrap break-all [overflow-wrap:anywhere]">
          {description}
        </p>
      )}
    </div>
  );
}
