import { DATABASE_URL } from '$env/static/private';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

export const raw = new Pool({
	connectionString: DATABASE_URL,
});

export const db = drizzle(raw, { schema });
