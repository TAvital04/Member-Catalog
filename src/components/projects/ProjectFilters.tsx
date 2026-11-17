"use client";

import React from "react";
import SearchInput from "@/components/common/SearchInput";

export interface ProjectFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

/**
 * ProjectFilters — Filter Controls for Projects Page
 * Integrates unified SearchInput across the full width.
 */
export default function ProjectFilters({
  searchQuery,
  setSearchQuery,
}: ProjectFiltersProps) {
  return (
    <section className="max-w-7xl w-full mx-auto px-4 mb-5">
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search projects by title, tool, or skill..."
        className="w-full"
        ariaLabel="Search projects"
      />
    </section>
  );
}
