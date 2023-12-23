<script lang="ts">
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';
	import RecipeGrid from '$lib/components/recipe/RecipeGrid.svelte';

	const recipes = createQuery({
		queryKey: ['liked'],
		queryFn: () => trpc.recipes.liked.query(),
	});
</script>

<div class="max-w-4xl grid gap-8 px-8 md:px-16 lg:px-24">
	<h1 class="text-4xl font-bold dark:text-neutral-100 text-neutral-800">
		Your liked recipes
	</h1>

	<RecipeGrid recipes={$recipes} side vertical size="xl" />
</div>
