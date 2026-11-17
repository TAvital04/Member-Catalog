"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  value?: string;
  onChange?: (val: string) => void;
  options: (string | DropdownOption)[];
  placeholder?: string;
  variant?: "input" | "filter" | "minimal";
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  variant = "input",
  className = "",
  ariaLabel,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    onChange?.(val);
    setIsOpen(false);
  };

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, handleOutsideClick]);

  const triggerVariantClasses = {
    input:
      "w-full h-9 px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-black justify-between focus:ring-1 focus:ring-black",
    filter:
      "px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-black hover:bg-neutral-100",
    minimal: "px-2 py-1 bg-transparent text-xs text-neutral-700 hover:text-black",
  }[variant];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`.trim()}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
        className={`flex items-center gap-2 transition-all cursor-pointer select-none focus:outline-none ${triggerVariantClasses} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-neutral-500 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-50 left-0 mt-1 min-w-[180px] w-full max-h-60 overflow-y-auto bg-white border border-neutral-300 rounded-xl shadow-lg p-1.5 flex flex-col gap-0.5 animate-scale-in focus:outline-none"
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-black text-white font-bold"
                    : "text-neutral-800 hover:bg-neutral-100 hover:text-black"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <Check size={12} className="shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
