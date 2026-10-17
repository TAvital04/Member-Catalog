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
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Seeking Full-time":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Employed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <span
      className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block text-center leading-tight shrink-0 shadow-2xs ${getStatusColor(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}
