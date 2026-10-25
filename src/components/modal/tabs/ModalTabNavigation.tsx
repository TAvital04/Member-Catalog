"use client";

import React from "react";

export type TabType = "about" | "projects" | "events" | "contact" | "experience" | "skills";

interface ModalTabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  role?: "standard" | "sponsor" | "admin";
}

export default function ModalTabNavigation({
  activeTab,
  setActiveTab,
}: ModalTabNavigationProps) {
  const tabsList = ["projects", "skills", "events", "contact"] as const;

  return (
    <div className="flex border-b border-slate-200 mb-5 pb-1 text-xs md:text-sm gap-1 md:gap-2 overflow-x-auto no-scrollbar md:overflow-visible pr-12 md:pr-16 shrink-0">
      {/* Mobile Info / Overview Tab */}
      <button
        type="button"
        onClick={() => setActiveTab("about")}
        className={`py-2 px-3 font-bold uppercase tracking-wider relative transition-all md:hidden shrink-0 ${
          activeTab === "about"
            ? "text-slate-900 font-extrabold"
            : "text-slate-500 hover:text-slate-700 font-semibold"
        }`}
      >
        Overview
        {activeTab === "about" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></span>
        )}
      </button>

      {/* Main Streamlined Tabs */}
      {tabsList.map((tab) => {
        let label: string = tab;
        if (tab === "projects") label = "Projects";
        if (tab === "skills") label = "Skills";
        if (tab === "events") label = "Events";
        if (tab === "contact") label = "Contact";

        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-3 font-bold uppercase tracking-wider relative transition-all shrink-0 md:shrink md:flex-1 md:text-center ${
              activeTab === tab
                ? "text-slate-900 font-extrabold"
                : "text-slate-500 hover:text-slate-700 font-semibold"
            }`}
          >
            {label}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
}
