"use client";

import React from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
  id?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
}

/**
 * SearchInput — Matchy-Matchy Reusable Catalog Search Bar
 * Provides unified styling, left search icon, and 1-click clear button across all pages.
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
  id,
  ariaLabel = "Search catalog",
  autoFocus = false,
}: SearchInputProps) {
  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  return (
    <div className={`relative w-full flex items-center ${className}`.trim()}>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none search-icon-left"
        aria-hidden="true"
      />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className="w-full bg-white border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black rounded-xl pl-10 pr-9 py-2.5 text-sm text-black placeholder:text-neutral-500 outline-none transition-colors search-input-field"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-black rounded-md cursor-pointer search-clear-btn"
          aria-label="Clear search input"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
