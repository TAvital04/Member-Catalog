"use client";

/**
 * @file SponsorInitiativesBanner.tsx — Wide Open Area Introducing Sponsors to Chapter Initiatives & Services
 * @description Serves as the primary wide welcoming showcase for corporate partners, explaining that
 * initiatives are the umbrella for everything a sponsor can support (projects, workshops, lab grants,
 * hackathons, recruiting), describing the different services offered, and offering a prominent CTA to
 * initiate a conversation with Chapter Leadership.
 */

import React from "react";
import {
  FolderGit2,
  Calendar,
  Wrench,
  Trophy,
  Users,
  Plus,
  Mail,
  ArrowRight,
} from "lucide-react";

export interface SponsorInitiativesBannerProps {
  onRequestInitiative: () => void;
  sponsorName?: string;
  isLoggedInSponsor?: boolean;
}

const SERVICES_OFFERED = [
  {
    title: "Engineering Build Projects",
    description:
      "Co-sponsor student robotics, autonomous rovers, quadcopter swarms, and embedded flight software built for national competitions.",
    icon: FolderGit2,
  },
  {
    title: "Technical Workshops & Talks",
    description:
      "Host hands-on labs, firmware bootcamps (STM32, FreeRTOS), PCB fabrication clinics, and corporate engineer-led tech talks.",
    icon: Calendar,
  },
  {
    title: "Lab & Hardware Equipment Grants",
    description:
      "Equip student maker spaces with oscilloscopes, FPGA boards, SMD soldering stations, sensor components, and 3D printing equipment.",
    icon: Wrench,
  },
  {
    title: "Student Hackathons & Bounties",
    description:
      "Sponsor dedicated challenge tracks, provide component bounties, mentor student teams, and judge hardware/software hackathons.",
    icon: Trophy,
  },
  {
    title: "Recruiting & Talent Pipelines",
    description:
      "Access our verified member directory, filter student portfolios by technical skills and graduation year, and host recruiter showcases.",
    icon: Users,
  },
];

export default function SponsorInitiativesBanner({
  onRequestInitiative,
  sponsorName,
  isLoggedInSponsor = false,
}: SponsorInitiativesBannerProps) {
  return (
    <section
      aria-labelledby="initiatives-banner-heading"
      className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-6"
    >
      {/* Top Banner Overview */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-300 text-[10.5px] font-bold text-black uppercase tracking-wider">
            <span>Sponsorship Initiatives & Programs</span>
          </div>

          <h2
            id="initiatives-banner-heading"
            className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight"
          >
            Initiatives: The Umbrella for Everything You Can Sponsor
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            At RSO USF, an <strong className="text-black font-semibold">initiative</strong> is the overarching umbrella for all corporate sponsorship opportunities. Whether your organization wants to fund an autonomous robotics build team, lead a hands-on technical workshop, supply lab test equipment, or connect directly with top engineering talent—our chapter partners with industry leaders to bring impactful technical programs to life.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
          <button
            type="button"
            onClick={onRequestInitiative}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-black text-white font-bold text-xs sm:text-sm cursor-pointer shadow-2xs"
          >
            <Plus size={16} />
            <span>Request Chapter Initiative</span>
            <Mail size={14} className="text-neutral-400 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Services We Offer Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Services & Sponsorship Programs We Offer
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {SERVICES_OFFERED.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-black shrink-0">
                    <Icon size={16} />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 leading-snug">
                    {svc.title}
                  </h3>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed">
                    {svc.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
