<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import { page } from '$app/stores';
	import { trpc } from '$lib/client';
	import { t } from '$lib/translations';

	import Recipe from '$lib/components/recipe/Recipe.svelte';
	import RecipeGrid from '$lib/components/recipe/RecipeGrid.svelte';

	import Food from '~icons/emojione/pot-of-food';

	import type { PageData } from './$types';

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

	export let data: PageData;
</script>

<div class="flex flex-col gap-8 xl:grid grid-cols-5">
	{#if $recipe.isPending}
		<div class="xl:col-span-3">
			<Recipe user={data.user} />
		</div>
	{:else if $recipe.isError}
		<div class="grid w-full h-full justify-center pt-32 col-span-5">
			<div class="grid place-items-center max-w-xl gap-16">
				<Food class="w-2/3 h-auto" />
				<span class="text-neutral-100 text-2xl">
					{$t('error.recipe-not-found')}
				</span>
			</div>
		</div>
	{:else}
		<div class="xl:col-span-3">
			<Recipe recipe={$recipe.data} user={data.user} />
		</div>
	{/if}

	<div class="xl:col-span-2">
		{#if !$recipe.isError}
			<RecipeGrid
				recipes={$recommended}
				vertical
				side
				placeholderItems={25}
				itemThreshold={25}
			/>
		{/if}
	</div>
</div>
