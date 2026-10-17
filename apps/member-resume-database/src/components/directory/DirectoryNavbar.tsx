"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/app/page";
import { Shield, FolderGit2, Users, Briefcase, ShieldCheck, GraduationCap, TrendingUp, ChevronDown } from "lucide-react";

interface DirectoryNavbarProps {
  role: UserRole;
  theme?: "light" | "dark";
  roleDropdownOpen: boolean;
  setRoleDropdownOpen: (open: boolean) => void;
  toggleTheme?: () => void;
  handleRoleChange: (role: UserRole) => void;
}

export default function DirectoryNavbar({
  role,
  roleDropdownOpen,
  setRoleDropdownOpen,
  handleRoleChange,
}: DirectoryNavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/",
      label: "Candidates",
      icon: Users,
    },
    {
      href: "/where-knights-work",
      label: "Where Knights Work",
      icon: Briefcase,
    },
    {
      href: "/staff",
      label: "Officers & Staff",
      icon: ShieldCheck,
    },
    {
      href: "/alumni",
      label: "Alumni",
      icon: GraduationCap,
    },
    {
      href: "/projects",
      label: "Projects",
      icon: FolderGit2,
    },
    {
      href: "/sponsor-roi",
      label: "Sponsor ROI",
      icon: TrendingUp,
    },
  ];

  return (
    <nav className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Brand & Main Links */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-4">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xs shadow-xs group-hover:scale-105 transition-transform">
              UCF
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors block leading-tight">
                IEEE UCF
              </span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                Resume Database
              </span>
            </div>
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
                      ? "bg-white text-slate-950 font-bold shadow-xs border border-slate-200/90 text-amber-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-amber-600" : "text-slate-400"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
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
                    ? "bg-amber-50 text-amber-700 font-bold border border-amber-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={13} className={isActive ? "text-amber-600" : "text-slate-400"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Access Level Selector */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer text-xs font-semibold shadow-2xs select-none"
            >
              <Shield
                size={14}
                className={
                  role === "admin"
                    ? "text-red-500"
                    : role === "sponsor"
                    ? "text-amber-600"
                    : "text-slate-400"
                }
              />
              <span className="capitalize">{role} Access</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40 cursor-default" onClick={() => setRoleDropdownOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 flex flex-col gap-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none border-b border-slate-100 mb-1">
                    Select Access Level
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange("standard");
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-all cursor-pointer font-medium ${
                      role === "standard"
                        ? "bg-amber-50 text-amber-800 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <div className="flex flex-col">
                      <span className="font-bold">Standard</span>
                      <span className="text-[10px] text-slate-500 font-normal">Candidate browsing mode</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange("sponsor");
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-all cursor-pointer font-medium ${
                      role === "sponsor"
                        ? "bg-amber-50 text-amber-800 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <div className="flex flex-col">
                      <span className="font-bold">Sponsor</span>
                      <span className="text-[10px] text-slate-500 font-normal">Advanced filtering & sorting</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleRoleChange("admin");
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-all cursor-pointer font-medium ${
                      role === "admin"
                        ? "bg-red-50 text-red-700 font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <div className="flex flex-col">
                      <span className="font-bold">Admin</span>
                      <span className="text-[10px] text-slate-500 font-normal">Full moderation & list view</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
