"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  content: string;
  position?:
    | "top"
    | "top-wide"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "bottom"
    | "custom";
  groupClass?: string;
  className?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Official IEEE UCF Themed Mouse Hover Tooltip Component (`Tooltip`)
 * Replaces native browser `title="..."` attributes with a unified, theme-aware
 * popover surface (`bg-white border-slate-200 text-slate-900`) that adapts automatically
 * to Light Mode and Dark Warm Navy Mode.
 *
 * Supports two ergonomic usage patterns:
 * 1. Wrapping a trigger element: `<Tooltip content="..."><button>...</button></Tooltip>`
 * 2. Placed inside a parent container: `<button className="relative group">...<Tooltip content="..." /></button>`
 */
export default function Tooltip({
  content,
  position = "top",
  groupClass = "",
  className = "",
  wrapperClassName = "",
  style,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, isAbove: true });
  const anchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !content) return;

    const triggerEl = children
      ? anchorRef.current
      : anchorRef.current?.parentElement || anchorRef.current;
    if (!triggerEl) return;

    const calculatePosition = () => {
      const targetRect =
        children && anchorRef.current?.firstElementChild
          ? anchorRef.current.firstElementChild.getBoundingClientRect()
          : triggerEl.getBoundingClientRect();

      if (targetRect.width === 0 && targetRect.height === 0) return;

      const viewportWidth = window.innerWidth;
      const spaceAbove = targetRect.top;
      const forceBottom = position.startsWith("bottom") || spaceAbove < 80;
      const isAbove = !forceBottom;

      const top = isAbove ? targetRect.top - 8 : targetRect.bottom + 8;
      let left = targetRect.left + targetRect.width / 2;

      // Clamp horizontal position so the tooltip stays cleanly inside the viewport
      const minLeft = 140;
      const maxLeft = Math.max(minLeft, viewportWidth - 140);
      left = Math.max(minLeft, Math.min(left, maxLeft));

      setCoords({ top, left, isAbove });
    };

    const handleMouseEnter = () => {
      calculatePosition();
      setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleScrollOrResize = () => {
      setVisible(false);
    };

    triggerEl.addEventListener("mouseenter", handleMouseEnter);
    triggerEl.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      triggerEl.removeEventListener("mouseenter", handleMouseEnter);
      triggerEl.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [mounted, content, position, children]);

  if (!content) return <>{children}</>;

  const themedBubbleClasses =
    "bg-white/98 border border-slate-200/90 text-slate-900 text-xs font-semibold shadow-xl rounded-xl px-3 py-1.5 backdrop-blur-md max-w-xs sm:max-w-sm w-max text-center leading-relaxed font-sans";

  const fallbackPlacement = position.startsWith("bottom")
    ? "top-full mt-2 left-1/2 -translate-x-1/2"
    : "bottom-full mb-2 left-1/2 -translate-x-1/2";

  const portalOverlay =
    mounted &&
    visible &&
    createPortal(
      <div
        role="tooltip"
        style={{
          position: "fixed",
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          transform: coords.isAbove
            ? "translate(-50%, -100%)"
            : "translate(-50%, 0)",
          ...style,
        }}
        className={`z-[999999] pointer-events-none animate-fade-in ${themedBubbleClasses} ${className} ${groupClass}`}
      >
        {content}
      </div>,
      document.body
    );

  if (children) {
    return (
      <span
        ref={anchorRef}
        className={`relative group/tooltip inline-flex ${wrapperClassName}`}
      >
        {children}
        {!visible && (
          <span
            className={`pointer-events-none absolute opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 z-[99999] whitespace-normal ${themedBubbleClasses} ${fallbackPlacement} ${className} ${groupClass}`}
            style={style}
          >
            {content}
          </span>
        )}
        {portalOverlay}
      </span>
    );
  }

  return (
    <>
      <span ref={anchorRef} className="hidden pointer-events-none" />

      {/* Pure CSS Hover Fallback prior to JS hydration */}
      {!visible && (
        <span
          className={`pointer-events-none absolute opacity-0 group-hover/tooltip:opacity-100 group-hover:opacity-100 transition-all duration-200 z-[99999] whitespace-normal ${themedBubbleClasses} ${fallbackPlacement} ${className} ${groupClass}`}
          style={style}
        >
          {content}
        </span>
      )}

      {portalOverlay}
    </>
  );
}
