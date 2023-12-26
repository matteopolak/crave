import { redirectWithQuery } from '$lib/server/url';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const session = await locals.auth.validate();
	if (!session) return redirectWithQuery(url, '/login');

	return {
		user: session.user,
	};
}) satisfies PageServerLoad;
