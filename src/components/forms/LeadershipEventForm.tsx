"use client";

import React, { useState, useMemo } from "react";
import { X, Loader2, Sparkles, AlertCircle, Plus, Users } from "lucide-react";
import { IEEEEvent, EventCategory, EventAttendee } from "@/data/events";
import { Student } from "@/data/students";
import { CURRENT_CHAPTER_SPONSORS } from "@/data/sponsors";
import { canAwardSkills } from "@/lib/skills";
import CustomDropdown from "@/components/common/CustomDropdown";

export interface LeadershipEventFormProps {
  role: "standard" | "sponsor" | "admin";
  onClose: () => void;
  onEventCreated: (event: IEEEEvent) => void;
  students?: Student[];
}

const CATEGORY_OPTIONS: Array<{ value: EventCategory; label: string }> = [
  { value: "Technical Workshop", label: "Technical Workshop" },
  { value: "Industry Tech Talk", label: "Industry Tech Talk" },
  { value: "General Body Meeting", label: "General Body Meeting" },
  { value: "Competition & Hackathon", label: "Competition & Hackathon" },
  { value: "Career & Networking", label: "Career & Networking" },
  { value: "Special Event & Tour", label: "Special Event & Tour" },
];

const STANDARD_CHAPTER_POINTS = 15;

export default function LeadershipEventForm({
  role,
  onClose,
  onEventCreated,
  students = [],
}: LeadershipEventFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("Technical Workshop");
  const [partner, setPartner] = useState("None / Chapter Hosted");
  const [description, setDescription] = useState("");
  const [requiresDues, setRequiresDues] = useState(false);

  // Workshop skills state
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Event leads state
  const [leads, setLeads] = useState<EventAttendee[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available students for event lead selection
  const studentOptions = useMemo(() => {
    const assignedIds = new Set(leads.map((l) => l.memberId));
    return (students || [])
      .filter((s) => !assignedIds.has(s.id))
      .map((s) => ({
        value: s.id,
        label: `${s.name} (${s.major || "Engineering"})`,
      }));
  }, [students, leads]);

  const handleAddLead = () => {
    if (!selectedStudentId) return;
    const match = (students || []).find((s) => s.id === selectedStudentId);
    if (!match) return;

    setLeads((prev) => [
      ...prev,
      {
        memberId: match.id,
        name: match.name,
        email: match.email,
        major: match.major || "Engineering",
        role: "Lead",
      },
    ]);
    setSelectedStudentId("");
  };

  const handleRemoveLead = (memberId: string) => {
    setLeads((prev) => prev.filter((l) => l.memberId !== memberId));
  };

  // Partner dropdown options
  const partnerOptions = useMemo(() => {
    const list = [{ value: "None / Chapter Hosted", label: "None / Chapter Hosted" }];
    CURRENT_CHAPTER_SPONSORS.forEach((sp) => {
      list.push({ value: sp.name, label: sp.name });
    });
    return list;
  }, []);

  const handleAddSkill = (skillToAdd: string) => {
    const clean = skillToAdd.trim();
    if (!clean) return;
    if (!skills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setSkills((prev) => [...prev, clean]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    if (!cleanTitle) {
      setErrorMessage("Please enter an Event Title.");
      return;
    }
    if (cleanTitle.length < 5) {
      setErrorMessage("Event Title must be at least 5 characters long.");
      return;
    }
    if (!cleanDesc) {
      setErrorMessage("Please enter an Event Description.");
      return;
    }
    if (cleanDesc.length < 25) {
      setErrorMessage("Description must be at least 25 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": role,
        },
        body: JSON.stringify({
          title: cleanTitle,
          category,
          partner: partner === "None / Chapter Hosted" ? undefined : partner,
          description: cleanDesc,
          skills: canAwardSkills(category) ? skills : [],
          pointsAwarded: STANDARD_CHAPTER_POINTS,
          requiresDues,
          attendees: leads,
          leads,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create event.");
      }

      onEventCreated(result.data);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "An error occurred while creating the event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-modal-overlay backdrop-blur-md cursor-pointer animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create Chapter Event / Workshop"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden cursor-default animate-scale-in"
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close event creation modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/90 text-slate-500 hover:text-slate-900 transition-all shadow-xs cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 bg-white flex items-center gap-3.5 shrink-0 pr-12">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-black bg-white text-black">
                <span>RSO Leadership</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-black mt-0.5">
              Create Chapter Event / Workshop
            </h2>
            <p className="text-xs text-neutral-600">
              Publish a chapter event or technical workshop. Member attendance is logged automatically.
            </p>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} noValidate className="overflow-y-auto p-6 flex flex-col gap-6 flex-1">
          {/* Section: Event Identity */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider border-b border-neutral-200 pb-2">
              Event Details & Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 flex flex-col gap-1.5">
                <label htmlFor="event-title" className="text-[11px] font-bold text-black uppercase tracking-wider">
                  Event Title *
                </label>
                <input
                  id="event-title"
                  type="text"
                  aria-required="true"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hands-On Altium PCB Design Workshop"
                  className="w-full h-[36px] px-3.5 py-2 text-xs rounded-lg bg-white border border-neutral-300 text-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="sm:col-span-4 flex flex-col gap-1.5">
                <label htmlFor="event-category" className="text-[11px] font-bold text-black uppercase tracking-wider">
                  Category *
                </label>
                <CustomDropdown
                  id="event-category"
                  value={category}
                  onChange={(val) => setCategory(val as EventCategory)}
                  options={CATEGORY_OPTIONS}
                  variant="input"
                  className="w-full"
                  aria-label="Event Category"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-7 flex flex-col gap-1.5">
                <label htmlFor="event-partner" className="text-[11px] font-bold text-black uppercase tracking-wider">
                  Corporate Partner Host (Optional)
                </label>
                <CustomDropdown
                  id="event-partner"
                  value={partner}
                  onChange={(val) => setPartner(val)}
                  options={partnerOptions}
                  variant="input"
                  className="w-full"
                  aria-label="Corporate Partner Host"
                />
              </div>

              <div className="sm:col-span-5 flex items-center gap-2 pt-2 sm:pt-5">
                <input
                  id="event-dues"
                  type="checkbox"
                  checked={requiresDues}
                  onChange={(e) => setRequiresDues(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black cursor-pointer"
                />
                <label htmlFor="event-dues" className="text-xs text-black font-semibold cursor-pointer select-none">
                  Requires Active Chapter Dues
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="event-desc" className="text-[11px] font-bold text-black uppercase tracking-wider">
                Event Description & Syllabus *
              </label>
              <textarea
                id="event-desc"
                rows={4}
                aria-required="true"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive technical summary of the lab topics, software tools used, and engineering concepts covered during this session..."
                className="w-full px-3.5 py-2 text-xs rounded-lg bg-white border border-neutral-300 text-black focus:outline-none focus:ring-1 focus:ring-black resize-none"
              />
            </div>
          </div>

          {/* Section: Workshop Skills */}
          <div className="flex flex-col gap-3.5 p-4 rounded-xl bg-neutral-50 border border-neutral-300">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                Skills Awarded to Attendees
              </h3>
              <span className="text-[10.5px] text-neutral-600 font-medium">
                {canAwardSkills(category) ? "Workshop Skills" : "Non-Workshop Event"}
              </span>
            </div>

            {canAwardSkills(category) ? (
              <>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  In accordance with chapter policy, a member&apos;s skills are updated <strong>exclusively when they attend a Technical Workshop for that skill</strong>. Member attendance is logged automatically.
                </p>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-white border border-neutral-300">
                  {skills.length === 0 ? (
                    <span className="text-xs text-neutral-400 italic">No skills added yet. Type a skill below and press Add.</span>
                  ) : (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-neutral-100 border border-neutral-300 text-black"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          className="hover:text-neutral-500 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Skill Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill(newSkillInput);
                      }
                    }}
                    placeholder="Type a skill (e.g. FreeRTOS, STM32) and press Add..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-lg bg-white border border-neutral-300 text-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(newSkillInput)}
                    className="px-3.5 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Add Skill</span>
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-neutral-600 italic py-1">
                This event is categorized as a {category}. Only <strong>Technical Workshops</strong> award technical skills to attending members.
              </p>
            )}
          </div>

          {/* Section: Event Leads */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                Event Leads ({leads.length})
              </h3>
              <span className="text-[10.5px] text-neutral-500 font-medium">Assign chapter leads</span>
            </div>

            <div className="space-y-2">
              {leads.length === 0 ? (
                <div className="p-4 rounded-lg bg-neutral-50 border border-dashed border-neutral-200 text-center text-xs text-neutral-500">
                  No event leads assigned yet. Select candidates below to assign leads.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {leads.map((lead) => (
                    <div
                      key={lead.memberId}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-xs"
                    >
                      <span className="font-bold text-black">{lead.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700">
                        Lead
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLead(lead.memberId)}
                        aria-label={`Remove lead ${lead.name}`}
                        className="text-neutral-400 hover:text-black cursor-pointer ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <CustomDropdown
                value={selectedStudentId}
                onChange={(val) => setSelectedStudentId(val)}
                options={studentOptions.length > 0 ? studentOptions : [{ value: "", label: "All candidates assigned" }]}
                className="flex-1 min-w-[200px]"
              />
              <button
                type="button"
                onClick={handleAddLead}
                disabled={!selectedStudentId}
                className="px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 border border-neutral-300 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus size={14} />
                <span>Assign Lead</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-neutral-100 border border-black text-black text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-300 text-black font-bold text-xs transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Publishing Event...</span>
                </>
              ) : (
                <span>Create Event</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
