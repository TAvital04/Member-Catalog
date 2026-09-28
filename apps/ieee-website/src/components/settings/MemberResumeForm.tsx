'use client';

import React, { useState, useEffect } from 'react';
import { MemberResumeFormData, validateMemberResumeForm } from '@ieee/shared';
import { User, Link as LinkIcon, GraduationCap, Code, Briefcase, FolderGit2, Users, Award, Save, AlertCircle } from 'lucide-react';

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
	socialLinks: [{ platformName: 'LinkedIn', profileUrl: '' }],
	education: [
		{
			schoolName: 'University of Central Florida',
			degreeType: 'Bachelor of Science',
			major: 'Computer Science',
			gpa: 3.8,
			gpaScale: 4.0,
			startDate: '2022-08-20',
			endDate: '2026-05-02',
			isCurrent: true,
			description: 'UCF Engineering member',
		},
	],
	skills: ['React', 'TypeScript', 'Python'],
	workExperience: [],
	projects: [],
	clubMemberships: [],
	certifications: [],
};

export default function MemberResumeForm({ memberId = 'current-member', initialData }: MemberResumeFormProps) {
	const [formData, setFormData] = useState<MemberResumeFormData>(DEFAULT_FORM_DATA);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [skillInput, setSkillInput] = useState<string>('');
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
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-white/10 gap-4">
				<div>
					<h2 className="text-2xl font-[heading-font] text-[var(--ieee-dark-yellow)] flex items-center gap-2">
						<User className="w-6 h-6" />
            Candidate Resume Database Profile
					</h2>
					<p className="text-xs text-white/70 mt-1">
            Fill out your profile details to showcase your portfolio in the IEEE Member Resume Database.
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
									className="text-xs text-red-400 hover:text-red-300 font-bold px-2"
								>
                  Remove
								</button>
							</div>
						))}
						{formData.socialLinks.length < 5 && (
							<button
								type="button"
								onClick={() =>
									handleTextChange('socialLinks', [...formData.socialLinks, { platformName: 'GitHub', profileUrl: '' }])
								}
								className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-1.5 rounded"
							>
                + Add Social Link
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
								<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
									<div>
										<label className="text-xs text-white/60">School Name</label>
										<input
											type="text"
											value={edu.schoolName}
											onChange={(e) => {
												const updated = [...formData.education];
												updated[idx].schoolName = e.target.value;
												handleTextChange('education', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">Degree</label>
										<input
											type="text"
											value={edu.degreeType}
											onChange={(e) => {
												const updated = [...formData.education];
												updated[idx].degreeType = e.target.value;
												handleTextChange('education', updated);
											}}
											className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
										/>
									</div>
									<div>
										<label className="text-xs text-white/60">Major</label>
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
							</div>
						))}
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
								placeholder="Type a skill and press Add..."
								className="flex-1 bg-white/5 border border-white/20 rounded px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[var(--ieee-dark-yellow)]"
							/>
							<button
								type="button"
								onClick={handleAddSkill}
								className="bg-[var(--ieee-dark-yellow)] hover:bg-[var(--ieee-bright-yellow)] text-black font-bold px-4 py-2 rounded text-xs uppercase"
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
										className="hover:text-red-400 font-bold ml-1"
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
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">5. Work Experience</h3>
						{formData.workExperience.map((exp, idx) => (
							<div key={idx} className="bg-white/5 p-4 rounded border border-white/10 space-y-2">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									<input
										type="text"
										value={exp.companyName}
										onChange={(e) => {
											const updated = [...formData.workExperience];
											updated[idx].companyName = e.target.value;
											handleTextChange('workExperience', updated);
										}}
										placeholder="Company Name"
										className="bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
									/>
									<input
										type="text"
										value={exp.jobTitle}
										onChange={(e) => {
											const updated = [...formData.workExperience];
											updated[idx].jobTitle = e.target.value;
											handleTextChange('workExperience', updated);
										}}
										placeholder="Job Title"
										className="bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
									/>
								</div>
								<textarea
									rows={2}
									value={exp.description}
									onChange={(e) => {
										const updated = [...formData.workExperience];
										updated[idx].description = e.target.value;
										handleTextChange('workExperience', updated);
									}}
									placeholder="Key responsibilities and accomplishments..."
									className="w-full bg-black/60 border border-white/20 rounded p-2 text-xs text-white"
								/>
							</div>
						))}
						<button
							type="button"
							onClick={() =>
								handleTextChange('workExperience', [
									...formData.workExperience,
									{ companyName: '', jobTitle: '', startDate: '2024-01-01', isCurrentJob: true, description: '' },
								])
							}
							className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-1.5 rounded"
						>
              + Add Experience Entry
						</button>
					</div>
				)}

				{/* TAB 5: Projects */}
				{activeTab === 5 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">6. Projects</h3>
						{formData.projects.map((proj, idx) => (
							<div key={idx} className="bg-white/5 p-4 rounded border border-white/10 space-y-2">
								<input
									type="text"
									value={proj.projectName}
									onChange={(e) => {
										const updated = [...formData.projects];
										updated[idx].projectName = e.target.value;
										handleTextChange('projects', updated);
									}}
									placeholder="Project Name"
									className="w-full bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
								/>
								<textarea
									rows={2}
									value={proj.description}
									onChange={(e) => {
										const updated = [...formData.projects];
										updated[idx].description = e.target.value;
										handleTextChange('projects', updated);
									}}
									placeholder="Project description..."
									className="w-full bg-black/60 border border-white/20 rounded p-2 text-xs text-white"
								/>
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
							className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-1.5 rounded"
						>
              + Add Project
						</button>
					</div>
				)}

				{/* TAB 6: Clubs */}
				{activeTab === 6 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">7. Club Memberships & Activities</h3>
						{formData.clubMemberships.map((club, idx) => (
							<div key={idx} className="bg-white/5 p-4 rounded border border-white/10 space-y-2">
								<div className="grid grid-cols-2 gap-3">
									<input
										type="text"
										value={club.clubName}
										onChange={(e) => {
											const updated = [...formData.clubMemberships];
											updated[idx].clubName = e.target.value;
											handleTextChange('clubMemberships', updated);
										}}
										placeholder="Club Name"
										className="bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
									/>
									<input
										type="text"
										value={club.roleTitle}
										onChange={(e) => {
											const updated = [...formData.clubMemberships];
											updated[idx].roleTitle = e.target.value;
											handleTextChange('clubMemberships', updated);
										}}
										placeholder="Role Title"
										className="bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
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
							className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-1.5 rounded"
						>
              + Add Club Membership
						</button>
					</div>
				)}

				{/* TAB 7: Certifications */}
				{activeTab === 7 && (
					<div className="space-y-4">
						<h3 className="text-sm font-bold text-[var(--ieee-dark-yellow)] uppercase tracking-wider">8. Certifications & Credentials</h3>
						{formData.certifications.map((cert, idx) => (
							<div key={idx} className="bg-white/5 p-4 rounded border border-white/10 space-y-2">
								<div className="grid grid-cols-2 gap-3">
									<input
										type="text"
										value={cert.certificationName}
										onChange={(e) => {
											const updated = [...formData.certifications];
											updated[idx].certificationName = e.target.value;
											handleTextChange('certifications', updated);
										}}
										placeholder="Certification Name"
										className="bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
									/>
									<input
										type="text"
										value={cert.issuer}
										onChange={(e) => {
											const updated = [...formData.certifications];
											updated[idx].issuer = e.target.value;
											handleTextChange('certifications', updated);
										}}
										placeholder="Issuer"
										className="bg-black/60 border border-white/20 rounded px-3 py-1.5 text-sm text-white"
									/>
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
							className="text-xs bg-white/10 hover:bg-white/20 text-[var(--ieee-dark-yellow)] font-bold px-3 py-1.5 rounded"
						>
              + Add Certification
						</button>
					</div>
				)}
			</form>
		</div>
	);
}
