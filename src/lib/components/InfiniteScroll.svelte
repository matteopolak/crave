<script lang="ts">
	import type { MaybePromise } from '@sveltejs/kit';
	import { tick } from 'svelte';

	import { viewport } from '$lib/util';

	type T = $$Generic;

	export let data: T[];
	export let load: (index: number) => MaybePromise<T[]>;
	export let itemThreshold = 1;

	let done = data.length < itemThreshold && data.length > 0;
	let loading = false;
	let index = data.length === 0 ? 0 : 1;
	let shouldLoad = data.length === 0;

	async function next() {
		loading = true;
		const items = await load(index++);

		if (items.length < itemThreshold) {
			done = true;
		}

		if (items.length) {
			data.push(...items);
			data = data;
		}

		tick().then(() => {
			if (shouldLoad) {
				next();
			} else {
				loading = false;
			}
		});
	}

	$: if (shouldLoad && !loading && !done) {
		next();
	}
</script>

{#each data as item, i (i)}
	<slot {item} />
{/each}

{#if !done}
	{#if loading}
		<slot name="loading" />
	{/if}
{/if}

<div
	use:viewport
	on:enterviewport={() => {
		shouldLoad = true;
	}}
	on:exitviewport={() => {
		shouldLoad = false;
	}}
/>
