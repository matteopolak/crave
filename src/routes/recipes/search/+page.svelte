<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';
	import RecipeCard from '../(components)/RecipeCard.svelte';

	$: recipes = createQuery({
		queryKey: ['search'],
		queryFn: () =>
			trpc.search.query({
				text: $page.url.searchParams.get('q') ?? '',
			}),
	});
</script>

{#if $recipes.isPending}
	<div class="grid recipes gap-4 p-8">
		{#each { length: 100 } as _}
			<RecipeCard />
		{/each}
	</div>
{:else if $recipes.isError}
	Error: {$recipes.error.message}
{:else}
	<div class="grid recipes gap-4 p-8">
		{#each $recipes.data as recipe}
			<RecipeCard {recipe} />
		{/each}
	</div>
{/if}

<style>
	.recipes {
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
	}
</style>
