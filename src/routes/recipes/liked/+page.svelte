<script lang="ts">
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';
	import RecipeGrid from '../(components)/RecipeGrid.svelte';

	const recipes = createQuery({
		queryKey: ['liked'],
		queryFn: () => trpc.recipes.liked.query(),
	});
</script>

<RecipeGrid recipes={$recipes} />
