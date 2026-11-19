"use client";

/**
 * @file ProjectBackerForm.tsx — Grassroots Project Backer & Hardware Support Form
 * @description Allows individuals, alumni, parents, and community engineers to back
 * student engineering build teams with direct component grants, spare lab equipment,
 * or build-sprint fuel—without corporate branding contracts or marketing obligations.
 * Adheres strictly to the chapter zero-hover policy and monochrome minimalist aesthetic.
 */

import React, { useState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { IEEEProject } from "@/data/projects";
import CustomDropdown from "@/components/common/CustomDropdown";
import { useRoleManager, AuthSession } from "@/hooks/useRoleManager";

export interface ProjectBackerFormProps {
  project: IEEEProject;
  session?: AuthSession | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ProjectBackerForm({
  project,
  session: propSession,
  onSuccess,
  onClose,
}: ProjectBackerFormProps) {
  const roleManager = useRoleManager();
  const session = propSession !== undefined ? propSession : roleManager.session;

  const [backerName, setBackerName] = useState(() => session?.displayName || "");
  const [backerEmail, setBackerEmail] = useState(() => session?.email || "");
  const [affiliation, setAffiliation] = useState("USF Engineering Alum");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contributionType, setContributionType] = useState("Project Materials & Build Resources");
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
      const payload = {
        to: "projects@rsousf.org",
        recipientType: "admin",
        subject: `[Project Backer] ${project.title} - ${isAnonymous ? "Anonymous Backer" : backerName}`,
        senderName: isAnonymous ? `${backerName} (Anonymous Display)` : backerName,
        senderEmail: backerEmail,
        message:
          `Grassroots Project Backing received for "${project.title}"\n\n` +
          `Backer Information:\n` +
          `- Name: ${backerName} ${isAnonymous ? "(Requested Anonymous Display on public rosters)" : ""}\n` +
          `- Contact Email: ${backerEmail}\n` +
          `- Affiliation: ${affiliation}\n` +
          `- Backing Type: ${contributionType}\n` +
          (contributionValue.trim() ? `- Contribution Scope / Value: ${contributionValue}\n` : "") +
          `\nBacker Note to Student Builders:\n` +
          `${note.trim() || "No additional personal note provided."}\n\n` +
          `Note: This is a community project backer contribution (no formal corporate deliverables, logos, or marketing contracts required).`,
      };

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned error status ${res.status}`);
      }

      setSubmissionStatus("success");
      onSuccess?.();
    } catch (err: unknown) {
      console.error("Failed to submit project backing:", err);
      const msg = err instanceof Error ? err.message : "Failed to transmit backing pledge.";
      setErrorMessage(msg);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in pt-1 pb-4">
      {submissionStatus === "success" ? (
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-2xs flex flex-col items-center text-center gap-3 py-10">
          <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-300 text-black flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="font-black text-lg text-black">Project Backing Transmitted</h4>
          <p className="text-xs text-neutral-600 max-w-md leading-relaxed font-sans">
            Thank you for backing student engineering at USF! Your offer to back{" "}
            <span className="font-bold text-black">{project.title}</span> has been dispatched directly
            to our student project director and lab leads. We will reach out to coordinate component delivery or funding.
          </p>
          <div className="mt-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Status: Routed to Project Director
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setSubmissionStatus("idle");
                setNote("");
                setContributionValue("");
              }}
              className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-black text-xs font-bold cursor-pointer"
            >
              Back Another Component
            </button>
            {onClose && (
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
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Card 1: Backing Target & Scope */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Project Target & Community Backing
            </h3>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-2xs text-xs text-neutral-600 font-sans leading-relaxed">
              Backing directly supports our student engineering teams with build materials, tooling, and development resources. Unlike corporate sponsorships, <span className="font-bold text-black">there are no marketing contracts, logo requirements, or formal deliverables</span>—just direct support for student engineering.
            </div>
          </div>

          {/* Unified Backer & Contribution Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col gap-3.5">
            {/* Row 1: Backer Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="backer-name" className="text-[11px] font-bold text-neutral-700">
                  Full Name / Handle <span className="text-black font-bold">*</span>
                </label>
                <input
                  id="backer-name"
                  type="text"
                  aria-required="true"
                  value={backerName}
                  onChange={(e) => setBackerName(e.target.value)}
                  placeholder="e.g. Alex Rivera or Anonymous Supporter"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="backer-email" className="text-[11px] font-bold text-neutral-700">
                  Contact Email <span className="text-black font-bold">*</span>
                </label>
                <input
                  id="backer-email"
                  type="email"
                  aria-required="true"
                  value={backerEmail}
                  onChange={(e) => setBackerEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                />
              </div>
            </div>

            {/* Row 2: Backing Focus & Estimated Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-neutral-700">
                  Backing Focus
                </label>
                <CustomDropdown
                  value={contributionType}
                  onChange={(val) => setContributionType(val)}
                  options={[
                    { value: "Project Materials & Build Resources", label: "Project Materials & Build Resources" },
                    { value: "Equipment & Hardware Donation", label: "Equipment & Hardware Donation" },
                    { value: "Team Mentorship & Technical Advisory", label: "Team Mentorship & Technical Advisory" },
                    { value: "Sprint Fuel & Build Supplies", label: "Sprint Fuel & Build Supplies" },
                    { value: "General Project Support", label: "General Project Support" },
                  ]}
                  variant="input"
                  className="w-full"
                  aria-label="Backing Focus"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="contribution-value" className="text-[11px] font-bold text-neutral-700">
                  Estimated Value or Items (Optional)
                </label>
                <input
                  id="contribution-value"
                  type="text"
                  value={contributionValue}
                  onChange={(e) => setContributionValue(e.target.value)}
                  placeholder="e.g. Spare lab equipment, components, or build donation"
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
                    { value: "Parent / Family Member", label: "Parent / Family Supporter" },
                    { value: "Student / Peer Supporter", label: "Student / Peer Supporter" },
                    { value: "Local Tech Enthusiast / Maker", label: "Maker / Open-Hardware Enthusiast" },
                    { value: "Independent Tech Patron", label: "Independent Tech Patron" },
                  ]}
                  variant="input"
                  className="w-full"
                  aria-label="Backer Affiliation"
                />
              </div>

              <label htmlFor="anonymous-toggle" className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="anonymous-toggle"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-black rounded cursor-pointer"
                />
                <span className="text-[11px] text-neutral-700 font-sans">
                  Keep my backing anonymous on public team rosters
                </span>
              </label>
            </div>

            {/* Row 4: Note to Team */}
            <div className="flex flex-col gap-1">
              <label htmlFor="backer-note" className="text-[11px] font-bold text-neutral-700">
                Note to the Build Team (Optional)
              </label>
              <textarea
                id="backer-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Leave a word of encouragement, advice, or context about your backing..."
                className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans resize-none"
              />
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
              Routed directly to the student project director and lab leads.
            </span>
            <div className="flex items-center gap-2.5">
              {onClose && (
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
                    <span>Transmitting Backing Pledge...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Back This Project</span>
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
