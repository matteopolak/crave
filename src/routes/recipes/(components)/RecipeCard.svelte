<script lang="ts">
	import type { PartialRecipe } from '$lib/server/schema';
	import { showOnLoad } from '$lib/util';

	export let recipe: PartialRecipe | undefined = undefined;
</script>

{#if recipe}
	<a
		class="h-full flex flex-col gap-1 w-full group"
		href="/recipes/{recipe.id}"
	>
		<div class="rounded-lg overflow-hidden aspect-video w-full bg-base-300">
			<img
				class="object-cover rounded-lg h-full w-full group-hover:scale-105 transition-all duration-300"
				src={recipe.thumbnail}
				alt={recipe.title}
				use:showOnLoad
			/>
		</div>

		<div class="flex flex-col w-full gap-1">
			<h1 class="line-clamp-1 font-bold">{recipe.title}</h1>

			<div class="flex flex-row flex-wrap gap-1 mt-2 overflow-hidden h-9">
				{#each recipe.ingredients.slice(0, 5) as ingredient}
					<div class="badge badge-sm bg-base-300 line-clamp-1">
						{ingredient}
					</div>
				{/each}
			</div>
		</div>
	</a>
{:else}
	<div class="h-full flex flex-col gap-1 w-full">
		<div class="rounded-lg aspect-video w-full skeleton" />

		<div class="flex flex-col w-full gap-1">
			<div
				class="skeleton max-w-full h-6"
				style="width: {Math.floor(Math.random() * 100 + 150)}px"
			/>

			<div class="flex flex-row flex-wrap gap-1 mt-2 overflow-hidden h-9">
				{#each { length: 5 } as _}
					<div
						class="badge badge-sm skeleton"
						style="width: {Math.floor(Math.random() * 30 + 50)}px"
					/>
				{/each}
			</div>
		</div>
	</div>
{/if}
