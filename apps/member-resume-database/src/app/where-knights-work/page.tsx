"use client";

/**
 * @file page.tsx — Where Knights Work Page
 * @description Dedicated page showcasing company placements, internships, and corporate employment
 * for IEEE UCF students and alumni. Provides company distribution metrics and candidate spotlights.
 */

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Briefcase, Users, Search, Sparkles, Filter } from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import PortfolioModal from "@/components/modal/PortfolioModal";
import WhereKnightsWork from "@/components/directory/WhereKnightsWork";
import StudentCard from "@/components/directory/StudentCard";
import { useStudentData } from "@/hooks/useStudentData";
import { useThemeManager } from "@/hooks/useThemeManager";
import { Student } from "@/data/students";

function WhereKnightsWorkContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { students, isLoading } = useStudentData();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [companySearch, setCompanySearch] = useState<string>("");

  // Aggregate all unique companies from students' work experiences
  const availableCompanies = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      (s.workExperiences || []).forEach((w) => {
        if (w.name) set.add(w.name);
      });
    });
    return Array.from(set).sort();
  }, [students]);

  // Filter students who have work experience at selected company (or any work experience if none selected)
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const expList = student.workExperiences || [];
      if (expList.length === 0) return false;
      if (selectedCompanies.length === 0) return true;
      return expList.some((w) => selectedCompanies.includes(w.name));
    });
  }, [students, selectedCompanies]);

  const handleCompanyToggle = (company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]
    );
  };

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
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-zinc-955 shadow-lg">
                <Building2 size={24} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-black text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                  Where Knights Work
                </h1>
                <p className="text-xs md:text-sm text-zinc-400 mt-1 leading-relaxed max-w-2xl">
                  Explore corporate placements, internships, and industry roles secured by UCF IEEE engineering students and alumni.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center gap-4 shadow-inner">
              <div className="text-center">
                <span className="block text-lg font-black text-emerald-400 leading-none">{availableCompanies.length}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Companies</span>
              </div>
              <div className="w-px h-7 bg-zinc-800" />
              <div className="text-center">
                <span className="block text-lg font-black text-amber-400 leading-none">{filteredStudents.length}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Placed Knights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 pt-8 flex flex-col gap-6 relative z-10">
        {/* Industry Breakdown Component */}
        <WhereKnightsWork
          students={students}
          availableCompanies={availableCompanies}
          selectedCompanies={selectedCompanies}
          onCompanyToggle={handleCompanyToggle}
          onSelectStudent={(st) => setSelectedStudent(st)}
        />

        {/* Filtered Students Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-emerald-400" />
            <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">
              {selectedCompanies.length > 0
                ? `Candidates at ${selectedCompanies.join(", ")} (${filteredStudents.length})`
                : `All Candidates with Industry Experience (${filteredStudents.length})`}
            </h2>
          </div>
          {selectedCompanies.length > 0 && (
            <button
              onClick={() => setSelectedCompanies([])}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium underline"
            >
              Clear company filter
            </button>
          )}
        </div>

        {/* Candidate Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            <div className="h-48 glass-panel rounded-2xl animate-shimmer" />
            <div className="h-48 glass-panel rounded-2xl animate-shimmer" />
            <div className="h-48 glass-panel rounded-2xl animate-shimmer" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">No candidate profiles match the selected company filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={() => setSelectedStudent(student)}
                adminMode={false}
                onToggleFlag={() => {}}
              />
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

export default function WhereKnightsWorkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-955 p-8 animate-pulse" />}>
      <WhereKnightsWorkContent />
    </Suspense>
  );
}
