"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-black hover:bg-neutral-800 text-white border border-black shadow-xs",
  secondary: "bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 shadow-2xs",
  outline: "bg-white hover:bg-neutral-100 text-black border border-neutral-300 hover:border-black shadow-2xs",
  ghost: "bg-transparent hover:bg-neutral-100 text-black border border-transparent",
  danger: "bg-white hover:bg-neutral-100 text-black border border-black hover:bg-black hover:text-white",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2.5 py-1 text-xs rounded-lg gap-1.5",
  md: "px-3.5 py-2 text-xs sm:text-sm rounded-xl gap-2",
  lg: "px-5 py-2.5 text-sm font-bold rounded-xl gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-bold transition-all duration-150 cursor-pointer active:scale-98 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={14} className="animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
