<script lang="ts">
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';
	import RecipeCard from './(components)/RecipeCard.svelte';

	const recipes = createQuery({
		queryKey: ['random'],
		queryFn: () => trpc.random.query({}),
	});
</script>

<div class="grid recipes gap-4 p-8">
	{#if $recipes.isPending || $recipes.isError}
		{#each { length: 100 } as _}
			<RecipeCard />
		{/each}
	{:else}
		{#each $recipes.data as recipe}
			<RecipeCard {recipe} />
		{/each}
	{/if}
</div>

<style>
	.recipes {
		grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
	}
</style>
