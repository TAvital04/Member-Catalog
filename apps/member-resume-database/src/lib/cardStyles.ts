/**
 * Unified Card Styles & Hover Effects Design System
 *
 * Provides consistent card geometry, shadows, borders, transitions,
 * and hover animations across all pages (Candidates, Projects, Events, and Modals).
 */

/**
 * The standard interactive hover effect for all clickable cards across pages.
 * Features a tactile 2px lift (-translate-y-0.5), deeper shadow (hover:shadow-md),
 * darkened border (hover:border-slate-300), and snappy 200ms transition.
 */
export const CARD_HOVER_EFFECT =
  "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300 cursor-pointer";

/**
 * Standard non-interactive base styling for white cards.
 */
export const CARD_BASE =
  "rounded-2xl bg-white border border-slate-200/90 shadow-2xs";

/**
 * Complete class string for full-size interactive cards (e.g. Candidates, Projects, Events).
 */
export const CARD_INTERACTIVE =
  `${CARD_BASE} ${CARD_HOVER_EFFECT}`;

/**
 * Compact / Sub-card interactive styling (e.g., Tools, Skills, Attendees in modals).
 */
export const SUB_CARD_BASE =
  "rounded-xl bg-white border border-slate-200/90 shadow-2xs";

export const SUB_CARD_INTERACTIVE =
  `${SUB_CARD_BASE} ${CARD_HOVER_EFFECT}`;

/**
 * Helper to compute card classes with conditional state support (e.g., flagged cards).
 */
export function getCardClasses(options?: {
  flagged?: boolean;
  isInteractive?: boolean;
  variant?: "standard" | "compact";
  className?: string;
}): string {
  const isInteractive = options?.isInteractive ?? true;
  const isFlagged = options?.flagged ?? false;
  const isCompact = options?.variant === "compact";

  const rounding = isCompact ? "rounded-xl" : "rounded-2xl";
  const base = `${rounding} bg-white border shadow-2xs`;

  if (!isInteractive) {
    const border = isFlagged ? "border-red-300/80 bg-red-50/15" : "border-slate-200/90";
    return [base, border, options?.className].filter(Boolean).join(" ");
  }

  const borderHover = isFlagged
    ? "border-red-300/80 bg-red-50/15 hover:border-red-400"
    : "border-slate-200/90 hover:border-slate-300";

  const hoverMotion = "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer";

  return [base, borderHover, hoverMotion, options?.className].filter(Boolean).join(" ");
}
