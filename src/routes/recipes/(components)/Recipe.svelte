<script lang="ts">
	import type { Recipe } from '$lib/server/schema';
	import { showOnLoad } from '$lib/util';
	import NutritionFacts from './NutritionFacts.svelte';

	export let recipe: Recipe | undefined = undefined;
</script>

<div class="w-full">
	<div class="prose max-w-full">
		{#if recipe}
			<div class="bg-base-300 rounded-2xl aspect-video">
				<img
					class="object-cover w-full h-full rounded-2xl mt-0"
					src={recipe.thumbnail}
					alt={recipe.title}
					use:showOnLoad
				/>
			</div>

			<div class="flex flex-row flex-wrap gap-1 mt-7">
				{#each recipe.ingredients as ingredient}
					<div class="badge badge-lg badge-neutral line-clamp-1">
						{ingredient}
					</div>
				{/each}
			</div>

			<h1 class="mt-4">{recipe.title}</h1>
			<h2>Ingredients</h2>

			<span class="flex flex-row flex-wrap">
				<ul>
					{#each recipe.quantities as ingredient}
						<li>{ingredient}</li>
					{/each}
				</ul>
				<span class="mx-auto">
					<NutritionFacts
						salt={recipe.salt}
						energy={recipe.energy}
						fat={recipe.fat}
						saturated={recipe.saturated_fat}
						sugar={recipe.sugar}
						protein={recipe.protein}
					/>
				</span>
			</span>

			<h2>Directions</h2>

			<ol>
				{#each recipe.directions as direction}
					<li>
						{direction}
					</li>
				{/each}
			</ol>
		{:else}
			<div class="w-full h-full aspect-video skeleton" />

			<div class="flex flex-row flex-wrap gap-1 mt-7">
				{#each { length: 5 } as _}
					<div
						class="badge badge-sm skeleton h-6"
						style="width: {Math.floor(Math.random() * 70 + 50)}px"
					/>
				{/each}
			</div>

			<div
				class="skeleton max-w-full h-12 mt-4"
				style="width: {Math.floor(Math.random() * 200 + 550)}px"
			/>

			<div class="skeleton max-w-full h-8 mt-10 w-96" />

			<div class="flex flex-col gap-2 mt-8">
				{#each { length: 5 } as _}
					<div
						class="h-6 skeleton"
						style="width: {Math.floor(Math.random() * 400 + 300)}px"
					/>
				{/each}
			</div>

			<div class="skeleton max-w-full h-8 mt-10 w-96" />

			<div class="flex flex-col gap-2 mt-8">
				{#each { length: 5 } as _}
					<div
						class="h-6 skeleton"
						style="width: {Math.floor(Math.random() * 400 + 300)}px"
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
