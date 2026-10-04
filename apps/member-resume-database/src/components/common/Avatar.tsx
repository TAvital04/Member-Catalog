"use client";

import React from "react";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const getAvatarGradient = (nameStr: string) => {
    const colors = [
      "from-amber-500 to-yellow-400",
      "from-purple-500 to-indigo-500",
      "from-emerald-500 to-teal-400",
      "from-pink-500 to-rose-400",
      "from-blue-500 to-sky-400",
      "from-orange-500 to-amber-500",
    ];
    let sum = 0;
    for (let i = 0; i < nameStr.length; i++) {
      sum += nameStr.charCodeAt(i);
    }
    return colors[sum % colors.length];
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
      className={`flex items-center justify-center text-zinc-950 bg-gradient-to-br ${getAvatarGradient(
        name
      )} shadow-lg shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
