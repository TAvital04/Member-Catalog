"use client";

import React from "react";
import { Card } from "./Card";

export interface CatalogCardProps {
  // Top Header elements
  avatar?: React.ReactNode;
  badge?: React.ReactNode;
  badgeRight?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;

  // Body content
  description?: string | null;
  emptyDescription?: string;

  // Footer metadata
  footerIcon?: React.ReactNode;
  footerText: React.ReactNode;
  footerRight?: React.ReactNode;

  // Interaction & Accessibility
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  isSelected?: boolean;
}

/**
 * CatalogCard — Unified Canonical Card Architecture for All Catalog Collections
 * Enforces uniform geometry, flat typography, 2-line clamped descriptions,
 * and quiet single-line metadata footers across Candidates, Projects, Events, Jobs, and Sponsors.
 */
export function CatalogCard({
  avatar,
  badge,
  badgeRight,
  title,
  subtitle,
  description,
  emptyDescription = "No description provided.",
  footerIcon,
  footerText,
  footerRight,
  onClick,
  ariaLabel,
  className = "",
  isSelected = false,
}: CatalogCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      as="div"
      role="button"
      tabIndex={0}
      variant="interactive"
      padding="none"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      className={`relative p-4 sm:p-5 flex flex-col justify-between h-[195px] sm:h-[220px] w-full text-left cursor-pointer group select-none ${
        isSelected ? "ring-2 ring-black border-black" : ""
      } ${className}`.trim()}
    >
      {/* Top & Body Section */}
      <div className="flex flex-col gap-2.5 min-w-0">
        {/* Top Header: Badge Row OR Avatar + Title/Subtitle */}
        {badge || (!avatar && badgeRight) ? (
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center justify-between gap-2 min-w-0">
              {badge || <div />}
              {badgeRight}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-black leading-tight truncate">
                {title}
              </h3>
              {subtitle && (
                <div className="text-[11px] sm:text-xs text-neutral-600 font-medium leading-none mt-1 truncate">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {avatar}
            <div className="min-w-0 grow flex flex-col">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-black leading-tight truncate">
                  {title}
                </h3>
                {badgeRight}
              </div>
              {subtitle && (
                <div className="text-[11px] sm:text-xs text-neutral-600 font-medium leading-none mt-1 truncate">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Short 2-Line Body Description */}
        {description ? (
          <p className="text-xs text-neutral-600 line-clamp-2 sm:line-clamp-3 leading-relaxed font-sans">
            {description}
          </p>
        ) : (
          <p className="text-xs text-neutral-400 italic font-sans">
            {emptyDescription}
          </p>
        )}
      </div>

      {/* Standard Bottom Footer */}
      <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-neutral-200 w-full text-neutral-500 text-[11px] sm:text-xs font-medium">
        <div className="flex items-center gap-1.5 truncate min-w-0">
          {footerIcon && <span className="shrink-0">{footerIcon}</span>}
          <span className="truncate">{footerText}</span>
        </div>
        {footerRight && <div className="shrink-0">{footerRight}</div>}
      </div>
    </Card>
  );
}

export default CatalogCard;
