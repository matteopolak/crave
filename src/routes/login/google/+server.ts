import { dev } from '$app/environment';
import { googleAuth } from '$lib/server/lucia.js';
import { addFromCookie } from '$lib/server/url.js';

export const GET = async (event) => {
	const [url, state] = await googleAuth.getAuthorizationUrl();

	event.cookies.set('google_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60,
	});

	addFromCookie('google_oauth_from', event);

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
};
