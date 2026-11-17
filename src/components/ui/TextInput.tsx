"use client";

import React from "react";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export default function TextInput({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className = "",
  id,
  required,
  ...props
}: TextInputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider"
        >
          {label} {required && <span className="text-black font-black">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3 text-neutral-400 pointer-events-none shrink-0">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          required={required}
          className={`w-full text-xs sm:text-sm rounded-xl bg-neutral-50 border border-neutral-300 text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all ${
            leftIcon ? "pl-9" : "pl-3.5"
          } ${rightIcon ? "pr-9" : "pr-3.5"} py-2 sm:py-2.5 ${
            error ? "border-black ring-1 ring-black" : ""
          } ${className}`.trim()}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3 text-neutral-400 shrink-0">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <span className="text-[11px] font-medium text-black">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-neutral-500">{helperText}</span>
      ) : null}
    </div>
  );
}
