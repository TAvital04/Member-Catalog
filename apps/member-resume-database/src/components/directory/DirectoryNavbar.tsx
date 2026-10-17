"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/app/page";
import { FolderGit2, Users } from "lucide-react";

interface DirectoryNavbarProps {
  role?: UserRole;
  theme?: "light" | "dark";
  roleDropdownOpen?: boolean;
  setRoleDropdownOpen?: (open: boolean) => void;
  toggleTheme?: () => void;
  handleRoleChange?: (role: UserRole) => void;
}

export default function DirectoryNavbar({}: DirectoryNavbarProps) {
  const pathname = usePathname();

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
  ];

  return (
    <nav className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Brand & Main Links */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-4">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-800 text-xs shadow-2xs group-hover:scale-105 transition-transform">
              UCF
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors block leading-tight">
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
      </div>
    </nav>
  );
}
