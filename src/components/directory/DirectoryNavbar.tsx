"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/app/page";
import { useRoleManager } from "@/hooks/useRoleManager";
import {
  FolderGit2,
  Users,
  Calendar,
  Briefcase,
  Shield,
  Award,
  Sun,
  Moon,
  Building2,
  LogIn,
  LogOut,
} from "lucide-react";

interface DirectoryNavbarProps {
  role?: UserRole;
  theme?: "light" | "dark";
  roleDropdownOpen?: boolean;
  setRoleDropdownOpen?: (open: boolean) => void;
  toggleTheme?: () => void;
  handleRoleChange?: (role: UserRole) => void;
}

export default function DirectoryNavbar({
  role: propRole,
  theme = "dark",
  toggleTheme,
  handleRoleChange,
}: DirectoryNavbarProps) {
  const pathname = usePathname();
  const { role: hookRole, logout } = useRoleManager();
  const role = propRole ?? hookRole;

  const isSponsor = role === "sponsor";
  const isRsoLeadership = role === "admin";
  const isAuthenticated = isSponsor || isRsoLeadership;

  const handleSignOut = () => {
    logout();
    handleRoleChange?.("standard");
  };

  const navLinks = [
    {
      href: "/",
      label: "Candidates",
      icon: Users,
    },
    {
      href: "/projects",
      label: "Projects",
      icon: FolderGit2,
    },
    {
      href: "/events",
      label: "Events",
      icon: Calendar,
    },
    {
      href: "/jobs",
      label: "Jobs",
      icon: Briefcase,
    },
    {
      href: "/sponsors",
      label: "Sponsors",
      icon: Building2,
    },
  ];

  const authControls = isAuthenticated ? (
    <div
      className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 text-xs font-semibold shrink-0 select-none shadow-2xs"
      role="group"
      aria-label="Account Session"
    >
      <Link
        href="/login"
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white text-black border border-neutral-300 font-bold cursor-pointer"
      >
        {isRsoLeadership ? (
          <Shield size={13} className="text-black" />
        ) : (
          <Award size={13} className="text-black" />
        )}
        <span>{isRsoLeadership ? "RSO Leadership" : "Sponsor"}</span>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-neutral-600 cursor-pointer"
        aria-label="Sign out"
      >
        <LogOut size={13} />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer shrink-0 border bg-black text-white border-black"
    >
      <LogIn size={13} className="text-white" />
      <span>Sign In</span>
    </Link>
  );

  const themeToggle = toggleTheme ? (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-lg bg-white border border-neutral-300 text-black cursor-pointer shrink-0"
      aria-label="Toggle color theme"
    >
      {theme === "dark" ? (
        <Sun size={14} className="text-black" />
      ) : (
        <Moon size={14} className="text-black" />
      )}
    </button>
  ) : null;

  return (
    <nav className="border-b border-neutral-200 bg-white sticky top-0 z-40 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-2.5 xl:gap-4">
        {/* Top Row on Mobile/Tablet & Left Group on Desktop */}
        <div className="flex items-center justify-between w-full xl:w-auto gap-4">
          <Link href="/" className="flex items-center group cursor-pointer shrink-0 py-0.5 mr-2">
            <span className="text-base font-black text-black tracking-tight transition-colors">
              IEEE UCF
            </span>
          </Link>

          {/* Navigation items for desktop (xl and up) */}
          <div className="hidden xl:flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs font-semibold border border-neutral-200">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap select-none ${
                    isActive
                      ? "bg-black text-white font-bold border border-black"
                      : "text-neutral-700 font-semibold border border-transparent"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-white" : "text-neutral-600"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile & Tablet Auth & Theme Controls: Shown in top row below xl */}
          <div className="flex xl:hidden items-center gap-1.5 shrink-0">
            {authControls}
            {themeToggle}
          </div>
        </div>

        {/* Mobile / Tablet navigation links: Dedicated second row below xl so items never collide or get cut off */}
        <div className="flex xl:hidden items-center flex-wrap gap-1 w-full pt-0.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap shrink-0 cursor-pointer select-none ${
                  isActive
                    ? "bg-black text-white font-bold border border-black"
                    : "text-neutral-700 font-semibold border border-transparent"
                }`}
              >
                <Icon size={13} className={isActive ? "text-white" : "text-neutral-600"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth & Theme Controls: Shown on right side at xl and up */}
        <div className="hidden xl:flex items-center gap-2 shrink-0">
          {authControls}
          {themeToggle}
        </div>
      </div>
    </nav>
  );
}
