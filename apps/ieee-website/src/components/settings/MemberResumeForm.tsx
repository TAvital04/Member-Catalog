'use client';

import React, { useState, useEffect } from 'react';
import { MemberResumeFormData, validateMemberResumeForm } from '@ieee/shared';
import { User, Link as LinkIcon, GraduationCap, Code, Briefcase, FolderGit2, Users, Award, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface MemberResumeFormProps {
  memberId?: string;
  initialData?: Partial<MemberResumeFormData>;
}

const DEFAULT_FORM_DATA: MemberResumeFormData = {
	fullName: '',
	email: '',
	status: 'Seeking Internship',
	bio: '',
	resumePdfUrl: '',
	socialLinks: [
		{ platformName: 'LinkedIn', profileUrl: '' },
		{ platformName: 'GitHub', profileUrl: '' },
	],
	education: [
		{
			schoolName: 'University of Central Florida',
			degreeType: 'Bachelor of Science',
			major: 'Computer Science',
			gpa: 3.8,
			gpaScale: 4.0,
			startDate: '2022-08-22',
			endDate: '2026-05-02',
			isCurrent: true,
			description: 'Dean\'s List. Coursework: Operating Systems, Data Structures, Database Systems.',
		},
	],
	skills: ['TypeScript', 'React', 'Python', 'Git', 'PostgreSQL'],
	workExperience: [],
	projects: [],
	clubMemberships: [
		{
			clubName: 'IEEE UCF Student Chapter',
			roleTitle: 'Active Member',
			startDate: '2023-08-20',
			isActive: true,
			description: 'Participating in technical workshops and project build nights.',
		},
	],
	certifications: [],
};

export default function MemberResumeForm({ memberId = 'current-member', initialData }: MemberResumeFormProps) {
	const [formData, setFormData] = useState<MemberResumeFormData>(DEFAULT_FORM_DATA);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [skillInput, setSkillInput] = useState<string>('');
	const [projectLinkInput, setProjectLinkInput] = useState<Record<number, string>>({});
	const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

	useEffect(() => {
		if (initialData) {
			setFormData((prev) => ({ ...prev, ...initialData }));
		}
	}, [initialData]);

	const tabs = [
		{ label: 'Personal Info', icon: User },
		{ label: 'Social Links', icon: LinkIcon },
		{ label: 'Education', icon: GraduationCap },
		{ label: 'Skills', icon: Code },
		{ label: 'Work Experience', icon: Briefcase },
		{ label: 'Projects', icon: FolderGit2 },
		{ label: 'Clubs', icon: Users },
		{ label: 'Certifications', icon: Award },
	];

	const handleTextChange = (field: keyof MemberResumeFormData, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (validationErrors[field]) {
			setValidationErrors((prev) => {
				const updated = { ...prev };
				delete updated[field];
				return updated;
			});
		}
	};

	const handleAddSkill = () => {
		const trimmed = skillInput.trim();
		if (!trimmed) return;
		if (trimmed.length > 50) {
			setStatusMessage({ text: 'Skill tag must be under 50 characters', isError: true });
			return;
		}
		if (formData.skills.length >= 50) {
			setStatusMessage({ text: 'Maximum 50 skills allowed', isError: true });
			return;
		}
		if (!formData.skills.includes(trimmed)) {
			setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
			setSkillInput('');
		}
	};

	const handleRemoveSkill = (skillToRemove: string) => {
		setFormData((prev) => ({
			...prev,
			skills: prev.skills.filter((s) => s !== skillToRemove),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const validation = validateMemberResumeForm(formData);

		if (!validation.isValid) {
			setValidationErrors(validation.errors);
			setStatusMessage({
				text: 'Please resolve validation errors before saving.',
				isError: true,
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch('/api/member/resume', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...formData, memberId }),
			});

			const result = await response.json();
			setIsSubmitting(false);

			if (result.success) {
				setValidationErrors({});
				setStatusMessage({
					text: 'Resume candidate profile saved successfully!',
					isError: false,
				});
			} else {
				setStatusMessage({
					text: result.error || 'Failed to save candidate profile.',
					isError: true,
				});
			}
		} catch {
			setIsSubmitting(false);
			setStatusMessage({
				text: 'Network error occurred while saving resume profile.',
				isError: true,
			});
		}
	};

	return (
		<div className="w-full bg-black/40 border border-white/15 rounded-xl p-6 text-white my-6 backdrop-blur-md shadow-2xl">
			{/* Form Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-white/10 gap-4">
				<div>
					<h2 className="text-2xl font-[heading-font] text-[var(--ieee-dark-yellow)] flex items-center gap-2">
						<User className="w-6 h-6" />
            Member Resume Database Profile
					</h2>
					<p className="text-xs text-white/70 mt-1">
            Comprehensive profile submission form matching IEEE UCF Member Catalog specification (Data.md).
					</p>
				</div>

				<button
					type="button"
					onClick={handleSubmit}
					disabled={isSubmitting}
					className="inline-flex items-center gap-2 bg-[var(--ieee-dark-yellow)] hover:bg-[var(--ieee-bright-yellow)] text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded shadow-lg transition-all disabled:opacity-50 cursor-pointer"
				>
					<Save className="w-4 h-4" />
					{isSubmitting ? 'Saving...' : 'Save Profile'}
				</button>
			</div>

			{statusMessage && (
				<div
					className={`mt-4 p-3 rounded text-xs font-semibold ${
						statusMessage.isError ? 'bg-red-900/50 border border-red-500/30 text-red-200' : 'bg-emerald-900/50 border border-emerald-500/30 text-emerald-200'
					}`}
				>
					{statusMessage.text}
				</div>
			)}

			{/* Navigation Tabs */}
			<div className="flex overflow-x-auto gap-2 py-4 border-b border-white/10 no-scrollbar">
				{tabs.map((tab, idx) => {
					const Icon = tab.icon;
					const isActive = activeTab === idx;
					return (
						<button
							key={tab.label}
							type="button"
							onClick={() => setActiveTab(idx)}
							className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
								isActive
									? 'bg-[var(--ieee-dark-yellow)] text-black'
									: 'text-white/70 hover:text-white hover:bg-white/10'
							}`}
						>
							<Icon className="w-3.5 h-3.5" />
							{tab.label}
						</button>
					);
				})}
			</div>

			<form onSubmit={handleSubmit} className="pt-6 space-y-6">
				{/* TAB 0: Personal Info */}
				{activeTab === 0 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">1. Personal & Contact Information</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-bold uppercase mb-1 text-white/80">Full Name *</label>
								<input
									type="text"
									value={formData.fullName}
									onChange={(e) => handleTextChange('fullName', e.target.value)}
									placeholder="e.g. Jane Knight"
									className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--ieee-dark-yellow)]"
								/>
								{validationErrors.fullName && (
									<p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {validationErrors.fullName}</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-bold uppercase mb-1 text-white/80">Email Address *</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) => handleTextChange('email', e.target.value)}
									placeholder="jane@knights.ucf.edu"
									className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--ieee-dark-yellow)]"
								/>
								{validationErrors.email && (
									<p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {validationErrors.email}</p>
								)}
							</div>

							<div>
								<label className="block text-xs font-bold uppercase mb-1 text-white/80">Status *</label>
								<select
									value={formData.status}
									onChange={(e) => handleTextChange('status', e.target.value as any)}
									className="w-full bg-black/80 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--ieee-dark-yellow)]"
								>
									<option value="Seeking Internship">Seeking Internship</option>
									<option value="Seeking Full-time">Seeking Full-time</option>
									<option value="Employed">Employed</option>
								</select>
							</div>

							<div>
								<label className="block text-xs font-bold uppercase mb-1 text-white/80">Resume PDF Link *</label>
								<input
									type="url"
									value={formData.resumePdfUrl}
									onChange={(e) => handleTextChange('resumePdfUrl', e.target.value)}
									placeholder="https://drive.google.com/your-resume.pdf"
									className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--ieee-dark-yellow)]"
								/>
								{validationErrors.resumePdfUrl && (
									<p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {validationErrors.resumePdfUrl}</p>
								)}
							</div>
						</div>

						<div>
							<div className="flex justify-between items-center mb-1">
								<label className="block text-xs font-bold uppercase text-white/80">Personal Bio *</label>
								<span className="text-xs text-white/50">{formData.bio.length} / 300</span>
							</div>
							<textarea
								rows={3}
								maxLength={300}
								value={formData.bio}
								onChange={(e) => handleTextChange('bio', e.target.value)}
								placeholder="Brief elevator pitch or summary of your engineering interests..."
								className="w-full bg-white/5 border border-white/20 rounded p-3 text-sm text-white focus:outline-none focus:border-[var(--ieee-dark-yellow)]"
							/>
							{validationErrors.bio && (
								<p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {validationErrors.bio}</p>
							)}
						</div>
					</div>
				)}

				{/* TAB 1: Social Links */}
				{activeTab === 1 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">2. Professional & Social Links (Up to 5)</h3>
						{formData.socialLinks.map((link, idx) => (
							<div key={idx} className="flex gap-3 items-center bg-white/5 p-3 rounded border border-white/10">
								<input
									type="text"
									value={link.platformName}
									onChange={(e) => {
										const updated = [...formData.socialLinks];
										updated[idx].platformName = e.target.value;
										handleTextChange('socialLinks', updated);
									}}
									placeholder="Platform (e.g. GitHub)"
									className="w-1/3 bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
								/>
								<input
									type="url"
									value={link.profileUrl}
									onChange={(e) => {
										const updated = [...formData.socialLinks];
										updated[idx].profileUrl = e.target.value;
										handleTextChange('socialLinks', updated);
									}}
									placeholder="https://..."
									className="w-2/3 bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
								/>
								<button
									type="button"
									onClick={() => {
										const updated = formData.socialLinks.filter((_, i) => i !== idx);
										handleTextChange('socialLinks', updated);
									}}
									className="text-xs text-red-400 hover:text-red-300 font-bold px-2 flex items-center gap-1 cursor-pointer"
								>
									<Trash2 className="w-4 h-4" /> Remove
								</button>
							</div>
						))}
						{formData.socialLinks.length < 5 && (
							<button
								type="button"
								onClick={() =>
									handleTextChange('socialLinks', [...formData.socialLinks, { platformName: 'Portfolio', profileUrl: '' }])
								}
								className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-2 rounded flex items-center gap-1 cursor-pointer"
							>
								<Plus className="w-4 h-4" /> Add Social Link
							</button>
						)}
					</div>
				)}

				{/* TAB 2: Education */}
				{activeTab === 2 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">3. Education Entries</h3>
						{formData.education.map((edu, idx) => (
							<div key={idx} className="bg-white/5 p-4 rounded border border-white/10 space-y-3">
								<div className="flex justify-between items-center pb-2 border-b border-white/10">
									<span className="text-xs font-bold text-[var(--ieee-dark-yellow)]">Education Entry #{idx + 1}</span>
									{formData.education.length > 1 && (
										<button
											type="button"
											onClick={() => {
												const updated = formData.education.filter((_, i) => i !== idx);
												handleTextChange('education', updated);
											}}
											className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
										>
											<Trash2 className="w-3.5 h-3.5" /> Remove
										</button>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
									<div>
										<label className="text-xs text-white/60">
											School Name * {idx === 0 && <span className="text-[var(--ieee-dark-yellow)] font-bold">(Primary Profile Degree)</span>}
										</label>
										<input
											type="text"
											value={idx === 0 ? 'University of Central Florida' : edu.schoolName}
											disabled={idx === 0}
											onChange={(e) => {
												const updated = [...formData.education];
												updated[idx].schoolName = e.target.value;
												handleTextChange('education', updated);
											}}
											placeholder="University of Central Florida"
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white disabled:opacity-80"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">Degree Type</label>
										<input
											type="text"
											value={edu.degreeType}
											onChange={(e) => {
												const updated = [...formData.education];
												updated[idx].degreeType = e.target.value;
												handleTextChange('education', updated);
											}}
											placeholder="Bachelor of Science"
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">Major *</label>
										<input
											type="text"
											value={edu.major}
											onChange={(e) => {
												const updated = [...formData.education];
												updated[idx].major = e.target.value;
												handleTextChange('education', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
									<div>
										<label className="text-xs text-white/60">GPA</label>
										<input
											type="number"
											step="0.01"
											min="0"
											max={edu.gpaScale ?? 4.0}
											value={edu.gpa ?? ''}
											onChange={(e) => {
												const updated = [...formData.education];
												updated[idx].gpa = e.target.value ? parseFloat(e.target.value) : undefined;
												handleTextChange('education', updated);
											}}
											placeholder="3.85"
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">GPA Scale *</label>
										{idx === 0 ? (
											<input
												type="text"
												value="4.0 (UCF Standard)"
												disabled
												className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white/70 disabled:opacity-80"
											/>
										) : (
											<select
												value={edu.gpaScale ?? 4.0}
												onChange={(e) => {
													const updated = [...formData.education];
													updated[idx].gpaScale = parseFloat(e.target.value);
													handleTextChange('education', updated);
												}}
												className="w-full bg-black/80 border border-white/20 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--ieee-dark-yellow)]"
											>
												<option value={4.0}>4.0 Scale</option>
												<option value={5.0}>5.0 Scale</option>
												<option value={6.0}>6.0 Scale</option>
											</select>
										)}
									</div>
									<div>
										<label className="text-xs text-white/60">Start Date *</label>
										<input
											type="date"
											value={edu.startDate}
											onChange={(e) => {
												const updated = [...formData.education];
												updated[idx].startDate = e.target.value;
												handleTextChange('education', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">End Date</label>
										<input
											type="date"
											disabled={edu.isCurrent}
											value={edu.endDate ?? ''}
											onChange={(e) => {
												const updated = [...formData.education];
												updated[idx].endDate = e.target.value;
												handleTextChange('education', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white disabled:opacity-40"
										/>
									</div>
								</div>

								<div className="flex items-center gap-2 pt-1">
									<input
										type="checkbox"
										id={`edu-current-${idx}`}
										checked={edu.isCurrent}
										onChange={(e) => {
											const updated = [...formData.education];
											updated[idx].isCurrent = e.target.checked;
											if (e.target.checked) updated[idx].endDate = undefined;
											handleTextChange('education', updated);
										}}
										className="rounded text-[var(--ieee-dark-yellow)] focus:ring-0"
									/>
									<label htmlFor={`edu-current-${idx}`} className="text-xs text-white/80 cursor-pointer">Currently enrolled here</label>
								</div>

								<div>
									<label className="text-xs text-white/60">Description / Coursework / Honors (Max 500 chars)</label>
									<textarea
										rows={2}
										maxLength={500}
										value={edu.description ?? ''}
										onChange={(e) => {
											const updated = [...formData.education];
											updated[idx].description = e.target.value;
											handleTextChange('education', updated);
										}}
										placeholder="Honors, coursework, or special designations..."
										className="w-full bg-black/60 border border-white/20 rounded p-2 text-xs text-white"
									/>
								</div>
							</div>
						))}

						<button
							type="button"
							onClick={() =>
								handleTextChange('education', [
									...formData.education,
									{ schoolName: '', degreeType: 'Bachelor of Science', major: '', startDate: '2024-01-01', isCurrent: true },
								])
							}
							className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-2 rounded flex items-center gap-1 cursor-pointer"
						>
							<Plus className="w-4 h-4" /> Add Education Entry
						</button>
					</div>
				)}

				{/* TAB 3: Skills */}
				{activeTab === 3 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">4. Skills List (Up to 50 skills)</h3>
						<div className="flex gap-2">
							<input
								type="text"
								value={skillInput}
								onChange={(e) => setSkillInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
								placeholder="Type a skill tag (e.g. React, Altium, Python) and press Add..."
								className="flex-1 bg-white/5 border border-white/20 rounded px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[var(--ieee-dark-yellow)]"
							/>
							<button
								type="button"
								onClick={handleAddSkill}
								className="bg-[var(--ieee-dark-yellow)] hover:bg-[var(--ieee-bright-yellow)] text-black font-bold px-4 py-2 rounded text-xs uppercase cursor-pointer"
							>
                Add Skill
							</button>
						</div>
						<div className="flex flex-wrap gap-2 pt-2">
							{formData.skills.map((skill) => (
								<span
									key={skill}
									className="inline-flex items-center gap-1.5 bg-white/10 text-[var(--ieee-dark-yellow)] border border-white/20 text-xs px-3 py-1 rounded-full"
								>
									{skill}
									<button
										type="button"
										onClick={() => handleRemoveSkill(skill)}
										className="hover:text-red-400 font-bold ml-1 cursor-pointer"
									>
                    ×
									</button>
								</span>
							))}
						</div>
					</div>
				)}

				{/* TAB 4: Work Experience */}
				{activeTab === 4 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">5. Work Experience (Up to 10 entries)</h3>
						{formData.workExperience.map((exp, idx) => (
							<div key={idx} className="bg-white/5 p-4 rounded border border-white/10 space-y-3">
								<div className="flex justify-between items-center pb-2 border-b border-white/10">
									<span className="text-xs font-bold text-[var(--ieee-dark-yellow)]">Experience #{idx + 1}</span>
									<button
										type="button"
										onClick={() => {
											const updated = formData.workExperience.filter((_, i) => i !== idx);
											handleTextChange('workExperience', updated);
										}}
										className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
									>
										<Trash2 className="w-3.5 h-3.5" /> Remove
									</button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="text-xs text-white/60">Company Name *</label>
										<input
											type="text"
											value={exp.companyName}
											onChange={(e) => {
												const updated = [...formData.workExperience];
												updated[idx].companyName = e.target.value;
												handleTextChange('workExperience', updated);
											}}
											placeholder="Lockheed Martin"
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">Job Title *</label>
										<input
											type="text"
											value={exp.jobTitle}
											onChange={(e) => {
												const updated = [...formData.workExperience];
												updated[idx].jobTitle = e.target.value;
												handleTextChange('workExperience', updated);
											}}
											placeholder="Software Engineering Intern"
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="text-xs text-white/60">Start Date *</label>
										<input
											type="date"
											value={exp.startDate}
											onChange={(e) => {
												const updated = [...formData.workExperience];
												updated[idx].startDate = e.target.value;
												handleTextChange('workExperience', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">End Date</label>
										<input
											type="date"
											disabled={exp.isCurrentJob}
											value={exp.endDate ?? ''}
											onChange={(e) => {
												const updated = [...formData.workExperience];
												updated[idx].endDate = e.target.value;
												handleTextChange('workExperience', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white disabled:opacity-40"
										/>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										id={`exp-current-${idx}`}
										checked={exp.isCurrentJob}
										onChange={(e) => {
											const updated = [...formData.workExperience];
											updated[idx].isCurrentJob = e.target.checked;
											if (e.target.checked) updated[idx].endDate = undefined;
											handleTextChange('workExperience', updated);
										}}
										className="rounded text-[var(--ieee-dark-yellow)] focus:ring-0"
									/>
									<label htmlFor={`exp-current-${idx}`} className="text-xs text-white/80 cursor-pointer">I currently work here</label>
								</div>

								<div>
									<label className="text-xs text-white/60">Description (Max 1000 chars)</label>
									<textarea
										rows={3}
										maxLength={1000}
										value={exp.description}
										onChange={(e) => {
											const updated = [...formData.workExperience];
											updated[idx].description = e.target.value;
											handleTextChange('workExperience', updated);
										}}
										placeholder="Bullet points summarizing accomplishments, technologies used, and impact..."
										className="w-full bg-black/60 border border-white/20 rounded p-2 text-xs text-white"
									/>
								</div>
							</div>
						))}

						{formData.workExperience.length < 10 && (
							<button
								type="button"
								onClick={() =>
									handleTextChange('workExperience', [
										...formData.workExperience,
										{ companyName: '', jobTitle: '', startDate: '2024-01-01', isCurrentJob: true, description: '' },
									])
								}
								className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-2 rounded flex items-center gap-1 cursor-pointer"
							>
								<Plus className="w-4 h-4" /> Add Experience Entry
							</button>
						)}
					</div>
				)}

				{/* TAB 5: Projects */}
				{activeTab === 5 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">6. Key Engineering Projects</h3>
						{formData.projects.map((proj, idx) => (
							<div key={idx} className="bg-white/5 p-4 rounded border border-white/10 space-y-3">
								<div className="flex justify-between items-center pb-2 border-b border-white/10">
									<span className="text-xs font-bold text-[var(--ieee-dark-yellow)]">Project #{idx + 1}</span>
									<button
										type="button"
										onClick={() => {
											const updated = formData.projects.filter((_, i) => i !== idx);
											handleTextChange('projects', updated);
										}}
										className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
									>
										<Trash2 className="w-3.5 h-3.5" /> Remove
									</button>
								</div>

								<div>
									<label className="text-xs text-white/60">Project Name *</label>
									<input
										type="text"
										value={proj.projectName}
										onChange={(e) => {
											const updated = [...formData.projects];
											updated[idx].projectName = e.target.value;
											handleTextChange('projects', updated);
										}}
										placeholder="e.g. Distributed Key-Value Store with Raft"
										className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="text-xs text-white/60">Start Date *</label>
										<input
											type="date"
											value={proj.startDate}
											onChange={(e) => {
												const updated = [...formData.projects];
												updated[idx].startDate = e.target.value;
												handleTextChange('projects', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">End Date</label>
										<input
											type="date"
											disabled={proj.isOngoing}
											value={proj.endDate ?? ''}
											onChange={(e) => {
												const updated = [...formData.projects];
												updated[idx].endDate = e.target.value;
												handleTextChange('projects', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white disabled:opacity-40"
										/>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										id={`proj-ongoing-${idx}`}
										checked={proj.isOngoing}
										onChange={(e) => {
											const updated = [...formData.projects];
											updated[idx].isOngoing = e.target.checked;
											if (e.target.checked) updated[idx].endDate = undefined;
											handleTextChange('projects', updated);
										}}
										className="rounded text-[var(--ieee-dark-yellow)] focus:ring-0"
									/>
									<label htmlFor={`proj-ongoing-${idx}`} className="text-xs text-white/80 cursor-pointer">Project is ongoing</label>
								</div>

								<div>
									<label className="text-xs text-white/60">Project Description (Max 1000 chars)</label>
									<textarea
										rows={3}
										maxLength={1000}
										value={proj.description}
										onChange={(e) => {
											const updated = [...formData.projects];
											updated[idx].description = e.target.value;
											handleTextChange('projects', updated);
										}}
										placeholder="Detailed summary of architecture, tools, and technical outcomes..."
										className="w-full bg-black/60 border border-white/20 rounded p-2 text-xs text-white"
									/>
								</div>

								<div>
									<label className="text-xs text-white/60 block mb-1">Project URLs (GitHub repos, demos)</label>
									<div className="flex gap-2 mb-2">
										<input
											type="url"
											value={projectLinkInput[idx] || ''}
											onChange={(e) => setProjectLinkInput({ ...projectLinkInput, [idx]: e.target.value })}
											placeholder="https://github.com/username/project"
											className="flex-1 bg-black/60 border border-white/20 rounded px-3 py-1 text-xs text-white"
										/>
										<button
											type="button"
											onClick={() => {
												const linkVal = (projectLinkInput[idx] || '').trim();
												if (!linkVal) return;
												const updated = [...formData.projects];
												updated[idx].projectLinks = [...(updated[idx].projectLinks || []), linkVal];
												handleTextChange('projects', updated);
												setProjectLinkInput({ ...projectLinkInput, [idx]: '' });
											}}
											className="bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-1 rounded text-xs cursor-pointer"
										>
                      + Add URL
										</button>
									</div>
									<div className="flex flex-wrap gap-2">
										{proj.projectLinks?.map((plink, pidx) => (
											<span key={pidx} className="inline-flex items-center gap-1.5 bg-black/70 text-gray-300 text-xs px-2.5 py-1 rounded border border-gray-700">
												{plink}
												<button
													type="button"
													onClick={() => {
														const updated = [...formData.projects];
														updated[idx].projectLinks = updated[idx].projectLinks.filter((_, i) => i !== pidx);
														handleTextChange('projects', updated);
													}}
													className="text-red-400 font-bold hover:text-red-300 cursor-pointer ml-1"
												>
                          ×
												</button>
											</span>
										))}
									</div>
								</div>
							</div>
						))}

						<button
							type="button"
							onClick={() =>
								handleTextChange('projects', [
									...formData.projects,
									{ projectName: '', description: '', startDate: '2024-01-01', isOngoing: true, projectLinks: [] },
								])
							}
							className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-2 rounded flex items-center gap-1 cursor-pointer"
						>
							<Plus className="w-4 h-4" /> Add Project
						</button>
					</div>
				)}

				{/* TAB 6: Clubs */}
				{activeTab === 6 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">7. Club Memberships & Student Chapters</h3>
						{formData.clubMemberships.map((club, idx) => (
							<div key={idx} className="bg-white/5 p-4 rounded border border-white/10 space-y-3">
								<div className="flex justify-between items-center pb-2 border-b border-white/10">
									<span className="text-xs font-bold text-[var(--ieee-dark-yellow)]">Club Entry #{idx + 1}</span>
									<button
										type="button"
										onClick={() => {
											const updated = formData.clubMemberships.filter((_, i) => i !== idx);
											handleTextChange('clubMemberships', updated);
										}}
										className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
									>
										<Trash2 className="w-3.5 h-3.5" /> Remove
									</button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="text-xs text-white/60">Club / Organization Name *</label>
										<input
											type="text"
											value={club.clubName}
											onChange={(e) => {
												const updated = [...formData.clubMemberships];
												updated[idx].clubName = e.target.value;
												handleTextChange('clubMemberships', updated);
											}}
											placeholder="IEEE UCF Student Chapter"
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">Role / Title *</label>
										<input
											type="text"
											value={club.roleTitle}
											onChange={(e) => {
												const updated = [...formData.clubMemberships];
												updated[idx].roleTitle = e.target.value;
												handleTextChange('clubMemberships', updated);
											}}
											placeholder="Active Member / Hardware Chair"
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="text-xs text-white/60">Start Date *</label>
										<input
											type="date"
											value={club.startDate}
											onChange={(e) => {
												const updated = [...formData.clubMemberships];
												updated[idx].startDate = e.target.value;
												handleTextChange('clubMemberships', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">End Date</label>
										<input
											type="date"
											disabled={club.isActive}
											value={club.endDate ?? ''}
											onChange={(e) => {
												const updated = [...formData.clubMemberships];
												updated[idx].endDate = e.target.value;
												handleTextChange('clubMemberships', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white disabled:opacity-40"
										/>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										id={`club-active-${idx}`}
										checked={club.isActive}
										onChange={(e) => {
											const updated = [...formData.clubMemberships];
											updated[idx].isActive = e.target.checked;
											if (e.target.checked) updated[idx].endDate = undefined;
											handleTextChange('clubMemberships', updated);
										}}
										className="rounded text-[var(--ieee-dark-yellow)] focus:ring-0"
									/>
									<label htmlFor={`club-active-${idx}`} className="text-xs text-white/80 cursor-pointer">Currently active member</label>
								</div>

								<div>
									<label className="text-xs text-white/60">Description (Max 500 chars)</label>
									<textarea
										rows={2}
										maxLength={500}
										value={club.description ?? ''}
										onChange={(e) => {
											const updated = [...formData.clubMemberships];
											updated[idx].description = e.target.value;
											handleTextChange('clubMemberships', updated);
										}}
										placeholder="Responsibilities, events organized, or contributions..."
										className="w-full bg-black/60 border border-white/20 rounded p-2 text-xs text-white"
									/>
								</div>
							</div>
						))}

						<button
							type="button"
							onClick={() =>
								handleTextChange('clubMemberships', [
									...formData.clubMemberships,
									{ clubName: 'IEEE UCF Student Chapter', roleTitle: 'Active Member', startDate: '2023-08-20', isActive: true },
								])
							}
							className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-2 rounded flex items-center gap-1 cursor-pointer"
						>
							<Plus className="w-4 h-4" /> Add Club Membership
						</button>
					</div>
				)}

				{/* TAB 7: Certifications */}
				{activeTab === 7 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">8. Certifications & Credentials</h3>
						{formData.certifications.map((cert, idx) => (
							<div key={idx} className="bg-white/5 p-4 rounded border border-white/10 space-y-3">
								<div className="flex justify-between items-center pb-2 border-b border-white/10">
									<span className="text-xs font-bold text-[var(--ieee-dark-yellow)]">Certification #{idx + 1}</span>
									<button
										type="button"
										onClick={() => {
											const updated = formData.certifications.filter((_, i) => i !== idx);
											handleTextChange('certifications', updated);
										}}
										className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
									>
										<Trash2 className="w-3.5 h-3.5" /> Remove
									</button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="text-xs text-white/60">Certification Name *</label>
										<input
											type="text"
											value={cert.certificationName}
											onChange={(e) => {
												const updated = [...formData.certifications];
												updated[idx].certificationName = e.target.value;
												handleTextChange('certifications', updated);
											}}
											placeholder="e.g. AWS Certified Solutions Architect"
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">Issuer *</label>
										<input
											type="text"
											value={cert.issuer}
											onChange={(e) => {
												const updated = [...formData.certifications];
												updated[idx].issuer = e.target.value;
												handleTextChange('certifications', updated);
											}}
											placeholder="Amazon Web Services"
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="text-xs text-white/60">Issue Date *</label>
										<input
											type="date"
											value={cert.issueDate}
											onChange={(e) => {
												const updated = [...formData.certifications];
												updated[idx].issueDate = e.target.value;
												handleTextChange('certifications', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">Expiration Date (Optional)</label>
										<input
											type="date"
											value={cert.expirationDate ?? ''}
											onChange={(e) => {
												const updated = [...formData.certifications];
												updated[idx].expirationDate = e.target.value || undefined;
												handleTextChange('certifications', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<div>
										<label className="text-xs text-white/60">Credential ID (Optional)</label>
										<input
											type="text"
											value={cert.credentialId ?? ''}
											onChange={(e) => {
												const updated = [...formData.certifications];
												updated[idx].credentialId = e.target.value || undefined;
												handleTextChange('certifications', updated);
											}}
											placeholder="e.g. AWS-ASA-99401"
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">Credential Verification URL (Optional)</label>
										<input
											type="url"
											value={cert.credentialUrl ?? ''}
											onChange={(e) => {
												const updated = [...formData.certifications];
												updated[idx].credentialUrl = e.target.value || undefined;
												handleTextChange('certifications', updated);
											}}
											placeholder="https://www.credly.com/badges/..."
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
								</div>
							</div>
						))}

						<button
							type="button"
							onClick={() =>
								handleTextChange('certifications', [
									...formData.certifications,
									{ certificationName: '', issuer: '', issueDate: '2024-01-01' },
								])
							}
							className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-2 rounded flex items-center gap-1 cursor-pointer"
						>
							<Plus className="w-4 h-4" /> Add Certification
						</button>
					</div>
				)}
			</form>
		</div>
	);
}
