import { fail } from '@sveltejs/kit';
import pg from 'pg';
import { z } from 'zod';

import { auth } from '$lib/server/lucia';
import { redirectWithQuery } from '$lib/server/url';

import type { Actions, PageServerLoad } from './$types';

const Input = z.object({
	username: z.string().min(4, 'Username must be at least 4 characters.').max(39, 'Username cannot be more than 39 characters.'),
	password: z.string().min(8, 'Password must be at least 8 characters.').max(255, 'Password cannot be more than 255 characters.'),
	name: z.string().min(1, 'Name is required.').max(255, 'Name cannot be more than 255 characters.'),
});

export const load = (async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (session) return redirectWithQuery(url, '/recipes');

	return {};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const name = formData.get('name');

		const result = Input.safeParse({
			username,
			password,
			name,
		});

		if (!result.success) {
			return fail(400, {
				message: result.error.issues[0].message,
			});
		}

		try {
			const username = result.data.username.toLowerCase();
			const user = await auth.createUser({
				key: {
					providerId: 'username',
					providerUserId: username,
					password: result.data.password,
				},
				attributes: {
					username,
					name: result.data.name,
					thumbnail: null,
				},
			});

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {},
			});

			locals.auth.setSession(session);
		} catch (e) {
			if (
				e instanceof pg.DatabaseError &&
        e.constraint
			) {
				return fail(400, {
					message: 'Username already taken.',
				});
			}

			return fail(500, {
				message: 'An unknown error occurred.',
			});
		}

		return redirectWithQuery(url, '/recipes');
	},
} satisfies Actions;
