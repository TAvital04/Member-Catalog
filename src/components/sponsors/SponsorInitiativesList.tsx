"use client";

import React from "react";
import { Sparkles, Award, Wrench, Briefcase, GraduationCap, Plus } from "lucide-react";
import { SponsorInitiative } from "@/data/sponsors";
import { CARD_BASE } from "@/lib/cardStyles";

export interface SponsorInitiativesListProps {
  initiatives: SponsorInitiative[];
  sponsorName?: string;
  onRequestInitiative?: () => void;
}

/**
 * SponsorInitiativesList — Displays company sponsorship programs and lab grants
 */
export default function SponsorInitiativesList({
  initiatives,
  onRequestInitiative,
}: SponsorInitiativesListProps) {
  const getCategoryIcon = (category: SponsorInitiative["category"]) => {
    switch (category) {
      case "Lab & Hardware Grants":
        return <Wrench size={14} className="text-black" />;
      case "Technical Workshops":
        return <Sparkles size={14} className="text-black" />;
      case "Recruiting & Careers":
        return <Briefcase size={14} className="text-black" />;
      case "Capstone Mentorship":
        return <GraduationCap size={14} className="text-black" />;
      default:
        return <Award size={14} className="text-black" />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="section-title">
          <span>Active Sponsorship Initiatives & Chapter Programs</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {initiatives.length} Programs
          </span>
        </h3>

        {onRequestInitiative && (
          <button
            type="button"
            onClick={onRequestInitiative}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer transition-all shadow-2xs"
          >
            <Plus size={13} />
            <span>Request Initiative</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initiatives.map((init, idx) => (
          <div
            key={idx}
            className={`${CARD_BASE} p-5 flex flex-col justify-between gap-4`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {getCategoryIcon(init.category)}
                  <span>{init.category}</span>
                </span>

                {init.metrics && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-black border border-neutral-300">
                    {init.metrics}
                  </span>
                )}
              </div>

              <h4 className="font-bold text-sm text-slate-900 leading-snug">
                {init.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {init.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
