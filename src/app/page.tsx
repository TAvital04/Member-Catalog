"use client";

/**
 * @file page.tsx — Main Student Directory Page
 * @description Primary entry point for the RSO USF Member Catalog candidate directory.
 * Orchestrates multi-parametric filtering, layout toggling, and real-time student profile modals.
 */

import React, { useState, useRef, Suspense } from "react";
import { Student } from "@/data/students";
import { useDirectoryFilters } from "@/hooks/useDirectoryFilters";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useStudentData } from "@/hooks/useStudentData";
import { useFilteredStudents } from "@/hooks/useFilteredStudents";
import { useFlagDialogManager } from "@/hooks/useFlagDialogManager";

import FilterSidebar from "@/components/directory/FilterSidebar";
import FilterSidebarSkeleton from "@/components/directory/FilterSidebarSkeleton";
import StudentCardSkeleton from "@/components/directory/StudentCardSkeleton";
import StudentDirectoryResults from "@/components/directory/StudentDirectoryResults";
import PortfolioModal from "@/components/modal/PortfolioModal";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import DirectoryStatsHeader from "@/components/directory/DirectoryStatsHeader";
import DirectoryControlBar from "@/components/directory/DirectoryControlBar";
import ActiveFiltersBar from "@/components/directory/ActiveFiltersBar";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import ToastNotification from "@/components/dialogs/ToastNotification";
import { Shield } from "lucide-react";
import { useRoleManager, UserRole } from "@/hooks/useRoleManager";
import { CURRENT_CHAPTER_SPONSORS, getSponsorRelatedData } from "@/data/sponsors";

export type { UserRole };

function StudentDirectoryContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { role, setRole, hasFilterPermission, isAdmin, isStudent, isSponsor, session } = useRoleManager();
  const { students, setStudents, isLoading } = useStudentData();

  // Synced directory filter state from URL search params
  const {
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
    selectedProjects,
    setSelectedProjects,
    selectedCompanies,
    setSelectedCompanies,
    skillFilterMode,
    setSkillFilterMode,
    sortBy,
    setSortBy,
    resetAllFilters,
  } = useDirectoryFilters();

  // Visual layout & role states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterLayout, setFilterLayout] = useState<"side" | "top">("side");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [onlyLeadersFilter, setOnlyLeadersFilter] = useState(false);
  const [filterByMyself, setFilterByMyself] = useState(false);
  const [sponsorInteractingFilter, setSponsorInteractingFilter] = useState(false);

  // Match active student profile from authenticated session
  const loggedInStudent = React.useMemo(() => {
    if (!isStudent || students.length === 0) return null;
    const targetId = session?.studentId?.toLowerCase();
    const targetEmail = session?.email?.toLowerCase();
    const targetName = session?.displayName?.toLowerCase();

    return (
      students.find((s) => {
        if (targetId && s.id.toLowerCase() === targetId) return true;
        if (targetEmail && s.email.toLowerCase() === targetEmail) return true;
        if (targetName && s.name.toLowerCase() === targetName) return true;
        return false;
      }) || students[0]
    );
  }, [isStudent, session, students]);

  // Match active sponsor company from authenticated session
  const loggedInSponsor = React.useMemo(() => {
    if (!isSponsor) return null;
    const sponsorId = session?.sponsorId?.toLowerCase();
    const org = session?.organization?.toLowerCase().trim();
    const email = session?.email?.toLowerCase().trim();

    return (
      CURRENT_CHAPTER_SPONSORS.find(
        (s) =>
          (sponsorId && s.id.toLowerCase() === sponsorId) ||
          (org && (s.name.toLowerCase().includes(org) || org.includes(s.name.toLowerCase()))) ||
          (email && email.includes(s.id.toLowerCase()))
      ) || CURRENT_CHAPTER_SPONSORS[0]
    );
  }, [isSponsor, session]);

  const sponsorInteractingStudentIds = React.useMemo(() => {
    if (!isSponsor || !loggedInSponsor) return new Set<string>();
    const relData = getSponsorRelatedData(loggedInSponsor);
    const ids = new Set<string>();
    relData.interactions.forEach((item) => {
      if (item.student?.id) ids.add(item.student.id.toLowerCase());
      if (item.student?.email) ids.add(item.student.email.toLowerCase());
    });
    return ids;
  }, [isSponsor, loggedInSponsor]);

  // Custom confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(null);
      },
    });
  };

  const adminMode = isAdmin;
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole !== "admin") {
      setViewMode("grid");
    }
    if (newRole === "standard") {
      resetAllFilters();
      setOnlyLeadersFilter(false);
      setFilterByMyself(false);
      setSponsorInteractingFilter(false);
    }
  };

  // If standard user navigates with a skill filter (e.g. clicked from a portfolio modal), automatically activate sponsor access
  React.useEffect(() => {
    if (!hasFilterPermission) {
      if (selectedSkills.length > 0) {
        setRole("sponsor");
        return;
      }
      if (
        selectedMajors.length > 0 ||
        selectedGradDates.length > 0 ||
        selectedEvents.length > 0 ||
        selectedProjects.length > 0 ||
        (selectedCompanies && selectedCompanies.length > 0)
      ) {
        resetAllFilters();
      }
    }
  }, [hasFilterPermission, selectedMajors, selectedSkills, selectedGradDates, selectedEvents, selectedProjects, selectedCompanies, resetAllFilters, setRole]);

  // Keyboard shortcut Ctrl+K to search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute effective filter permission so skill queries from URL or navigation take effect immediately
  const effectiveFilterPermission = hasFilterPermission || selectedSkills.length > 0;

  // Filter & sort calculations hook
  const {
    availableMajors,
    availableSkills,
    availableGradDates,
    availableEvents,
    availableProjects,
    availableCompanies,
    filteredStudents,
    totalResumes,
    majorCount,
    totalSkillsCount,
  } = useFilteredStudents({
    students,
    searchQuery,
    selectedMajors,
    selectedSkills,
    selectedGradDates,
    selectedEvents,
    selectedProjects,
    selectedCompanies,
    onlyLeaders: onlyLeadersFilter,
    skillFilterMode,
    adminMode,
    adminFilterFlagged: null,
    sortBy,
    hasFilterPermission: effectiveFilterPermission,
    role,
  });

  // When self-filtering is enabled, narrow directory results strictly to the authenticated student or interacting candidates
  const displayedStudents = React.useMemo(() => {
    if (isStudent && filterByMyself && loggedInStudent) {
      return filteredStudents.filter(
        (s) =>
          s.id.toLowerCase() === loggedInStudent.id.toLowerCase() ||
          s.email.toLowerCase() === loggedInStudent.email.toLowerCase()
      );
    }
    if (isSponsor && sponsorInteractingFilter && sponsorInteractingStudentIds.size > 0) {
      return filteredStudents.filter(
        (s) =>
          sponsorInteractingStudentIds.has(s.id.toLowerCase()) ||
          sponsorInteractingStudentIds.has(s.email.toLowerCase())
      );
    }
    return filteredStudents;
  }, [filteredStudents, isStudent, filterByMyself, loggedInStudent, isSponsor, sponsorInteractingFilter, sponsorInteractingStudentIds]);

  // Admin profile deletion handler
  const { handleDeleteStudent } = useFlagDialogManager({
    students,
    setStudents,
    selectedStudent,
    setSelectedStudent,
    adminMode,
    role,
    showConfirm,
    setToastMessage,
  });

  // Clear specific active filter chips
  const removeMajorFilter = (major: string) => setSelectedMajors(selectedMajors.filter((m) => m !== major));
  const removeSkillFilter = (skill: string) => setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  const removeGradFilter = (date: string) => setSelectedGradDates(selectedGradDates.filter((d) => d !== date));
  const removeEventFilter = (evtTitle: string) => setSelectedEvents(selectedEvents.filter((e) => e !== evtTitle));
  const removeProjectFilter = (projName: string) => setSelectedProjects(selectedProjects.filter((p) => p !== projName));
  const removeCompanyFilter = (company: string) => setSelectedCompanies(selectedCompanies.filter((c) => c !== company));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 relative pb-16">
      {/* Admin Mode active banner indicator */}
      {adminMode && (
        <div className="bg-red-50 border-b border-red-200 py-2 px-4 text-center text-xs text-red-700 font-bold tracking-wide flex items-center justify-center gap-2 shadow-2xs">
          <Shield size={14} className="text-red-600" />
          <span>ADMINISTRATIVE MAINTENANCE MODE — PRIVILEGES UNLOCKED</span>
        </div>
      )}

      {/* Primary Header Navbar */}
      <DirectoryNavbar
        role={role}
        theme={theme}
        roleDropdownOpen={roleDropdownOpen}
        setRoleDropdownOpen={setRoleDropdownOpen}
        toggleTheme={toggleTheme}
        handleRoleChange={handleRoleChange}
      />

      {/* Directory Stats Dashboard Banner */}
      <DirectoryStatsHeader
        title="Member Candidate Directory"
        description="Explore USF engineering and computer science student resumes, portfolios, and project achievements."
        totalResumes={totalResumes}
        majorCount={majorCount}
        totalSkillsCount={totalSkillsCount}
      >
        {isStudent && loggedInStudent && (
          <div className="inline-flex p-0.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setFilterByMyself(false)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                !filterByMyself
                  ? "bg-white text-black shadow-2xs font-black"
                  : "text-neutral-500 hover:text-black font-semibold"
              }`}
            >
              All Members
            </button>
            <button
              type="button"
              onClick={() => setFilterByMyself(true)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterByMyself
                  ? "bg-black text-white shadow-2xs font-black"
                  : "text-neutral-500 hover:text-black font-semibold"
              }`}
            >
              Filter by Myself
            </button>
          </div>
        )}

        {isSponsor && loggedInSponsor && (
          <div className="inline-flex p-0.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setSponsorInteractingFilter(false)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                !sponsorInteractingFilter
                  ? "bg-white text-black shadow-2xs font-black"
                  : "text-neutral-500 hover:text-black font-semibold"
              }`}
            >
              All Candidates
            </button>
            <button
              type="button"
              onClick={() => setSponsorInteractingFilter(true)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                sponsorInteractingFilter
                  ? "bg-black text-white shadow-2xs font-black"
                  : "text-neutral-500 hover:text-black font-semibold"
              }`}
            >
              Interacting Candidates
            </button>
          </div>
        )}
      </DirectoryStatsHeader>

      {/* Secondary Search & Views Utility Header */}
      <DirectoryControlBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterLayout={filterLayout}
        setFilterLayout={setFilterLayout}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        role={role}
        searchInputRef={searchInputRef}
      />

      {/* Core Directory Layout (Sidebar + Results) */}
      <main className={`max-w-7xl w-full mx-auto px-4 flex ${filterLayout === "side" ? "flex-col min-[1056px]:flex-row min-[1056px]:items-start gap-8" : "flex-col gap-6"} relative z-10`}>
        {/* Filters Widget (Top or Side) */}
        {isLoading ? (
          <div className={`${filterLayout === "side" ? "w-full min-[1056px]:w-64 shrink-0 min-[1056px]:sticky min-[1056px]:top-20" : "w-full"}`}>
            <FilterSidebarSkeleton />
          </div>
        ) : (
          <FilterSidebar
            selectedMajors={selectedMajors}
            setSelectedMajors={setSelectedMajors}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            selectedGradDates={selectedGradDates}
            setSelectedGradDates={setSelectedGradDates}
            selectedEvents={selectedEvents}
            setSelectedEvents={setSelectedEvents}
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
            skillFilterMode={skillFilterMode}
            setSkillFilterMode={setSkillFilterMode}
            adminMode={adminMode}
            availableMajors={availableMajors}
            availableSkills={availableSkills}
            availableGradDates={availableGradDates}
            availableEvents={availableEvents}
            availableProjects={availableProjects}
            availableCompanies={availableCompanies}
            layout={filterLayout}
            role={role}
            onResetAll={resetAllFilters}
          />
        )}

        {/* Results directory area */}
        <div className="grow flex flex-col gap-4">
          {hasFilterPermission && (
            <ActiveFiltersBar
              selectedMajors={selectedMajors}
              removeMajorFilter={removeMajorFilter}
              selectedGradDates={selectedGradDates}
              removeGradFilter={removeGradFilter}
              selectedSkills={selectedSkills}
              removeSkillFilter={removeSkillFilter}
              selectedEvents={selectedEvents}
              removeEventFilter={removeEventFilter}
              selectedProjects={selectedProjects}
              removeProjectFilter={removeProjectFilter}
              selectedCompanies={selectedCompanies}
              removeCompanyFilter={removeCompanyFilter}
              onClearAll={() => {
                resetAllFilters();
                setFilterByMyself(false);
              }}
              filterByMyself={filterByMyself}
              removeSelfFilter={() => setFilterByMyself(false)}
              selfStudentName={loggedInStudent?.name}
            />
          )}

          <StudentDirectoryResults
            isLoading={isLoading}
            filteredStudents={displayedStudents}
            viewMode={viewMode}
            adminMode={adminMode}
            canFilter={hasFilterPermission}
            onSelectStudent={setSelectedStudent}
            onDeleteStudent={handleDeleteStudent}
            onResetAllFilters={() => {
              resetAllFilters();
              setFilterByMyself(false);
            }}
          />
        </div>
      </main>

      {/* Interactive modal overlay */}
      {selectedStudent && (
        <PortfolioModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          adminMode={adminMode}
          role={role}
          allStudents={students}
        />
      )}

      {/* Action feedback toast */}
      <ToastNotification toastMessage={toastMessage} />

      {/* Confirmation Modal */}
      <ConfirmDialog
        confirmDialog={confirmDialog}
        onClose={() => setConfirmDialog(null)}
      />
    </div>
  );
}

export default function StudentDirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-zinc-955 p-8 animate-pulse text-zinc-400">
          <div className="h-12 w-full glass-panel rounded-2xl mb-6 animate-shimmer" />
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <FilterSidebarSkeleton />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <StudentCardSkeleton />
              <StudentCardSkeleton />
            </div>
          </div>
        </div>
      }
    >
      <StudentDirectoryContent />
    </Suspense>
  );
}
