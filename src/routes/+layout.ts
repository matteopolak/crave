import { loadTranslations } from '$lib/translations';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url, data }) => {
	const { pathname } = url;
	const locale = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : null;

	data.language.locale = locale ?? 'system';

	await loadTranslations(data.language.locale === 'system' ? data.language.system : data.language.locale, pathname);

	return data;
}