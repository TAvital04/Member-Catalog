"use client";

import React from "react";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  htmlFor,
  required = false,
  helperText,
  error,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`.trim()}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-black font-black">*</span>}
          </span>
        </label>
      )}

      {children}

      {error ? (
        <span className="text-[11px] font-medium text-black">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-neutral-500">{helperText}</span>
      ) : null}
    </div>
  );
}
