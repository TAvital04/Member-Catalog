/**
 * Unified Card Styles & Hover Effects Design System
 *
 * Provides consistent card geometry, shadows, borders, transitions,
 * and UCF Amber hover animations across all pages (Candidates, Projects, Events, and Modals).
 */

/**
 * Standard tactile motion and shadow hover effect for all clickable cards.
 * Always includes `group` so child typography & action icons can coordinate on hover.
 */
export const CARD_HOVER_EFFECT =
  "group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300 cursor-pointer";

/**
 * Standard non-interactive base styling for white/elevated cards.
 */
export const CARD_BASE =
  "relative rounded-2xl bg-white border border-slate-200/90 shadow-2xs";

/**
 * Complete class string for full-size interactive cards (e.g. Candidates, Projects, Events).
 */
export const CARD_INTERACTIVE =
  `${CARD_BASE} ${CARD_HOVER_EFFECT}`;

/**
 * Compact / Sub-card interactive styling (e.g., Tools, Skills, Attendees in modals).
 */
export const SUB_CARD_BASE =
  "relative rounded-xl bg-white border border-slate-200/90 shadow-2xs";

export const SUB_CARD_INTERACTIVE =
  `${SUB_CARD_BASE} ${CARD_HOVER_EFFECT}`;

/**
 * Standardized interactive card title typography across ALL cards.
 * Transitions smoothly from slate-900 to UCF Amber (amber-800 in light mode, glowing amber in dark mode).
 */
export const CARD_TITLE_HOVER =
  "text-slate-900 group-hover:text-amber-800 transition-colors";

/**
 * Standardized interactive action link / arrow typography across all card footers.
 */
export const CARD_ACTION_HOVER =
  "text-slate-700 group-hover:text-amber-800 transition-colors";

/**
 * Standardized interactive card action button (e.g. "Explore Project Hub").
 */
export const CARD_BUTTON_INTERACTIVE =
  "px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-amber-50 group-hover:border-amber-300/80 group-hover:text-amber-900 dark:group-hover:text-amber-300 dark:group-hover:bg-amber-500/10 border border-slate-200 text-slate-900 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95";

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
  const base = `relative ${rounding} bg-white border shadow-2xs`;

  if (!isInteractive) {
    const border = isFlagged ? "border-red-300/80 bg-red-50/15" : "border-slate-200/90";
    return [base, border, options?.className].filter(Boolean).join(" ");
  }

  const borderHover = isFlagged
    ? "border-red-300/80 bg-red-50/15 hover:border-red-400"
    : "border-slate-200/90 hover:border-slate-300";

  const hoverMotion = "group transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer";

  return [base, borderHover, hoverMotion, options?.className].filter(Boolean).join(" ");
}
