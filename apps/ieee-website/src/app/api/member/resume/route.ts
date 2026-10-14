import { NextRequest } from 'next/server';
import { db, members, memberResumes } from '@ieee/db';
import { validateMemberResumeForm, MemberResumeFormData } from '@ieee/shared';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { randomUUID } from 'crypto';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const body: Partial<MemberResumeFormData> & { memberId?: string } = await request.json();

		// BOLA/IDOR Protection: authenticated user can only update their own profile
		let memberId: string;
		if (session?.user?.memberId) {
			memberId = session.user.memberId;
		} else if (session?.user?.id && UUID_REGEX.test(session.user.id)) {
			memberId = session.user.id;
		} else if (body.memberId && session?.user?.administrator) {
			// Only verified administrators can target another memberId
			memberId = body.memberId;
		} else if (process.env.NODE_ENV === 'development') {
			memberId = (body.memberId && UUID_REGEX.test(body.memberId)) ? body.memberId : randomUUID();
		} else {
			return Response.json(
				{ success: false, error: 'Unauthorized: Authentication required to submit resume profile.' },
				{ status: 401 },
			);
		}

		if (!UUID_REGEX.test(memberId)) {
			memberId = randomUUID();
		}

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

		// 1. Ensure core record exists in members table (required for 1-to-1 member_id foreign key)
		const [existingMember] = await db.select().from(members).where(eq(members.id, memberId)).limit(1);

		if (!existingMember) {
			await db.insert(members).values({
				id: memberId,
				name: body.fullName || 'IEEE Member',
				email: body.email || 'member@knights.ucf.edu',
				major: body.education?.[0]?.major || 'Computer Science',
				graduationYear: String(body.education?.[0]?.endDate?.split('-')[0] || 2026),
			}).onConflictDoNothing();
		}

		// 2. Perform native Drizzle upsert into member_resumes table
		await db
			.insert(memberResumes)
			.values({
				memberId,
				fullName: body.fullName!,
				email: body.email!,
				status: body.status!,
				bio: body.bio!,
				resumePdfUrl: body.resumePdfUrl!,
				ferpaConsentSigned: Boolean(body.ferpaConsent ?? true),
				ferpaConsentAt: new Date(),
				shareGpaWithRecruiters: Boolean(body.ferpaConsent ?? false),
				socialLinks: body.socialLinks || [],
				education: body.education || [],
				skills: body.skills || [],
				workExperience: body.workExperience || [],
				projects: body.projects || [],
				clubMemberships: body.clubMemberships || [],
				certifications: body.certifications || [],
				mainProjectName: body.mainProjectName || null,
				updatedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: memberResumes.memberId,
				set: {
					fullName: body.fullName!,
					email: body.email!,
					status: body.status!,
					bio: body.bio!,
					resumePdfUrl: body.resumePdfUrl!,
					socialLinks: body.socialLinks || [],
					education: body.education || [],
					skills: body.skills || [],
					workExperience: body.workExperience || [],
					projects: body.projects || [],
					clubMemberships: body.clubMemberships || [],
					certifications: body.certifications || [],
					mainProjectName: body.mainProjectName || null,
					updatedAt: new Date(),
				},
			});

		return Response.json({
			success: true,
			message: 'Member candidate resume profile updated successfully.',
			dbStatus: 'saved',
		});
	} catch (error: any) {
		console.error('[API Error] Failed to update member resume profile:', error);
		return Response.json(
			{ success: false, error: 'Failed to process member resume submission', message: error?.message },
			{ status: 500 },
		);
	}
}
