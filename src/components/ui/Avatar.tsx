"use client";

import React, { HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  src?: string;
  shape?: "circle" | "rounded";
}

const sizeClasses = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl font-black",
};

export function Avatar({
  name,
  size = "md",
  src,
  shape = "rounded",
  className = "",
  ...props
}: AvatarProps) {
  const getInitials = (str: string) => {
    const parts = str.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "—";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const roundedClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  return (
    <div
      className={`inline-flex items-center justify-center bg-neutral-100 text-black border border-neutral-300 font-bold select-none shrink-0 ${
        sizeClasses[size]
      } ${roundedClass} ${className}`}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className={`w-full h-full object-cover ${roundedClass}`}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}

export default Avatar;
