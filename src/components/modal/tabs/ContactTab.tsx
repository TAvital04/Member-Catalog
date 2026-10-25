"use client";

import React, { useState } from "react";
import { Student } from "@/data/students";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  Building2,
  Sparkles,
  ShieldCheck,
  FileText,
  Globe,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { sendDirectEmail } from "@/lib/email";
import { getSafeUrl } from "@/shared";

// Custom SVG brand icons for GitHub and LinkedIn to maintain consistent styling without external icon drift
const GithubIcon = ({ size = 11, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 11, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface ContactTabProps {
  student: Student;
  role?: "standard" | "sponsor" | "admin";
}

export default function ContactTab({ student, role }: ContactTabProps) {
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterCompany, setRecruiterCompany] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [inquiryTopic, setInquiryTopic] = useState("Full-Time Opportunity");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Extract candidate profile channels
  const githubLink = student.links?.find((l) => l.name.toLowerCase().includes("github"))?.text;
  const linkedinLink = student.links?.find((l) => l.name.toLowerCase().includes("linkedin"))?.text;
  const portfolioLink = student.links?.find(
    (l) =>
      /portfolio|website|web/i.test(l.name) ||
      (!l.name.toLowerCase().includes("github") &&
        !l.name.toLowerCase().includes("linkedin") &&
        !/resume|cv/i.test(l.name))
  )?.text;

  const resumeUrl =
    student.resumeLink ||
    student.links?.find((l) => /resume|cv/i.test(l.name))?.text;

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
    if (!recruiterName || !recruiterEmail) return;

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
            `You have received a new candidate inquiry through the IEEE UCF Member Catalog!\n\n` +
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
            `Thank you for using the IEEE UCF Member Catalog portal.\n\n` +
            `Your candidate inquiry to ${student.name} (${student.email}) has been successfully delivered.\n\n` +
            `Subject: ${subjectLine}\n` +
            `Inquiry Topic: ${inquiryTopic}\n\n` +
            `Summary of Sent Message:\n"${messageText || "No additional message provided."}"\n\n` +
            `${student.name} has been provided with your contact email (${recruiterEmail}) and will be able to reply directly to you.`,
          senderName: "IEEE UCF Member Catalog Portal",
          senderEmail: "ieee@ucf.edu",
        }),
      ]);

      setSubmitStatus("success");
      setRecruiterName("");
      setRecruiterCompany("");
      setRecruiterEmail("");
      setMessageText("");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to dispatch email inquiry";
      console.error("Direct contact submission error:", err);
      setSubmitStatus("error");
      setErrorMessage(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  // Locked Screen for Standard Users
  if (role === "standard") {
    return (
      <div className="flex flex-col gap-6 animate-fade-in pt-4 pb-6 w-full max-w-lg mx-auto">
        <div className="p-8 rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-between text-center relative overflow-hidden shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0 mb-4 shadow-inner">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-current stroke-2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h3 className="text-base font-extrabold text-slate-900 mb-2">Direct Candidate Messaging Locked</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-sm">
            Sponsor access is required to view candidate contact details, copy official UCF student emails, and send direct recruiting inquiries.
          </p>

          <a
            href="https://www.ieeeucf.com/sponsorships"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
          >
            Learn More About Sponsoring
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
          <Mail size={14} className="text-amber-600 dark:text-amber-500 shrink-0" />
          <span>Direct Candidate Outreach</span>
        </div>
        <div className="flex items-center gap-2">
          {student.status && (
            <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {student.status}
            </span>
          )}
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Verified UCF Knights Channel</span>
        </div>
      </div>

      {/* Verified Channels Card */}
      <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-amber-600 dark:text-amber-500 shrink-0" />
            <span>Verified Channels & Profiles</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-sans hidden sm:inline">
            Direct candidate contact endpoints
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch">
          {/* Card 1: Official Email */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0 mt-0.5">
                <Mail size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-slate-900 leading-snug">
                  UCF Knights Email
                </h5>
                <p className="text-[11px] text-slate-600 mt-0.5 truncate select-all font-mono">
                  {student.email}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full py-1.5 px-2.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-[10.5px] font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center gap-1"
              >
                {copiedEmail ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} className="text-slate-500" />}
                <span>{copiedEmail ? "Copied!" : "Copy"}</span>
              </button>
              <a
                href={`mailto:${student.email}?subject=${encodeURIComponent(
                  `IEEE UCF Member Inquiry: Career Opportunity for ${student.name}`
                )}`}
                className="w-full py-1.5 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-900 border border-amber-200/60 text-[10.5px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Mail size={12} />
                <span>Open Mail</span>
              </a>
            </div>
          </div>

          {/* Card 2: Professional Profiles */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0 mt-0.5">
                <Globe size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-slate-900 leading-snug">
                  Professional Profiles
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Portfolios, repositories & credentials
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70">
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {linkedinLink && (
                  <a
                    href={getSafeUrl(linkedinLink) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-slate-700 font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 text-[10.5px]"
                  >
                    <LinkedinIcon size={11} className="text-sky-500 shrink-0" />
                    <span className="truncate whitespace-nowrap">LinkedIn</span>
                  </a>
                )}
                {githubLink && (
                  <a
                    href={getSafeUrl(githubLink) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-slate-700 font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 text-[10.5px]"
                  >
                    <GithubIcon size={11} className="text-slate-600 shrink-0" />
                    <span className="truncate whitespace-nowrap">GitHub</span>
                  </a>
                )}
                {portfolioLink && (
                  <a
                    href={getSafeUrl(portfolioLink) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-2.5 py-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-slate-700 font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 text-[10.5px] ${
                      !resumeUrl && !githubLink ? "col-span-2" : ""
                    }`}
                  >
                    <Globe size={11} className="text-amber-600 shrink-0" />
                    <span className="truncate whitespace-nowrap">Portfolio</span>
                  </a>
                )}
                {resumeUrl && (
                  <a
                    href={getSafeUrl(resumeUrl) || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-2.5 py-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-slate-700 font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 text-[10.5px] ${
                      !portfolioLink && !linkedinLink ? "col-span-2" : ""
                    }`}
                  >
                    <FileText size={11} className="text-emerald-600 shrink-0" />
                    <span className="truncate whitespace-nowrap">Resume</span>
                  </a>
                )}
                {!linkedinLink && !githubLink && !portfolioLink && !resumeUrl && (
                  <div className="col-span-2 py-3 flex items-center justify-center text-xs text-slate-400 italic">
                    No external profiles linked
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Candidate Inquiry Form */}
      <div className="p-4 md:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 size={14} className="text-amber-600 dark:text-amber-500" />
            <span>Connect with {student.name}</span>
          </h4>
          <p className="text-xs text-slate-500">
            Submit your inquiry to schedule an interview, discuss technical roles, or connect directly.
          </p>
        </div>

        {submitStatus === "success" && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>
              Thank you! Your direct message to {student.name} has been delivered. A confirmation has been sent to your email.
            </span>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700">Organization / Company</label>
              <input
                type="text"
                value={recruiterCompany}
                onChange={(e) => setRecruiterCompany(e.target.value)}
                placeholder="e.g. Lockheed Martin, TI, or Independent"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700">
                Work Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-700">Inquiry Interest</label>
              <select
                value={inquiryTopic}
                onChange={(e) => setInquiryTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
              >
                <option value="Full-Time Opportunity">Full-Time Opportunity</option>
                <option value="Internship Interview">Internship Interview & Recruitment</option>
                <option value="Project Collaboration">Project Collaboration & Mentorship</option>
                <option value="Technical Screening">Technical Screening / Coffee Chat</option>
                <option value="General Recruiter Inquiry">General Recruiter Inquiry</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-700">Message / Goals (Optional)</label>
            <textarea
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Tell us what technologies or roles you are looking to spotlight..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full sm:w-auto self-end px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-1"
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
        </form>
      </div>
    </div>
  );
}
