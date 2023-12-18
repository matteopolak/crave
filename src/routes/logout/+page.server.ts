import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { redirectWithQuery } from '$lib/server/url';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth.validate();

	if (session) {
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	}

	return redirectWithQuery(url);
};
