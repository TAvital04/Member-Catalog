/**
 * Unified Card Styles & Hover Effects Design System
 * Monochrome Two-Color (Black & White) Design System
 */

/**
 * Standard tactile motion and border highlight for all clickable cards.
 */
export const CARD_HOVER_EFFECT =
  "group transition-all duration-150 hover:border-black cursor-pointer";

/**
 * Standard non-interactive base styling for white cards.
 */
export const CARD_BASE =
  "relative rounded-xl bg-white border border-neutral-300 shadow-none";

/**
 * Complete class string for full-size interactive cards (e.g. Candidates, Projects, Events).
 */
export const CARD_INTERACTIVE =
  `${CARD_BASE} ${CARD_HOVER_EFFECT}`;

/**
 * Compact / Sub-card interactive styling (e.g., Tools, Skills, Attendees in modals).
 */
export const SUB_CARD_BASE =
  "relative rounded-lg bg-white border border-neutral-300 shadow-none";

export const SUB_CARD_INTERACTIVE =
  `${SUB_CARD_BASE} ${CARD_HOVER_EFFECT}`;

/**
 * Standardized card title typography across ALL cards. Solid black font.
 */
export const CARD_TITLE_HOVER =
  "text-black font-bold";

/**
 * Standardized action link typography across all card footers.
 */
export const CARD_ACTION_HOVER =
  "text-black font-semibold";

/**
 * Standardized interactive card action button. Solid black with white text.
 */
export const CARD_BUTTON_INTERACTIVE =
  "px-3.5 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 border border-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95";

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

  const rounding = isCompact ? "rounded-lg" : "rounded-xl";
  const base = `relative ${rounding} bg-white border shadow-none`;

  if (!isInteractive) {
    const border = isFlagged ? "border-black bg-neutral-100" : "border-neutral-300";
    return [base, border, options?.className].filter(Boolean).join(" ");
  }

  const borderHover = isFlagged
    ? "border-black bg-neutral-100 hover:border-black"
    : "border-neutral-300 hover:border-black";

  const hoverMotion = "group transition-all duration-150 cursor-pointer";

  return [base, borderHover, hoverMotion, options?.className].filter(Boolean).join(" ");
}
