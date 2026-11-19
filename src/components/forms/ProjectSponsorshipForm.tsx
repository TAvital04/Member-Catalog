"use client";

/**
 * @file ProjectSponsorshipForm.tsx — Project Sponsorship Pledge & Equipment Grant Form
 * @description Dedicated corporate partnership and project sponsorship pledge form.
 * Enables corporate partners, sponsors, and benefactors to propose project grants,
 * hardware equipment donations, competition chassis branding, or technical mentorship.
 * Adheres strictly to the chapter zero-hover policy and monochrome minimalist aesthetic.
 */

import React, { useState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
} from "lucide-react";
import { IEEEProject } from "@/data/projects";
import CustomDropdown from "@/components/common/CustomDropdown";
import { useRoleManager, AuthSession, UserRole } from "@/hooks/useRoleManager";

export interface ProjectSponsorshipFormProps {
  project: IEEEProject;
  role?: UserRole;
  session?: AuthSession | null;
  onSuccess?: () => void;
  onClose?: () => void;
  isStandaloneModal?: boolean;
}

export default function ProjectSponsorshipForm({
  project,
  role: propRole,
  session: propSession,
  onSuccess,
  onClose,
  isStandaloneModal = false,
}: ProjectSponsorshipFormProps) {
  const roleManager = useRoleManager();
  const role = propRole || roleManager.role;
  const session = propSession !== undefined ? propSession : roleManager.session;

  const [sponsorName, setSponsorName] = useState(() => session?.displayName || "");
  const [sponsorCompany, setSponsorCompany] = useState(() => session?.organization || "");
  const [sponsorEmail, setSponsorEmail] = useState(() => session?.email || "");
  const [sponsorshipType, setSponsorshipType] = useState("Custom Project Grant / Funding");
  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitPledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName.trim() || !sponsorEmail.trim()) {
      setErrorMessage("Sponsor full name and contact email are required.");
      setSubmissionStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus("idle");
    setErrorMessage("");

    try {
      const payload = {
        to: "sponsorship@rsousf.org",
        recipientType: "admin",
        subject: `[Project Sponsorship Pledge] ${project.title} - ${sponsorCompany || sponsorName}`,
        senderName: sponsorName,
        senderEmail: sponsorEmail,
        message:
          `Project Sponsorship Proposal received for "${project.title}"\n\n` +
          `Sponsor Details:\n` +
          `- Full Name: ${sponsorName}\n` +
          `- Company / Organization: ${sponsorCompany || "Independent / Private Sponsor"}\n` +
          `- Contact Email: ${sponsorEmail}\n` +
          `- Partnership Category: ${sponsorshipType}\n` +
          (estimatedAmount.trim() ? `- Estimated Value / Pledge: ${estimatedAmount}\n` : "") +
          `\nPartnership Proposal & Scope:\n` +
          `${message.trim() || "No additional proposal notes provided."}\n\n` +
          `Routed directly to RSO USF Project Directors and Corporate Relations Committee.`,
      };

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned error code ${res.status}`);
      }

      setSubmissionStatus("success");
      onSuccess?.();
    } catch (err: unknown) {
      console.error("Failed to submit project sponsorship proposal:", err);
      const msg = err instanceof Error ? err.message : "Failed to transmit sponsorship inquiry.";
      setErrorMessage(msg);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in pt-1 pb-4">
      {/* Success Confirmation State */}
      {submissionStatus === "success" ? (
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-2xs flex flex-col items-center text-center gap-3 py-10">
          <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-300 text-black flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="font-black text-lg text-black">Sponsorship Proposal Dispatched</h4>
          <p className="text-xs text-neutral-600 max-w-md leading-relaxed font-sans">
            Thank you for investing in student engineering at USF. Your proposal to support{" "}
            <span className="font-bold text-black">{project.title}</span> has been routed directly to our project leads and chapter leadership. A representative will connect with you shortly.
          </p>
          <div className="mt-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Status: Routed to Project Directors
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setSubmissionStatus("idle");
                setMessage("");
              }}
              className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-black text-xs font-bold cursor-pointer"
            >
              Submit Another Inquiry
            </button>
            {onClose && isStandaloneModal && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-black text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitPledge} noValidate className="flex flex-col gap-5">
          {/* Card 1: Project Target Snapshot */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Project Target & Initiative
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-300 text-black flex items-center justify-center shrink-0">
                  <FolderGit2 size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-black truncate">{project.title}</h4>
                    {project.status && (
                      <span className="bg-neutral-100 text-black border border-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                        {project.status}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-600 truncate font-sans mt-0.5">
                    {project.category} • {project.tagline || "RSO USF Student Build Initiative"}
                  </p>
                </div>
              </div>

              {project.sponsorshipInfo?.fundingGoal ? (
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Funding Target
                  </span>
                  <span className="text-xs font-bold text-black font-mono">
                    ${project.sponsorshipInfo.currentFunding?.toLocaleString() || 0} / $
                    {project.sponsorshipInfo.fundingGoal.toLocaleString()}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Card 2: Sponsor & Organization Identity */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Sponsor & Organization Identity
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="sponsor-name" className="text-[11px] font-bold text-neutral-700">
                    Your Full Name <span className="text-black font-bold">*</span>
                  </label>
                  <input
                    id="sponsor-name"
                    type="text"
                    aria-required="true"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="e.g. Dr. Jane Smith"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="sponsor-company" className="text-[11px] font-bold text-neutral-700">
                    Company / Organization
                  </label>
                  <input
                    id="sponsor-company"
                    type="text"
                    value={sponsorCompany}
                    onChange={(e) => setSponsorCompany(e.target.value)}
                    placeholder="e.g. Lockheed Martin, TI, or Independent"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="sponsor-email" className="text-[11px] font-bold text-neutral-700">
                    Work / Contact Email <span className="text-black font-bold">*</span>
                  </label>
                  <input
                    id="sponsor-email"
                    type="email"
                    aria-required="true"
                    value={sponsorEmail}
                    onChange={(e) => setSponsorEmail(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="sponsorship-type" className="text-[11px] font-bold text-neutral-700">
                    Sponsorship Focus
                  </label>
                  <CustomDropdown
                    value={sponsorshipType}
                    onChange={(val) => setSponsorshipType(val)}
                    options={[
                      { value: "Custom Project Grant / Funding", label: "Custom Project Grant / Funding" },
                      { value: "Hardware & Component Donation", label: "Hardware & Component Donation" },
                      { value: "Chassis & Competition Branding", label: "Chassis & Competition Branding" },
                      { value: "Technical Mentorship & Advisory", label: "Technical Mentorship & Advisory" },
                      { value: "Lab Equipment & PCB Fabrication Grant", label: "Lab Equipment & PCB Fabrication Grant" },
                      { value: "General Corporate Sponsorship", label: "General Corporate Sponsorship" },
                    ]}
                    variant="input"
                    className="w-full"
                    aria-label="Sponsorship Focus"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Scope, Estimated Pledge & Proposal Note */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Partnership Scope & Goals (Optional)
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="pledge-amount" className="text-[11px] font-bold text-neutral-700">
                  Estimated Funding / Equipment Value
                </label>
                <input
                  id="pledge-amount"
                  type="text"
                  value={estimatedAmount}
                  onChange={(e) => setEstimatedAmount(e.target.value)}
                  placeholder="e.g. Project grant, lab evaluation hardware, or fabrication services"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="proposal-message" className="text-[11px] font-bold text-neutral-700">
                  Collaboration Vision & Notes
                </label>
                <textarea
                  id="proposal-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your interests (e.g., logo placement on chassis, sponsoring motor drivers, student mentoring, or equipment fabrication)..."
                  className="w-full text-xs focus:outline-none resize-none font-sans bg-transparent text-black placeholder:text-neutral-400"
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-neutral-100 border border-black text-black text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-neutral-500 font-sans">
              Routed directly to RSO USF leadership and project chairs.
            </span>
            <div className="flex items-center gap-2.5">
              {onClose && isStandaloneModal && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-black font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-black text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Transmitting Proposal...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Submit Sponsorship Pledge</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
