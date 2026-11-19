"use client";

/**
 * @file RecruiterContactForm.tsx — Recruiter Direct Contact & Outreach Form
 * @description Allows corporate sponsors, university recruiters, and RSO leadership
 * to initiate direct outreach to student candidates regarding full-time roles,
 * internships, technical screenings, or project mentorship.
 * Adheres strictly to the chapter zero-hover policy and monochrome minimalist aesthetic.
 */

import React, { useState } from "react";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { Student } from "@/data/students";
import { sendDirectEmail } from "@/lib/email";
import Avatar from "@/components/common/Avatar";
import CustomDropdown from "@/components/common/CustomDropdown";
import { AuthSession, UserRole } from "@/hooks/useRoleManager";

export interface RecruiterContactFormProps {
  student: Student;
  role?: UserRole;
  session?: AuthSession | null;
  onSuccess?: () => void;
  onClose?: () => void;
  isStandaloneModal?: boolean;
}

export default function RecruiterContactForm({
  student,
  role = "sponsor",
  session,
  onSuccess,
  onClose,
  isStandaloneModal = false,
}: RecruiterContactFormProps) {
  const [recruiterName, setRecruiterName] = useState(() => session?.displayName || "");
  const [recruiterCompany, setRecruiterCompany] = useState(() => session?.organization || "");
  const [recruiterEmail, setRecruiterEmail] = useState(() => session?.email || "");
  const [inquiryTopic, setInquiryTopic] = useState("Full-Time Opportunity");
  const [messageText, setMessageText] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCopyEmail = async () => {
    if (!student.email) return;
    try {
      await navigator.clipboard.writeText(student.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterName.trim() || !recruiterEmail.trim()) {
      setErrorMessage("Recruiter name and work email are required.");
      setSubmitStatus("error");
      return;
    }

    setIsSending(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    const subjectLine = `${inquiryTopic}: Outreach to ${student.name}${recruiterCompany ? ` (${recruiterCompany})` : ""}`;

    try {
      await Promise.all([
        // Email 1: Sent to Student with details from the employer
        sendDirectEmail({
          to: student.email,
          recipientType: "student",
          subject: subjectLine,
          message:
            `Hello ${student.name},\n\n` +
            `You have received a new candidate inquiry through the RSO USF Member Catalog.\n\n` +
            `Employer Details:\n- Name: ${recruiterName}\n- Organization: ${recruiterCompany || "Not specified"}\n- Contact Email: ${recruiterEmail}\n` +
            `- Inquiry Topic: ${inquiryTopic}\n\n` +
            `Message:\n${messageText || "No additional message provided."}\n\n` +
            `You can reply directly to this email to get in touch with ${recruiterName} (${recruiterEmail}).`,
          senderName: recruiterName,
          senderEmail: recruiterEmail,
        }),
        // Email 2: Confirmation sent to Employer
        sendDirectEmail({
          to: recruiterEmail,
          recipientType: "general",
          subject: `[Confirmation] Your Inquiry to ${student.name} Has Been Delivered`,
          message:
            `Hello ${recruiterName},\n\n` +
            `Thank you for using the RSO USF Member Catalog portal.\n\n` +
            `Your candidate inquiry to ${student.name} (${student.email}) has been successfully delivered.\n\n` +
            `Subject: ${subjectLine}\n` +
            `Inquiry Topic: ${inquiryTopic}\n\n` +
            `Summary of Sent Message:\n"${messageText || "No additional message provided."}"\n\n` +
            `${student.name} has been provided with your contact email (${recruiterEmail}) and will be able to reply directly to you.`,
          senderName: "RSO USF Member Catalog Portal",
          senderEmail: "leadership@rsousf.org",
        }),
      ]);

      setSubmitStatus("success");
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to dispatch email inquiry";
      console.error("Direct contact submission error:", err);
      setSubmitStatus("error");
      setErrorMessage(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  // Locked View for Unauthenticated / Standard Users
  if (role === "standard") {
    return (
      <div className="flex flex-col gap-6 animate-fade-in pt-4 pb-6 w-full max-w-lg mx-auto">
        <div className="p-8 rounded-2xl border border-neutral-300 bg-white flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-neutral-100 text-black border border-neutral-300 flex items-center justify-center shrink-0 mb-4">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-current stroke-2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h3 className="text-base font-extrabold text-black mb-2">Direct Candidate Messaging Locked</h3>
          <p className="text-xs text-neutral-600 leading-relaxed mb-6 max-w-sm">
            Sponsor access is required to view candidate contact details, copy official USF student emails, and send direct recruiting inquiries.
          </p>

          <a
            href="/sponsors"
            className="w-full sm:w-auto px-6 py-3 bg-black text-white font-extrabold rounded-xl text-xs tracking-wider uppercase flex items-center justify-center cursor-pointer"
          >
            Learn More About Sponsoring
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in pt-1 pb-4">
      {/* Success State */}
      {submitStatus === "success" ? (
        <div className="p-6 rounded-2xl bg-white border border-neutral-300 shadow-2xs flex flex-col items-center text-center gap-3 py-10">
          <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-300 text-black flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="font-black text-lg text-black">Direct Message Delivered</h4>
          <p className="text-xs text-neutral-600 max-w-md leading-relaxed font-sans">
            Your inquiry to <span className="font-bold text-black">{student.name}</span> has been dispatched. A confirmation has been transmitted to <span className="font-bold text-black">{recruiterEmail}</span>.
          </p>
          <div className="mt-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Status: Delivered to Student Email
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setSubmitStatus("idle");
                setMessageText("");
              }}
              className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-black text-xs font-bold cursor-pointer"
            >
              Send Another Note
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
        <form onSubmit={handleContactSubmit} noValidate className="flex flex-col gap-5">
          {/* Card 1: Candidate Identity & Direct Channels */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Candidate Contact
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={student.name} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-black truncate">{student.name}</h4>
                    {student.status && (
                      <span className="bg-neutral-100 text-black border border-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                        {student.status}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-600 truncate font-sans mt-0.5">
                    {student.major} • Class of {student.gradDate} • <span className="font-mono text-black font-semibold select-all">{student.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="py-1.5 px-3 rounded-lg bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {copiedEmail ? <Check size={12} className="text-black" /> : <Copy size={12} className="text-neutral-500" />}
                  <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
                </button>
                <a
                  href={`mailto:${student.email}?subject=${encodeURIComponent(
                    `RSO USF Member Inquiry: Career Opportunity for ${student.name}`
                  )}`}
                  className="py-1.5 px-3 rounded-lg bg-black text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Mail size={12} />
                  <span>Open Mail</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Recruiter & Organization Credentials */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Recruiter & Organization Identity
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="recruiter-name" className="text-[11px] font-bold text-neutral-700">
                    Your Name <span className="text-black font-bold">*</span>
                  </label>
                  <input
                    id="recruiter-name"
                    type="text"
                    aria-required="true"
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="recruiter-company" className="text-[11px] font-bold text-neutral-700">
                    Company / Organization
                  </label>
                  <input
                    id="recruiter-company"
                    type="text"
                    value={recruiterCompany}
                    onChange={(e) => setRecruiterCompany(e.target.value)}
                    placeholder="e.g. Texas Instruments, Lockheed Martin, or Independent"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="recruiter-email" className="text-[11px] font-bold text-neutral-700">
                    Work Email Address <span className="text-black font-bold">*</span>
                  </label>
                  <input
                    id="recruiter-email"
                    type="email"
                    aria-required="true"
                    value={recruiterEmail}
                    onChange={(e) => setRecruiterEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-black placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-black font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="inquiry-topic" className="text-[11px] font-bold text-neutral-700">
                    Inquiry Topic & Opportunity
                  </label>
                  <CustomDropdown
                    value={inquiryTopic}
                    onChange={(val) => setInquiryTopic(val)}
                    options={[
                      { value: "Full-Time Opportunity", label: "Full-Time Opportunity" },
                      { value: "Internship Interview", label: "Internship Interview & Recruitment" },
                      { value: "Project Collaboration", label: "Project Collaboration & Mentorship" },
                      { value: "Technical Screening", label: "Technical Screening / Coffee Chat" },
                      { value: "General Recruiter Inquiry", label: "General Recruiter Inquiry" },
                    ]}
                    variant="input"
                    className="w-full"
                    aria-label="Inquiry Topic"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Message / Note to Candidate */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Message to {student.name} (Optional)
            </h3>
            <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <textarea
                id="outreach-message"
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Mention specific roles, hardware projects, technical requirements, or schedule preferences for an introductory call..."
                className="w-full text-xs focus:outline-none resize-none font-sans bg-transparent text-black placeholder:text-neutral-400"
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
          <div className="flex items-center justify-end gap-2.5 pt-1">
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
              disabled={isSending}
              className="px-6 py-2.5 rounded-xl bg-black text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Submitting Outreach...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Submit Direct Outreach Inquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}