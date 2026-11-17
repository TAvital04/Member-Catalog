"use client";

import React from "react";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function CardHeader({
  children,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-start justify-between gap-3 pb-3 border-b border-neutral-200/80 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
