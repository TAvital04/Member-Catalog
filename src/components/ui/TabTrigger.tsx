"use client";

import React, { ButtonHTMLAttributes } from "react";
import { useTabs } from "./Tabs";

export interface TabTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  icon?: React.ReactNode;
}

export function TabTrigger({
  value,
  icon,
  children,
  className = "",
  onClick,
  ...props
}: TabTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveTab(value);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={handleClick}
      className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none ${
        isActive
          ? "text-black border-b-2 border-black -mb-px"
          : "text-neutral-500 hover:text-black border-b-2 border-transparent"
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

export default TabTrigger;
