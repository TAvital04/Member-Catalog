"use client";

import React from "react";

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

const alignClasses: Record<NonNullable<DropdownMenuProps["align"]>, string> = {
  left: "left-0",
  right: "right-0",
  center: "left-1/2 -translate-x-1/2",
};

export function DropdownMenu({
  children,
  align = "left",
  className = "",
  ...props
}: DropdownMenuProps) {
  return (
    <div
      className={`absolute z-50 mt-1 min-w-[180px] bg-white border border-neutral-300 rounded-xl shadow-lg p-1.5 flex flex-col gap-0.5 animate-scale-in ${alignClasses[align]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export default DropdownMenu;
