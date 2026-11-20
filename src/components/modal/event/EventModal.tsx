"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Building2,
  Users,
  Sparkles,
  BookOpen,
  Info,
  Lock,
} from "lucide-react";
import { IEEEEvent, EventAttendee } from "@/data/events";
import { Student } from "@/data/students";
import Avatar from "@/components/common/Avatar";
import Tooltip from "@/components/common/Tooltip";
import { CARD_INTERACTIVE, CARD_BASE, CARD_TITLE_HOVER } from "@/lib/cardStyles";
import { Heading, Subheading, Badge } from "@/components/ui";
import { useRoleManager } from "@/hooks/useRoleManager";
import { getStudentSlug } from "@/lib/studentSlug";

interface EventModalProps {
  event: IEEEEvent | null;
  onClose: () => void;
  onSelectMember?: (memberId: string) => void;
  students?: Student[];
  role?: "standard" | "sponsor" | "admin";
  canFilter?: boolean;
}

export type EventTabType = "info" | "overview" | "skills" | "attendees";

export default function EventModal({
  event,
  onClose,
  onSelectMember,
  students = [],
  role,
  canFilter: explicitCanFilter,
}: EventModalProps) {
  const router = useRouter();
  const roleManager = useRoleManager();
  const currentRole = role !== undefined ? role : roleManager.role;

  const canFilter = explicitCanFilter ?? (currentRole ? currentRole !== "standard" : true);
  const [activeTab, setActiveTab] = useState<EventTabType>("overview");

  // Handle escape key and body scroll lock
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (event) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [event, onClose]);

  // Handle responsive tab switching between desktop and mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setActiveTab((prev) => (prev === "info" ? "overview" : prev));
      }
    };

    const timer = setTimeout(handleResize, 0);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!event) return null;

  // Find rich student details if available
  const getStudentForAttendee = (attendee: EventAttendee): Student | undefined => {
    return students.find(
      (s) =>
        s.id === attendee.memberId ||
        s.email.toLowerCase() === attendee.email.toLowerCase() ||
        s.name.toLowerCase() === attendee.name.toLowerCase()
    );
  };

  const eventSkills =
    (event.skills && event.skills.length > 0) ? event.skills : event.tags || [];

  const tabsList: Array<{
    id: EventTabType;
    label: string;
    ariaLabel?: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }> = [
    { id: "overview", label: "Overview", ariaLabel: "Overview & Topics", icon: BookOpen },
    { id: "skills", label: "Skills", ariaLabel: "Skills & Topics", icon: Sparkles },
    {
      id: "attendees",
      label: currentRole === "standard"
        ? `Attendance (${event.attendees ? event.attendees.length : 0})`
        : `Attendees (${event.attendees ? event.attendees.length : 0})`,
      ariaLabel: "Workshop Attendance & Leads",
      icon: Users,
    },
  ];

  // Reusable Left Side Hero & Metadata Panel
  const EventHeroContent = (
    <div className="flex flex-col gap-5">
      {/* Category & Partner Badges */}
      <div className="flex items-center justify-between gap-2">
        <Badge variant="neutral">{event.category}</Badge>
        {event.partner && (
          <Badge variant="outline" className="flex items-center gap-1.5 font-bold">
            <Building2 size={12} className="text-black" />
            <span>Partner: {event.partner}</span>
          </Badge>
        )}
      </div>

      {/* Event Title */}
      <div className="flex flex-col">
        <Heading variant="modal">{event.title}</Heading>
        {event.partner ? (
          <Subheading variant="modal">Co-hosted with {event.partner}</Subheading>
        ) : (
          <Subheading variant="modal">RSO USF Technical Chapter Workshop</Subheading>
        )}
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="block text-base font-black text-slate-900 leading-none">
            {event.attendees ? event.attendees.length : 0}
          </span>
          <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">
            Attendees
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <span className="block text-base font-black text-slate-900 leading-none">
            {eventSkills.length}
          </span>
          <span className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">
            Skills Taught
          </span>
        </div>
      </div>

      {/* Description Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col gap-2">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Session Overview</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          {event.description}
        </p>
      </div>
    </div>
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-modal-overlay backdrop-blur-md cursor-pointer animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${event.title} - Workshop & Event Details`}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-full md:h-[82vh] rounded-none md:rounded-3xl bg-white border-0 md:border border-slate-200 shadow-2xl flex flex-col max-h-screen md:max-h-[85vh] animate-scale-in cursor-default overflow-hidden"
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close event modal"
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container Wrapper */}
        <div className="w-full flex flex-col md:flex-row overflow-hidden h-full">
          {/* Left Side Panel: Hero & Quick Stats (Desktop) */}
          <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between md:overflow-y-auto overflow-x-hidden relative z-10 bg-slate-50/70 hidden md:flex">
            {EventHeroContent}
          </div>

          {/* Right Side Panel: Interactive Tabs */}
          <div className="w-full md:w-3/5 p-5 md:p-6 pt-12 md:pt-6 flex flex-col h-full relative z-10 bg-slate-50/70 overflow-hidden">
            {/* Standardized Tab Navigation Header */}
            <div
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
              className="flex border-b border-slate-200 mb-5 pb-1 text-xs md:text-sm gap-1 md:gap-2 overflow-x-auto no-scrollbar pr-10 md:pr-12 shrink-0 cursor-default"
            >
              {/* Mobile Info Tab */}
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className={`py-2 px-2.5 font-bold uppercase tracking-wider relative md:hidden shrink-0 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === "info"
                    ? "text-black font-extrabold"
                    : "text-neutral-500 hover:text-black font-semibold"
                }`}
              >
                <Info size={14} className={activeTab === "info" ? "text-black" : "text-neutral-400"} />
                <span>Info</span>
                {activeTab === "info" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></span>
                )}
              </button>

              {/* Main Tabs */}
              {tabsList.map(({ id, label, ariaLabel }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-label={ariaLabel || label}
                    onClick={() => setActiveTab(id)}
                    className={`py-2 px-2.5 sm:px-3 font-bold uppercase tracking-wider relative shrink-0 md:shrink md:flex-1 md:text-center whitespace-nowrap text-xs md:text-xs lg:text-sm cursor-pointer ${
                      isActive
                        ? "text-black font-extrabold"
                        : "text-neutral-500 hover:text-black font-semibold"
                    }`}
                  >
                    <span>{label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Display */}
            <div className={`grow pr-1 ${activeTab === "info" ? "overflow-hidden" : "overflow-y-auto"} md:overflow-y-auto`}>
              {/* Mobile Info Panel */}
              {activeTab === "info" && (
                <div className="flex flex-col h-full md:hidden relative overflow-y-auto pb-10 pr-1 animate-fade-in">
                  {EventHeroContent}
                </div>
              )}

              {/* Overview & Topics Tab */}
              {activeTab === "overview" && (
                <div className="flex flex-col gap-6 animate-fade-in pb-4">
                  {/* Technical Outcomes & Topics Covered */}
                  {event.learningOutcomes && event.learningOutcomes.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
                        <span>Skills & Key Topics Covered</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-700 font-medium leading-relaxed marker:text-black">
                          {event.learningOutcomes.map((item, idx) => (
                            <li key={idx} className="pl-0.5">
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Skills Covered Quick Row */}
                  {eventSkills.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Core Competencies
                        </span>
                        {canFilter && (
                          <span className="text-[11px] text-slate-400">Click skill to filter candidates</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {eventSkills.map((skill, idx) => (
                          <Link
                            key={idx}
                            href={`/?skills=${encodeURIComponent(skill)}`}
                            onClick={() => onClose()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium bg-neutral-100 text-black px-3 py-1.5 rounded-full border border-neutral-300 cursor-pointer shadow-2xs"
                          >
                            <span>{skill}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shortcut to Attending Members */}
                  <div
                    onClick={() => setActiveTab("attendees")}
                    className="p-4 rounded-2xl bg-white border border-slate-200 cursor-pointer shadow-2xs flex items-center justify-between mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-neutral-100 text-black">
                        <Users size={16} />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${CARD_TITLE_HOVER}`}>
                          View Attendees ({event.attendees ? event.attendees.length : 0})
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Inspect student candidate portfolios who completed this workshop
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div className="flex flex-col gap-4 animate-fade-in pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
                      <span>Skills & Technologies Covered ({eventSkills.length})</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Click to filter candidates</span>
                  </div>

                  {eventSkills.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl p-6">
                      <p className="text-slate-500 text-xs">No skills listed for this event.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {eventSkills.map((skill, idx) => (
                        <Link
                          key={idx}
                          href={`/?skills=${encodeURIComponent(skill)}`}
                          onClick={() => onClose()}
                          className={`${CARD_INTERACTIVE} p-3.5 flex items-center justify-between group cursor-pointer`}
                        >
                          <div className="min-w-0 pr-2">
                            <h4 className={`text-xs font-bold truncate ${CARD_TITLE_HOVER}`}>
                              {skill}
                            </h4>
                            <span className="text-[10px] text-slate-500 mt-0.5 block">
                              Workshop Competency
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Attending Members Tab */}
              {activeTab === "attendees" && (
                <div className="flex flex-col gap-4 animate-fade-in pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
                      <span>
                        {currentRole === "standard"
                          ? `Workshop Attendance (${event.attendees ? event.attendees.length : 0} Students)`
                          : `Member Attendees (${event.attendees ? event.attendees.length : 0})`}
                      </span>
                    </div>
                    {currentRole !== "standard" && (
                      <span className="text-[11px] text-slate-400">
                        Click candidate to inspect portfolio
                      </span>
                    )}
                  </div>

                  {currentRole === "standard" ? (
                    <div className="flex flex-col gap-4">
                      {/* Attendance Count Stat Card */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-300 shadow-2xs flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl bg-white border border-neutral-300 text-black flex items-center justify-center shrink-0 shadow-2xs">
                            <Users size={20} />
                          </div>
                          <div>
                            <div className="text-base sm:text-lg font-black text-black">
                              {event.attendees ? event.attendees.length : 0} Students Attended
                            </div>
                            <p className="text-xs text-neutral-600 font-sans mt-0.5">
                              Total verified engineering student members who checked into and completed this hands-on workshop session.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Workshop & Session Leads Only */}
                      {(() => {
                        const leads = (event.leads && event.leads.length > 0)
                          ? event.leads
                          : (event.attendees || []).filter(
                              (a) => a.role === "Lead" || a.role === "Speaker" || a.role === "Officer"
                            );
                        const effectiveLeads = leads.length > 0 ? leads : (event.attendees && event.attendees.length > 0 ? [event.attendees[0]] : []);
                        const otherAttendeesCount = Math.max(0, (event.attendees?.length || 0) - effectiveLeads.length);

                        return (
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                              <span>Workshop & Session Leads ({effectiveLeads.length})</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {effectiveLeads.map((lead, idx) => {
                                const student = getStudentForAttendee(lead);
                                const displayName = student?.name || lead.name;
                                const displayMajor = student?.major || lead.major;

                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      if (onSelectMember) {
                                        onSelectMember(student?.id || lead.memberId);
                                      } else if (student) {
                                        onClose();
                                        router.push(`/u/${getStudentSlug(student)}`);
                                      }
                                    }}
                                    className={`${CARD_INTERACTIVE} p-3.5 flex items-center justify-between text-left group`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0 pr-2">
                                      <Avatar
                                        name={displayName}
                                        size="md"
                                        className="shrink-0 bg-slate-100 text-slate-800 font-bold border border-slate-200"
                                      />
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className={`text-xs font-bold block truncate ${CARD_TITLE_HOVER}`}>
                                            {displayName}
                                          </span>
                                          <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-black border border-neutral-300 shrink-0">
                                            Workshop Lead
                                          </span>
                                        </div>
                                        <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                                          {displayMajor}
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {otherAttendeesCount > 0 && (
                              <div className="p-3.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2.5 shadow-2xs font-sans mt-1">
                                <Lock size={14} className="text-neutral-500 shrink-0" />
                                <span>
                                  +{otherAttendeesCount} other student members attended this session. Individual participant names are kept private to protect student privacy.
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (!event.attendees || event.attendees.length === 0) ? (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No member attendance records logged for this session yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {event.attendees.map((attendee, idx) => {
                        const student = getStudentForAttendee(attendee);
                        const displayName = student?.name || attendee.name;
                        const displayMajor = student?.major || attendee.major;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (onSelectMember) {
                                onSelectMember(student?.id || attendee.memberId);
                              } else if (student) {
                                onClose();
                                router.push(`/u/${getStudentSlug(student)}`);
                              }
                            }}
                            className={`${CARD_INTERACTIVE} p-3.5 flex items-center justify-between text-left group`}
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <Avatar
                                name={displayName}
                                size="md"
                                className="shrink-0 bg-slate-100 text-slate-800 font-bold border border-slate-200"
                              />
                              <div className="min-w-0">
                                <span className={`text-xs font-bold block truncate ${CARD_TITLE_HOVER}`}>
                                  {displayName}
                                </span>
                                <span className="text-[11px] text-slate-500 block truncate">
                                  {displayMajor}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
