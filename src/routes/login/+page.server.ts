import { auth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { LuciaError } from 'lucia';
import { redirectWithQuery } from '$lib/server/url';

const Input = z.object({
	username: z.string().min(4, 'Username must be at least 4 characters.').max(39, 'Username cannot be more than 39 characters.'),
	password: z.string().min(8, 'Password must be at least 8 characters.').max(255, 'Password cannot be more than 255 characters.'),
});

export const load = (async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (session) return redirectWithQuery(url);

	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		const result = Input.safeParse({
			username,
			password,
		});

		if (!result.success) {
			return fail(400, {
				message: result.error.issues[0].message,
			});
		}

		try {
			const key = await auth.useKey(
				'username',
				result.data.username.toLowerCase(),
				result.data.password,
			);

			const session = await auth.createSession({
				userId: key.userId,
				attributes: {},
			});

			locals.auth.setSession(session);
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' ||
					e.message === 'AUTH_INVALID_PASSWORD')
			) {
				return fail(400, {
					message: 'Incorrect username or password',
				});
			}

			return fail(500, {
				message: 'An unknown error occurred',
			});
		}

		return redirectWithQuery(url);
	},
};
