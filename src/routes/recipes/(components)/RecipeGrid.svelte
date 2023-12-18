<script lang="ts">
	import type { QueryObserverResult } from '@tanstack/svelte-query';
	import RecipeCard from './RecipeCard.svelte';
	import type { PartialRecipe } from '$lib/server/schema';

	export let recipes: QueryObserverResult<PartialRecipe[]>;
</script>

<div class="grid recipes gap-4 p-8">
	{#if recipes.isPending || recipes.isError}
		{#each { length: 100 } as _}
			<RecipeCard />
		{/each}
	{:else}
		{#each recipes.data as recipe}
			<RecipeCard {recipe} />
		{/each}
	{/if}
</div>

<style>
	.recipes {
		grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
	}
</style>
