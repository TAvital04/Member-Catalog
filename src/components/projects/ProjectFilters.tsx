"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";
import FilterPills from "@/components/common/FilterPills";

export interface ProjectFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

/**
 * ProjectFilters — Reusable Matchy-Matchy Filter Controls for Projects Page
 * Integrates unified SearchInput and Category FilterPills.
 */
export default function ProjectFilters({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
}: ProjectFiltersProps) {
  return (
    <section className="max-w-7xl w-full mx-auto px-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search projects by title, tool, or skill..."
        className="w-full md:max-w-md"
        ariaLabel="Search projects"
      />

      <FilterPills
        options={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        ariaLabel="Filter projects by category"
      />
    </section>
  );
}
