<script lang="ts">
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';
	import RecipeGrid from '$lib/components/recipe/RecipeGrid.svelte';

	const recipes = createQuery({
		queryKey: ['liked'],
		queryFn: () => trpc.recipes.history.query(),
	});
</script>

<div class="w-full px-32 pb-32 pt-16">
	<div class="w-full grid gap-8">
		<h1 class="text-4xl font-bold dark:text-neutral-100 text-neutral-800">
			Your recipe history
		</h1>

		<RecipeGrid recipes={$recipes} side vertical size="xl" />
	</div>
</div>
