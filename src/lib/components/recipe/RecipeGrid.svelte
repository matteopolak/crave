<script lang="ts">
	import type { MaybePromise } from '@sveltejs/kit';
	import type { QueryObserverResult } from '@tanstack/svelte-query';
	import type { User } from 'lucia';

	import type { PartialRecipe } from '$lib/server/schema';
	import type { Size } from '$lib/types';

	import InfiniteScroll from '../InfiniteScroll.svelte';
	import RecipeCard from './RecipeCard.svelte';

	export let recipes: QueryObserverResult<PartialRecipe[]> | PartialRecipe[];
	export let size: Size = 'md';
	export let user: User | undefined = undefined;

	export let vertical = false;
	export let side = false;
	export let author = false;

	export let load:
		| ((index: number) => MaybePromise<PartialRecipe[]>)
		| undefined = undefined;

	export let placeholderItems = 10;
	export let itemThreshold = 0;

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
	style={!vertical
		? `grid-template-columns: repeat(auto-fill, minmax(${sizes[size]}, 1fr))`
		: ''}
>
	{#if !Array.isArray(recipes) && (recipes.isPending || recipes.isError)}
		{#each { length: placeholderItems } as _}
			<RecipeCard {author} {side} size={!vertical ? 'full' : size} />
		{/each}
	{:else if load}
		<InfiniteScroll
			data={Array.isArray(recipes) ? recipes : recipes.data}
			{load}
			{itemThreshold}
			let:item
		>
			<RecipeCard
				recipe={item}
				{author}
				{side}
				{user}
				size={!vertical ? 'full' : size}
			/>

			<svelte:fragment slot="loading">
				{#each { length: Math.min(placeholderItems, 10) } as _}
					<RecipeCard {author} {side} size={!vertical ? 'full' : size} />
				{/each}
			</svelte:fragment>
		</InfiniteScroll>
	{:else}
		{#each Array.isArray(recipes) ? recipes : recipes.data as recipe}
			<RecipeCard {recipe} {author} {side} size={!vertical ? 'full' : size} />
		{/each}
	{/if}
</div>
