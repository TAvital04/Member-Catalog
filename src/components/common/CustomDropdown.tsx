"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeClass?: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: (DropdownOption | string)[];
  placeholder?: string;
  prefixLabel?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  align?: "left" | "right";
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  "aria-label"?: string;
  id?: string;
}

/**
 * Official IEEE UCF Custom Dropdown Component
 * Modern, accessible replacement for native browser `<select>` boxes.
 */
export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  prefixLabel,
  icon,
  size = "sm",
  align = "left",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  disabled = false,
  "aria-label": ariaLabel,
  id,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to DropdownOption
  const normalizedOptions: DropdownOption[] = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close on outside click
  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  // Close on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    } else if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const currIdx = normalizedOptions.findIndex((opt) => opt.value === value);
      const nextIdx = Math.min(currIdx + 1, normalizedOptions.length - 1);
      onChange(normalizedOptions[nextIdx].value);
    } else if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      const currIdx = normalizedOptions.findIndex((opt) => opt.value === value);
      const prevIdx = Math.max(currIdx - 1, 0);
      onChange(normalizedOptions[prevIdx].value);
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const sizeClasses =
    size === "sm"
      ? "text-xs px-3 py-1.5 rounded-xl gap-2 min-h-[34px]"
      : "text-xs px-3.5 py-2.5 rounded-xl gap-2.5 min-h-[40px]";

  const alignClasses = align === "right" ? "right-0" : "left-0";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden native select for automated test frameworks and accessibility */}
      <select
        tabIndex={-1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        aria-label={ariaLabel}
        id={id ? `${id}-native` : undefined}
      >
        {normalizedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Styled Interactive Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || prefixLabel}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between border border-slate-200/90 bg-white hover:bg-slate-50/80 text-slate-800 font-semibold shadow-2xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${buttonClassName}`}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1 text-left">
          {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
          {prefixLabel && (
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              {prefixLabel}
            </span>
          )}
          <span className="truncate text-slate-900 font-semibold">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${
                selectedOption.badgeClass || "bg-slate-100 text-slate-600"
              }`}
            >
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          size={13}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-slate-700" : ""
          }`}
        />
      </button>

      {/* Dropdown Popover Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={ariaLabel || prefixLabel || "Options"}
          className={`absolute top-full mt-1.5 z-50 min-w-full w-max max-w-xs sm:max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 max-h-72 overflow-y-auto animate-scale-in focus:outline-none ${alignClasses} ${menuClassName}`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-slate-100 text-slate-900 font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                }`}
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{opt.label}</span>
                    {opt.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                          opt.badgeClass || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  {opt.sublabel && (
                    <span className="text-[10.5px] text-slate-400 font-normal truncate mt-0.5">
                      {opt.sublabel}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <Check size={13} className="text-amber-600 shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
