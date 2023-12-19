<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';
	import RecipeCard from '$lib/components/recipe/RecipeCard.svelte';
	import RecipeGrid from '$lib/components/recipe/RecipeGrid.svelte';

	$: recipes = createQuery({
		queryKey: ['search'],
		queryFn: () =>
			trpc.recipes.search.query({
				text: $page.url.searchParams.get('q') ?? '',
			}),
	});
</script>

<RecipeGrid recipes={$recipes} author />
