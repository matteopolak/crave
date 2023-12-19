<script lang="ts">
	import { trpc } from '$lib/client';
	import type { PartialRecipe } from '$lib/server/schema';
	import { createQuery } from '@tanstack/svelte-query';
	import RecipeBox from '$lib/components/recipe/RecipeBox.svelte';

	import Info from '~icons/ic/baseline-info';

	// Initialize vector to 0
	let vector: number[] = [];
	let first = true;

	$: length = Math.sqrt(vector.reduce((acc, val) => acc + val ** 2, 0));
	$: unit = vector.map(val => val / length);

	$: recipes = createQuery({
		queryKey: ['match'],
		queryFn: () =>
			first
				? trpc.recipes.random.query({
						includeEmbeddings: true,
						limit: 9,
				  })
				: trpc.recipes.vector.search.mutate({
						vector: unit,
						includeEmbeddings: true,
						limit: 9,
				  }),
	});

	function next(recipe: PartialRecipe) {
		const embedding = JSON.parse(recipe.embedding!);

		// move the vector in the direction of the recipe
		if (first) {
			vector = embedding;
			first = false;
		} else {
			const dot = vector.reduce((acc, val, i) => acc + val * embedding[i], 0);
			const length = Math.sqrt(vector.reduce((acc, val) => acc + val ** 2, 0));
			const unit = vector.map(val => val / length);

			console.log('old', vector);
			vector = unit.map(val => val * dot);
			console.log('new', vector);
		}
	}
</script>

<dialog id="info" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
				✕
			</button>
		</form>

		<h3 class="font-bold text-lg">Your personalized recipe matcher</h3>
		<p class="py-4">
			We use a neural network to embed recipes into a 768-dimensional vector
			space. This allows us to calculate the similarity between recipes using
			mathematical operations.
		</p>

		<p>
			When you click on a recipe, we calculate the cosine similarity between
			your current vector and the recipe's vector. We then move your vector in
			the direction of the recipe's vector, so that the next recipe you see is
			more similar to the one you just clicked.
		</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<div class="absolute top-0 left-0 grid w-screen h-screen place-items-center">
	<div class="relative">
		<button
			on:click={() => info.showModal()}
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
			Error: {$recipes.error.message}
		{:else}
			<div class="grid grid-cols-3 gap-4 p-8 max-w-2xl">
				{#each $recipes.data as recipe}
					<button on:click={() => next(recipe)}>
						<RecipeBox {recipe} />
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
