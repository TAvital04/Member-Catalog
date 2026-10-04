"use client";

import React from "react";
import { Student } from "../../data/students";

interface StatusBadgeProps {
  status: Student["status"];
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const getStatusColor = (statusStr: Student["status"]) => {
    switch (statusStr) {
      case "Seeking Internship":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Seeking Full-time":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Employed":
        return "bg-zinc-800 text-zinc-400 border-zinc-700/50";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700/50";
    }
  };

  return (
    <span
      className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-xl border inline-block text-center leading-tight shrink-0 ${getStatusColor(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}
