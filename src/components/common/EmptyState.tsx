"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  headline: string;
  subtext?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * EmptyState — Unified Reusable Empty State Display
 * Used when no matching candidates, jobs, projects, or events are found.
 */
export default function EmptyState({
  icon,
  headline,
  subtext,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`empty-state-panel ${className}`}>
      <div className="empty-state-icon-box">
        {icon || <Sparkles size={24} />}
      </div>
      <h3 className="empty-state-headline">{headline}</h3>
      {subtext && <p className="empty-state-subtext">{subtext}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-base btn-md btn-secondary-surface"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
