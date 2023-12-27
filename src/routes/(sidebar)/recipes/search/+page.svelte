<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
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
