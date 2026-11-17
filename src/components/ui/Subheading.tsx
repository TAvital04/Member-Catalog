"use client";

import React from "react";

export interface SubheadingProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "page" | "section" | "card" | "modal" | "meta";
  as?: "p" | "span" | "div";
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<NonNullable<SubheadingProps["variant"]>, string> = {
  page: "text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl",
  section: "text-xs text-neutral-600 leading-normal",
  modal: "text-xs text-neutral-600 leading-relaxed",
  card: "text-[11px] sm:text-xs text-neutral-600 leading-snug",
  meta: "text-[10px] sm:text-[11px] text-neutral-500 font-medium leading-none",
};

export function Subheading({
  variant = "page",
  as: Tag = "p",
  children,
  className = "",
  ...props
}: SubheadingProps) {
  return (
    <Tag className={`${variantStyles[variant]} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}

export default Subheading;
