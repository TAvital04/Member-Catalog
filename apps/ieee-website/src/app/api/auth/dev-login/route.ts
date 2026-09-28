import { NextResponse } from 'next/server';
import { db } from '@/lib/database/client';
import { Users, Members, Sessions, Accounts } from '@/lib/database/schema';
import { eq, sql } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET(request: Request) {
	// Strictly disable outside of local development mode
	if (process.env.NODE_ENV !== 'development') {
		return new NextResponse('Dev login is only available in development mode.', { status: 403 });
	}

	try {
		// Ensure all NextAuth & website auth tables exist in local PostgreSQL
		await db.execute(sql`
			DO $$ BEGIN
				CREATE TYPE officer_role_enum AS ENUM (
					'Executive Chair', 'Vice Chair', 'Treasurer', 'Secretary', 'Project Chair', 
					'Workshop Chair', 'Conference Chair', 'Outreach Chair', 'Service Chair', 
					'Social Chair', 'Professional Development Chair', 'Marketing Chair', 'Software Chair'
				);
			EXCEPTION WHEN duplicate_object THEN null; END $$;

			DO $$ BEGIN
				CREATE TYPE gender_enum AS ENUM ('M', 'F', 'NB', 'O', 'PNTS');
			EXCEPTION WHEN duplicate_object THEN null; END $$;

			CREATE TABLE IF NOT EXISTS users (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				name TEXT,
				email VARCHAR(255) NOT NULL UNIQUE,
				email_verified TIMESTAMP WITH TIME ZONE,
				image TEXT,
				discord_id VARCHAR(64)
			);

			CREATE TABLE IF NOT EXISTS sessions (
				session_token VARCHAR(255) PRIMARY KEY,
				user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				expires TIMESTAMP WITH TIME ZONE NOT NULL
			);

			CREATE TABLE IF NOT EXISTS accounts (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
				type VARCHAR(255) NOT NULL,
				provider VARCHAR(255) NOT NULL,
				provider_account_id VARCHAR(255) NOT NULL,
				refresh_token TEXT,
				access_token TEXT,
				expires_at INTEGER,
				token_type VARCHAR(255),
				scope VARCHAR(255),
				id_token TEXT,
				session_state VARCHAR(255)
			);

			CREATE TABLE IF NOT EXISTS members (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid()
			);

			CREATE TABLE IF NOT EXISTS member_permissions (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
				granted_by_id UUID REFERENCES members(id) ON DELETE SET NULL,
				context_type VARCHAR(32) NOT NULL DEFAULT 'global',
				context_id UUID,
				permission VARCHAR(64) NOT NULL,
				active BOOLEAN NOT NULL DEFAULT true,
				created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
				expires_at TIMESTAMP WITH TIME ZONE
			);

			ALTER TABLE members ALTER COLUMN email DROP NOT NULL;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS middle_name VARCHAR(255);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS officer_role officer_role_enum;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS administrator BOOLEAN NOT NULL DEFAULT false;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS officer_status BOOLEAN NOT NULL DEFAULT false;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS biography TEXT;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS dues_paid BOOLEAN NOT NULL DEFAULT false;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS discord_id VARCHAR(64);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS date_of_birth DATE;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS personal_email VARCHAR(255);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS ucf_email VARCHAR(255);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS major VARCHAR(255);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS gender gender_enum;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS graduation_year INTEGER;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS portrait_url VARCHAR(500);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS resume_url TEXT;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS resume_key VARCHAR(512);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS resume_file_name VARCHAR(255);
			ALTER TABLE members ADD COLUMN IF NOT EXISTS resume_uploaded_at TIMESTAMP WITH TIME ZONE;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS resume_onedrive_path TEXT;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS github_url TEXT;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS website_url TEXT;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
			ALTER TABLE members ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
			ALTER TABLE members ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
		`);

		const devEmail = 'dev-admin@ieeeucf.org';

		// 1. Ensure dev user exists in Users table
		let [devUser] = await db.select().from(Users).where(eq(Users.email, devEmail)).limit(1);

		if (!devUser) {
			const [newUser] = await db
				.insert(Users)
				.values({
					name: 'Dev Admin',
					email: devEmail,
					discordId: 'dev-discord-admin-id',
				})
				.returning();
			devUser = newUser;
		}

		// 2. Ensure mock Accounts entry exists
		const [devAccount] = await db.select().from(Accounts).where(eq(Accounts.userId, devUser.id)).limit(1);
		if (!devAccount) {
			await db.insert(Accounts).values({
				userId: devUser.id,
				type: 'oauth',
				provider: 'discord',
				providerAccountId: 'dev-discord-admin-id',
			});
		}

		// 3. Ensure dev member record exists with admin capabilities
		const [devMember] = await db.select().from(Members).where(eq(Members.userId, devUser.id)).limit(1);

		if (!devMember) {
			await db.insert(Members).values({
				userId: devUser.id,
				firstName: 'Dev',
				lastName: 'Admin',
				administrator: true,
				officerStatus: true,
				officerRole: 'Executive Chair',
				duesPaid: true,
				dateOfBirth: '2000-01-01',
				personalEmail: devEmail,
				ucfEmail: 'dev-admin@knights.ucf.edu',
				major: 'Computer Science (BS)',
				gender: 'PNTS',
				graduationYear: 2026,
			});
		} else if (!devMember.administrator) {
			// Ensure administrator flag is true
			await db
				.update(Members)
				.set({ administrator: true, officerStatus: true })
				.where(eq(Members.id, devMember.id));
		}

		// 4. Create session in database
		const sessionToken = crypto.randomUUID();
		const expires = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days

		await db.insert(Sessions).values({
			sessionToken,
			userId: devUser.id,
			expires,
		});

		// 5. Redirect with NextAuth session cookie
		const redirectUrl = new URL('/', request.url);
		const response = NextResponse.redirect(redirectUrl);

		response.cookies.set('next-auth.session-token', sessionToken, {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			expires,
		});

		return response;
	} catch (error) {
		console.error('Dev login error:', error);
		return new NextResponse('Internal Server Error during Dev Login', { status: 500 });
	}
}
