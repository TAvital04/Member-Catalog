"use client";

import React from "react";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4" | "span";
}

export default function CardTitle({
  children,
  className = "",
  as: Tag = "h3",
  ...props
}: CardTitleProps) {
  return (
    <Tag
      className={`font-bold text-sm sm:text-base text-black leading-snug tracking-tight ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}
