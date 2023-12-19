<script lang="ts">
	import type { QueryObserverResult } from '@tanstack/svelte-query';
	import RecipeCard from './RecipeCard.svelte';
	import type { PartialRecipe } from '$lib/server/schema';
	import type { Size } from '$lib/types';

	export let recipes: QueryObserverResult<PartialRecipe[]>;
	export let size: Size = 'md';

	export let vertical = false;
	export let side = false;
	export let author = false;
	export let pad = false;

	export let placeholderItems = 100;

	const sizes: Record<Size, string> = {
		sm: '15rem',
		md: '17.5rem',
		lg: '20rem',
		xl: '22.5rem',
		'2xl': '25rem',
		'3xl': '27.5rem',
		'4xl': '30rem',
		'5xl': '32.5rem',
		'6xl': '35rem',
		'7xl': '37.5rem',
		full: '100%',
	};
</script>

<div
	class="grid gap-4"
	class:p-8={pad}
	style={!vertical
		? `grid-template-columns: repeat(auto-fit, minmax(${sizes[size]}, 1fr))`
		: ''}
>
	{#if recipes.isPending || recipes.isError}
		{#each { length: placeholderItems } as _}
			<RecipeCard {author} {side} size={!vertical ? 'full' : size} />
		{/each}
	{:else}
		{#each recipes.data as recipe}
			<RecipeCard {recipe} {author} {side} size={!vertical ? 'full' : size} />
		{/each}
	{/if}
</div>