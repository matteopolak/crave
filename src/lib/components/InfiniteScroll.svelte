<script lang="ts">
	import { tick } from 'svelte';
	import { viewport } from '$lib/util';
	import type { MaybePromise } from '@sveltejs/kit';

	type T = $$Generic;

	export let data: T[];
	export let key: keyof T;
	export let load: (index: number) => MaybePromise<T[]>;

	let done = data.length === 0;
	let loading = false;
	let index = 1;
	let shouldLoad = false;

	async function next() {
		loading = true;
		const items = await load(index++);

		if (items.length === 0) {
			done = true;
		} else {
			data.push(...items);
			data = data;
		}

		tick().then(() => {
			loading = false;

			if (shouldLoad) {
				next();
			}
		});
	}

	$: if (shouldLoad && !loading && !done) {
		next();
	}
</script>

{#each data as item (item[key])}
	<slot {item} />
{/each}

<div
	use:viewport
	on:enterviewport={() => {
		shouldLoad = true;
	}}
	on:exitviewport={() => {
		shouldLoad = false;
	}}
/>

{#if !done}
	{#if loading}
		<slot name="loading" />
	{/if}
{/if}
