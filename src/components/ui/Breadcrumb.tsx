"use client";

import React, { HTMLAttributes } from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: string;
}

export function Breadcrumb({ items, separator = "/", className = "", ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs ${className}`} {...props}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-neutral-500 hover:text-black transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-bold text-black" : "text-neutral-500"}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="text-neutral-400 select-none" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
