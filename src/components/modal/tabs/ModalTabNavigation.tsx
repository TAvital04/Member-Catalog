"use client";

import React from "react";
import { UserRole } from "@/hooks/useRoleManager";

export type TabType = "about" | "projects" | "events" | "skills" | "shortlist" | "contact" | "experience";

interface ModalTabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  role?: UserRole;
  hideContact?: boolean;
  hasActionButtons?: boolean;
}

export default function ModalTabNavigation({
  activeTab,
  setActiveTab,
  role,
  hasActionButtons = true,
}: ModalTabNavigationProps) {
  const isRecruiter = role === "sponsor" || role === "admin";

  let tabsList: TabType[] = ["projects", "skills", "events"];

  if (isRecruiter) {
    tabsList = [...tabsList, "shortlist"];
  }

  return (
    <div
      onWheel={(e) => {
        if (e.deltaY !== 0) {
          e.currentTarget.scrollLeft += e.deltaY;
        }
      }}
      className={`flex border-b border-slate-200 mb-5 pb-1 text-xs md:text-sm gap-1 md:gap-2 overflow-x-auto no-scrollbar shrink-0 cursor-default ${
        hasActionButtons ? "pr-28 sm:pr-48 md:pr-52" : "pr-4 md:pr-6"
      }`}
    >
      {/* Mobile Info / Overview Tab */}
      <button
        type="button"
        onClick={() => setActiveTab("about")}
        className={`py-2 px-3 font-bold uppercase tracking-wider relative transition-all md:hidden shrink-0 whitespace-nowrap ${
          activeTab === "about"
            ? "text-slate-900 font-extrabold"
            : "text-slate-500 hover:text-slate-700 font-semibold"
        }`}
      >
        Overview
        {activeTab === "about" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></span>
        )}
      </button>

      {/* Main Streamlined Tabs */}
      {tabsList.map((tab) => {
        let label: string = tab;
        if (tab === "projects") label = "Projects";
        if (tab === "skills") label = "Skills";
        if (tab === "events") label = "Events";
        if (tab === "shortlist") label = "Shortlist";

        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-3 font-bold uppercase tracking-wider relative transition-all shrink-0 md:shrink md:flex-1 md:text-center whitespace-nowrap ${
              activeTab === tab
                ? "text-black font-extrabold"
                : "text-neutral-500 hover:text-black font-semibold"
            }`}
          >
            {label}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
}
