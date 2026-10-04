"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/app/page";
import Tooltip from "../common/Tooltip";
import { Shield, Sun, Moon, FolderGit2, Users, Briefcase, ShieldCheck, GraduationCap, ChevronDown } from "lucide-react";

interface DirectoryNavbarProps {
  role: UserRole;
  theme: "light" | "dark";
  roleDropdownOpen: boolean;
  setRoleDropdownOpen: (open: boolean) => void;
  toggleTheme: () => void;
  handleRoleChange: (role: UserRole) => void;
}

export default function DirectoryNavbar({
  role,
  theme,
  roleDropdownOpen,
  setRoleDropdownOpen,
  toggleTheme,
  handleRoleChange,
}: DirectoryNavbarProps) {
  const pathname = usePathname();

  const directorySubLinks = [
    {
      href: "/",
      label: "Main Candidate Directory",
      sublabel: "Browse & filter member resumes",
      icon: Users,
      color: "text-amber-400",
    },
    {
      href: "/where-knights-work",
      label: "Where Knights Work",
      sublabel: "Industry placements & corporate analytics",
      icon: Briefcase,
      color: "text-emerald-400",
    },
    {
      href: "/staff",
      label: "Officers & Staff",
      sublabel: "Executive board & committee leads",
      icon: ShieldCheck,
      color: "text-purple-400",
    },
    {
      href: "/alumni",
      label: "Alumni Showcase",
      sublabel: "IEEE UCF alumni & engineering graduates",
      icon: GraduationCap,
      color: "text-yellow-400",
    },
  ];

  const isDirectoryActive = ["/", "/where-knights-work", "/staff", "/alumni"].includes(pathname);
  const isProjectsActive = pathname === "/projects";

  return (
    <nav className="border-b border-zinc-900 bg-zinc-955/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center font-black text-zinc-950 shadow-lg shadow-amber-500/15 group-hover:scale-105 transition-transform">
            UCF
          </div>
          <div>
            <h1 className="text-base font-black text-zinc-50 tracking-tight group-hover:text-amber-400 transition-colors">IEEE UCF</h1>
            <p className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider -mt-0.5">Resume Database</p>
          </div>
        </Link>

        {/* Navigation Hub Links */}
        <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800/80 p-1 rounded-xl text-xs font-bold">
          {/* Hoverable Directory Dropdown Menu */}
          <div className="relative group/dir">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                isDirectoryActive
                  ? "bg-zinc-800 text-zinc-100 font-extrabold shadow-sm border border-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              <Users size={14} className="text-amber-400" />
              <span>Directory</span>
              <ChevronDown size={12} className="text-zinc-500 group-hover/dir:rotate-180 transition-transform" />
            </Link>

            {/* Dropdown Menu Container (Hover Triggered) */}
            <div className="hidden group-hover/dir:flex absolute left-0 top-full pt-1.5 w-64 z-50 animate-fade-in">
              <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl p-2 shadow-2xl flex flex-col gap-1">
                <div className="px-2.5 py-1 text-[9px] font-bold text-zinc-500 uppercase tracking-wider select-none border-b border-zinc-900 mb-1">
                  Directory Views
                </div>

                {directorySubLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-zinc-850 text-zinc-100 font-bold border border-zinc-750"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                      }`}
                    >
                      <Icon size={16} className={`${item.color} shrink-0 mt-0.5`} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold leading-tight">{item.label}</span>
                        <span className="text-[10px] text-zinc-550 leading-tight mt-0.5 truncate">{item.sublabel}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Standalone Projects Hub Link */}
          <Link
            href="/projects"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              isProjectsActive
                ? "bg-zinc-800 text-zinc-100 font-extrabold shadow-sm border border-zinc-700/60"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
            }`}
          >
            <FolderGit2 size={14} className="text-cyan-400" />
            <span>Projects Hub</span>
          </Link>
        </div>
      </div>

      {/* Role & Theme Controls */}
      <div className="flex items-center gap-4">
        {/* Custom Styled Active Role Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:bg-zinc-850 hover:border-zinc-700 transition-all cursor-pointer text-xs font-bold shadow-sm select-none"
          >
            <Shield
              size={14}
              className={
                role === "admin"
                  ? "text-red-400 animate-pulse"
                  : role === "sponsor"
                  ? "text-amber-500"
                  : "text-zinc-500"
              }
            />
            <span className="capitalize">{role} Role</span>
            <span className="text-[9px] text-zinc-550">▼</span>
          </button>

          {roleDropdownOpen && (
            <>
              {/* Click outside backdrop to close */}
              <div className="fixed inset-0 z-45 cursor-default" onClick={() => setRoleDropdownOpen(false)} />

              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl z-50 animate-scale-in flex flex-col gap-1">
                <div className="px-2.5 py-1.5 text-[9px] font-bold text-zinc-550 uppercase tracking-wider select-none border-b border-zinc-900 mb-1">
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
                      ? "bg-amber-500/10 text-amber-400 font-bold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <div className="flex flex-col">
                    <span className="font-bold">Standard</span>
                    <span className="text-[9px] text-zinc-550 font-normal mt-0.5">Read-only candidate view</span>
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
                      ? "bg-amber-500/10 text-amber-400 font-bold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <div className="flex flex-col">
                    <span className="font-bold">Sponsor</span>
                    <span className="text-[9px] text-zinc-550 font-normal mt-0.5">Filters & flagging active</span>
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
                      ? "bg-red-500/10 text-red-400 font-bold"
                      : "text-zinc-400 hover:text-red-400/80 hover:bg-zinc-900/60"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <div className="flex flex-col">
                    <span className="font-bold">Admin</span>
                    <span className="text-[9px] text-zinc-550 font-normal mt-0.5">Full operational CRUD tools</span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          type="button"
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-850 hover:border-zinc-700 transition-all cursor-pointer flex items-center justify-center relative group"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          <Tooltip content={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"} />
        </button>
      </div>
    </nav>
  );
}
