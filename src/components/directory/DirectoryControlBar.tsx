"use client";

import React, { useState, useRef, useEffect } from "react";
import { UserRole } from "@/app/page";
import Tooltip from "../common/Tooltip";
import { Search, X, LayoutGrid, List, ChevronDown, Check, ArrowUpDown } from "lucide-react";
import { DirectorySortOption } from "@/hooks/useDirectoryFilters";

interface DirectoryControlBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterLayout?: "side" | "top";
  setFilterLayout?: (layout: "side" | "top") => void;
  sortBy: DirectorySortOption;
  setSortBy: (sort: DirectorySortOption) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  role: UserRole;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

interface PrimarySortConfig {
  id: "activity" | "activity-recent" | "updated" | "created" | "gpa" | "gradDate";
  reverseId: DirectorySortOption;
  label: string;
  hint: string;
  group: "Activity" | "Timeline" | "Academics";
}

const PRIMARY_SORT_OPTIONS: PrimarySortConfig[] = [
  {
    id: "activity",
    reverseId: "activity-asc",
    label: "Most Active Ever",
    hint: "Highest all-time engagement",
    group: "Activity",
  },
  {
    id: "activity-recent",
    reverseId: "activity-recent-asc",
    label: "Most Active in the Last 2 Weeks",
    hint: "Highest recent engagement",
    group: "Activity",
  },
  {
    id: "updated",
    reverseId: "updated-asc",
    label: "Recently Updated",
    hint: "Profiles with newest changes",
    group: "Timeline",
  },
  {
    id: "created",
    reverseId: "created-asc",
    label: "Recently Created",
    hint: "Newly registered candidate profiles",
    group: "Timeline",
  },
  {
    id: "gpa",
    reverseId: "gpa-asc",
    label: "GPA",
    hint: "Highest cumulative GPA first",
    group: "Academics",
  },
  {
    id: "gradDate",
    reverseId: "gradDate-desc",
    label: "Graduation Date",
    hint: "Upcoming graduates first",
    group: "Academics",
  },
];

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
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== searchQuery) {
        setSearchQuery(localQuery);
      }
    }, 200);
    return () => clearTimeout(handler);
  }, [localQuery, searchQuery, setSearchQuery]);

  // Click outside and escape key handling
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    }

    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSortOpen]);

  const currentOption =
    PRIMARY_SORT_OPTIONS.find(
      (option) => option.id === sortBy || option.reverseId === sortBy
    ) || PRIMARY_SORT_OPTIONS[0];

  const isReversed = currentOption.reverseId === sortBy;

  const handleToggleReverse = () => {
    if (isReversed) {
      setSortBy(currentOption.id);
    } else {
      setSortBy(currentOption.reverseId);
    }
  };

  const activityOptions = PRIMARY_SORT_OPTIONS.filter(
    (opt) => opt.group === "Activity"
  );
  const timelineOptions = PRIMARY_SORT_OPTIONS.filter(
    (opt) => opt.group === "Timeline"
  );
  const academicOptions = PRIMARY_SORT_OPTIONS.filter(
    (opt) => opt.group === "Academics"
  );

  return (
    <section className="max-w-7xl w-full mx-auto px-4 mb-5 flex flex-col sm:flex-row items-center gap-3">
      {/* Search Input Box */}
      <div className="relative w-full grow">
        <Search
          size={16}
          className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none"
        />
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
        {/* Custom Sorting Dropdown matching app design system */}
        <div ref={sortDropdownRef} className="relative">
          <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-2xs gap-0.5">
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              aria-expanded={isSortOpen}
              aria-haspopup="listbox"
              id="directory-sort-button"
              className="flex items-center gap-2 px-2.5 py-1 text-xs text-slate-800 font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none"
            >
              <span className="text-slate-500 font-medium text-[11px] select-none">
                Sort:
              </span>
              <span className="text-slate-900 font-semibold max-w-[180px] sm:max-w-[210px] truncate text-left">
                {currentOption.label}
              </span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${
                  isSortOpen ? "rotate-180 text-slate-700" : ""
                }`}
              />
            </button>

            <div className="h-4 w-px bg-slate-200 mx-0.5" />

            {/* Quick Reverse Sort Order Action Button */}
            <button
              type="button"
              onClick={handleToggleReverse}
              id="directory-sort-reverse-toggle"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer relative group ${
                isReversed
                  ? "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              }`}
              aria-label="Reverse sort order"
            >
              <ArrowUpDown size={14} />
              <Tooltip
                content={
                  isReversed
                    ? "Reversed order active (Click to flip)"
                    : "Reverse sort order (Click to flip)"
                }
              />
            </button>
          </div>

          {/* Custom Popover Dropdown Menu */}
          {isSortOpen && (
            <div
              role="listbox"
              aria-labelledby="directory-sort-button"
              className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 z-50 max-h-96 overflow-y-auto animate-scale-in"
            >
              {/* Group 1: Activity */}
              <div className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                Activity
              </div>
              <div className="space-y-0.5">
                {activityOptions.map((opt) => {
                  const isSelected = opt.id === sortBy || opt.reverseId === sortBy;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSortBy(opt.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-slate-100 text-slate-900 font-semibold"
                          : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <div className="flex flex-col pr-2">
                        <span className="leading-tight">{opt.label}</span>
                        {opt.hint && (
                          <span className="text-[10px] text-slate-400 font-normal mt-0.5">
                            {opt.hint}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-slate-800 shrink-0 stroke-[2.5]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="my-1.5 border-t border-slate-100" />

              {/* Group 2: Timeline */}
              <div className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                Timeline
              </div>
              <div className="space-y-0.5">
                {timelineOptions.map((opt) => {
                  const isSelected = opt.id === sortBy || opt.reverseId === sortBy;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSortBy(opt.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-slate-100 text-slate-900 font-semibold"
                          : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <div className="flex flex-col pr-2">
                        <span className="leading-tight">{opt.label}</span>
                        {opt.hint && (
                          <span className="text-[10px] text-slate-400 font-normal mt-0.5">
                            {opt.hint}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-slate-800 shrink-0 stroke-[2.5]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="my-1.5 border-t border-slate-100" />

              {/* Group 3: Academics */}
              <div className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                Academics
              </div>
              <div className="space-y-0.5">
                {academicOptions.map((opt) => {
                  const isSelected = opt.id === sortBy || opt.reverseId === sortBy;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSortBy(opt.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-slate-100 text-slate-900 font-semibold"
                          : "text-slate-700 hover:bg-slate-50 font-medium"
                      }`}
                    >
                      <div className="flex flex-col pr-2">
                        <span className="leading-tight">{opt.label}</span>
                        {opt.hint && (
                          <span className="text-[10px] text-slate-400 font-normal mt-0.5">
                            {opt.hint}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-slate-800 shrink-0 stroke-[2.5]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
