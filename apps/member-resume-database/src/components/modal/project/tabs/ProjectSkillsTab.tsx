"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, GraduationCap, Trophy, ArrowRight, Users } from "lucide-react";
import { Student } from "@/data/students";
import { studentHasSkill } from "@/lib/skillMatching";

interface ProjectSkillsTabProps {
  skillsTaught: string[];
  students?: Student[];
  onClose?: () => void;
  role?: "standard" | "sponsor" | "admin";
  canFilter?: boolean;
}

export default function ProjectSkillsTab({
  skillsTaught = [],
  students = [],
  onClose,
  role,
  canFilter: explicitCanFilter,
}: ProjectSkillsTabProps) {
  const safeSkills = Array.isArray(skillsTaught) ? skillsTaught : [];
  const canFilter = explicitCanFilter ?? (role ? role !== "standard" : true);

  return (
    <div className="flex flex-col gap-5 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
          <Sparkles size={14} className="text-amber-500 shrink-0" />
          <span>Skills Taught & Engineering Competencies ({safeSkills.length})</span>
        </div>
        {canFilter && (
          <span className="text-[11px] text-slate-400">Click to filter candidates</span>
        )}
      </div>

      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-2xs">
        <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 shrink-0">
          <GraduationCap size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Hands-on Learning Pipeline
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            By collaborating on this project, UCF RSO members receive direct mentorship, laboratory training,
            and real-world build experience that mirrors high-reliability defense, aerospace, and robotics engineering standards.
          </p>
        </div>
      </div>

      {/* Skills Checklist / Badges */}
      {safeSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {safeSkills.map((skill, idx) => {
            const matchingStudents =
              students?.filter((s) => studentHasSkill(s.skills, skill)) || [];
            const matchingCount = matchingStudents.length;

            const cardContent = (
              <>
                <div className={`p-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/70 shrink-0 mt-0.5 ${canFilter ? "group-hover:border-amber-300 transition-colors" : ""}`}>
                  <CheckCircle2 size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold text-slate-900 ${canFilter ? "group-hover:text-amber-950 transition-colors" : ""} leading-snug truncate`}>
                      {skill}
                    </span>
                    {canFilter && (
                      <ArrowRight
                        size={12}
                        className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 font-medium truncate">
                      Verified Chapter Competency
                    </span>
                    {matchingCount > 0 ? (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 ${canFilter ? "group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-900 transition-colors" : "text-slate-600"} shrink-0 flex items-center gap-1`}>
                        <Users size={10} className={`text-slate-400 ${canFilter ? "group-hover:text-amber-600" : ""}`} />
                        {matchingCount} candidate{matchingCount === 1 ? "" : "s"}
                      </span>
                    ) : (
                      canFilter && (
                        <span className="text-[10px] text-slate-400 group-hover:text-amber-700 font-medium shrink-0">
                          Filter →
                        </span>
                      )
                    )}
                  </div>
                </div>
              </>
            );

            return canFilter ? (
              <Link
                key={idx}
                href={`/?skills=${encodeURIComponent(skill)}`}
                onClick={() => onClose?.()}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-start gap-2.5 shadow-2xs group cursor-pointer"
                title={`Filter candidates with skill: ${skill}`}
              >
                {cardContent}
              </Link>
            ) : (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-2xs select-none"
                title={`Skill: ${skill}`}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
          <Sparkles size={24} className="text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Skills Not Listed Yet</h4>
          <p className="text-slate-500 text-xs mt-1">
            Learning outcomes and verified competencies have not been published for this project.
          </p>
        </div>
      )}

      {/* Career Value Takeaway */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center gap-3 shadow-2xs">
        <Trophy size={18} className="text-slate-500 shrink-0" />
        <p className="text-xs text-slate-700 leading-relaxed font-sans">
          Students completing these milestones stand out prominently to defense, automotive, and tech recruiters during annual engineering hiring expos.
        </p>
      </div>
    </div>
  );
}

