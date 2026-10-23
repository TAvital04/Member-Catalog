import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Guard against importing database driver in browser client components
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  throw new Error('lib/db.ts is a server-only module and must not be imported in client components.');
}

const connectionString = process.env.DATABASE_URL || '';

/**
 * Returns an initialized Drizzle ORM database instance.
 * Supports both Neon HTTP (for production/serverless) and standard PostgreSQL (pg Pool).
 */
function initializeDb() {
  if (!connectionString) {
    console.warn('[DB Warning] DATABASE_URL is not set in environment variables.');
  }

  // Use Neon serverless driver if DATABASE_URL contains 'neon.tech' or DB_PROVIDER='neon'
  const isNeon = connectionString.includes('neon.tech') || process.env.DB_PROVIDER === 'neon';

  if (isNeon) {
    const sql = neon(connectionString);
    return drizzleNeon(sql);
  } else {
    const pool = new Pool({
      connectionString: connectionString || 'postgresql://postgres:postgres@localhost:5432/ieee-website',
    });
    return drizzlePg(pool);
  }
}

export const db = initializeDb();
