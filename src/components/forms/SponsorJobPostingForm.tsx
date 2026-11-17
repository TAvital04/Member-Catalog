"use client";

/**
 * @file SponsorJobPostingForm.tsx — Form 4 in IEEE UCF Sequential Form Architecture
 * @description Dedicated Corporate Sponsor & Employer Job Creation Form.
 * Allows corporate partners and RSO Leadership to publish engineering opportunities
 * linked to verified student skills, with structured bullet-list builders for
 * responsibilities, requirements, and benefits.
 */

import React, { useState, useMemo } from "react";
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Plus,
  Check,
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  Lock,
  ListChecks,
  Gift,
  Globe,
  Mail,
  Trash2,
} from "lucide-react";
import { JobPosting, JobTemplate, JOB_TEMPLATES } from "@/data/jobs";
import { CURRENT_CHAPTER_SPONSORS } from "@/data/sponsors";
import { AuthSession } from "@/hooks/useRoleManager";
import CustomDropdown from "@/components/common/CustomDropdown";

export interface SponsorJobPostingFormProps {
  role: "standard" | "sponsor" | "admin";
  onClose: () => void;
  onJobCreated: (newJob: JobPosting) => void;
  session?: AuthSession | null;
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
  "Power Electronics",
  "MATLAB",
  "Computer Vision",
  "Microcontrollers",
  "KiCAD",
];

const LOCATION_TYPE_OPTIONS = [
  { value: "On-site", label: "On-site" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Remote", label: "Remote" },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "Full-time", label: "Full-time" },
  { value: "Internship", label: "Internship" },
  { value: "Co-op", label: "Co-op" },
  { value: "Part-time", label: "Part-time" },
];

const EXPERIENCE_LEVEL_OPTIONS = [
  { value: "Internship / Student", label: "Internship / Student" },
  { value: "Entry Level", label: "Entry Level" },
  { value: "Mid Level", label: "Mid Level" },
];

export default function SponsorJobPostingForm({
  role,
  onClose,
  onJobCreated,
  session,
}: SponsorJobPostingFormProps) {
  // Determine if company name is locked based on sponsor session
  const isSponsorRole = role === "sponsor";
  const defaultCompanyName = session?.organization || (isSponsorRole ? "Official Chapter Sponsor" : "");
  const defaultEmail = session?.email || "";

  // Template State
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Section 1: Company & Recruiter Details
  const [companyName, setCompanyName] = useState<string>(defaultCompanyName);
  const [employerEmail, setEmployerEmail] = useState<string>(defaultEmail);
  const [employerWebsite, setEmployerWebsite] = useState<string>("");
  const [department, setDepartment] = useState<string>("Engineering");

  // Section 2: Role Specifications
  const [title, setTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("Orlando, FL");
  const [locationType, setLocationType] = useState<"On-site" | "Hybrid" | "Remote">("On-site");
  const [employmentType, setEmploymentType] = useState<"Full-time" | "Internship" | "Co-op" | "Part-time">("Full-time");
  const [experienceLevel, setExperienceLevel] = useState<"Internship / Student" | "Entry Level" | "Mid Level">("Entry Level");
  const [salaryRange, setSalaryRange] = useState<string>("$80,000 - $95,000 / yr");

  // Section 3: Overview & Skills
  const [description, setDescription] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState<string>("");

  // Section 4: Dynamic Bullet List Builders
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [newResponsibility, setNewResponsibility] = useState<string>("");

  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState<string>("");

  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState<string>("");

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available sponsors for Admin selector dropdown
  const sponsorOptions = useMemo(() => {
    return CURRENT_CHAPTER_SPONSORS.map((s) => ({
      value: s.name,
      label: `${s.name} (${s.tier} Partner)`,
    }));
  }, []);

  // Quick 1-Click Template Filler
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
    setResponsibilities([...tpl.responsibilities]);
    setRequirements([...tpl.requirements]);
    setBenefits([...(tpl.benefits || [])]);

    if (!companyName) {
      setCompanyName(session?.organization || "Engineering Partner");
    }
    if (!employerEmail) {
      setEmployerEmail(session?.email || "recruiting@company.com");
    }
  };

  // Skill Handlers
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;
    if (e) e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !selectedSkills.includes(clean)) {
      setSelectedSkills((prev) => [...prev, clean]);
      setCustomSkillInput("");
    }
  };

  // Responsibility Handlers
  const handleAddResponsibility = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;
    if (e) e.preventDefault();
    const clean = newResponsibility.trim();
    if (clean) {
      setResponsibilities((prev) => [...prev, clean]);
      setNewResponsibility("");
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    setResponsibilities((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Requirement Handlers
  const handleAddRequirement = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;
    if (e) e.preventDefault();
    const clean = newRequirement.trim();
    if (clean) {
      setRequirements((prev) => [...prev, clean]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Benefit Handlers
  const handleAddBenefit = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && "key" in e && e.key !== "Enter") return;
    if (e) e.preventDefault();
    const clean = newBenefit.trim();
    if (clean) {
      setBenefits((prev) => [...prev, clean]);
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const trimmedTitle = title.trim();
    const trimmedCompany = companyName.trim();
    const trimmedEmail = employerEmail.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle || trimmedTitle.length < 5) {
      setErrorMessage("Job Title is required (minimum 5 characters).");
      return;
    }

    if (!trimmedCompany) {
      setErrorMessage("Company Name is required.");
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMessage("A valid recruiter contact email address is required.");
      return;
    }

    if (!trimmedDesc || trimmedDesc.length < 30) {
      setErrorMessage("Role Overview must be at least 30 characters in length.");
      return;
    }

    if (responsibilities.length === 0) {
      setErrorMessage("Please add at least 1 key responsibility.");
      return;
    }

    if (requirements.length === 0) {
      setErrorMessage("Please add at least 1 qualification or requirement.");
      return;
    }

    if (selectedSkills.length === 0) {
      setErrorMessage("Please select or add at least 1 technical skill tag.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: trimmedTitle,
        companyName: trimmedCompany,
        employerEmail: trimmedEmail,
        employerWebsite: employerWebsite.trim() || undefined,
        department: department.trim() || "Engineering",
        location: location.trim() || "Orlando, FL",
        locationType,
        employmentType,
        experienceLevel,
        salaryRange: salaryRange.trim() || undefined,
        description: trimmedDesc,
        responsibilities,
        requirements,
        benefits,
        skillsRequired: selectedSkills,
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": role === "admin" ? "admin" : "sponsor",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create corporate job posting.");
      }

      onJobCreated(data.data);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while publishing the posting.");
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
        aria-label="Create Corporate Job Posting"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-neutral-300 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden cursor-default animate-scale-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close job creation form"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-600 hover:text-black transition-all shadow-xs cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
            <Briefcase size={14} className="text-black" />
            <span>Form 4: Corporate Sponsor Opportunity</span>
            {isSponsorRole && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-black border border-neutral-300">
                <Lock size={10} /> Verified Partner Session
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
            Post an Engineering Opportunity
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Publish direct internships, co-ops, or full-time roles matching IEEE UCF member portfolios and workshop-verified skills.
          </p>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} noValidate className="overflow-y-auto p-6 flex flex-col gap-6 flex-1 text-black">
          {/* Quick Role Templates Bar */}
          <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-300 flex flex-col gap-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black flex items-center gap-1.5">
                <Sparkles size={13} className="text-black" />
                1-Click Role Presets (Fill in Seconds)
              </span>
              <span className="text-[11px] text-neutral-500">Auto-populates requirements & skills</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {JOB_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all shadow-2xs ${
                    selectedTemplate === tpl.name
                      ? "bg-black text-white border-black font-bold"
                      : "bg-white hover:bg-neutral-200 text-black border-neutral-300"
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Company & Recruiter Details */}
          <div className="space-y-4">
            <div className="border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={14} />
                <span>1. Company & Recruiter Details</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-black">Company Name *</label>
                {isSponsorRole ? (
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={companyName}
                      aria-required="true"
                      className="w-full text-xs p-2.5 pr-8 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-800 cursor-not-allowed font-semibold"
                    />
                    <Lock size={13} className="absolute right-3 top-3 text-neutral-500" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      aria-required="true"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Lockheed Martin, TI, or Startup Inc."
                      className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                    />
                    {sponsorOptions.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[10px] text-neutral-500 font-medium">Quick Pick Sponsor:</span>
                        <CustomDropdown
                          value={companyName}
                          onChange={(val) => setCompanyName(val)}
                          options={sponsorOptions}
                          variant="filter"
                          buttonClassName="text-[11px] py-1 px-2 border-neutral-300 bg-neutral-50"
                          aria-label="Select Onboarded Sponsor"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Recruiter Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1">
                  <Mail size={12} /> Recruiter Contact Email *
                </label>
                <input
                  type="text"
                  inputMode="email"
                  aria-required="true"
                  value={employerEmail}
                  onChange={(e) => setEmployerEmail(e.target.value)}
                  placeholder="recruiting@company.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Department / Division */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-black">Department / Division</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Avionics & Flight Software"
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>

              {/* Corporate Careers URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1">
                  <Globe size={12} /> Careers / Application Portal URL
                </label>
                <input
                  type="text"
                  value={employerWebsite}
                  onChange={(e) => setEmployerWebsite(e.target.value)}
                  placeholder="https://company.com/careers"
                  className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role Specifications */}
          <div className="space-y-4">
            <div className="border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={14} />
                <span>2. Role Specifications & Arrangement</span>
              </h3>
            </div>

            {/* Job Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-black">Job Title *</label>
              <input
                type="text"
                aria-required="true"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Embedded Firmware Engineer"
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
              />
            </div>

            {/* Location, Location Type, Employment Type, Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-black flex items-center gap-1">
                  <MapPin size={12} /> Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Orlando, FL"
                  className="w-full text-xs h-[36px] px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-black">Work Arrangement</label>
                <CustomDropdown
                  value={locationType}
                  onChange={(val) => setLocationType(val as any)}
                  options={LOCATION_TYPE_OPTIONS}
                  variant="input"
                  className="w-full"
                  aria-label="Location Type"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-black">Employment Type</label>
                <CustomDropdown
                  value={employmentType}
                  onChange={(val) => setEmploymentType(val as any)}
                  options={EMPLOYMENT_TYPE_OPTIONS}
                  variant="input"
                  className="w-full"
                  aria-label="Employment Type"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-black">Experience Level</label>
                <CustomDropdown
                  value={experienceLevel}
                  onChange={(val) => setExperienceLevel(val as any)}
                  options={EXPERIENCE_LEVEL_OPTIONS}
                  variant="input"
                  className="w-full"
                  aria-label="Experience Level"
                />
              </div>
            </div>

            {/* Salary / Compensation Range */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-black flex items-center gap-1">
                <DollarSign size={12} /> Compensation / Salary Range
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $85,000 - $100,000 / yr or $32 - $38 / hr"
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Section 3: Role Overview & Matching Skills */}
          <div className="space-y-4">
            <div className="border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks size={14} />
                <span>3. Role Overview & Required Skills</span>
              </h3>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-black">Role Overview & Mission *</label>
              <textarea
                aria-required="true"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview of the mission, day-to-day engineering impact, and scope of work..."
                className="w-full text-xs p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-black resize-none font-sans"
              />
            </div>

            {/* Smart Skill Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-black">
                  Required Technical Skills * ({selectedSkills.length} selected)
                </label>
                <span className="text-[11px] text-neutral-500">Matches candidate workshop-earned skills</span>
              </div>

              {/* Selected skills pill box */}
              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                {selectedSkills.length === 0 ? (
                  <span className="text-xs text-neutral-400 italic">No skills selected yet. Click quick tags below or add custom skills.</span>
                ) : (
                  selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white text-black border border-neutral-300 shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        aria-label={`Remove skill ${skill}`}
                        className="text-neutral-400 hover:text-black cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Suggested quick chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {COMMON_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                        isSelected
                          ? "bg-black text-white border border-black font-bold"
                          : "bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black"
                      }`}
                    >
                      {skill} {isSelected && "✓"}
                    </button>
                  );
                })}
              </div>

              {/* Custom skill adder */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={handleAddCustomSkill}
                  placeholder="Type custom skill and press Enter..."
                  className="text-xs p-2.5 rounded-xl border border-neutral-300 flex-1 focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomSkill()}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold border border-neutral-300 cursor-pointer"
                >
                  + Add Skill
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Dynamic Bullet List Builders */}
          <div className="space-y-5">
            <div className="border-b border-neutral-200 pb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks size={14} />
                <span>4. Structured Responsibilities, Qualifications & Benefits</span>
              </h3>
            </div>

            {/* Dynamic Builder: Responsibilities */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-black">
                  Key Responsibilities * ({responsibilities.length})
                </label>
                <span className="text-[11px] text-neutral-500">At least 1 item required</span>
              </div>

              <div className="space-y-1.5">
                {responsibilities.map((resp, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-neutral-400 font-bold">•</span>
                      <span className="text-neutral-800">{resp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsibility(idx)}
                      aria-label="Remove responsibility"
                      className="text-neutral-400 hover:text-black cursor-pointer shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyDown={handleAddResponsibility}
                  placeholder="e.g. Design high-speed PCB layouts in Altium Designer..."
                  className="flex-1 text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => handleAddResponsibility()}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Dynamic Builder: Requirements */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-black">
                  Qualifications & Requirements * ({requirements.length})
                </label>
                <span className="text-[11px] text-neutral-500">At least 1 item required</span>
              </div>

              <div className="space-y-1.5">
                {requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-neutral-400 font-bold">•</span>
                      <span className="text-neutral-800">{req}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(idx)}
                      aria-label="Remove requirement"
                      className="text-neutral-400 hover:text-black cursor-pointer shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyDown={handleAddRequirement}
                  placeholder="e.g. B.S. in Electrical or Computer Engineering..."
                  className="flex-1 text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => handleAddRequirement()}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Dynamic Builder: Benefits */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-black flex items-center gap-1">
                  <Gift size={13} /> Benefits & Perks ({benefits.length})
                </label>
                <span className="text-[11px] text-neutral-500">Optional items</span>
              </div>

              <div className="space-y-1.5">
                {benefits.map((ben, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-neutral-400 font-bold">•</span>
                      <span className="text-neutral-800">{ben}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      aria-label="Remove benefit"
                      className="text-neutral-400 hover:text-black cursor-pointer shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyDown={handleAddBenefit}
                  placeholder="e.g. Competitive hourly wage with relocation housing stipend..."
                  className="flex-1 text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => handleAddBenefit()}
                  className="px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Item</span>
                </button>
              </div>
            </div>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-semibold border border-neutral-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Publishing Opportunity...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Publish Opportunity</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
