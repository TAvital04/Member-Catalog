"use client";

import React from "react";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

export function TextArea({
  label,
  helperText,
  error,
  className = "",
  id,
  required,
  rows = 3,
  ...props
}: TextAreaProps) {
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

      <textarea
        id={inputId}
        required={required}
        rows={rows}
        className={`w-full text-xs sm:text-sm p-3 rounded-xl bg-neutral-50 border border-neutral-300 text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none ${
          error ? "border-black ring-1 ring-black" : ""
        } ${className}`.trim()}
        {...props}
      />

      {error ? (
        <span className="text-[11px] font-medium text-black">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-neutral-500">{helperText}</span>
      ) : null}
    </div>
  );
}

export default TextArea;
