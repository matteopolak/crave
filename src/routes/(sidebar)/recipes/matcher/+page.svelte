<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import type { inferRouterOutputs } from '@trpc/server';

	import { trpc } from '$lib/client';
	import type { Router } from '$lib/server/routes';
	import { t } from '$lib/translations';

	import Recipe from '$lib/components/recipe/Recipe.svelte';
	import RecipeBox from '$lib/components/recipe/RecipeBox.svelte';

	import Fullscreen from '~icons/ic/baseline-fullscreen';
	import Info from '~icons/ic/baseline-info';

	import type { PageData } from './$types';

	type PartialRecipe =
		inferRouterOutputs<Router>['recipes']['vector']['search'][number];

	let vector: number[] = [];
	let first = true;
	let infoModal: HTMLDialogElement;
	let recipeModal: HTMLDialogElement;

	let selectedRecipe: number | undefined;

	$: recipe =
		selectedRecipe !== undefined
			? createQuery({
					queryKey: ['recipe'],
					queryFn: () =>
						trpc.recipes.get.query({
							id: selectedRecipe!,
						}),
			  })
			: undefined;

	$: length = Math.sqrt(vector.reduce((acc, val) => acc + val ** 2, 0));
	$: unit = vector.map(val => val / length);

	$: recipes = createQuery({
		queryKey: ['match'],
		queryFn: () =>
			trpc.recipes.vector.search.mutate({
				vector: first ? undefined : unit,
				limit: 9,
			}),
	});

	function next(recipe: PartialRecipe) {
		const embedding = recipe.embedding;

		// move the vector in the direction of the recipe
		if (first) {
			vector = embedding;
			first = false;
		} else {
			const dot = vector.reduce((acc, val, i) => acc + val * embedding[i], 0);
			const length = Math.sqrt(vector.reduce((acc, val) => acc + val ** 2, 0));
			const unit = vector.map(val => val / length);

			vector = unit.map(val => val * dot);
		}
	}

	export let data: PageData;
</script>

<dialog id="info" class="modal" bind:this={infoModal}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
				✕
			</button>
		</form>

		<h3 class="font-bold text-lg">{$t('content.matcher-title')}</h3>
		<p class="pt-4 whitespace-pre-line">
			{$t('content.matcher-description')}
		</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<dialog id="recipe" class="modal" bind:this={recipeModal}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
				✕
			</button>
		</form>

		<Recipe recipe={$recipe?.data} user={data?.user} />
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<div class="absolute top-0 left-0 grid w-screen h-screen place-items-center">
	<div class="relative">
		<button
			on:click={() => infoModal.showModal()}
			class="absolute top-2 right-2 md:top-0 md:right-0 text-info z-30 rounded-full overflow-hidden"
		>
			<Info class="w-12 h-12 md:w-16 md:h-16 z-30 bg-base-100" />
		</button>

		{#if $recipes.isPending}
			<div class="grid grid-cols-3 gap-4 p-8 max-w-2xl">
				{#each { length: 9 } as _}
					<RecipeBox />
				{/each}
			</div>
		{:else if $recipes.isError}
			{$recipes.error.message}
		{:else}
			<div class="grid grid-cols-3 gap-4 p-8 max-w-2xl">
				{#each $recipes.data as recipe}
					<div class="relative">
						<button on:click={() => next(recipe)} class="w-full h-full">
							<RecipeBox {recipe} />
						</button>

						<button
							class="absolute top-2 right-2 z-20"
							on:click={() => {
								selectedRecipe = recipe.id;
								recipeModal.showModal();
							}}
						>
							<Fullscreen class="w-8 h-8 text-primary bg-base-300 rounded-lg" />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
