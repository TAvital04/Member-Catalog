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
  Award,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { IEEEEvent, EventAttendee } from "@/data/events";
import { Student } from "@/data/students";
import Avatar from "@/components/common/Avatar";
import Tooltip from "@/components/common/Tooltip";
import { studentHasSkill } from "@/lib/skillMatching";

interface EventModalProps {
  event: IEEEEvent | null;
  onClose: () => void;
  onSelectMember?: (memberId: string) => void;
  students?: Student[];
  role?: "standard" | "sponsor" | "admin";
  canFilter?: boolean;
}

export default function EventModal({
  event,
  onClose,
  onSelectMember,
  students = [],
  role,
  canFilter: explicitCanFilter,
}: EventModalProps) {
  const canFilter = explicitCanFilter ?? (role ? role !== "standard" : true);
  const [activeTab, setActiveTab] = useState<"overview" | "attendees">("overview");

  // Handle escape key
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] z-10 animate-scale-in">
        {/* Header Banner */}
        <div className="relative px-8 pt-8 pb-6 border-b border-slate-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer group"
            aria-label="Close modal"
          >
            <X size={18} />
            <Tooltip content="Close (Esc)" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {event.category}
            </span>
            {event.partner && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center gap-1">
                <Building2 size={11} />
                <span>Partner: {event.partner}</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight pr-10 leading-snug">
            {event.title}
          </h2>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <Calendar size={13} className="text-amber-600" />
              <span>{formatDate(event.startTime)}</span>
            </div>
            {event.startTime && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock size={13} className="text-slate-400" />
                <span>
                  {formatTime(event.startTime)}
                  {event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-500">
              <MapPin size={13} className="text-slate-400" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-8 border-b border-slate-100 bg-white gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "overview"
                ? "border-amber-600 text-amber-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <BookOpen size={14} />
            <span>Overview & Topics</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("attendees")}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "attendees"
                ? "border-amber-600 text-amber-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <Users size={14} />
            <span>
              Attending Members{" "}
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                {event.attendees.length}
              </span>
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto space-y-7 max-h-[calc(88vh-160px)]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Event Description */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Technical Outcomes & Topics */}
              {event.learningOutcomes && event.learningOutcomes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Skills & Key Topics Covered
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium leading-relaxed marker:text-slate-400">
                    {event.learningOutcomes.map((item, idx) => (
                      <li key={idx} className="pl-0.5">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills directly connected to candidates */}
              {((event.skills && event.skills.length > 0) || (event.tags && event.tags.length > 0)) && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Skills
                    </h3>
                    {canFilter && (
                      <span className="text-[11px] text-slate-400">
                        Click skill to filter candidates
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {((event.skills && event.skills.length > 0) ? event.skills : event.tags).map((skill, idx) => {
                      const matchingStudents =
                        students?.filter((s) => studentHasSkill(s.skills, skill)) || [];
                      const studentCount = matchingStudents.length;

                      const pillContent = (
                        <>
                          <span>{skill}</span>
                          {studentCount > 0 && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${canFilter ? "bg-slate-200/70 group-hover:bg-amber-200/80 text-slate-600 group-hover:text-amber-900 transition-colors" : "bg-slate-200/70 text-slate-600"}`}>
                              {studentCount}
                            </span>
                          )}
                        </>
                      );

                      return canFilter ? (
                        <Link
                          key={idx}
                          href={`/?skills=${encodeURIComponent(skill)}`}
                          onClick={() => onClose()}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 px-3 py-1.5 rounded-full border border-slate-200/80 hover:border-amber-300 transition-all cursor-pointer group shadow-2xs"
                          title={`Explore ${studentCount} candidate${studentCount === 1 ? "" : "s"} with ${skill}`}
                        >
                          {pillContent}
                        </Link>
                      ) : (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs select-none"
                          title={`Skill: ${skill}`}
                        >
                          {pillContent}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "attendees" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  {event.attendees.length} Verified Member Attendee{event.attendees.length === 1 ? "" : "s"}
                </span>
                <span className="text-[11px] text-slate-400">
                  Click any candidate to inspect their portfolio
                </span>
              </div>

              {event.attendees.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200/80">
                  No member attendance records logged for this session yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.attendees.map((attendee, idx) => {
                    const student = getStudentForAttendee(attendee);
                    const displayName = student?.name || attendee.name;
                    const displayMajor = student?.major || attendee.major;
                    const eventSkillsList =
                      (event.skills && event.skills.length > 0) ? event.skills : event.tags || [];
                    const studentSkills = student?.skills || [];
                    const matchingSkills = eventSkillsList.filter((sk) =>
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
                        className="p-3 bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-between text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <Avatar
                            name={displayName}
                            size="md"
                            className="shrink-0 bg-slate-100 text-slate-800 font-bold border border-slate-200"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors block truncate">
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
                          className="text-slate-300 group-hover:text-amber-600 transition-colors shrink-0"
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
  );
}
