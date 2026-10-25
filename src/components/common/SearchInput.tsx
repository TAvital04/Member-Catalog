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
    <div className={`search-input-wrapper ${className}`}>
      <Search size={16} className="search-icon-left" aria-hidden="true" />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className="search-input-field"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="search-clear-btn"
          aria-label="Clear search input"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
