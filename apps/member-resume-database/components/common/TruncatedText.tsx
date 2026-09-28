"use client";

import React from "react";
import Tooltip from "./Tooltip";

interface TruncatedTextProps {
  text: string;
  maxLength: number;
  className?: string;
  align?: "center" | "left" | "right";
  placement?: "top" | "bottom";
  as?: keyof React.JSX.IntrinsicElements;
}

export default function TruncatedText({
  text,
  maxLength,
  className = "",
  align = "left",
  placement = "top",
  as: Component = "span",
}: TruncatedTextProps) {
  if (!text) return null;
  const isTruncated = text.length > maxLength;
  const displayText = isTruncated ? text.substring(0, maxLength).trim() + "..." : text;

  if (!isTruncated) {
    return <Component className={className}>{text}</Component>;
  }

  const alignmentClasses =
    align === "left"
      ? "left-0 translate-x-0"
      : align === "right"
      ? "right-0 translate-x-0"
      : "left-1/2 -translate-x-1/2";

  const placementClasses =
    placement === "bottom"
      ? "top-full mt-2.5"
      : "bottom-full mb-2.5";

  return (
    <Component className={`relative group/tooltip inline-flex items-center max-w-full cursor-help ${className}`}>
      <span className="truncate block max-w-full">{displayText}</span>
      <Tooltip
        content={text}
        position="custom"
        groupClass="group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-all duration-200"
        className={`bg-zinc-950/95 border border-zinc-700/80 text-zinc-100 text-[11px] px-3.5 py-2 rounded-xl shadow-2xl z-[100] leading-relaxed font-sans font-medium text-left whitespace-normal max-w-[280px] sm:max-w-[360px] w-max backdrop-blur-md pointer-events-none ${alignmentClasses} ${placementClasses}`}
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
        } as React.CSSProperties}
      />
    </Component>
  );
}
