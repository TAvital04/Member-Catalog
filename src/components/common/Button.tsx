"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Button — Matchy-Matchy Catalog Action Button
 * Adheres to IEEE Gold accents, tactile active states, and dark mode compliance.
 */
export default function Button({
  variant = "secondary",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "btn-primary-amber"
      : variant === "ghost"
      ? "btn-ghost-surface"
      : "btn-secondary-surface";

  const sizeClass =
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "btn-md";

  return (
    <button
      type="button"
      disabled={disabled}
      className={`btn-base ${variantClass} ${sizeClass} ${
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
      } ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
