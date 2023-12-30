<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { trpc } from '$lib/client';
	import RecipeGrid from '$lib/components/recipe/RecipeGrid.svelte';

	const recipes = createQuery({
		queryKey: ['random'],
		queryFn: () => trpc.recipes.random.query({}),
	});
</script>

<RecipeGrid
	recipes={$recipes}
	load={() => trpc.recipes.random.query({})}
	itemThreshold={50}
/>
