"use client";

import React, { useState, useRef, Suspense } from "react";
import { Student } from "../data/students";
import { useDirectoryFilters } from "../hooks/useDirectoryFilters";
import { useThemeManager } from "../hooks/useThemeManager";
import { useStudentData } from "../hooks/useStudentData";
import { useFilteredStudents } from "../hooks/useFilteredStudents";
import { useFlagDialogManager } from "../hooks/useFlagDialogManager";
import { useResolveDialogManager } from "../hooks/useResolveDialogManager";

import FilterSidebar from "../components/directory/FilterSidebar";
import FilterSidebarSkeleton from "../components/directory/FilterSidebarSkeleton";
import StudentCardSkeleton from "../components/directory/StudentCardSkeleton";
import StudentDirectoryResults from "../components/directory/StudentDirectoryResults";
import PortfolioModal from "../components/modal/PortfolioModal";
import DirectoryNavbar from "../components/directory/DirectoryNavbar";
import DirectoryStatsHeader from "../components/directory/DirectoryStatsHeader";
import DirectoryControlBar from "../components/directory/DirectoryControlBar";
import ActiveFiltersBar from "../components/directory/ActiveFiltersBar";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";
import ResolveDialog from "../components/dialogs/ResolveDialog";
import FlagDialog from "../components/dialogs/FlagDialog";
import ToastNotification from "../components/dialogs/ToastNotification";
import { Shield } from "lucide-react";

export type UserRole = "standard" | "sponsor" | "admin";

function StudentDirectoryContent() {
  const { theme, toggleTheme } = useThemeManager();
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
    skillFilterMode,
    setSkillFilterMode,
    adminFilterFlagged,
    setAdminFilterFlagged,
    sortBy,
    setSortBy,
    resetAllFilters,
  } = useDirectoryFilters();

  // Visual layout & role states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterLayout, setFilterLayout] = useState<"side" | "top">("side");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [role, setRole] = useState<UserRole>("admin");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const adminMode = role === "admin";
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole !== "admin") {
      setViewMode("grid");
    }
    if (newRole === "standard") {
      resetAllFilters();
    }
  };

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

  // Filter & sort calculations hook
  const {
    availableMajors,
    availableSkills,
    availableGradDates,
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
    skillFilterMode,
    adminMode,
    adminFilterFlagged,
    sortBy,
  });

  // Moderation & Flagging dialog manager hook
  const {
    flagDialog,
    setFlagDialog,
    flagReasonInput,
    setFlagReasonInput,
    flagReportType,
    setFlagReportType,
    duplicateSearchQuery,
    setDuplicateSearchQuery,
    selectedDuplicateTargetIds,
    setSelectedDuplicateTargetIds,
    adminFlagChoice,
    setAdminFlagChoice,
    flagDialogRef,
    handleDeleteStudent,
    handleToggleFlagStudent,
    handleConfirmFlagAction,
  } = useFlagDialogManager({
    students,
    setStudents,
    selectedStudent,
    setSelectedStudent,
    adminMode,
    role,
    showConfirm,
    setToastMessage,
  });

  // Duplicate Resolution dialog manager hook
  const {
    resolveDialogStudent,
    setResolveDialogStudent,
    selectedDuplicateIds,
    setSelectedDuplicateIds,
    resolveDialogRef,
    handleOpenResolveDialog,
    handleResolveKeepAll,
    handleResolveRemoveAll,
    handleResolveKeepSelection,
    handleResolveRemoveSelection,
    handleResolveUnflag,
    handleResolveDelete,
  } = useResolveDialogManager({
    students,
    setStudents,
    selectedStudent,
    setSelectedStudent,
    showConfirm,
    setToastMessage,
  });

  // Clear specific active filter chips
  const removeMajorFilter = (major: string) => setSelectedMajors(selectedMajors.filter((m) => m !== major));
  const removeSkillFilter = (skill: string) => setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  const removeGradFilter = (date: string) => setSelectedGradDates(selectedGradDates.filter((d) => d !== date));

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-200 relative pb-16 overflow-x-hidden">
      {/* Decorative Tech Overlay Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="circuit-overlay"></div>
      </div>

      {/* Admin Mode active banner indicator */}
      {adminMode && (
        <div className="bg-red-500/10 border-b border-red-500/20 py-1.5 px-4 text-center text-xs text-red-400 font-bold tracking-wide flex items-center justify-center gap-2 animate-pulse">
          <Shield size={13} />
          <span>ADMINISTRATIVE MAINTENANCE MODE ACTIVE — PRIVILEGES UNLOCKED</span>
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
        totalResumes={totalResumes}
        majorCount={majorCount}
        totalSkillsCount={totalSkillsCount}
      />

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
      <main className={`max-w-7xl w-full mx-auto px-4 flex ${filterLayout === "side" ? "flex-col min-[1056px]:flex-row gap-8" : "flex-col gap-6"} relative z-10`}>
        {/* Filters Widget (Top or Side) */}
        {isLoading ? (
          <div className={`${filterLayout === "side" ? "w-full min-[1056px]:w-72 shrink-0" : "w-full"}`}>
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
            skillFilterMode={skillFilterMode}
            setSkillFilterMode={setSkillFilterMode}
            adminMode={adminMode}
            adminFilterFlagged={adminFilterFlagged}
            setAdminFilterFlagged={setAdminFilterFlagged}
            availableMajors={availableMajors}
            availableSkills={availableSkills}
            availableGradDates={availableGradDates}
            layout={filterLayout}
            role={role}
            onResetAll={resetAllFilters}
          />
        )}

        {/* Results directory area */}
        <div className="grow flex flex-col gap-4">
          <ActiveFiltersBar
            selectedMajors={selectedMajors}
            removeMajorFilter={removeMajorFilter}
            selectedGradDates={selectedGradDates}
            removeGradFilter={removeGradFilter}
            selectedSkills={selectedSkills}
            removeSkillFilter={removeSkillFilter}
            onClearAll={resetAllFilters}
          />


          <StudentDirectoryResults
            isLoading={isLoading}
            filteredStudents={filteredStudents}
            viewMode={viewMode}
            adminMode={adminMode}
            onSelectStudent={setSelectedStudent}
            onDeleteStudent={handleDeleteStudent}
            onToggleFlagStudent={handleToggleFlagStudent}
            onResetAllFilters={resetAllFilters}
          />
        </div>
      </main>

      {/* Interactive modal overlay */}
      {selectedStudent && (
        <PortfolioModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onToggleFlag={handleToggleFlagStudent}
          onResolve={handleOpenResolveDialog}
          adminMode={adminMode}
          role={role}
        />
      )}

      {/* Resolve Issue Dialog Overlay */}
      <ResolveDialog
        resolveDialogStudent={resolveDialogStudent}
        onClose={() => setResolveDialogStudent(null)}
        students={students}
        selectedDuplicateIds={selectedDuplicateIds}
        setSelectedDuplicateIds={setSelectedDuplicateIds}
        handleResolveKeepAll={handleResolveKeepAll}
        handleResolveRemoveAll={handleResolveRemoveAll}
        handleResolveKeepSelection={handleResolveKeepSelection}
        handleResolveRemoveSelection={handleResolveRemoveSelection}
        handleResolveUnflag={handleResolveUnflag}
        handleResolveDelete={handleResolveDelete}
        resolveDialogRef={resolveDialogRef}
      />

      {/* Custom Flagging Dialogue Modal */}
      <FlagDialog
        flagDialog={flagDialog}
        onClose={() => setFlagDialog(null)}
        adminFlagChoice={adminFlagChoice}
        setAdminFlagChoice={setAdminFlagChoice}
        flagReportType={flagReportType}
        setFlagReportType={setFlagReportType}
        flagReasonInput={flagReasonInput}
        setFlagReasonInput={setFlagReasonInput}
        duplicateSearchQuery={duplicateSearchQuery}
        setDuplicateSearchQuery={setDuplicateSearchQuery}
        selectedDuplicateTargetIds={selectedDuplicateTargetIds}
        setSelectedDuplicateTargetIds={setSelectedDuplicateTargetIds}
        students={students}
        handleConfirmFlagAction={handleConfirmFlagAction}
        handleDeleteStudent={handleDeleteStudent}
        flagDialogRef={flagDialogRef}
      />

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
