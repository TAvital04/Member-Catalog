"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  Award,
  Globe,
  Briefcase,
  Mail,
  Lock,
  Sparkles,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";
import { ChapterSponsor } from "@/data/sponsors";
import CustomDropdown from "@/components/common/CustomDropdown";

export interface LeadershipSponsorFormProps {
  role: "standard" | "sponsor" | "admin";
  onClose: () => void;
  onSponsorCreated: (sponsor: ChapterSponsor) => void;
}

export default function LeadershipSponsorForm({
  role,
  onClose,
  onSponsorCreated,
}: LeadershipSponsorFormProps) {
  const [name, setName] = useState("");
  const [tier, setTier] = useState<"Platinum" | "Gold" | "Silver">("Gold");
  const [tagline, setTagline] = useState("");
  const [website, setWebsite] = useState("");
  const [careersUrl, setCareersUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [sponsorLoginPassword, setSponsorLoginPassword] = useState("ieee-sponsor-access");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/sponsors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": role,
        },
        body: JSON.stringify({
          name,
          tier,
          tagline,
          website,
          careersUrl,
          contactEmail,
          sponsorLoginPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to onboard chapter sponsor.");
      }

      onSponsorCreated(result.data);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred while saving the sponsor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-modal-overlay backdrop-blur-md cursor-pointer animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Onboard Chapter Sponsor"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden cursor-default animate-scale-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close sponsor onboarding modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/90 text-slate-500 hover:text-slate-900 transition-all shadow-xs cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/70 flex items-center gap-3.5 shrink-0 pr-12">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0">
            <Building2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700">
                <Shield size={10} />
                <span>RSO Leadership • Form 1</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              Onboard New Chapter Sponsor
            </h2>
            <p className="text-xs text-slate-500">
              Create a corporate partner profile and provision their Sponsor login credentials.
            </p>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex flex-col gap-6 flex-1">
          {/* Section 1: Core Company Identity */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Partner Identity & Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 flex flex-col gap-1.5">
                <label
                  htmlFor="sponsor-name"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                >
                  Company Name *
                </label>
                <input
                  id="sponsor-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Raytheon Technologies"
                  className="w-full h-[36px] px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-4 flex flex-col gap-1.5">
                <label
                  htmlFor="sponsor-tier"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                >
                  Partnership Tier *
                </label>
                <CustomDropdown
                  id="sponsor-tier"
                  value={tier}
                  onChange={(val) => setTier(val as "Platinum" | "Gold" | "Silver")}
                  options={[
                    { value: "Platinum", label: "Platinum Partner" },
                    { value: "Gold", label: "Gold Partner" },
                    { value: "Silver", label: "Silver Partner" },
                  ]}
                  variant="input"
                  className="w-full"
                  aria-label="Partnership Tier"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sponsor-tagline"
                className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
              >
                Short Engineering Tagline *
              </label>
              <input
                id="sponsor-tagline"
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Defense Radar, Avionics & Precision Guidance Systems"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="sponsor-website"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                >
                  Corporate Website URL *
                </label>
                <div className="relative flex items-center">
                  <Globe size={14} className="text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    id="sponsor-website"
                    type="text"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://www.rtx.com"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="sponsor-careers-url"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                >
                  Careers Portal URL *
                </label>
                <div className="relative flex items-center">
                  <Briefcase size={14} className="text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    id="sponsor-careers-url"
                    type="text"
                    required
                    value={careersUrl}
                    onChange={(e) => setCareersUrl(e.target.value)}
                    placeholder="https://careers.rtx.com"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Sponsor Login Provisioning */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col gap-3.5">
            <div className="flex items-center gap-2">
              <Award size={15} className="text-amber-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Provision Sponsor Portal Login Credentials
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Creates a linked <strong className="text-slate-700">Sponsor</strong> account in{" "}
              <code className="font-mono text-[10.5px]">portal_users</code> so this partner can sign in at{" "}
              <code className="font-mono text-[10.5px]">/login</code> to filter candidates and post jobs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="sponsor-email"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                >
                  Sponsor Login / Recruiting Email *
                </label>
                <div className="relative flex items-center">
                  <Mail size={14} className="text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    id="sponsor-email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="recruiting@rtx.com"
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="sponsor-password"
                  className="text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                >
                  Temporary Sponsor Password *
                </label>
                <div className="relative flex items-center">
                  <Lock size={14} className="text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    id="sponsor-password"
                    type="text"
                    required
                    value={sponsorLoginPassword}
                    onChange={(e) => setSponsorLoginPassword(e.target.value)}
                    placeholder="ieee-sponsor-access"
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-mono rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Onboarding Sponsor...</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Onboard Chapter Sponsor</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
