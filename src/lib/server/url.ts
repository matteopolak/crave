import { type Cookies, redirect } from '@sveltejs/kit';

import { dev } from '$app/environment';

function parseFromQuery(url: URL) {
	const from = url.searchParams.get('from');

	if (from) {
		try {
			const url = new URL(from, 'http://localhost');

			return url.pathname + url.search;
		} catch {
			// ignore invalid 'from' URLs
		}
	}

	return null
}

export function redirectWithQuery(url: URL) {
	return redirect(302, parseFromQuery(url) ?? '/');
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