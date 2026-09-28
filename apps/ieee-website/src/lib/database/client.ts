import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/ieee-website';
const provider = process.env.DB_PROVIDER ?? 'local'; // Default to local fallback if DB_PROVIDER not set

function createNeonDb() {
	const sql = neon(connectionString);
	return drizzleNeon(sql, { schema });
}

function createLocalDb() {
	const client = postgres(connectionString);
	return drizzlePostgres(client, { schema });
}

export const db = provider === 'neon' || connectionString.includes('neon.tech')
	? createNeonDb()
	: createLocalDb();