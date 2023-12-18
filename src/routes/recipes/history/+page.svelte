<script lang="ts">
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';
	import RecipeGrid from '../(components)/RecipeGrid.svelte';

	const recipes = createQuery({
		queryKey: ['liked'],
		queryFn: () => trpc.recipes.history.query(),
	});
</script>

<RecipeGrid recipes={$recipes} />
