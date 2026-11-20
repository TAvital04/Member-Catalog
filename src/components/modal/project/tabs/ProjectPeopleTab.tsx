"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectParticipant } from "@/data/projects";
import Avatar from "@/components/common/Avatar";
import { Users, GraduationCap, Crown, Shield } from "lucide-react";
import { UserRole } from "@/hooks/useRoleManager";

interface ProjectPeopleTabProps {
  participants: ProjectParticipant[];
  onSelectMember?: (memberId: string, name?: string, email?: string) => void;
  role?: UserRole;
}

export default function ProjectPeopleTab({
  participants = [],
  onSelectMember,
  role = "admin",
}: ProjectPeopleTabProps) {
  const router = useRouter();
  const safeParticipants = Array.isArray(participants) ? participants : [];
  const isStandard = role === "standard";

  const handleMemberClick = (person: ProjectParticipant) => {
    if (onSelectMember) {
      onSelectMember(person.memberId, person.name, person.email);
    } else {
      const slug = (person.name || person.memberId).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
      router.push(`/u/${slug}`);
    }
  };

  // When standard user views project team, filter to Leads/Directors only
  const leads = safeParticipants.filter((p) =>
    /director|lead|chair|captain|manager|head/i.test(p.roleTitle || "")
  );
  const effectiveLeads = leads.length > 0 ? leads : safeParticipants.slice(0, 1);
  const otherContributorsCount = Math.max(0, safeParticipants.length - effectiveLeads.length);

  const displayedMembers = isStandard ? effectiveLeads : safeParticipants;

  return (
    <div className="flex flex-col gap-4 animate-fade-in pt-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
          <span>
            {isStandard
              ? `Project Team & Leadership (${safeParticipants.length} Contributors)`
              : `Student Team & Contributors (${safeParticipants.length})`}
          </span>
        </div>
        {!isStandard && (
          <span className="text-[11px] text-slate-400">
            Click candidate to inspect portfolio
          </span>
        )}
      </div>

      {/* Standard Role: Verified Contributor Count Card */}
      {isStandard && (
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-300 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white border border-neutral-300 text-black flex items-center justify-center shrink-0 shadow-2xs">
              <Users size={20} />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-black">
                {safeParticipants.length} Engineering Contributors
              </div>
              <p className="text-xs text-neutral-600 font-sans mt-0.5">
                Verified student engineering team members and build contributors active on this chapter hardware project.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Standard Role Section Header for Leads */}
      {isStandard && effectiveLeads.length > 0 && (
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
          <span>Project Leads & Technical Directors ({effectiveLeads.length})</span>
        </div>
      )}

      {/* Roster Grid */}
      {displayedMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-1">
          {displayedMembers.map((person) => {
            const isDirector = /director|lead|chair|captain|manager|head/i.test(person.roleTitle || "");
            return (
              <div
                key={person.memberId}
                role="button"
                tabIndex={0}
                onClick={() => handleMemberClick(person)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMemberClick(person);
                  }
                }}
                aria-label={`View member profile of ${person.name}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between gap-3.5 shadow-2xs group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <div className="flex items-center gap-3.5">
                  <Avatar name={person.name} size="md" className="shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate text-slate-900 group-hover:text-black">
                      {person.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs min-w-0">
                      {isDirector && <Crown size={12} className="text-black shrink-0" />}
                      <span className={`truncate ${isDirector ? "font-semibold text-slate-700" : "font-medium text-slate-600"}`}>
                        {person.roleTitle}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 pl-0.5">
                  <GraduationCap size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{person.major}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50">
          <Users size={24} className="text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-800">No Team Members Listed Yet</h4>
          <p className="text-slate-500 text-xs mt-1">This project roster has not been populated yet — active recruitment is currently open.</p>
          <p className="text-slate-400 text-[11px] mt-0.5">Students can reach out to chapter officers or attend weekly project work sessions to join.</p>
        </div>
      )}

      {/* Standard Role Privacy Notice for Regular Contributors */}
      {isStandard && otherContributorsCount > 0 && (
        <div className="p-4 rounded-2xl bg-white border border-neutral-300 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-600 mt-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Shield size={16} className="text-neutral-500 shrink-0" />
            <span className="font-sans leading-relaxed">
              +{otherContributorsCount} additional student contributor profiles are private to premium sponsor profiles.
            </span>
          </div>
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold cursor-pointer shrink-0"
          >
            Sign In with Premium Profile
          </Link>
        </div>
      )}
    </div>
  );
}
