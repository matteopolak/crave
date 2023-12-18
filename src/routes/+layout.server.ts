import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session && !request.url.endsWith('/login')) redirect(302, '/login');

	return {
		user: session ? session.user : null as never,
	};
};
