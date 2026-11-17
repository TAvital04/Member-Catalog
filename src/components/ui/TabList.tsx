"use client";

import React, { HTMLAttributes } from "react";

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "pills";
}

export function TabList({ variant = "line", className = "", children, ...props }: TabListProps) {
  const baseClasses =
    variant === "line"
      ? "flex items-center gap-1 border-b border-neutral-200 overflow-x-auto scrollbar-none"
      : "flex items-center gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200 overflow-x-auto scrollbar-none";

  return (
    <div role="tablist" className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default TabList;
