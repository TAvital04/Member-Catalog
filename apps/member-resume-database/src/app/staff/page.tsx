"use client";

/**
 * @file page.tsx — IEEE UCF Officers & Staff Directory
 * @description Dedicated directory view for IEEE UCF student officers, committee chairs,
 * and project leads. Displays leadership responsibilities, chapter contributions, and student portfolios.
 */

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Award, Sparkles, Users, Crown, ChevronRight } from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import PortfolioModal from "@/components/modal/PortfolioModal";
import StudentCard from "@/components/directory/StudentCard";
import Avatar from "@/components/common/Avatar";
import { useStudentData } from "@/hooks/useStudentData";
import { useThemeManager } from "@/hooks/useThemeManager";
import { Student, getIeeeLeadershipRole } from "@/data/students";

function StaffPageContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { students, isLoading } = useStudentData();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [roleSearch, setRoleSearch] = useState<string>("");

  // Extract all students holding an IEEE leadership role
  const ieeeLeaders = useMemo(() => {
    return students
      .map((student) => ({
        student,
        roleTitle: getIeeeLeadershipRole(student),
      }))
      .filter((entry): entry is { student: Student; roleTitle: string } => Boolean(entry.roleTitle));
  }, [students]);

  const filteredLeaders = useMemo(() => {
    if (!roleSearch.trim()) return ieeeLeaders;
    const q = roleSearch.toLowerCase();
    return ieeeLeaders.filter(
      (entry) =>
        entry.student.name.toLowerCase().includes(q) ||
        entry.roleTitle.toLowerCase().includes(q) ||
        entry.student.major.toLowerCase().includes(q)
    );
  }, [ieeeLeaders, roleSearch]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-955 text-zinc-200 relative pb-16 overflow-x-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="circuit-overlay"></div>
      </div>

      {/* Primary Header Navbar */}
      <DirectoryNavbar
        role="standard"
        theme={theme}
        roleDropdownOpen={false}
        setRoleDropdownOpen={() => {}}
        toggleTheme={toggleTheme}
        handleRoleChange={() => {}}
      />

      {/* Hero Header Banner */}
      <div className="w-full bg-zinc-900/80 border-b border-zinc-800 py-10 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold mb-3 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Member Catalog Directory</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-zinc-100 shadow-lg">
                <ShieldCheck size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-black text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                  IEEE UCF Officers & Staff
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 mt-1 leading-relaxed max-w-2xl">
                  Meet the executive board, committee chairs, SIG leads, and mentors dedicated to technical development at UCF.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3 shadow-inner">
              <div className="text-center">
                <span className="block text-lg font-black text-purple-400 leading-none">{ieeeLeaders.length}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Officers & Leads</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 pt-8 flex flex-col gap-6 relative z-10">
        {/* Officers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            <div className="h-48 glass-panel rounded-2xl animate-shimmer" />
            <div className="h-48 glass-panel rounded-2xl animate-shimmer" />
            <div className="h-48 glass-panel rounded-2xl animate-shimmer" />
          </div>
        ) : filteredLeaders.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">No officer profiles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLeaders.map(({ student, roleTitle }) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="p-5 rounded-2xl glass-panel border border-zinc-800 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer group shadow-xl relative overflow-hidden"
              >
                <div className="flex items-start gap-3.5">
                  <Avatar name={student.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Crown size={10} />
                        {roleTitle}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-zinc-100 group-hover:text-purple-300 transition-colors mt-1.5 truncate">
                      {student.name}
                    </h3>
                    <p className="text-xs text-zinc-400 truncate">{student.major}</p>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Grad: {student.gradDate}</p>
                  </div>
                </div>

                {student.bio && (
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {student.bio}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
                  <span className="text-zinc-500 font-medium">Click to view full portfolio</span>
                  <ChevronRight size={14} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Portfolio Detail Modal */}
      {selectedStudent && (
        <PortfolioModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onToggleFlag={() => {}}
          adminMode={false}
          role="standard"
        />
      )}
    </div>
  );
}

export default function StaffPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-955 p-8 animate-pulse" />}>
      <StaffPageContent />
    </Suspense>
  );
}
