"use client";

import React from "react";

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

export default function ModalBody({
  children,
  className = "",
  scrollable = true,
  ...props
}: ModalBodyProps) {
  return (
    <div
      className={`p-6 flex-1 ${scrollable ? "overflow-y-auto" : "overflow-hidden"} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
