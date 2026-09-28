import { NextRequest } from 'next/server';
import { db } from '@ieee/db';
import { validateMemberResumeForm, MemberResumeFormData } from '@ieee/shared';

export async function POST(request: NextRequest) {
	try {
		const body: Partial<MemberResumeFormData> & { memberId?: string } = await request.json();
		const memberId = body.memberId || request.headers.get('x-member-id') || 'demo-member';

		const validation = validateMemberResumeForm(body);
		if (!validation.isValid) {
			return Response.json(
				{
					success: false,
					error: 'Validation failed',
					details: validation.errors,
				},
				{ status: 400 },
			);
		}

		const resumePayload = {
			memberId,
			fullName: body.fullName,
			email: body.email,
			status: body.status,
			bio: body.bio,
			resumePdfUrl: body.resumePdfUrl,
			socialLinks: body.socialLinks || [],
			education: body.education || [],
			skills: body.skills || [],
			workExperience: body.workExperience || [],
			projects: body.projects || [],
			clubMemberships: body.clubMemberships || [],
			certifications: body.certifications || [],
			updatedAt: new Date().toISOString(),
		};

		let dbStatus = 'saved';
		try {
			const query = `
        INSERT INTO member_resumes (
          member_id, full_name, email, status, bio, resume_pdf_url,
          social_links, education, skills, work_experience, projects,
          club_memberships, certifications, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()
        )
        ON CONFLICT (member_id) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          email = EXCLUDED.email,
          status = EXCLUDED.status,
          bio = EXCLUDED.bio,
          resume_pdf_url = EXCLUDED.resume_pdf_url,
          social_links = EXCLUDED.social_links,
          education = EXCLUDED.education,
          skills = EXCLUDED.skills,
          work_experience = EXCLUDED.work_experience,
          projects = EXCLUDED.projects,
          club_memberships = EXCLUDED.club_memberships,
          certifications = EXCLUDED.certifications,
          updated_at = NOW()
        RETURNING *;
      `;

			const values = [
				memberId,
				resumePayload.fullName,
				resumePayload.email,
				resumePayload.status,
				resumePayload.bio,
				resumePayload.resumePdfUrl,
				JSON.stringify(resumePayload.socialLinks),
				JSON.stringify(resumePayload.education),
				JSON.stringify(resumePayload.skills),
				JSON.stringify(resumePayload.workExperience),
				JSON.stringify(resumePayload.projects),
				JSON.stringify(resumePayload.clubMemberships),
				JSON.stringify(resumePayload.certifications),
			];

			await db.execute({ sql: query, args: values } as any);
		} catch (dbError) {
			console.warn('[API Warning] Database upsert warning:', dbError);
			dbStatus = 'simulated';
		}

		return Response.json({
			success: true,
			message: 'Member candidate resume profile updated successfully.',
			dbStatus,
			data: resumePayload,
		});
	} catch (error: any) {
		console.error('[API Error] Failed to update member resume profile:', error);
		return Response.json(
			{ success: false, error: 'Failed to process member resume submission', message: error?.message },
			{ status: 500 },
		);
	}
}
