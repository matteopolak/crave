import { dev } from '$app/environment';
import { githubAuth } from '$lib/server/lucia.js';
import { addFromCookie } from '$lib/server/url.js';

export const GET = async (event) => {
	const [url, state] = await githubAuth.getAuthorizationUrl();

	event.cookies.set('github_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60,
	});

	addFromCookie('github_oauth_from', event);

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
};
