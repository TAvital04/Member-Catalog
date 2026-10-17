"use client";

import React from "react";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const getAvatarStyle = (nameStr: string) => {
    const styles = [
      "bg-slate-100 text-slate-800 border border-slate-200",
      "bg-amber-50 text-slate-800 border border-amber-200/60",
      "bg-sky-50 text-slate-800 border border-sky-200/60",
      "bg-emerald-50 text-slate-800 border border-emerald-200/60",
      "bg-indigo-50 text-slate-800 border border-indigo-200/60",
      "bg-slate-50 text-slate-800 border border-slate-200",
    ];
    let sum = 0;
    for (let i = 0; i < nameStr.length; i++) {
      sum += nameStr.charCodeAt(i);
    }
    return styles[sum % styles.length];
  };

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
    sm: "w-8 h-8 rounded-lg text-[10px] font-extrabold",
    md: "w-12 h-12 rounded-xl text-xs font-bold",
    lg: "w-16 h-16 rounded-2xl text-base font-black",
  };

  return (
    <div
      className={`flex items-center justify-center font-bold ${getAvatarStyle(
        name
      )} shadow-2xs shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
