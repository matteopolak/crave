import { DATABASE_URL } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import pg from 'pg';

export const db = new pg.Pool({
	connectionString: DATABASE_URL,
});

export async function createContext(event: RequestEvent) {
	const session = await event.locals.auth.validate();

	return {
		session,
		db,
	};
}

export type Context = inferAsyncReturnType<typeof createContext>;
