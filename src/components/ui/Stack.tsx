"use client";

import React, { HTMLAttributes } from "react";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "col" | "row";
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
}

const gapMap = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
};

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

export function Stack({
  direction = "col",
  gap = 4,
  align = "stretch",
  justify = "start",
  wrap = false,
  className = "",
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={`flex ${
        direction === "col" ? "flex-col" : "flex-row"
      } ${gapMap[gap]} ${alignMap[align]} ${justifyMap[justify]} ${
        wrap ? "flex-wrap" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Stack;
