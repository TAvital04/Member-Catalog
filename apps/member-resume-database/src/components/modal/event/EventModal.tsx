"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Info,
  ArrowRight,
} from "lucide-react";
import { IEEEEvent, EventAttendee } from "@/data/events";
import { Student } from "@/data/students";
import Avatar from "@/components/common/Avatar";
import Tooltip from "@/components/common/Tooltip";
import { studentHasSkill } from "@/lib/skillMatching";
import { CARD_INTERACTIVE, CARD_BASE } from "@/lib/cardStyles";

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
  const canFilter = explicitCanFilter ?? (role ? role !== "standard" : true);
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

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      });
    } catch {
      return isoString;
    }
  };

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
      label: `Attending Members (${event.attendees ? event.attendees.length : 0})`,
      ariaLabel: "Attending Members",
      icon: Users,
    },
  ];

  // Reusable Left Side Hero & Metadata Panel
  const EventHeroContent = (
    <div className="flex flex-col gap-5">
      {/* Category & Partner Badges */}
      <div className="flex items-center justify-between gap-2">
        <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          {event.category}
        </span>
        {event.partner && (
          <span className="bg-amber-50 text-amber-900 border border-amber-200/60 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Building2 size={11} className="text-amber-600" />
            <span>Partner: {event.partner}</span>
          </span>
        )}
      </div>

      {/* Event Icon & Title */}
      <div className="flex items-start gap-3.5">
        <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 shadow-2xs shrink-0 mt-0.5">
          <Calendar size={24} className="stroke-[2] text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {event.title}
          </h2>
          {event.partner ? (
            <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">
              Co-hosted with {event.partner}
            </p>
          ) : (
            <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
              IEEE UCF Technical Chapter Workshop
            </p>
          )}
        </div>
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

      {/* Key Logistics Metadata Stack */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <Calendar size={13} className="text-amber-600 shrink-0" />
          <span>{formatDate(event.startTime)}</span>
        </div>
        {event.startTime && (
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Clock size={13} className="text-slate-400 shrink-0" />
            <span>
              {formatTime(event.startTime)}
              {event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <MapPin size={13} className="text-slate-400 shrink-0" />
          <span>{event.location}</span>
        </div>
      </div>

      {/* Description Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col gap-2">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen size={13} className="text-amber-500" />
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
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-modal-overlay backdrop-blur-md cursor-pointer animate-fade-in"
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
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all shadow-sm active:scale-90 group/tooltip cursor-pointer"
        >
          <X size={18} />
          <Tooltip content="Close Event Modal" position="bottom-right" groupClass="group-hover/tooltip:opacity-100" />
        </button>

        {/* Scrollable Container Wrapper */}
        <div className="w-full flex flex-col md:flex-row overflow-hidden h-full">
          {/* Left Side Panel: Hero & Quick Stats (Desktop) */}
          <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between md:overflow-y-auto overflow-x-hidden relative z-10 bg-modal-left hidden md:flex">
            {EventHeroContent}
          </div>

          {/* Right Side Panel: Interactive Tabs */}
          <div className="w-full md:w-3/5 p-5 md:p-6 pt-14 md:pt-6 flex flex-col h-full relative z-10 bg-modal-right overflow-hidden">
            {/* Standardized Tab Navigation Header */}
            <div className="border-b border-slate-200 mb-5 relative shrink-0">
              <div className="flex items-center text-xs md:text-sm gap-0.5 sm:gap-1 md:gap-1.5 overflow-x-auto no-scrollbar mr-12 md:mr-14 pb-1">
                {/* Mobile Info Tab */}
                <button
                  type="button"
                  onClick={() => setActiveTab("info")}
                  className={`py-2 px-2.5 font-bold uppercase tracking-wider relative transition-all md:hidden shrink-0 flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === "info"
                      ? "text-slate-900 font-extrabold"
                      : "text-slate-500 hover:text-slate-700 font-medium"
                  }`}
                >
                  <Info size={14} className={activeTab === "info" ? "text-slate-700" : "text-slate-400"} />
                  <span>Info</span>
                  {activeTab === "info" && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 rounded-full"></span>
                  )}
                </button>

                {/* Main Tabs */}
                {tabsList.map(({ id, label, ariaLabel, icon: Icon }) => {
                  const isActive = activeTab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-label={ariaLabel || label}
                      onClick={() => setActiveTab(id)}
                      className={`py-2 px-2.5 sm:px-3 font-bold uppercase tracking-wider relative transition-all shrink-0 flex items-center justify-center gap-1.5 whitespace-nowrap text-xs md:text-xs lg:text-sm ${
                        isActive
                          ? "text-slate-900 font-extrabold"
                          : "text-slate-500 hover:text-slate-700 font-medium"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-amber-500" : "text-slate-400"} />
                      <span>{label}</span>
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
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
                        <CheckCircle2 size={14} className="text-amber-500 shrink-0" />
                        <span>Skills & Key Topics Covered</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-700 font-medium leading-relaxed marker:text-amber-500">
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
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles size={13} className="text-amber-500" />
                          Core Competencies
                        </span>
                        {canFilter && (
                          <span className="text-[11px] text-slate-400">Click skill to filter candidates</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {eventSkills.map((skill, idx) => {
                          const matchingStudents =
                            students?.filter((s) => studentHasSkill(s.skills, skill)) || [];
                          const studentCount = matchingStudents.length;

                          return canFilter ? (
                            <Link
                              key={idx}
                              href={`/?skills=${encodeURIComponent(skill)}`}
                              onClick={() => onClose()}
                              className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 px-3 py-1.5 rounded-full border border-slate-200 hover:border-amber-300 transition-all cursor-pointer group shadow-2xs"
                              title={`Explore ${studentCount} candidate${studentCount === 1 ? "" : "s"} with ${skill}`}
                            >
                              <span>{skill}</span>
                              {studentCount > 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/80 group-hover:bg-amber-200/80 text-slate-700 group-hover:text-amber-950 transition-colors">
                                  {studentCount}
                                </span>
                              )}
                            </Link>
                          ) : (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs select-none"
                            >
                              <span>{skill}</span>
                              {studentCount > 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700">
                                  {studentCount}
                                </span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Shortcut to Attending Members */}
                  <div
                    onClick={() => setActiveTab("attendees")}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-2xs flex items-center justify-between group mt-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-amber-50 group-hover:text-amber-800 transition-colors">
                        <Users size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-950 transition-colors">
                          View Verified Attendees ({event.attendees ? event.attendees.length : 0})
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Inspect student candidate portfolios who completed this workshop
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div className="flex flex-col gap-4 animate-fade-in pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
                      <Sparkles size={14} className="text-amber-500 shrink-0" />
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
                      {eventSkills.map((skill, idx) => {
                        const matchingStudents =
                          students?.filter((s) => studentHasSkill(s.skills, skill)) || [];
                        const matchingCount = matchingStudents.length;

                        return canFilter ? (
                          <Link
                            key={idx}
                            href={`/?skills=${encodeURIComponent(skill)}`}
                            onClick={() => onClose()}
                            className={`${CARD_INTERACTIVE} p-3.5 flex items-center justify-between group`}
                            title={`Filter candidates with skill: ${skill}`}
                          >
                            <div className="min-w-0 pr-2">
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-950 transition-colors truncate">
                                {skill}
                              </h4>
                              <span className="text-[10px] text-slate-500 mt-0.5 block">
                                Verified Workshop Competency
                              </span>
                            </div>
                            {matchingCount > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-amber-100 text-slate-600 group-hover:text-amber-900 transition-colors shrink-0">
                                {matchingCount} student{matchingCount === 1 ? "" : "s"}
                              </span>
                            )}
                          </Link>
                        ) : (
                          <div
                            key={idx}
                            className={`${CARD_BASE} p-3.5 flex items-center justify-between select-none`}
                            title={`Skill: ${skill}`}
                          >
                            <div className="min-w-0 pr-2">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {skill}
                              </h4>
                              <span className="text-[10px] text-slate-500 mt-0.5 block">
                                Verified Workshop Competency
                              </span>
                            </div>
                            {matchingCount > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                                {matchingCount} student{matchingCount === 1 ? "" : "s"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Attending Members Tab */}
              {activeTab === "attendees" && (
                <div className="flex flex-col gap-4 animate-fade-in pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider py-1 leading-normal">
                      <Users size={14} className="text-amber-500 shrink-0" />
                      <span>
                        Verified Member Attendees ({event.attendees ? event.attendees.length : 0})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Click candidate to inspect portfolio
                    </span>
                  </div>

                  {(!event.attendees || event.attendees.length === 0) ? (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No member attendance records logged for this session yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {event.attendees.map((attendee, idx) => {
                        const student = getStudentForAttendee(attendee);
                        const displayName = student?.name || attendee.name;
                        const displayMajor = student?.major || attendee.major;
                        const studentSkills = student?.skills || [];
                        const matchingSkills = eventSkills.filter((sk) =>
                          studentHasSkill(studentSkills, sk)
                        );

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (onSelectMember) {
                                onSelectMember(student?.id || attendee.memberId);
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
                                <span className="text-xs font-bold text-slate-900 group-hover:text-amber-950 transition-colors block truncate">
                                  {displayName}
                                </span>
                                <span className="text-[11px] text-slate-500 block truncate">
                                  {displayMajor}
                                </span>
                                {matchingSkills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {matchingSkills.map((sk, sIdx) => (
                                      <span
                                        key={sIdx}
                                        className="text-[9px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/60 px-1.5 py-0.2 rounded-md"
                                      >
                                        {sk}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <ChevronRight
                              size={15}
                              className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0"
                            />
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
