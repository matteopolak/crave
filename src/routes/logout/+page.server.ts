import { auth } from '$lib/server/lucia';
import { redirectWithQuery } from '$lib/server/url';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth.validate();

	if (session) {
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	}

	return redirectWithQuery(url);
};
