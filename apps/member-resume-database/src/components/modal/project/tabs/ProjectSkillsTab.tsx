"use client";

import React from "react";
import { Sparkles, CheckCircle2, GraduationCap, Trophy } from "lucide-react";

interface ProjectSkillsTabProps {
  skillsTaught: string[];
}

export default function ProjectSkillsTab({ skillsTaught = [] }: ProjectSkillsTabProps) {
  const safeSkills = Array.isArray(skillsTaught) ? skillsTaught : [];

  return (
    <div className="flex flex-col gap-5 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
          <Sparkles size={14} className="text-slate-400 shrink-0" />
          <span>Skills Taught & Engineering Competencies ({safeSkills.length})</span>
        </div>
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
            By collaborating on this project, UCF IEEE members receive direct mentorship, laboratory training,
            and real-world build experience that mirrors high-reliability defense, aerospace, and robotics engineering standards.
          </p>
        </div>
      </div>

      {/* Skills Checklist / Badges */}
      {safeSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {safeSkills.map((skill, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex items-start gap-2.5 shadow-2xs group"
            >
              <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/70 shrink-0 mt-0.5">
                <CheckCircle2 size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug block">
                  {skill}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  Verified Chapter Competency
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
          <Sparkles size={24} className="text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">Skills Not Listed Yet</h4>
          <p className="text-slate-500 text-xs mt-1">Learning outcomes and verified competencies have not been published for this project.</p>
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

