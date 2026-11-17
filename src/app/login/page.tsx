"use client";

/**
 * @file page.tsx — IEEE UCF Portal Login Page (/login)
 * @description Role-based authentication portal supporting two authorized account types:
 * 1. RSO Leadership (Chapter Officers, Project Leads, Event Coordinators)
 * 2. Corporate Sponsor (Official Partners & Technical Recruiters)
 */

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Award,
  Mail,
  Lock,
  Building2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  LogOut,
  FolderGit2,
  Calendar,
  Briefcase,
  Users,
  Sparkles,
} from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import Tooltip from "@/components/common/Tooltip";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useRoleManager, AuthAccountType } from "@/hooks/useRoleManager";

function LoginPageContent() {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeManager();
  const { role, session, login, logout, handleRoleChange, isAuthenticated } = useRoleManager();

  const [selectedRole, setSelectedRole] = useState<AuthAccountType>(
    session?.accountType || "rso_leadership"
  );
  const [email, setEmail] = useState(
    session?.email || "leadership@ieeeucf.org"
  );
  const [organization, setOrganization] = useState(
    session?.organization || "IEEE UCF Student Chapter"
  );
  const [password, setPassword] = useState("ieee-ucf-leadership");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectRoleCard = (accountType: AuthAccountType) => {
    setSelectedRole(accountType);
    setErrorMessage(null);
    if (accountType === "rso_leadership") {
      setEmail("leadership@ieeeucf.org");
      setOrganization("IEEE UCF Student Chapter");
      setPassword("ieee-ucf-leadership");
    } else {
      setEmail("recruiting@lockheedmartin.com");
      setOrganization("Lockheed Martin");
      setPassword("ieee-sponsor-access");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please fill out both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType: selectedRole,
          email,
          password,
          organization,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to sign in with the provided credentials.");
      }

      login(result.data);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err?.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <DirectoryNavbar
        role={role}
        theme={theme}
        toggleTheme={toggleTheme}
        handleRoleChange={handleRoleChange}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 sm:py-14 flex flex-col gap-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 text-[11px] font-bold uppercase tracking-wider self-center">
            <span>IEEE UCF Portal Authentication</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sign In to IEEE UCF Member Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Select your portal role below to authenticate as{" "}
            <strong className="text-slate-900 font-bold">RSO Leadership</strong> or a{" "}
            <strong className="text-slate-900 font-bold">Corporate Sponsor</strong>.
          </p>
        </div>

        {/* Active Session Banner (when already signed in) */}
        {isAuthenticated && session && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Active Session:{" "}
                    {session.accountType === "rso_leadership" ? "RSO Leadership" : "Corporate Sponsor"}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
                    {session.organization}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Signed in as <strong className="text-slate-800">{session.email}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/"
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5"
              >
                <span>Go to Directory</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-200 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Two-Column Layout: Role Selection + Credentials Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Role Selection Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              1. Choose Your Account Role
            </span>

            {/* Role Card 1: RSO Leadership */}
            <button
              type="button"
              onClick={() => handleSelectRoleCard("rso_leadership")}
              aria-pressed={selectedRole === "rso_leadership"}
              className={`w-full text-left p-5 rounded-2xl border cursor-pointer flex flex-col gap-3 ${
                selectedRole === "rso_leadership"
                  ? "bg-white border-black ring-2 ring-black/10 shadow-sm"
                  : "bg-white border-neutral-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-black text-black">RSO Leadership</h2>
                  <span className="text-[11px] text-neutral-600 font-medium">
                    Executive Board, Project Leads & Directors
                  </span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedRole === "rso_leadership"
                      ? "border-black bg-black"
                      : "border-neutral-300"
                  }`}
                >
                  {selectedRole === "rso_leadership" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed">
                Manage chapter engineering initiatives, publish hardware build projects and technical workshops, and maintain the student directory.
              </p>

              <div className="pt-2 border-t border-neutral-200 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-300 text-[10.5px] font-semibold text-black">
                  <FolderGit2 size={11} className="text-black" />
                  <span>Create Projects</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-300 text-[10.5px] font-semibold text-black">
                  <Calendar size={11} className="text-black" />
                  <span>Create Events</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-300 text-[10.5px] font-semibold text-black">
                  <Users size={11} className="text-black" />
                  <span>Directory Admin</span>
                </span>
              </div>
            </button>

            {/* Role Card 2: Corporate Sponsor */}
            <button
              type="button"
              onClick={() => handleSelectRoleCard("sponsor")}
              aria-pressed={selectedRole === "sponsor"}
              className={`w-full text-left p-5 rounded-2xl border cursor-pointer flex flex-col gap-3 ${
                selectedRole === "sponsor"
                  ? "bg-white border-black ring-2 ring-black/10 shadow-sm"
                  : "bg-white border-neutral-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-black text-black">Sponsor</h2>
                  <span className="text-[11px] text-neutral-600 font-medium">
                    Corporate Partners & University Recruiters
                  </span>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedRole === "sponsor"
                      ? "border-black bg-black"
                      : "border-neutral-300"
                  }`}
                >
                  {selectedRole === "sponsor" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed">
                Publish internship and full-time engineering job postings, filter student portfolios by technical skills and graduation date, and review applicants.
              </p>

              <div className="pt-2 border-t border-neutral-200 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-300 text-[10.5px] font-semibold text-black">
                  <Briefcase size={11} className="text-black" />
                  <span>Create Job Postings</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-300 text-[10.5px] font-semibold text-black">
                  <Users size={11} className="text-black" />
                  <span>Candidate Skill Filtering</span>
                </span>
              </div>
            </button>
          </div>

          {/* Right Column: Login Credentials Form */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              2. Enter {selectedRole === "rso_leadership" ? "RSO Leadership" : "Sponsor"} Credentials
            </span>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-5"
            >
              {/* Role Header Inside Form */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedRole === "rso_leadership"
                      ? "RSO Leadership Sign In"
                      : "Corporate Sponsor Sign In"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedRole === "rso_leadership"
                      ? "Authenticate with your IEEE UCF officer credentials"
                      : "Authenticate with your partner organization account"}
                  </p>
                </div>
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-email"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                >
                  {selectedRole === "rso_leadership" ? "Officer Email" : "Corporate Email"}
                </label>
                <div className="relative flex items-center">
                  <Mail size={15} className="text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="login-email"
                    type="text"
                    inputMode="email"
                    aria-required="true"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRole === "rso_leadership"
                        ? "leadership@ieeeucf.org"
                        : "recruiting@company.com"
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 border border-neutral-300 text-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Organization / Chapter Role Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-org"
                  className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider"
                >
                  {selectedRole === "rso_leadership" ? "Chapter Division / Board" : "Partner Company Name"}
                </label>
                <div className="relative flex items-center">
                  <Building2 size={15} className="text-neutral-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="login-org"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder={
                      selectedRole === "rso_leadership"
                        ? "IEEE UCF Student Chapter"
                        : "Lockheed Martin / Texas Instruments"
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 border border-neutral-300 text-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-password"
                  className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider"
                >
                  Access Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={15} className="text-neutral-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    aria-required="true"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 border border-neutral-300 text-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 p-1 text-neutral-400 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-black text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white font-black text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>
                  {isSubmitting
                    ? "Signing In..."
                    : selectedRole === "rso_leadership"
                    ? "Sign In as RSO Leadership"
                    : "Sign In as Corporate Sponsor"}
                </span>
              </button>

              {/* Demo Helper Footer */}
              <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-neutral-600">
                <span>
                  Pre-filled with demo{" "}
                  <strong className="text-black">
                    {selectedRole === "rso_leadership" ? "RSO Leadership" : "Sponsor"}
                  </strong>{" "}
                  credentials for testing.
                </span>
                <Link
                  href="/"
                  className="text-black hover:underline font-bold underline-offset-2"
                >
                  Continue as Guest Member
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading IEEE UCF Login Portal...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
