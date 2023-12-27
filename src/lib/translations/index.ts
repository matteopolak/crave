import { writable } from 'svelte/store';
import i18n, { type Config } from 'sveltekit-i18n';

import lang from './lang.json';

type Lang = typeof lang;

const config: Config<{
	views?: number;
	subscribers?: number;
	recipes?: number;
}> = {
	translations: (Object.keys(lang) as (keyof Lang)[]).reduce((acc, key) => {
		acc[key] = { lang };

		return acc;
	}, {} as Record<keyof Lang, { lang: Lang }>),
	loaders: Object.keys(lang).reduce((loaders, l) => {
		loaders.push(...[
			'auth',
			'content',
			'error',
			'home',
			'label',
			'placeholder',
			'stat',
			'toast',
		].map(k => ({
			locale: l,
			key: k,
			loader: async () => (
				await import(`./${l}/${k}.json`)
			).default,
		})));

		return loaders;
	}, [] as Exclude<Config['loaders'], undefined>),
	fallbackLocale: 'en',
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);

export const language = writable({
	locale: 'unknown',
	system: 'unknown',
});

language.subscribe(lang => {
	if (typeof document === 'undefined' || lang.locale === 'unknown') return;

	if (lang.locale === 'system') {
		localStorage.removeItem('locale');
		document.documentElement.lang = lang.system;

		locale.set(lang.system);
	} else {
		localStorage.setItem('locale', lang.locale);
		document.documentElement.lang = lang.locale;

		locale.set(lang.locale);
	}
});
