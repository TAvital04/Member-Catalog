"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";
import FilterPills from "@/components/common/FilterPills";
import SegmentedControl from "@/components/common/SegmentedControl";

export interface EventFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  timeFilter: "all" | "upcoming" | "past";
  setTimeFilter: (val: "all" | "upcoming" | "past") => void;
}

/**
 * EventFilters — Reusable Matchy-Matchy Filter Controls for Events Page
 * Integrates unified SearchInput, Category FilterPills, and Time SegmentedControl.
 */
export default function EventFilters({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
  timeFilter,
  setTimeFilter,
}: EventFiltersProps) {
  const timeOptions = [
    { value: "all" as const, label: "All" },
    { value: "upcoming" as const, label: "Upcoming" },
    { value: "past" as const, label: "Past Sessions" },
  ];

  return (
    <section className="max-w-7xl w-full mx-auto px-4 mb-5 space-y-3">
      {/* Top Controls Row: Search & Time Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search events by title, partner, or topic..."
          className="grow"
        />

        <SegmentedControl
          options={timeOptions}
          value={timeFilter}
          onChange={setTimeFilter}
          ariaLabel="Filter events by timeframe"
        />
      </div>

      {/* Category Pills Bar */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <FilterPills
          options={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          ariaLabel="Filter events by category"
        />
      </div>
    </section>
  );
}
