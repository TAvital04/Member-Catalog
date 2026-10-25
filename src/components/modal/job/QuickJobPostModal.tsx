"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Building2,
  Briefcase,
  MapPin,
  DollarSign,
  Plus,
  Check,
  Send,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { JobPosting, JOB_TEMPLATES, JobTemplate } from "@/data/jobs";
import CustomDropdown from "@/components/common/CustomDropdown";

interface QuickJobPostModalProps {
  onClose: () => void;
  onJobCreated: (newJob: JobPosting) => void;
}

const COMMON_SKILLS = [
  "C++",
  "Python",
  "Embedded Systems",
  "RTOS",
  "PCB Layout",
  "Altium Designer",
  "Verilog",
  "FPGA",
  "ROS",
  "Robotics",
  "Linux",
  "Git",
  "Circuit Design",
  "Soldering",
  "RF Engineering",
  "Wireless Communications",
  "Power Electronics",
  "MATLAB",
  "Computer Vision",
];

export default function QuickJobPostModal({
  onClose,
  onJobCreated,
}: QuickJobPostModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [employerEmail, setEmployerEmail] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [location, setLocation] = useState("Orlando, FL");
  const [locationType, setLocationType] = useState<"On-site" | "Hybrid" | "Remote">("On-site");
  const [employmentType, setEmploymentType] = useState<"Full-time" | "Internship" | "Co-op" | "Part-time">("Full-time");
  const [experienceLevel, setExperienceLevel] = useState<"Internship / Student" | "Entry Level" | "Mid Level">("Entry Level");
  const [salaryRange, setSalaryRange] = useState("$80,000 - $95,000 / yr");
  const [description, setDescription] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Quick template filler
  const handleApplyTemplate = (tpl: JobTemplate) => {
    setSelectedTemplate(tpl.name);
    setTitle(tpl.title);
    setDepartment(tpl.department);
    setEmploymentType(tpl.employmentType);
    setLocationType(tpl.locationType);
    setExperienceLevel(tpl.experienceLevel);
    setSalaryRange(tpl.salaryRange);
    setSelectedSkills(tpl.skillsRequired);
    setDescription(tpl.description);
    setResponsibilitiesText(tpl.responsibilities.join("\n"));
    setRequirementsText(tpl.requirements.join("\n"));
    if (!companyName) {
      setCompanyName("Engineering Partner");
    }
    if (!employerEmail) {
      setEmployerEmail("recruiting@company.com");
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || !("key" in e)) {
      e.preventDefault();
      const trimmed = customSkillInput.trim();
      if (trimmed && !selectedSkills.includes(trimmed)) {
        setSelectedSkills([...selectedSkills, trimmed]);
        setCustomSkillInput("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName || !description || !employerEmail) {
      setErrorMsg("Please fill in Title, Company, Email, and Description.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const responsibilities = responsibilitiesText
        .split("\n")
        .map((s) => s.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean);

      const requirements = requirementsText
        .split("\n")
        .map((s) => s.replace(/^[-•*]\s*/, "").trim())
        .filter(Boolean);

      const payload = {
        title,
        companyName,
        employerEmail,
        department,
        location,
        locationType,
        employmentType,
        experienceLevel,
        salaryRange,
        description,
        responsibilities,
        requirements,
        skillsRequired: selectedSkills,
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create job posting");
      }

      onJobCreated(data.data);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create posting");
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
        aria-label="Create Quick Job Posting"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden cursor-default animate-scale-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close job creation modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white border border-slate-200/90 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all shadow-xs cursor-pointer active:scale-90"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <Building2 size={14} className="text-amber-600" />
            <span>Employer Fast-Track Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            Post an Engineering Opportunity
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pick a quick 1-click template or enter role specs to source verified IEEE UCF candidates.
          </p>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex flex-col gap-5 flex-1">
          {/* Quick Templates Bar */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col gap-2 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Sparkles size={14} className="text-amber-600" />
              <span>1-Click Role Presets (Fill in Seconds)</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {JOB_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    selectedTemplate === tpl.name
                      ? "bg-slate-900 text-white border-slate-900 font-bold"
                      : "bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  ⚡ {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Company & Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Lockheed Martin, TI, or Startup Inc."
                className="text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Recruiter Email *</label>
              <input
                type="email"
                required
                value={employerEmail}
                onChange={(e) => setEmployerEmail(e.target.value)}
                placeholder="recruiting@company.com"
                className="text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Job Title & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Embedded Firmware Engineer"
                className="text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Department / Team</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Avionics & Flight Software"
                className="text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Location & Types */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Orlando, FL"
                className="text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Location Type</label>
              <CustomDropdown
                value={locationType}
                onChange={(val) => setLocationType(val as any)}
                options={["On-site", "Hybrid", "Remote"]}
                size="md"
                className="w-full"
                aria-label="Location Type"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Employment Type</label>
              <CustomDropdown
                value={employmentType}
                onChange={(val) => setEmploymentType(val as any)}
                options={["Full-time", "Internship", "Co-op", "Part-time"]}
                size="md"
                className="w-full"
                aria-label="Employment Type"
              />
            </div>
          </div>

          {/* Salary / Compensation */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Salary / Hourly Compensation Range</label>
            <input
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g. $85,000 - $100,000 / yr or $30 - $35 / hr"
              className="text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Smart Skill Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700">Required Skills & Technologies</label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? "bg-amber-500/15 border border-amber-500 text-slate-900 font-bold"
                        : "bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600"
                    }`}
                  >
                    {skill} {isSelected && "✓"}
                  </button>
                );
              })}
            </div>
            {/* Custom skill add */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={handleAddCustomSkill}
                placeholder="Type custom skill and press Enter..."
                className="text-xs p-2 rounded-lg border border-slate-200 flex-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Role Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of the mission, day-to-day work, and impact of the role..."
              className="text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-sans"
            />
          </div>

          {/* Responsibilities & Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Responsibilities (One per line)</label>
              <textarea
                rows={3}
                value={responsibilitiesText}
                onChange={(e) => setResponsibilitiesText(e.target.value)}
                placeholder="Develop embedded drivers...&#10;Conduct bench validation...&#10;Collaborate with systems engineers..."
                className="text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-sans"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Requirements (One per line)</label>
              <textarea
                rows={3}
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                placeholder="B.S. in CpE or EE...&#10;Hands-on C/C++ experience...&#10;Familiar with oscilloscopes..."
                className="text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-sans"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm active:scale-98 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Publish Job Posting</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
