"use client";

import React from "react";

export type TabType = "about" | "experience" | "projects" | "skills" | "contact";

interface ModalTabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  role?: "standard" | "sponsor" | "admin";
}

export default function ModalTabNavigation({
  activeTab,
  setActiveTab,
}: ModalTabNavigationProps) {
  const tabsList = ["experience", "projects", "skills", "contact"] as const;

  return (
    <div className="flex border-b border-zinc-800 mb-5 pb-1 text-xs md:text-sm gap-1 md:gap-2 overflow-x-auto no-scrollbar md:overflow-visible pr-12 md:pr-16 shrink-0">
      {/* Mobile Info Tab */}
      <button
        type="button"
        onClick={() => setActiveTab("about")}
        className={`py-2 px-3 font-bold uppercase tracking-wider relative transition-all md:hidden shrink-0 ${
          activeTab === "about"
            ? "text-amber-400 font-extrabold"
            : "text-zinc-500 hover:text-zinc-350"
        }`}
      >
        Info
        {activeTab === "about" && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
        )}
      </button>

      {/* Main Tabs */}
      {tabsList.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-3 font-bold uppercase tracking-wider relative transition-all shrink-0 md:shrink md:flex-1 md:text-center ${
            activeTab === tab
              ? "text-amber-400 font-extrabold"
              : "text-zinc-500 hover:text-zinc-350"
          }`}
        >
          {tab === "experience" ? "Timeline" : tab}
          {activeTab === tab && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
          )}
        </button>
      ))}
    </div>
  );
}
