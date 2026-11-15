"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { GraduationCap, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { StudentInteraction } from "@/data/sponsors";
import Tooltip from "@/components/common/Tooltip";

export interface SponsorEngagementStatsProps {
  interactions: StudentInteraction[];
  sponsorName?: string;
}

/**
 * SponsorEngagementStats — Displays academic major distribution, top skills,
 * and lowest (least common) skills among students who interacted with a sponsor's
 * projects, workshops, and job postings.
 */
export default function SponsorEngagementStats({
  interactions,
  sponsorName,
}: SponsorEngagementStatsProps) {
  // Deduplicate students by normalized name or ID
  const uniqueStudents = useMemo(() => {
    const map = new Map<string, StudentInteraction["student"]>();
    interactions.forEach(({ student }) => {
      const key = student.name.toLowerCase().trim() || student.id.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, {
          ...student,
          skills: [...(student.skills || [])],
        });
      } else {
        const existing = map.get(key)!;
        existing.skills = Array.from(new Set([...(existing.skills || []), ...(student.skills || [])]));
      }
    });
    return Array.from(map.values());
  }, [interactions]);

  const totalStudents = uniqueStudents.length;

  // 1. Academic Major Breakdown
  const majorStats = useMemo(() => {
    const counts: Record<string, number> = {};
    uniqueStudents.forEach((student) => {
      const major = (student.major || "Engineering").trim();
      counts[major] = (counts[major] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [uniqueStudents]);

  // 2. All skill frequencies across interacting students
  const skillEntries = useMemo(() => {
    const counts: Record<string, number> = {};
    uniqueStudents.forEach((student) => {
      const uniqueSkillSet = new Set((student.skills || []).map((s) => s.trim()).filter(Boolean));
      uniqueSkillSet.forEach((skill) => {
        counts[skill] = (counts[skill] || 0) + 1;
      });
    });
    return Object.entries(counts);
  }, [uniqueStudents]);

  // Top 5 most common skills among interacting students
  const topSkills = useMemo(() => {
    return [...skillEntries]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5);
  }, [skillEntries]);

  // Lowest 5 least common skills among interacting students
  const lowestSkills = useMemo(() => {
    const topSet = new Set(topSkills.map(([skill]) => skill));
    const remaining = skillEntries.filter(([skill]) => !topSet.has(skill));
    const pool = remaining.length >= 5 ? remaining : skillEntries;
    return [...pool]
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
      .slice(0, 5);
  }, [skillEntries, topSkills]);

  if (totalStudents === 0) {
    return null;
  }

  const barColors = [
    "bg-amber-500",
    "bg-sky-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-rose-500",
  ];

  return (
    <section className="flex flex-col gap-4" aria-label="Sponsor Student Interaction Statistics">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="section-title">
          <span>
            {sponsorName
              ? `${sponsorName} — Interacting Student & Talent Statistics`
              : "Sponsor Engagement & Interacting Student Statistics"}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {totalStudents} {totalStudents === 1 ? "Student" : "Students"}
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Majors of Students Who Interacted */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Majors of Interacting Students
              </h4>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {majorStats.length} {majorStats.length === 1 ? "Major" : "Majors"}
            </span>
          </div>

          {/* Composite Proportion Bar */}
          {majorStats.length > 0 && (
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
              {majorStats.map(([major, count], idx) => {
                const percent = Math.round((count / totalStudents) * 100);
                return (
                  <div
                    key={major}
                    style={{ width: `${percent}%` }}
                    className={`relative group/tooltip ${barColors[idx % barColors.length]} h-full transition-all duration-500`}
                  >
                    <Tooltip content={`${major}: ${count} (${percent}%)`} position="top" />
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {majorStats.map(([major, count], idx) => {
              const percent = Math.round((count / totalStudents) * 100);
              return (
                <div key={major} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between font-semibold gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full ${barColors[idx % barColors.length]} shrink-0`}
                      />
                      <span className="text-slate-800 font-bold truncate">{major}</span>
                    </div>
                    <span className="text-slate-500 text-[11px] shrink-0 font-medium">
                      <strong className="text-slate-900 font-bold">{count}</strong> ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColors[idx % barColors.length]} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Top Skills of Their People */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Top Skills of Their People
              </h4>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Most Common</span>
          </div>

          <div className="flex flex-col gap-3">
            {topSkills.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No skill data available.</p>
            ) : (
              topSkills.map(([skill, count]) => {
                const percent = Math.round((count / totalStudents) * 100);
                return (
                  <div key={skill} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between font-semibold gap-2">
                      <Link
                        href={`/?skills=${encodeURIComponent(skill)}`}
                        className="text-slate-800 hover:text-amber-600 font-bold truncate transition-colors"
                      >
                        <span>{skill}</span>
                      </Link>
                      <span className="text-slate-500 text-[11px] shrink-0 font-medium">
                        <strong className="text-slate-900 font-bold">{count}</strong>{" "}
                        {count === 1 ? "person" : "people"} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Card 3: Lowest Skills of Their People */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Lowest Skills of Their People
              </h4>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Least Common</span>
          </div>

          <div className="flex flex-col gap-3">
            {lowestSkills.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No skill data available.</p>
            ) : (
              lowestSkills.map(([skill, count]) => {
                const percent = Math.round((count / totalStudents) * 100);
                return (
                  <div key={skill} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between font-semibold gap-2">
                      <Link
                        href={`/?skills=${encodeURIComponent(skill)}`}
                        className="text-slate-800 hover:text-amber-600 font-bold truncate transition-colors"
                      >
                        <span>{skill}</span>
                      </Link>
                      <span className="text-slate-500 text-[11px] shrink-0 font-medium">
                        <strong className="text-slate-900 font-bold">{count}</strong>{" "}
                        {count === 1 ? "person" : "people"} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

