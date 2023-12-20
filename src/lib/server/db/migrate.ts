import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { db } from '$lib/server/db';

await migrate(db, { migrationsFolder: './drizzle' });
