"use client";

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "solid" | "neutral" | "outline" | "active";
  size?: "xs" | "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  solid: "bg-black text-white border border-black",
  neutral: "bg-neutral-100 text-black border border-neutral-300",
  outline: "bg-white text-black border border-neutral-300",
  active: "bg-black text-white border border-black shadow-2xs",
};

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
  xs: "text-[9.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
  sm: "text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider",
  md: "text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider",
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  icon,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 leading-none transition-colors select-none whitespace-nowrap shrink-0 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className="inline-flex items-center gap-1 shrink-0 whitespace-nowrap">{children}</span>
    </span>
  );
}

export default Badge;
