<script lang="ts">
	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import { createQuery } from '@tanstack/svelte-query';
	import Recipe from '$lib/components/recipe/Recipe.svelte';

	import Food from '~icons/emojione/pot-of-food';
	import RecipeCard from '$lib/components/recipe/RecipeCard.svelte';
	import RecipeGrid from '$lib/components/recipe/RecipeGrid.svelte';

	$: recipe = createQuery({
		queryKey: ['recipe'],
		queryFn: () =>
			trpc.recipes.get.query({
				id: parseInt($page.params.id),
			}),
	});

	$: recommended = createQuery({
		queryKey: ['recommended'],
		queryFn: () =>
			trpc.recipes.recommended.query({
				id: parseInt($page.params.id),
			}),
	});
</script>

<div
	class="flex flex-col md:flex-row gap-8 pt-8 pb-16 pr-12 lg:pr-16 xl:pr-32 pl-8"
>
	{#if $recipe.isPending}
		<Recipe />
	{:else if $recipe.isError}
		<div class="flex w-full h-full justify-center mt-40">
			<div class="grid place-items-center max-w-xl gap-16">
				<Food class="w-2/3 h-auto" />
				<span class="text-neutral-100 text-2xl">
					This recipe isn't available anymore.
				</span>
			</div>
		</div>
	{:else}
		<Recipe recipe={$recipe.data} />
	{/if}

	{#if !$recipe.isError}
		<RecipeGrid recipes={$recommended} vertical side placeholderItems={25} />
	{/if}
</div>
