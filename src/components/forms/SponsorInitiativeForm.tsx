"use client";

/**
 * @file SponsorInitiativeForm.tsx — Form 5: Request Chapter Initiative Form
 * @description Allows corporate partners and sponsors to submit an initiative proposal
 * as an email request to RSO USF Leadership to start a conversation regarding
 * technical workshops, build projects, lab grants, equipment donations, or student mentorship.
 */

import React, { useState } from "react";
import { X, Loader2, AlertCircle, Mail, CheckCircle2, ExternalLink } from "lucide-react";
import { ChapterSponsor } from "@/data/sponsors";

export interface SponsorInitiativeFormProps {
  sponsor: ChapterSponsor;
  role: "standard" | "sponsor" | "admin" | "student";
  onClose: () => void;
  onInitiativeRequested?: (title: string) => void;
  defaultEmail?: string;
}

export default function SponsorInitiativeForm({
  sponsor,
  role,
  onClose,
  onInitiativeRequested,
  defaultEmail,
}: SponsorInitiativeFormProps) {
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState(
    defaultEmail || sponsor.contactEmail || ""
  );
  const [title, setTitle] = useState("");
  const [proposal, setProposal] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    title: string;
    mailtoUrl: string;
    requesterEmail: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!requesterEmail.trim() || !requesterEmail.includes("@")) {
      setErrorMessage("Please enter a valid contact email address.");
      return;
    }

    if (!title.trim()) {
      setErrorMessage("Please enter a title or focus for your proposed initiative.");
      return;
    }

    if (!proposal.trim() || proposal.trim().length < 15) {
      setErrorMessage("Please describe what your team would like to sponsor or collaborate on (min. 15 characters).");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/sponsors/${sponsor.id}/request-initiative`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": role,
        },
        body: JSON.stringify({
          sponsorName: sponsor.name,
          requesterName: requesterName.trim() || `${sponsor.name} Recruiting Team`,
          requesterEmail: requesterEmail.trim(),
          title: title.trim(),
          category: "Chapter Sponsorship Initiative",
          proposal: proposal.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit initiative request.");
      }

      setSubmittedData({
        title: title.trim(),
        mailtoUrl: result.mailtoUrl,
        requesterEmail: requesterEmail.trim(),
      });

      if (onInitiativeRequested) {
        onInitiativeRequested(title.trim());
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred while submitting your initiative request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sponsor-initiative-request-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col max-h-[92vh] overflow-hidden animate-scale-in"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-white shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-neutral-100 border border-neutral-300 text-[10px] font-bold text-black uppercase tracking-wider mb-1">
              <span>Sponsorship Proposal</span>
            </div>
            <h2 id="sponsor-initiative-request-title" className="text-lg font-black text-slate-900 tracking-tight">
              Request Chapter Initiative
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit an initiative proposal to start a conversation with RSO USF Leadership on behalf of <strong className="text-slate-900">{sponsor.name}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Submitted Confirmation State */}
        {submittedData ? (
          <div className="p-6 flex flex-col items-center text-center gap-4 my-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-black">
              <CheckCircle2 size={24} />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-base font-bold text-slate-900">Initiative Request Sent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your proposal for <strong className="text-black font-bold">"{submittedData.title}"</strong> has been dispatched to RSO USF Leadership at <span className="font-mono text-black font-semibold">leadership@rsousf.org</span>.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Our executive board will follow up with your team at <strong className="text-black">{submittedData.requesterEmail}</strong> to discuss scheduling, lab access, and collaboration details.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 w-full justify-center">
              <a
                href={submittedData.mailtoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-900 transition-all cursor-pointer"
              >
                <Mail size={14} />
                <span>Open in Email Client</span>
                <ExternalLink size={12} className="text-slate-400" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer transition-all shadow-2xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form noValidate onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto grow">
            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Read-only Company Context */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Partner Organization:</span>
              <strong className="text-slate-900 font-bold">{sponsor.name}</strong>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Contact Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Your Name / Role <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="e.g., Alex Mercer, University Relations"
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-black shadow-inner"
                />
              </div>

              {/* Contact Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Contact Email <span className="text-black">*</span>
                </label>
                <input
                  type="email"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  placeholder="recruiter@company.com"
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-black shadow-inner"
                />
              </div>
            </div>

            {/* Initiative Focus / Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Initiative Focus / Title <span className="text-black">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Autonomous Systems Lab Grant or Radar DSP Workshop Series"
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-black shadow-inner"
              />
            </div>

            {/* Conversation Proposal Details */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">
                Proposed Collaboration & Discussion Topics <span className="text-black">*</span>
              </label>
              <textarea
                rows={4}
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                placeholder="Share what your team would like to sponsor or explore with RSO USF Leadership (e.g., funding a build team, donating hardware kits, hosting a technical workshop, or organizing a student networking session)..."
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-black shadow-inner resize-none leading-relaxed"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>Min. 15 characters</span>
                <span>{proposal.length}/400 chars</span>
              </div>
            </div>

            {/* Educational Context Note */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              Submitting this request notifies the RSO USF Executive Board at <strong className="text-black font-semibold">leadership@rsousf.org</strong> and prepares an email thread so both teams can connect directly to schedule a conversation.
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-black text-white text-xs font-bold cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-white" />
                    <span>Sending Request...</span>
                  </>
                ) : (
                  <>
                    <Mail size={13} />
                    <span>Send Initiative Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
