"use client";

import React, { useState } from "react";
import { Student } from "../../../data/students";
import TruncatedText from "../../common/TruncatedText";
import { Mail, Send, Loader2 } from "lucide-react";
import { sendDirectEmail } from "../../../lib/email";

interface ContactTabProps {
  student: Student;
  role?: "standard" | "sponsor" | "admin";
}

export default function ContactTab({ student, role }: ContactTabProps) {
  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterName || !recruiterEmail || !messageText) return;

    setIsSending(true);

    try {
      await Promise.all([
        // Email 1: Sent to Student with details from the employer
        sendDirectEmail({
          to: student.email,
          recipientType: "student",
          subject: `Inquiry from IEEE UCF Resume Database: ${recruiterName}`,
          message:
            `Hello ${student.name},\n\n` +
            `You have received a new candidate inquiry through the UCF Member Resume Database!\n\n` +
            `Employer Details:\n- Name: ${recruiterName}\n- Contact Email: ${recruiterEmail}\n\n` +
            `Message:\n${messageText}\n\n` +
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
            `Thank you for using the UCF Member Resume Database portal.\n\n` +
            `Your candidate inquiry to ${student.name} (${student.email}) has been successfully delivered.\n\n` +
            `Summary of Sent Message:\n"${messageText}"\n\n` +
            `${student.name} has been provided with your contact email (${recruiterEmail}) and will be able to reply directly to you.`,
          senderName: "UCF Member Resume Database Portal",
          senderEmail: "ta616249@ucf.edu",
        }),
      ]);

      setToastMessage({ text: `Direct message sent to ${student.name}! Confirmation emailed to ${recruiterEmail}.` });
      setRecruiterName("");
      setRecruiterEmail("");
      setMessageText("");
    } catch (err: any) {
      console.error("Direct contact submission error:", err);
      setToastMessage({ text: `Email dispatch failed: ${err?.message || "Unknown error"}`, isError: true });
    } finally {
      setIsSending(false);
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    }
  };

  if (role === "standard") {
    return (
      <div className="p-7 rounded-2xl border border-zinc-800 glass-panel flex flex-col items-center justify-between text-center relative overflow-hidden my-auto w-full max-w-lg mx-auto shadow-lg animate-fade-in">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shrink-0 mb-3 shadow-inner">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h3 className="text-base font-extrabold text-zinc-100 mb-1">Direct Candidate Messaging Locked</h3>
        <p className="text-xs text-zinc-400 leading-relaxed mb-6 max-w-sm">
          Sponsor access is required to view candidate contact details, send direct messages, or access official recruiter channels.
        </p>

        <a
          href="https://www.ieeeucf.com/sponsorships"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-400 font-extrabold tracking-wide uppercase hover:bg-amber-500/20 hover:border-amber-500/40 transition-all shadow-sm flex items-center justify-center cursor-pointer"
        >
          Learn More About Sponsoring
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1 text-zinc-300 font-semibold text-xs uppercase tracking-wider mb-2">
        <Mail size={13} className="text-amber-500 shrink-0" />
        <span>Send Message to</span>
        <TruncatedText text={student.name} maxLength={35} />
      </div>

      <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Your Name</label>
            <input
              type="text"
              required
              value={recruiterName}
              onChange={(e) => setRecruiterName(e.target.value)}
              placeholder="e.g. Recruiter Name"
              className="w-full bg-zinc-850 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-550 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Company Email</label>
            <input
              type="email"
              required
              value={recruiterEmail}
              onChange={(e) => setRecruiterEmail(e.target.value)}
              placeholder="recruiter@company.com"
              className="w-full bg-zinc-850 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-550 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Message</label>
          <textarea
            required
            rows={5}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Introduce yourself, specify the role, and outline next steps...`}
            className="w-full bg-zinc-850 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 placeholder-zinc-550 focus:outline-none focus:border-amber-500 resize-none"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSending}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-zinc-955 font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
        >
          {isSending ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Sending Direct Message...</span>
            </>
          ) : (
            <>
              <Send size={13} />
              <span>Send Direct Message</span>
            </>
          )}
        </button>
      </form>

      {toastMessage && (
        <div
          className={`mt-4 p-3.5 rounded-xl border text-xs text-center animate-pulse ${
            toastMessage.isError
              ? "border-red-500/30 bg-red-500/10 text-red-400"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {toastMessage.text}
        </div>
      )}
    </div>
  );
}
