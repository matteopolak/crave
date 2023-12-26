import { writable } from 'svelte/store';

function setTheme(name: string) {
	if (typeof document === 'undefined' || name === 'unknown') return;

	if (name !== 'system') {
		document.documentElement.setAttribute('data-theme', name);
		localStorage.setItem('theme', name);
		theme.set(name);
	} else {
		document.documentElement.removeAttribute('data-theme');
		localStorage.removeItem('theme');
		theme.set('system');
	}
}

export function initTheme() {
	const theme = localStorage.getItem('theme');

	setTheme(theme ?? 'system');
}

export const theme = writable('unknown');

theme.subscribe(setTheme);
