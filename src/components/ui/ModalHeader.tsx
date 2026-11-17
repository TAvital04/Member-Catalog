"use client";

import React from "react";

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function ModalHeader({
  children,
  className = "",
  ...props
}: ModalHeaderProps) {
  return (
    <div
      className={`p-6 border-b border-neutral-200 bg-neutral-50/60 pr-14 shrink-0 flex flex-col gap-1 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
