"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface TooltipProps {
  content: string;
  position?: "top" | "top-wide" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "bottom" | "custom";
  groupClass?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Tooltip({
  content,
  position = "top",
  groupClass = "",
  className = "",
  style,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, isAbove: true });
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !content) return;

    const triggerEl = spanRef.current?.parentElement || spanRef.current;
    if (!triggerEl) return;

    const calculatePosition = () => {
      const rect = triggerEl.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const spaceAbove = rect.top;
      const forceBottom = position.startsWith("bottom") || spaceAbove < 100;
      const isAbove = !forceBottom;

      let top = isAbove ? rect.top - 8 : rect.bottom + 8;
      let left = rect.left + rect.width / 2;

      // Clamp left coordinate so tooltip box is perfectly centered & clamped
      const minLeft = 160;
      const maxLeft = viewportWidth - 160;
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

    triggerEl.addEventListener("mouseenter", handleMouseEnter);
    triggerEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      triggerEl.removeEventListener("mouseenter", handleMouseEnter);
      triggerEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mounted, content, position]);

  if (!content) return null;

  return (
    <>
      <span ref={spanRef} className="hidden pointer-events-none" />

      {children}

      {/* Pure CSS Hover Fallback prior to JS hydration or when unmounted */}
      {!visible && (
        <span
          className={`pointer-events-none absolute opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-all duration-200 text-zinc-100 text-xs font-medium shadow-2xl border border-zinc-700/90 rounded-xl px-3.5 py-2 z-[99999] whitespace-normal leading-relaxed bg-zinc-955/98 backdrop-blur-md max-w-xs w-max text-center font-sans ${position.startsWith("bottom") ? "top-full mt-2 left-1/2 -translate-x-1/2" : "bottom-full mb-2 left-1/2 -translate-x-1/2"} ${className} ${groupClass}`}
          style={style}
        >
          {content}
        </span>
      )}

      {/* React Portal Top-Level Front Overlay */}
      {mounted &&
        visible &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: coords.isAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)",
              ...style,
            }}
            className={`z-[999999] pointer-events-none px-3.5 py-2 rounded-xl bg-zinc-955/98 border border-zinc-700/90 text-zinc-100 text-xs font-medium shadow-2xl backdrop-blur-md max-w-xs sm:max-w-sm w-max text-center leading-relaxed font-sans animate-fade-in ${className} ${groupClass}`}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
