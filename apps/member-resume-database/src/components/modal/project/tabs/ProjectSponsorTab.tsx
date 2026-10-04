"use client";

import React, { useState } from "react";
import { IEEEProject } from "@/data/projects";
import { CheckCircle2, ShieldCheck, HeartHandshake, Sparkles, Send, Building2, User, Mail, MessageSquare, Award } from "lucide-react";

interface ProjectSponsorTabProps {
  project: IEEEProject;
}

export default function ProjectSponsorTab({ project }: ProjectSponsorTabProps) {
  const sponsorship = project.sponsorshipInfo;

  // Sponsorship inquiry form state
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorCompany, setSponsorCompany] = useState("");
  const [sponsorEmail, setSponsorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmitPledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName || !sponsorEmail) return;

    setIsSubmitting(true);
    setSubmissionStatus("idle");

    try {
      const payload = {
        to: "ta616249@ucf.edu",
        recipientType: "admin",
        subject: `[Project Sponsorship Inquiry] ${project.title} - ${sponsorCompany || sponsorName}`,
        senderName: sponsorName,
        senderEmail: sponsorEmail,
        message: `Project Sponsorship Inquiry received for "${project.title}"!
Sponsor: ${sponsorName}
Organization / Company: ${sponsorCompany || "Individual Sponsor"}
Contact Email: ${sponsorEmail}
Message / Partnership Interests:
${message || "No additional notes provided."}`,
      };

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmissionStatus("success");
      } else {
        setSubmissionStatus("error");
      }
    } catch (err) {
      console.error("Failed to submit sponsorship inquiry:", err);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pt-1 pb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-1 leading-normal min-w-0">
          <HeartHandshake size={15} className="text-amber-400 shrink-0" />
          <span className="hidden sm:inline">Sponsorship Opportunities & Partner Benefits</span>
          <span className="sm:hidden">Sponsor Benefits</span>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
          <Sparkles size={15} className="text-amber-400" />
          <span>Why Partner With This Project?</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          {sponsorship?.overview ||
            "Sponsoring this IEEE UCF student initiative directly accelerates hands-on engineering development, hardware fabrication, and technical competition participation."}
        </p>
      </div>

      {/* Sponsor Benefits Grid */}
      {sponsorship?.benefits && sponsorship.benefits.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award size={14} className="text-amber-400" />
            Possible Benefits For Your Organization
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sponsorship.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                  benefit.highlight
                    ? "bg-zinc-900/80 border-amber-500/30 shadow-md"
                    : "bg-zinc-900/50 border-zinc-800"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                    <CheckCircle2 size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-zinc-100 leading-snug">
                      {benefit.title}
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>

                {benefit.category && (
                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>{benefit.category}</span>
                    {benefit.highlight && <span className="text-amber-400 font-sans font-bold">Featured Perk</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Direct Sponsorship Inquiry Form */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div>
            <h4 className="text-sm font-black text-zinc-100 flex items-center gap-2">
              <Send size={14} className="text-amber-400" />
              Inquire to Sponsor This Project
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Connect directly with our student directors and IEEE chapter leadership to discuss custom sponsorship, equipment grants, or branding.
            </p>
          </div>
        </div>

        {submissionStatus === "success" ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center flex flex-col items-center gap-2">
            <CheckCircle2 size={32} className="text-emerald-400" />
            <h5 className="text-sm font-black text-zinc-100">Inquiry Received</h5>
            <p className="text-xs text-zinc-300 max-w-md">
              Thank you for supporting student innovation at UCF! Our project team and corporate relations chairs will respond within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => setSubmissionStatus("idle")}
              className="mt-2 text-xs text-amber-400 font-bold underline cursor-pointer"
            >
              Submit another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitPledge} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="e.g. Dr. Jane Smith"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building2 size={13} className="absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    value={sponsorCompany}
                    onChange={(e) => setSponsorCompany(e.target.value)}
                    placeholder="e.g. Lockheed Martin, TI, or Independent"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-3 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={sponsorEmail}
                  onChange={(e) => setSponsorEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                How Would You Like to Partner?
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your interests (e.g., logo placement on robot chassis, sponsoring component fabrication, hosting a tech talk, or lab equipment donation)..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-zinc-500">
                Routed directly to IEEE UCF leadership.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-955 font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send size={13} />
                <span>{isSubmitting ? "Sending..." : "Send Sponsorship Inquiry"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
