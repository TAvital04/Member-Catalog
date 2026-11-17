"use client";

import React from "react";
import { Student } from "@/data/students";

interface StatusBadgeProps {
  status: Student["status"];
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-black bg-white text-black inline-block text-center leading-tight shrink-0 ${className}`}
    >
      {status}
    </span>
  );
}
