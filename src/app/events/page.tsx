"use client";

/**
 * @file page.tsx — IEEE UCF Chapter Events & Technical Workshops Page
 * @description Dedicated chapter events catalog featuring hands-on technical workshops,
 * corporate partner tech talks (Lockheed Martin, TI, Northrop Grumman, L3Harris), hackathons,
 * and verified student attendance rosters with candidate portfolio integration.
 */

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { Calendar } from "lucide-react";
import DirectoryNavbar from "@/components/directory/DirectoryNavbar";
import DirectoryStatsHeader from "@/components/directory/DirectoryStatsHeader";
import { useThemeManager } from "@/hooks/useThemeManager";
import { useRoleManager } from "@/hooks/useRoleManager";
import { useStudentData } from "@/hooks/useStudentData";
import EventModal from "@/components/modal/event/EventModal";
import PortfolioModal from "@/components/modal/PortfolioModal";
import EventCard from "@/components/events/EventCard";
import EventFilters from "@/components/events/EventFilters";
import EmptyState from "@/components/common/EmptyState";
import { IEEEEvent, SAMPLE_IEEE_EVENTS } from "@/data/events";
import { Student } from "@/data/students";

function IEEEEventsContent() {
  const { theme, toggleTheme } = useThemeManager();
  const { role, handleRoleChange, isAdmin } = useRoleManager();
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
      return "";
    }
  };

  // Filter events by search, category, and timeframe
  const now = useMemo(() => new Date().getTime(), []);

  const filteredEvents = useMemo(() => {
    return eventsList.filter((evt) => {
      // Category filter
      if (selectedCategory !== "All" && evt.category !== selectedCategory) {
        return false;
      }

      // Timeframe filter
      if (timeFilter !== "all" && evt.startTime) {
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
  const handleSelectMember = (memberId?: string, name?: string, email?: string) => {
    if (!students || students.length === 0) return;

    const cleanId = (memberId || "").toLowerCase().trim();
    const cleanName = (name || "").toLowerCase().trim();
    const cleanEmail = (email || "").toLowerCase().trim();

    let match = cleanId ? students.find((s) => s.id.toLowerCase() === cleanId) : undefined;
    if (!match && cleanEmail) {
      match = students.find((s) => s.email.toLowerCase() === cleanEmail);
    }
    if (!match && cleanName) {
      match = students.find((s) => s.name.toLowerCase() === cleanName);
    }
    if (!match && cleanId) {
      const slugName = cleanId.replace(/^mem-/, "").replace(/^(cand|candidate)-/, "").replace(/[-_]/g, " ");
      match = students.find((s) => {
        const sName = s.name.toLowerCase();
        return (
          sName === slugName ||
          sName.includes(slugName) ||
          slugName.includes(sName) ||
          s.email.toLowerCase().includes(slugName.replace(/\s+/g, ""))
        );
      });
    }

    if (match) {
      setSelectedMemberStudent(match);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Primary Header Navbar */}
      <DirectoryNavbar
        role={role}
        theme={theme}
        roleDropdownOpen={false}
        setRoleDropdownOpen={() => {}}
        toggleTheme={toggleTheme}
        handleRoleChange={handleRoleChange}
      />

      {/* Directory Page Header */}
      <DirectoryStatsHeader
        title="IEEE UCF Events & Workshops"
        description="Explore upcoming and semester technical workshops, general body meetings, industry tech talks with corporate defense and semiconductor partners, hackathons, and verified student attendance records."
      />

      {/* Search & Category Filter Controls */}
      <EventFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
      />

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
          <EmptyState
            icon={<Calendar size={32} />}
            headline="No matching events found"
            subtext="Try adjusting your search terms or clearing your category filters to view other chapter events."
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedCategory("All");
              setSearchQuery("");
              setTimeFilter("all");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={setActiveModalEvent}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </main>

      {/* Event Details Deep-Dive Modal */}
      {activeModalEvent && (
        <EventModal
          event={activeModalEvent}
          role={role}
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
          adminMode={isAdmin}
          role={role}
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
