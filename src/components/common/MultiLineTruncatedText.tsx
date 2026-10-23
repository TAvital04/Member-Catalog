"use client";

import React from "react";
import Tooltip from "./Tooltip";

interface MultiLineTruncatedTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export default function MultiLineTruncatedText({
  text,
  maxLines = 2,
  className = "",
}: MultiLineTruncatedTextProps) {
  if (!text) return null;

  const clampClass =
    maxLines === 1
      ? "line-clamp-1"
      : maxLines === 2
      ? "line-clamp-2"
      : maxLines === 3
      ? "line-clamp-3"
      : "line-clamp-4";

  return (
    <div className={`relative group/tooltip max-w-full cursor-help ${className}`}>
      <p className={`text-xs text-zinc-400 leading-relaxed ${clampClass}`}>
        {text}
      </p>
      <Tooltip
        content={text}
        position="custom"
        groupClass="group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-all duration-200"
        className="bottom-full left-0 mb-2 bg-zinc-950/95 border border-zinc-700/80 text-zinc-100 text-[11px] px-4 py-3 rounded-xl shadow-2xl z-[100] leading-relaxed font-sans font-medium text-left whitespace-normal max-w-[320px] sm:max-w-[380px] w-max backdrop-blur-md pointer-events-none"
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
        } as React.CSSProperties}
      />
    </div>
  );
}
