"use client";

import React from "react";

export interface CountBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count: number | string;
  variant?: "neutral" | "solid" | "muted";
  className?: string;
}

const variantStyles: Record<NonNullable<CountBadgeProps["variant"]>, string> = {
  neutral: "bg-neutral-100 text-black border border-neutral-300 font-bold",
  solid: "bg-black text-white border border-black font-bold",
  muted: "bg-neutral-50 text-neutral-600 border border-neutral-200 font-semibold",
};

export function CountBadge({
  count,
  variant = "neutral",
  className = "",
  ...props
}: CountBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center text-[10px] px-2 py-0.5 rounded-full select-none leading-none ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {count}
    </span>
  );
}

export default CountBadge;
