"use client";

import React from "react";
import { Info } from "lucide-react";
import { UserRole } from "@/hooks/useRoleManager";

export type ProjectTabType = "info" | "overview" | "tools" | "timeline" | "people" | "skills";

interface ProjectTabNavigationProps {
  activeTab: ProjectTabType;
  setActiveTab: (tab: ProjectTabType) => void;
  role?: UserRole;
}

export default function ProjectTabNavigation({
  activeTab,
  setActiveTab,
}: ProjectTabNavigationProps) {
  const tabsList: Array<{
    id: ProjectTabType;
    label: string;
    ariaLabel?: string;
  }> = [
    { id: "overview", label: "Overview" },
    { id: "tools", label: "Tools & Skills", ariaLabel: "Tools & Skills Stack" },
    { id: "timeline", label: "Timeline" },
    { id: "people", label: "Team" },
  ];

  return (
    <div
      onWheel={(e) => {
        if (e.deltaY !== 0) {
          e.currentTarget.scrollLeft += e.deltaY;
        }
      }}
      className="flex border-b border-slate-200 mb-5 pb-1 text-xs md:text-sm gap-1 md:gap-2 overflow-x-auto no-scrollbar pr-10 md:pr-12 shrink-0 cursor-default"
    >
      {/* Mobile Info Tab */}
      <button
        type="button"
        onClick={() => setActiveTab("info")}
        className={`py-2 px-2.5 font-bold uppercase tracking-wider relative transition-all md:hidden shrink-0 flex items-center gap-1.5 whitespace-nowrap ${
          activeTab === "info"
            ? "text-black font-extrabold"
            : "text-neutral-500 hover:text-black font-semibold"
        }`}
      >
        <Info size={14} className={activeTab === "info" ? "text-black" : "text-neutral-400"} />
        <span>Info</span>
        {activeTab === "info" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></span>
        )}
      </button>

      {/* Main Tabs */}
      {tabsList.map(({ id, label, ariaLabel }) => {
        const isActive = activeTab === id || (id === "tools" && activeTab === "skills");
        return (
          <button
            key={id}
            type="button"
            aria-label={ariaLabel || label}
            onClick={() => setActiveTab(id)}
            className={`py-2 px-2.5 sm:px-3 font-bold uppercase tracking-wider relative transition-all shrink-0 md:shrink md:flex-1 md:text-center whitespace-nowrap text-xs md:text-xs lg:text-sm ${
              isActive
                ? "text-black font-extrabold"
                : "text-neutral-500 hover:text-black font-semibold"
            }`}
          >
            <span>{label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
}
