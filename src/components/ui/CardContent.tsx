"use client";

import React from "react";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function CardContent({
  children,
  className = "",
  ...props
}: CardContentProps) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
