import { page } from '$app/stores';
import { get } from 'svelte/store';

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

			url.searchParams.set('from', page.url.pathname + page.url.search);

			node.href = url.toString();
		});
	}
}
