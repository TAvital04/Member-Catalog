"use client";

import React, { HTMLAttributes } from "react";
import { X } from "lucide-react";

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "neutral" | "inverted" | "bordered";
  onClose?: () => void;
  icon?: React.ReactNode;
}

export function Banner({
  variant = "bordered",
  onClose,
  icon,
  className = "",
  children,
  ...props
}: BannerProps) {
  const variantClasses = {
    bordered: "bg-white text-black border border-neutral-300",
    neutral: "bg-neutral-100 text-black border border-neutral-200",
    inverted: "bg-black text-white border border-black",
  };

  return (
    <div
      role="alert"
      className={`p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs font-medium shadow-2xs ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        {icon && <span className="shrink-0">{icon}</span>}
        <div>{children}</div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md hover:bg-neutral-200/50 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default Banner;
