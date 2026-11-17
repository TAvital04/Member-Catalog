"use client";

import React from "react";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: "page" | "section" | "card" | "modal" | "tile" | "sub";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p";
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<NonNullable<HeadingProps["variant"]>, string> = {
  page: "text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight",
  section: "text-lg sm:text-xl font-black text-black tracking-tight leading-snug",
  modal: "text-xl sm:text-2xl font-black text-black tracking-tight leading-tight",
  card: "text-sm sm:text-base font-bold text-black leading-snug",
  tile: "text-xs font-bold text-black uppercase tracking-wider",
  sub: "text-xs font-bold text-neutral-600 uppercase tracking-wider",
};

const defaultTagForVariant: Record<NonNullable<HeadingProps["variant"]>, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  page: "h1",
  section: "h2",
  modal: "h2",
  card: "h3",
  tile: "h4",
  sub: "h5",
};

export default function Heading({
  level,
  variant,
  as,
  children,
  className = "",
  ...props
}: HeadingProps) {
  // Infer variant from level if variant not specified
  const resolvedVariant = variant || (level === 1 ? "page" : level === 2 ? "section" : level === 3 ? "card" : "tile");
  const Tag = as || (level ? (`h${level}` as const) : defaultTagForVariant[resolvedVariant]);

  return (
    <Tag className={`${variantStyles[resolvedVariant]} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
