"use client";

import React from "react";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function CardFooter({
  children,
  className = "",
  ...props
}: CardFooterProps) {
  return (
    <div
      className={`pt-3 border-t border-neutral-200 flex items-center justify-between gap-2 text-xs text-neutral-600 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
