"use client";

import React from "react";
import { Sparkles, CheckCircle2, GraduationCap, Trophy } from "lucide-react";

interface ProjectSkillsTabProps {
  skillsTaught: string[];
}

export default function ProjectSkillsTab({ skillsTaught }: ProjectSkillsTabProps) {
  return (
    <div className="flex flex-col gap-5 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal">
          <Sparkles size={14} className="text-amber-400 shrink-0" />
          <span>Skills Taught & Engineering Competencies ({skillsTaught.length})</span>
        </div>
      </div>

      {/* Intro Banner */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
          <GraduationCap size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Hands-on Learning Pipeline
          </h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            By collaborating on this project, UCF IEEE members receive direct mentorship, laboratory training,
            and real-world build experience that mirrors high-reliability defense, aerospace, and robotics engineering standards.
          </p>
        </div>
      </div>

      {/* Skills Checklist / Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skillsTaught.map((skill, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-purple-500/30 transition-all flex items-start gap-2.5 shadow-sm group"
          >
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
              <CheckCircle2 size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-zinc-200 group-hover:text-purple-300 transition-colors leading-snug block">
                {skill}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium block mt-0.5">
                Verified Chapter Competency
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Career Value Takeaway */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center gap-3">
        <Trophy size={18} className="text-amber-400 shrink-0" />
        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          Students completing these milestones stand out prominently to defense, automotive, and tech recruiters during annual engineering hiring expos.
        </p>
      </div>
    </div>
  );
}

