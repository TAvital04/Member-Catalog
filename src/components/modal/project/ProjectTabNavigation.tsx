"use client";

import React from "react";
import { FolderGit2, Wrench, Calendar, Users, Sparkles, HeartHandshake, Info } from "lucide-react";

export type ProjectTabType = "info" | "overview" | "tools" | "timeline" | "people" | "skills" | "sponsor";

interface ProjectTabNavigationProps {
  activeTab: ProjectTabType;
  setActiveTab: (tab: ProjectTabType) => void;
}

export default function ProjectTabNavigation({
  activeTab,
  setActiveTab,
}: ProjectTabNavigationProps) {
  const tabsList: Array<{
    id: ProjectTabType;
    label: string;
    ariaLabel?: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }> = [
    { id: "overview", label: "Overview", icon: FolderGit2 },
    { id: "tools", label: "Tools & Skills", ariaLabel: "Tools & Skills Stack", icon: Wrench },
    { id: "timeline", label: "Timeline", icon: Calendar },
    { id: "people", label: "Team", icon: Users },
    { id: "sponsor", label: "Sponsor", ariaLabel: "Sponsor Benefits", icon: HeartHandshake },
  ];

  return (
    <div className="border-b border-slate-200 mb-5 relative shrink-0">
      <div className="flex items-center text-xs md:text-sm gap-0.5 sm:gap-1 md:gap-1.5 overflow-x-auto no-scrollbar mr-12 md:mr-14 pb-1">
        {/* Mobile Info Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`py-2 px-2.5 font-bold uppercase tracking-wider relative transition-all md:hidden shrink-0 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "info"
              ? "text-slate-900 font-extrabold"
              : "text-slate-500 hover:text-slate-700 font-medium"
          }`}
        >
          <Info size={14} className={activeTab === "info" ? "text-slate-700" : "text-slate-400"} />
          <span>Info</span>
          {activeTab === "info" && (
            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></span>
          )}
        </button>

        {/* Main Tabs */}
        {tabsList.map(({ id, label, ariaLabel, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              aria-label={ariaLabel || label}
              onClick={() => setActiveTab(id)}
              className={`py-2 px-2 sm:px-2.5 md:px-3 font-bold uppercase tracking-wider relative transition-all shrink-0 flex items-center justify-center gap-1.5 whitespace-nowrap text-xs md:text-xs lg:text-sm ${
                isActive
                  ? "text-slate-900 font-extrabold"
                  : "text-slate-500 hover:text-slate-700 font-medium"
              }`}
            >
              <Icon size={13} className={isActive ? "text-slate-700" : "text-slate-400"} />
              <span>{label}</span>
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
