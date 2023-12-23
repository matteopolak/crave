<script lang="ts">
	import NutritionFacts from '$lib/components/recipe/NutritionFacts.svelte';
	import type { Router } from '$lib/server/routes';
	import type { inferRouterInputs } from '@trpc/server';

	type Recipe = inferRouterInputs<Router>['recipes']['create'];

	let recipe = {
		title: '',
		thumbnail: '',
		ingredients: [],
		quantities: [],
		directions: [],
		energy: 100 / 7 / 0.239006,
		fat: 100 / 7,
		saturatedFat: 100 / 7,
		protein: 100 / 7,
		salt: 100 / 7 / 0.38758,
		sugar: 100 / 7,
	} as Recipe;

	let tag = '';
	let ingredient = '';
	let direction = '';
</script>

<div class="grid place-items-center p-8">
	<div class="grid max-w-7xl navbar gap-16">
		<div class="w-full">
			<div class="prose max-w-full">
				<div
					class="bg-base-300 rounded-2xl aspect-video flex place-items-center justify-center"
				>
					{#if recipe.thumbnail}
						<img
							class="object-cover w-full h-full rounded-2xl mt-0"
							src={recipe.thumbnail}
							alt={recipe.title}
						/>
					{:else}
						hello
					{/if}
				</div>

				<div class="mb-2">
					<div class="flex flex-row flex-wrap gap-1 mt-7">
						{#each recipe.ingredients as ingredient}
							<div class="badge badge-lg badge-neutral line-clamp-1">
								{ingredient}
							</div>
						{/each}

						<form
							on:submit|preventDefault={() => {
								recipe.ingredients.push(tag);
								recipe = recipe;
								tag = '';
							}}
						>
							<input
								type="text"
								class="bg-transparent"
								placeholder="Add tag..."
								bind:value={tag}
							/>
						</form>
					</div>

					<input
						class="mt-4 bg-base-300 rounded-lg text-4xl font-extrabold p-2"
						placeholder="Add a title..."
						type="text"
						bind:value={recipe.title}
					/>
				</div>

				<NutritionFacts
					salt={recipe.salt}
					energy={recipe.energy}
					fat={recipe.fat}
					saturated={recipe.saturatedFat}
					sugar={recipe.sugar}
					protein={recipe.protein}
				/>

				<h2>Ingredients</h2>

				<ul>
					{#each recipe.quantities as ingredient}
						<li>{ingredient}</li>
					{/each}

					<form
						on:submit|preventDefault={() => {
							recipe.quantities.push(ingredient);
							recipe = recipe;
							ingredient = '';
						}}
					>
						<input
							type="text"
							placeholder="Add ingredient..."
							class="bg-base-200 rounded-lg p-3 text-xl"
							bind:value={ingredient}
						/>
					</form>
				</ul>

				<h2>Directions</h2>

				<ol>
					{#each recipe.directions as direction}
						<li>
							{direction}
						</li>
					{/each}

					<form
						on:submit|preventDefault={() => {
							recipe.directions.push(direction);
							recipe = recipe;
							direction = '';
						}}
					>
						<input
							type="text"
							placeholder="Add direction..."
							class="bg-base-200 rounded-lg p-3 text-xl"
							bind:value={direction}
						/>
					</form>
				</ol>
			</div>
		</div>
	</div>
</div>
