import { auth } from '$lib/server/lucia';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (session) {
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	}
};
