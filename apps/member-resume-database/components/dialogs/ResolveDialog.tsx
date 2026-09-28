"use client";

import React from "react";
import { Student } from "../../data/students";
import { Check, Trash2, CheckSquare, XSquare, X, FlagOff } from "lucide-react";

interface ResolveDialogProps {
  resolveDialogStudent: Student | null;
  onClose: () => void;
  students: Student[];
  selectedDuplicateIds: string[];
  setSelectedDuplicateIds: (ids: string[]) => void;
  handleResolveKeepAll: (duplicateGroup: string) => void;
  handleResolveRemoveAll: (duplicateGroup: string) => void;
  handleResolveKeepSelection: (duplicateGroup: string, selectedIds: string[]) => void;
  handleResolveRemoveSelection: (duplicateGroup: string, selectedIds: string[]) => void;
  handleResolveUnflag: (studentId: string) => void;
  handleResolveDelete: (student: Student) => void;
  resolveDialogRef: React.RefObject<HTMLDivElement | null>;
}

export default function ResolveDialog({
  resolveDialogStudent,
  onClose,
  students,
  selectedDuplicateIds,
  setSelectedDuplicateIds,
  handleResolveKeepAll,
  handleResolveRemoveAll,
  handleResolveKeepSelection,
  handleResolveRemoveSelection,
  handleResolveUnflag,
  handleResolveDelete,
  resolveDialogRef,
}: ResolveDialogProps) {
  if (!resolveDialogStudent) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-zinc-955/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div
        ref={resolveDialogRef}
        className="w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 relative flex flex-col gap-6 animate-scale-in max-h-[90vh] overflow-y-auto"
      >
        {/* Header section */}
        {(() => {
          const isDuplicate = Boolean(resolveDialogStudent.duplicateGroup);
          const isAiSlop = Boolean(
            !isDuplicate &&
            resolveDialogStudent.flagReason &&
            /ai|slop|generated|chatgpt/i.test(resolveDialogStudent.flagReason)
          );
          return (
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div>
                <h3 className="text-lg font-black text-zinc-100 uppercase tracking-wide leading-tight">Profile Reported</h3>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isDuplicate
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}
                >
                  Report Type: {isDuplicate ? "Duplicate" : isAiSlop ? "AI Slop" : "Flag"}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-zinc-855 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow"
              >
                <X size={16} />
              </button>
            </div>
          );
        })()}

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resolveDialogStudent.duplicateGroup ? (
            // DUPLICATE GROUP LAYOUT
            <>
              {/* Left Column: Actions */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Resolution Actions</h4>

                <button
                  type="button"
                  onClick={() => handleResolveKeepAll(resolveDialogStudent.duplicateGroup!)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Check size={14} className="stroke-[3]" />
                  <span>Keep All</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolveRemoveAll(resolveDialogStudent.duplicateGroup!)}
                  className="w-full py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>

                <div className="border-t border-zinc-850 my-2 pt-4 flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-zinc-555 uppercase tracking-wider block">
                    Resolve by Selection
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleResolveKeepSelection(resolveDialogStudent.duplicateGroup!, selectedDuplicateIds)
                      }
                      className="py-2.5 px-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckSquare size={13} />
                      <span>Keep Selection</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleResolveRemoveSelection(resolveDialogStudent.duplicateGroup!, selectedDuplicateIds)
                      }
                      className="py-2.5 px-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XSquare size={13} />
                      <span>Delete Selection</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Scrollable List of Duplicates */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Duplicate Profiles</h4>
                  <span className="text-[10px] font-semibold text-zinc-555">
                    {selectedDuplicateIds.length} of{" "}
                    {students.filter((s) => s.duplicateGroup === resolveDialogStudent.duplicateGroup).length} selected
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {students
                    .filter((s) => s.duplicateGroup === resolveDialogStudent.duplicateGroup)
                    .map((dup) => {
                      const isChecked = selectedDuplicateIds.includes(dup.id);
                      const initials = dup.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase();
                      return (
                        <div
                          key={dup.id}
                          onClick={() => {
                            if (isChecked) {
                              setSelectedDuplicateIds(selectedDuplicateIds.filter((id) => id !== dup.id));
                            } else {
                              setSelectedDuplicateIds([...selectedDuplicateIds, dup.id]);
                            }
                          }}
                          className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer group relative ${
                            isChecked
                              ? "bg-zinc-800/60 border-amber-500/40 shadow-inner"
                              : "bg-zinc-950/40 border-zinc-850 hover:border-zinc-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs bg-zinc-850 border border-zinc-800 text-zinc-300">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-zinc-200">{dup.name}</span>
                              <span className="block text-[10px] text-amber-500 font-semibold">{dup.major}</span>
                              <span className="block text-[9px] text-zinc-550 truncate max-w-[180px]">{dup.email}</span>
                            </div>
                          </div>

                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                              isChecked
                                ? "bg-amber-500 border-amber-500 text-zinc-950"
                                : "border-zinc-700 hover:border-zinc-500 text-transparent"
                            }`}
                          >
                            <Check size={12} className="stroke-[3]" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          ) : (
            // SINGLE PROFILE FLAG LAYOUT
            <>
              {/* Left Column: Flagged Reason */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-zinc-455 uppercase tracking-wider">Reason</h4>
                <div className="w-full bg-zinc-950/60 border border-zinc-850 rounded-2xl p-4 text-xs text-zinc-300 min-h-[140px] leading-relaxed whitespace-pre-wrap select-text font-medium shadow-inner">
                  {resolveDialogStudent.flagReason || "No reason specified."}
                </div>
              </div>

              {/* Right Column: Actions list */}
              <div className="flex flex-col gap-3 justify-center">
                <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-wider">Actions</h4>

                <button
                  type="button"
                  onClick={() => handleResolveUnflag(resolveDialogStudent.id)}
                  className="w-full py-3.5 px-4 rounded-xl border border-zinc-800 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <FlagOff size={14} />
                  <span>Unflag</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleResolveDelete(resolveDialogStudent)}
                  className="w-full py-3.5 px-4 rounded-xl bg-red-500 hover:bg-red-650 text-white font-bold text-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
