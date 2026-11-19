"use client";

import React from "react";
import Link from "next/link";
import { IEEEProject } from "@/data/projects";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import ProjectSponsorshipForm from "@/components/forms/ProjectSponsorshipForm";
import ProjectBackerForm from "@/components/forms/ProjectBackerForm";
import { useRoleManager, UserRole, AuthSession } from "@/hooks/useRoleManager";

interface ProjectSponsorTabProps {
  project: IEEEProject;
  role?: UserRole;
  session?: AuthSession | null;
  onClose?: () => void;
}

export default function ProjectSponsorTab({
  project,
  role: propRole,
  session: propSession,
  onClose,
}: ProjectSponsorTabProps) {
  const roleManager = useRoleManager();
  const role = propRole !== undefined ? propRole : roleManager.role;
  const session = propSession !== undefined ? propSession : roleManager.session;

  const isCorporateSponsor = role === "sponsor" || session?.accountType === "sponsor";
  const sponsorship = project.sponsorshipInfo;
  const isDone = project.status === "Completed" || project.active === false;

  return (
    <div className="flex flex-col gap-5 animate-fade-in pt-1 pb-4">
      {/* When Concluded: Display Concluded Notice Card */}
      {isDone && (
        <div className="p-5 md:p-6 rounded-2xl bg-neutral-50 border border-neutral-300 shadow-2xs flex flex-col gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-neutral-300 text-black flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-200 text-black border border-neutral-300">
                  Concluded
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">Sponsorship Closed</span>
              </div>
              <h4 className="text-sm font-bold text-black mt-1.5">
                This Has Concluded
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-sans">
                Direct sponsorship inquiries, equipment grants, and community backing are no longer being accepted.
              </p>

              <div className="mt-3.5">
                <Link
                  href="/projects"
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>See More Projects</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case 1: Active Corporate Sponsor -> Partner Tier Only */}
      {!isDone && isCorporateSponsor && (
        <>
          {/* Hero Overview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <span>Why Partner With This Project?</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {sponsorship?.overview ||
                "Sponsoring this RSO USF student initiative directly accelerates hands-on engineering development, hardware fabrication, and technical competition participation."}
            </p>
          </div>

          {/* Sponsor Benefits Grid */}
          {sponsorship?.benefits && sponsorship.benefits.length > 0 ? (
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Possible Benefits For Your Organization
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sponsorship.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between gap-2.5 shadow-2xs"
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

                    {benefit.category && (
                      <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono">
                        <span>{benefit.category}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex flex-col gap-1.5 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Sponsorship Package Pending
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Formal corporate sponsorship tiers have not been published for this project yet.
                However, your organization can still submit custom partnership or equipment sponsorship proposals using the pledge form below.
              </p>
            </div>
          )}

          {/* Corporate Form */}
          <ProjectSponsorshipForm project={project} role={role} session={session} />
        </>
      )}

      {/* Case 2: Active Non-Corporate -> Community Backer Tier Only */}
      {!isDone && !isCorporateSponsor && (
        <ProjectBackerForm project={project} session={session} />
      )}
    </div>
  );
}
