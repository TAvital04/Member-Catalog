"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  helperText?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, helperText, error, className = "", id, checked, disabled, ...props }, ref) => {
    const inputId = id || (label ? `radio-${String(label).toLowerCase().replace(/\s+/g, "-")}` : undefined);

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
              type="radio"
              id={inputId}
              checked={checked}
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div
              className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
                checked
                  ? "border-black bg-white"
                  : "bg-white border-neutral-300 hover:border-black"
              } peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-1`}
            >
              {checked && <div className="w-2 h-2 rounded-full bg-black" />}
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

Radio.displayName = "Radio";
export default Radio;
