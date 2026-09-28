"use client";

import React from "react";
import CustomRadio from "../../common/CustomRadio";

interface AdminFiltersProps {
  adminFilterFlagged: boolean | null;
  setAdminFilterFlagged: (flagged: boolean | null) => void;
  layout: "top" | "side";
}

export default function AdminFilters({
  adminFilterFlagged,
  setAdminFilterFlagged,
  layout,
}: AdminFiltersProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {[
        { value: null, label: "All Statuses" },
        { value: true, label: "Flagged Only" },
        { value: false, label: "Clean Only" }
      ].map((opt) => (
        <label
          key={String(opt.value)}
          className="flex items-center gap-2.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors group"
        >
          <input
            type="radio"
            name={`${layout}AdminFilterFlagged`}
            checked={adminFilterFlagged === opt.value}
            onChange={() => setAdminFilterFlagged(opt.value)}
            className="sr-only"
          />
          <CustomRadio checked={adminFilterFlagged === opt.value} color="red" />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
