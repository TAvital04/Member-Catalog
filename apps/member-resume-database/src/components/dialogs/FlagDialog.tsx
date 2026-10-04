"use client";

import React from "react";
import { Student } from "../../data/students";
import { Search, Check, Trash2, AlertTriangle } from "lucide-react";

interface FlagDialogProps {
  flagDialog: {
    isOpen: boolean;
    studentId: string;
    studentName: string;
    isUnflagging: boolean;
    defaultReason: string;
  } | null;
  onClose: () => void;
  adminFlagChoice: "choose" | "flag" | null;
  setAdminFlagChoice: (choice: "choose" | "flag" | null) => void;
  flagReportType: "other" | "duplicate" | "ai_slop";
  setFlagReportType: (type: "other" | "duplicate" | "ai_slop") => void;
  flagReasonInput: string;
  setFlagReasonInput: (reason: string) => void;
  duplicateSearchQuery: string;
  setDuplicateSearchQuery: (query: string) => void;
  selectedDuplicateTargetIds: string[];
  setSelectedDuplicateTargetIds: (ids: string[]) => void;
  students: Student[];
  handleConfirmFlagAction: () => void;
  handleDeleteStudent: (id: string) => void;
  flagDialogRef: React.RefObject<HTMLDivElement | null>;
}

export default function FlagDialog({
  flagDialog,
  onClose,
  adminFlagChoice,
  setAdminFlagChoice,
  flagReportType,
  setFlagReportType,
  flagReasonInput,
  setFlagReasonInput,
  duplicateSearchQuery,
  setDuplicateSearchQuery,
  selectedDuplicateTargetIds,
  setSelectedDuplicateTargetIds,
  students,
  handleConfirmFlagAction,
  handleDeleteStudent,
  flagDialogRef,
}: FlagDialogProps) {
  if (!flagDialog) return null;

  const reportedStudent = students.find((s) => s.id === flagDialog.studentId);
  const duplicateSearchResults = students.filter((s) => {
    if (s.id === flagDialog.studentId) return false;
    if (!duplicateSearchQuery.trim()) return true;
    const q = duplicateSearchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.major.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md cursor-pointer overflow-y-auto"
      onClick={onClose}
    >
      <div
        ref={flagDialogRef}
        className={`w-full rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl relative z-[70] animate-scale-in cursor-default transition-all duration-300 max-h-[90vh] overflow-y-auto ${
          !flagDialog.isUnflagging && flagReportType === "duplicate" && adminFlagChoice !== "choose"
            ? "max-w-4xl"
            : "max-w-md"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {adminFlagChoice === "choose" ? (
          <div className="flex flex-col gap-6 animate-scale-in">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl shrink-0 bg-red-500/10 text-red-500 border border-red-500/20">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">Select Admin Action</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Choose whether you want to flag/report <strong>{flagDialog.studentName}</strong>&apos;s profile or
                  delete it from the database immediately.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <button
                type="button"
                onClick={() => setAdminFlagChoice("flag")}
                className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-zinc-800 bg-zinc-955/40 hover:bg-zinc-850 hover:border-zinc-700 transition-all text-center cursor-pointer group"
              >
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:scale-105 transition-transform">
                  <AlertTriangle size={18} />
                </span>
                <span className="text-xs font-bold text-zinc-200">Flag & Report Profile</span>
                <span className="text-[10px] text-zinc-500">
                  Flags profile to hide it from standard view and allow duplicate linkage.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleDeleteStudent(flagDialog.studentId);
                }}
                className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-zinc-800 bg-zinc-955/40 hover:bg-red-500/10 hover:border-red-900/40 transition-all text-center cursor-pointer group"
              >
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 group-hover:scale-105 transition-transform">
                  <Trash2 size={18} />
                </span>
                <span className="text-xs font-bold text-zinc-200">Delete Profile Immediately</span>
                <span className="text-[10px] text-zinc-500">
                  Permanently deletes this student profile from the database.
                </span>
              </button>
            </div>

            <div className="flex justify-end gap-2.5 mt-4 border-t border-zinc-855 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  flagDialog.isUnflagging
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
              >
                <AlertTriangle size={20} />
              </div>
              <div className="grow">
                <h3 className="text-base font-bold text-zinc-100">
                  {flagDialog.isUnflagging
                    ? "Unflag Student Profile"
                    : flagReportType === "duplicate"
                    ? "Reporting a Duplicate Entry"
                    : flagReportType === "ai_slop"
                    ? "Reporting AI Slop / Generated Content"
                    : "Flag & Report Profile"}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  {flagDialog.isUnflagging
                    ? `Are you sure you want to remove the flag from ${flagDialog.studentName}'s profile? It will become visible in the directory.`
                    : flagReportType === "duplicate"
                    ? `Link duplicate candidate entries together to audit and resolve them under a shared group.`
                    : flagReportType === "ai_slop"
                    ? `Flag ${flagDialog.studentName}'s profile for low-quality AI-generated slop, boilerplate text, or synthetic profile data.`
                    : `Provide a reason to flag/report ${flagDialog.studentName}'s profile. Flagged profiles are hidden from normal view.`}
                </p>
              </div>
            </div>

            {/* Toggle Report Type (only when flagging) */}
            {!flagDialog.isUnflagging && (
              <div className="flex flex-col gap-1.5 mt-4 mb-4">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Report Type</label>
                <div className="flex gap-2 p-1 rounded-xl bg-zinc-955 border border-zinc-850/60 w-full">
                  <button
                    type="button"
                    onClick={() => setFlagReportType("duplicate")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                      flagReportType === "duplicate"
                        ? "bg-amber-500 text-zinc-955 shadow-md font-extrabold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Duplicate Entry
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlagReportType("ai_slop")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                      flagReportType === "ai_slop"
                        ? "bg-amber-500 text-zinc-955 shadow-md font-extrabold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    AI Slop
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlagReportType("other")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-center ${
                      flagReportType === "other"
                        ? "bg-amber-500 text-zinc-955 shadow-md font-extrabold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Other
                  </button>
                </div>
              </div>
            )}

            {/* Content view based on selection */}
            {!flagDialog.isUnflagging && flagReportType === "duplicate" ? (
              // DUPLICATE ENTRY LAYOUT
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 border-t border-zinc-850 pt-4 animate-fade-in">
                {/* Left Column: Profile being reported */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Profile Being Reported</h4>
                  {reportedStudent ? (
                    <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-955/40 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs bg-zinc-850 border border-zinc-800 text-zinc-300">
                        {reportedStudent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-zinc-200">{reportedStudent.name}</span>
                        <span className="block text-[10px] text-amber-500 font-semibold">{reportedStudent.major}</span>
                        <span className="block text-[9px] text-zinc-550 truncate max-w-[180px]">
                          {reportedStudent.email}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-550 italic">Candidate profile not found.</div>
                  )}
                </div>

                {/* Right Column: Search & Selection List */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Search & Link Duplicate
                    </h4>
                  </div>

                  {/* Search Input Box */}
                  <div className="relative">
                    <input
                      type="text"
                      value={duplicateSearchQuery}
                      onChange={(e) => setDuplicateSearchQuery(e.target.value)}
                      placeholder="Search candidates, major, email..."
                      className="w-full bg-zinc-950 border border-zinc-855 rounded-xl pl-8 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-550 focus:outline-none focus:border-amber-500 shadow-inner"
                    />
                    <Search size={12} className="absolute left-2.5 top-3 text-zinc-500 pointer-events-none" />
                  </div>

                  {/* List View */}
                  <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                    {duplicateSearchResults.length > 0 ? (
                      duplicateSearchResults.map((dup) => {
                        const isSelected = selectedDuplicateTargetIds.includes(dup.id);
                        const initials = dup.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .substring(0, 2);
                        return (
                          <div
                            key={dup.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedDuplicateTargetIds(selectedDuplicateTargetIds.filter((id) => id !== dup.id));
                              } else {
                                setSelectedDuplicateTargetIds([...selectedDuplicateTargetIds, dup.id]);
                              }
                            }}
                            className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer group relative ${
                              isSelected
                                ? "bg-zinc-800/60 border-amber-500/40 shadow-inner"
                                : "bg-zinc-955/40 border-zinc-855 hover:border-zinc-800"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] bg-zinc-850 border border-zinc-800 text-zinc-300">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <span className="block text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">
                                  {dup.name}
                                </span>
                                <span className="block text-[9px] text-zinc-500 font-semibold">{dup.major}</span>
                              </div>
                            </div>
                            {/* Checkbox */}
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-amber-500 border-amber-500 text-zinc-950"
                                  : "border-zinc-700 hover:border-zinc-500 text-transparent"
                              }`}
                            >
                              <Check size={10} className="stroke-[3]" />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-xs text-zinc-550 italic">No candidates match query.</div>
                    )}
                  </div>
                </div>
              </div>
            ) : flagReportType === "ai_slop" && !flagDialog.isUnflagging ? (
              // AI SLOP VIEW
              <div className="mt-4 flex flex-col gap-1.5 border-t border-zinc-850 pt-4 animate-fade-in">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Reason for Flagging AI Slop
                </label>
                <input
                  type="text"
                  value={flagReasonInput}
                  onChange={(e) => setFlagReasonInput(e.target.value)}
                  placeholder="e.g., Generic ChatGPT bio, hallucinated skills..."
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-550 focus:outline-none focus:border-red-500 shadow-inner"
                  autoFocus
                />
              </div>
            ) : (
              // STANDARD / OTHER OPTION VIEW
              !flagDialog.isUnflagging && (
                <div className="mt-4 flex flex-col gap-3 border-t border-zinc-850 pt-4 animate-fade-in">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Structured Reason for Flagging</label>
                  
                  {/* Preset reason buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Broken Resume Link",
                      "Outdated Info / Graduated",
                      "Inappropriate / Spam Content",
                      "Other / Custom Note",
                    ].map((reasonPreset) => {
                      const isSelected = flagReasonInput.startsWith(reasonPreset);
                      return (
                        <button
                          key={reasonPreset}
                          type="button"
                          onClick={() => setFlagReasonInput(reasonPreset)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm"
                              : "bg-zinc-850 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
                          }`}
                        >
                          {reasonPreset}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    value={flagReasonInput}
                    onChange={(e) => setFlagReasonInput(e.target.value)}
                    placeholder="e.g. Broken Resume Link, Outdated Info, Inappropriate Content..."
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-550 focus:outline-none focus:border-red-500 shadow-inner mt-1"
                    autoFocus
                  />
                </div>
              )
            )}

            <div className="flex items-center justify-end gap-2.5 mt-6 border-t border-zinc-850 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFlagAction}
                disabled={
                  !flagDialog.isUnflagging && flagReportType === "duplicate" && selectedDuplicateTargetIds.length === 0
                }
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                  flagDialog.isUnflagging
                    ? "bg-amber-500 hover:bg-amber-600 text-zinc-950"
                    : !flagDialog.isUnflagging &&
                      flagReportType === "duplicate" &&
                      selectedDuplicateTargetIds.length === 0
                    ? "bg-zinc-800 text-zinc-650 border border-zinc-850 cursor-not-allowed shadow-none"
                    : "bg-red-500 hover:bg-red-650 text-white shadow-red-500/10"
                }`}
              >
                {flagDialog.isUnflagging ? "Confirm Unflag" : "Confirm Flag"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
