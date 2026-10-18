"use client";

/**
 * @file page.tsx — IEEE UCF Chapter Events & Technical Workshops Page
 * @description Dedicated chapter events catalog featuring hands-on technical workshops,
 * corporate partner tech talks (Lockheed Martin, TI, Northrop Grumman, L3Harris), hackathons,
 * and verified student attendance rosters with candidate portfolio integration.
 */

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Users,
  Search,
  X,
  ChevronRight,
  Filter,
  Sparkles,
  Award,
  Layers,
  CheckCircle2,
} from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import DirectoryStatsHeader from "@/components/directory/DirectoryStatsHeader";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useStudentData } from "@/hooks/useStudentData";
import EventModal from "@/components/modal/event/EventModal";
import PortfolioModal from "@/components/modal/PortfolioModal";
import { IEEEEvent, EventCategory, SAMPLE_IEEE_EVENTS } from "@/data/events";
import { Student } from "@/data/students";

function IEEEEventsContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { students } = useStudentData();
  const [eventsList, setEventsList] = useState<IEEEEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<"all" | "upcoming" | "past">("all");

  // Modal inspection states
  const [activeModalEvent, setActiveModalEvent] = useState<IEEEEvent | null>(null);
  const [selectedMemberStudent, setSelectedMemberStudent] = useState<Student | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setEventsList(json.data);
        } else {
          setEventsList(SAMPLE_IEEE_EVENTS);
        }
      } catch (err) {
        console.warn("Could not load /api/events, using fallback events:", err);
        setEventsList(SAMPLE_IEEE_EVENTS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const categories = [
    "All",
    "Technical Workshop",
    "Industry Tech Talk",
    "General Body Meeting",
    "Competition & Hackathon",
    "Career & Networking",
    "Special Event & Tour",
  ];

  // Helper date formatting
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-US", {
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
      });
    } catch {
      return isoString;
    }
  };

  const now = new Date().getTime();

  const filteredEvents = useMemo(() => {
    return eventsList.filter((evt) => {
      // Category filter
      if (selectedCategory !== "All" && evt.category !== selectedCategory) {
        return false;
      }

      // Time filter (upcoming vs past)
      if (timeFilter !== "all") {
        const evtTime = new Date(evt.startTime).getTime();
        if (timeFilter === "upcoming" && evtTime < now) return false;
        if (timeFilter === "past" && evtTime >= now) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        const matchesLocation = evt.location.toLowerCase().includes(q);
        const matchesPartner = evt.partner?.toLowerCase().includes(q) || false;
        const matchesTags = (evt.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesLocation && !matchesPartner && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [eventsList, selectedCategory, timeFilter, searchQuery, now]);

  // Handle member click inside event modal
  const handleSelectMember = (memberId: string) => {
    const student = students.find(
      (s) => s.id === memberId || s.email.toLowerCase().includes(memberId.toLowerCase())
    );
    if (student) {
      setSelectedMemberStudent(student);
    }
  };

  // Stats summary counts
  const totalEvents = eventsList.length;
  const workshopCount = eventsList.filter((e) => e.category === "Technical Workshop").length;
  const partnerCount = eventsList.filter((e) => Boolean(e.partner)).length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 relative pb-16 overflow-x-hidden">
      {/* Primary Header Navbar */}
      <DirectoryNavbar
        role="standard"
        theme={theme}
        roleDropdownOpen={false}
        setRoleDropdownOpen={() => {}}
        toggleTheme={toggleTheme}
        handleRoleChange={() => {}}
      />

      {/* Directory Page Header */}
      <DirectoryStatsHeader
        title="RSO UCF Events & Workshops"
        description="Explore upcoming and semester technical workshops, general body meetings, industry tech talks with corporate defense and semiconductor partners, hackathons, and verified student attendance records."
      />

      {/* Search & Category Filter Controls */}
      <section className="max-w-7xl w-full mx-auto px-4 mb-5">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          {/* Search Box */}
          <div className="relative w-full grow">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search events by title, partner, topic, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Time Filter Pill */}
          <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-2xs shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setTimeFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeFilter === "all"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("upcoming")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeFilter === "upcoming"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("past")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeFilter === "past"
                  ? "bg-slate-100 text-slate-900 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Past Sessions
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Events Grid */}
      <main className="max-w-7xl w-full mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs animate-pulse h-64 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-slate-200 rounded-md" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-md" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-xs">
            <Calendar size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No matching events found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or clearing your category filters to view other chapter
              events.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setTimeFilter("all");
              }}
              className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => {
              const attendees = event.attendees || [];

              return (
                <div
                  key={event.id}
                  onClick={() => setActiveModalEvent(event)}
                  className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer gap-5"
                >
                  <div className="space-y-3.5">
                    {/* Category & Partner Badge Header */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {event.category}
                      </span>
                      {event.partner && (
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 flex items-center gap-1">
                          <Building2 size={11} />
                          <span className="truncate max-w-[130px]">{event.partner}</span>
                        </span>
                      )}
                    </div>

                    {/* Event Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Time & Location Details */}
                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Calendar size={13} className="text-amber-600 shrink-0" />
                        <span>{formatDate(event.startTime)}</span>
                        {event.startTime && (
                          <span className="text-slate-400 font-normal">
                            • {formatTime(event.startTime)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Card Footer: Attendees & Action */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    {/* Attendee Counter */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Users size={14} className="text-slate-400" />
                      <span>
                        {attendees.length > 0
                          ? `${attendees.length} member${attendees.length === 1 ? "" : "s"}`
                          : "Open attendance"}
                      </span>
                    </div>

                    {/* Action Arrow */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-amber-800 transition-colors">
                      <span>Details</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Event Details Deep-Dive Modal */}
      {activeModalEvent && (
        <EventModal
          event={activeModalEvent}
          onClose={() => setActiveModalEvent(null)}
          onSelectMember={handleSelectMember}
          students={students}
        />
      )}

      {/* Candidate Profile Deep-Dive Modal (if attendee clicked) */}
      {selectedMemberStudent && (
        <PortfolioModal
          student={selectedMemberStudent}
          onClose={() => setSelectedMemberStudent(null)}
          adminMode={false}
          onToggleFlag={() => {}}
        />
      )}
    </div>
  );
}

export default function IEEEEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading RSO UCF Events Catalog...
        </div>
      }
    >
      <IEEEEventsContent />
    </Suspense>
  );
}
