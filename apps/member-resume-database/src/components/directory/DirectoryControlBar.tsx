"use client";

import React from "react";
import { UserRole } from "@/app/page";
import Tooltip from "../common/Tooltip";
import { Search, X, LayoutGrid, List } from "lucide-react";

interface DirectoryControlBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterLayout?: "side" | "top";
  setFilterLayout?: (layout: "side" | "top") => void;
  sortBy: "activity" | "name" | "gradDate" | "gpa";
  setSortBy: (sort: "activity" | "name" | "gradDate" | "gpa") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  role: UserRole;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function DirectoryControlBar({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  role,
  searchInputRef,
}: DirectoryControlBarProps) {
  const [localQuery, setLocalQuery] = React.useState(searchQuery);

  React.useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== searchQuery) {
        setSearchQuery(localQuery);
      }
    }, 200);
    return () => clearTimeout(handler);
  }, [localQuery, searchQuery, setSearchQuery]);

  return (
    <section className="max-w-7xl w-full mx-auto px-4 mb-5 flex flex-col sm:flex-row items-center gap-3">
      {/* Search Input Box */}
      <div className="relative w-full grow">
        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Search by candidate name, skill, coursework, bio (Ctrl+K)..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && localQuery) {
              setLocalQuery("");
              setSearchQuery("");
            }
          }}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 shadow-2xs transition-all"
        />
        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery("");
              setSearchQuery("");
            }}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Control Actions & Utility Switchers */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">

        {/* Sorting Dropdown (Surfacing Most Active Members) */}
        <div className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
          <span className="text-slate-500 pl-1.5 text-[11px] font-medium select-none">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "activity" | "name" | "gradDate" | "gpa")}
            className="bg-transparent text-slate-800 font-semibold pr-2 focus:outline-none border-none py-1 text-xs cursor-pointer"
          >
            <option value="activity">Most Active</option>
            <option value="name">Name (A-Z)</option>
            <option value="gradDate">Graduation Date</option>
            <option value="gpa">Highest GPA</option>
          </select>
        </div>

        {/* Grid vs List View (Admin only) */}
        {role === "admin" && (
          <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl gap-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all relative group cursor-pointer ${
                viewMode === "grid"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <LayoutGrid size={15} />
              <Tooltip content="Grid Card View" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all relative group cursor-pointer ${
                viewMode === "list"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <List size={15} />
              <Tooltip content="Compact Row View" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
