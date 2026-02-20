/**
 * Database connection module
 * Supabase PostgreSQL + Drizzle ORM
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/huchu_dev';

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  ssl: connectionString.includes('supabase.co') ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
