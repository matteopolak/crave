<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import RecipeGrid from '$lib/components/recipe/RecipeGrid.svelte';
</script>

<RecipeGrid
	recipes={[]}
	author
	load={i =>
		trpc.recipes.search.query({
			text: $page.url.searchParams.get('q') ?? '',
			page: i,
		})}
/>
