"use client";

import React, { useState } from "react";
import { Student } from "../../data/students";
import { Briefcase, Building2, ExternalLink, Sparkles, ChevronRight, Award } from "lucide-react";
import Avatar from "../common/Avatar";
import SkillTag from "../common/SkillTag";

interface WhereKnightsWorkProps {
  students: Student[];
  availableCompanies: string[];
  selectedCompanies: string[];
  onCompanyToggle: (company: string) => void;
  onSelectStudent: (student: Student) => void;
}

export default function WhereKnightsWork({
  students,
  availableCompanies,
  selectedCompanies,
  onCompanyToggle,
  onSelectStudent,
}: WhereKnightsWorkProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate placement counts per company
  const companyCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      const companies = new Set((s.workExperiences || []).map((w) => w.name));
      companies.forEach((comp) => {
        counts[comp] = (counts[comp] || 0) + 1;
      });
    });
    return counts;
  }, [students]);

  // Find candidate spotlights with work experience
  const spotlightCandidates = React.useMemo(() => {
    return students.filter((s) => s.workExperiences && s.workExperiences.length > 0);
  }, [students]);

  if (availableCompanies.length === 0) return null;

  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl p-4 md:p-6 mb-6 relative overflow-hidden shadow-sm animate-fade-in">
      {/* Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm shrink-0">
            <Building2 size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-wider">
                Where Knights Work
              </h2>
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={10} />
                Corporate Showcase
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Explore top engineering placements, defense contractors, cloud providers, and research labs employing IEEE Knights.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-slate-500 hover:text-amber-700 font-semibold flex items-center gap-1 transition-colors self-start md:self-auto cursor-pointer"
        >
          <span>{isExpanded ? "Collapse Showcase" : "Expand Showcase"}</span>
          <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-6 mt-4 animate-fade-in">
          {/* Top Employer Filter Chips */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Filter Directory by Top Employers ({availableCompanies.length} Companies)
            </span>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto overflow-x-hidden no-scrollbar pr-1">
              {availableCompanies.map((company) => {
                const count = companyCounts[company] || 0;
                const isSelected = selectedCompanies.includes(company);
                return (
                  <button
                    key={company}
                    type="button"
                    onClick={() => onCompanyToggle(company)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none ${
                      isSelected
                        ? "bg-amber-500 text-slate-900 border-amber-400 shadow-sm font-bold scale-[1.02]"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <Briefcase size={12} className={isSelected ? "text-slate-900" : "text-amber-600"} />
                    <span>{company}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? "bg-slate-900 text-amber-300"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured Alumni & Intern Spotlight Cards */}
          {spotlightCandidates.length > 0 && (
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Award size={12} className="text-amber-600" />
                  Alumni & Intern Spotlights
                </span>
                <span className="text-[11px] text-slate-500">Click card to view full portfolio & resume</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {spotlightCandidates.slice(0, 3).map((candidate) => {
                  const latestWork = candidate.workExperiences?.[0];
                  return (
                    <div
                      key={candidate.id}
                      onClick={() => onSelectStudent(candidate)}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 group relative shadow-sm"
                    >
                      <div className="flex flex-col gap-2">
                        {/* Candidate avatar & header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar name={candidate.name} size="sm" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                                {candidate.name}
                              </h4>
                              <span className="text-[10px] text-slate-500 block truncate">{candidate.major}</span>
                            </div>
                          </div>
                          <ExternalLink size={13} className="text-slate-400 group-hover:text-amber-700 transition-colors shrink-0" />
                        </div>

                        {/* Recent Job Badge */}
                        {latestWork && (
                          <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-200/60 flex flex-col gap-0.5">
                            <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                              <span className="truncate">{latestWork.name}</span>
                              <span className="text-[9px] text-amber-700 font-medium shrink-0 ml-1">
                                {latestWork.currentJob ? "Current" : "Experience"}
                              </span>
                            </div>
                            <span className="text-[10.5px] text-slate-700 font-medium truncate">
                              {latestWork.title}
                            </span>
                          </div>
                        )}

                        {/* Bio snippet */}
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {candidate.bio}
                        </p>
                      </div>

                      {/* Bottom skills row */}
                      <div className="flex items-center gap-1 overflow-hidden pt-2 border-t border-slate-100">
                        {candidate.skills.slice(0, 3).map((sk) => (
                          <SkillTag key={sk} skill={sk} variant="card" maxCharLength={8} maxWidthClass="max-w-[65px]" />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
