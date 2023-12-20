import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { DATABASE_URL } from '$env/static/private';

import * as schema from './schema';

export const pool = new pg.Pool({
	connectionString: DATABASE_URL,
});

export const db = drizzle(pool, { schema });

await import('./migrate');
