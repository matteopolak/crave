import { type Cookies, redirect } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { parseFromQuery } from '$lib/util';

export function redirectWithQuery(url: URL, fallback = '/') {
	return redirect(302, parseFromQuery(url) ?? fallback);
}

export function getRedirectWithCookie(name: string, cookies: Cookies) {
	const from = cookies.get(name);

	if (from) {
		cookies.delete(name, { path: '/' });
	}

	return from ?? '/';
}

export function addFromCookie(name: string, { cookies, url }: { cookies: Cookies, url: URL }) {
	const from = parseFromQuery(url);

	if (from) {
		cookies.set(name, from, {
			httpOnly: true,
			secure: !dev,
			path: '/',
			maxAge: 60 * 60,
		});
	}
}