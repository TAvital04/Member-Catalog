"use client";

import React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  ariaLabel: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  rounded?: "default" | "full";
  className?: string;
}

const variantStyles: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  primary: "bg-black hover:bg-neutral-800 text-white border border-black",
  secondary: "bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300",
  outline: "bg-white hover:bg-neutral-100 text-black border border-neutral-300 hover:border-black",
  ghost: "bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-black border border-transparent",
};

const sizeStyles: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "p-1.5 text-xs",
  md: "p-2 text-sm",
  lg: "p-2.5 text-base",
};

export default function IconButton({
  children,
  ariaLabel,
  variant = "secondary",
  size = "md",
  rounded = "default",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black disabled:opacity-50 disabled:cursor-not-allowed ${
        rounded === "full" ? "rounded-full" : "rounded-xl"
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
