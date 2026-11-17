"use client";

import React from "react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import { UserRole } from "@/app/page";
import Heading from "./Heading";
import Subheading from "./Subheading";

export interface PageShellProps {
  title: string;
  description?: string;
  role?: UserRole;
  theme?: "light" | "dark";
  toggleTheme?: () => void;
  handleRoleChange?: (role: UserRole) => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const maxSizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
};

export function PageShell({
  title,
  description,
  role,
  theme = "light",
  toggleTheme,
  handleRoleChange,
  actions,
  children,
  maxWidth = "lg",
  className = "",
}: PageShellProps) {
  return (
    <div className={`page-wrapper min-h-screen bg-white text-black font-sans ${className}`}>
      {/* Primary Top Navbar */}
      <DirectoryNavbar
        role={role}
        theme={theme}
        toggleTheme={toggleTheme}
        handleRoleChange={handleRoleChange}
      />

      {/* Standardized Header Banner */}
      <header className="border-b border-neutral-200 bg-white py-6 sm:py-8">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxSizes[maxWidth]}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <Heading variant="page">{title}</Heading>
              {description && (
                <Subheading variant="page">{description}</Subheading>
              )}
            </div>
            {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${maxSizes[maxWidth]}`}>
        {children}
      </main>
    </div>
  );
}

export default PageShell;
