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

export function formatRelativeTime(locale: string, date: Date) {
	const now = new Date();
	const ms = date.getTime() - now.getTime();
	const duration = Math.abs(ms);

	const rtf = new Intl.RelativeTimeFormat(locale, {
		numeric: 'auto',
	});

	const units = [
		{ unit: 'year', ms: 31_536_000_000 },
		{ unit: 'month', ms: 2_592_000_000 },
		{ unit: 'week', ms: 604_800_000 },
		{ unit: 'day', ms: 86_400_000 },
		{ unit: 'hour', ms: 3_600_000 },
		{ unit: 'minute', ms: 60_000 },
		{ unit: 'second', ms: 1_000 },
	] as const;

	for (const { unit, ms: unitMs } of units) {
		if (duration >= unitMs) {
			return rtf.format(Math.round(ms / unitMs), unit);
		}
	}

	return rtf.format(Math.round(ms / 1_000), 'second');
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

	return null;
}

export async function resize(data: string, width = 1920, height = 1080) {
	const canvas = document.createElement('canvas');

	const img = new Image();
	img.src = data;

	await new Promise<void>(resolve => {
		img.onload = () => {
			const aspectRatio = img.width / img.height;

			const w = Math.min(width, height * aspectRatio);
			const h = Math.min(height, width / aspectRatio);

			canvas.width = w;
			canvas.height = h;

			const ctx = canvas.getContext('2d')!;

			ctx.drawImage(img, 0, 0, w, h);

			resolve();
		};

		img.onerror = () => {
			resolve();
		};
	});

	return canvas.toDataURL('image/png').slice('data:image/png;base64,'.length);
}