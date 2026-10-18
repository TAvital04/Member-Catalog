"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProjectTool } from "@/data/projects";
import { Student } from "@/data/students";
import { studentHasSkill } from "@/lib/skillMatching";
import { Wrench, Cpu, CircuitBoard, Code2, Box, Gauge, Layers, ArrowRight, Users } from "lucide-react";

interface ProjectToolsTabProps {
  tools: ProjectTool[];
  students?: Student[];
  onClose?: () => void;
}

export default function ProjectToolsTab({
  tools = [],
  students = [],
  onClose,
}: ProjectToolsTabProps) {
  const safeTools = Array.isArray(tools) ? tools : [];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(safeTools.map((t) => t.category)))];

  const filteredTools = safeTools.filter((tool) => {
    if (selectedCategory !== "All" && tool.category !== selectedCategory) return false;
    return true;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Embedded & Firmware":
        return Cpu;
      case "Hardware & PCB":
        return CircuitBoard;
      case "Software & AI":
        return Code2;
      case "CAD & Fabrication":
        return Box;
      case "Lab & Test Equipment":
        return Gauge;
      default:
        return Layers;
    }
  };

  const getCategoryColor = (_cat: string) => {
    return "text-slate-600 bg-slate-100 border-slate-200";
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
          <Wrench size={14} className="text-amber-500 shrink-0" />
          <span>Tools, Hardware & Tech Stack ({safeTools.length})</span>
        </div>
        <span className="text-[11px] text-slate-400">Click to filter candidates</span>
      </div>

      {safeTools.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
          <Wrench size={24} className="text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No Tools Specified</h4>
          <p className="text-slate-500 text-xs mt-1">Tools and hardware stack have not been specified for this project yet.</p>
        </div>
      ) : (
        <>
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-200/80 text-slate-900 border border-slate-300 font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 bg-white font-medium"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTools.map((tool, idx) => {
                const Icon = getCategoryIcon(tool.category);
                const colorClass = getCategoryColor(tool.category);
                const matchingStudents =
                  students?.filter((s) => studentHasSkill(s.skills, tool.name)) || [];
                const matchingCount = matchingStudents.length;

                return (
                  <Link
                    key={idx}
                    href={`/?skills=${encodeURIComponent(tool.name)}`}
                    onClick={() => onClose?.()}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all flex items-center gap-3 shadow-2xs group cursor-pointer"
                    title={`Filter candidates with skill/tool: ${tool.name}`}
                  >
                    <div className={`p-2.5 rounded-xl border ${colorClass} shrink-0 group-hover:border-amber-300 group-hover:bg-amber-100/60 transition-colors`}>
                      <Icon size={18} className="group-hover:text-amber-800 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-950 truncate transition-colors">
                          {tool.name}
                        </h4>
                        <ArrowRight
                          size={12}
                          className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500 font-mono truncate">{tool.category}</span>
                        {matchingCount > 0 ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-900 transition-colors shrink-0 flex items-center gap-1">
                            <Users size={10} className="text-slate-400 group-hover:text-amber-600" />
                            {matchingCount} candidate{matchingCount === 1 ? "" : "s"}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 group-hover:text-amber-700 font-medium shrink-0">
                            Filter →
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl p-6">
              <p className="text-slate-500 text-xs">No tools in this category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

