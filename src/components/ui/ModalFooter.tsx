"use client";

import React from "react";

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "between";
}

const alignClasses: Record<NonNullable<ModalFooterProps["align"]>, string> = {
  left: "justify-start",
  right: "justify-end",
  between: "justify-between",
};

export default function ModalFooter({
  children,
  className = "",
  align = "right",
  ...props
}: ModalFooterProps) {
  return (
    <div
      className={`p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/50 flex flex-wrap items-center gap-2.5 shrink-0 ${alignClasses[align]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
