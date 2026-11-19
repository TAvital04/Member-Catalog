"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  CheckCircle2,
  Send,
  Building2,
  Award,
  Sparkles,
  Calendar,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { IEEEEvent } from "@/data/events";
import { CARD_INTERACTIVE } from "@/lib/cardStyles";
import CustomDropdown from "@/components/common/CustomDropdown";
import Tooltip from "@/components/common/Tooltip";

interface EventSponsorTabProps {
  event: IEEEEvent;
}

export default function EventSponsorTab({ event }: EventSponsorTabProps) {
  const isDone = Boolean(
    event.active === false ||
    (event as any).status === "Completed" ||
    (event as any).status === "Past" ||
    (event.endTime && new Date(event.endTime).getTime() < Date.now()) ||
    (event.startTime && new Date(event.startTime).getTime() < Date.now())
  );

  // Sponsorship inquiry form state
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorCompany, setSponsorCompany] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [sponsorTier, setSponsorTier] = useState<string>("Workshop Co-Host");
  const [sponsorMessage, setSponsorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName || !sponsorEmail) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "sponsorship@rsousf.org",
          subject: `[Event Sponsorship Inquiry] ${event.title} - ${sponsorCompany || sponsorName}`,
          senderName: sponsorName,
          senderEmail: sponsorEmail,
          message: `Event Sponsorship Inquiry received for "${event.title}"!
Sponsor: ${sponsorName}
Organization / Company: ${sponsorCompany || "Individual / Independent Sponsor"}
Contact Email: ${sponsorEmail}
Desired Tier / Package: ${sponsorTier}

Note / Message:
${sponsorMessage || "Interested in learning more about corporate workshop sponsorship opportunities."}`,
          recipientType: "admin",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit sponsorship inquiry.");
      }

      setSubmitStatus("success");
      setSponsorName("");
      setSponsorCompany("");
      setSponsorEmail("");
      setSponsorMessage("");
    } catch (err: any) {
      console.error("Failed to submit event sponsorship inquiry:", err);
      setSubmitStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const EVENT_SPONSOR_BENEFITS = [
    {
      title: "Technical Workshop Co-Hosting",
      description: "Introduce your engineering team, demo hardware or tools, and guide students through hands-on labs.",
      tag: "Branding & Direct Engagement",
    },
    {
      title: "Student Resume Book",
      description: "Gain direct access to attendee portfolio profiles, GitHub repositories, and resumes.",
      tag: "Recruitment Pipeline",
    },
    {
      title: "Keynote Tech Presentation Slot",
      description: "Dedicated 15-minute technical presentation spotlighting your company's real-world engineering challenges.",
      tag: "Thought Leadership",
    },
    {
      title: "Lab Equipment & Swag Distribution",
      description: "Distribute branded dev boards, lab kits, stickers, and corporate collateral directly to participants.",
      tag: "Campus Visibility",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-1 pb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal min-w-0">
          <span>{isDone ? "Event Sponsorship Overview (Concluded)" : "Sponsor This Workshop & Event"}</span>
        </div>
        {isDone && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-300">
            Concluded
          </span>
        )}
      </div>

      {/* When Concluded: Display Concluded Notice Card First */}
      {isDone && (
        <div className="p-5 md:p-6 rounded-2xl bg-neutral-50 border border-neutral-300 shadow-2xs flex flex-col gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-neutral-300 text-black flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-200 text-black border border-neutral-300">
                  Event Concluded
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Sponsorship Closed</span>
              </div>
              <h4 className="text-sm font-bold text-black mt-1.5">
                {event.title} Has Concluded
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-sans">
                This workshop and technical session has concluded. Direct co-hosting proposals, catering sponsorships, and equipment donations are no longer being accepted for this event.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-black">Interested in Sponsoring Student Projects or Workshops?</span>
              <span className="text-[11px] text-neutral-500 font-sans">
                Explore our active student engineering build teams or connect with chapter leadership to co-host upcoming technical workshops.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/projects"
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Explore Active Projects</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/sponsors"
                className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-black text-xs font-bold cursor-pointer"
              >
                <span>Partner Initiatives</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Overview */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <span>{isDone ? `About Sponsoring ${event.title}` : `Why Sponsor ${event.title}?`}</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-sans">
          Sponsoring this technical chapter session puts your organization directly in front of active,
          hands-on USF computer engineering, electrical engineering, and computer science students.
          Equip students with lab tooling, share industry best practices, and recruit high-caliber talent.
        </p>
      </div>

      {/* Event Sponsorship Benefits Grid */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          <span>{isDone ? "Recognized Partner Benefits" : "Sponsorship Opportunities & Partner Benefits"}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EVENT_SPONSOR_BENEFITS.map((benefit, idx) => (
            <div
              key={idx}
              className={`${CARD_INTERACTIVE} p-4 flex flex-col justify-between gap-2.5`}
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-lg bg-neutral-100 text-black border border-neutral-300 shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-slate-900 leading-snug">
                    {benefit.title}
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{benefit.tag}</span>
                <span className="text-black font-semibold">Included</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* If Active: Direct Event Sponsorship Inquiry Form */}
      {!isDone && (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              <span>Connect With Our Corporate Relations Team</span>
            </h4>
            <p className="text-xs text-slate-500">
              Submit your inquiry to co-host, provide lab materials, or sponsor catering for this event.
            </p>
          </div>

          {submitStatus === "success" && (
            <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-300 text-black text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-black shrink-0" />
              <span>
                Thank you! Your event sponsorship inquiry has been routed to the RSO USF corporate relations committee. We will reach out shortly.
              </span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmitInquiry} noValidate className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  aria-required="true"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Organization / Company</label>
                <input
                  type="text"
                  value={sponsorCompany}
                  onChange={(e) => setSponsorCompany(e.target.value)}
                  placeholder="e.g. Lockheed Martin, TI, or Independent"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Work Email <span className="text-black font-bold">*</span>
                </label>
                <input
                  type="text"
                  inputMode="email"
                  aria-required="true"
                  value={sponsorEmail}
                  onChange={(e) => setSponsorEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-slate-700">Sponsorship Interest</label>
                <CustomDropdown
                  value={sponsorTier}
                  onChange={(val) => setSponsorTier(val)}
                  options={[
                    { value: "Workshop Co-Host", label: "Workshop Co-Host & Mentorship" },
                    { value: "Lab Equipment & Materials Sponsor", label: "Lab Equipment & Materials Sponsor" },
                    { value: "Catering & Food Sponsor", label: "Catering & Food Sponsor" },
                    { value: "Semester Corporate Partner", label: "Semester Corporate Partner" },
                  ]}
                  variant="input"
                  className="w-full"
                  aria-label="Sponsorship Interest"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700">Message / Goals (Optional)</label>
              <textarea
                rows={2}
                value={sponsorMessage}
                onChange={(e) => setSponsorMessage(e.target.value)}
                placeholder="Tell us what technologies or roles you are looking to spotlight..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-black transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto self-end px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <Send size={13} />
              <span>{isSubmitting ? "Submitting Inquiry..." : "Submit Event Sponsorship Inquiry"}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
