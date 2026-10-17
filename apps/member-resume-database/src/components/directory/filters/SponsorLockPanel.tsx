"use client";

import React from "react";
import { Lock } from "lucide-react";

interface SponsorLockPanelProps {
  layout: "top" | "side";
}

export default function SponsorLockPanel({ layout }: SponsorLockPanelProps) {
  return (
    <>
      {/* Horizontal Top-bar Lock Placeholder */}
      <div className={`w-full flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-2xs relative z-30 ${
        layout === "side" ? "flex min-[1056px]:hidden" : "flex"
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
            <Lock size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">Advanced Filtering Locked</span>
            <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
              Sponsor access is required to filter candidates by degree program, specific skills, graduation date, or achievements.
            </p>
          </div>
        </div>
        <a
          href="https://www.ieeeucf.com/sponsorships"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center cursor-pointer whitespace-nowrap text-center"
        >
          Learn More About Sponsoring
        </a>
      </div>

      {/* Side Locked Placeholder */}
      <aside className={`w-full min-[1056px]:w-64 shrink-0 ${
        layout === "side" ? "hidden min-[1056px]:flex" : "hidden"
      }`}>
        <div className="px-5 py-6 rounded-2xl border border-slate-200 bg-white shadow-2xs flex flex-col items-center justify-between text-center relative overflow-hidden h-[295px] w-full">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0 mt-2">
            <Lock size={18} />
          </div>
          <div className="my-auto">
            <h3 className="text-sm font-bold text-slate-900">Advanced Filters Locked</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed px-1">
              Sponsor access is required to filter candidates by degree program, specific skills, graduation date, or achievements.
            </p>
          </div>
          <a
            href="https://www.ieeeucf.com/sponsorships"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center cursor-pointer text-center"
          >
            Learn More About Sponsoring
          </a>
        </div>
      </aside>
    </>
  );
}
