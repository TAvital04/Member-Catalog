"use client";

/**
 * @file EventBackerForm.tsx — Community Backing & Hardware Support Form for Events & Workshops
 * @description Allows individuals, alumni, parents, and community engineers to back
 * student engineering workshops, hackathons, and GBMs with direct kit supplies, refreshments,
 * or sprint fuel—without corporate branding contracts or marketing obligations.
 * Adheres strictly to the chapter zero-hover policy and monochrome minimalist aesthetic.
 */

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { IEEEEvent } from "@/data/events";
import CustomDropdown from "@/components/common/CustomDropdown";
import { useRoleManager, AuthSession } from "@/hooks/useRoleManager";
import { getEventBackingPreset } from "@/lib/eventBackingPresets";

export interface EventBackerFormProps {
  event: IEEEEvent;
  session?: AuthSession | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function EventBackerForm({
  event,
  session: propSession,
  onSuccess,
  onClose,
}: EventBackerFormProps) {
  const roleManager = useRoleManager();
  const session = propSession !== undefined ? propSession : roleManager.session;

  const preset = getEventBackingPreset(event.category);

  const [backerName, setBackerName] = useState(() => session?.displayName || "");
  const [backerEmail, setBackerEmail] = useState(() => session?.email || "");
  const [affiliation, setAffiliation] = useState("USF Engineering Alum");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contributionType, setContributionType] = useState(() => preset.options[0]?.value || "Student Event Supplies & Materials");
  const [contributionValue, setContributionValue] = useState("");
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backerName.trim() || !backerEmail.trim()) {
      setErrorMessage("Backer full name and contact email are required.");
      setSubmissionStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "sponsorship@rsousf.org",
          subject: `[Event Backer] ${event.title} - ${isAnonymous ? "Anonymous Backer" : backerName}`,
          senderName: isAnonymous ? "Anonymous Backer" : backerName,
          senderEmail: backerEmail,
          message: `Community Event Backer pledge received for "${event.title}"!

Event Category: ${event.category}
Backer Name: ${isAnonymous ? `${backerName} (Prefers Anonymous in public roster)` : backerName}
Contact Email: ${backerEmail}
Affiliation: ${affiliation}
Backing Focus: ${contributionType}
Estimated Value / Items: ${contributionValue.trim() || "Not specified (General support)"}

Additional Notes:
${note.trim() || "No additional notes provided."}

---
Dispatched via RSO USF Event Backer Portal`,
          recipientType: "admin",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit event backing pledge.");
      }

      setSubmissionStatus("success");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Failed to submit event backing pledge:", err);
      setSubmissionStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {submissionStatus === "success" ? (
        <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-300 shadow-2xs flex flex-col items-center text-center gap-3 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-white border border-neutral-300 text-black flex items-center justify-center shadow-2xs">
            <CheckCircle2 size={24} />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h4 className="text-sm font-bold text-black uppercase tracking-wider">
              Event Backing Received!
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              Thank you for supporting student engineers at <span className="font-bold text-black">{event.title}</span>. 
              Our workshop and event coordinators have received your pledge and will follow up with delivery or logistics instructions.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setSubmissionStatus("idle");
                setContributionValue("");
                setNote("");
              }}
              className="px-4 py-2 rounded-xl bg-neutral-200 text-black text-xs font-bold cursor-pointer"
            >
              Back Another Event
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Card 1: Dynamic Heading & Scope Summary */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              {preset.heading}
            </h3>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-2xs text-xs text-neutral-600 font-sans leading-relaxed">
              {preset.scopeSummary}
            </div>
          </div>

          {/* Unified Backer & Contribution Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col gap-3.5">
            {/* Row 1: Backer Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="event-backer-name" className="text-[11px] font-bold text-neutral-700">
                  Full Name / Handle <span className="text-black font-bold">*</span>
                </label>
                <input
                  id="event-backer-name"
                  type="text"
                  aria-required="true"
                  value={backerName}
                  onChange={(e) => setBackerName(e.target.value)}
                  placeholder="e.g. Alex Rivera or Anonymous Supporter"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="event-backer-email" className="text-[11px] font-bold text-neutral-700">
                  Contact Email <span className="text-black font-bold">*</span>
                </label>
                <input
                  id="event-backer-email"
                  type="email"
                  aria-required="true"
                  value={backerEmail}
                  onChange={(e) => setBackerEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                />
              </div>
            </div>

            {/* Row 2: Backing Focus & Estimated Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-neutral-700">
                  Backing Focus
                </label>
                <CustomDropdown
                  value={contributionType}
                  onChange={(val) => setContributionType(val)}
                  options={preset.options}
                  variant="input"
                  className="w-full"
                  aria-label="Backing Focus"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="event-contribution-value" className="text-[11px] font-bold text-neutral-700">
                  Estimated Value or Items (Optional)
                </label>
                <input
                  id="event-contribution-value"
                  type="text"
                  value={contributionValue}
                  onChange={(e) => setContributionValue(e.target.value)}
                  placeholder={preset.placeholder}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                />
              </div>
            </div>

            {/* Row 3: Affiliation & Anonymous Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-neutral-700">
                  Your Affiliation
                </label>
                <CustomDropdown
                  value={affiliation}
                  onChange={(val) => setAffiliation(val)}
                  options={[
                    { value: "USF Engineering Alum", label: "USF Engineering Alum" },
                    { value: "Industry Engineer / Mentor", label: "Industry Engineer / Tech Professional" },
                    { value: "Parent / Family Supporter", label: "Parent / Family Supporter" },
                    { value: "Student / Peer Supporter", label: "Student / Peer Supporter" },
                    { value: "Maker / Open-Hardware Enthusiast", label: "Maker / Open-Hardware Enthusiast" },
                    { value: "Independent Tech Patron", label: "Independent Tech Patron" },
                  ]}
                  variant="input"
                  className="w-full"
                  aria-label="Backer Affiliation"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-neutral-800">
                    Anonymous Backer
                  </span>
                  <span className="text-[10px] text-neutral-500 font-sans">
                    Keep name private in event roll
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="event-is-anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black accent-black cursor-pointer"
                  aria-label="Keep my backing anonymous"
                />
              </div>
            </div>

            {/* Row 4: Additional Notes */}
            <div className="flex flex-col gap-1">
              <label htmlFor="event-backer-note" className="text-[11px] font-bold text-neutral-700">
                Additional Notes (Optional)
              </label>
              <textarea
                id="event-backer-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any details, delivery coordination, or notes regarding your support..."
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans resize-none"
              />
            </div>

            {/* Error Message */}
            {submissionStatus === "error" && (
              <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-xs text-neutral-800 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-black" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Footer Row: Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-100">
              <span className="text-[10.5px] text-neutral-500 font-sans">
                Routed directly to RSO USF event coordinators and chapter chairs.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Transmitting Backer Pledge...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Back This Event</span>
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
