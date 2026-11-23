"use client";

import React, { useState } from "react";
import {
  Building2,
  Award,
  Sparkles,
  Wrench,
  Check,
  Download,
  Mail,
  Users,
  Calendar,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import {
  SPONSORSHIP_TIERS_GUIDE,
  CHAPTER_IMPACT_METRICS,
  SponsorshipTierDefinition,
} from "@/data/sponsors";
import { Badge } from "@/components/ui";

interface SponsorshipProspectusProps {
  onOpenResumeBook?: () => void;
  onViewActivePartners?: () => void;
}

export default function SponsorshipProspectus({
  onOpenResumeBook,
  onViewActivePartners,
}: SponsorshipProspectusProps) {
  const [selectedTier, setSelectedTier] = useState<string>("Local Partner");

  return (
    <div className="flex flex-col gap-10">
      {/* 1. Header & Value Proposition */}
      <div className="bg-white border border-neutral-300 rounded-3xl p-6 md:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-bold text-black uppercase tracking-wider">
            <Sparkles size={12} className="text-black" />
            <span>2024–2025 Corporate & Local Partnership Prospectus</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
            Direct Engineering Talent Access & Hardware Impact
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-sans">
            RSO USF connects corporate defense leaders, regional technology employers, and local boutique engineering firms directly with student hardware builders. We offer vetted pre-fair Resume Books, verifiable technical workshop sponsorship, and transparent hardware grant funding.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
          {onOpenResumeBook && (
            <button
              type="button"
              onClick={onOpenResumeBook}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
            >
              <BookOpen size={14} />
              <span>Export Chapter Resume Book</span>
            </button>
          )}
          {onViewActivePartners && (
            <button
              type="button"
              onClick={onViewActivePartners}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-neutral-300 text-black text-xs font-bold hover:bg-neutral-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Building2 size={14} />
              <span>View Current Partners Catalog</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Verifiable Chapter Impact Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-neutral-300 shadow-2xs text-center flex flex-col justify-center">
          <span className="text-2xl font-black text-black">{CHAPTER_IMPACT_METRICS.activeBuilders}</span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1">Active Builders</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-300 shadow-2xs text-center flex flex-col justify-center">
          <span className="text-2xl font-black text-black">{CHAPTER_IMPACT_METRICS.hardwareGrantsFunded}</span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1">Grants Deployed</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-300 shadow-2xs text-center flex flex-col justify-center">
          <span className="text-2xl font-black text-black">{CHAPTER_IMPACT_METRICS.technicalWorkshopsHeld}</span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1">Tech Workshops</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-300 shadow-2xs text-center flex flex-col justify-center">
          <span className="text-2xl font-black text-black">{CHAPTER_IMPACT_METRICS.verifiedStudentAttendees}</span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1">Verified Attendees</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-300 shadow-2xs text-center flex flex-col justify-center">
          <span className="text-2xl font-black text-black">{CHAPTER_IMPACT_METRICS.projectsActive}</span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1">Hardware Builds</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-neutral-300 shadow-2xs text-center flex flex-col justify-center">
          <span className="text-2xl font-black text-black">{CHAPTER_IMPACT_METRICS.averagePlacementRate}</span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1">Industry Placement</span>
        </div>
      </div>

      {/* 3. Sponsorship Tiers Breakdown for Big & Small Partners */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-neutral-200">
          <div>
            <h3 className="text-lg font-black text-black">Partnership Packages & Deliverables</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Structured tiers designed for enterprise defense sponsors down to regional startups and local consultancies.
            </p>
          </div>
          <span className="text-[11px] font-bold text-neutral-400">All sponsorships tax-deductible through USF Foundation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPONSORSHIP_TIERS_GUIDE.map((tierDef) => {
            const isLocal = tierDef.tier === "Local Partner";
            const isPlatinum = tierDef.tier === "Platinum";

            return (
              <div
                key={tierDef.tier}
                className={`rounded-2xl p-5 border flex flex-col justify-between shadow-2xs transition-all relative ${
                  isLocal
                    ? "bg-neutral-50/70 border-2 border-black"
                    : isPlatinum
                    ? "bg-white border-2 border-black"
                    : "bg-white border-neutral-300"
                }`}
              >
                {isLocal && (
                  <div className="absolute -top-3 left-4 bg-black text-white text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                    <MapPin size={10} />
                    <span>Startups & Local Firms</span>
                  </div>
                )}
                {isPlatinum && (
                  <div className="absolute -top-3 left-4 bg-black text-white text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                    <Award size={10} />
                    <span>Premier Enterprise</span>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="pt-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-black text-black">{tierDef.tier}</h4>
                      <Badge variant="outline" size="sm" className="font-bold text-[10px]">
                        {tierDef.annualInvestment}
                      </Badge>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mt-1">
                      {tierDef.targetAudience}
                    </p>
                    <p className="text-xs text-neutral-700 font-medium mt-2 leading-snug">
                      {tierDef.tagline}
                    </p>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Key Highlights:
                    </span>
                    <ul className="flex flex-col gap-1.5 text-xs text-neutral-800">
                      {tierDef.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5 leading-snug">
                          <Check size={13} className="text-black shrink-0 mt-0.5 stroke-[2.5]" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                      Resume Book Access:
                    </span>
                    <span className="text-xs font-semibold text-black bg-neutral-100 p-2 rounded-xl border border-neutral-200 leading-tight">
                      {tierDef.resumeBookAccess}
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-neutral-200">
                  <a
                    href={`mailto:corporate-relations@rsousf.org?subject=${encodeURIComponent(
                      `Inquiry: ${tierDef.tier} Sponsorship ($${tierDef.annualInvestment})`
                    )}&body=${encodeURIComponent(
                      `Hello RSO Leadership,\n\nWe are interested in discussing the ${tierDef.tier} sponsorship package ($${tierDef.annualInvestment}) for our organization.\n\nCompany Name:\nContact Name:\nTarget Engineering Disciplines / Roles:\n\nThank you!`
                    )}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-2xs text-center"
                  >
                    <Mail size={12} />
                    <span>Sponsor {tierDef.tier}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Tangible Hardware Grants Showcase */}
      <div className="bg-white border border-neutral-300 rounded-3xl p-6 md:p-8 shadow-2xs flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-black" />
            <h3 className="text-base font-black text-black">Verifiable Hardware Build Grants</h3>
          </div>
          <p className="text-xs text-neutral-500">
            Every sponsorship dollar directly funds tangible student engineering components, lab tooling, and PCB fabrication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black">Micromouse Autonomous Maze Solver</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-neutral-300">Active</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                4-layer custom PCB motor controller, STM32 microcontrollers, and PID sensor algorithms funded by Siemens EDA and Texas Instruments grants.
              </p>
            </div>
            <div className="text-[11px] font-bold text-neutral-500">
              12 Student Builders • Altium & C++
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black">LoRa Environmental Mesh Network</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-neutral-300">Active</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                Solar-powered wireless telemetry nodes across USF campus funded by L3Harris Technologies and Tampa Bay Embedded Labs micro-grants.
              </p>
            </div>
            <div className="text-[11px] font-bold text-neutral-500">
              8 Student Builders • ESP32 & FreeRTOS
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black">Autonomous Drone Swarm Telemetry</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-neutral-300">Active</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                FPGA flight control computer and collision-avoidance sensor array underwritten by Lockheed Martin and Northrop Grumman grants.
              </p>
            </div>
            <div className="text-[11px] font-bold text-neutral-500">
              15 Student Builders • ROS2 & Verilog
            </div>
          </div>
        </div>
      </div>

      {/* 5. Direct Contact with RSO Leadership */}
      <div className="rounded-2xl border border-neutral-300 bg-neutral-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-black">Ready to Partner or Host a Technical Demo?</h4>
          <p className="text-xs text-neutral-600 mt-0.5">
            Contact chapter corporate relations to schedule an on-campus tech talk, tour student build labs, or customize candidate filters.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="mailto:corporate-relations@rsousf.org?subject=Corporate%20Partnership%20Inquiry%20-%20RSO%20USF"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            <Mail size={13} />
            <span>corporate-relations@rsousf.org</span>
          </a>
        </div>
      </div>
    </div>
  );
}
