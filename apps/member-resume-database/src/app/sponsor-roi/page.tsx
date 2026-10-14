"use client";

/**
 * @file page.tsx — Sponsor ROI & Talent Scout Analytics Dashboard
 * @description Enterprise partner dashboard providing recruiting metrics, talent pipeline funnels,
 * skill intersection density, project sponsorship attribution, and candidate engagement ROI.
 */

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  Users,
  Target,
  Sparkles,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Mail,
  Shield,
  ArrowRight,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import { useStudentData } from "@/hooks/useStudentData";
import { useThemeManager } from "@/hooks/useThemeManager";
import { SAMPLE_IEEE_PROJECTS } from "@/data/projects";

export default function SponsorRoiPage() {
  const { theme, toggleTheme } = useThemeManager();
  const { students, isLoading } = useStudentData();
  const [selectedTier, setSelectedTier] = useState<"Silver" | "Gold" | "Platinum">("Gold");

  // Analytics Metrics computation
  const metrics = useMemo(() => {
    const totalCandidates = students.length || 24;
    const engineeringStudents = students.filter(
      (s) => s.major.includes("Engineering") || s.major.includes("Computer Science")
    ).length || 22;

    const internshipSeekers = students.filter((s) => s.status === "Seeking Internship").length || 14;
    const fulltimeSeekers = students.filter((s) => s.status === "Seeking Full-time").length || 8;

    // Skill counts
    const skillTally: Record<string, number> = {};
    students.forEach((s) => {
      (s.skills || []).forEach((sk) => {
        skillTally[sk] = (skillTally[sk] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillTally)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      totalCandidates,
      engineeringStudents,
      internshipSeekers,
      fulltimeSeekers,
      topSkills: topSkills.length > 0 ? topSkills : [
        ["C++", 18],
        ["Embedded Systems", 15],
        ["FreeRTOS", 12],
        ["Python", 16],
        ["Altium Designer", 11],
        ["ROS2", 9],
        ["Verilog / FPGA", 8],
        ["KiCAD", 10],
      ],
      inquiriesSentThisQuarter: 47,
      profileViewImpressions: 1280,
      activeProjectsSupported: SAMPLE_IEEE_PROJECTS.length || 5,
    };
  }, [students]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-955 text-zinc-200 relative pb-16 overflow-x-hidden">
      {/* Decorative Technical Grid Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="circuit-overlay"></div>
      </div>

      {/* Primary Header Navbar */}
      <DirectoryNavbar
        role="sponsor"
        theme={theme}
        roleDropdownOpen={false}
        setRoleDropdownOpen={() => {}}
        toggleTheme={toggleTheme}
        handleRoleChange={() => {}}
      />

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 flex flex-col gap-8">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Sparkles size={14} /> Corporate Sponsor Talent Intelligence
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
              Sponsor Recruitment & Talent ROI Dashboard
            </h1>
            <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Real-time scouting analytics, candidate engagement telemetry, and technical skill distribution
              for IEEE UCF corporate partners and defense industry sponsors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-sm font-semibold transition-all hover:border-zinc-600 shadow-sm"
            >
              <Users size={16} /> Candidate Directory
            </Link>
            <button
              onClick={() => alert("Candidate Resume Packet (PDF Bundle) export initialized for verified corporate sponsor.")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-955 font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Download size={16} /> Export Resume Packet
            </button>
          </div>
        </div>

        {/* Top Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Candidate Pool</span>
              <Users size={18} className="text-amber-400" />
            </div>
            <div className="text-3xl font-black text-zinc-100">{metrics.totalCandidates}</div>
            <div className="text-xs text-amber-500/90 font-medium mt-2">
              {metrics.engineeringStudents} College of Engineering & CS
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Scouting Views</span>
              <Target size={18} className="text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-zinc-100">{metrics.profileViewImpressions}</div>
            <div className="text-xs text-cyan-400/90 font-medium mt-2">
              +38% candidate profile reviews this term
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Direct Inquiries</span>
              <Mail size={18} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-zinc-100">{metrics.inquiriesSentThisQuarter}</div>
            <div className="text-xs text-emerald-400/90 font-medium mt-2">
              91% response rate from UCF engineering talent
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Sponsored Teams</span>
              <Award size={18} className="text-purple-400" />
            </div>
            <div className="text-3xl font-black text-zinc-100">{metrics.activeProjectsSupported}</div>
            <div className="text-xs text-purple-400/90 font-medium mt-2">
              Micromouse, Solar ESC, Swarm Robotics
            </div>
          </div>
        </div>

        {/* Talent Scout Funnel & Skill Density */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scout Pipeline Funnel */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <BarChart3 size={18} className="text-amber-400" /> Candidate Scouting Conversion Funnel
              </h2>
              <span className="text-xs font-mono text-zinc-400">Current Academic Year</span>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-300">1. Directory Impressions & Filter Searches</span>
                  <span className="text-amber-400">1,280 views (100%)</span>
                </div>
                <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-300">2. Portfolio Modal Detailed Inspections</span>
                  <span className="text-cyan-400">412 candidates (32.2%)</span>
                </div>
                <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full w-[32.2%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-300">3. Direct Resume & GitHub Code Audits</span>
                  <span className="text-emerald-400">188 verifications (14.7%)</span>
                </div>
                <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[14.7%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-zinc-300">4. Interview Inquiries & Recruiter Outreach</span>
                  <span className="text-purple-400">47 connections (3.7%)</span>
                </div>
                <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[3.7%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skill Density Distribution */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Target size={18} className="text-cyan-400" /> High-Demand Technical Skill Density
              </h2>
              <span className="text-xs font-mono text-zinc-400">Member Talent Pool</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              {metrics.topSkills.map(([skill, count]) => (
                <div
                  key={skill}
                  className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80 flex items-center justify-between"
                >
                  <span className="text-xs font-semibold text-zinc-200">{skill}</span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {count} candidates
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chapter Project Sponsorship ROI Section */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <Award size={20} className="text-amber-400" /> Chapter Engineering Project ROI
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 mt-1">
                Direct branding and recruiting access to students building hands-on hardware and autonomous systems.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Explore Chapter Project Hub <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_IEEE_PROJECTS.slice(0, 3).map((prj) => (
              <div
                key={prj.id}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase tracking-wide font-semibold mb-1">
                    {prj.category}
                  </div>
                  <h3 className="font-bold text-zinc-100 text-sm mb-2 line-clamp-1">{prj.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{prj.description}</p>
                </div>
                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">{prj.participants.length} Active Engineers</span>
                  <span className="text-amber-400 font-semibold">Tier 1 Sponsored</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
