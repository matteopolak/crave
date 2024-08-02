import { locales } from '$lib/translations';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, request }) => {
	const session = await locals.auth.validate();
	const header = request.headers.get('accept-language');
	const locale = header && parseLanguage(header).find(l => locales.get().includes(l.locale))?.locale;

	return {
		user: session?.user,
		language: {
			locale: 'system',
			system: locale ?? 'en',
		},
	};
};

function parseLanguage(header: string) {
	const languages = header.split(',').map(l => {
		const [locale, q = '1'] = l.trim().split(';q=');

		return {
			locale: locale.split('-')[0],
			q: Number(q),
		};
	});

	return languages.sort((a, b) => b.q - a.q);
}
