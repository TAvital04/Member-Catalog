"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, GraduationCap, Trophy, Users } from "lucide-react";
import { Student } from "@/data/students";
import { studentHasSkill } from "@/lib/skillMatching";
import { CARD_INTERACTIVE, CARD_BASE } from "@/lib/cardStyles";
import Tooltip from "@/components/common/Tooltip";
import { UserRole } from "@/hooks/useRoleManager";

interface ProjectSkillsTabProps {
  skillsTaught?: string[];
  skills?: string[];
  students?: Student[];
  onClose?: () => void;
  role?: UserRole;
  canFilter?: boolean;
}

export default function ProjectSkillsTab({
  skillsTaught,
  skills,
  students = [],
  onClose,
  role,
  canFilter: explicitCanFilter,
}: ProjectSkillsTabProps) {
  const safeSkills = Array.isArray(skillsTaught ?? skills) ? (skillsTaught ?? skills)! : [];
  const canFilter = explicitCanFilter ?? (role ? role !== "standard" : true);

  return (
    <div className="flex flex-col gap-5 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
          <span>Skills Taught & Engineering Competencies ({safeSkills.length})</span>
        </div>
        {canFilter && (
          <span className="text-[11px] text-slate-400">Click to filter candidates</span>
        )}
      </div>

      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-2xs">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Hands-on Learning Pipeline
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            By collaborating on this project, USF RSO members receive direct mentorship, laboratory training,
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
                <div className="p-1 rounded-lg bg-neutral-100 text-black border border-neutral-300 shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold text-slate-900 ${canFilter ? "group-hover:text-black transition-colors" : ""} leading-snug truncate`}>
                      {skill}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 font-medium truncate">
                      Chapter Competency
                    </span>
                    {matchingCount > 0 ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 group-hover:bg-neutral-200 text-slate-700 group-hover:text-black transition-colors shrink-0 flex items-center gap-1">
                        <Users size={10} className="text-slate-400 group-hover:text-black" />
                        {matchingCount} candidate{matchingCount === 1 ? "" : "s"}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 group-hover:text-black font-medium shrink-0">
                        Filter
                      </span>
                    )}
                  </div>
                </div>
              </>
            );

            return (
              <Link
                key={idx}
                href={`/?skills=${encodeURIComponent(skill)}`}
                onClick={() => onClose?.()}
                className={`${CARD_INTERACTIVE} p-3.5 flex items-start gap-2.5 group cursor-pointer`}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
          <Sparkles size={24} className="text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Skills Not Listed Yet</h4>
          <p className="text-slate-500 text-xs mt-1">
            Learning outcomes and competencies have not been published for this project.
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

