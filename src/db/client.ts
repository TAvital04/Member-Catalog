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
      connectionString: connString || 'postgresql://postgres:postgres@localhost:5432/member-catalog',
    });
    return drizzlePg(pool, { schema });
  }
}

let _cachedDb: ReturnType<typeof createDbClient> | null = null;

export function getDb() {
  if (!_cachedDb) {
    _cachedDb = createDbClient();
  }
  return _cachedDb;
}

export const db = new Proxy({} as ReturnType<typeof createDbClient>, {
  get(_target, prop) {
    const instance = getDb();
    return (instance as any)[prop];
  },
});
