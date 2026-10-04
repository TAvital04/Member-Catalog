"use client";

/**
 * @file page.tsx — IEEE UCF Alumni Showcase Page
 * @description Dedicated showcase for IEEE UCF engineering alumni. Displays degree credentials,
 * corporate placement history, and career trajectories of graduated members.
 */

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Building2, Briefcase, Award, Sparkles, ChevronRight, ExternalLink } from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import PortfolioModal from "@/components/modal/PortfolioModal";
import Avatar from "@/components/common/Avatar";
import { useStudentData } from "@/hooks/useStudentData";
import { useThemeManager } from "@/hooks/useThemeManager";
import { Student } from "@/data/students";

function AlumniPageContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { students, isLoading } = useStudentData();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Determine alumni candidates: status is Employed or grad year <= 2025
  const alumniStudents = useMemo(() => {
    return students.filter((student) => {
      if (student.status === "Employed") return true;
      const gradMatch = student.gradDate.match(/\d{4}/);
      if (gradMatch) {
        const year = parseInt(gradMatch[0], 10);
        if (year <= 2025) return true;
      }
      return false;
    });
  }, [students]);

  const filteredAlumni = useMemo(() => {
    if (!searchQuery.trim()) return alumniStudents;
    const q = searchQuery.toLowerCase();
    return alumniStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(q) ||
        student.major.toLowerCase().includes(q) ||
        (student.workExperiences || []).some((w) => w.name.toLowerCase().includes(q) || w.title.toLowerCase().includes(q))
    );
  }, [alumniStudents, searchQuery]);

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
              <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 text-zinc-955 shadow-lg">
                <GraduationCap size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-black text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                  IEEE UCF Alumni Showcase
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 mt-1 leading-relaxed max-w-2xl">
                  Celebrating the professional achievements and career paths of graduated UCF IEEE engineering members.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-3 shadow-inner">
              <div className="text-center">
                <span className="block text-lg font-black text-yellow-400 leading-none">{alumniStudents.length}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Featured Alumni</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 pt-8 flex flex-col gap-6 relative z-10">
        {/* Alumni Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            <div className="h-48 glass-panel rounded-2xl animate-shimmer" />
            <div className="h-48 glass-panel rounded-2xl animate-shimmer" />
            <div className="h-48 glass-panel rounded-2xl animate-shimmer" />
          </div>
        ) : filteredAlumni.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">No alumni records found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAlumni.map((student) => {
              const currentWork = (student.workExperiences || [])[0];
              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="p-5 rounded-2xl glass-panel border border-zinc-800 hover:border-yellow-500/40 transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer group shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-start gap-3.5">
                    <Avatar name={student.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <GraduationCap size={10} />
                          Alumnus • {student.gradDate}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-zinc-100 group-hover:text-yellow-300 transition-colors mt-1.5 truncate">
                        {student.name}
                      </h3>
                      <p className="text-xs text-zinc-400 truncate">{student.major}</p>
                    </div>
                  </div>

                  {currentWork && (
                    <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-300 font-semibold truncate">
                        <Building2 size={13} className="text-amber-400 shrink-0" />
                        <span className="truncate">{currentWork.name}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 truncate pl-4">
                        {currentWork.title}
                      </p>
                    </div>
                  )}

                  {student.bio && (
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {student.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
                    <span className="text-zinc-500 font-medium">Click to view full career profile</span>
                    <ChevronRight size={14} className="text-yellow-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
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

export default function AlumniPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-955 p-8 animate-pulse" />}>
      <AlumniPageContent />
    </Suspense>
  );
}
