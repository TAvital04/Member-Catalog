"use client";

import React from "react";

interface AvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const getInitials = (nameStr: string) => {
    if (!nameStr) return "";
    const cleanName = nameStr.trim();
    const parts = cleanName.split(/\s+/);
    const initials = parts
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .toUpperCase();
    return initials.substring(0, 2);
  };

  const sizeClasses = {
    xs: "w-6 h-6 rounded-full text-[9px] font-bold",
    sm: "w-8 h-8 rounded-md text-[10px] font-bold",
    md: "w-11 h-11 rounded-lg text-xs font-bold",
    lg: "w-14 h-14 rounded-xl text-base font-black",
  };

  return (
    <div
      className={`flex items-center justify-center font-bold bg-neutral-100 text-black border border-neutral-300 shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
