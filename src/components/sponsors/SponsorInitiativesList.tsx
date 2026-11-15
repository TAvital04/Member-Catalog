"use client";

import React from "react";
import { Sparkles, Award, Wrench, Briefcase, GraduationCap } from "lucide-react";
import { SponsorInitiative } from "@/data/sponsors";
import { CARD_BASE } from "@/lib/cardStyles";

export interface SponsorInitiativesListProps {
  initiatives: SponsorInitiative[];
  sponsorName?: string;
}

/**
 * SponsorInitiativesList — Displays company sponsorship programs and lab grants
 */
export default function SponsorInitiativesList({
  initiatives,
}: SponsorInitiativesListProps) {
  const getCategoryIcon = (category: SponsorInitiative["category"]) => {
    switch (category) {
      case "Lab & Hardware Grants":
        return <Wrench size={14} className="text-amber-600" />;
      case "Technical Workshops":
        return <Sparkles size={14} className="text-amber-600" />;
      case "Recruiting & Careers":
        return <Briefcase size={14} className="text-amber-600" />;
      case "Capstone Mentorship":
        return <GraduationCap size={14} className="text-amber-600" />;
      default:
        return <Award size={14} className="text-amber-600" />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="section-title">
          <span>Active Sponsorship Initiatives & Chapter Programs</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {initiatives.length} Programs
          </span>
        </h3>
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
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
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
