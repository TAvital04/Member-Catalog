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
  const { role: hookRole, session, logout } = useRoleManager();
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
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white text-slate-950 shadow-xs border border-slate-200/90 font-bold transition-all cursor-pointer"
        title={
          session?.email
            ? `Signed in as ${session.email} — Click to manage session or switch role`
            : "Manage role session"
        }
      >
        {isRsoLeadership ? (
          <Shield size={13} className="text-amber-600" />
        ) : (
          <Award size={13} className="text-amber-600" />
        )}
        <span>{isRsoLeadership ? "RSO Leadership" : "Sponsor"}</span>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-white/70 transition-all cursor-pointer"
        title="Sign out and return to standard member view"
        aria-label="Sign out"
      >
        <LogOut size={13} />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 border ${
        pathname === "/login"
          ? "bg-amber-500 text-slate-950 border-amber-500"
          : "bg-slate-100/90 hover:bg-slate-200/90 text-slate-800 hover:text-slate-950 border-slate-200/90"
      }`}
      title="Sign in as RSO Leadership or Corporate Sponsor"
    >
      <LogIn size={13} className={pathname === "/login" ? "text-slate-950" : "text-amber-600"} />
      <span>Sign In</span>
    </Link>
  );

  const themeToggle = toggleTheme ? (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/90 text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs shrink-0"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark warm blue mode"}
      aria-label="Toggle color theme"
    >
      {theme === "dark" ? (
        <Sun size={14} className="text-amber-400" />
      ) : (
        <Moon size={14} className="text-slate-600" />
      )}
    </button>
  ) : null;

  return (
    <nav className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Brand & Main Links (Desktop) */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-4">
          <Link href="/" className="flex items-center group cursor-pointer shrink-0 py-0.5">
            <span className="text-base font-extrabold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
              IEEE UCF
            </span>
          </Link>

          {/* Navigation items for desktop */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-xs font-semibold border border-slate-200/80">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-white text-slate-950 font-bold shadow-xs border border-slate-200/90"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-slate-500" : "text-slate-400"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth & Theme Controls: Shown in top row on mobile */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            {authControls}
            {themeToggle}
          </div>
        </div>

        {/* Mobile / Tablet scrollable navigation links */}
        <div className="flex lg:hidden items-center gap-1 overflow-x-auto w-full pb-1 -mt-1 scrollbar-none">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-bold border border-slate-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={13} className={isActive ? "text-slate-500" : "text-slate-400"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth & Theme Controls: Shown on right side on desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {authControls}
          {themeToggle}
        </div>
      </div>
    </nav>
  );
}
