"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "interactive" | "flat" | "elevated" | "subcard" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "button";
}

const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
  interactive:
    "bg-white border border-neutral-300 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black",
  flat: "bg-neutral-50 border border-neutral-200 rounded-xl",
  elevated: "bg-white border border-neutral-300 rounded-xl shadow-sm",
  subcard: "bg-neutral-100 border border-neutral-200 rounded-lg",
  bordered: "bg-white border-2 border-black rounded-xl",
};

const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-3 sm:p-3.5",
  md: "p-4 sm:p-5",
  lg: "p-6",
};

export function Card({
  variant = "flat",
  padding = "md",
  as = "div",
  children,
  className = "",
  ...props
}: CardProps) {
  const combinedClass = `${variantStyles[variant]} ${paddingStyles[padding]} ${className}`.trim();

  if (as === "button") {
    return (
      <button
        type="button"
        className={combinedClass}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  const Tag = as;
  return (
    <Tag className={combinedClass} {...props}>
      {children}
    </Tag>
  );
}

export default Card;
