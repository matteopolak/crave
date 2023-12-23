import { get } from 'svelte/store';

import { page } from '$app/stores';

export function showOnLoad(node: HTMLImageElement) {
	node.classList.add('opacity-0');

	node.onload = () => {
		node.classList.remove('opacity-0');
	};

	node.onerror = () => {
		node.classList.add('opacity-0');
	};

	const observer = new MutationObserver(() => {
		node.classList.add('opacity-0');
	});

	observer.observe(node, { attributes: true, attributeFilter: ['src'] });

	return {
		destroy() {
			observer.disconnect();

			node.onload = null;
			node.onerror = null;

			node.classList.remove('opacity-0');
		},
	};
}

export function addFromQuery(node: HTMLAnchorElement) {
	const data = get(page);
	const from = data.url.searchParams.get('from');

	if (from) {
		const url = new URL(node.href);

		url.searchParams.set('from', from);

		node.href = url.toString();
	} else {
		page.subscribe(page => {
			const url = new URL(node.href);

			if (page.url.pathname !== '/login' && page.url.pathname !== '/register') {
				url.searchParams.set('from', page.url.pathname + page.url.search);
			} else {
				url.searchParams.delete('from');
			}

			node.href = url.toString();
		});
	}
}

export function viewport(node: HTMLElement) {
	const observer = new IntersectionObserver(([entry]) => {
		entry.target.dispatchEvent(new CustomEvent(entry.isIntersecting ? 'enterviewport' : 'exitviewport'));
	});

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		},
	};
}

export function formatNumber(number: number) {
	return number.toLocaleString();
}

export function parseFromQuery(url: URL) {
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