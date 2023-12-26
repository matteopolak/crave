<script lang="ts">
	import type { PartialRecipe } from '$lib/server/schema';
	import type { Size } from '$lib/types';
	import { showOnLoad } from '$lib/util';
	import RecipeCardInformation from './RecipeCardInformation.svelte';

	export let recipe: PartialRecipe | undefined = undefined;

	export let size: Size = '3xl';
	export let author = false;
	export let side = false;
</script>

{#if recipe}
	<a
		class="h-full gap-3 w-full group flex-col grid-cols-5 flex"
		class:md:grid={side}
		href="/recipes/{recipe.id}"
	>
		<div class="rounded-lg overflow-hidden aspect-video bg-base-300 col-span-2">
			<img
				class="object-cover h-full w-full group-hover:scale-105 transition-all duration-300"
				src={recipe.thumbnail}
				alt={recipe.title}
				use:showOnLoad
			/>
		</div>

		<div class="flex flex-row gap-2 w-full col-span-3">
			{#if author}
				<img
					src={recipe.author.thumbnail}
					class="rounded-full w-8 h-8"
					alt={recipe.author.name}
					use:showOnLoad
				/>
			{/if}

			<RecipeCardInformation {recipe} {size} />
		</div>
	</a>
{:else}
	<div
		class="h-full gap-3 w-full group flex-col grid-cols-5 flex"
		class:md:grid={side}
	>
		<div class="rounded-lg aspect-video skeleton h-full w-full col-span-2" />

		<div class="flex flex-row gap-2 w-full col-span-3">
			{#if author}
				<div class="skeleton rounded-full w-8 h-8" />
			{/if}

			<RecipeCardInformation {size} />
		</div>
	</div>
{/if}
