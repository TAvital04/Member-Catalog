"use client";

/**
 * @file ShortlistToolbar.tsx
 * @description Dedicated recruiter control bar for shortlisted candidate management,
 * list filtering, CSV spreadsheet exporting, and batch candidate email outreach.
 */

import React, { useState } from "react";
import {
  BookmarkCheck,
  Download,
  Mail,
  Trash2,
  Check,
  ListFilter,
  Users,
  BookOpen,
} from "lucide-react";
import { Student } from "@/data/students";
import CustomDropdown from "@/components/common/CustomDropdown";

interface ShortlistToolbarProps {
  totalCount: number;
  availableLists: string[];
  selectedList: string;
  onSelectList: (list: string) => void;
  onExportCsv: () => void;
  onCopyEmails: () => Promise<boolean>;
  onClearShortlist: () => void;
  onBrowseAll: () => void;
  onOpenResumeBook?: () => void;
}

export default function ShortlistToolbar({
  totalCount,
  availableLists,
  selectedList,
  onSelectList,
  onExportCsv,
  onCopyEmails,
  onClearShortlist,
  onBrowseAll,
  onOpenResumeBook,
}: ShortlistToolbarProps) {
  const [copiedEmails, setCopiedEmails] = useState(false);

  const handleCopy = async () => {
    const success = await onCopyEmails();
    if (success) {
      setCopiedEmails(true);
      setTimeout(() => setCopiedEmails(false), 2000);
    }
  };

  const listOptions = [
    { value: "all", label: "All Lists" },
    ...availableLists.map((name) => ({ value: name, label: name })),
  ];

  return (
    <div className="w-full bg-white border border-neutral-300 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Shortlist stats & List Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200">
          <BookmarkCheck size={14} className="text-black stroke-[2.5]" />
          <span className="text-xs font-black text-black">
            {totalCount} {totalCount === 1 ? "Candidate" : "Candidates"} Shortlisted
          </span>
        </div>

        {availableLists.length > 0 && (
          <div className="w-44">
            <CustomDropdown
              options={listOptions}
              value={selectedList}
              onChange={onSelectList}
              placeholder="Filter by List"
            />
          </div>
        )}
      </div>

      {/* Right: Export & Batch Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={totalCount === 0}
          aria-label="Copy all shortlisted candidate email addresses"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-black text-xs font-bold hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
        >
          {copiedEmails ? (
            <>
              <Check size={13} className="text-black stroke-[2.5]" />
              <span>Emails Copied</span>
            </>
          ) : (
            <>
              <Mail size={13} className="text-neutral-600" />
              <span>Copy Emails</span>
            </>
          )}
        </button>

        {onOpenResumeBook && (
          <button
            type="button"
            onClick={onOpenResumeBook}
            disabled={totalCount === 0}
            aria-label="Export shortlisted candidates to printable Resume Book"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          >
            <BookOpen size={13} className="text-white" />
            <span>Resume Book</span>
          </button>
        )}

        <button
          type="button"
          onClick={onExportCsv}
          disabled={totalCount === 0}
          aria-label="Export shortlisted candidate data to CSV file"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-black text-xs font-bold hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
        >
          <Download size={13} />
          <span>Export CSV</span>
        </button>

        {totalCount > 0 && (
          <button
            type="button"
            onClick={onClearShortlist}
            aria-label="Clear all shortlisted candidates"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Clear List</span>
          </button>
        )}
      </div>
    </div>
  );
}
