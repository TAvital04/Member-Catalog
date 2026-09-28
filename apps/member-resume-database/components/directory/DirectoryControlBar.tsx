"use client";

import React from "react";
import { UserRole } from "../../app/page";
import Tooltip from "../common/Tooltip";
import { Search, X, LayoutGrid, List } from "lucide-react";

interface DirectoryControlBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterLayout: "side" | "top";
  setFilterLayout: (layout: "side" | "top") => void;
  sortBy: "name" | "gradDate" | "gpa";
  setSortBy: (sort: "name" | "gradDate" | "gpa") => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  role: UserRole;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export default function DirectoryControlBar({
  searchQuery,
  setSearchQuery,
  filterLayout,
  setFilterLayout,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  role,
  searchInputRef,
}: DirectoryControlBarProps) {
  const [localQuery, setLocalQuery] = React.useState(searchQuery);

  // Synchronize local input state when external searchQuery prop changes
  React.useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  // Debounce updating parent & URL search query state by 200ms
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== searchQuery) {
        setSearchQuery(localQuery);
      }
    }, 200);
    return () => clearTimeout(handler);
  }, [localQuery, searchQuery, setSearchQuery]);

  return (
    <section className="max-w-7xl w-full mx-auto px-4 mb-6 relative z-10 flex flex-col sm:flex-row items-center gap-4">
      {/* Search Input Box */}
      <div className="relative w-full grow">
        <Search size={16} className="absolute left-3 top-3 text-zinc-550" />
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Search candidates, skills, bios (Ctrl+K)..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && localQuery) {
              setLocalQuery("");
              setSearchQuery("");
            }
          }}
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-205 placeholder-zinc-550 focus:outline-none focus:border-amber-500 shadow-inner"
        />
        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery("");
              setSearchQuery("");
            }}
            className="absolute right-3 top-3 text-zinc-550 hover:text-zinc-300"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* View mode toggle button */}
      <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
        {/* Filter Layout Position Toggle */}
        <div className="flex items-center gap-2 text-xs bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl">
          <span className="text-zinc-500 pl-1.5 select-none">Layout</span>
          <div className="flex items-center bg-zinc-955 p-0.5 rounded border border-zinc-800">
            <button
              type="button"
              onClick={() => setFilterLayout("side")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all relative group ${
                filterLayout === "side" ? "bg-zinc-800 text-amber-400" : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              Side
              <Tooltip content="Sidebar Filter Layout" />
            </button>
            <button
              type="button"
              onClick={() => setFilterLayout("top")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all relative group ${
                filterLayout === "top" ? "bg-zinc-800 text-amber-400" : "text-zinc-500 hover:text-zinc-350"
              }`}
            >
              Top
              <Tooltip content="Top Dropdowns Filter Layout" />
            </button>
          </div>
        </div>

        {/* Sorting */}
        {role !== "standard" && (
          <div className="flex items-center gap-2 text-xs bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl animate-fade-in">
            <span className="text-zinc-500 pl-1.5">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "gradDate" | "gpa")}
              className="bg-transparent text-zinc-300 font-bold pr-2 focus:outline-none border-none py-1 text-xs cursor-pointer"
            >
              <option value="name">Name A-Z</option>
              <option value="gradDate">Grad Date</option>
              <option value="gpa">Highest GPA</option>
            </select>
          </div>
        )}

        {/* Grid vs List buttons (Only for Admin role) */}
        {role === "admin" && (
          <div className="flex items-center bg-zinc-900/85 border border-zinc-800 p-1 rounded-xl gap-0.5 animate-fade-in">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all relative group ${
                viewMode === "grid" ? "bg-zinc-800 text-amber-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <LayoutGrid size={15} />
              <Tooltip content="Grid Layout View" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all relative group ${
                viewMode === "list" ? "bg-zinc-800 text-amber-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <List size={15} />
              <Tooltip content="Condensed Row List View" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
