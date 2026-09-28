import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || '';

export function createDbClient(connString: string = connectionString) {
  const isNeon = connString.includes('neon.tech') || process.env.DB_PROVIDER === 'neon';

  if (isNeon) {
    const sql = neon(connString);
    return drizzleNeon(sql, { schema });
  } else {
    const pool = new Pool({
      connectionString: connString || 'postgresql://postgres:postgres@localhost:5432/ieee-website',
    });
    return drizzlePg(pool, { schema });
  }
}

export const db = createDbClient();
