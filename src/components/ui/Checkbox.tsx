"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, className = "", id, checked, disabled, ...props }, ref) => {
    const inputId = id || (label ? `cb-${String(label).toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          htmlFor={inputId}
          className={`inline-flex items-start gap-2.5 select-none ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              checked={checked}
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div
              className={`w-4 h-4 rounded-sm border transition-all flex items-center justify-center ${
                checked
                  ? "bg-black border-black text-white"
                  : "bg-white border-neutral-300 hover:border-black"
              } ${error ? "border-black ring-1 ring-black" : ""} peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-1`}
            >
              {checked && <Check size={12} strokeWidth={3} className="text-white" />}
            </div>
          </div>

          {label && (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-black leading-tight">{label}</span>
              {helperText && <span className="text-[11px] text-neutral-500 mt-0.5">{helperText}</span>}
            </div>
          )}
        </label>
        {error && <p className="text-[11px] font-semibold text-black pl-6">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
