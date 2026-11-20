"use client";

/**
 * @file ShortlistTab.tsx
 * @description Dedicated recruiter tab inside PortfolioModal for managing shortlist status,
 * custom talent lists, internal evaluation notes, and recruiter tags.
 */

import React, { useState, useEffect } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Tag,
  StickyNote,
  FolderPlus,
  Check,
  Mail,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { Student } from "@/data/students";
import { ShortlistedCandidate } from "@/types/shortlist";
import CustomDropdown from "@/components/common/CustomDropdown";

interface ShortlistTabProps {
  student: Student;
  isShortlisted: boolean;
  shortlistEntry?: ShortlistedCandidate;
  availableLists: string[];
  onToggleShortlist: () => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateTags: (tags: string[]) => void;
  onUpdateListName: (listName: string) => void;
  onSwitchToContact?: () => void;
}

export default function ShortlistTab({
  student,
  isShortlisted,
  shortlistEntry,
  availableLists,
  onToggleShortlist,
  onUpdateNotes,
  onUpdateTags,
  onUpdateListName,
  onSwitchToContact,
}: ShortlistTabProps) {
  const [notesText, setNotesText] = useState(shortlistEntry?.notes || "");
  const [newTagInput, setNewTagInput] = useState("");
  const [newListInput, setNewListInput] = useState("");
  const [isAddingNewList, setIsAddingNewList] = useState(false);
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  useEffect(() => {
    setNotesText(shortlistEntry?.notes || "");
  }, [shortlistEntry?.notes]);

  const handleSaveNotes = () => {
    onUpdateNotes(notesText);
    setNotesSavedNotice(true);
    setTimeout(() => setNotesSavedNotice(false), 2000);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim();
    if (!tag) return;
    const currentTags = shortlistEntry?.tags || [];
    if (!currentTags.includes(tag)) {
      onUpdateTags([...currentTags, tag]);
    }
    setNewTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = shortlistEntry?.tags || [];
    onUpdateTags(currentTags.filter((t) => t !== tagToRemove));
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newListInput.trim();
    if (!name) return;
    onUpdateListName(name);
    setNewListInput("");
    setIsAddingNewList(false);
  };

  const listOptions = [
    { value: "General", label: "General Shortlist" },
    ...availableLists
      .filter((l) => l !== "General")
      .map((l) => ({ value: l, label: l })),
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl py-2 animate-fade-in">
      {/* Shortlist Hero Status Banner */}
      <div className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl border ${
              isShortlisted
                ? "bg-black text-white border-black"
                : "bg-neutral-100 text-neutral-500 border-neutral-200"
            }`}
          >
            {isShortlisted ? (
              <BookmarkCheck size={22} className="stroke-[2.5]" />
            ) : (
              <Bookmark size={22} />
            )}
          </div>
          <div>
            <h4 className="text-sm font-black text-black">
              {isShortlisted ? "Candidate is in Your Shortlist" : "Candidate Not Shortlisted"}
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isShortlisted
                ? `Saved to "${shortlistEntry?.listName || "General"}" on ${
                    shortlistEntry?.savedAt
                      ? new Date(shortlistEntry.savedAt).toLocaleDateString("en-US")
                      : "today"
                  }`
                : "Save this candidate to quickly filter, write private notes, and export rosters."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleShortlist}
          aria-label={isShortlisted ? "Remove from Shortlist" : "Save to Shortlist"}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 ${
            isShortlisted
              ? "bg-white border border-neutral-300 text-neutral-700 hover:text-red-600 hover:border-red-300"
              : "bg-black text-white hover:bg-neutral-800"
          }`}
        >
          {isShortlisted ? "Remove from Shortlist" : "Save to Shortlist"}
        </button>
      </div>

      {isShortlisted && (
        <>
          {/* Target List Selector */}
          <div className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                <FolderPlus size={14} className="text-neutral-500" />
                <span>Shortlist Category</span>
              </label>
              <button
                type="button"
                onClick={() => setIsAddingNewList(!isAddingNewList)}
                className="text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer"
              >
                {isAddingNewList ? "Cancel" : "+ New List"}
              </button>
            </div>

            {isAddingNewList ? (
              <form onSubmit={handleCreateList} className="flex gap-2">
                <input
                  type="text"
                  value={newListInput}
                  onChange={(e) => setNewListInput(e.target.value)}
                  placeholder="e.g. Fall 2026 Interns"
                  className="grow px-3 py-2 text-xs rounded-xl bg-neutral-50 border border-neutral-300 focus:bg-white focus:border-black focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newListInput.trim()}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Create
                </button>
              </form>
            ) : (
              <div className="w-full">
                <CustomDropdown
                  options={listOptions}
                  value={shortlistEntry?.listName || "General"}
                  onChange={(val) => onUpdateListName(val)}
                  placeholder="Select Shortlist Category"
                />
              </div>
            )}
          </div>

          {/* Recruiter Evaluation Notes */}
          <div className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label htmlFor="recruiter-notes-field" className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                <StickyNote size={14} className="text-neutral-500" />
                <span>Private Recruiter Notes</span>
              </label>
              <span className="text-[10px] text-neutral-400 font-medium">Visible only to your organization</span>
            </div>

            <textarea
              id="recruiter-notes-field"
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add interview observations, technical strengths, follow-up timelines, or team fit notes..."
              rows={4}
              className="w-full p-3 text-xs rounded-xl bg-neutral-50 border border-neutral-300 focus:bg-white focus:border-black focus:outline-none resize-none font-sans text-neutral-800"
            />

            <div className="flex items-center justify-between pt-1">
              {notesSavedNotice ? (
                <span className="text-xs font-bold text-black flex items-center gap-1">
                  <Check size={13} className="text-black stroke-[2.5]" />
                  <span>Notes Saved</span>
                </span>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer shadow-2xs"
              >
                Save Notes
              </button>
            </div>
          </div>

          {/* Recruiter Custom Tags */}
          <div className="bg-white border border-neutral-300 rounded-2xl p-5 shadow-2xs flex flex-col gap-3">
            <label className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={14} className="text-neutral-500" />
              <span>Candidate Tags</span>
            </label>

            <div className="flex flex-wrap gap-1.5 min-h-6">
              {(shortlistEntry?.tags || []).length > 0 ? (
                shortlistEntry!.tags!.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-300 text-xs font-semibold text-black"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove tag ${tag}`}
                      className="text-neutral-400 hover:text-black cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-400 italic">No custom tags added yet.</span>
              )}
            </div>

            <form onSubmit={handleAddTag} className="flex gap-2 pt-2 border-t border-neutral-200">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="Add tag (e.g. FPGA, Top Choice, Phone Screen)..."
                className="grow px-3 py-1.5 text-xs rounded-xl bg-neutral-50 border border-neutral-300 focus:bg-white focus:border-black focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newTagInput.trim()}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1"
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Quick Action to Contact */}
          {onSwitchToContact && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={onSwitchToContact}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 border border-neutral-300 text-black text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer shadow-2xs"
              >
                <Mail size={13} />
                <span>Send Candidate Inquiry</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
