"use client";

import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  inputSize?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 px-2.5 text-xs rounded-md",
  md: "h-9 px-3 text-xs rounded-lg",
  lg: "h-11 px-3.5 text-sm rounded-xl",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      inputSize = "md",
      className = "",
      id,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-black select-none">
            {label}
            {props.required && <span className="text-neutral-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative w-full">
          <select
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full appearance-none bg-white text-black font-medium border border-neutral-300 pr-8 transition-all outline-none focus:border-black focus:ring-1 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed ${
              sizeClasses[inputSize]
            } ${error ? "border-black ring-1 ring-black" : ""} ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <ChevronDown size={14} />
          </div>
        </div>

        {error ? (
          <p className="text-[11px] font-semibold text-black">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
