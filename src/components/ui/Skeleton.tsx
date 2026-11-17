"use client";

import React, { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "h-3.5 w-full rounded-sm",
    rectangular: "h-20 w-full rounded-xl",
    circular: "w-10 h-10 rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-neutral-200 ${variantClasses[variant]} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

export default Skeleton;
