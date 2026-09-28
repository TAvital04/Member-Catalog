"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

export interface DirectoryFilterState {
  searchQuery: string;
  selectedMajors: string[];
  selectedSkills: string[];
  selectedGradDates: string[];
  selectedEvents: string[];
  selectedCompanies: string[];
  skillFilterMode: "AND" | "OR";
  adminFilterFlagged: boolean | null;
  sortBy: "name" | "gradDate" | "gpa";
}

export function useDirectoryFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Read current filter state from URL search params
  const searchQuery = searchParams.get("q") || "";
  
  const selectedMajors = searchParams.get("majors")
    ? searchParams.get("majors")!.split(",").filter(Boolean)
    : [];

  const selectedSkills = searchParams.get("skills")
    ? searchParams.get("skills")!.split(",").filter(Boolean)
    : [];

  const selectedGradDates = searchParams.get("grad")
    ? searchParams.get("grad")!.split(",").filter(Boolean)
    : [];

  const selectedEvents = searchParams.get("events")
    ? searchParams.get("events")!.split(",").filter(Boolean)
    : [];

  const selectedCompanies = searchParams.get("companies")
    ? searchParams.get("companies")!.split(",").filter(Boolean)
    : [];

  const skillFilterMode: "AND" | "OR" =
    searchParams.get("skillMode") === "AND" ? "AND" : "OR";

  const flaggedParam = searchParams.get("flagged");
  const adminFilterFlagged: boolean | null =
    flaggedParam === "true" ? true : flaggedParam === "false" ? false : null;

  const sortParam = searchParams.get("sort");
  const sortBy: "name" | "gradDate" | "gpa" =
    sortParam === "gradDate" || sortParam === "gpa" ? sortParam : "name";

  // Helper to push updated search parameters to the URL
  const updateQueryParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.replace(targetUrl, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  const setSearchQuery = useCallback(
    (q: string) => {
      updateQueryParams({ q: q.trim() ? q : null });
    },
    [updateQueryParams]
  );

  const setSelectedMajors = useCallback(
    (majors: string[]) => {
      updateQueryParams({ majors: majors.length > 0 ? majors.join(",") : null });
    },
    [updateQueryParams]
  );

  const setSelectedSkills = useCallback(
    (skills: string[]) => {
      updateQueryParams({ skills: skills.length > 0 ? skills.join(",") : null });
    },
    [updateQueryParams]
  );

  const setSelectedGradDates = useCallback(
    (dates: string[]) => {
      updateQueryParams({ grad: dates.length > 0 ? dates.join(",") : null });
    },
    [updateQueryParams]
  );

  const setSelectedEvents = useCallback(
    (events: string[]) => {
      updateQueryParams({ events: events.length > 0 ? events.join(",") : null });
    },
    [updateQueryParams]
  );

  const setSelectedCompanies = useCallback(
    (companies: string[]) => {
      updateQueryParams({ companies: companies.length > 0 ? companies.join(",") : null });
    },
    [updateQueryParams]
  );

  const setSkillFilterMode = useCallback(
    (mode: "AND" | "OR") => {
      updateQueryParams({ skillMode: mode === "AND" ? "AND" : null });
    },
    [updateQueryParams]
  );

  const setAdminFilterFlagged = useCallback(
    (flagged: boolean | null) => {
      updateQueryParams({
        flagged: flagged === true ? "true" : flagged === false ? "false" : null,
      });
    },
    [updateQueryParams]
  );

  const setSortBy = useCallback(
    (sort: "name" | "gradDate" | "gpa") => {
      updateQueryParams({ sort: sort === "name" ? null : sort });
    },
    [updateQueryParams]
  );

  const resetAllFilters = useCallback(() => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }, [pathname, router]);

  return {
    searchQuery,
    setSearchQuery,
    selectedMajors,
    setSelectedMajors,
    selectedSkills,
    setSelectedSkills,
    selectedGradDates,
    setSelectedGradDates,
    selectedEvents,
    setSelectedEvents,
    selectedCompanies,
    setSelectedCompanies,
    skillFilterMode,
    setSkillFilterMode,
    adminFilterFlagged,
    setAdminFilterFlagged,
    sortBy,
    setSortBy,
    resetAllFilters,
    isPending,
  };
}


