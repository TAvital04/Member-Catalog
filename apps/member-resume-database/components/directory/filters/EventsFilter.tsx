"use client";

import React, { useState } from "react";
import CustomCheckbox from "../../common/CustomCheckbox";
import { Search } from "lucide-react";

interface EventsFilterProps {
  availableEvents: string[];
  selectedEvents: string[];
  onEventToggle: (eventTitle: string) => void;
  layout?: "side" | "top";
}

export default function EventsFilter({
  availableEvents,
  selectedEvents,
  onEventToggle,
  layout = "side",
}: EventsFilterProps) {
  const [search, setSearch] = useState("");

  const filteredEvents = availableEvents.filter((evt) =>
    evt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      {availableEvents.length > 4 && (
        <div className="relative mb-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-[11px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
          <Search size={11} className="absolute right-2.5 top-2 text-zinc-600 pointer-events-none" />
        </div>
      )}

      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto overflow-x-hidden no-scrollbar pr-1">
        {filteredEvents.map((evtTitle) => (
          <label
            key={evtTitle}
            className="flex items-start gap-2.5 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors group py-0.5"
          >
            <input
              type="checkbox"
              checked={selectedEvents.includes(evtTitle)}
              onChange={() => onEventToggle(evtTitle)}
              className="sr-only"
            />
            <div className="mt-0.5 shrink-0">
              <CustomCheckbox checked={selectedEvents.includes(evtTitle)} />
            </div>
            <span className="leading-snug">{evtTitle}</span>
          </label>
        ))}

        {filteredEvents.length === 0 && (
          <p className="text-[11px] text-zinc-600 py-1">No matching events found.</p>
        )}
      </div>
    </div>
  );
}
