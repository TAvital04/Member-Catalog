"use client";

import React from "react";
import Link from "next/link";
import { ProjectTool } from "@/data/projects";
import { Student } from "@/data/students";
import { Wrench, Sparkles } from "lucide-react";
import Tooltip from "@/components/common/Tooltip";

interface ProjectToolsTabProps {
  tools: ProjectTool[];
  skills?: string[];
  students?: Student[];
  onClose?: () => void;
  role?: "standard" | "sponsor" | "admin";
  canFilter?: boolean;
}

export default function ProjectToolsTab({
  tools = [],
  skills = [],
  onClose,
  role,
  canFilter: explicitCanFilter,
}: ProjectToolsTabProps) {
  const safeTools = Array.isArray(tools) ? tools : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const canFilter = explicitCanFilter ?? (role ? role !== "standard" : true);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-1 pb-4">
      {/* Tools Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
            <span>Tools & Tech Stack ({safeTools.length})</span>
          </div>
          {canFilter && (
            <span className="text-[11px] text-slate-400">Click to filter candidates</span>
          )}
        </div>

        {safeTools.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            {safeTools.map((tool, idx) => {
              const chipClass =
                "px-3 py-1.5 rounded-xl text-xs font-semibold border inline-flex items-center";
              return (
                <Link
                  key={idx}
                  href={`/?skills=${encodeURIComponent(tool.name)}`}
                  onClick={() => onClose?.()}
                  className={`${chipClass} bg-white text-black border-neutral-300 hover:bg-neutral-100 shadow-2xs cursor-pointer`}
                >
                  <span>{tool.name}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-xs italic pl-1">No tools specified yet.</p>
        )}
      </div>

      {/* Skills Section */}
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
            <span>Skills & Engineering Competencies ({safeSkills.length})</span>
          </div>
          <span className="text-[11px] text-slate-400">Click to filter candidates</span>
        </div>

        {safeSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            {safeSkills.map((skill, idx) => {
              const chipClass =
                "px-3 py-1.5 rounded-xl text-xs font-semibold border inline-flex items-center";
              return (
                <Link
                  key={idx}
                  href={`/?skills=${encodeURIComponent(skill)}`}
                  onClick={() => onClose?.()}
                  className={`${chipClass} bg-white text-black border-neutral-300 hover:bg-neutral-100 shadow-2xs cursor-pointer`}
                >
                  <span>{skill}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-xs italic pl-1">No skills specified yet.</p>
        )}
      </div>
    </div>
  );
}
