"use client";

import React from "react";

interface SponsorLockPanelProps {
  layout: "top" | "side";
}

export default function SponsorLockPanel({ layout }: SponsorLockPanelProps) {
  return (
    <>
      {/* Horizontal Top-bar Lock Placeholder */}
      <div className={`w-full flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 border border-zinc-800 rounded-2xl backdrop-blur-md relative z-30 ${
        layout === "side" ? "flex min-[1056px]:hidden" : "flex"
      }`}>
        <div className="flex items-center gap-4">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <div>
            <span className="text-xs font-bold text-zinc-300">Advanced Filtering Locked</span>
            <p className="text-[10px] text-zinc-550 leading-normal mt-0.5">
              Sponsor access is required to filter candidates by degree program, specific skills, graduation date, or achievements.
            </p>
          </div>
        </div>
        <a
          href="https://www.ieeeucf.com/sponsorships"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto shrink-0 px-4 py-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-[10px] text-amber-400 font-extrabold tracking-wide uppercase hover:bg-amber-500/20 hover:border-amber-500/40 transition-all shadow-sm flex items-center justify-center cursor-pointer whitespace-nowrap text-center text-xs"
        >
          Learn More About Sponsoring
        </a>
      </div>

      {/* Side Locked Placeholder */}
      <aside className={`w-full min-[1056px]:w-64 shrink-0 animate-fade-in ${
        layout === "side" ? "hidden min-[1056px]:flex" : "hidden"
      }`}>
        <div className="px-6 py-7 rounded-2xl border border-zinc-800 glass-panel flex flex-col items-center justify-between text-center relative overflow-hidden h-[295px] w-full">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-zinc-200">Advanced Filters Locked</h3>
            <p className="text-xs text-zinc-550 mt-2 leading-relaxed px-1">
              Sponsor access is required to filter candidates by degree program, specific skills, graduation date, or achievements.
            </p>
          </div>
          <a
            href="https://www.ieeeucf.com/sponsorships"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 py-2 bg-amber-500/10 border border-amber-500/25 rounded-xl text-[10px] text-amber-400 font-extrabold tracking-wide uppercase hover:bg-amber-500/20 hover:border-amber-500/40 transition-all shadow-sm flex items-center justify-center cursor-pointer text-xs"
          >
            Learn More About Sponsoring
          </a>
        </div>
      </aside>
    </>
  );
}
