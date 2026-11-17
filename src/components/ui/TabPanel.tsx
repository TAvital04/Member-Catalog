"use client";

import React, { HTMLAttributes } from "react";
import { useTabs } from "./Tabs";

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabPanel({ value, children, className = "", ...props }: TabPanelProps) {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={`w-full pt-4 outline-none animate-fade-in ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default TabPanel;
