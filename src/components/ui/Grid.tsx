"use client";

import React, { HTMLAttributes } from "react";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 1 | 2 | 3 | 4 | 6 | 8;
  responsive?: boolean;
}

const colMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-12",
};

const gapMap = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
};

export function Grid({
  cols = 3,
  gap = 4,
  responsive = true,
  className = "",
  children,
  ...props
}: GridProps) {
  const colClass = responsive ? colMap[cols] : `grid-cols-${cols}`;

  return (
    <div className={`grid ${colClass} ${gapMap[gap]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Grid;
