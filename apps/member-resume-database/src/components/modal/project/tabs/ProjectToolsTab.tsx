"use client";

import React, { useState } from "react";
import { ProjectTool } from "@/data/projects";
import { Wrench, Cpu, CircuitBoard, Code2, Box, Gauge, Layers } from "lucide-react";

interface ProjectToolsTabProps {
  tools: ProjectTool[];
}

export default function ProjectToolsTab({ tools }: ProjectToolsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];

  const filteredTools = tools.filter((tool) => {
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

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Embedded & Firmware":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "Hardware & PCB":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Software & AI":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "CAD & Fabrication":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "Lab & Test Equipment":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-zinc-400 bg-zinc-800 border-zinc-700";
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal">
          <Wrench size={14} className="text-cyan-400 shrink-0" />
          <span>Tools, Hardware & Tech Stack ({tools.length})</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-800 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
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
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-3 shadow-md"
              >
                <div className={`p-2.5 rounded-xl border ${colorClass} shrink-0`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-100 truncate">{tool.name}</h4>
                  <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{tool.category}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-xs">No tools in this category.</p>
        </div>
      )}
    </div>
  );
}

