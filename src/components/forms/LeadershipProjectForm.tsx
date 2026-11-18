"use client";

import React, { useState, useMemo } from "react";
import { X, Loader2, AlertCircle, Plus, Users, GitBranch, Wrench, Calendar } from "lucide-react";
import { IEEEProject, ProjectTool, ProjectMilestone, ProjectParticipant } from "@/data/projects";
import { Student } from "@/data/students";
import CustomDropdown from "@/components/common/CustomDropdown";

export interface LeadershipProjectFormProps {
  role: "standard" | "sponsor" | "admin";
  onClose: () => void;
  onProjectCreated: (project: IEEEProject) => void;
  students?: Student[];
}

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Completed", label: "Completed" },
];

export default function LeadershipProjectForm({
  role,
  onClose,
  onProjectCreated,
  students = [],
}: LeadershipProjectFormProps) {
  // Form State
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"Active" | "Completed">("Active");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");

  // Tools state
  const [tools, setTools] = useState<ProjectTool[]>([]);
  const [newToolName, setNewToolName] = useState("");

  // Milestones state
  const [timeline, setTimeline] = useState<ProjectMilestone[]>([
    {
      date: "",
      title: "Architecture & Component Selection",
      description: "Finalized bill of materials, power budget, and schematic specifications.",
      status: "completed",
    },
    {
      date: "",
      title: "Board Fabrication & Bring-up",
      description: "Assembling prototype revisions and executing benchtop signal testing.",
      status: "in_progress",
    },
  ]);
  const [newMilestoneDate, setNewMilestoneDate] = useState("");
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");
  const [newMilestoneStatus, setNewMilestoneStatus] = useState<ProjectMilestone["status"]>("in_progress");

  // Team roster state
  const [participants, setParticipants] = useState<ProjectParticipant[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedRoleTitle, setSelectedRoleTitle] = useState<"Lead" | "Member">("Member");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available students for team selection
  const studentOptions = useMemo(() => {
    const assignedIds = new Set(participants.map((p) => p.memberId));
    return students
      .filter((s) => !assignedIds.has(s.id))
      .map((s) => ({
        value: s.id,
        label: `${s.name} (${s.major || "Engineering"})`,
      }));
  }, [students, participants]);

  // Handlers for tools
  const handleAddTool = () => {
    const clean = newToolName.trim();
    if (!clean) return;
    if (!tools.some((t) => t.name.toLowerCase() === clean.toLowerCase())) {
      setTools((prev) => [...prev, { name: clean }]);
    }
    setNewToolName("");
  };

  const handleRemoveTool = (name: string) => {
    setTools((prev) => prev.filter((t) => t.name !== name));
  };

  // Handlers for milestones
  const handleAddMilestone = () => {
    const cleanTitle = newMilestoneTitle.trim();
    if (!cleanTitle) return;
    setTimeline((prev) => [
      ...prev,
      {
        date: newMilestoneDate.trim(),
        title: cleanTitle,
        description: newMilestoneDesc.trim() || "Scheduled engineering build sprint",
        status: newMilestoneStatus,
      },
    ]);
    setNewMilestoneTitle("");
    setNewMilestoneDate("");
    setNewMilestoneDesc("");
  };

  const handleRemoveMilestone = (index: number) => {
    setTimeline((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Handlers for team members
  const handleAddMember = () => {
    if (!selectedStudentId) return;
    const match = students.find((s) => s.id === selectedStudentId);
    if (!match) return;

    setParticipants((prev) => [
      ...prev,
      {
        memberId: match.id,
        name: match.name,
        email: match.email || "",
        major: match.major || "Engineering",
        roleTitle: selectedRoleTitle,
      },
    ]);
    setSelectedStudentId("");
  };

  const handleRemoveMember = (memberId: string) => {
    setParticipants((prev) => prev.filter((p) => p.memberId !== memberId));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanTitle = title.trim();
    const cleanDesc = description.trim();

    if (!cleanTitle) {
      setErrorMessage("Please enter a Project Title.");
      return;
    }
    if (cleanTitle.length < 5) {
      setErrorMessage("Project Title must be at least 5 characters long.");
      return;
    }
    if (!cleanDesc) {
      setErrorMessage("Please enter a Project Description.");
      return;
    }
    if (cleanDesc.length < 30) {
      setErrorMessage("Description must be at least 30 characters long to provide sufficient technical detail.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": role,
        },
        body: JSON.stringify({
          title: cleanTitle,
          status,
          tagline: tagline.trim() || undefined,
          description: cleanDesc,
          repositoryUrl: repositoryUrl.trim() || undefined,
          tools,
          timeline,
          participants,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create chapter project.");
      }

      onProjectCreated(result.data);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while creating the project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border border-neutral-300 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div>
            <h2 id="create-project-title" className="text-base font-black text-black">
              Create Chapter Project
            </h2>
            <p className="text-[11px] text-neutral-500 font-medium">
              Publish a new hardware or robotics build to the project showcase
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-neutral-500 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-neutral-100 border border-black text-black text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="text-black shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section: Core Information */}
          <div className="space-y-4">
            <div className="border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                Project Information
              </h3>
            </div>

            <div>
              <label htmlFor="proj-title" className="block text-xs font-bold text-black mb-1.5">
                Project Title <span className="text-neutral-500">*</span>
              </label>
              <input
                id="proj-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Autonomous Ground Vehicle Navigation"
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5">
                Status <span className="text-neutral-500">*</span>
              </label>
              <CustomDropdown
                value={status}
                onChange={(val) => setStatus(val as any)}
                options={STATUS_OPTIONS}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="proj-tagline" className="block text-xs font-bold text-black mb-1.5">
                Short Tagline
              </label>
              <input
                id="proj-tagline"
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Decentralized SLAM mapping and path planning micro-rover"
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label htmlFor="proj-description" className="block text-xs font-bold text-black mb-1.5">
                Technical Overview & Description <span className="text-neutral-500">*</span>
              </label>
              <textarea
                id="proj-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the engineering architecture, hardware components, power delivery, and firmware stack..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Section: Repositories & Demo Links */}
          <div className="space-y-4">
            <div className="border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                Repositories & Links
              </h3>
            </div>

            <div>
              <label htmlFor="proj-repo" className="block text-xs font-bold text-black mb-1.5">
                GitHub Repository URL
              </label>
              <input
                id="proj-repo"
                type="url"
                value={repositoryUrl}
                onChange={(e) => setRepositoryUrl(e.target.value)}
                placeholder="https://github.com/rso-usf/..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Section: Key Tech Stack & Tools */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                Key Tech Stack & Tools ({tools.length})
              </h3>
              <span className="text-[10.5px] text-neutral-500 font-medium">Showcase hardware & software</span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-neutral-50 border border-neutral-200">
              {tools.length === 0 ? (
                <span className="text-xs text-neutral-400 italic">No tools added yet. Add tool components below.</span>
              ) : (
                tools.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-black border border-neutral-300"
                  >
                    <span>{t.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(t.name)}
                      className="text-neutral-400 hover:text-black cursor-pointer ml-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTool();
                  }
                }}
                placeholder="e.g. FreeRTOS, KiCad, ROS 2"
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={handleAddTool}
                className="px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Section: Milestone Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                Milestone Timeline ({timeline.length})
              </h3>
            </div>

            <div className="space-y-2">
              {timeline.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-black">{m.title}</span>
                      {m.date ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-neutral-300 text-neutral-700">
                          {m.date}
                        </span>
                      ) : null}
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        [{m.status}]
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600">{m.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(idx)}
                    className="text-neutral-400 hover:text-black cursor-pointer shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                placeholder="Target Date (e.g. Q1 2026)"
                className="px-3 py-2 rounded-lg border border-neutral-300 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
              />
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Milestone Title"
                className="px-3 py-2 rounded-lg border border-neutral-300 text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
              />
              <div className="flex items-center gap-2">
                <CustomDropdown
                  value={newMilestoneStatus}
                  onChange={(val) => setNewMilestoneStatus(val as any)}
                  options={[
                    { value: "completed", label: "Completed" },
                    { value: "in_progress", label: "In Progress" },
                    { value: "upcoming", label: "Upcoming" },
                  ]}
                  className="w-full"
                />
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section: Team & Leads Roster */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                Project Team & Leads Roster ({participants.length})
              </h3>
              <span className="text-[10.5px] text-neutral-500 font-medium">Assign leads & builders</span>
            </div>

            <div className="space-y-2">
              {participants.length === 0 ? (
                <div className="p-4 rounded-lg bg-neutral-50 border border-dashed border-neutral-200 text-center text-xs text-neutral-500">
                  No members assigned yet. Select candidates below to populate the team roster.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {participants.map((p) => (
                    <div
                      key={p.memberId}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-xs"
                    >
                      <span className="font-bold text-black">{p.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700">
                        {p.roleTitle}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(p.memberId)}
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
              <CustomDropdown
                value={selectedRoleTitle}
                onChange={(val) => setSelectedRoleTitle(val as any)}
                options={[
                  { value: "Lead", label: "Role: Lead" },
                  { value: "Member", label: "Role: Member" },
                ]}
                className="w-40"
              />
              <button
                type="button"
                onClick={handleAddMember}
                disabled={!selectedStudentId}
                className="px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 border border-neutral-300 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus size={14} />
                <span>Assign</span>
              </button>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-neutral-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-black disabled:opacity-50 text-white text-xs font-bold cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Creating Project...</span>
                </>
              ) : (
                <span>Publish Project</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
